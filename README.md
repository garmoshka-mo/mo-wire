# mo-wire

 l
  l
   l
mo-wire

Wire() - is alternative for js Promise.
Wire is defined outside of function and then passed into.

## Example

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

## Wire instance is function

You can call wire instance itself - it is a function. This is equal:
````
l()
l.resolve()
````
So you can pass it to functions, which awaits for callback - and it will work.

## Methods

- resolve(...) - triggers success callback
- reject(...) - triggers failure callback
- branch() - creates new Wire, which copies failures to parent

Notes:
- ... - means any amount of arguments
- resolve and reject will trigger callback only once.
If reject triggered failure, resolve won't do anything.

But you can call reject after resolve, for example:

````
var l = new Wire();
doSomethingAsync(l);
l.success(function(result){
    if (result == 'crap')
        return l.reject({ dealWithIt: result });
    use(result);
});
l.failure(function(err){
    washOff(err);
});

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
var Wire = require('mo-wire');
Wire.defaults = { resultArg: 1 };
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

todo: branch({
 passFailure: true,
 passSuccess: false (default)
 / 'alone' (single, any)
 / 'wait brothers' (brothers, sisters, neighbors, all, together
})

processURL(w.branch({passSuccess: 'with brothers'}), url);

branch('friendly') = { passFailure: true, passSuccess: 'friendly' }
branch('selfish') = { passFailure: true, passSuccess: 'selfish' }
branch('alarm') = { passFailure: true, passSuccess: false }

# Multi-callbacks

Array of failure / success handlers instead of single var

# License

The MIT License (MIT)
Copyright (c) 2015 garmoshka-mo
