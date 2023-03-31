import {CHANGE_LANGUAGE} from '../actions/theme';

const initialState = {
  language: 'en',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};
