const axios = require('axios');
const WebSocket = require('ws');
const logger = require('./logger');

const API_URL = "https://us.wio.seeed.io/v1";

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

function login(token, email, password) {
  // If a token is provided, skip login
  if (token) return Promise.resolve({ token });

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

function writeValue(nodeToken, name, property, ...args) {
  return axios.request({
    method: 'post',
    url: `${API_URL}/node/${name}/${property}/${args.join('/')}`,
    headers: { 'Authorization': nodeToken }
  });
}

function openSocket(token, openCb, messageCb) {
  const socketUrl = `${API_URL.replace('http', 'ws')}/node/event`;
  
  logger.verbose(`[API] opening socket: ${socketUrl}`);
  const ws = new WebSocket(socketUrl);
  
  ws.onopen = () => {
    ws.send(token);
    logger.verbose('[API] socket opened');
    if (openCb) openCb();
  };

  ws.onmessage = (msg) => {
    logger.verbose('[API] message received:', msg.type, '-', msg.data);
    
    if (msg.type !== 'message') {
      logger.error('[API] unknown message type:', msg.type);
      return;
    }

    // Parse event data
    const data = JSON.parse(msg.data);
    // Invoke callback with event message
    if (data.msg && messageCb) messageCb(data.msg);
  };

  return ws;
}

function error(err) {
  logger.error('[API]', err);
}

module.exports = {
  login,
  listNodes,
  getWellKnown,
  readValue,
  writeValue,
  openSocket,
  error
}
