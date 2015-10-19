# mo-wire

````
  l
   l
    l
mo-wire
````

Wire() - is alternative for js Promise().
Wire defined outside of function and then passed into.

Purpose: 

1. reduces code of asyc functions 
1. metaphor of "thrown wire" is easier for understanding, than "chaining" which becomes a bit complicated at points, when promises returned to error/success handlers and passed to following ones.

## Install

````
npm i mo-wire --save
````

# Examples

## Parallel

Wire:
````
var Wire = require('../mo-wire/mo-wire');
Wire.defaults = { resultArg: 1 };

function preparePostData(postId, done) {
    var l = new Wire();

    posts.getPost(postId, l.branch('article'));
    comments.getPostComments(postId, l.branch('comments'));

    l.success(done);
}
````

Promises:
````
Enthusiasts are welcomed to write this example using promises
````

Async:
````
Enthusiasts are welcomed to write this example using async
````

## Pretty agile usage of branches

Note: you can predefine full list of branches with `branches` method.
This will ensure, that `success` won't trigger before all of them resolved.

````
var l = new Wire();
l.branches('article', 'comments');

posts.getPostFromCacheOrDB(postId, l['article']);

bonds.getPostComments(postId, function (err, rows) {
    var processedRows = rows.map(function (r) { ... });
    l['bonds'].resolve(processedRows);
});

l.success(...);
````

## mapInSeries

````
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
````
l()
l.resolve()
````
So you can pass wire to functions, which awaits for traditional callback - and it will work.

## Wire methods

- `resolve(...)` - triggers `success`, with any amount of arguments
- `reject(...)` - triggers `failure`, with any amount of arguments
- `branch('name', options)` - creates new Wire, which translates failure to parent immediately
or accumulates resolutions of all branches to single parent's success. Second argument is options for this new wire (optional)
- `branches('branch1', 'branch2', ...)` - to predefine list of branches at one step
- `success(function() {})`
- `failure(function() {})` 


`resolve` and `reject` will trigger corresponding callback only once.

If `reject` already called, `resolve` won't do anything.
But you can call `reject` after `resolve`, for example:

````
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
- branches: list of branch names to predefine
- resultArg: 1 - Will take only argument with index 1 from `resolve(...)` as result
- outputFailures: 'none' / 'uncaught' (default) / 'all'

## Wire.defaults = to set global default options

For example, when architecture of project uses
such callbacks: `function (err, result)` - we are able to omit passing `branch('bla', { resultArg: 1 })` for each branch,
and just set for whole library to await argument from exact place:
````
require('mo-wire').defaults = { 
    resultArg: 1 
};
````

# ToDo

## Tests

Would be nice to cover code with tests

## options.branches
 
list of branch names to predefine - this is not implemented actually

## Multi-callbacks

Array of failure / success handlers instead of single var

# License

The MIT License (MIT)
Copyright (c) 2015 garmoshka-mo
