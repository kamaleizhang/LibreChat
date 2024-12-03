const fs = require('fs').promises;
const express = require('express');
const { EnvVar } = require('@librechat/agents');

const { logger } = require('~/config');
const {findUsers} = require("~/models/User");

const router = express.Router();
const getUsersController = async (req, res) => {
  try {
    const users = await findUsers({ user: req.user.id });
    res.status(200).send(users);
  } catch (error) {
    logger.error('[/users] Error getting users:', error);
    res.status(400).json({ message: 'Error in request', error: error.message });
  }
};

module.exports = router;
