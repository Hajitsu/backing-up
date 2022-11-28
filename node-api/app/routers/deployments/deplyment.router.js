const { GitBackupsUpload } = require('../../http/controllers/deployment/git-backups-upload.controller');

const router = require('express').Router();

router.post('/git', GitBackupsUpload.gitUpload);

module.exports = {
	DeploymentRoutes: router,
};
