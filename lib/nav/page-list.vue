<template>
  <div class="page-list">
    <div class="page-list-controls">
      <ui-button buttonType="button" class="page-list-sites" type="secondary" color="default" has-dropdown ref="sitesDropdown" @dropdown-open="onPopoverOpen" @dropdown-close="onPopoverClose">
        <span class="page-list-selected-site">{{ selectedSite }}</span>
        <site-selector slot="dropdown" :sites="sites" @select="selectSite" @multi-select="selectMultipleSites"></site-selector>
      </ui-button>
      <ui-textbox class="page-list-search" v-model.trim="query" type="search" autofocus placeholder="Search by Title or Byline" @input="filterList"></ui-textbox>
      <ui-icon-button class="page-list-status-small" type="secondary" icon="filter_list" has-dropdown ref="statusDropdown" @dropdown-open="onPopoverOpen" @dropdown-close="onPopoverClose">
        <status-selector slot="dropdown" :selectedStatus="selectedStatus" :vertical="true" @select="selectStatus"></status-selector>
      </ui-icon-button>
      <status-selector class="page-list-status-large" :selectedStatus="selectedStatus" @select="selectStatus"></status-selector>
    </div>
    <div class="page-list-headers">
      <span v-if="multipleSitesSelected" class="page-list-header page-list-header-site">Site</span>
      <span class="page-list-header page-list-header-title">Title</span>
      <span class="page-list-header page-list-header-byline">Byline</span>
      <span class="page-list-header page-list-header-status">Status</span>
      <span class="page-list-header page-list-header-collaborators">Collaborators</span>
    </div>
    <div class="page-list-readout">
      <page-list-item
        v-for="(page, pageIndex) in pages"
        :key="pageIndex"
        :page="page"
        :multipleSitesSelected="multipleSitesSelected"
        :isPopoverOpen="isPopoverOpen"
        @setSite="setSingleSite"
        @setQuery="setQuery"
        @setStatus="selectStatus"></page-list-item>
      <div class="page-list-load-more" v-if="showLoadMore">
        <ui-button type="secondary" class="page-list-load-more-button" @click="fetchPages">Load More</ui-button>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { postJSON } from '../core-data/api';
  import { searchRoute } from '../utils/references';
  import UiButton from 'keen/UiButton';
  import UiTextbox from 'keen/UiTextbox';
  import UiIconButton from 'keen/UiIconButton';
  import siteSelector from './site-selector.vue';
  import statusSelector from './status-selector.vue';
  import pageListItem from './page-list-item.vue';
  import { getUsersData } from '../utils/users';

  const DEFAULT_QUERY_SIZE = 50;

  /**
   * get data for all sites, and format it into something we can use
   * @return {array}
   */
  function getInitialSites() {
    const configSites = _.get(this.$store, 'state.url.sites'),
      selectedSites = configSites ? configSites.split(',') : [],
      currentSlug = _.get(this.$store, 'state.site.subsiteSlug') || _.get(this.$store, 'state.site.slug');

    // make an array of all sites, sorted by slug
    return _.sortBy(_.map(_.get(this.$store, 'state.allSites'), (site) => {
      const siteSlug = site.subsiteSlug || site.slug;

      return {
        slug: site.slug,
        subsiteSlug: site.subsiteSlug,
        name: site.name,
        selected: selectedSites.length ? _.includes(selectedSites, siteSlug) : siteSlug === currentSlug
      };
    }), 'name');
  }

  /**
   * build the query to send to elastic
   * @param  {array} siteFilter
   * @param  {string} queryText
   * @param  {string} queryUser
   * @param {number} offset
   * @param {object} statusFilter
   * @param {boolean} isMyPages
   * @param {string} username
   * @return {object}
   */
  function buildQuery({ siteFilter, queryText, queryUser, offset, statusFilter, isMyPages, username, subsiteFilter }) { // eslint-disable-line
    let query = {
      index: 'pages',
      body: {
        size: DEFAULT_QUERY_SIZE,
        from: offset,
        sort: {
          updateTime: {
            order: 'desc'
          }
        },
        query: {}
      }
    };

    _.set(query, 'body.query.bool.must', []);

    // filter for only "My Pages", and filter users
    if (isMyPages && queryUser) {
      query.body.query.bool.must.push({
        nested: {
          path: 'users',
          query: {
            terms: {
              'users.username': [username, queryUser]
            }
          }
        }
      });
    } else if (isMyPages) {
      query.body.query.bool.must.push({
        nested: {
          path: 'users',
          query: {
            term: {
              'users.username': username
            }
          }
        }
      });
    } else if (queryUser) {
      query.body.query.bool.must.push({
        nested: {
          path: 'users',
          query: {
            term: {
              'users.username': queryUser
            }
          }
        }
      });
    }

    // filter by selected sites with subsite support
    const siteFilterShould = {
      bool: {
        should: []
      }
    };

    if (siteFilter.length) {
      siteFilterShould.bool.should.push({
        terms: {
          siteSlug: siteFilter
        }
      });
    } else {
      siteFilterShould.bool.should.push({
        terms: {
          siteSlug: ['no-site-selected']
        }
      });
    }

    if (subsiteFilter.length) {
      siteFilterShould.bool.should.push({
        terms: {
          subsiteSlug: subsiteFilter
        }
      });
    } else {
      // slug is shared between parent and subsites. if parent is selected, we don't want to bring subsite pages back
      query.body.query.bool.must_not = {
        exists: {
          field: 'subsiteSlug'
        }
      };
    }

    query.body.query.bool.must.push(siteFilterShould);

    // filter by search string
    if (queryText) {
      query.body.query.bool.must.push({
        multi_match: {
          query: queryText,
          fields: ['authors^2', 'title'], // favor authors, then title
          type: 'phrase_prefix'
        }
      });
    }

    // filter by selected status
    // when the 'all' status is selected, it allows draft, published, and scheduled pages
    // (but NOT archived)
    if (statusFilter === 'all') {
      query.body.query.bool.must.push({
        term: { archived: false }
      });
    } else if (statusFilter === 'draft') {
      query.body.query.bool.must.push({
        term: { published: false }
      }, {
        term: { archived: false } // only drafts can be archived, but we need to explicitly NOT include archived pages when looking at drafts in the list
      });

      query.body.query.bool.should = [];
      // look for either explicitly not scheduled pages or pages where scheduled is not set at all
      query.body.query.bool.should.push({
        term: { scheduled: false }
      });
      query.body.query.bool.should.push({
        bool: {
          must_not: {
            exists: {
              field: 'scheduled'
            }
          }
        }
      });
      query.body.query.bool.minimum_should_match = 1;
    } else if (statusFilter === 'published') {
      query.body.query.bool.must.push({
        term: { published: true }
      });
      // also sort by last published timestamp
      query.body.sort = {
        publishTime: { order: 'desc' }
      };
    } else if (statusFilter === 'scheduled') {
      query.body.query.bool.must.push({
        term: { scheduled: true }
      });
      // also sort by last scheduled time
      query.body.sort = {
        scheduledTime: { order: 'desc' }
      };
    } else if (statusFilter === 'archived') {
      query.body.query.bool.must.push({
        term: { archived: true }
      });
    }

    return query;
  }

  export default {
    props: ['isMyPages'],
    data() {
      return {
        query: _.get(this.$store, 'state.url.query', ''),
        offset: 0,
        total: null,
        sites: getInitialSites.call(this),
        pages: [],
        selectedStatus: _.get(this.$store, 'state.url.status', 'all'),
        isPopoverOpen: false
      };
    },
    computed: {
      selectedSites() {
        return _.filter(this.sites, 'selected');
      },
      multipleSitesSelected() {
        return this.selectedSites.length > 1;
      },
      selectedSite() {
        if (this.multipleSitesSelected) {
          return 'Multiple';
        } else if (this.selectedSites.length === 1) {
          return _.head(this.selectedSites).name;
        } else {
          return 'No Site Selected';
        }
      },
      showLoadMore() {
        return this.total === null || this.offset < this.total;
      },
      queryText() {
        return this.query.replace(/user:\S+/i, '').trim();
      },
      queryUser() {
        const user = this.query.match(/user:(\S+)/i);

        return user ? user[1] : '';
      }
    },
    methods: {
      onPopoverOpen() {
        this.isPopoverOpen = true;
      },
      onPopoverClose() {
        this.isPopoverOpen = false;
      },
      compareSite(site, slug) {
        return site.subsiteSlug === slug || site.slug === slug;
      },
      selectSite(slug) {
        const site = _.find(this.sites, s => this.compareSite(s, slug));

        site.selected = !site.selected;
        this.$store.commit('FILTER_PAGELIST_SITE', _.map(this.selectedSites, site => site.subsiteSlug || site.slug).join(', '));
        this.offset = 0;
        this.fetchPages();
      },
      selectMultipleSites(allSites) {
        this.sites = _.map(this.sites, (site) => {
          site.selected = allSites;

          return site;
        });
      },
      setSingleSite(slug) {
        // loop through all sites, making sure that only one is selected
        _.each(this.sites, (site) => {
          if (this.compareSite(site, slug)) {
            site.selected = true;
          } else {
            site.selected = false;
          }
        });

        this.$store.commit('FILTER_PAGELIST_SITE', _.map(this.selectedSites, site => site.subsiteSlug || site.slug).join(', '));
        this.offset = 0;
        this.fetchPages();
      },
      filterList: _.debounce(function () {
        this.$store.commit('FILTER_PAGELIST_SEARCH', this.query);
        this.offset = 0;
        this.fetchPages();
      }, 300),
      selectStatus(status) {
        this.selectedStatus = status;

        this.$store.commit('FILTER_PAGELIST_STATUS', this.selectedStatus);
        this.offset = 0;
        this.fetchPages();
      },
      setQuery(query) {
        this.query = query;
        this.offset = 0;
        this.fetchPages();
      },
      fetchPages() {
        const siteFilter = _.map(_.filter(this.selectedSites, site => !site.subsiteSlug), site => site.slug),
          subsiteFilter = _.map(_.filter(this.selectedSites, site => site.subsiteSlug), site => site.subsiteSlug),
          queryText = this.queryText,
          queryUser = this.queryUser,
          offset = this.offset,
          prefix = _.get(this.$store, 'state.site.prefix'),
          isMyPages = this.isMyPages,
          username = _.get(this.$store, 'state.user.username'),
          statusFilter = this.selectedStatus,
          query = buildQuery({
            siteFilter, queryText, queryUser, offset, statusFilter, isMyPages, username, subsiteFilter
          });

        return postJSON(prefix + searchRoute, query).then((res) => {
          const hits = _.get(res, 'hits.hits') || [],
            total = _.get(res, 'hits.total'),
            pages = _.map(hits, hit => ({ ...hit._source, uri: hit._id })),
            usersIds = _.uniq(_.map(_.flatMap(pages, page => page.users), getUserId));

          return getUsersData(usersIds)
            .then(usersData => {
              this.$store.dispatch('saveUsers', usersData);

              this.pages = offset === 0 ? pages : this.pages.concat(pages);
              this.offset = offset + pages.length;
              this.total = total; // update the total for this particular query
              // (it's used to hide the "load more" button)

              // set the url hash
              if (_.get(this.$store, 'state.ui.currentDrawer')) {
                this.$store.dispatch('setHash', {
                  menu: {
                    tab: isMyPages ? 'my-pages' : 'all-pages',
                    sites: siteFilter.join(','),
                    status: statusFilter,
                    query: this.query
                  }
                });
              }
            });
        }).catch(console.error);
      },
      getUserId({ id = '', username, provider }) {
        return id || btoa(`${username}@${provider}`);
      }
    },
    mounted() {
      this.fetchPages();
    },
    activated() {
      this.offset = 0;
      this.fetchPages();
    },
    components: {
      UiButton,
      UiTextbox,
      UiIconButton,
      'site-selector': siteSelector,
      'status-selector': statusSelector,
      'page-list-item': pageListItem
    }
  };
