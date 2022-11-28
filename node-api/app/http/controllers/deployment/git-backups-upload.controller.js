const Controller = require('../controller');
const own_dir = require('path').resolve('./');

const request = require('request');
const multiparty = require('multiparty');
const fs = require('fs');

const arrow = '\u279C ';
const success = ' \u263A ';
const fail = ' \u2639 ';

class GitBackupsUpload extends Controller {
	async gitUpload(req, res, next) {
		try {
			var form = new multiparty.Form();
			form.on('file', (name, file) => {});

			form.on('aborted', function () {
				res.end(arrow + 'Aborted' + fail);
			});

			form.on('error', function (err) {
				res.end(arrow + err + fail);
			});

			form.parse(req, function (err, fields, files) {
				const file = files.file[0];
				const file_path = own_dir + '/tmp/' + file.originalFilename;
				fs.renameSync(file.path, file_path);
				request.post(
					{
						url: `https://api.telegram.org/bot${process.env.BOT_ID}/sendDocument?chat_id=${process.env.CHAT_ID}`,
						formData: {
							document: fs.createReadStream(file_path),
						},
						timeout: 10000,
					},
					function (error, response, body) {
						fs.rmSync(file_path);
						if (error) {
							return res.end(
								arrow +
									'Fail : ' +
									JSON.stringify(error) +
									fail +
									'\n' +
									error
							);
							return;
						}
						if (Math.round(response.statusCode / 100) !== 2) {
							return res.end(
								arrow +
									'Fail Response Code : ' +
									response.statusCode +
									response.body +
									'\n'
							);
							return;
						}
						return res.end(arrow + 'Success' + success + '\n' + response.body);
					}
				);
			});

			form.on('close', function (err) {
				if (err) res.end(arrow + err + fail);
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = {
	GitBackupsUpload: new GitBackupsUpload(),
};
