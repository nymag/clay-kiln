import _get from 'lodash/get';
import store from '../core-data/store';
import { postJSON, getJSON } from '../core-data/api';
import { searchRoute, usersRoute } from './references';

/**
 * Makes a query to get the users full data object from Elastic
 * @param {string[]} usersIds to stub for testing
 * @returns {Promise<Object[]>}
 */
function getUsersData(usersIds) {
  const prefix = _get(store, 'state.site.prefix'),
    usersQuery = {
      index: 'users',
      body: {
        size: usersIds.length,
        query: {
          ids: {
            type: '_doc',
            values: usersIds
          }
        }
      }
    };

  return postJSON(prefix + searchRoute, usersQuery)
    .then((response) => {
      const usersDocs = _get(response, 'hits.hits') || [],
        usersData = usersDocs.map((userDoc) => {
          const id = generateUserUri(userDoc._source);

          return { id, ...userDoc._source };
        });

      return usersData;
    });
}

/**
 * GETs the data for a single user from `_users`
 * @param {string} userId
 * @returns {Object}
 */
function getSingleUser(userId) {
  const prefix = _get(store, 'state.site.prefix'),
    protocol = _get(store, 'state.site.protocol');

  return getJSON(`${protocol}://${prefix}${usersRoute}${userId}`);
}

/**
 * Generates the user URI based on the username and provider.
 * @param {Object} userObject
 * @returns {string}
 */
function generateUserUri(userObject) {
  return btoa(`${userObject.username}@${userObject.provider}`);
}

/**
 * Decodes a user uri into username and provider
 * @param {string} userUri
 * @returns {Object}
 */
function decodeUserUri(userUri) {
  const [username, domain, provider] = atob(userUri).split('@');

  return {
    username: `${username}@${domain}`,
    provider
  };
}

export {
  getUsersData,
  getSingleUser,
  generateUserUri,
  decodeUserUri
};