</script>

<style lang="sass">
  @import '../../styleguide/colors';
  @import '../../styleguide/typography';
  @import '../../styleguide/clay-menu-columns';

  .page-list {
    display: flex;
    flex-direction: column;
    width: 100%;

    // note: left nav menu appears at 600px (it's 200px wide),
    // so all other breakpoints go from 800px
    @media screen and (min-width: $site-title-status-columns) {
      max-width: calc(100vw - 200px);
    }

    @media screen and (min-width: $all-columns-sidebar) {
      max-width: $all-columns;
    }
  }

  .page-list-controls {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    padding: 8px;
    width: 100%;

    @media screen and (min-width: $site-title-status-columns-sidebar) {
      padding: 16px 16px 16px 8px;
    }
  }

  .page-list-sites {
    flex: 0 0 auto;
    margin-right: 8px;
    max-width: 140px;

    @media screen and (min-width: $site-title-status-columns-sidebar) {
      max-width: 300px;
    }
  }

  .page-list-search {
    flex: 0 1 100%;
  }

  .page-list-status-small {
    display: inline-flex;
    flex: 0 0 auto;
    margin-left: 8px;

    @media screen and (min-width: $all-columns-sidebar) {
      display: none;
    }
  }

  .status-selector.page-list-status-large {
    display: none;
    flex: 0 0 auto;
    margin-left: 8px;

    .status-selector-radio:first-child {
      margin-left: 0;
    }

    @media screen and (min-width: $all-columns-sidebar) {
      display: flex;
    }
  }

  .page-list-headers {
    @include type-list-header();

    align-items: center;
    background-color: $md-grey-50;
    border-top: 1px solid $divider-color;
    display: none;
    flex: 0 0 auto;
    padding: 8px 16px;

    @media screen and (min-width: $site-title-status-columns-sidebar) {
      display: flex;
    }

    .page-list-header {
      &-site {
        flex: 0 0 $site-column;
      }

      &-title {
        flex: 1 1 $title-column;
      }

      &-byline {
        display: none;
        flex: 0 0 $byline-column;

        @media screen and (min-width: $site-title-byline-status-columns-sidebar) {
          display: inline;
        }
      }

      &-status {
        flex: 0 0 $status-column;
        text-align: right;

        @media screen and (min-width: $all-columns-sidebar) {
          text-align: left;
        }
      }

      &-collaborators {
        display: none;
        flex: 0 0 $collaborators-column;

        @media screen and (min-width: $all-columns-sidebar) {
          display: inline;
        }
      }
    }
  }

  .page-list-readout {
    display: flex;
    flex: 0 1 100%;
    flex-direction: column;
    overflow-y: scroll;

    .page-list-load-more {
      border-top: 1px solid $divider-color;
      display: flex;
      flex: 0 0 auto;
      justify-content: center;
      padding: 16px;
    }
  }
</style>
