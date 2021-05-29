<style lang="sass">
  @import '../../styleguide/colors';

  .layout-history-list {
    padding: 0;

    .layout-history-event {
      align-items: flex-start;
      display: flex;
      flex-direction: row;
      font-family: $font-stack;
      margin: 12px 16px;

      .person-image {
        &.stacked {
          box-shadow: $shadow-2dp, 0 10px $text-alt-color;
        }
      }
      &-info {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
      }


      &-action,
      &-time {
        font-size: 12px;

      }

      &-action {
        color: $text-color;
        font-weight: bold;
        text-transform: uppercase;

        &-published {
          color: $published;
        }

        &-scheduled {
          color: $scheduled;
        }

        &-archived,
        &-unarchived,
        &-unpublished,
        &-unscheduled {
          color: $archived;
        }

        &-edited {
          +.layout-history-event-time {
            display: none;
          }
        }
      }

      &-users {
        font-size: 11px;
      }
    }

    .layout-history-event-time {
      color: $text-alt-color;
    }

    .layout-history-event-users {
      color: $text-color;

      p {
        margin: 0;
      }
    }
  }
</style>

<template>
  <div class="layout-history-list">
    <div
      class="layout-history-event"
      v-for="event of history"
      :key="event.timestamp"
    >
      <avatar
        class="person-image"
        :class="{'stacked': event.avatar.stacked}"
        :url="event.avatar.imageUrl"
        :name="event.avatar.name"
        @click.stop="onClick">
      </avatar>
      <div class = "layout-history-event-info">
        <div
          class="layout-history-event-action"
          :class="['layout-history-event-action-'+event.formattedAction]"
        >{{event.formattedAction}}</div>
        <div class="layout-history-event-time">{{event.formattedTime}}</div>
        <div class="layout-history-event-users">
          <p v-for="(user, index) in event.users.reverse()">
            <span v-if="index === 0">By </span>{{user.name || user.username}}<span v-if="index+1 < event.users.length">, <br/></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import avatar from '../utils/avatar.vue';
  import UiButton from 'keen/UiButton';
  import store from '../core-data/store';
  import { getUsersData } from '../utils/users';
  import { formatHistoryToDisplay } from '../utils/history';

  export default {
    data() {
      return {};
    },
    computed: {
      history() {
        const pageHistory = _.cloneDeep(_.get(this.$store, 'state.page.state.history', [])),
          cacheUsers = _.get(this.$store, 'state.users'),
          formattedHistory = formatHistoryToDisplay(pageHistory, cacheUsers);

        return formattedHistory;
      }
    },
    mounted() {
      const usersIds = _.uniq(_.flatMap(_.map(_.get(this.$store, 'state.page.state.history'), history => _.map(history.users, user => user.id))));

      return getUsersData(usersIds)
        .then(usersData => {
          this.$store.dispatch('saveUsers', usersData);

          store.dispatch('fetchLayoutState');
        });
    },
    components: {
      UiButton,
      avatar
    }
  };
</script>
