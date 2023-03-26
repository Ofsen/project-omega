import React from 'react';
import axios from 'axios';
import {DATA_API} from '@env';

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
