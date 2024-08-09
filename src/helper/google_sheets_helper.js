// src/services/googleSheetsService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getData = (spreadsheetId, range) => {
  return axios.get(`${API_BASE_URL}/getData`, { params: { spreadsheetId, range } });
};

export const putData = (spreadsheetId, range, values) => {
  return axios.post(`${API_BASE_URL}/putData`, { spreadsheetId, range, values });
};

export const patchData = (spreadsheetId, range, values) => {
  return axios.post(`${API_BASE_URL}/patchData`, { spreadsheetId, range, values });
};

export const deleteData = (spreadsheetId, range) => {
  return axios.post(`${API_BASE_URL}/deleteData`, { spreadsheetId, range });
};
