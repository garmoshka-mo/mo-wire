# mo-wire

````
 l
  l
   l
mo-wire
````

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

- resolve(...) - triggers success callback, any amount of arguments
- reject(...) - triggers failure callback, any amount of arguments
- branch() - creates new Wire, which copies failures to parent

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
