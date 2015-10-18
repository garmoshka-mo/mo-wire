module.exports = Wire;
/*
options = {
  branches: 'parallel' / 'series' / etc...
  resultArg: 1
  outputFailures: 'none' / 'uncaught' (default) / 'all'
}
*/
function Wire(customOptions) {

    var options = {};

    if (Wire.defaults)
        Object.keys(Wire.defaults)
            .map(function (k) {
                options[k] = Wire.defaults[k];
            });

    if (customOptions)
        Object.keys(customOptions)
            .map(function (k) {
                options[k] = customOptions[k];
            });

    if (!options.outputFailures)
        options.outputFailures = 'uncaught';

    var self = function(){
        call(self.resolve, arguments);
    };

    var successResults, successCallback;
    var failureResults, failureCallback;
    var isTerminated = false;

    self.resolve = function() {
        if (isTerminated) return;

        successResults = !isNaN(options['resultArg']) ?
            [arguments[options['resultArg']]] : arguments;

        if (successCallback) call(successCallback, successResults);
    };

    self.success = function(callback) {
        if (successResults)
            call(callback, successResults);
        else
            successCallback = callback;
    };


    self.reject = function() {
        if (isTerminated) return;
        isTerminated = true;

        failureResults = arguments;

        if (failureCallback) call(failureCallback, arguments);

        if (options.outputFailures == 'all' ||
            options.outputFailures == 'uncaught' && !failureCallback)
            call(console.error, arguments);
    };

    self.failure = function(callback) {
        if (failureResults)
            call(callback, failureResults);
        else
            failureCallback = callback;
    };

    function call(func, agrs) {
        func.apply(func, agrs);
    }


    var branches = {}, branchesResults = {};
    self.branch = function(key, options) {
        if (branches[key]) return branches[key];

        var l = new Wire(options);
        branches[key] = l;
        l.failure(self.failure);
        l.success(checkBranchesCompletion);

        function checkBranchesCompletion() {

            branchesResults[key] = arguments.length == 1 ?
                arguments[0] : arguments;

            var done = Object.keys(branches)
                .reduce(function (previousValue, k) {
                    return previousValue
                        && typeof branchesResults[k] !== 'undefined';
                }, true);

            if (done)
                self.resolve(branchesResults);
        }

        return l;
    };

    return self;
}
