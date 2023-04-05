import {Appearance} from 'react-native';
import {TOGGLE_THEME} from '../../actions';

const initialState = Appearance.getColorScheme() || 'light';

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return state === 'dark' ? 'light' : 'dark';
    default:
      return state;
  }
};
