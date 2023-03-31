import axios from 'axios';
import {DATA_API, API_URL} from '@env';

export const getPaginatedEvents = (limit = 20, offset) => {
  return axios.get(`${DATA_API}`, {
    params: {
      limit: limit,
      offset: offset * limit,
      timezone: 'Europe/Paris',
    },
  });
};

export const getSingleEvent = eventId => {
  return axios.get(`${DATA_API}/${eventId}`, {
    params: {
      timezone: 'Europe/Paris',
    },
  });
};

export const callApi = async (row = 20, start) => {
  return await axios.get(`${API_URL}`, {
    params: {
      row: row,
      start: start * row,
      timezone: 'Europe/Paris',
    },
  });
};
