# mo-wire

````
  l
   l
    l
mo-wire
````

Is alternative for js promises.
Wire defined outside of function and then passed into.

Purpose: 

1. allows to trace rejections (analog of `throw` in sync code)
1. reduces code of async functions (no need to define promises)
1. metaphor of "thrown wire" is easier for understanding, 
than "chaining" which becomes a bit complicated at points, 
when promises returned to error/success handlers and passed to following ones.

## Install

````
npm i mo-wire --save
````

# Examples

## Parallel

Wire:

![Wire example](https://cloud.githubusercontent.com/assets/2452269/10575034/772343bc-7662-11e5-9523-174ce6e9a792.jpg)

Promises:
````
Enthusiasts are welcomed to write this example using promises
````

Async:
````
Enthusiasts are welcomed to write this example using async
````

## Pretty agile usage of branches

Notes:
- you can predefine full list of branches with `branches` method.
This will ensure, that `success` won't trigger before all of them resolved.
- once you created some branch - you can access it later at any point
either with `l.branch('some')` or `l['some']`

````js
var l = new Wire();
l.branches('article', 'comments');

posts.getPostFromCacheOrDB(postId, l['article']);

bonds.getPostComments(postId, function (err, rows) {
    var processedComments = rows.map(function (r) { ... });
    l['comments'].resolve(processedComments);
});

l.success(...);
````

## mediator

````js
function getDataFromUrl(l, url) {
    download(l.mediator(formatResult), url);
    function formatResult(result) {
         l.resolve(body.title + ': ' + body.description);
    }
}
````

- All rejections which may happen inside of download() - will be thrown to `l`

## mapInSeries

````js
var l = new Wire();
l.mapInSeries(postIds, function(postId) {
    posts.doHeavyCalculationOfRating(postId, someOptions, l);
});
l.success(function(results) {
    // [] Array with result of each call
});
````

## Wire instance - is function

You can call wire instance itself - it is a function. This is equal:
````js
l()
l.resolve()
````
So you can pass wire to functions, which awaits for traditional callback - and it will work.

## Wire methods

- `resolve(...)` - triggers `success`, with any amount of arguments
- `reject(...)` - triggers `failure`, with any amount of arguments
- `branch(name, options)` - creates new Wire, which translates failure to parent immediately
or accumulates resolutions of all branches to single parent's success. Second argument is options for this new wire. Both arguments are optional.
- `branches('branch1', 'branch2', ...)` - to predefine list of branches at one step
- `mediator(callback, options)` - creates new Wire, which translates failure to parent immediately
or calls callback on success. Options are optional.
- `success(function() {})`
- `failure(function() {})` 

- `push(func, arg1, arg2, ...)` - add task to the end of series queue. Queue will be launched once you set success(..) callback 
- `mapInSeries`

`resolve` and `reject` will trigger corresponding callback only once.

If `reject` already called, `resolve` won't do anything.
But you can call `reject` after `resolve`, for example:

````js
var l = new Wire();

doSomethingAsync(l);

l.success(function(result){
    if (isCrap(result))
        return l.reject(result);

    ...
});

l.failure(function(data){
    washOff(data);
});
````

## Constructor options:

Constructor has optinal parameter: `new Wire(options)`

options {}: 
- `branches`: list of branch names to predefine
- `resultArg`: 1 - Will take only argument with index 1 from `resolve(...)` as result
- `outputFailures`: 'none' / 'uncaught' (default) / 'all'
- `name`: Wire name - very useful for debug of deeply thrown rejections

`options` - can be a string, then it will be treated as `options.name`

## Wire.defaults = to set global default options

For example, when architecture of project uses
such callbacks: `function (err, result)` - we are able to omit passing `branch('bla', { resultArg: 1 })` for each branch,
and just set for whole library to await argument from exact place:
````js
require('mo-wire').defaults = { 
    resultArg: 1 
};
````

## Rejections tracing

If you set names to wire points, it will throw failure() where last argument will be object, e.g.:

````js
var l = Wire('Parsing test');

checkSite(l.mediator(formatResult, 'checkSite'), 'site.com');

function parse(l, domain) {
    getAlexaRank(l.branch('get alexa rank'), domain);
    getIndexPage(l.branch('get index page'), domain);
}

// If site.com index page inaccessible, we may get:
'statusCode=500', { trace: ['get index page', 'checkSite', 'Parsing test'] }
````

# ToDo

Enthusiasts are welcomed to participate project:

## options
 
- .errorArg - to set reaction to callback(err, ...)
- .branches - list of branch names to predefine - this is not implemented actually

## Multi-callbacks

Array of failure / success handlers instead of single var

## map

- let barnch() without arguments to create new sequential branches
and use it in map iterations - it will be safe for cases, 
when some iterator would call callback 2 times.
Right now it will push wrong data to results.
- Docs for map & next()

## Promise wrappers

For convenient attaching to promise-based code

## Tests

Would be nice to cover code with tests

# License

The MIT License (MIT)
Copyright (c) 2015 garmoshka-mo
