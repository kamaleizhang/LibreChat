const {
  Session,
  Balance,
  getFiles,
  deleteFiles,
  deleteConvos,
  deletePresets,
  deleteMessages,
  deleteUserById,
  findUsers, updateUser,
} = require('~/models');
const User = require('~/models/User');
const { updateUserPluginAuth, deleteUserPluginAuth } = require('~/server/services/PluginService');
const { updateUserPluginsService, deleteUserKey } = require('~/server/services/UserService');
const { verifyEmail, resendVerificationEmail } = require('~/server/services/AuthService');
const { processDeleteRequest } = require('~/server/services/Files/process');
const { deleteAllSharedLinks } = require('~/models/Share');
const { Transaction } = require('~/models/Transaction');
const { logger } = require('~/config');
const bcrypt = require("bcryptjs");
const {SystemRoles} = require("librechat-data-provider");

const getUserController = async (req, res) => {
  res.status(200).send(req.user);
};
const getUsersController = async (req, res) => {
  try {
    const users = await findUsers();
    res.status(200).send(users);
  } catch (error) {
    logger.error('[/users] Error getting users:', error);
    res.status(400).json({ message: 'Error in request', error: error.message });
  }
};

const getTermsStatusController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ termsAccepted: !!user.termsAccepted });
  } catch (error) {
    logger.error('Error fetching terms acceptance status:', error);
    res.status(500).json({ message: 'Error fetching terms acceptance status' });
  }
};

const acceptTermsController = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { termsAccepted: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Terms accepted successfully' });
  } catch (error) {
    logger.error('Error accepting terms:', error);
    res.status(500).json({ message: 'Error accepting terms' });
  }
};

const deleteUserFiles = async (req) => {
  try {
    const userFiles = await getFiles({ user: req.user.id });
    await processDeleteRequest({
      req,
      files: userFiles,
    });
  } catch (error) {
    logger.error('[deleteUserFiles]', error);
  }
};

const updateUserPluginsController = async (req, res) => {
  const { user } = req;
  const { pluginKey, action, auth, isEntityTool } = req.body;
  let authService;
  try {
    if (!isEntityTool) {
      const userPluginsService = await updateUserPluginsService(user, pluginKey, action);

      if (userPluginsService instanceof Error) {
        logger.error('[userPluginsService]', userPluginsService);
        const { status, message } = userPluginsService;
        res.status(status).send({ message });
      }
    }

    if (auth) {
      const keys = Object.keys(auth);
      const values = Object.values(auth);
      if (action === 'install' && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          authService = await updateUserPluginAuth(user.id, keys[i], pluginKey, values[i]);
          if (authService instanceof Error) {
            logger.error('[authService]', authService);
            const { status, message } = authService;
            res.status(status).send({ message });
          }
        }
      }
      if (action === 'uninstall' && keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          authService = await deleteUserPluginAuth(user.id, keys[i]);
          if (authService instanceof Error) {
            logger.error('[authService]', authService);
            const { status, message } = authService;
            res.status(status).send({ message });
          }
        }
      }
    }

    res.status(200).send();
  } catch (err) {
    logger.error('[updateUserPluginsController]', err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const updateUsersController = async (req, res) => {
  const { userIds, action, value } = req.body;
  try {
    for(i in userIds) {
      const userId = userIds[i]
      let updateData = {}
      if (action === 'role') {
        updateData = {role: value}
      } else if (action === 'password') {
        const salt = bcrypt.genSaltSync(10);
        updateData = {password: bcrypt.hashSync(value, salt)}
      }
      await updateUser(userId, updateData);
    }
    logger.info(`Users [${userIds}] update to ${value} success.`);
    res.status(200).send({ message: 'User updated' });
  } catch (err) {
    logger.error('[updateUsersController]', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteUserController = async (req, res) => {
  try {
    await delUser(req)
    res.status(200).send({ message: 'User deleted' });
  } catch (err) {
    logger.error('[deleteUserController]', err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const deleteUsersController = async (req, res) => {
  const userIds = req.body;
  // TODO GXG Batch Delete
  for(i in userIds) {
    req.user = {id: userIds[i]}
    try {
      await delUser(req)
      res.status(200).send({ message: 'User deleted' });
    } catch (err) {
      logger.error('[deleteUserController]', err);
      return res.status(500).json({ message: 'Something went wrong.' });
    }
  }
};

const delUser = async (req) => {
  const { user } = req;
  await deleteMessages({ user: user.id }); // delete user messages
  await Session.deleteMany({ user: user.id }); // delete user sessions
  await Transaction.deleteMany({ user: user.id }); // delete user transactions
  await deleteUserKey({ userId: user.id, all: true }); // delete user keys
  await Balance.deleteMany({ user: user.id }); // delete user balances
  await deletePresets(user.id); // delete user presets
  /* TODO: Delete Assistant Threads */
  await deleteConvos(user.id); // delete user convos
  await deleteUserPluginAuth(user.id, null, true); // delete user plugin auth
  await deleteUserById(user.id); // delete user
  await deleteAllSharedLinks(user.id); // delete user shared links
  await deleteUserFiles(req); // delete user files
  await deleteFiles(null, user.id); // delete database files in case of orphaned files from previous steps
  /* TODO: queue job for cleaning actions and assistants of non-existant users */
  logger.info(`User deleted account. Email: ${user.email} ID: ${user.id}`);
}

const verifyEmailController = async (req, res) => {
  try {
    const verifyEmailService = await verifyEmail(req);
    if (verifyEmailService instanceof Error) {
      return res.status(400).json(verifyEmailService);
    } else {
      return res.status(200).json(verifyEmailService);
    }
  } catch (e) {
    logger.error('[verifyEmailController]', e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const resendVerificationController = async (req, res) => {
  try {
    const result = await resendVerificationEmail(req);
    if (result instanceof Error) {
      return res.status(400).json(result);
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    logger.error('[verifyEmailController]', e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

module.exports = {
  getUserController,
  getUsersController,
  getTermsStatusController,
  acceptTermsController,
  deleteUserController,
  deleteUsersController,
  verifyEmailController,
  updateUserPluginsController,
  resendVerificationController,
  updateUsersController,
};
