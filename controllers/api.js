var fs = require('fs'),
	customBuild = require(__dirname + '/../JS.Responsive/server/customBuild.js'),
    statsPath = __dirname + '/../fileSizes.json',
    stats,
    writingStats = false,
    writeAgain = false;

fs.exists(statsPath, function(exists){
    if(exists){
        // stats.json exists
        fs.readFile(statsPath, function(err, data){
            if (err) console.log(err);
            else {
                stats = JSON.parse(data);
            }
        });
    } else {
        // stats.json dont exists
        stats = {};
        fs.writeFile(statsPath, '{}');
    }
});

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
				cfg = type.match(/custom/) ? type.slice(6) : '',
                hash = '' + version + '-' + type  + '-' +  cfg  + '-' +  fileName;

			if(cfg)
				type = 'custom';

			// console.log('version: ', version);
			// console.log('type: ', type);
			// console.log('cfg: ', cfg);
			// console.log('filename: ', fileName);
			console.log('hash: ', hash);

			var resFile = __dirname + '/../JS.Responsive/tmp/' + version + (def ? '' : '/' + type + cfg) + '/' + fileName;

			req.extension = 'txt'; // hack to protect files against CORS

            fs.exists(resFile, function(exists){
                if(exists){
                    console.log('resFile from cache: ', resFile);

                    logStats(hash, resFile);

                    // serve cached
                    res.file(resFile);
                } else {
                    customBuild(def ? '6257' : cfg, type, function (err) {
                        if(err) console.error(err);
                        console.log('resFile generated: ', resFile);

                        logStats(hash, resFile);

                        res.file(resFile);
                    }, version);
                }
            });
		}
	});
};

function logStats(hash, path) {
    if(!stats[hash])
        fs.stat(path, function (err, statsObj) {
            if(err) return console.log(err);

            if(!statsObj)
                return;

            stats[hash] = statsObj.size;

            if(writingStats)
                writeAgain = true;
            else{
                writingStats = true;
                writeStats();
            }

        });
}

function writeStats() {
    fs.writeFile(statsPath, JSON.stringify(stats), function (err) {
        if(err) return console.log(err);

        if(writeAgain)
            writeStats();
        else
            writingStats = false;

    });
}

function json_save() {
	var self = this;
	self.body.ip = self.ip;
	self.body.$save(self.callback());
}