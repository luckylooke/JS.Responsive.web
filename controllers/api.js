var fs = require('fs'),
	customBuild = require(__dirname + '/../JS.Responsive/server/customBuild.js'),
	defaultCfg = require(__dirname + '/../JS.Responsive/server/defaultCfg.js'),
    statsPath = __dirname + '/../fileSizes.json',
    stats,
    writingStats = false,
    writeAgain = false;

fs.access(statsPath, function (noaccess) {
    if(!noaccess) return; // file exists

    stats = {};
    fs.writeFile(statsPath, '{}');
});

exports.install = function() {
	F.route('/api/newsletter/', json_save, ['post', '*Newsletter']);
	F.route('/api/contact/', json_save, ['post', '*Contact']);

	// catch all file requests
	F.file(function(req, res, isValidation) {
		if (isValidation) {
			// console.log('isValidation URL: ===> ', req.url);
			return !!req.url.match(/^\/api\/download\/(v\d\.\d\.\d|latest)\//);
		} else {

            var statsExists = fs.existsSync(statsPath);

            if(statsExists){
                // stats.json exists
                fs.readFile(statsPath, function(err, data){
                    if (err) return console.log(err);

                    stats = JSON.parse(data);
                    createResponseFile();
                });
            } else {
                // stats.json dont exists
                stats = {};
                fs.writeFile(statsPath, '{}', createResponseFile);
            }

		}

        function createResponseFile(err) {
            if (err) return console.log(err);

            var version = req.split[2],
                def = !req.split[4],
                type = def ? 'default' : req.split[3],
                fileName = req.split[4] || req.split[3],
                cfg = type.match(/custom/) ? type.slice(6) : '',
                hashBase = '' + version + '-' + type  + '-',
                hash = hashBase + '-' + fileName,
                fileNames;

            if(cfg)
                type = 'custom';

            fileNames = [
                'JS.Responsive' + (def ? '' : '.' + type) + '.js',
                'JS.Responsive' + (def ? '' : '.' + type) + '.js.map',
                'JS.Responsive' + (def ? '' : '.' + type) + '.min.js',
                'JS.Responsive' + (def ? '' : '.' + type) + '.min.js.map',
                'JS.Responsive' + (def ? '' : '.' + type + cfg) + '.zip'
            ];

            var filePath = __dirname + '/../JS.Responsive/tmp/' + version + (def ? '' : '/' + type + cfg) + '/',
                resFile = filePath + fileName;

            // console.log('version: ', version);
            // console.log('type: ', type);
            // console.log('cfg: ', cfg);
            // console.log('filename: ', fileName);
            // console.log('hash: ', hash);

            req.extension = 'txt'; // hack to protect files against CORS

            fs.access(resFile, function(err){
                if(!err){
                    console.log('resFile from cache: ', resFile);

                    logStats(hashBase, filePath, fileNames);

                    // serve cached
                    res.file(resFile);
                } else {
                    customBuild(def ? defaultCfg : cfg, type, function (err) {
                        if(err) console.error(err);
                        console.log('resFile generated: ', resFile);

                        logStats(hashBase, filePath, fileNames);

                        res.file(resFile);
                    }, version);
                }
            });
        }

    });
};

function logStats(hashBase, filePath, fileNames) {

    fileNames.forEach(function (fileName) {

        var hash = hashBase + fileName;
        if(stats[hash]) return;

        var path = filePath + fileName;
        fs.stat(path, function (err, statsObj) {
            if(err) return console.log(err);

            if(!statsObj)
                return;

            // console.log('stats[hash]', hash, statsObj.size);

            stats[hash] = statsObj.size;

            if(writingStats)
                writeAgain = true;
            else{
                writingStats = true;
                writeStats();
            }

        });
    });

}

function writeStats() {
    console.log('write stats', JSON.stringify(stats));
    fs.writeFile(statsPath, JSON.stringify(stats), function (err) {
        if(err) return console.log(err);

        if(writeAgain){
            writeAgain = false;
            writeStats();
        }
        else
            writingStats = false;

    });
}

function json_save() {
	var self = this;
	self.body.ip = self.ip;
	self.body.$save(self.callback());
}