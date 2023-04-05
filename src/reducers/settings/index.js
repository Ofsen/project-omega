import {combineReducers} from 'redux';

export default combineReducers({
  theme: require('./theme').default,
});
