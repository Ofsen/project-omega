import axios from 'axios';
import {ARRONDISSEMENT_API, API_URL} from '@env';

export const GET_FIRST_CHUNK_VELIBS_REQUEST = 'GET_FIRST_CHUNK_VELIBS_REQUEST';
export const GET_FIRST_CHUNK_VELIBS_SUCCESS = 'GET_FIRST_CHUNK_VELIBS_SUCCESS';
export const GET_MORE_VELIBS_REQUEST = 'GET_MORE_VELIBS_REQUEST';
export const GET_MORE_VELIBS_SUCCESS = 'GET_MORE_VELIBS_SUCCESS';
export const GET_VELIBS_ERROR = 'GET_VELIBS_ERROR';
export const GET_COMMUNS_VELIB = 'GET_COMMUNS_VELIB';
export const GET_COMMUNS_ERROR_VELIB = 'GET_COMMUNS_ERROR_VELIB';
export const RESET_VELIBS = 'RESET_VELIBS';

const fetchPaginatedVelibs = (
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
    lang: 'fr',
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

  return axios.get(`${API_URL}`, {params});
};

export const getFirstChunkOfVelibs =
  (row = 20, commune, rentingFilter, returningFilter, searchQuery) =>
  dispatch => {
    dispatch({type: GET_FIRST_CHUNK_VELIBS_REQUEST});

    return fetchPaginatedVelibs(
      row,
      0,
      commune,
      rentingFilter,
      returningFilter,
      searchQuery,
    )
      .then(response => {
        dispatch({
          type: GET_FIRST_CHUNK_VELIBS_SUCCESS,
          payload: response.data.records,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_VELIBS_ERROR,
          payload: error.message,
        });
      });
  };

export const getMoreVelibs =
  (row = 20, start = 1, commune, rentingFilter, returningFilter, searchQuery) =>
  dispatch => {
    dispatch({type: GET_MORE_VELIBS_REQUEST});

    return fetchPaginatedVelibs(
      row,
      start,
      commune,
      rentingFilter,
      returningFilter,
      searchQuery,
    )
      .then(response => {
        dispatch({
          type: GET_MORE_VELIBS_SUCCESS,
          payload: response.data.records,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_VELIBS_ERROR,
          payload: error.message,
        });
      });
  };

export const getCommunsVelib = () => dispatch =>
  axios
    .get(`${ARRONDISSEMENT_API}`)
    .then(response => {
      dispatch({
        type: GET_COMMUNS_VELIB,
        payload: response.data.facets[0].facets,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_COMMUNS_ERROR_VELIB,
        payload: error.message,
      });
    });

export const resetVelibs = () => ({type: RESET_VELIBS});
