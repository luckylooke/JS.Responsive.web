var fs = require('fs'),
	customBuildHelper = require(__dirname + '/../JS.Responsive/server/customBuildHelper.js');
	customBuild = require(__dirname + '/../JS.Responsive/server/customBuild.js');

exports.install = function() {
	F.route('/api/newsletter/', json_save, ['post', '*Newsletter']);
	F.route('/api/contact/', json_save, ['post', '*Contact']);
	F.file(function(req, res, isValidation) {
		if (isValidation) {
			// console.log('isValidation URL: ===> ', req.url);
			return !!req.url.match(/^\/api\/download\/v\d\.\d\.\d\//);
		}else {
			var version = req.split[2],
				def = !req.split[4],
				type = def ? 'default' : req.split[3],
				fileName = req.split[4] || req.split[3],
				cfg = type.match(/custom/) ? type.slice(6) : '';

			if(cfg)
				type = 'custom';

			console.log('version: ', version);
			console.log('type: ', type);
			console.log('cfg: ', cfg);
			console.log('filename: ', fileName);


			var resFile = __dirname + '/../JS.Responsive/tmp/' + version + (def ? '' : '/' + type + cfg) + '/' + fileName;

			req.extension = 'txt'; // hack to protect files against CORS

			if(fs.existsSync(resFile)){
				console.log('resFile cached: ', resFile);
				// serve cached
				res.file(resFile);
			}else{
				// create and then serve
				customBuild(cfg, type, function (err) {
					if(err) console.error(err);
					console.log('resFile generated: ', resFile);
					res.file(resFile);
				}, version);
			}
		}
	});
};

function json_save() {
	var self = this;
	self.body.ip = self.ip;
	self.body.$save(self.callback());
}