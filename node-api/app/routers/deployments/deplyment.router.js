const { GitBackupsUpload } = require('../../http/controllers/deployment/git-backups-upload.controller');
const { SendTelegramMessage } = require('../../http/controllers/deployment/send-telegram-message.controller');

const router = require('express').Router();

router.post('/git-upload-file', GitBackupsUpload.gitUpload);
router.post('/git-send-message', SendTelegramMessage.sendMessage);

module.exports = {
	DeploymentRoutes: router,
};
