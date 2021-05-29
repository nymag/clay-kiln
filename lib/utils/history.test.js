import subMinutes from 'date-fns/sub_minutes';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import * as lib from './history';

describe('history', () => {
  describe('updateStateWithAction', () => {
    const fn = lib.updateStateWithAction,
      currentUser = { username: 'a@b', id: 'YUBiQHVuZGVmaW5lZA==' };

    test('will create a history array if one does not exist', () => {
      const state = {};

      expect(Array.isArray(fn(state, currentUser).history)).toBe(true);
    });

    test(
      'will add a new edit event if the latest event is not an edit event',
      () => {
        const state = { history: [{ action: 'create' }] },
          result = fn(state, currentUser);

        expect(result.history[result.history.length - 1].action).toBe('edit');
      }
    );

    test(
      'will add the user to the latest event if that event is an edit event',
      () => {
        const state = { history: [{ action: 'edit', users: [{ username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==' }] }] },
          result = fn(state, currentUser);

        expect(result.history[result.history.length - 1].users).toEqual([{ username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==' }, { username: 'a@b', id: 'YUBiQHVuZGVmaW5lZA==' }]);
      }
    );

    test(
      'will move the user to be the latest the user is already included',
      () => {
        const state = { history: [{ action: 'edit', users: [{ username: 'a@b', id: 'YUBiQHVuZGVmaW5lZA==' }, { username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==' }] }] },
          result = fn(state, currentUser);

        expect(result.history[result.history.length - 1].users).toEqual([{ username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==' }, { username: 'a@b', id: 'YUBiQHVuZGVmaW5lZA==' }]);
      }
    );

    test('will create a users array if one does not exist', () => {
      const state = {};

      expect(Array.isArray(fn(state, currentUser).users)).toBe(true);
    });

    test('will add a user to the users array if it isn\'t already included', () => {
      const state = { users: [{ username: 'user' }] },
        result = fn(state, currentUser);

      expect(result.users.length).toBe(2);
    });

    test('will move the user to the end of the array and reset the updateTime if it already exists in the list', () => {
      const oldUpdateTime = subMinutes(new Date(), 2).toISOString(),
        state = { users: [{ username: 'a@b', id: 'YUBiQHVuZGVmaW5lZA==', updateTime: oldUpdateTime }, { username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==' }] },
        result = fn(state, currentUser);

      expect(result.users[result.users.length - 1].username).toBe('a@b');
      expect(differenceInMinutes(result.users[result.users.length - 1].updateTime, oldUpdateTime)).toBeGreaterThanOrEqual(2);
    });

    test('will set the updateTime timestamp', () => {
      const state = {},
        startTime = new Date().getTime(),
        result = fn(state, currentUser);

      expect(new Date(result.updateTime).getTime()).toBeGreaterThanOrEqual(startTime);
    });
  });

  describe('getLastEditUser', () => {
    const fn = lib.getLastEditUser,
      currentUser = { username: 'a@b' };

    test('returns the last editing user if called less than 5 mins after last update time during a different user\'s session', () => {
      const state = { users: [{ username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==', updateTime: subMinutes(new Date(), 2) }] };

      expect(fn(state, currentUser).username).toBe('c@d');
    });

    test('returns undefined if called more than 5 minutes after the last edit', () => {
      const state = { users: [{ username: 'c@d', id: 'Y0BkQHVuZGVmaW5lZA==', updateTime: subMinutes(new Date(), 6) }] };

      expect(fn(state, currentUser)).toBeUndefined();
    });

    test('returns undefined if the current editing user is the same as the last editing user', () => {
      const state = { users: [{ username: 'a@b', id: 'YUBiQHVuZGVmaW5lZA==', updateTime: subMinutes(new Date(), 2) }] };

      expect(fn(state, currentUser)).toBeUndefined();
    });
  });
});
