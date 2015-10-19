module.exports = Wire;

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

        successResults = !isUndefined(options['resultArg']) ?
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

    function isUndefined(x) {
        return typeof x === 'undefined';
    }

    var branches = {}, branchesResults = {};
    self.branch = function(key, options) {
        if (branches[key]) return branches[key];

        if (self[key]) {
            console.error('Conflict with Wire\'s method name: ' + key);
            throw 'Conflict with Wire\'s method name: ' + key;
        }

        var l = new Wire(options);
        self[key] = branches[key] = l;
        l.failure(self.failure);
        l.success(checkBranchesCompletion);

        function checkBranchesCompletion() {

            branchesResults[key] = arguments.length == 1 ?
                arguments[0] : arguments;

            var done = Object.keys(branches)
                .reduce(function (previousValue, k) {
                    return previousValue
                        && !isUndefined(branchesResults[k]);
                }, true);

            if (done)
                self.resolve(branchesResults);
        }

        return l;
    };

    self.branches = function () {
        var arg = arguments;
        Object.keys(arg).map(function (key) {
            self.branch(arg[key]);
        });
    };

    self.mapInSeries = function(arr, func) {

        var done = self.resolve;
        var results = [], counter = 0;
        arr = arr.slice();

        self.next = self.resolve = function() {
            if (arguments.length == 1)
                results.push(arguments[0]);
            else if(!isUndefined(options['resultArg']))
                results.push(arguments[options['resultArg']]);
            else
                results.push(arguments);
            doStep();
        };

        function doStep() {
            var x = arr.shift();
            if (x) func(x, counter++);
            else done(results);
        }

        doStep();
    };

    return self;
}
