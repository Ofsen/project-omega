import axios from 'axios';
import {DATA_API, API_URL, ARRONDISSEMENT_API} from '@env';
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

export const callApi = async (
  row = 20,
  start,
  commune,
  rentingFilter,
  returningFilter,
  searchQuery,
) => {
  const params = {
    row: row,
    start: start * row,
    timezone: 'Europe/Paris',
    lang: await getLang(),
    q: '',
    refine: {
      nom_arrondissement_communes: '',
      is_renting: '',
      is_returning: '',
    },
  };

  if (commune) {
    params['refine.nom_arrondissement_communes'] = commune;
  }
  if (rentingFilter) {
    params['refine.is_renting'] = 'OUI';
  }
  if (returningFilter) {
    params['refine.is_returning'] = 'OUI';
  }
  if (searchQuery) {
    params.q = searchQuery;
  }

  return await axios.get(`${API_URL}`, {params});
};

export const getCommunes = async () => {
  const response = await axios.get(`${ARRONDISSEMENT_API}`);
  return response.data;
};
