var featuresList = require('./../JS.Responsive/server/featuresList.json');
var fileSizes = require('./../fileSizes.json');

exports.install = function() {

    F.localize('/templates/*.html', ['compress']);

    F.route('*', customRouter);

    F.file('/documentation/scripts/*.*', docFiles);
    F.file('/documentation/fonts/*.*', docFiles);
    F.file('/documentation/styles/*.*', docFiles);
    F.file('/documentation/img/*.*', docFiles);
    F.file('/documentation/bootstrap/*.*', docFiles);
    F.file('/documentation/*.html', docFiles);

};

function customRouter() {

    var ctrl = this,
        resolvePath = {
            '/': 'index',
            '/documentation/': docCtrl,
            '/download/': downloadCtrl,
            '/contact/': 'contact',
        },
        path = ctrl.req.uri.path,
        pathParts = this.req.path,
        firstIsLang = /^\w{2}$/.test(pathParts[0]),
        resolved = resolvePath[path];

    console.log('Routing path: ', path, pathParts);

    if(firstIsLang && pathParts[0] == 'en') { // someone put manually default lang en instead of current lang
        ctrl.redirect(path.replace(/^\/\w{2}/, ''), true);
    }

    if(path.slice(-1) !== '/')
        path += '/';

    setLanguage(ctrl, firstIsLang ? pathParts[0] : '', path, firstIsLang);

    if(firstIsLang){
        path = path.replace(/^\/\w{2}/, ''); // remove lang from path
        resolved = resolvePath[path]; // and resolve again
        pathParts.shift(); // remove lang from parts
    }

    if(pathParts[0] == 'documentation' && pathParts[1]){
        ctrl.repository.route = pathParts[1];
        path = path.replace(/[\-\w.]+\/$/, ''); // remove dynamic route part from path
        resolved = resolvePath[path]; // and resolve again
    }


    // console.log('resolved', resolved);

    if(resolved)
        if(typeof resolved == 'string')
            ctrl.view(resolved);
        else
            resolved(ctrl);
    else
        ctrl.view('404');
}

function downloadCtrl(ctrl) {
    ctrl.view('download', {
        featuresList: featuresList,
        fileSizes: fileSizes,
        fullSize: Math.floor(fileSizes['v3.0.0-full--JS.Responsive.full.min.js']/1024),
        defaultSize: Math.floor(fileSizes['v3.0.0-default--JS.Responsive.min.js']/1024)
    });
}
function docCtrl(ctrl) {
    var route = ctrl.repository.route;
    console.log('doc_route: ', route || 'indexDocs');

    ctrl.repository.colBreaks = ['detectAgent', 'documentState']; // column breaks
    ctrl.repository.colContentBreaks = ['documentState']; // column breaks
    ctrl.repository.modules = featuresList;
    ctrl.view('documentation', {
        dynaview: route ? 'docs/' + route : 'indexDocs'
    });
}
function docFiles(req, res) {
    // console.log('reqFiles', req.host, req.method, req.path);
    if(req.path[1] == 'bootstrap')
        res.file(F.path.root('/node_modules/bootstrap/dist/js/' + req.path[2]));
    else if(req.path[1] == 'quicksearch.html' || req.path[2] == 'quicksearch.html')
        res.file(F.path.root('/JS.Responsive/docs/quicksearch.html'));
    else if(!req.path[2])
        res.file(F.path.root('/JS.Responsive/docs/' + req.path[1]));
    else
        res.file(F.path.root('/JS.Responsive/docs/' + req.path[1] + '/' + req.path[2]));
}

function setLanguage(ctrl, lang, path, firstIsLang) {
    var supportedLanguages = ['en', 'sk'], // first is default
        sl = supportedLanguages.length,
        defaultLang = supportedLanguages[0],
        index = supportedLanguages.indexOf(lang),
        nextLang;

    if (index > -1){
        ctrl.language = lang;
        ctrl.repository.slashLang = '/' + lang;
        nextLang = sl == index+1 ? defaultLang : supportedLanguages[index+1];
    }else{
        ctrl.language = 'en';
        ctrl.repository.slashLang = '';
        nextLang = sl > 1 ? supportedLanguages[1] : '';
    }

    ctrl.repository.nextLang = nextLang;
    if(nextLang == 'en')
        nextLang = '';
    else if(firstIsLang)
        nextLang = '/' + nextLang;
    ctrl.repository.nextLangUrl = firstIsLang ? path.replace(/^\/\w{2}/, nextLang) : '/' + nextLang + path;
}