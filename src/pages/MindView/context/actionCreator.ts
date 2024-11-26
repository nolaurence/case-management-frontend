import * as actionTypes from './actionTypes';

export const changeEditMode = (isReadonly: boolean) => ({
  type: actionTypes.CHANGE_EDIT_MODE,
  payload: {
    isReadonly: isReadonly,
  },
});

export const changeDarkMode = (isDark: boolean) => ({
  type: actionTypes.CHANGE_DARK_MODE,
  payload: {
    isDark: isDark,
  },
});

export const setActiveSidebar = (activeSidebar: string) => ({
  type: actionTypes.SET_ACTIVE_SIDEBAR,
  payload: {
    activeSidebar: activeSidebar,
  },
});

export const changeShowShortcutKeyDrawer = (showShortcutKeyDrawer: boolean) => ({
  type: actionTypes.SET_SHOW_SHORTCUT_KEY_DRAWER,
  payload: {
    showShortcutKeyDrawer: showShortcutKeyDrawer,
  },
});
