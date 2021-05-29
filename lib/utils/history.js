import _ from 'lodash';
import dateFormat from 'date-fns/format';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import isAfter from 'date-fns/is_after';
import isThisYear from 'date-fns/is_this_year';
import isToday from 'date-fns/is_today';
import isTomorrow from 'date-fns/is_tomorrow';
import isValidDate from 'date-fns/is_valid';
import isYesterday from 'date-fns/is_yesterday';
import { generateUserUri } from './users';

function updateUsersList(users, currentUser, updateTime) {
  const userIndex = _.findIndex(users, user => user.username === currentUser.username),
    user = _.assign({}, currentUser, { updateTime });

  if (userIndex === -1) { // the user hasn't updated the page before
    users.push(user);
  } else if (userIndex > -1) {
    /*
     * if the current user is in the list, but isn't at the end, we should move it to the end
     * (if it's already at the end, we just want to update the updateTime for the user)
     */

    users.splice(userIndex, 1); // remove user from list
    users.push(user); // and add it to the end
  }

  return users;
}

function updateHistory(history, currentUser, updateTime, action = 'edit') {
  let latest,
    userIndex;

  // If history is empty or the latest item is not an edit event, add a new edit event
  if (history.length === 0 || history[history.length - 1].action !== action) {
    history.push({
      action,
      timestamp: updateTime,
      users: [currentUser]
    });
  // latest item is an edit event, and but it doesn't contain this user, add the user to the event
  } else {
    latest = _.last(history);
    userIndex = _.findIndex(latest.users, user => user.username === currentUser.username);

    if (userIndex === -1) {
      latest.users.push(currentUser);
    } else if (userIndex > -1) {
      // if the current user is in the list, but isn't at the end, we should move it to the end
      latest.users.splice(userIndex, 1); // remove user from list
      latest.users.push(currentUser); // and add it to the end
    }
    latest.timestamp = updateTime;
  }

  return history;
}

/**
 * Updates the history state with the current users
 * @param {Object} itemState
 * @param {Object} currentUser
 * @param {string} action
 * @returns {Object}
 */
export function updateStateWithAction(itemState, currentUser, action) {
  const oldHistory = itemState.history ? _.cloneDeep(itemState.history) : [],
    oldUsers = itemState.users ? _.cloneDeep(itemState.users) : [],
    updateTime = new Date().toISOString(),
    currentUserWithoutAuthData = _.omit(_.assign({}, currentUser, { id: generateUserUri(currentUser) }), ['auth', 'imageUrl', 'name', 'password']),
    users = updateUsersList(oldUsers, currentUserWithoutAuthData, updateTime),
    history = updateHistory(oldHistory, currentUserWithoutAuthData, updateTime, action);

  return { updateTime, users, history };
}


/**
 * get the last user who edited a page, who ISN'T the current user
 * @param  {object} itemState
 * @param  {object} currentUser
 * @return {undefined|Object}
 */
export function getLastEditUser(itemState, currentUser) {
  const lastUser = _.findLast(itemState.users, (user) => {
    const isDifferentUser = user.username !== currentUser.username,
      isWithinFiveMinutes = Math.abs(differenceInMinutes(new Date(user.updateTime), new Date())) < 5;

    return isDifferentUser && isWithinFiveMinutes;
  });

  return lastUser;
}

export function hasPageChanges(state) {
  const pageState = state.page.state,
    pubTime = _.get(pageState, 'publishTime'), // latest published timestamp
    upTime = _.get(pageState, 'updateTime'), // latest updated timestamp
    mostRecentPageHistory = pageState.history[pageState.history.length - 1],
    lastHistoryAction = mostRecentPageHistory && mostRecentPageHistory.action ? mostRecentPageHistory.action : '';

  return pubTime && upTime && lastHistoryAction !== 'restore'
    ? isAfter(upTime, pubTime)
    : false;
}

/**
 * Formats the dates and users history of the page/layout
 * @param {Object} history
 * @param {Object[]} cacheUsers
 * @returns {Object}
 */
export function formatHistoryToDisplay(history, cacheUsers) {
  let formattedHistory = _.map(history, (event) => {
    event.formattedTime = formatStatusTime(event.timestamp);
    event.formattedAction = addEd(event.action);
    event.users = _.compact(_.map(event.users, user => _.find(cacheUsers, cacheUser => cacheUser.id === user.id)));

    event.avatar = event.users.length
      ? {
        name: event.users.slice(-1)[0].name || event.users.slice(-1)[0].username,
        imageUrl: event.users.slice(-1)[0].imageUrl,
        stacked: event.users.length > 1
      }
      : {};

    return event;
  }).reverse();

  // remove unschedule events created by the clay robot
  formattedHistory = formattedHistory.filter(event => !(event.action === 'unschedule' && _.find(event.users, user => user.username === 'robot' && user.provider === 'clay')));

  return formattedHistory;
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
    return distanceInWordsToNow(date, { includeSeconds: false, addSuffix: true });
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  if (isThisYear(date)) {
    return dateFormat(date, 'M/D');
  }

  return dateFormat(date, 'M/D/YY');
}

/**
 * Transforms a word into the past tense.
 * @param {string} word
 * @returns {string}
 */
function addEd(word) {
  if (!word.length) {
    return word;
  }

  if (word[word.length - 1] === 'e') {
    return `${word}d`;
  }

  return `${word}ed`;
}
