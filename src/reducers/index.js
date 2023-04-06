import {combineReducers} from 'redux';

export default combineReducers({
  settings: require('./settings').default,
  events: require('./events').default,
});
