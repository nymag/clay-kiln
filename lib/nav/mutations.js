import _set from 'lodash/set';
import {
  CHANGE_FAVORITE_PAGE_CATEGORY,
  SHOW_NAV_BACKGROUND,
  HIDE_NAV_BACKGROUND,
  SAVE_USERS
} from './mutationTypes';

const mutations = {
  [CHANGE_FAVORITE_PAGE_CATEGORY]: (state, id) => {
    _set(state, 'ui.favoritePageCategory', id);

    return state;
  },
  [SHOW_NAV_BACKGROUND]: (state) => {
    _set(state, 'ui.showNavBackground', true);

    return state;
  },
  [HIDE_NAV_BACKGROUND]: (state) => {
    _set(state, 'ui.showNavBackground', false);

    return state;
  },
  [SAVE_USERS]: (state, users) => {
    _set(state, 'users', users);

    return state;
  }
};

export default mutations;
