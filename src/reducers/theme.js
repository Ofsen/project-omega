import {TOGGLE_THEME} from '../actions/theme';

const initialState = {
  storedTheme: 'dark',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        storedTheme: state.storedTheme === 'dark' ? 'light' : 'dark',
      };
    default:
      return state;
  }
};
