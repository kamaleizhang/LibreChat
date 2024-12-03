const express = require('express');
const { uaParser, checkBan, requireJwtAuth, } = require('~/server/middleware');

const users = require('./users');
const initialize = async () => {
  const router = express.Router();
  // router.use(requireJwtAuth);
  // router.use(checkBan);
  // router.use(uaParser);

  router.use('/', users);
  return router;
};

module.exports = { initialize };
