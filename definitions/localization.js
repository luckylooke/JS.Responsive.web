F.onLocale = function(req) {
    var supportedLanguages = ['en', 'sk'];
    if (supportedLanguages.indexOf(req.query.language) > -1)
        return req.query.language;
    return 'en';
};