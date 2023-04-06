import {
  GET_PAGINATED_EVENTS_REQUEST,
  GET_PAGINATED_EVENTS_SUCCESS,
  GET_PAGINATED_EVENTS_FAILURE,
  GET_SINGLE_EVENT_REQUEST,
  GET_SINGLE_EVENT_SUCCESS,
  GET_SINGLE_EVENT_FAILURE,
} from '../actions/events';

const initialState = {
  paginatedEvents: [],
  singleEvent: null,
  loading: false,
  error: null,
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case GET_PAGINATED_EVENTS_REQUEST:
    case GET_SINGLE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        singleEvent: null,
      };
    case GET_PAGINATED_EVENTS_SUCCESS:
      return {
        ...state,
        paginatedEvents: action.payload,
        loading: false,
      };
    case GET_SINGLE_EVENT_SUCCESS:
      return {
        ...state,
        singleEvent: action.payload,
        loading: false,
      };
    case GET_PAGINATED_EVENTS_FAILURE:
    case GET_SINGLE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default events;
