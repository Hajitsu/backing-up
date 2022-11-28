const { DeploymentRoutes } = require('./deployments/deplyment.router');

const router = require('express').Router();

router.use('/dep', DeploymentRoutes);

module.exports = {
	AllRoutes: router,
};
