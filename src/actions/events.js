import axios from 'axios';
import {DATA_API} from '@env';

export const GET_PAGINATED_EVENTS_REQUEST = 'GET_PAGINATED_EVENTS_REQUEST';
export const GET_PAGINATED_EVENTS_SUCCESS = 'GET_PAGINATED_EVENTS_SUCCESS';
export const GET_PAGINATED_EVENTS_FAILURE = 'GET_PAGINATED_EVENTS_FAILURE';
export const GET_SINGLE_EVENT_REQUEST = 'GET_SINGLE_EVENT_REQUEST';
export const GET_SINGLE_EVENT_SUCCESS = 'GET_SINGLE_EVENT_SUCCESS';
export const GET_SINGLE_EVENT_FAILURE = 'GET_SINGLE_EVENT_FAILURE';

export const getPaginatedEvents = (limit = 20, offset = 0) => {
  return dispatch => {
    dispatch({type: GET_PAGINATED_EVENTS_REQUEST});

    return axios
      .get(`${DATA_API}`, {
        params: {
          limit: limit,
          offset: offset * limit,
          timezone: 'Europe/Paris',
        },
      })
      .then(response => {
        dispatch({
          type: GET_PAGINATED_EVENTS_SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_PAGINATED_EVENTS_FAILURE,
          payload: error.message,
        });
      });
  };
};

export const getSingleEvent = eventId => {
  return dispatch => {
    dispatch({type: GET_SINGLE_EVENT_REQUEST});

    axios
      .get(`${DATA_API}/${eventId}`, {
        params: {
          timezone: 'Europe/Paris',
        },
      })
      .then(response => {
        dispatch({
          type: GET_SINGLE_EVENT_SUCCESS,
          payload: response.data.record,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_SINGLE_EVENT_FAILURE,
          payload: error.message,
        });
      });
  };
};
