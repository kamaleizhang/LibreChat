const express = require('express');
const { requireJwtAuth, canDeleteAccount, verifyEmailLimiter } = require('~/server/middleware');
const {
  getUserController,
  getUsersController,
  deleteUserController,
  deleteUsersController,
  verifyEmailController,
  updateUserPluginsController,
  resendVerificationController,
  updateUsersController,
  getTermsStatusController,
  acceptTermsController,
} = require('~/server/controllers/UserController');

const router = express.Router();

router.get('/', requireJwtAuth, getUserController);
router.get('/users', getUsersController);
router.get('/terms', requireJwtAuth, getTermsStatusController);
router.post('/terms/accept', requireJwtAuth, acceptTermsController);
router.post('/plugins', requireJwtAuth, updateUserPluginsController);
router.post('/deleteUsers', requireJwtAuth, canDeleteAccount, deleteUsersController);
router.delete('/delete', requireJwtAuth, canDeleteAccount, deleteUserController);
router.delete('/users', requireJwtAuth, canDeleteAccount, deleteUsersController);
router.post('/verify', verifyEmailController);
router.post('/verify/resend', verifyEmailLimiter, resendVerificationController);
router.post('/updateUsers', requireJwtAuth, updateUsersController);

module.exports = router;
