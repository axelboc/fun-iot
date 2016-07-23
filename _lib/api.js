const axios = require('axios');
const logger = require('./logger');

const API_URL = "https://iot.seeed.cc/v1";

// Intercept requests
axios.interceptors.request.use(
  config => {
    logger.verbose(`[API] request: ${config.url}`);
    return config;
  }
);

// Intercept responses
axios.interceptors.response.use(
  ({ data }) => {
    // Reject when API responds with error
    if ('error' in data) {
      return Promise.reject(data.error);
    }

    logger.verbose('[API] response', data);
    return data;
  }
);

function login(email, password) {
  return axios.post(`${API_URL}/user/login`, {
    email,
    password
  });
}

function listNodes(userToken) {
  return axios.get(`${API_URL}/nodes/list`, {
    headers: { 'Authorization': userToken }
  });
}

function getWellKnown(nodeToken) {
  return axios.get(`${API_URL}/node/.well-known`, {
    headers: { 'Authorization': nodeToken }
  });
}

function readValue(nodeToken, name, property, ...args) {
  return axios.get(`${API_URL}/node/${name}/${property}/${args.join('/')}`, {
    headers: { 'Authorization': nodeToken }
  });
}

module.exports = {
  login,
  listNodes,
  getWellKnown,
  readValue
}
