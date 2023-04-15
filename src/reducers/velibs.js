import {
  GET_FIRST_CHUNK_VELIBS_REQUEST,
  GET_FIRST_CHUNK_VELIBS_SUCCESS,
  GET_MORE_VELIBS_REQUEST,
  GET_MORE_VELIBS_SUCCESS,
  GET_COMMUNS_VELIB,
  GET_COMMUNS_ERROR_VELIB,
  RESET_VELIBS,
  GET_VELIBS_ERROR,
} from '../actions/velibs';

const initialState = {
  velibs: [],
  loading: true,
  loadingMore: false,
  communs: [],
  errorVelib: null,
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case GET_FIRST_CHUNK_VELIBS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_FIRST_CHUNK_VELIBS_SUCCESS:
      return {
        ...state,
        velibs: action.payload,
        loading: false,
        error: null,
      };
    case GET_MORE_VELIBS_REQUEST:
      return {
        ...state,
        loadingMore: true,
        error: null,
      };
    case GET_MORE_VELIBS_SUCCESS:
      return {
        ...state,
        velibs: [...state.velibs, ...action.payload],
        loadingMore: false,
      };
    case GET_COMMUNS_VELIB:
      return {
        ...state,
        communs: action.payload,
        error: null,
      };
    case GET_VELIBS_ERROR:
    case GET_COMMUNS_ERROR_VELIB:
      return {
        ...state,
        error: action.payload,
      };
    case RESET_VELIBS:
      return {
        ...state,
        velibs: [],
        communs: [],
        error: null,
      };
    default:
      return state;
  }
};

export default events;
