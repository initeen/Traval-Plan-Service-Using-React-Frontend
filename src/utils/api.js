import axios from 'axios';

const url = 'http://localhost:8080';
const apiVersion = '/api/v1/plan'

export const postAPICall = (path, formData) => {
  return axios.post(`${url}${apiVersion}${path}`, formData);
}

export const putAPICall = (path, formData) => {
  return axios.put(`${url}${apiVersion}${path}`, formData);
}

export const getAPICall = (path) => {
  return axios.get(`${url}${apiVersion}${path}`);
}

export const deleteAPICall = (path) => {
  return axios.delete(`${url}${apiVersion}${path}`);
}