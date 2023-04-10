import {
  GET_FIRST_CHUNK_OF_EVENTS_REQUEST,
  GET_FIRST_CHUNK_OF_EVENTS_SUCCESS,
  GET_MORE_EVENTS_REQUEST,
  GET_MORE_EVENTS_SUCCESS,
  GET_EVENTS_DATA_FAILURE,
  GET_SINGLE_EVENT_REQUEST,
  GET_SINGLE_EVENT_SUCCESS,
  GET_SINGLE_EVENT_FAILURE,
  RESET_EVENTS,
} from '../actions/events';

const initialState = {
  paginatedEvents: [],
  singleEvent: null,
  loading: false,
  loadingMore: false,
  error: null,
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case GET_FIRST_CHUNK_OF_EVENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SINGLE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        singleEvent: null,
      };
    case GET_FIRST_CHUNK_OF_EVENTS_SUCCESS:
      return {
        ...state,
        paginatedEvents: action.payload,
        loading: false,
      };
    case GET_MORE_EVENTS_REQUEST:
      return {
        ...state,
        loadingMore: true,
        error: null,
      };
    case GET_MORE_EVENTS_SUCCESS:
      return {
        ...state,
        paginatedEvents: [...state.paginatedEvents, ...action.payload],
        loadingMore: false,
      };
    case GET_SINGLE_EVENT_SUCCESS:
      return {
        ...state,
        singleEvent: action.payload,
        loading: false,
      };
    case GET_EVENTS_DATA_FAILURE:
    case GET_SINGLE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RESET_EVENTS:
      return {
        ...state,
        paginatedEvents: [],
        singleEvent: null,
        loading: false,
        loadingMore: false,
        error: null,
      };
    default:
      return state;
  }
};

export default events;
