const Controller = require('../controller');
const request = require('request');

const arrow = '\u279C ';
const success = ' \u263A ';
const fail = ' \u2639 ';

class SendTelegramMessage extends Controller {
	async sendMessage(req, res, next) {
		const { message } = req.body;
		console.log(message);
		try {
			request.post(
				{
					url: `https://api.telegram.org/bot${process.env.BOT_ID}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${message}`,
					timeout: 10000,
				},
				function (error, response, body) {
					if (error) {
						return res.end(
							arrow + 'Fail : ' + JSON.stringify(error) + fail + '\n' + error
						);
					}
					if (Math.round(response.statusCode / 100) !== 2) {
						return res.end(
							arrow +
								'Fail Response Code : ' +
								response.statusCode +
								response.body +
								'\n'
						);
					}
					return res.end(arrow + 'Success' + success + '\n' + response.body);
				}
			);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = {
	SendTelegramMessage: new SendTelegramMessage(),
};
