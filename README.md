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

# Examples

## Parallel

Wire:
````
var Wire = require('../mo-wire/mo-wire');
Wire.defaults = { resultArg: 0 };

function analyze(post_id, done) {
    var l = new Wire('parallel');

    posts.getPost(post_id, l.branch('origin'));
    bonds.getBoundPosts(post_id, l.branch('bonds'));

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

## Map



## Wire instance is function

You can call wire instance itself - it is a function. This is equal:
````
l()
l.resolve()
````
So you can pass it to functions, which awaits for callback - and it will work.

## Methods

- resolve(...) - triggers `success`, any amount of arguments
- reject(...) - triggers `failure`, any amount of arguments
- branch() - creates new Wire, which translates failure to parent

`resolve` and `reject` will trigger corresponding callback only once.

If `reject` already called, `resolve` won't do anything.
But you can call `reject` after `resolve`, for example:

````
var l = new Wire();
doSomethingAsync(l);
l.success(function(result){
    if (result == 'crap')
        return l.reject({ dealWithIt: result });
    use(result);
});
l.failure(function(data){
    washOff(data);
});
````

## Constructor options:

Constructor has optinal parameter: `new Wire(options)`

options {}: 
- branches: 'parallel'
- resultArg: 1 - Will take argument with index 1 from resolve as result
- outputFailures: 'none' / 'uncaught' (default) / 'all'

`options` can be string - then it is parsed as options.branches

## Wire.defaults = to set global default options

For example, when architecture of project uses
callbacks `function (err, result)` we are able to omit passing `{ resultArg: 1 }` for each branch,
and just set for whole library to await argument by default from exact place using:
````
require('mo-wire').defaults = { 
    resultArg: 1 
};
````

# ToDo

## Tests

Need to cover code with tests

## Branches execution order

````
new Wire('parallel' / 'series' / etc...)
````

For now only 'parallel' is implemented

## Multi-wiring

make `branch` to accept argument, which can be object or string

object:
````
{
 passFailure: true (default),
 passSuccess: false (default)
 / 'selfish' (alone, single, any)
 / 'friendly' ('wait brothers', brothers, sisters, neighbors, all, together)
})
````

Example: `processURL(w.branch({passSuccess: 'with brothers'}), url);`

string:
````
branch('friendly') = { passFailure: true, passSuccess: 'friendly' }
branch('selfish') = { passFailure: true, passSuccess: 'selfish' }
branch('alarm') = { passFailure: true, passSuccess: false }
````

# Multi-callbacks

Array of failure / success handlers instead of single var

# License

The MIT License (MIT)
Copyright (c) 2015 garmoshka-mo
