/*
options = {
    outputFailures: 'none' / 'uncaught' (default) / 'all'
}
*/
function Wire(options) {

    if (!options) options = {};
    if (!options.outputFailures)
        options.outputFailures = 'uncaught';

    var self = this;
    var successResults, successCallback;
    var failureResults, failureCallback;
    var isTerminated = false;

    this.resolve = function() {
        if (isTerminated) return;

        successResults = arguments;

        if (successCallback) call(successCallback, arguments);
    };

    this.success = function(callback) {
        if (successResults)
            call(callback, successResults);
        else
            successCallback = callback;
    };


    this.reject = function() {
        if (isTerminated) return;
        isTerminated = true;

        failureResults = arguments;

        if (failureCallback) call(failureCallback, arguments);

        if (options.outputFailures == 'all' ||
            options.outputFailures == 'uncaught' && !failureCallback)
            call(console.error, arguments);
    };

    this.failure = function(callback) {
        if (failureResults)
            call(callback, failureResults);
        else
            failureCallback = callback;
    };

    function call(func, agrs) {
        func.apply(func, agrs);
    }


    this.branch = function() {
        var l = new Wire();
        l.failure(self.failure);
        return l;
    };

}

module.exports = Wire;