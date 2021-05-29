<style lang="sass">
  @import '../../styleguide/colors';

  .contributors-list {
    height: 100%;
    padding: 0;

    .person-item {
      padding: 12px 16px;
    }

    .add-contributor-wrapper {
      border-top: 1px solid $divider-color;
      padding: 16px;

      .add-contributor-button {
        width: 100%;
      }
    }
  }
</style>

<template>
  <div class="contributors-list">
    <person
      v-for="contributor in contributors"
      :key="contributor.username"
      :id="contributor.username"
      :image="contributor.imageUrl"
      :name="contributor.name || contributor.username"
      :subtitle="contributor.formattedTime"></person>
    <div class="add-contributor-wrapper">
      <ui-button class="add-contributor-button" buttonType="button" type="primary" color="default" @click.stop="addContributor">Invite To Page</ui-button>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import isValidDate from 'date-fns/is_valid';
  import dateFormat from 'date-fns/format';
  import isToday from 'date-fns/is_today';
  import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
  import isTomorrow from 'date-fns/is_tomorrow';
  import isYesterday from 'date-fns/is_yesterday';
  import isThisYear from 'date-fns/is_this_year';
  import person from '../utils/person.vue';
  import { getUsersData } from '../utils/users';
  import UiButton from 'keen/UiButton';

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
      return distanceInWordsToNow(date, { includeSeconds: false, addSuffix: true });
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisYear(date)) {
      return dateFormat(date, 'M/D');
    } else {
      return dateFormat(date, 'M/D/YY');
    }
  }

  export default {
    data() {
      return {};
    },
    computed: {
      contributors() {
        return this.users.map(user => {
          user.formattedTime = formatStatusTime(user.updateTime);

          return user;
        }).reverse();
      }
    },
    data() {
      return {
        users: []
      };
    },
    mounted() {
      const usersIds = _.uniq(_.map(_.cloneDeep(_.get(this.$store, 'state.page.state.users')), user => user.id));

      return getUsersData(usersIds)
        .then(usersData => {
          this.users = usersData;
        });
    },
    methods: {
      addContributor() {
        return this.$store.dispatch('openModal', {
          title: 'Invite To Page',
          type: 'add-contributor'
        });
      }
    },
    components: {
      person,
      UiButton
    }
  };
</script>
