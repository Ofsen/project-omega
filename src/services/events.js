import axios from 'axios';
import {DATA_API, API_URL} from '@env';
import {getLang} from '../utils/lang/languageDetector';

export const getPaginatedEvents = async (limit = 20, offset) => {
  return axios.get(`${DATA_API}`, {
    params: {
      limit: limit,
      offset: offset * limit,
      timezone: 'Europe/Paris',
      lang: await getLang(),
    },
  });
};

export const getSingleEvent = async eventId => {
  return axios.get(`${DATA_API}/${eventId}`, {
    params: {
      timezone: 'Europe/Paris',
      lang: await getLang(),
    },
  });
};

export const callApi = async (row = 20, start) => {
  return await axios.get(`${API_URL}`, {
    params: {
      row: row,
      start: start * row,
      timezone: 'Europe/Paris',
      lang: await getLang(),
    },
  });
};
