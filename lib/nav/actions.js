import { SHOW_NAV_BACKGROUND, HIDE_NAV_BACKGROUND, SAVE_USERS } from './mutationTypes';

/**
 * @module nav
 */

/**
 * open nav tab
 * @param  {object} store
 * @param  {string|object} nameOrConfig tab name, or clay menu config
 * openNav sets the ui.currentDrawer vuex variable, this allows drawers (the right slide-in menus)
 * as well as the "nav" (the left slide-in menu) to be deep linked to.
 *
 * The openNav/closeNav are functions are depreciated.
 * Should use the openDrawer/closeDrawer/toggleDrawer actions
 * Just leaving these here in case any legacy plugins are still calling these functions
 */
export function openNav(store, nameOrConfig) {
  store.dispatch('openDrawer', nameOrConfig);
}

export function closeNav(store) {
  store.dispatch('closeDrawer');
}

export function hideNavBackground(store) {
  store.commit(HIDE_NAV_BACKGROUND);
}

export function showNavBackground(store) {
  store.commit(SHOW_NAV_BACKGROUND);
}

export function saveUsers(store, users) {
  store.commit(SAVE_USERS, users);
}
