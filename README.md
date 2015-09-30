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

options: 
- outputFailures: 'none' / 'uncaught' (default) / 'all'

# ToDo

## Tests

Need to cover code with tests

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
