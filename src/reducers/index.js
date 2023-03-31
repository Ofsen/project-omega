import {combineReducers} from 'redux';
import theme from './theme';

export default combineReducers({
  theme,
  lang: require('./lang').default,
  events: require('./events').default,
});
