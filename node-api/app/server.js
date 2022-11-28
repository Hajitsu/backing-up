const express = require('express');
const path = require('path');
const { AllRoutes } = require('./routers/router');
const createHttpError = require('http-errors');
const cors = require('cors');

module.exports = class Application {
	#app = express();
	#PORT;
	constructor(port) {
		this.#PORT = port;

		this.configApplication();
		this.createServer();
		this.createRoutes();
		this.errorHandling();
	}

	configApplication() {
		this.#app.use(cors());
		this.#app.use(express.urlencoded({ extended: true }));
		this.#app.use(express.json());
	}

	createServer() {
		const http = require('http');
		http.createServer(this.#app).listen(this.#PORT, () => {
			console.info(`server started on http://localhost:${this.#PORT}`);
		});
	}

	createRoutes() {
		this.#app.use(AllRoutes);
	}

	errorHandling() {
		this.#app.use((req, res, next) => {
			next(createHttpError.NotFound('URL not found!'));
		});
		this.#app.use((err, req, res, next) => {
			const internalServerError = createHttpError.InternalServerError();
			const statusCode = err.status || internalServerError.status;
			const message = err.message || internalServerError.message;

			return res.status(statusCode).json({
				errors: {
					statusCode,
					message,
				},
			});
		});
	}
};
