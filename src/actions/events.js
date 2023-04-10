import axios from 'axios';
import {EVENTS_API} from '@env';

export const GET_FIRST_CHUNK_OF_EVENTS_REQUEST =
  'GET_FIRST_CHUNK_OF_EVENTS_REQUEST';
export const GET_FIRST_CHUNK_OF_EVENTS_SUCCESS =
  'GET_FIRST_CHUNK_OF_EVENTS_SUCCESS';
export const GET_MORE_EVENTS_REQUEST = 'GET_MORE_EVENTS_REQUEST';
export const GET_MORE_EVENTS_SUCCESS = 'GET_MORE_EVENTS_SUCCESS';
export const GET_EVENTS_DATA_FAILURE = 'GET_EVENTS_DATA_FAILURE';
export const GET_SINGLE_EVENT_REQUEST = 'GET_SINGLE_EVENT_REQUEST';
export const GET_SINGLE_EVENT_SUCCESS = 'GET_SINGLE_EVENT_SUCCESS';
export const GET_SINGLE_EVENT_FAILURE = 'GET_SINGLE_EVENT_FAILURE';
export const RESET_EVENTS = 'RESET_EVENTS';

const fetchPaginatedEvents = (limit = 20, offset = 0) => {
  return axios.get(`${EVENTS_API}`, {
    params: {
      limit: limit,
      offset: offset * limit,
      timezone: 'Europe/Paris',
    },
  });
};

export const getFirstChunkOfEvents = limit => dispatch => {
  dispatch({type: GET_FIRST_CHUNK_OF_EVENTS_REQUEST});

  return fetchPaginatedEvents(limit)
    .then(response => {
      dispatch({
        type: GET_FIRST_CHUNK_OF_EVENTS_SUCCESS,
        payload: response.data.records,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_EVENTS_DATA_FAILURE,
        payload: error.message,
      });
    });
};

export const getMoreEvents =
  (limit = 20, offset = 1) =>
  dispatch => {
    dispatch({type: GET_MORE_EVENTS_REQUEST});

    return fetchPaginatedEvents(limit, offset)
      .then(response => {
        dispatch({
          type: GET_MORE_EVENTS_SUCCESS,
          payload: response.data.records,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_EVENTS_DATA_FAILURE,
          payload: error.message,
        });
      });
  };

export const getSingleEvent = eventId => dispatch => {
  dispatch({type: GET_SINGLE_EVENT_REQUEST});

  axios
    .get(`${EVENTS_API}/${eventId}`, {
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
        type: GET_EVENTS_DATA_FAILURE,
        payload: error.message,
      });
    });
};

export const resetEvents = () => {
  return {
    type: RESET_EVENTS,
  };
};
