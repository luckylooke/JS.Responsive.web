exports.install = function() {
	F.route('/');
	F.route('/documentation/', docCtrl);
	F.file('/documentation/*.html', docHtml);
	F.file('/documentation/scripts/*.*', docFiles);
	F.file('/documentation/fonts/*.*', docFiles);
	F.file('/documentation/styles/*.*', docFiles);
	F.file('/documentation/img/*.*', docFiles);
	F.route('/contact/');
	F.route('/download/', downloadCtrl);
};

function downloadCtrl() {
	var self = this;
	self.repository.test = 'test';
	self.view('download');
}
function docCtrl() {
	var self = this;
	self.view('documentation');
}
function docHtml(req, res) {
	console.log('req', req.host, req.method, req.path);
	// ... a transformation
	res.file('./../JS.Responsive/docs/' + req.path[1]);
}
function docFiles(req, res) {
	console.log('reqFiles', req.host, req.method, req.path);
	// ... a transformation
	res.file('./../JS.Responsive/docs/' + req.path[1] + '/' + req.path[2]);
}