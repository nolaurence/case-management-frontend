import * as actionTypes from './actionTypes';

export default (state: any, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actionTypes.CHANGE_EDIT_MODE:
      return {
        ...state,
        isReadonly: action.payload.isReadonly,
      };
    case actionTypes.CHANGE_DARK_MODE:
      return {
        ...state,
        isDark: action.payload.isDark,
      };
    case actionTypes.SET_ACTIVE_SIDEBAR:
      return {
        ...state,
        activeSidebar: action.payload.activeSidebar,
      };
    case actionTypes.SET_SHOW_SHORTCUT_KEY_DRAWER:
      return {
        ...state,
        showShortcutKeyDrawer: action.payload.showShortcutKeyDrawer,
      };
    default:
      return state;
  }
};
