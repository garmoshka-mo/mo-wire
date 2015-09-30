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
````

Promises:
````
````

Callbacks:
````
````

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

options: 
- outputFailures: 'none' / 'uncaught' (default) / 'all'

# ToDo

## Tests

Need to cover code with tests

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
