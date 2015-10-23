function getDataFromUrl(url, l) {
    download(url, l.mediator(formatResult));
    function formatResult(result) {
         l.resolve(body.title + ': ' + body.description);
    }
}

var l = Wire('Parsing test');

parse(l.mediator(formatResult, 'parse'), 'site.com');

function parse(l, url) {
    getAlexaRank(l.branch('get alexa rank'), url);
    getIndexPage(l.branch('get index page'), url);
}


