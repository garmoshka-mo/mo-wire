function getDataFromUrl(url, l) {
    download(url, l.mediator(formatResult));
    function formatResult(result) {
         l.resolve(body.title + ': ' + body.description);
    }
}