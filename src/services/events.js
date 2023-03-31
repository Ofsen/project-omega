import React from 'react';
import axios from 'axios';
import {DATA_API, API_URL, ARRONDISSEMENT_API} from '@env';

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

export const callApi = async (row = 20, start, commune) => {
  const params = {
    row: row,
    start: start * row,
    timezone: 'Europe/Paris',
  };

  if (commune) {
    params['refine.nom_arrondissement_communes'] = commune;
  }
  return await axios.get(`${API_URL}`, {params});
};

export const getCommunes = async () => {
  const response = await axios.get(`${ARRONDISSEMENT_API}`);
  return response.data;
};
