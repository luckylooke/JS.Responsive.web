var featuresList = require('./../JS.Responsive/server/featuresList.json');

exports.install = function() {
	F.route('/');
	F.route('/documentation/', docCtrl);
	F.route('/documentation/{route}/', docCtrl);
	F.file('/documentation/scripts/*.*', docFiles);
	F.file('/documentation/fonts/*.*', docFiles);
	F.file('/documentation/styles/*.*', docFiles);
	F.file('/documentation/img/*.*', docFiles);
	F.file('/documentation/bootstrap/*.*', docFiles);
	F.file('/documentation/*.html', docFiles);
	F.route('/contact/');
	F.route('/download/', downloadCtrl);
};

function downloadCtrl() {
	var self = this;
	self.view('download', {featuresList: featuresList});
}
function docCtrl(route) {
	console.log('route: ', route);
	var self = this;
	self.view('documentation', {dynaview: 'docs/' + (route || 'index')});
}
function docFiles(req, res) {
	console.log('reqFiles', req.host, req.method, req.path);
	if(req.path[1] == 'bootstrap')
		res.file(F.path.root('/node_modules/bootstrap/dist/js/' + req.path[2]));
	else if(req.path[1] == 'quicksearch.html' || req.path[2] == 'quicksearch.html')
		res.file(F.path.root('/JS.Responsive/docs/quicksearch.html'));
	else if(!req.path[2])
		res.file(F.path.root('/JS.Responsive/docs/' + req.path[1]));
	else
		res.file(F.path.root('/JS.Responsive/docs/' + req.path[1] + '/' + req.path[2]));
}