<style lang="sass">
  @import '../../styleguide/colors';
  @import '../../styleguide/typography';
  @import '../../styleguide/clay-menu-columns';

  .page-list-item {
    align-items: center;
    border-bottom: 1px solid $divider-color;
    display: flex;
    flex: 1 0 auto;
    max-height: 100px;
    min-height: 48px;
    padding: 0 16px;

    @media screen and (min-width: $site-title-byline-status-columns-sidebar) {
      flex: 0 0 48px;
    }

    &-site {
      @include type-button();

      cursor: pointer;
      display: none;
      flex: 0 0 $site-column;
      overflow: hidden;
      padding-right: 16px;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;

      @media screen and (min-width: $site-title-byline-status-columns-sidebar) {
        display: block;
      }
    }

    &-title {
      @include type-body();

      display: block;
      flex: 1 1 $title-column;
      min-width: 0;
      padding: 16px 16px 16px 0;

      &-inner {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      .no-title {
        color: $text-alt-color;
        font-style: italic;
      }

      .page-list-item-site-small {
        @include type-button();

        display: block;
        text-transform: uppercase;
        width: 100%;

        @media screen and (min-width: $site-title-byline-status-columns-sidebar) {
          display: none;
        }
      }

      .page-list-item-byline-small {
        @include type-caption();

        display: block;
        width: 100%;

        &.no-byline {
          color: $text-alt-color;
          font-style: italic;
        }

        @media screen and (min-width: $site-title-byline-status-columns-sidebar) {
          display: none;
        }
      }
    }

    &-byline {
      @include type-body();

      cursor: pointer;
      display: none;
      flex: 0 0 $byline-column;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.no-byline {
        color: $text-alt-color;
        cursor: normal;
      }

      @media screen and (min-width: $site-title-byline-status-columns-sidebar) {
        display: inline;
      }

      @media screen and (min-width: $all-columns-sidebar) {
        padding-right: 16px;
      }
    }

    &-status {
      align-items: flex-end;
      cursor: pointer;
      display: flex;
      flex: 0 0 $status-column;
      flex-direction: column;
      min-width: 0;
      padding: 16px 0;

      @media screen and (min-width: $all-columns-sidebar) {
        align-items: flex-start;
      }

      .status-message {
        @include type-caption();

        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;

        &.scheduled {
          color: $scheduled;
        }

        &.published {
          color: $published;
        }

        &.archived {
          color: $md-red;
        }
      }

      .status-time {
        @include type-caption();

        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }
    }

    &-collaborators {
      display: none;
      flex: 0 0 $collaborators-column;

      @media screen and (min-width: $all-columns-sidebar) {
        display: flex;
      }
    }

    &-collaborator {
      cursor: pointer;
    }
  }
</style>

<template>
  <div class="page-list-item">
    <div v-if="multipleSitesSelected" class="page-list-item-site" @click.stop="filterSite">{{ siteName }}</div>
    <a class="page-list-item-title" :href="url" target="_blank" @click="onUrlClick">
      <span v-if="multipleSitesSelected" class="page-list-item-site-small">{{ siteName }}</span>
      <span class="page-list-item-title-inner" :class="{ 'no-title': !page.title }">{{ title }}</span>
      <span class="page-list-item-byline-small" :class="{ 'no-byline': !page.authors.length }">{{ firstAuthor }}</span>
    </a>
    <div class="page-list-item-byline" :class="{ 'no-byline': !page.authors.length }" @click.stop="filterAuthor">{{ firstAuthor }}</div>
    <div class="page-list-item-status" @click.stop="filterStatus">
      <span class="status-message" :class="status">{{ statusMessage }}</span>
      <span v-if="statusTime" class="status-time">{{ statusTime }}</span>
    </div>
    <div class="page-list-item-collaborators">
      <collaborator class="page-list-item-collaborator" v-for="user in users" :user="user" :key="user.username" @select="filterUser"></collaborator>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import isValidDate from 'date-fns/is_valid';
  import dateFormat from 'date-fns/format';
  import isToday from 'date-fns/is_today';
  import isTomorrow from 'date-fns/is_tomorrow';
  import isYesterday from 'date-fns/is_yesterday';
  import isThisYear from 'date-fns/is_this_year';
  import { htmlExt } from '../utils/references';
  import { uriToUrl } from '../utils/urls';
  import collaborator from './collaborator.vue';

  /**
   * format hour and minute
   * @param  {Date} date
   * @return {string}
   */
  function formatHM(date) {
    return ' ' + dateFormat(date, 'h:mm A');
  }

  /**
   * format time for pages
   * @param  {Date} date
   * @return {string}
   */
  function formatStatusTime(date) {
    date = date ? new Date(date) : null;

    if (!date || !isValidDate(date)) {
      return null;
    }

    if (isToday(date)) {
      return 'Today' + formatHM(date);
    } else if (isTomorrow(date)) {
      return 'Tomorrow' + formatHM(date);
    } else if (isYesterday(date)) {
      return 'Yesterday' + formatHM(date);
    } else if (isThisYear(date)) {
      return dateFormat(date, 'M/D') + formatHM(date);
    } else {
      return dateFormat(date, 'M/D/YY') + formatHM(date);
    }
  }

  /**
   * generate a page url to link to, based on site configs
   * @param  {object} page
   * @param  {object} sites
   * @return {string}
   */
  function generatePageUrl(page, sites) {
    const site = sites[page.siteSlug];

    return uriToUrl(page.uri, {
      protocol: 'http:', // note: assumes http (until we have protocol in site configs)
      port: site.port.toString(),
      hostname: site.host,
      host: site.host
    }) + htmlExt;
  }

  export default {
    props: ['page', 'multipleSitesSelected', 'isPopoverOpen'],
    computed: {
      url() {
        return this.page.url || generatePageUrl(this.page, _.get(this.$store, 'state.allSites'));
      },
      firstAuthor() {
        return this.page.authors.length ? _.head(this.page.authors) : 'No Byline';
      },
      pageStatus() {
        if (this.page.archived) {
          return {
            status: 'archived',
            statusMessage: 'Archived',
            statusTime: formatStatusTime(this.page.updateTime)
          };
        } else if (this.page.scheduled) {
          return {
            status: 'scheduled',
            statusMessage: 'Scheduled',
            statusTime: formatStatusTime(this.page.scheduledTime)
          };
        } else if (this.page.published) {
          return {
            status: 'published',
            statusMessage: 'Published',
            statusTime: formatStatusTime(this.page.publishTime)
          };
        } else {
          return {
            status: 'draft',
            statusMessage: 'Draft'
          };
        }
      },
      status() {
        return this.pageStatus.status;
      },
      statusMessage() {
        return this.pageStatus.statusMessage;
      },
      statusTime() {
        return this.pageStatus.statusTime;
      },
      site() {
        return _.find(_.get(this.$store, 'state.allSites'), site => site.slug === this.page.siteSlug);
      },
      siteName() {
        return this.site && this.site.name;
      },
      title() {
        return this.page.title ? _.truncate(this.page.title, { length: 75 }) : 'No Title';
      },
      users() {
        const pageUsersData = _.flatMap(this.page.users, user => _.filter(_.get(this.$store, 'state.users'), cacheUser => cacheUser.id === user.id));

        return _.take(pageUsersData, 4);
      }
    },
    methods: {
      onUrlClick(e) {
        if (this.isPopoverOpen) {
          // don't navigate links if the site select or status select popover menus are open
          e.preventDefault();
        }
      },
      // click items in the list to filter by that thing
      filterSite() {
        this.$emit('setSite', this.site.slug);
      },
      filterAuthor() {
        this.$emit('setQuery', this.firstAuthor);
      },
      filterStatus() {
        this.$emit('setStatus', this.status);
      },
      filterUser(username) {
        this.$emit('setQuery', `user:${username}`);
      }
    },
    components: {
      collaborator
    }
  };
</script>
