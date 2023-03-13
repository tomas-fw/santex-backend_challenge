const axios = require('axios');
const config = require('../config');

const api = axios.create({
  baseURL: config.football_api.url,
  headers: {
    'X-Auth-Token': config.football_api.key,
  },
});

module.exports = api;
