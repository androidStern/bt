(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     ramda.js 0.3.0
//     https://github.com/CrossEye/ramda
//     (c) 2013-2014 Scott Sauyet and Michael Hurley
//     Ramda may be freely distributed under the MIT license.

// Ramda
// -----
// A practical functional library for Javascript programmers.  Ramda is a collection of tools to make it easier to
// use Javascript as a functional programming language.  (The name is just a silly play on `lambda`.)

// Basic Setup
// -----------
// Uses a technique from the [Universal Module Definition][umd] to wrap this up for use in Node.js or in the browser,
// with or without an AMD-style loader.
//
//  [umd]: https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {if (typeof exports === 'object') {module.exports = factory(root);} else if (typeof define === 'function' && define.amd) {define(factory);} else {root.ramda = factory(root);}}(this, function (global) {

    "use strict";
    return  (function() {
        // This object is what is actually returned, with all the exposed functions attached as properties.

        /**
         * TODO: JSDoc-style documentation for this function
         */
        var R = {};

        // Internal Functions and Properties
        // ---------------------------------

        /**
         * Creates an alias for a public function.
         *
         * @private
         * @category Internal
         * @param {string} oldName The name of the public function to alias.
         * @return {Function} A function decorated with the `is`, `are`, and `and` methods. Create
         * an alias for the `oldName function by invoking any of these methods an passing it a
         * string with the `newName` parameter.
         * @example
         *
         * // Create an alias for `each` named `forEach`
         * aliasFor('each').is('forEach');
         */
        var aliasFor = function (oldName) {
            var fn = function (newName) {
                R[newName] = R[oldName];
                return fn;
            };
            fn.is = fn.are = fn.and = fn;
            return fn;
        };

        /**
         * An optimized, private array `slice` implementation.
         *
         * @private
         * @category Internal
         * @param {Arguments|Array} args The array or arguments object to consider.
         * @param {number} [from=0] The array index to slice from, inclusive.
         * @param {number} [to=args.length] The array index to slice to, exclusive.
         * @return {Array} A new, sliced array.
         * @example
         *
         * _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
         *
         * var firstThreeArgs = function(a, b, c, d) {
         *   return _slice(arguments, 0, 3);
         * };
         * firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
         */
        function _slice(args, from, to) {
            from = (typeof from === "number" ) ? from : 0;
            to = (typeof to === "number" ) ? to : args.length;
            var length = to - from,
                arr = new Array(length),
                i = -1;

            while (++i < length) {
                arr[i] = args[from + i];
            }
            return arr;
        }

        /**
         * Private `concat` function to merge two array-like objects.
         *
         * @private
         * @category Internal
         * @param {Array|Arguments} [set1=[]] An array-like object.
         * @param {Array|Arguments} [set2=[]] An array-like object.
         * @return {Array} A new, merged array.
         * @example
         *
         * concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
         */
        var concat = function _concat(set1, set2) {
            set1 = set1 || [];
            set2 = set2 || [];
            var length1 = set1.length,
                length2 = set2.length,
                result = new Array(length1 + length2);

            for (var i = 0; i < length1; i++) {
                result[i] = set1[i];
            }
            for (i = 0; i < length2; i++) {
                result[i + length1] = set2[i];
            }
            return result;
        };

        // Private reference to toString function.
        var toString = Object.prototype.toString;

        /**
         * Tests whether or not an object is an array.
         *
         * @private
         * @category Internal
         * @param {*} val The object to test.
         * @return {boolean} `true` if `val` is an array, `false` otherwise.
         * @example
         *
         * isArray([]); //=> true
         * isArray(true); //=> false
         * isArray({}); //=> false
         */
        var isArray = Array.isArray || function _isArray(val) {
            return val && val.length >= 0 && toString.call(val) === "[object Array]";
        };

        /**
         * Tests whether or not an object is similar to an array.
         *
         * @private
         * @category Internal
         * @param {*} val The object to test.
         * @return {boolean} `true` if `val` has a numeric length property; `false` otherwise.
         * @example
         *
         * isArrayLike([]); //=> true
         * isArrayLike(true); //=> false
         * isArrayLike({}); //=> false
         * isArrayLike({length: 10}); //=> true
         */
        var isArrayLike = function(x) {
            return x != null && x.length >= 0 && (isArray(x) || !R.is(String, x));
        };

        /**
         * Creates a new version of `fn` that, when invoked, will return either:
         * - A new function ready to accept one or more of `fn`'s remaining arguments, if all of
         * `fn`'s expected arguments have not yet been provided
         * - `fn`'s result if all of its expected arguments have been provided
         *
         * Optionally, you may provide an arity for the returned function.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to curry.
         * @param {number} [fnArity=fn.length] An optional arity for the returned function.
         * @return {Function} A new, curried function.
         * @example
         *
         * var addFourNumbers = function(a, b, c, d) {
         *   return a + b + c + d;
         * };
         *
         * var curriedAddFourNumbers = curry(addFourNumbers);
         * var f = curriedAddFourNumbers(1, 2);
         * var g = f(3);
         * g(4);//=> 10
         */
        var curry = R.curry = function _curry(fn, fnArity) {
            fnArity = typeof fnArity === "number" ? fnArity : fn.length;
            function recurry(args) {
                return arity(Math.max(fnArity - (args && args.length || 0), 0), function () {
                    if (arguments.length === 0) { throw NO_ARGS_EXCEPTION; }
                    var newArgs = concat(args, arguments);
                    if (newArgs.length >= fnArity) {
                        return fn.apply(this, newArgs);
                    }
                    else {
                        return recurry(newArgs);
                    }
                });
            }

            return recurry([]);
        };

        var NO_ARGS_EXCEPTION = new TypeError('Function called with no arguments');

        /**
         * Optimized internal two-arity curry function.
         *
         * @private
         * @category Function
         * @param {Function} fn The function to curry.
         * @return {Function} curried function
         * @example
         *
         * var addTwo = function(a, b) {
         *   return a + b;
         * };
         * var curriedAddTwo = curry2(addTwo);
         */
        function curry2(fn) {
            return function(a, b) {
                switch (arguments.length) {
                    case 0: throw NO_ARGS_EXCEPTION;
                    case 1: return function(b) {
                        return fn(a, b);
                    };
                }
                return fn(a, b);
            };
        }

        /**
         * Optimized internal three-arity curry function.
         *
         * @private
         * @category Function
         * @param {Function} fn The function to curry.
         * @return {Function} curried function
         * @example
         *
         * var addThree = function(a, b, c) {
         *   return a + b + c;
         * };
         * var curriedAddThree = curry3(addThree);
         */
        function curry3(fn) {
            return function(a, b, c) {
                switch (arguments.length) {
                    case 0: throw NO_ARGS_EXCEPTION;
                    case 1: return curry2(function(b, c) {
                        return fn(a, b, c);
                    });
                    case 2: return function(c) {
                        return fn(a, b, c);
                    };
                }
                return fn(a, b, c);
            };
        }

        /**
         * Private function that determines whether or not a provided object has a given method.
         * Does not ignore methods stored on the object's prototype chain. Used for dynamically
         * dispatching Ramda methods to non-Array objects.
         *
         * @private
         * @category Internal
         * @param {string} methodName The name of the method to check for.
         * @param {Object} obj The object to test.
         * @return {boolean} `true` has a given method, `false` otherwise.
         * @example
         *
         * var person = { name: 'John' };
         * person.shout = function() { alert(this.name); };
         *
         * hasMethod('shout', person); //=> true
         * hasMethod('foo', person); //=> false
         */
        var hasMethod = function _hasMethod(methodName, obj) {
            return obj && !isArray(obj) && typeof obj[methodName] === 'function';
        };

        /**
         * Similar to hasMethod, this checks whether a function has a [methodname]
         * function. If it isn't an array it will execute that function otherwise it will
         * default to the ramda implementation.
         *
         * @private
         * @category Internal
         * @param {Function} func ramda implemtation
         * @param {String} methodname property to check for a custom implementation
         * @return {Object} whatever the return value of the method is
         */
        function checkForMethod(methodname, func) {
            return function(a, b, c) {
                var length = arguments.length;
                var obj = arguments[length - 1],
                    callBound = obj && !isArray(obj) && typeof obj[methodname] === 'function';
                switch (arguments.length) {
                    case 0: return func();
                    case 1: return callBound ? obj[methodname]() : func(a);
                    case 2: return callBound ? obj[methodname](a) : func(a, b);
                    case 3: return callBound ? obj[methodname](a, b) : func(a, b, c);
                    case 4: return callBound ? obj[methodname](a, b, c) : func(a, b, c, obj);
                }
            };
        }

        /**
         * Private function that generates a parameter list based on the paremeter count passed in.
         *
         * @private
         * @category Internal
         * @param {number} n The number of parameters
         * @return {string} The parameter list
         * @example
         *
         * mkArgStr(1); //= "arg1"
         * mkArgStr(2); //= "arg1, arg2"
         * mkArgStr(3); //= "arg1, arg2, arg3"
         */
        var mkArgStr = function _makeArgStr(n) {
            var arr = [], idx = -1;
            while (++idx < n) {
                arr[idx] = "arg" + idx;
            }
            return arr.join(", ");
        };

        /**
         * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
         * parameters. Any extraneous parameters will not be passed to the supplied function.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {number} n The desired arity of the new function.
         * @param {Function} fn The function to wrap.
         * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
         * arity `n`.
         * @example
         *
         * var takesTwoArgs = function(a, b) {
         *   return [a, b];
         * };
         * takesTwoArgs.length; //=> 2
         * takesTwoArgs(1, 2); //=> [1, 2]
         *
         * var takesOneArg = ramda.nAry(1, takesTwoArgs);
         * takesOneArg.length; //=> 1
         * // Only `n` arguments are passed to the wrapped function
         * takesOneArg(1, 2); //=> [1, undefined]
         */
        var nAry = R.nAry = (function () {
            var cache = {
                0: function (func) {
                    return function () {
                        return func.call(this);
                    };
                },
                1: function (func) {
                    return function (arg0) {
                        return func.call(this, arg0);
                    };
                },
                2: function (func) {
                    return function (arg0, arg1) {
                        return func.call(this, arg0, arg1);
                    };
                },
                3: function (func) {
                    return function (arg0, arg1, arg2) {
                        return func.call(this, arg0, arg1, arg2);
                    };
                }
            };


            //     For example:
            //     cache[5] = function(func) {
            //         return function(arg0, arg1, arg2, arg3, arg4) {
            //             return func.call(this, arg0, arg1, arg2, arg3, arg4);
            //         }
            //     };

            var makeN = function (n) {
                var fnArgs = mkArgStr(n);
                var body = [
                        "    return function(" + fnArgs + ") {",
                        "        return func.call(this" + (fnArgs ? ", " + fnArgs : "") + ");",
                    "    }"
                ].join("\n");
                return new Function("func", body);
            };

            return function _nAry(n, fn) {
                return (cache[n] || (cache[n] = makeN(n)))(fn);
            };
        }());

        /**
         * Wraps a function of any arity (including nullary) in a function that accepts exactly 1
         * parameter. Any extraneous parameters will not be passed to the supplied function.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to wrap.
         * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
         * arity 1.
         * @example
         *
         * var takesTwoArgs = function(a, b) {
         *   return [a, b];
         * };
         * takesTwoArgs.length; //=> 2
         * takesTwoArgs(1, 2); //=> [1, 2]
         *
         * var takesOneArg = ramda.unary(1, takesTwoArgs);
         * takesOneArg.length; //=> 1
         * // Only 1 argument is passed to the wrapped function
         * takesOneArg(1, 2); //=> [1, undefined]
         */
        R.unary = function _unary(fn) {
            return nAry(1, fn);
        };

        /**
         * Wraps a function of any arity (including nullary) in a function that accepts exactly 2
         * parameters. Any extraneous parameters will not be passed to the supplied function.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to wrap.
         * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
         * arity 2.
         * @example
         *
         * var takesThreeArgs = function(a, b, c) {
         *   return [a, b, c];
         * };
         * takesThreeArgs.length; //=> 3
         * takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
         *
         * var takesTwoArgs = ramda.binary(1, takesThreeArgs);
         * takesTwoArgs.length; //=> 2
         * // Only 2 arguments are passed to the wrapped function
         * takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
         */
        var binary = R.binary = function _binary(fn) {
            return nAry(2, fn);
        };

        /**
         * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
         * parameters. Unlike `nAry`, which passes only `n` arguments to the wrapped function,
         * functions produced by `arity` will pass all provided arguments to the wrapped function.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {number} n The desired arity of the returned function.
         * @param {Function} fn The function to wrap.
         * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
         * arity `n`.
         * @example
         *
         * var takesTwoArgs = function(a, b) {
         *   return [a, b];
         * };
         * takesTwoArgs.length; //=> 2
         * takesTwoArgs(1, 2); //=> [1, 2]
         *
         * var takesOneArg = ramda.unary(1, takesTwoArgs);
         * takesOneArg.length; //=> 1
         * // All arguments are passed through to the wrapped function
         * takesOneArg(1, 2); //=> [1, 2]
         */
        var arity = R.arity = (function () {
            var cache = {
                0: function (func) {
                    return function () {
                        return func.apply(this, arguments);
                    };
                },
                1: function (func) {
                    return function (arg0) {
                        return func.apply(this, arguments);
                    };
                },
                2: function (func) {
                    return function (arg0, arg1) {
                        return func.apply(this, arguments);
                    };
                },
                3: function (func) {
                    return function (arg0, arg1, arg2) {
                        return func.apply(this, arguments);
                    };
                }
            };

            //     For example:
            //     cache[5] = function(func) {
            //         return function(arg0, arg1, arg2, arg3, arg4) {
            //             return func.apply(this, arguments);
            //         }
            //     };

            var makeN = function (n) {
                var fnArgs = mkArgStr(n);
                var body = [
                        "    return function(" + fnArgs + ") {",
                    "        return func.apply(this, arguments);",
                    "    }"
                ].join("\n");
                return new Function("func", body);
            };

            return function _arity(n, fn) {
                return (cache[n] || (cache[n] = makeN(n)))(fn);
            };
        }());

        /**
         * Turns a named method of an object (or object prototype) into a function that can be
         * called directly. Passing the optional `len` parameter restricts the returned function to
         * the initial `len` parameters of the method.
         *
         * The returned function is curried and accepts `len + 1` parameters (or `method.length + 1`
         * when `len` is not specified), and the final parameter is the target object.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {string} name The name of the method to wrap.
         * @param {Object} obj The object to search for the `name` method.
         * @param [len] The desired arity of the wrapped method.
         * @return {Function} A new function or `undefined` if the specified method is not found.
         * @example
         *
         *
         * var charAt = ramda.invoker('charAt', String.prototype);
         * charAt(6, 'abcdefghijklm'); //=> 'g'
         *
         * var join = ramda.invoker('join', Array.prototype);
         * var firstChar = charAt(0);
         * join('', ramda.map(firstChar, ["light", "ampliifed", "stimulated", "emission", "radiation"]));
         * //=> 'laser'
         */
        var invoker = R.invoker = function _invoker(name, obj, len) {
            var method = obj[name];
            var length = len === void 0 ? method.length : len;
            return method && curry(function () {
                if (arguments.length) {
                    var target = Array.prototype.pop.call(arguments);
                    var targetMethod = target[name];
                    if (targetMethod == method) {
                        return targetMethod.apply(target, arguments);
                    }
                }
            }, length + 1);
        };

        /**
         * Accepts a function `fn` and any number of transformer functions and returns a new
         * function. When the new function is invoked, it calls the function `fn` with parameters
         * consisting of the result of calling each supplied handler on successive arguments to the
         * new function. For example:
         *
         * ```javascript
         *   var useWithExample = invoke(someFn, transformerFn1, transformerFn2);
         *
         *   // This invocation:
         *   useWithExample('x', 'y');
         *   // Is functionally equivalent to:
         *   someFn(transformerFn1('x'), transformerFn2('y'))
         * ```
         *
         * If more arguments are passed to the returned function than transformer functions, those
         * arguments are passed directly to `fn` as additional parameters. If you expect additional
         * arguments that don't need to be transformed, although you can ignore them, it's best to
         * pass an identity function so that the new function reports the correct arity.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to wrap.
         * @param {...Function} transformers A variable number of transformer functions
         * @return {Function} The wrapped function.
         * @example
         *
         * var double = function(y) { return y * 2; };
         * var square = function(x) { return x * x; };
         * var add = function(a, b) { return a + b; };
         * // Adds any number of arguments together
         * var addAll = function() {
         *   return ramda.reduce(add, 0, arguments);
         * };
         *
         * // Basic example
         * var addDoubleAndSquare = ramda.useWith(addAll, double, square);
         *
         * addDoubleAndSquare(10, 5); //≅ addAll(double(10), square(5));
         * //=> 125
         *
         * // Example of passing more arguments than transformers
         * addDoubleAndSquare(10, 5, 100); //≅ addAll(double(10), square(5), 100);
         * //=> 225
         *
         * // But if you're expecting additional arguments that don't need transformation, it's best
         * // to pass transformer functions so the resulting function has the correct arity
         * var addDoubleAndSquareWithExtraParams = ramda.useWith(addAll, double, square, ramda.identity);
         * addDoubleAndSquare(10, 5, 100); //≅ addAll(double(10), square(5), ramda.identity(100));
         * //=> 225
         */
        var useWith = R.useWith = function _useWith(fn /*, transformers */) {
            var transformers = _slice(arguments, 1);
            var tlen = transformers.length;
            return curry(arity(tlen, function () {
                var args = [], idx = -1;
                while (++idx < tlen) {
                    args.push(transformers[idx](arguments[idx]));
                }
                return fn.apply(this, args.concat(_slice(arguments, tlen)));
            }));
        };
        aliasFor('useWith').is('disperseTo');

        /**
         * Iterate over an input `list`, calling a provided function `fn` for each element in the
         * list.
         *
         * `fn` receives one argument: *(value)*.
         *
         * Note: `ramda.each` does not skip deleted or unassigned indices (sparse arrays), unlike
         * the native `Array.prototype.forEach` method. For more details on this behavior, see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
         *
         * Also note that, unlike `Array.prototype.forEach`, Ramda's `each` returns the original
         * array.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function to invoke. Receives one argument, `value`.
         * @param {Array} list The list to iterate over.
         * @return {Array} The original list.
         * @example
         *
         * ramda.each(function(num) {
         *   console.log(num + 100);
         * }, [1, 2, 3]); //=> [1, 2, 3]
         * //-> 101
         * //-> 102
         * //-> 103
         */
        function each(fn, list) {
            var idx = -1, len = list.length;
            while (++idx < len) {
                fn(list[idx]);
            }
            // i can't bear not to return *something*
            return list;
        }
        R.each = curry2(each);

        /**
         * Like `each`, but but passes additional parameters to the predicate function.
         *
         * `fn` receives three arguments: *(value, index, list)*.
         *
         * Note: `ramda.each.idx` does not skip deleted or unassigned indices (sparse arrays),
         * unlike the native `Array.prototype.forEach` method. For more details on this behavior,
         * see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
         *
         * Also note that, unlike `Array.prototype.forEach`, Ramda's `each` returns the original
         * array.
         *
         * @static
         * @memberOf R
         * @category List
         * @alias forEach
         * @param {Function} fn The function to invoke. Receives three arguments: (`value`, `index`,
         * `list`).
         * @param {Array} list The list to iterate over.
         * @return {Array} The original list.
         * @example
         *
         * // Note that having access to the original `list` allows for mutation. While you *can* do
         * // this, it's very un-functional behavior:
         * ramda.each.idx(function(num, idx, list) {
         *   list[idx] = num + 100;
         * }, [1, 2, 3]); //=> [101, 102, 103]
         */
        R.each.idx = curry2(function eachIdx(fn, list) {
            var idx = -1, len = list.length;
            while (++idx < len) {
                fn(list[idx], idx, list);
            }
            // i can't bear not to return *something*
            return list;
        });
        aliasFor("each").is("forEach");

        /**
         * Creates a shallow copy of an array.
         *
         * @static
         * @memberOf R
         * @category Array
         * @param {Array} list The list to clone.
         * @return {Array} A new copy of the original list.
         * @example
         *
         * var numbers = [1, 2, 3];
         * var numbersClone = ramda.clone(numbers); //=> [1, 2, 3]
         * numbers === numbersClone; //=> false
         *
         * // Note that this is a shallow clone--it does not clone complex values:
         * var objects = [{}, {}, {}];
         * var objectsClone = ramda.clone(objects);
         * objects[0] === objectsClone[0]; //=> true
         */
        var clone = R.clone = function _clone(list) {
            return _slice(list);
        };

        // Core Functions
        // --------------
        //

        /**
         * Reports whether an array is empty.
         *
         * @static
         * @memberOf R
         * @category Array
         * @param {Array} arr The array to consider.
         * @return {boolean} `true` if the `arr` argument has a length of 0 or if `arr` is a falsy
         * value (e.g. undefined).
         * @example
         *
         * ramda.isEmpty([1, 2, 3]); //=> false
         * ramda.isEmpty([]); //=> true
         * ramda.isEmpty(); //=> true
         * ramda.isEmpty(null); //=> true
         */
        function isEmpty(arr) {
            return !arr || !arr.length;
        }
        R.isEmpty = isEmpty;

        /**
         * Returns a new list with the given element at the front, followed by the contents of the
         * list.
         *
         * @static
         * @memberOf R
         * @category Array
         * @alias cons
         * @param {*} el The item to add to the head of the output list.
         * @param {Array} arr The array to add to the tail of the output list.
         * @return {Array} A new array.
         * @example
         *
         * ramda.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
         */
        function prepend(el, arr) {
            return concat([el], arr);
        }
        R.prepend = prepend;
        aliasFor("prepend").is("cons");

        /**
         * Returns the first element in a list.
         *
         * @static
         * @memberOf R
         * @category Array
         * @alias car, first
         * @param {Array} [arr=[]] The array to consider.
         * @return {*} The first element of the list, or `undefined` if the list is empty.
         * @example
         *
         * ramda.head(['fi', 'fo', 'fum']); //=> 'fi'
         */
        var head = R.head = function _car(arr) {
            arr = arr || [];
            return arr[0];
        };

        aliasFor("head").is("car").and("first");

        /**
         * Returns the last element from a list.
         *
         * @static
         * @memberOf R
         * @category Array
         * @param {Array} [arr=[]] The array to consider.
         * @return {*} The last element of the list, or `undefined` if the list is empty.
         * @example
         *
         * ramda.last(['fi', 'fo', 'fum']); //=> 'fum'
         */
        R.last = function _last(arr) {
            arr = arr || [];
            return arr[arr.length - 1];
        };

        /**
         * Returns all but the first element of a list. If the list provided has the `tail` method,
         * it will instead return `list.tail()`.
         *
         * @static
         * @memberOf R
         * @category Array
         * @alias cdr
         * @param {Array} [arr=[]] The array to consider.
         * @return {Array} A new array containing all but the first element of the input list, or an
         * empty list if the input list is a falsy value (e.g. `undefined`).
         * @example
         *
         * ramda.tail(['fi', 'fo', 'fum']); //=> ['fo', 'fum']
         */
        var tail = R.tail = checkForMethod('tail', function(arr) {
            arr = arr || [];
            return (arr.length > 1) ? _slice(arr, 1) : [];
        });

        aliasFor("tail").is("cdr");

        /**
         * Returns `true` if the argument is an atom; `false` otherwise. An atom is defined as any
         * value that is not an array, `undefined`, or `null`.
         *
         * @static
         * @memberOf R
         * @category Array
         * @param {*} x The element to consider.
         * @return {boolean} `true` if `x` is an atom, and `false` otherwise.
         * @example
         *
         * ramda.isAtom([]); //=> false
         * ramda.isAtom(null); //=> false
         * ramda.isAtom(undefined); //=> false
         *
         * ramda.isAtom(0); //=> true
         * ramda.isAtom(''); //=> true
         * ramda.isAtom('test'); //=> true
         * ramda.isAtom({}); //=> true
         */
        R.isAtom = function _isAtom(x) {
            return x != null && !isArray(x);
        };

        /**
         * Returns a new list containing the contents of the given list, followed by the given
         * element.
         *
         * @static
         * @memberOf R
         * @category Array
         * @alias push
         * @param {*} el The element to add to the end of the new list.
         * @param {Array} list The list whose contents will be added to the beginning of the output
         * list.
         * @return {Array} A new list containing the contents of the old list followed by `el`.
         * @example
         *
         * ramda.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
         * ramda.append('tests', []); //=> ['tests']
         * ramda.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
         */
        var append = R.append = function _append(el, list) {
            return concat(list, [el]);
        };

        aliasFor("append").is("push");

        /**
         * Returns a new list consisting of the elements of the first list followed by the elements
         * of the second.
         *
         * @static
         * @memberOf R
         * @category Array
         * @param {Array} list1 The first list to merge.
         * @param {Array} list2 The second set to merge.
         * @return {Array} A new array consisting of the contents of `list1` followed by the
         * contents of `list2`. If, instead of an {Array} for `list1`, you pass an object with a `concat`
         * method on it, `concat` will call `list1.concat` and it the value of `list2`.
         * @example
         *
         * ramda.concat([], []); //=> []
         * ramda.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
         * ramda.concat("ABC", "DEF"); // "ABCDEF"
         */
        R.concat = curry2(function(set1, set2) {
            return (hasMethod('concat', set1)) ? set1.concat(set2) : concat(set1, set2);
        });

        /**
         * A function that does nothing but return the parameter supplied to it. Good as a default
         * or placeholder function.
         *
         * @static
         * @memberOf R
         * @category Core
         * @alias I
         * @param {*} x The value to return.
         * @return {*} The input value, `x`.
         * @example
         *
         * ramda.identity(1); //=> 1
         *
         * var obj = {};
         * ramda.identity(obj) === obj; //=> true
         */
        var identity = R.identity = function _I(x) {
            return x;
        };
        aliasFor("identity").is("I");

        /**
         * Calls an input function `n` times, returning an array containing the results of those
         * function calls.
         *
         * `fn` is passed one argument: The current value of `n`, which begins at `0` and is
         * gradually incremented to `n - 1`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
         * @param {number} n A value between `0` and `n - 1`. Increments after each function call.
         * @return {Array} An array containing the return values of all calls to `fn`.
         * @example
         *
         * ramda.times(function(n) { return n; }, 5); //=> [0, 1, 2, 3, 4]
         */
        R.times = curry2(function _times(fn, n) {
            var arr = new Array(n);
            var i = -1;
            while (++i < n) {
                arr[i] = fn(i);
            }
            return arr;
        });


        /**
         * Returns a fixed list of size `n` containing a specified identical value.
         *
         * @static
         * @memberOf R
         * @category Array
         * @param {*} value The value to repeat.
         * @param {number} n The desired size of the output list.
         * @return {Array} A new array containing `n` `value`s.
         * @example
         *
         * ramda.repeatN('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
         *
         * var obj = {};
         * var repeatedObjs = ramda.repeatN(obj, 5); //=> [{}, {}, {}, {}, {}]
         * repeatedObjs[0] === repeatedObjs[1]; //=> true
         */
        R.repeatN = curry2(function _repeatN(value, n) {
            return R.times(R.always(value), n);
        });


        // Function functions :-)
        // ----------------------
        //
        // These functions make new functions out of old ones.

        /**
         * Returns a new function which partially applies a value to a given function, where the
         * function is a variadic function that cannot be curried.
         *
         * @private
         * @category Function
         * @param {Function} f The function to partially apply `a` onto.
         * @param {*} a The argument to partially apply onto `f`.
         * @return {Function} A new function.
         * @example
         *
         * var addThree = function(a, b, c) {
         *   return a + b + c;
         * };
         * var partialAdd = partially(add, 1);
         * partialAdd(2, 3); //=> 6
         *
         * // partialAdd is invoked immediately, even though it expects three arguments. This is
         * // because, unlike many functions here, the result of `partially` is not a curried
         * // function.
         * partialAdd(2); //≅ addThree(1, 2, undefined) => NaN
         */
        function partially(f, a){
            return function() {
                return f.apply(this, concat([a], arguments));
            };
        }

        // --------

        /**
         * Basic, right-associative composition function. Accepts two functions and returns the
         * composite function; this composite function represents the operation `var h = f(g(x))`,
         * where `f` is the first argument, `g` is the second argument, and `x` is whatever
         * argument(s) are passed to `h`.
         *
         * This function's main use is to build the more general `compose` function, which accepts
         * any number of functions.
         *
         * @private
         * @category Function
         * @param {Function} f A function.
         * @param {Function} g A function.
         * @return {Function} A new function that is the equivalent of `f(g(x))`.
         * @example
         *
         * var double = function(x) { return x * 2; };
         * var square = function(x) { return x * x; };
         * var squareThenDouble = internalCompose(double, square);
         *
         * squareThenDouble(5); //≅ double(square(5)) => 50
         */
        function internalCompose(f, g) {
            return function() {
                return f.call(this, g.apply(this, arguments));
            };
        }

        /**
         * Creates a new function that runs each of the functions supplied as parameters in turn,
         * passing the return value of each function invocation to the next function invocation,
         * beginning with whatever arguments were passed to the initial invocation.
         *
         * Note that `compose` is a right-associative function, which means the functions provided
         * will be invoked in order from right to left. In the example `var h = compose(f, g)`,
         * the function `h` is equivalent to `f( g(x) )`, where `x` represents the arguments
         * originally passed to `h`.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {...Function} functions A variable number of functions.
         * @return {Function} A new function which represents the result of calling each of the
         * input `functions`, passing the result of each function call to the next, from right to
         * left.
         * @example
         *
         * var triple = function(x) { return x * 3; };
         * var double = function(x) { return x * 2; };
         * var square = function(x) { return x * x; };
         * var squareThenDoubleThenTriple = ramda.compose(triple, double, square);
         *
         * squareThenDoubleThenTriple(5); //≅ triple(double(square(5))) => 150
         */
        var compose = R.compose = function _compose() {  // TODO: type check of arguments?
            switch (arguments.length) {
                case 0: throw NO_ARGS_EXCEPTION;
                case 1: return arguments[0];
                default:
                    var idx = arguments.length - 1, func = arguments[idx], fnArity = func.length;
                    while (idx--) {
                        func = internalCompose(arguments[idx], func);
                    }
                    return arity(fnArity, func);
            }
        };

        /**
         * Creates a new function that runs each of the functions supplied as parameters in turn,
         * passing the return value of each function invocation to the next function invocation,
         * beginning with whatever arguments were passed to the initial invocation.
         *
         * `pipe` is the mirror version of `compose`. `pipe` is left-associative, which means that
         * each of the functions provided is executed in order from left to right.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {...Function} functions A variable number of functions.
         * @return {Function} A new function which represents the result of calling each of the
         * input `functions`, passing the result of each function call to the next, from right to
         * left.
         * @example
         *
         * var triple = function(x) { return x * 3; };
         * var double = function(x) { return x * 2; };
         * var square = function(x) { return x * x; };
         * var squareThenDoubleThenTriple = ramda.pipe(square, double, triple);
         *
         * squareThenDoubleThenTriple(5); //≅ triple(double(square(5))) => 150
         */
        R.pipe = function _pipe() {  // TODO: type check of arguments?
            if (arguments.length == 1) {
                return partially (R.pipe, arguments[0]);
            }
            return compose.apply(this, _slice(arguments).reverse());
        };
        aliasFor("pipe").is("sequence");

        /**
         * Returns a new function much like the supplied one, except that the first two arguments'
         * order is reversed.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to invoke with its first two parameters reversed.
         * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
         * @example
         *
         * var mergeThree = function(a, b, c) {
         *   ([]).concat(a, b, c);
         * };
         * var numbers = [1, 2, 3];
         *
         * mergeThree(numbers); //=> [1, 2, 3]
         *
         * ramda.flip([1, 2, 3]); //=> [2, 1, 3]
         */
        var flip = R.flip = function _flip(fn) {
            return function (a, b) {
                return arguments.length < 2 ?
                  function(b) { return fn.apply(this, [b, a].concat(_slice(arguments, 1))); } :
                  fn.apply(this, [b, a].concat(_slice(arguments, 2)));
            };
        };

        /**
         * Accepts as its arguments a function and any number of values and returns a function that,
         * when invoked, calls the original function with all of the values prepended to the
         * original function's arguments list.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to invoke.
         * @param {...*} [args] Arguments to prepend to `fn` when the returned function is invoked.
         * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn`
         * with `args` prepended to `fn`'s arguments list.
         * @example
         *
         * var multiply = function(a, b) { return a * b; };
         * var double = ramda.lPartial(multiply, 2);
         *
         * double(2); //=> 4
         *
         *
         * var greet = function(salutation, title, firstName, lastName) {
         *   return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
         * };
         * var sayHello = ramda.lPartial(greet, 'Hello');
         * var sayHelloToMs = ramda.lPartial(sayHello, 'Ms.');
         *
         * sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
         */
        R.lPartial = function _lPartial(fn /*, args */) {
            var args = _slice(arguments, 1);
            return arity(Math.max(fn.length - args.length, 0), function () {
                return fn.apply(this, concat(args, arguments));
            });
        };
        aliasFor("lPartial").is("applyLeft");

        /**
         * Accepts as its arguments a function and any number of values and returns a function that,
         * when invoked, calls the original function with all of the values appended to the original
         * function's arguments list.
         *
         * Note that `rPartial` is the opposite of `lPartial`: `rPartial` fills `fn`'s arguments
         * from the right to the left.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to invoke.
         * @param {...*} [args] Arguments to append to `fn` when the returned function is invoked.
         * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn` with
         * `args` appended to `fn`'s arguments list.
         * @example
         *
         * var greet = function(salutation, title, firstName, lastName) {
         *   return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
         * };
         * var greetMsJaneJones = ramda.rPartial(greet, 'Ms.', 'Jane', 'Jones');
         *
         * greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
         */
        R.rPartial = function _rPartial(fn) {
            var args = _slice(arguments, 1);
            return arity(Math.max(fn.length - args.length, 0), function() {
                return fn.apply(this, concat(arguments, args));
            });
        };
        aliasFor("rPartial").is("applyRight");

        /**
         * Creates a new function that, when invoked, caches the result of calling `fn` for a given
         * argument set and returns the result. Subsequent calls to the memoized `fn` with the same
         * argument set will not result in an additional call to `fn`; instead, the cached result
         * for that set of arguments will be returned.
         *
         * Note that this version of `memoize` effectively handles only string and number
         * parameters.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to be wrapped by `memoize`.
         * @return {Function}  Returns a memoized version of `fn`.
         * @example
         *
         * var numberOfCalls = 0;
         * var tracedAdd = function(a, b) {
         *   numberOfCalls += 1;
         *   return a + b;
         * };
         * var memoTrackedAdd = ramda.memoize(trackedAdd);
         *
         * memoAdd(1, 2); //=> 3 (numberOfCalls => 1)
         * memoAdd(1, 2); //=> 3 (numberOfCalls => 1)
         * memoAdd(2, 3); //=> 5 (numberOfCalls => 2)
         *
         * // Note that argument order matters
         * memoAdd(2, 1); //=> 3 (numberOfCalls => 3)
         */
        R.memoize = function _memoize(fn) {
            var cache = {};
            return function () {
                var position = foldl(function (cache, arg) {
                        return cache[arg] || (cache[arg] = {});
                    }, cache,
                    _slice(arguments, 0, arguments.length - 1));
                var arg = arguments[arguments.length - 1];
                return (position[arg] || (position[arg] = fn.apply(this, arguments)));
            };
        };

        /**
         * Accepts a function `fn` and returns a function that guards invocation of `fn` such that
         * `fn` can only ever be called once, no matter how many times the returned function is
         * invoked.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to wrap in a call-only-once wrapper.
         * @return {Function} The wrapped function.
         * @example
         *
         * var alertOnce = ramda.once(alert);
         * alertOnce('Hello!'); // Alerts 'Hello!'
         * alertOnce('Nothing'); // Doesn't alert
         * alertOnce('Again'); // Doesn't alert
         */
        R.once = function _once(fn) {
            var called = false, result;
            return function () {
                if (called) {
                    return result;
                }
                called = true;
                result = fn.apply(this, arguments);
                return result;
            };
        };

        /**
         * Wrap a function inside another to allow you to make adjustments to the parameters, or do
         * other processing either before the internal function is called or with its results.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} fn The function to wrap.
         * @param {Function} wrapper The wrapper function.
         * @return {Function} The wrapped function.
         * @example
         *
         * var slashify = wrap(flip(add)('/'), function(f, x) {
         *  return match(/\/$/)(x) ? x : f(x)
         * });
         *
         * slashify("a") //= "a/"
         * slashify("a/") //= "a/"
         */
        R.wrap = function _wrap(fn, wrapper) {
            return function() {
                return wrapper.apply(this, concat([fn], arguments));
            };
        };

        /**
         * Wraps a constructor function inside a curried function that can be called with the same
         * arguments and returns the same type.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Function} Fn The constructor function to wrap.
         * @return {Function} A wrapped, curried constructor function.
         * @example
         *
         * // Constructor function
         * var Widget = function(config) {
         *   // ...
         * };
         * Widget.prototype = {
         *   // ...
         * };
         * map(construct(Widget), allConfigs); //=> a list of Widgets
         */
        R.construct = function _construct(Fn) {
            var f = function () {
                var obj = new Fn();
                Fn.apply(obj, arguments);
                return obj;
            };
            return Fn.length > 1 ? curry(nAry(Fn.length, f)) : f;
        };

        /**
         * Accepts three functions and returns a new function. When invoked, this new function will
         * invoke the first function, `after`, passing as its arguments the results of invoking the
         * second and third functions with whatever arguments are passed to the new function.
         *
         * For example, a function produced by `fork` is equivalent to:
         *
         * ```javascript
         *   var h = ramda.fork(e, f, g);
         *   h(1, 2); //≅ e( f(1, 2), g(1, 2) )
         * ```
         *
         * @static
         * @memberOf R
         * @category
         * @param {Function} after A function. `after` will be invoked with the return values of
         * `fn1` and `fn2` as its arguments.
         * @param {Function} fn1 A function. It will be invoked with the arguments passed to the
         * returned function. Afterward, its resulting value will be passed to `after` as its first
         * argument.
         * @param {Function} fn2 A function. It will be invoked with the arguments passed to the
         * returned function. Afterward, its resulting value will be passed to `after` as its second
         * argument.
         * @return {Function} A new function.
         * @example
         *
         * var add = function(a, b) { return a + b; };
         * var multiply = function(a, b) { return a * b; };
         * var subtract = function(a, b) { return a - b; };
         *
         * ramda.fork(multiply, add, subtract)(1, 2);
         * //≅ multiply( add(1, 2), subtract(1, 2) );
         * //=> -3
         */
        R.fork = function (after) {
            var fns = _slice(arguments, 1);
            return function () {
                var args = arguments;
                return after.apply(this, map(function (fn) {
                    return fn.apply(this, args);
                }, fns));
            };
        };
        aliasFor('fork').is('distributeTo');

        // List Functions
        // --------------
        //
        // These functions operate on logical lists, here plain arrays.  Almost all of these are curried, and the list
        // parameter comes last, so you can create a new function by supplying the preceding arguments, leaving the
        // list parameter off.  For instance:
        //
        //     // skip third parameter
        //     var checkAllPredicates = reduce(andFn, alwaysTrue);
        //     // ... given suitable definitions of odd, lt20, gt5
        //     var test = checkAllPredicates([odd, lt20, gt5]);
        //     // test(7) => true, test(9) => true, test(10) => false,
        //     // test(3) => false, test(21) => false,

        // --------

        /**
         * Returns a single item by iterating through the list, successively calling the iterator
         * function and passing it an accumulator value and the current value from the array, and
         * then passing the result to the next call.
         *
         * The iterator function receives two values: *(acc, value)*
         *
         * Note: `ramda.foldl` does not skip deleted or unassigned indices (sparse arrays), unlike
         * the native `Array.prototype.reduce` method. For more details on this behavior, see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @alias reduce
         * @param {Function} fn The iterator function. Receives two values, the accumulator and the
         * current element from the array.
         * @param {*} acc The accumulator value.
         * @param {Array} list The list to iterate over.
         * @return {*} The final, accumulated value.
         * @example
         *
         * var numbers = [1, 2, 3];
         * var add = function(a, b) {
         *   return a + b;
         * };
         *
         * foldl(numbers, add, 10); //=> 16
         */
        var foldl = R.foldl =  curry3(checkForMethod('foldl', function(fn, acc, list) {
            var idx = -1, len = list.length;
            while (++idx < len) {
                acc = fn(acc, list[idx]);
            }
            return acc;
        }));
        aliasFor("foldl").is("reduce");

        /**
         * Like `foldl`, but passes additional parameters to the predicate function.
         *
         * The iterator function receives four values: *(acc, value, index, list)*
         *
         * Note: `ramda.foldl.idx` does not skip deleted or unassigned indices (sparse arrays),
         * unlike the native `Array.prototype.reduce` method. For more details on this behavior,
         * see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The iterator function. Receives four values: the accumulator, the
         * current element from `list`, that element's index, and the entire `list` itself.
         * @param {*} acc The accumulator value.
         * @param {Array} list The list to iterate over.
         * @return {*} The final, accumulated value.
         * @example
         *
         * var letters = ['a', 'b', 'c'];
         * var objectify = function(accObject, elem, idx, list) {
         *   return accObject[elem] = idx;
         * };
         *
         * foldl.idx(letters, objectify, {}); //=> { 'a': 0, 'b': 1, 'c': 2 }
         */
        R.foldl.idx = curry3(checkForMethod('foldl', function(fn, acc, list) {
            var idx = -1, len = list.length;
            while (++idx < len) {
                acc = fn(acc, list[idx], idx, list);
            }
            return acc;
        }));

        /**
         * Returns a single item by iterating through the list, successively calling the iterator
         * function and passing it an accumulator value and the current value from the array, and
         * then passing the result to the next call.
         *
         * Similar to `foldl`, except moves through the input list from the right to the left.
         *
         * The iterator function receives two values: *(acc, value)*
         *
         * Note: `ramda.foldr` does not skip deleted or unassigned indices (sparse arrays), unlike
         * the native `Array.prototype.reduce` method. For more details on this behavior, see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @alias reduceRight
         * @param {Function} fn The iterator function. Receives two values, the accumulator and the
         * current element from the array.
         * @param {*} acc The accumulator value.
         * @param {Array} list The list to iterate over.
         * @return {*} The final, accumulated value.
         * @example
         *
         * var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
         * var flattenPairs = function(acc, pair) {
         *   return acc.concat(pair);
         * };
         *
         * foldr(numbers, flattenPairs, []); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
         */
        var foldr = R.foldr = curry3(checkForMethod('foldr', function(fn, acc, list) {
            var idx = list.length;
            while (idx--) {
                acc = fn(acc, list[idx]);
            }
            return acc;
        }));
        aliasFor("foldr").is("reduceRight");

        /**
         * Like `foldr`, but passes additional parameters to the predicate function. Moves through
         * the input list from the right to the left.
         *
         * The iterator function receives four values: *(acc, value, index, list)*.
         *
         * Note: `ramda.foldr.idx` does not skip deleted or unassigned indices (sparse arrays),
         * unlike the native `Array.prototype.reduce` method. For more details on this behavior,
         * see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The iterator function. Receives four values: the accumulator, the
         * current element from `list`, that element's index, and the entire `list` itself.
         * @param {*} acc The accumulator value.
         * @param {Array} list The list to iterate over.
         * @return {*} The final, accumulated value.
         * @example
         *
         * var letters = ['a', 'b', 'c'];
         * var objectify = function(accObject, elem, idx, list) {
         *   return accObject[elem] = idx;
         * };
         *
         * foldr.idx(letters, objectify, {}); //=> { 'c': 2, 'b': 1, 'a': 0 }
         */
        R.foldr.idx = curry3(checkForMethod('foldr', function(fn, acc, list) {
            var idx = list.length;
            while (idx--) {
                acc = fn(acc, list[idx], idx, list);
            }
            return acc;
        }));

        /**
         * Builds a list from a seed value. Accepts an iterator function, which returns either false
         * to stop iteration or an array of length 2 containing the value to add to the resulting
         * list and the seed to be used in the next call to the iterator function.
         *
         * The iterator function receives one argument: *(seed)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
         * either false to quit iteration or an array of length two to proceed. The element at index
         * 0 of this array will be added to the resulting array, and the element at index 1 will be
         * passed to the next call to `fn`.
         * @param {*} seed The seed value.
         * @return {Array} The final list.
         * @example
         *
         * var f = function(n) { return n > 50 ? false : [-n, n + 10] };
         * unfoldr(f, 10) //= [-10, -20, -30, -40, -50]
         */
        R.unfoldr = curry2(function _unfoldr(fn, seed) {
            var pair = fn(seed);
            var result = [];
            while (pair && pair.length) {
                result.push(pair[0]);
                pair = fn(pair[1]);
            }
            return result;
        });

        /**
         * Returns a new list, constructed by applying the supplied function to every element of the
         * supplied list.
         *
         * Note: `ramda.map` does not skip deleted or unassigned indices (sparse arrays), unlike the
         * native `Array.prototype.map` method. For more details on this behavior, see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function to be called on every element of the input `list`.
         * @param {Array} list The list to be iterated over.
         * @return {Array} The new list.
         * @example
         *
         * var double = function(x) {
         *   return x * 2;
         * };
         *
         * ramda.map(double, [1, 2, 3]); //=> [2, 4, 6]
         */
        function map(fn, list) {
            var idx = -1, len = list.length, result = new Array(len);
            while (++idx < len) {
                result[idx] = fn(list[idx]);
            }
            return result;
        }
        R.map = curry2(checkForMethod('map', map));

        /**
         * Like `map`, but but passes additional parameters to the predicate function.
         *
         * `fn` receives three arguments: *(value, index, list)*.
         *
         * Note: `ramda.map.idx` does not skip deleted or unassigned indices (sparse arrays), unlike
         * the native `Array.prototype.map` method. For more details on this behavior, see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function to be called on every element of the input `list`.
         * @param {Array} list The list to be iterated over.
         * @return {Array} The new list.
         * @example
         *
         * var squareEnds = function(elt, idx, list) {
         *   if (idx === 0 || idx === list.length - 1) {
         *     return elt * elt;
         *   }
         *   return elt;
         * };
         *
         * ramda.map.idx(squareEnds, [8, 6, 7, 5, 3, 0, 9];
         * //=> [64, 6, 7, 5, 3, 0, 81]
         */
        R.map.idx = curry2(checkForMethod('map', function _mapIdx(fn, list) {
            var idx = -1, len = list.length, result = new Array(len);
            while (++idx < len) {
                result[idx] = fn(list[idx], idx, list);
            }
            return result;
        }));

        /**
         * Map, but for objects. Creates an object with the same keys as `obj` and values
         * generated by running each property of `obj` through `fn`. `fn` is passed one argument:
         * *(value)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} fn A function called for each property in `obj`. Its return value will
         * become a new property on the return object.
         * @param {Object} obj The object to iterate over.
         * @return {Object} A new object with the same keys as `obj` and values that are the result
         * of running each property through `fn`.
         * @example
         *
         * var values = { x: 1, y: 2, z: 3 };
         * var double = function(num) {
         *   return num * 2;
         * };
         *
         * ramda.mapObj(double, values); //=> { x: 2, y: 4, z: 6 }
         */
        // TODO: consider mapObj.key in parallel with mapObj.idx.  Also consider folding together with `map` implementation.
        R.mapObj = curry2(function _mapObject(fn, obj) {
            return foldl(function (acc, key) {
                acc[key] = fn(obj[key]);
                return acc;
            }, {}, keys(obj));
        });

        /**
         * Like `mapObj`, but but passes additional arguments to the predicate function. The
         * predicate function is passed three arguments: *(value, key, obj)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} fn A function called for each property in `obj`. Its return value will
         * become a new property on the return object.
         * @param {Object} obj The object to iterate over.
         * @return {Object} A new object with the same keys as `obj` and values that are the result
         * of running each property through `fn`.
         * @example
         *
         * var values = { x: 1, y: 2, z: 3 };
         * var double = function(num, key, obj) {
         *   return key + num;
         * };
         *
         * ramda.mapObj(double, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
         */
        R.mapObj.idx = curry2(function mapObjectIdx(fn, obj) {
            return foldl(function (acc, key) {
                acc[key] = fn(obj[key], key, obj);
                return acc;
            }, {}, keys(obj));
        });

        /**
         * ap applies a list of functions to a list of values.
         *
         * @static
         * @memberOf R
         * @category Function
         * @param {Array} fns An array of functions
         * @param {Array} vs An array of values
         * @return the value of applying each the function `fns` to each value in `vs`
         * @example
         *
         * R.ap([R.multiply(2), R.add(3), [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
         */
        R.ap = curry2(checkForMethod('ap', function _ap(fns, vs) {
            return foldl(function(acc, fn) {
                return concat(acc, map(fn, vs));
            },  [], fns);
        }));

        /**
         *
         * `of` wraps any object in an Array. This implementation is compatible with the
         * Fantasy-land Applicative spec, and will work with types that implement that spec.
         * Note this `of` is different from the ES6 `of`; See
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
         *
         * @static
         * @memberOf R
         * @category Function
         * @param x any value
         * @return [x]
         * @example
         *
         * R.of(1); // => [1]
         * R.of([2]); // => [[2]]
         * R.of({}); // => [{}]
         *
         */
        R.of = function _of(x, container) {
            return (hasMethod('of', container)) ? container.of(x) : [x];
        };

        /**
         * `empty` wraps any object in an array. This implementation is compatible with the
         * Fantasy-land Monoid spec, and will work with types that implement that spec.
         *
         * @static
         * @memberOf R
         * @category Function
         * @return {Array} an empty array
         * @example
         *
         * R.empty([1,2,3,4,5]); // => []
         */
        R.empty = function _empty(x) {
            return (hasMethod('empty', x)) ? x.empty() : [];
        };


        /**
         * `chain` takes a function that maps a nested list to a nested list and a nested list.
         * It maps the function over the nested list and then flattens the result (one level deep,
         * i.e. not recursively).
         * This implementatiou is compatible with the
         * Fantasy-land Chain spec, and will work with types that implement that spec.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function}
         * @param {Array} a nested array
         * @return {Array}
         *
         * @eaxmple
         *
         * R.chain(R.map(R.multiply(2)), [[1,2,3], [1], [0, -3]]); // => [2,4,6,2,0,-6]
         *
         */
        R.chain = curry2(checkForMethod('chain', function _chain(f, nestedList) {
            return unnest(map(f, nestedList));
        }));
        aliasFor('chain').is('flatMap');

        // Reports the number of elements in the list
        /**
         * Returns the number of elements in the array by returning `arr.length`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} arr The array to inspect.
         * @return {number} The size of the array.
         * @example
         *
         * ramda.size([]); //=> 0
         * ramda.size([1, 2, 3]); //=> 3
         */
        R.size = function _size(arr) {
            return arr.length;
        };
        aliasFor('size').is('length');

        /**
         * Returns a new list containing only those items that match a given predicate function.
         * The predicate function is passed one argument: *(value)*.
         *
         * Note that `ramda.filter` does not skip deleted or unassigned indices, unlike the native
         * `Array.prototype.filter` method. For more details on this behavior, see:
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Description
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function called per iteration.
         * @param {Array} list The collection to iterate over.
         * @return {Array} The new filtered array.
         * @example
         *
         * var isEven = function(n) {
         *     return n % 2 === 0;
         * };
         * var evens = ramda.filter(isEven, [1, 2, 3, 4]); // => [2, 4]
         */
        var filter = function _filter(fn, list) {
            var idx = -1, len = list.length, result = [];
            while (++idx < len) {
                if (fn(list[idx])) {
                    result.push(list[idx]);
                }
            }
            return result;
        };

        R.filter = curry2(checkForMethod('filter', filter));

        /**
         * Like `filter`, but passes additional parameters to the predicate function. The predicate
         * function is passed three arguments: *(value, index, list)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function called per iteration.
         * @param {Array} list The collection to iterate over.
         * @return {Array} The new filtered array.
         * @example
         *
         * var lastTwo = function(val, idx, list) {
         *     return list.length - idx <= 2;
         * };
         * ramda.filter.idx(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [0, 9]
         */
        function filterIdx(fn, list) {
            var idx = -1, len = list.length, result = [];
            while (++idx < len) {
                if (fn(list[idx], idx, list)) {
                    result.push(list[idx]);
                }
            }
            return result;
        }
        R.filter.idx = curry2(checkForMethod('filter', filterIdx));

        /**
         * Similar to `filter`, except that it keeps only values for which the given predicate
         * function returns falsy. The predicate function is passed one argument: *(value)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function called per iteration.
         * @param {Array} list The collection to iterate over.
         * @return {Array} The new filtered array.
         * @example
         *
         * var isEven = function(n) {
         *     return n % 2 === 0;
         * };
         * var odds = ramda.reject(isOdd, [1, 2, 3, 4]); // => [2, 4]
         */
        var reject = function _reject(fn, list) {
            return filter(not(fn), list);
        };

        R.reject = curry2(reject);

        /**
         * Like `reject`, but passes additional parameters to the predicate function. The predicate
         * function is passed three arguments: *(value, index, list)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function called per iteration.
         * @param {Array} list The collection to iterate over.
         * @return {Array} The new filtered array.
         * @example
         *
         * var lastTwo = function(val, idx, list) {
         *     return list.length - idx <= 2;
         * };
         *
         * reject.idx(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [8, 6, 7, 5, 3]
         */
        R.reject.idx = curry2(function _rejectIdx(fn, list) {
            return filterIdx(not(fn), list);
        });

        /**
         * Returns a new list containing the first `n` elements of a given list, passing each value
         * to the supplied predicate function, and terminating when the predicate function returns
         * `false`. Excludes the element that caused the predicate function to fail. The predicate
         * function is passed one argument: *(value)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function called per iteration.
         * @param {Array} list The collection to iterate over.
         * @return {Array} A new array.
         * @example
         *
         * var isNotFour = function(x) {
         *   return !(x === 4);
         * };
         *
         * takeWhile(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
         */
        R.takeWhile = curry2(checkForMethod('takeWhile', function(fn, list) {
            var idx = -1, len = list.length;
            while (++idx < len && fn(list[idx])) {}
            return _slice(list, 0, idx);
        }));


        /**
         * Returns a new list containing the first `n` elements of the given list.  If
         * `n > * list.length`, returns a list of `list.length` elements.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {number} n The number of elements to return.
         * @param {Array} list The array to query.
         * @return {Array} A new array containing the first elements of `list`.
         */
        R.take = curry2(checkForMethod('take', function(n, list) {
            return _slice(list, 0, Math.min(n, list.length));
        }));

        /**
         * Returns a new list containing the last `n` elements of a given list, passing each value
         * to the supplied predicate function, beginning when the predicate function returns
         * `true`. Excludes the element that caused the predicate function to fail. The predicate
         * function is passed one argument: *(value)*.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function called per iteration.
         * @param {Array} list The collection to iterate over.
         * @return {Array} A new array.
         * @example
         *
         * var isNotTwo = function(x) {
         *   return !(x === 2);
         * };
         *
         * skipUntil(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
         */
        R.skipUntil = curry2(function _skipUntil(fn, list) {
            var idx = -1, len = list.length;
            while (++idx < len && !fn(list[idx])) {}
            return _slice(list, idx);
        });

        /**
         * Returns a new list containing all but the first `n` elements of the given `list`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {number} n The number of elements of `list` to skip.
         * @param {Array} list The array to consider.
         * @return {Array} The last `n` elements of `list`.
         */
        R.skip = curry2(checkForMethod('skip', function _skip(n, list) {
            return _slice(list, n);
        }));
        aliasFor('skip').is('drop');

        /**
         * Returns the first element of the list which matches the predicate, or `undefined` if no
         * element matches.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The predicate function used to determine if the element is the
         * desired one.
         * @param {Array} list The array to consider.
         * @return {Object} The element found, or `undefined`.
         * @example
         *
         * var xs = [{a: 1}, {a: 2}, {a: 3}];
         * find(propEq("a", 2))(xs); //= {a: 2}
         * find(propEq("a", 4))(xs); //= undefined
         */
        // Returns the first element of the list which matches the predicate, or `undefined` if no element matches.
        R.find = curry2(function find(fn, list) {
            var idx = -1;
            var len = list.length;
            while (++idx < len) {
                if (fn(list[idx])) {
                    return list[idx];
                }
            }
        });

        /**
         * Returns the index of the first element of the list which matches the predicate, or `-1`
         * if no element matches.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The predicate function used to determine if the element is the
         * desired one.
         * @param {Array} list The array to consider.
         * @return {number} The index of the element found, or `-1`.
         * @example
         *
         * var xs = [{a: 1}, {a: 2}, {a: 3}];
         * find(propEq("a", 2))(xs); //= 1
         * find(propEq("a", 4))(xs); //= -1
         */
        // Returns the index of first element of the list which matches the predicate, or `-1` if no
        // element matches.
        R.findIndex = curry2(function _findIndex(fn, list) {
            var idx = -1;
            var len = list.length;
            while (++idx < len) {
                if (fn(list[idx])) {
                    return idx;
                }
            }
            return -1;
        });

        /**
         * Returns the last element of the list which matches the predicate, or `undefined` if no
         * element matches.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The predicate function used to determine if the element is the
         * desired one.
         * @param {Array} list The array to consider.
         * @return {Object} The element found, or `undefined`.
         * @example
         *
         * var xs = [{a: 1, b: 0}, {a:1, b: 1}];
         * findLast(propEq("a", 1))(xs); //= {a: 1, b: 1}
         * findLast(propEq("a", 4))(xs); //= undefined
         */
        // Returns the last element of the list which matches the predicate, or `undefined` if no
        // element matches.
        R.findLast = curry2(function _findLast(fn, list) {
            var idx = list.length;
            while (--idx) {
                if (fn(list[idx])) {
                    return list[idx];
                }
            }
        });

        /**
         * Returns the index of the last element of the list which matches the predicate, or
         * `-1` if no element matches.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The predicate function used to determine if the element is the
         * desired one.
         * @param {Array} list The array to consider.
         * @return {number} The index of the element found, or `-1`.
         * @example
         *
         * var xs = [{a: 1, b: 0}, {a:1, b: 1}];
         * findLastIndex(propEq("a", 1))(xs); //= 1
         * findLastIndex(propEq("a", 4))(xs); //= -1
         */
        // Returns the last element of the list which matches the predicate, or `undefined` if no
        // element matches.
        R.findLastIndex = curry2(function _findLastIndex(fn, list) {
            var idx = list.length;
            while (--idx) {
                if (fn(list[idx])) {
                    return idx;
                }
            }
            return -1;
        });

        /**
         * Returns `true` if all elements of the list match the predicate, `false` if there are any
         * that don't.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The predicate function.
         * @param {Array} list The array to consider.
         * @return {boolean} `true` if the predicate is satisfied by every element, `false`
         * otherwise
         * @example
         *
         * var lessThan2 = flip(lt)(2);
         * var lessThan3 = flip(lt)(3);
         * var xs = range(1, 3); //= [1, 2]
         * all(lessThan2)(xs); //= false
         * all(lessThan3)(xs); //= true
         */
        // Returns `true` if all elements of the list match the predicate, `false` if there are any
        // that don't.
        function all(fn, list) {
            var i = -1;
            while (++i < list.length) {
                if (!fn(list[i])) {
                    return false;
                }
            }
            return true;
        }
        R.all = curry2(all);
        aliasFor("all").is("every");

        /**
         * Returns `true` if at least one of elements of the list match the predicate, `false`
         * otherwise.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The predicate function.
         * @param {Array} list The array to consider.
         * @return {boolean} `true` if the predicate is satisfied by at least one element, `false`
         * otherwise
         * @example
         *
         * var lessThan0 = flip(lt)(0);
         * var lessThan2 = flip(lt)(2);
         * var xs = range(1, 3); //= [1, 2]
         * any(lessThan0)(xs); //= false
         * any(lessThan2)(xs); //= true
         */
        function any(fn, list) {
            var i = -1;
            while (++i < list.length) {
                if (fn(list[i])) {
                    return true;
                }
            }
            return false;
        }
        R.any = curry2(any);
        aliasFor("any").is("some");

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Internal implementations of indexOf and lastIndexOf

        // Return the position of the first occurrence of an item in an array,
        // or -1 if the item is not included in the array.
        var indexOf = function _indexOf(array, item, from) {
            var i = 0, length = array.length;
            if (typeof from == 'number') {
                i = from < 0 ? Math.max(0, length + from) : from;
            }
            for (; i < length; i++) {
                if (array[i] === item) return i;
            }
            return -1;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        var lastIndexOf = function _lastIndexOf(array, item, from) {
            var idx = array.length;
            if (typeof from == 'number') {
                idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
            }
            while (--idx >= 0) {
                if (array[idx] === item) return idx;
            }
            return -1;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns the first zero-indexed position of an object in a flat list
        R.indexOf = curry2(function _indexOf(target, list) {
            return indexOf(list, target);
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        R.indexOf.from = curry3(function indexOfFrom(target, fromIdx, list) {
            return indexOf(list, target, fromIdx);
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns the last zero-indexed position of an object in a flat list
        R.lastIndexOf = curry2(function _lastIndexOf(target, list) {
            return lastIndexOf(list, target);
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        R.lastIndexOf.from = curry3(function lastIndexOfFrom(target, fromIdx, list) {
            return lastIndexOf(list, target, fromIdx);
        });

        /**
         * Returns `true` if the specified item is somewhere in the list, `false` otherwise.
         * Equivalent to `indexOf(a)(list) > -1`. Uses strict (`===`) equality checking.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Object} a The item to compare against.
         * @param {Array} list The array to consider.
         * @return {boolean} `true` if the item is in the list, `false` otherwise.
         * @example
         *
         * contains(3)([1, 2, 3]); //= true
         * contains(4)([1, 2, 3]); //= false
         * contains({})([{}, {}]); //= false
         * var obj = {};
         * contains(obj)([{}, obj, {}]); //= true
         */
        // Returns `true` if the list contains the sought element, `false` if it does not.  Equality
        // is strict here, meaning reference equality for objects and non-coercing equality for
        // primitives.
        function contains(a, list) {
            return indexOf(list, a) > -1;
        }
        R.contains = curry2(contains);


        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns `true` if the list contains the sought element, `false` if it does not, based upon the value
        // returned by applying the supplied predicated to two list elements.  Equality is strict here, meaning
        // reference equality for objects and non-coercing equality for primitives.  Probably inefficient.
        function containsWith(pred, x, list) {
            var idx = -1, len = list.length;
            while (++idx < len) {
                if (pred(x, list[idx])) {
                    return true;
                }
            }
            return false;
        }
        R.containsWith = curry3(containsWith);

        /**
         * Returns a new list containing only one copy of each element in the original list.
         * Equality is strict here, meaning reference equality for objects and non-coercing equality
         * for primitives.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list The array to consider.
         * @return {Array} The list of unique items.
         * @example
         *
         * uniq([1, 1, 2, 1]); //= [1, 2]
         * uniq([{}, {}]);     //= [{}, {}]
         * uniq([1, "1"]);     //= [1, "1"]
         */
        // Returns a new list containing only one copy of each element in the original list.
        // Equality is strict here, meaning reference equality for objects and non-coercing equality
        // for primitives.
        var uniq = R.uniq = function uniq(list) {
            var idx = -1, len = list.length;
            var result = [], item;
            while (++idx < len) {
                item = list[idx];
                if (!contains(item, result)) {
                    result.push(item);
                }
            }
            return result;
        };

        /**
         * Returns `true` if all elements are unique, otherwise `false`.
         * Uniquness is determined using strict equality (`===`).
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list The array to consider.
         * @return {boolean} `true` if all elements are unique, else `false`.
         * @example
         *
         * isSet(["1", 1]); //= true
         * isSet([1, 1]);   //= false
         * isSet([{}, {}]); //= true
         */
        // returns `true` if all of the elements in the `list` are unique.
        R.isSet = function _isSet(list) {
            var len = list.length;
            var i = -1;
            while (++i < len) {
                if (indexOf(list, list[i], i+1) >= 0) {
                    return false;
                }
            }
            return true;
        };

        /**
         * Returns a new list containing only one copy of each element in the original list, based
         * upon the value returned by applying the supplied predicate to two list elements. Prefers
         * the first item if two items compare equal based on the predicate.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list The array to consider.
         * @return {Array} The list of unique items.
         * @example
         *
         * var strEq = function(a, b) { return ("" + a) === ("" + b) };
         * uniqWith(strEq)([1, "1", 2, 1]); //= [1, 2]
         * uniqWith(strEq)([{}, {}]);       //= [{}]
         * uniqWith(strEq)([1, "1", 1]);    //= [1]
         * uniqWith(strEq)(["1", 1, 1]);    //= ["1"]
         */
        var uniqWith = R.uniqWith = curry2(function _uniqWith(pred, list) {
            var idx = -1, len = list.length;
            var result = [], item;
            while (++idx < len) {
                item = list[idx];
                if (!containsWith(pred, item, result)) {
                    result.push(item);
                }
            }
            return result;
        });


        /**
         * Returns a new list by plucking the same named property off all objects in the list supplied.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {string|number} key The key name to pluck off of each object.
         * @param {Array} list The array to consider.
         * @return {Array} The list of values for the given key.
         * @example
         *
         * pluck("a")([{a: 1}, {a: 2}]); //= [1, 2]
         * pluck(0)([[1, 2], [3, 4]]);   //= [1, 3]
         */
        // Returns a new list by plucking the same named property off all objects in the list supplied.
        var pluck = R.pluck = curry2(function _pluck(p, list) {
            return map(prop(p), list);
        });

        /**
         * `makeFlat` is a helper function that returns a one-level or fully recursive function
         * based on the flag passed in.
         *
         * @private
         *
         */
        var makeFlat = function _makeFlat(recursive) {
            return function __flatt(list) {
                var array, value, result = [], val, i = -1, j, ilen = list.length, jlen;
                while (++i < ilen) {
                    array = list[i];
                    if (isArrayLike(array)) {
                        value = (recursive) ? __flatt(array) : array;
                        j = -1;
                        jlen = value.length;
                        while (++j < jlen) {
                            result.push(value[j]);
                        }
                    } else {
                        result.push(array);
                    }
                }
                return result;
            };
        };

        /**
         * Returns a new list by pulling every item out of it (and all its sub-arrays) and putting
         * them in a new array, depth-first.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list The array to consider.
         * @return {Array} The flattened list.
         * @example
         *
         * flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
         * //= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
         */
        // Returns a list that contains a flattened version of the supplied list.  For example:
        //
        //     flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
        //     // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var flatten = R.flatten = makeFlat(true);
        aliasFor('flatten').is('flattenDeep');

        /**
         * Returns a new list by pulling every item at the first level of nesting out, and putting
         * them in a new array.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list The array to consider.
         * @return {Array} The flattened list.
         * @example
         *
         * flat([1, [2], [[3]]]);
         * //= [1, 2, [3]]
         * flat([[1, 2], [3, 4], [5, 6]]);
         * //= [1, 2, 3, 4, 5, 6]
         */
        var unnest = R.unnest = makeFlat(false);
        aliasFor('unnest').is('flattenShallow');

        /**
         * Creates a new list out of the two supplied by applying the function to each
         * equally-positioned pair in the lists.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function used to combine the two elements into one value.
         * @param {Array} list1 The first array to consider.
         * @param {Array} list2 The second array to consider.
         * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
         * using `fn`.
         * @example
         *
         * zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
         * //= [f(1, 'a'), f(2, 'b'), f(3, 'c')]
         */
        // Creates a new list out of the two supplied by applying the function to each
        // equally-positioned pair in the lists.  For example,
        //
        //     zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
        //     //= [f(1, 'a'), f(2, 'b'), f(3, 'c')]
        //
        // Note that the output list will only be as long as the length of the shorter input list.
        R.zipWith = curry3(function _zipWith(fn, a, b) {
            var rv = [], i = -1, len = Math.min(a.length, b.length);
            while (++i < len) {
                rv[i] = fn(a[i], b[i]);
            }
            return rv;
        });

        /**
         * Creates a new list out of the two supplied by pairing up equally-positioned items from
         * both lists. Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list1 The first array to consider.
         * @param {Array} list2 The second array to consider.
         * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
         * @example
         *
         * zip([1, 2, 3], ['a', 'b', 'c']);
         * //= [[1, 'a'], [2, 'b'], [3, 'c']]
         */
        // Creates a new list out of the two supplied by yielding the pair of each
        // equally-positioned pair in the lists.  For example,
        //
        //     zip([1, 2, 3], ['a', 'b', 'c']);
        //     //= [[1, 'a'], [2, 'b'], [3, 'c']]
        R.zip = curry2(function _zip(a, b) {
            var rv = [];
            var i = -1;
            var len = Math.min(a.length, b.length);
            while (++i < len) {
                rv[i] = [a[i], b[i]];
            }
            return rv;
        });

        /**
         * Creates a new object out of a list of keys and a list of values.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} keys The array that will be properties on the output object.
         * @param {Array} values The list of values on the output object.
         * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
         * @example
         *
         * zipObj(['a', 'b', 'c'], [1, 2, 3]);
         * //= {a: 1, b: 2, c: 3}
         */
        R.zipObj = curry2(function _zipObj(keys, values) {
            var i = -1, len = keys.length, out = {};
            while (++i < len) {
                out[keys[i]] = values[i];
            }
            return out;
        });

        /**
         * Creates a new object out of a list key-value pairs.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} An array of two-element arrays that will be the keys and values of the ouput object.
         * @return {Object} The object made by pairing up `keys` and `values`.
         * @example
         *
         * fromPairs([['a', 1], ['b', 2],  ['c', 3]]);
         * //= {a: 1, b: 2, c: 3}
         */
        R.fromPairs = function _fromPairs(pairs) {
            var i = -1, len = pairs.length, out = {};
            while (++i < len) {
                if (isArray(pairs[i]) && pairs[i].length) {
                    out[pairs[i][0]] = pairs[i][1];
                }
            }
            return out;
        };


        /**
         * Creates a new list out of the two supplied by applying the function
         * to each possible pair in the lists.
         *
         * @see xprod
         * @static
         * @memberOf R
         * @category List
         * @param {Function} fn The function to join pairs with.
         * @param {Array} as The first list.
         * @param {Array} bs The second list.
         * @return {Array} The list made by combining each possible pair from
         * `as` and `bs` using `fn`.
         * @example
         *
         * xProdWith(f, [1, 2], ['a', 'b'])
         * //= [f(1, 'a'), f(1, 'b'), f(2, 'a'), f(2, 'b')];
         */
        // Creates a new list out of the two supplied by applying the function
        // to each possible pair in the lists.  For example,
        //
        //     xProdWith(f, [1, 2], ['a', 'b'])
        //     //= [f(1, 'a'), f(1, 'b'), f(2, 'a'), f(2, 'b')];
        R.xprodWith = curry3(function _xprodWith(fn, a, b) {
            if (isEmpty(a) || isEmpty(b)) {
                return [];
            }
            // Better to push them all or to do `new Array(ilen * jlen)` and
            // calculate indices?
            var i = -1, ilen = a.length, j, jlen = b.length, result = [];
            while (++i < ilen) {
                j = -1;
                while (++j < jlen) {
                    result.push(fn(a[i], b[j]));
                }
            }
            return result;
        });

        /**
         * Creates a new list out of the two supplied by creating each possible
         * pair from the lists.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} as The first list.
         * @param {Array} bs The second list.
         * @return {Array} The list made by combining each possible pair from
         * `as` and `bs` into pairs (`[a, b]`).
         * @example
         *
         * xProdWith(f, [1, 2], ['a', 'b'])
         * //= [f(1, 'a'), f(1, 'b'), f(2, 'a'), f(2, 'b')];
         */
        // Creates a new list out of the two supplied by yielding the pair of
        // each possible pair in the lists.  For example,
        //
        //     xProd([1, 2], ['a', 'b']);
        //     //= [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
        R.xprod = curry2(function _xprod(a, b) { // = xprodWith(prepend); (takes about 3 times as long...)
            if (isEmpty(a) || isEmpty(b)) {
                return [];
            }
            var i = -1;
            var ilen = a.length;
            var j;
            var jlen = b.length;
            // Better to push them all or to do `new Array(ilen * jlen)` and calculate indices?
            var result = [];
            while (++i < ilen) {
                j = -1;
                while (++j < jlen) {
                    result.push([a[i], b[j]]);
                }
            }
            return result;
        });

        /**
         * Returns a new list with the same elements as the original list, just
         * in the reverse order.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {Array} list The list to reverse.
         * @return {Array} A copy of the list in reverse order.
         * @example
         *
         * reverse([1, 2, 3]);  //= [3, 2, 1]
         * reverse([1, 2]);     //= [2, 1]
         * reverse([1]);        //= [1]
         * reverse([]);         //= []
         */
        // Returns a new list with the same elements as the original list, just
        // in the reverse order.
        R.reverse = function _reverse(list) {
            return clone(list || []).reverse();
        };

        /**
         * Returns a list of numbers from `from` (inclusive) to `to`
         * (exclusive). In mathematical terms, `range(a, b)` is equivalent to
         * the half-open interval `[a, b)`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {number} from The first number in the list.
         * @param {number} to One more than the last number in the list.
         * @return {Array} The list of numbers in tthe set `[a, b)`.
         * @example
         *
         * range(1, 5);     //= [1, 2, 3, 4]
         * range(50, 53);   //= [50, 51, 52]
         */
        // Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
        // For example,
        //
        //     range(1, 5) // => [1, 2, 3, 4]
        //     range(50, 53) // => [50, 51, 52]
        R.range = curry2(function _range(from, to) {
            if (from >= to) {
                return [];
            }
            var idx = 0, result = new Array(Math.floor(to) - Math.ceil(from));
            for (; from < to; idx++, from++) {
                result[idx] = from;
            }
            return result;
        });

        /**
         * Returns a string made by inserting the `separator` between each
         * element and concatenating all the elements into a single string.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {string|number} separator The string used to separate the elements.
         * @param {Array} xs The elements to join into a string.
         * @return {string} The string made by concatenating `xs` with `separator`.
         * @example
         *
         * var spacer = join(" ");
         * spacer(["a", 2, 3.4]);   //= "a 2 3.4"
         * join("|", [1, 2, 3]);    //= "1|2|3"
         */
        // Returns the elements of the list as a string joined by a separator.
        R.join = invoker("join", Array.prototype);

        /**
         * Returns the elements from `xs` starting at `a` and ending at `b - 1`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {number} a The starting index.
         * @param {number} b One more than the ending index.
         * @param {Array} xs The list to take elements from.
         * @return {Array} The items from `a` to `b - 1` from `xs`.
         * @example
         *
         * var xs = range(0, 10);
         * slice(2, 5)(xs); //= [2, 3, 4]
         */
        // Returns the sublist of a list starting with the first index and
        // ending before the second one.
        R.slice = invoker("slice", Array.prototype);
        /**
         * Returns the elements from `xs` starting at `a` going to the end of `xs`.
         *
         * @static
         * @memberOf R
         * @category List
         * @param {number} a The starting index.
         * @param {Array} xs The list to take elements from.
         * @return {Array} The items from `a` to the end of `xs`.
         * @example
         *
         * var xs = range(0, 10);
         * slice.from(2)(xs); //= [2, 3, 4, 5, 6, 7, 8, 9]
         *
         * var ys = range(4, 8);
         * var tail = slice.from(1);
         * tail(xs); //= [5, 6, 7]
         */
        R.slice.from = flip(R.slice)(void 0);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Removes the sub-list of `list` starting at index `start` and containing
        // `count` elements.  _Note that this is not destructive_: it returns a
        // copy of the list with the changes.
        // <small>No lists have been harmed in the application of this function.</small>
        R.remove = curry3(function _remove(start, count, list) {
            return concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Inserts the supplied element into the list, at index `index`.  _Note
        // that this is not destructive_: it returns a copy of the list with the changes.
        // <small>No lists have been harmed in the application of this function.</small>
        R.insert = curry3(function _insert(index, elt, list) {
            index = index < list.length && index >= 0 ? index : list.length;
            return concat(append(elt, _slice(list, 0, index)), _slice(list, index));
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Inserts the sub-list into the list, at index `index`.  _Note  that this
        // is not destructive_: it returns a copy of the list with the changes.
        // <small>No lists have been harmed in the application of this function.</small>
        R.insert.all = curry3(function _insertAll(index, elts, list) {
            index = index < list.length && index >= 0 ? index : list.length;
            return concat(concat(_slice(list, 0, index), elts), _slice(list, index));
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Makes a comparator function out of a function that reports whether the first element is less than the second.
        //
        //     var cmp = comparator(function(a, b) {
        //         return a.age < b.age;
        //     };
        //     sort(cmp, people);
        var comparator = R.comparator = function _comparator(pred) {
            return function (a, b) {
                return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
            };
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a copy of the list, sorted according to the comparator function, which should accept two values at a
        // time and return a negative number if the first value is smaller, a positive number if it's larger, and zero
        // if they are equal.  Please note that this is a **copy** of the list.  It does not modify the original.
        var sort = R.sort = curry2(function sort(comparator, list) {
            return clone(list).sort(comparator);
        });

        // Splits a list into sublists stored in an object, based on the result of calling a String-returning function
        // on each element, and grouping the results according to values returned.
        //
        //     var byGrade = groupBy(function(student) {
        //         var score = student.score
        //         return (score < 65) ? 'F' : (score < 70) ? 'D' :
        //                (score < 80) ? 'C' : (score < 90) ? 'B' : 'A';
        //     };
        //     var students = [{name: "Abby", score: 84} /*, ... */,
        //                     {name: 'Jack', score: 69}];
        //     byGrade(students);
        //     //=> {
        //     //   "A": [{name: 'Dianne', score: 99} /*, ... */],
        //     //   "B": [{name: "Abby", score: 84} /*, ... */]
        //     //   /*, ... */
        //     //   "F": [{name: 'Eddy', score: 58}]
        //     // }

        /**
         * TODO: JSDoc-style documentation for this function
         */
        R.groupBy = curry2(function _groupBy(fn, list) {
            return foldl(function (acc, elt) {
                var key = fn(elt);
                acc[key] = append(elt, acc[key] || (acc[key] = []));
                return acc;
            }, {}, list);
        });

        // Takes a predicate and a list and returns the pair of lists of
        // elements which do and do not satisfy the predicate, respectively.

        /**
         * TODO: JSDoc-style documentation for this function
         */
        R.partition = curry2(function _groupBy(pred, list) {
            return foldl(function (acc, elt) {
                acc[pred(elt) ? 0 : 1].push(elt);
                return acc;
            }, [[], []], list);
        });

        // Object Functions
        // ----------------
        //
        // These functions operate on plain Javascript object, adding simple functions to test properties on these
        // objects.  Many of these are of most use in conjunction with the list functions, operating on lists of
        // objects.

        // --------

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Runs the given function with the supplied object, then returns the object.
        R.tap = curry2(function _tap(x, fn) {
            if (typeof fn === "function") { fn(x); }
            return x;
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Tests if two items are equal.  Equality is strict here, meaning reference equality for objects and
        // non-coercing equality for primitives.
        R.eq = function _eq(a, b) {
            return arguments.length < 2 ? function _eq(b) { return a === b; } : a === b;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a function that when supplied an object returns the indicated property of that object, if it exists.
        var prop = R.prop = function _prop(p, obj) {
            return arguments.length < 2 ? function _prop(obj) { return obj[p]; } :  obj[p];
        };
        aliasFor("prop").is("nth").and("get"); // TODO: are we sure?  Matches some other libs, but might want to reserve for other use.


        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a function that when supplied an object returns the result of running the indicated function on
        // that object, if it has such a function.
        R.func = function func(fn, obj) {
            function _func(obj) {
                return obj[fn].apply(obj, _slice(arguments, 1));
            }
            return arguments.length < 2 ? _func : _func(obj);
        };


        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a function that when supplied a property name returns that property on the indicated object, if it
        // exists.
        R.props = function _props(obj, prop) {
            return arguments.length < 2 ? function _props(prop) { return obj && obj[prop]; } : obj && obj[prop];
        };


        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a function that always returns the given value.
        var always = R.always = function _always(val) {
            return function () {
                return val;
            };
        };
        aliasFor("always").is("constant").and("K");


        /**
         * TODO: JSDoc-style documentation for this function
         */
        var anyBlanks = R.any(function _any(val) {
            return val == null;
        });

        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var nativeKeys = Object.keys;

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a list containing the names of all the enumerable own
        // properties of the supplied object.
        var keys = R.keys = function _keys(obj) {
            if (nativeKeys) return nativeKeys(Object(obj));
            var prop, ks = [];
            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    ks.push(prop);
                }
            }
            return ks;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a list containing the names of all the
        // properties of the supplied object, including prototype properties.
        R.keysIn = function _keysIn(obj) {
            var prop, ks = [];
            for (prop in obj) {
                ks.push(prop);
            }
            return ks;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a list of all the enumerable own properties of the supplied object.
        R.values = function _values(obj) {
            var prop, props = keys(obj),
                length = props.length,
                vals = new Array(length);
            for (var i = 0; i < length; i++) {
                vals[i] = obj[props[i]];
            }
            return vals;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a list of all the properties, including prototype properties,
        // of the supplied object.
        R.valuesIn = function _valuesIn(obj) {
            var prop, vs = [];
            for (prop in obj) {
                vs.push(obj[prop]);
            }
            return vs;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // internal helper function
        function pickWith(test, obj) {
            var copy = {},
                props = keys(obj), prop, val;
            for (var i = 0, len = props.length; i < len; i++) {
                prop = props[i];
                val = obj[prop];
                if (test(val, prop, obj)) {
                    copy[prop] = val;
                }
            }
            return copy;
        }

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a partial copy of an object containing only the keys specified.  If the key does not exist, the
        // property is ignored
        R.pick = curry2(function pick(names, obj) {
            return pickWith(function(val, key) {
                return contains(key, names);
            }, obj);
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns a partial copy of an object omitting the keys specified.
        R.omit = curry2(function omit(names, obj) {
            return pickWith(function(val, key) {
                return !contains(key, names);
            }, obj);
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        R.pickWith = curry2(pickWith);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Similar to `pick` except that this one includes a `key: undefined` pair for properties that don't exist.
        var pickAll = function _pickAll(names, obj) {
            var copy = {};
            each(function (name) {
                copy[name] = obj[name];
            }, names);
            return copy;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        R.pickAll = curry2(pickAll);


        /**
         * Assigns own enumerable properties of the other object to the destination
         * object prefering items in other.
         *
         * @private
         * @param {Object} object The destination object.
         * @param {Object} other The other object to merge with destination.
         * @returns {Object} Returns the destination object.
         *
         * @example
         * extend({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
         * // => { 'name': 'fred', 'age': 40 }
         */
        function extend(destination, other) {
            var props = keys(other),
                i = -1, length = props.length;
            while (++i < length) {
                destination[props[i]] = other[props[i]];
            }
            return destination;
        }

        /**
         * Create a new object with the own properties of a
         * merged with the own properties of object b.
         *
         * @static
         * @memberOf R
         * @category Object
         * @param {Object} a source object
         * @param {Object} b object with higher precendence in output
         * @returns {Object} Returns the destination object.
         *
         * @example
         * mixin({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
         * // => { 'name': 'fred', 'age': 40 }
         */
        R.mixin = curry2(function _mixin(a, b) {
            return extend(extend({}, a), b);
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Reports whether two functions have the same value for the specified property.  Useful as a curried predicate.
        R.eqProps = curry3(function eqProps(prop, obj1, obj2) {
            return obj1[prop] === obj2[prop];
        });


        /**
         * TODO: JSDoc-style documentation for this function
         */
        // internal helper for `where`
        function satisfiesSpec(spec, parsedSpec, testObj) {
            if (spec === testObj) { return true; }
            if (testObj == null) { return false; }
            parsedSpec.fn = parsedSpec.fn || [];
            parsedSpec.obj = parsedSpec.obj || [];
            var key, val, i = -1, fnLen = parsedSpec.fn.length, j = -1, objLen = parsedSpec.obj.length;
            while (++i < fnLen) {
                key = parsedSpec.fn[i];
                val = spec[key];
                //if (!hasOwnProperty.call(testObj, key)) {
                //    return false;
                //}
                if (!(key in testObj)) {
                    return false;
                }
                if (!val(testObj[key], testObj)) {
                    return false;
                }
            }
            while (++j < objLen) {
                key = parsedSpec.obj[j];
                if (spec[key] !== testObj[key]) {
                    return false;
                }
            }
            return true;
        }

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // `where` takes a spec object and a test object and returns true if the test satisfies the spec.
        // Any property on the spec that is not a function is interpreted as an equality
        // relation. For example:
        //
        //     var spec = {x: 2};
        //     where(spec, {w: 10, x: 2, y: 300}); // => true, x === 2
        //     where(spec, {x: 1, y: 'moo', z: true}); // => false, x !== 2
        //
        // If the spec has a property mapped to a function, then `where` evaluates the function, passing in
        // the test object's value for the property in question, as well as the whole test object. For example:
        //
        //     var spec = {x: function(val, obj) { return  val + obj.y > 10; };
        //     where(spec, {x: 2, y: 7}); // => false
        //     where(spec, {x: 3, y: 8}); // => true
        //
        // `where` is well suited to declarativley expressing constraints for other functions, e.g., `filter`:
        //
        //     var xs = [{x: 2, y: 1}, {x: 10, y: 2},
        //               {x: 8, y: 3}, {x: 10, y: 4}];
        //     var fxs = filter(where({x: 10}), xs);
        //     // fxs ==> [{x: 10, y: 2}, {x: 10, y: 4}]
        //
        R.where = function where(spec, testObj) {
            var parsedSpec = R.groupBy(function(key) {
                    return typeof spec[key] === "function" ? "fn" : "obj";
                }, keys(spec)
            );
            switch (arguments.length) {
                case 0: throw NO_ARGS_EXCEPTION;
                case 1:
                    return function(testObj) {
                        return satisfiesSpec(spec, parsedSpec, testObj);
                    };
            }
            return satisfiesSpec(spec, parsedSpec, testObj);
        };

        // Miscellaneous Functions
        // -----------------------
        //
        // A few functions in need of a good home.

        // --------

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Expose the functions from ramda as properties on another object.  If the passed-in object is the
        // global object, or the passed-in object is "falsy", then the ramda functions become global functions.
        R.installTo = function(obj) {
            return extend(obj || global, R);
        };

        R.is = curry2(function is(ctor, val) {
            return val != null && Object(val) instanceof ctor;
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A function that always returns `0`.
        R.alwaysZero = always(0);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A function that always returns `false`.
        R.alwaysFalse = always(false);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A function that always returns `true`.
        R.alwaysTrue = always(true);



        // Logic Functions
        // ---------------
        //
        // These functions are very simple wrappers around the built-in logical operators, useful in building up
        // more complex functional forms.

        // --------

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A function wrapping calls to the two functions in an `&&` operation, returning `true` or `false`.  Note that
        // this is short-circuited, meaning that the second function will not be invoked if the first returns a false-y
        // value.
        R.and = curry2(function and(f, g) {
            return function _and() {
                return !!(f.apply(this, arguments) && g.apply(this, arguments));
            };
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A function wrapping calls to the two functions in an `||` operation, returning `true` or `false`.  Note that
        // this is short-circuited, meaning that the second function will not be invoked if the first returns a truth-y
        // value.
        R.or = curry2(function or(f, g) {
            return function _or() {
                return !!(f.apply(this, arguments) || g.apply(this, arguments));
            };
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A function wrapping a call to the given function in a `!` operation.  It will return `true` when the
        // underlying function would return a false-y value, and `false` when it would return a truth-y one.
        var not = R.not = function _not(f) {
            return function() {return !f.apply(this, arguments);};
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Create a predicate wrapper which will call a pick function (all/any) for each predicate
        var predicateWrap = function _predicateWrap(predPicker) {
            return function(preds /* , args */) {
                var predIterator = function() {
                    var args = arguments;
                    return predPicker(function(predicate) {
                        return predicate.apply(null, args);
                    }, preds);
                };
                return arguments.length > 1 ?
                        // Call function imediately if given arguments
                        predIterator.apply(null, _slice(arguments, 1)) :
                        // Return a function which will call the predicates with the provided arguments
                        arity(max(pluck("length", preds)), predIterator);
            };
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Given a list of predicates returns a new predicate that will be true exactly when all of them are.
        R.allPredicates = predicateWrap(all);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Given a list of predicates returns a new predicate that will be true exactly when any one of them is.
        R.anyPredicates = predicateWrap(any);

        // Arithmetic Functions
        // --------------------
        //
        // These functions wrap up the certain core arithmetic operators

        // --------

        /**
         * Adds two numbers (or strings). Equivalent to `a + b` but curried.
         *
         * @static
         * @memberOf R
         * @param {number|string} a The first value.
         * @param {number|string} b The second value.
         * @return {number|string} The result of `a + b`.
         * @example
         *
         * var increment = add(1);
         * increment(10);   //= 11
         * add(2, 3);       //=  5
         * add(7)(10);      //= 17
         */
        // Adds two numbers (or strings). Equivalent to `a + b` but curried.
        //
        //     var increment = add(1);
        //     increment(10);   //= 11
        //     add(2, 3);       //=  5
        //     add(7)(10);      //= 17
        var add = R.add = function _add(a, b) {
            return arguments.length < 2 ? function(b) { return a + b; } :  a + b;
        };

        /**
         * Multiplies two numbers. Equivalent to `a * b` but curried.
         *
         * @static
         * @memberOf R
         * @param {number} a The first value.
         * @param {number} b The second value.
         * @return {number} The result of `a * b`.
         * @example
         *
         * var double = multiply(2);
         * var triple = multiply(3);
         * double(3);       //=  6
         * triple(4);       //= 12
         * multiply(2, 5);  //= 10
         */
        // Multiplies two numbers. Equivalent to `a * b` but curried.
        //
        //     var double = multiply(2);
        //     var triple = multiply(3);
        //     double(3);       //=  6
        //     triple(4);       //= 12
        //     multiply(2, 5);  //= 10
        var multiply = R.multiply = function _multiply(a, b) {
            return arguments.length < 2 ? function(b) { return a * b; } :  a * b;
        };

        /**
         * Subtracts two numbers. Equivalent to `a - b` but curried.
         *
         * @static
         * @memberOf R
         * @see subtractN
         * @param {number} a The first value.
         * @param {number} b The second value.
         * @return {number} The result of `a - b`.
         * @example
         *
         * var complementaryAngle = subtract(90);
         * complementaryAngle(30); //= 60
         *
         * var theRestOf = subtract(1);
         * theRestOf(0.25); //= 0.75
         *
         * subtract(10)(8); //= 2
         */
        // Subtracts the second parameter from the first.  This is
        // automatically curried, and while at times the curried version might
        // be useful, often the curried version of `subtractN` might be what's
        // wanted.
        //
        //     var complementaryAngle = subtract(90);
        //     complementaryAngle(30); //= 60
        var subtract = R.subtract = function _subtract(a, b) {
            return arguments.length < 2 ? function(b) { return a - b; } :  a - b;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        /**
         * Subtracts two numbers in reverse order. Equivalent to `b - a` but
         * curried. Probably more useful when partially applied than
         * `subtract`.
         *
         * @static
         * @memberOf R
         * @param {number} a The first value.
         * @param {number} b The second value.
         * @return {number} The result of `a - b`.
         * @example
         *
         * var complementaryAngle = subtract(90);
         * complementaryAngle(30); //= 60
         *
         * var theRestOf = subtract(1);
         * theRestOf(0.25); //= 0.75
         *
         * subtract(10)(8); //= 2
         */
        // Reversed version of `subtract`, where first parameter is subtracted
        // from the second.  The curried version of this one might me more
        // useful than that of `subtract`.  For instance:
        //
        //     var decrement = subtractN(1);
        //     decrement(10);   //= 9;
        //     subtractN(2)(5); //= 3
        R.subtractN = flip(subtract);

        /**
         * Divides two numbers. Equivalent to `a / b`.
         *
         * @static
         * @memberOf R
         * @see divideBy
         * @param {number} a The first value.
         * @param {number} b The second value.
         * @return {number} The result of `a / b`.
         * @example
         *
         * var reciprocal = divide(1);
         * reciprocal(4);   //= 0.25
         * divide(71, 100); //= 0.71
         */
        // Divides the first parameter by the second.  This is automatically
        // curried, and while at times the curried
        // version might be useful, often the curried version of `divideBy` might be what's wanted.
        var divide = R.divide = function _divide(a, b) {
            return arguments.length < 2 ? function(b) { return a / b; } :  a / b;
        };

        /**
         * Divides two numbers in reverse order. Equivalent to `b / a`.
         *
         * @static
         * @memberOf R
         * @param {number} a The second value.
         * @param {number} b The first value.
         * @return {number} The result of `b / a`.
         * @example
         *
         * var half = divideBy(2);
         * half(42); // => 21
         */
        // Reversed version of `divide`, where the second parameter is divided by the first.  The curried version of
        // this one might be more useful than that of `divide`.  For instance:
        //
        //     var half = divideBy(2);
        //     half(42); // => 21
        R.divideBy = flip(divide);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Divides the second parameter by the first and returns the remainder.
        var modulo = R.modulo = function _modulo(a, b) {
            return arguments.length < 2 ? function(b) { return a % b; } :  a % b;
        };


        /**
         * Determine if the passed argument is an integer.
         *
         * @private
         * @param n
         * @return {Boolean}
         */
        var isInteger = Number.isInteger || function isInteger(n) {
            return (n << 0) === n;
        };

        /**
         * mathMod behaves like the modulo operator should mathematically, unlike the `%`
         * operator (and by extension, ramda.modulo). So while "-17 % 5" is -2,
         * mathMod(-17, 5) is 3. mathMod requires Integer arguments, and returns NaN
         * when the modulus is zero or negative.
         *
         * @static
         * @memberOf R
         * @param {number} m The dividend.
         * @param {number} p the modulus.
         * @return {number} The result of `b mod a`.
         * @example
         *
         * mathMod(-17, 5)  // 3
         * mathMod(17, 5)   // 2
         * mathMod(17, -5)  // NaN
         * mathMod(17, 0)   // NaN
         * mathMod(17.2, 5) // NaN
         * mathMod(17, 5.3) // NaN
         */
        R.mathMod = curry2(function _mathMod(m, p) {
            if (!isInteger(m) || m < 1) { return NaN; }
            if (!isInteger(p)) { return NaN; }
            return ((m % p) + p) % p;
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Reversed version of `modulo`, where the second parameter is divided by the first.  The curried version of
        // this one might be more useful than that of `modulo`.  For instance:
        //
        //     var isOdd = moduloBy(2);
        //     isOdd(42); // => 0
        //     isOdd(21); // => 1
        R.moduloBy = flip(modulo);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Adds together all the elements of a list.
        R.sum = foldl(add, 0);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Multiplies together all the elements of a list.
        R.product = foldl(multiply, 1);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns true if the first parameter is less than the second.
        R.lt = function _lt(a, b) {
            return arguments.length < 2 ? function(b) { return a < b; } :  a < b;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns true if the first parameter is less than or equal to the second.
        R.lte = function _lte(a, b) {
            return arguments.length < 2 ? function(b) { return a <= b; } :  a <= b;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns true if the first parameter is greater than the second.
        R.gt = function _gt(a, b) {
            return arguments.length < 2 ? function(b) { return a > b; } :  a > b;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Returns true if the first parameter is greater than or equal to the second.
        R.gte = function _gte(a, b) {
            return arguments.length < 2 ? function(b) { return a >= b; } :  a >= b;
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Determines the largest of a list of numbers (or elements that can be cast to numbers)
        var max = R.max = function _max(list) {
            return foldl(binary(Math.max), -Infinity, list);
        };

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Determines the largest of a list of items as determined by pairwise comparisons from the supplied comparator
        R.maxWith = curry2(function _maxWith(keyFn, list) {
            if (!(list && list.length > 0)) {
               return;
            }
            var idx = 0, winner = list[idx], max = keyFn(winner), testKey;
            while (++idx < list.length) {
                testKey = keyFn(list[idx]);
                if (testKey > max) {
                    max = testKey;
                    winner = list[idx];
                }
            }
            return winner;
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // TODO: combine this with maxWith?

        // Determines the smallest of a list of items as determined by pairwise comparisons from the supplied comparator
        R.minWith = curry2(function _minWith(keyFn, list) {
            if (!(list && list.length > 0)) {
                return;
            }
            var idx = 0, winner = list[idx], min = keyFn(list[idx]), testKey;
            while (++idx < list.length) {
                testKey = keyFn(list[idx]);
                if (testKey < min) {
                    min = testKey;
                    winner = list[idx];
                }
            }
            return winner;
        });


        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Determines the smallest of a list of numbers (or elements that can be cast to numbers)
        R.min = function _min(list) {
            return foldl(binary(Math.min), Infinity, list);
        };


        // String Functions
        // ----------------
        //
        // Much of the String.prototype API exposed as simple functions.

        // --------

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // A substring of a String:
        //
        //     substring(2, 5, "abcdefghijklm"); //=> "cde"
        var substring = R.substring = invoker("substring", String.prototype);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // The trailing substring of a String starting with the nth character:
        //
        //     substringFrom(8, "abcdefghijklm"); //=> "ijklm"
        R.substringFrom = flip(substring)(void 0);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // The leading substring of a String ending before the nth character:
        //
        //     substringTo(8, "abcdefghijklm"); //=> "abcdefgh"
        R.substringTo = substring(0);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // The character at the nth position in a String:
        //
        //     charAt(8, "abcdefghijklm"); //=> "i"
        R.charAt = invoker("charAt", String.prototype);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // The ascii code of the character at the nth position in a String:
        //
        //     charCodeAt(8, "abcdefghijklm"); //=> 105
        //     // (... 'a' ~ 97, 'b' ~ 98, ... 'i' ~ 105)
        R.charCodeAt = invoker("charCodeAt", String.prototype);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Tests a regular expression agains a String
        //
        //     match(/([a-z]a)/g, "bananas"); //=> ["ba", "na", "na"]
        R.match = invoker("match", String.prototype);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Finds the index of a substring in a string, returning -1 if it's not present
        //
        //     strIndexOf('c', 'abcdefg) //=> 2
        R.strIndexOf = invoker("indexOf", String.prototype);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Finds the last index of a substring in a string, returning -1 if it's not present
        //
        //     strLastIndexOf('a', 'banana split') //=> 5
        R.strLastIndexOf = invoker("lastIndexOf", String.prototype);

        /**
         * The upper case version of a string.
         *
         * @static
         * @memberOf R
         * @param {string} str The string to upper case.
         * @return {string} The upper case version of `str`.
         * @example
         * toUpperCase('abc') //= 'ABC'
         */
        // The upper case version of a string.
        //
        //     toUpperCase('abc') //= 'ABC'
        R.toUpperCase = invoker("toUpperCase", String.prototype);

        /**
         * The lower case version of a string.
         *
         * @static
         * @memberOf R
         * @param {string} str The string to lower case.
         * @return {string} The lower case version of `str`.
         * @example
         * toLowerCase('XYZ') //= 'xyz'
         */
        // The lower case version of a string.
        //
        //     toLowerCase('XYZ') //= 'xyz'
        R.toLowerCase = invoker("toLowerCase", String.prototype);


        /**
         * Splits a string into an array of strings based on the given
         * separator.
         *
         * @static
         * @memberOf R
         * @param {string} sep The separator string.
         * @param {string} str The string to separate into an array.
         * @return {Array} The array of strings from `str` separated by `str`.
         * @example
         *
         * var pathComponents = split('/');
         * pathComponents('/usr/local/bin/node');
         * //= ['usr', 'local', 'bin', 'node']
         *
         * split('.', 'a.b.c.xyz.d');
         * //= ['a', 'b', 'c', 'xyz', 'd']
         */
        // Splits a string into an array of strings based on the given
        // separator.
        //
        //     var pathComponents = split('/');
        //     pathComponents('/usr/local/bin/node');
        //     //= ['usr', 'local', 'bin', 'node']
        //
        //     split('.', 'a.b.c.xyz.d');
        //     //= ['a', 'b', 'c', 'xyz', 'd']
        R.split = invoker("split", String.prototype, 1);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // internal path function
        // Takes an array, paths, indicating the deep set of keys
        // to find. E.g.
        // path(['a', 'b'], {a: {b: 2}}) // => 2
        function path(paths, obj) {
            var i = -1, length = paths.length, val;
            if (obj == null) { return; }
            val = obj;
            while (val != null && ++i < length) {
                val = val[paths[i]];
            }
            return val;
        }

        /**
         * Retrieve a nested path on an object seperated by the specified
         * separator value.
         *
         * @static
         * @memberOf R
         * @param {string} sep The separator to use in `path`.
         * @param {string} path The path to use.
         * @return {*} The data at `path`.
         * @example
         * pathOn('/', 'a/b/c', {a: {b: {c: 3}}}) //= 3
         */
        // Retrieve a nested path on an object seperated by the specified
        // separator value.
        //
        //     pathOn('/', 'a/b/c', {a: {b: {c: 3}}}) //= 3
        R.pathOn = curry3(function pathOn(sep, str, obj) {
            return path(str.split(sep), obj);
        });

        /**
         * Retrieve a nested path on an object seperated by periods
         *
         * @static
         * @memberOf R
         * @param {string} path The dot path to use.
         * @return {*} The data at `path`.
         * @example
         * path('a.b', {a: {b: 2}}) //= 2
         */
        // Retrieve a nested path on an object seperated by periods
        // R.path('a.b', {a: {b: 2}}) //= 2
        R.path = R.pathOn('.');

        // Data Analysis and Grouping Functions
        // ------------------------------------
        //
        // Functions performing SQL-like actions on lists of objects.  These do
        // not have any SQL-like optimizations performed on them, however.

        // --------

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Reasonable analog to SQL `select` statement.
        //
        //     var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2},
        //     var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7}
        //     var kids = [abby, fred];
        //     project(['name', 'grade'], kids);
        //     //= [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
        R.project = useWith(map, R.pickAll, identity); // passing `identity` gives correct arity

        /**
         * Determines whether the given property of an object has a specific
         * value according to strict equality (`===`).  Most likely used to
         * filter a list:
         *
         * @static
         * @memberOf R
         * @param {string|number} name The property name (or index) to use.
         * @param {*} val The value to compare the property with.
         * @return {boolean} `true` if the properties are equal, `false` otherwise.
         * @example
         *
         * var abby = {name: 'Abby', age: 7, hair: 'blond'};
         * var fred = {name: 'Fred', age: 12, hair: 'brown'};
         * var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
         * var alois = {name: 'Alois', age: 15, disposition: 'surly'};
         * var kids = [abby, fred, rusty, alois];
         * var hasBrownHair = propEq("hair", "brown");
         * filter(hasBrownHair, kids); //= [fred, rusty]
         */
        // Determines whether the given property of an object has a specific value
        // Most likely used to filter a list:
        //
        //     var abby = {name: 'Abby', age: 7, hair: 'blond'};
        //     var fred = {name: 'Fred', age: 12, hair: 'brown'};
        //     var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
        //     var alois = {name: 'Alois', age: 15, disposition: 'surly'};
        //     var kids = [abby, fred, rusty, alois];
        //     var hasBrownHair = propEq("hair", "brown");
        //     filter(hasBrownHair, kids); //= [fred, rusty]
        R.propEq = curry3(function propEq(name, val, obj) {
            return obj[name] === val;
        });

        /**
         * Combines two lists into a set (i.e. no duplicates) composed of the
         * elements of each list.
         *
         * @static
         * @memberOf R
         * @param {Array} as The first list.
         * @param {Array} bs The second list.
         * @return {Array} The first and second lists concatenated, with
         * duplicates removed.
         * @example
         *
         * union([1, 2, 3], [2, 3, 4]); //= [1, 2, 3, 4]
         */
        // Combines two lists into a set (i.e. no duplicates) composed of the
        // elements of each list.
        R.union = compose(uniq, R.concat);

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Combines two lists into a set (i.e. no duplicates) composed of the elements of each list.  Duplication is
        // determined according to the value returned by applying the supplied predicate to two list elements.
        R.unionWith = curry3(function _unionWith(pred, list1, list2) {
            return uniqWith(pred, concat(list1, list2));
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list.
        R.difference = curry2(function _difference(first, second) {
            return uniq(reject(flip(contains)(second), first));
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list.
        // Duplication is determined according to the value returned by applying the supplied predicate to two list
        // elements.
        R.differenceWith = curry3(function differenceWith(pred, first, second) {
            return uniqWith(pred)(reject(flip(R.containsWith(pred))(second), first));
        });

        // Combines two lists into a set (i.e. no duplicates) composed of those elements common to both lists.
        R.intersection = curry2(function intersection(list1, list2) {
            return uniq(filter(flip(contains)(list1), list2));
        });

        /**
         * TODO: JSDoc-style documentation for this function
         */
        // Combines two lists into a set (i.e. no duplicates) composed of those elements common to both lists.
        // Duplication is determined according to the value returned by applying the supplied predicate to two list
        // elements.
        R.intersectionWith = curry3(function intersectionWith(pred, list1, list2) {
            var results = [], idx = -1;
            while (++idx < list1.length) {
                if (containsWith(pred, list1[idx], list2)) {
                    results[results.length] = list1[idx];
                }
            }
            return uniqWith(pred, results);
        });

        /**
         * Creates a new list whose elements each have two properties: `val` is
         * the value of the corresponding item in the list supplied, and `key`
         * is the result of applying the supplied function to that item.
         *
         * @static
         * @private
         */
        // Creates a new list whose elements each have two properties: `val` is
        // the value of the corresponding item in the list supplied, and `key`
        // is the result of applying the supplied function to that item.
        function keyValue(fn, list) { // TODO: Should this be made public?
            return map(function(item) {return {key: fn(item), val: item};}, list);
        }

        /**
         * Sorts the list according to a key generated by the supplied function.
         *
         * @static
         * @memberOf R
         * @param {Function} fn The function mapping `list` items to keys.
         * @param {Array} list The list to sort.
         * @return {Array} A new list sorted by the keys generated by `fn`.
         * @example
         *
         * var sortByFirstItem = sortBy(nth(0));
         * var sortByNameCaseInsensitive = sortBy(compose(toLowerCase, prop("name")));
         * var pairs = [[-1, 1], [-2, 2], [-3, 3]];
         * sortByFirstItem(pairs); //= [[-3, 3], [-2, 2], [-1, 1]]
         * var alice = {
         *      name: "ALICE",
         *      age: 101
         * };
         * var bob = {
         *      name: "Bob",
         *      age: -10
         * };
         * var clara = {
         *      name: "clara",
         *      age: 314.159
         * };
         * var people = [clara, bob, alice];
         * sortByNameCaseInsensitive(people); //= [alice, bob, clara]
         */
        // Sorts the list according to a key generated by the supplied function.
        R.sortBy = curry2(function sortyBy(fn, list) {
            /*
              return sort(comparator(function(a, b) {return fn(a) < fn(b);}), list); // clean, but too time-inefficient
              return pluck("val", sort(comparator(function(a, b) {return a.key < b.key;}), keyValue(fn, list))); // nice, but no need to clone result of keyValue call, so...
            */
            return pluck("val", keyValue(fn, list).sort(comparator(function(a, b) {return a.key < b.key;})));
        });

        /**
         * Counts the elements of a list according to how many match each value
         * of a key generated by the supplied function. Returns an object
         * mapping the keys produced by `fn` to the number of occurrences in
         * the list. Note that all keys are coerced to strings because of how
         * JavaScript objects work.
         *
         * @static
         * @memberOf R
         * @param {Function} fn The function used to map values to keys.
         * @param {Array} list The list to count elements from.
         * @return {Object} An object mapping keys to number of occurrences in the list.
         * @example
         *
         * var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
         * var letters = split("", "abcABCaaaBBc");
         * countBy(Math.floor)(numbers);    //= {"1": 3, "2": 2, "3": 1}
         * countBy(toLowerCase)(letters);   //= {"a": 5, "b": 4, "c": 3}
         */
        // Counts the elements of a list according to how many match each value
        // of a key generated by the supplied function.
        R.countBy = curry2(function countBy(fn, list) {
            return foldl(function(counts, obj) {
                counts[obj.key] = (counts[obj.key] || 0) + 1;
                return counts;
            }, {}, keyValue(fn, list));
        });

        // All the functional goodness, wrapped in a nice little package, just for you!
        return R;
    }());
}));

},{}],2:[function(require,module,exports){
/* SockJS client, version 0.3.4, http://sockjs.org, MIT License

Copyright (c) 2011-2012 VMware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSON2 by Douglas Crockford (minified).
var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()


//     [*] Including lib/index.js
// Public object
SockJS = (function(){
              var _document = document;
              var _window = window;
              var utils = {};


//         [*] Including lib/reventtarget.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */
var REventTarget = function() {};
REventTarget.prototype.addEventListener = function (eventType, listener) {
    if(!this._listeners) {
         this._listeners = {};
    }
    if(!(eventType in this._listeners)) {
        this._listeners[eventType] = [];
    }
    var arr = this._listeners[eventType];
    if(utils.arrIndexOf(arr, listener) === -1) {
        arr.push(listener);
    }
    return;
};

REventTarget.prototype.removeEventListener = function (eventType, listener) {
    if(!(this._listeners && (eventType in this._listeners))) {
        return;
    }
    var arr = this._listeners[eventType];
    var idx = utils.arrIndexOf(arr, listener);
    if (idx !== -1) {
        if(arr.length > 1) {
            this._listeners[eventType] = arr.slice(0, idx).concat( arr.slice(idx+1) );
        } else {
            delete this._listeners[eventType];
        }
        return;
    }
    return;
};

REventTarget.prototype.dispatchEvent = function (event) {
    var t = event.type;
    var args = Array.prototype.slice.call(arguments, 0);
    if (this['on'+t]) {
        this['on'+t].apply(this, args);
    }
    if (this._listeners && t in this._listeners) {
        for(var i=0; i < this._listeners[t].length; i++) {
            this._listeners[t][i].apply(this, args);
        }
    }
};
//         [*] End of lib/reventtarget.js


//         [*] Including lib/simpleevent.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SimpleEvent = function(type, obj) {
    this.type = type;
    if (typeof obj !== 'undefined') {
        for(var k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            this[k] = obj[k];
        }
    }
};

SimpleEvent.prototype.toString = function() {
    var r = [];
    for(var k in this) {
        if (!this.hasOwnProperty(k)) continue;
        var v = this[k];
        if (typeof v === 'function') v = '[function]';
        r.push(k + '=' + v);
    }
    return 'SimpleEvent(' + r.join(', ') + ')';
};
//         [*] End of lib/simpleevent.js


//         [*] Including lib/eventemitter.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventEmitter = function(events) {
    var that = this;
    that._events = events || [];
    that._listeners = {};
};
EventEmitter.prototype.emit = function(type) {
    var that = this;
    that._verifyType(type);
    if (that._nuked) return;

    var args = Array.prototype.slice.call(arguments, 1);
    if (that['on'+type]) {
        that['on'+type].apply(that, args);
    }
    if (type in that._listeners) {
        for(var i = 0; i < that._listeners[type].length; i++) {
            that._listeners[type][i].apply(that, args);
        }
    }
};

EventEmitter.prototype.on = function(type, callback) {
    var that = this;
    that._verifyType(type);
    if (that._nuked) return;

    if (!(type in that._listeners)) {
        that._listeners[type] = [];
    }
    that._listeners[type].push(callback);
};

EventEmitter.prototype._verifyType = function(type) {
    var that = this;
    if (utils.arrIndexOf(that._events, type) === -1) {
        utils.log('Event ' + JSON.stringify(type) +
                  ' not listed ' + JSON.stringify(that._events) +
                  ' in ' + that);
    }
};

EventEmitter.prototype.nuke = function() {
    var that = this;
    that._nuked = true;
    for(var i=0; i<that._events.length; i++) {
        delete that[that._events[i]];
    }
    that._listeners = {};
};
//         [*] End of lib/eventemitter.js


//         [*] Including lib/utils.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var random_string_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
utils.random_string = function(length, max) {
    max = max || random_string_chars.length;
    var i, ret = [];
    for(i=0; i < length; i++) {
        ret.push( random_string_chars.substr(Math.floor(Math.random() * max),1) );
    }
    return ret.join('');
};
utils.random_number = function(max) {
    return Math.floor(Math.random() * max);
};
utils.random_number_string = function(max) {
    var t = (''+(max - 1)).length;
    var p = Array(t+1).join('0');
    return (p + utils.random_number(max)).slice(-t);
};

// Assuming that url looks like: http://asdasd:111/asd
utils.getOrigin = function(url) {
    url += '/';
    var parts = url.split('/').slice(0, 3);
    return parts.join('/');
};

utils.isSameOriginUrl = function(url_a, url_b) {
    // location.origin would do, but it's not always available.
    if (!url_b) url_b = _window.location.href;

    return (url_a.split('/').slice(0,3).join('/')
                ===
            url_b.split('/').slice(0,3).join('/'));
};

utils.getParentDomain = function(url) {
    // ipv4 ip address
    if (/^[0-9.]*$/.test(url)) return url;
    // ipv6 ip address
    if (/^\[/.test(url)) return url;
    // no dots
    if (!(/[.]/.test(url))) return url;

    var parts = url.split('.').slice(1);
    return parts.join('.');
};

utils.objectExtend = function(dst, src) {
    for(var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};

var WPrefix = '_jp';

utils.polluteGlobalNamespace = function() {
    if (!(WPrefix in _window)) {
        _window[WPrefix] = {};
    }
};

utils.closeFrame = function (code, reason) {
    return 'c'+JSON.stringify([code, reason]);
};

utils.userSetCode = function (code) {
    return code === 1000 || (code >= 3000 && code <= 4999);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
utils.countRTO = function (rtt) {
    var rto;
    if (rtt > 100) {
        rto = 3 * rtt; // rto > 300msec
    } else {
        rto = rtt + 200; // 200msec < rto <= 300msec
    }
    return rto;
}

utils.log = function() {
    if (_window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

utils.bind = function(fun, that) {
    if (fun.bind) {
        return fun.bind(that);
    } else {
        return function() {
            return fun.apply(that, arguments);
        };
    }
};

utils.flatUrl = function(url) {
    return url.indexOf('?') === -1 && url.indexOf('#') === -1;
};

utils.amendUrl = function(url) {
    var dl = _document.location;
    if (!url) {
        throw new Error('Wrong url for SockJS');
    }
    if (!utils.flatUrl(url)) {
        throw new Error('Only basic urls are supported in SockJS');
    }

    //  '//abc' --> 'http://abc'
    if (url.indexOf('//') === 0) {
        url = dl.protocol + url;
    }
    // '/abc' --> 'http://localhost:80/abc'
    if (url.indexOf('/') === 0) {
        url = dl.protocol + '//' + dl.host + url;
    }
    // strip trailing slashes
    url = url.replace(/[/]+$/,'');
    return url;
};

// IE doesn't support [].indexOf.
utils.arrIndexOf = function(arr, obj){
    for(var i=0; i < arr.length; i++){
        if(arr[i] === obj){
            return i;
        }
    }
    return -1;
};

utils.arrSkip = function(arr, obj) {
    var idx = utils.arrIndexOf(arr, obj);
    if (idx === -1) {
        return arr.slice();
    } else {
        var dst = arr.slice(0, idx);
        return dst.concat(arr.slice(idx+1));
    }
};

// Via: https://gist.github.com/1133122/2121c601c5549155483f50be3da5305e83b8c5df
utils.isArray = Array.isArray || function(value) {
    return {}.toString.call(value).indexOf('Array') >= 0
};

utils.delay = function(t, fun) {
    if(typeof t === 'function') {
        fun = t;
        t = 0;
    }
    return setTimeout(fun, t);
};


// Chars worth escaping, as defined by Douglas Crockford:
//   https://github.com/douglascrockford/JSON-js/blob/47a9882cddeb1e8529e07af9736218075372b8ac/json2.js#L196
var json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    json_lookup = {
"\u0000":"\\u0000","\u0001":"\\u0001","\u0002":"\\u0002","\u0003":"\\u0003",
"\u0004":"\\u0004","\u0005":"\\u0005","\u0006":"\\u0006","\u0007":"\\u0007",
"\b":"\\b","\t":"\\t","\n":"\\n","\u000b":"\\u000b","\f":"\\f","\r":"\\r",
"\u000e":"\\u000e","\u000f":"\\u000f","\u0010":"\\u0010","\u0011":"\\u0011",
"\u0012":"\\u0012","\u0013":"\\u0013","\u0014":"\\u0014","\u0015":"\\u0015",
"\u0016":"\\u0016","\u0017":"\\u0017","\u0018":"\\u0018","\u0019":"\\u0019",
"\u001a":"\\u001a","\u001b":"\\u001b","\u001c":"\\u001c","\u001d":"\\u001d",
"\u001e":"\\u001e","\u001f":"\\u001f","\"":"\\\"","\\":"\\\\",
"\u007f":"\\u007f","\u0080":"\\u0080","\u0081":"\\u0081","\u0082":"\\u0082",
"\u0083":"\\u0083","\u0084":"\\u0084","\u0085":"\\u0085","\u0086":"\\u0086",
"\u0087":"\\u0087","\u0088":"\\u0088","\u0089":"\\u0089","\u008a":"\\u008a",
"\u008b":"\\u008b","\u008c":"\\u008c","\u008d":"\\u008d","\u008e":"\\u008e",
"\u008f":"\\u008f","\u0090":"\\u0090","\u0091":"\\u0091","\u0092":"\\u0092",
"\u0093":"\\u0093","\u0094":"\\u0094","\u0095":"\\u0095","\u0096":"\\u0096",
"\u0097":"\\u0097","\u0098":"\\u0098","\u0099":"\\u0099","\u009a":"\\u009a",
"\u009b":"\\u009b","\u009c":"\\u009c","\u009d":"\\u009d","\u009e":"\\u009e",
"\u009f":"\\u009f","\u00ad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601",
"\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f",
"\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d",
"\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029",
"\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d",
"\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061",
"\u2062":"\\u2062","\u2063":"\\u2063","\u2064":"\\u2064","\u2065":"\\u2065",
"\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069",
"\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d",
"\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0",
"\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4",
"\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8",
"\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc",
"\ufffd":"\\ufffd","\ufffe":"\\ufffe","\uffff":"\\uffff"};

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
var extra_escapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
    extra_lookup;

// JSON Quote string. Use native implementation when possible.
var JSONQuote = (JSON && JSON.stringify) || function(string) {
    json_escapable.lastIndex = 0;
    if (json_escapable.test(string)) {
        string = string.replace(json_escapable, function(a) {
            return json_lookup[a];
        });
    }
    return '"' + string + '"';
};

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unroll_lookup = function(escapable) {
    var i;
    var unrolled = {}
    var c = []
    for(i=0; i<65536; i++) {
        c.push( String.fromCharCode(i) );
    }
    escapable.lastIndex = 0;
    c.join('').replace(escapable, function (a) {
        unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        return '';
    });
    escapable.lastIndex = 0;
    return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
//    http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
utils.quote = function(string) {
    var quoted = JSONQuote(string);

    // In most cases this should be very fast and good enough.
    extra_escapable.lastIndex = 0;
    if(!extra_escapable.test(quoted)) {
        return quoted;
    }

    if(!extra_lookup) extra_lookup = unroll_lookup(extra_escapable);

    return quoted.replace(extra_escapable, function(a) {
        return extra_lookup[a];
    });
}

var _all_protocols = ['websocket',
                      'xdr-streaming',
                      'xhr-streaming',
                      'iframe-eventsource',
                      'iframe-htmlfile',
                      'xdr-polling',
                      'xhr-polling',
                      'iframe-xhr-polling',
                      'jsonp-polling'];

utils.probeProtocols = function() {
    var probed = {};
    for(var i=0; i<_all_protocols.length; i++) {
        var protocol = _all_protocols[i];
        // User can have a typo in protocol name.
        probed[protocol] = SockJS[protocol] &&
                           SockJS[protocol].enabled();
    }
    return probed;
};

utils.detectProtocols = function(probed, protocols_whitelist, info) {
    var pe = {},
        protocols = [];
    if (!protocols_whitelist) protocols_whitelist = _all_protocols;
    for(var i=0; i<protocols_whitelist.length; i++) {
        var protocol = protocols_whitelist[i];
        pe[protocol] = probed[protocol];
    }
    var maybe_push = function(protos) {
        var proto = protos.shift();
        if (pe[proto]) {
            protocols.push(proto);
        } else {
            if (protos.length > 0) {
                maybe_push(protos);
            }
        }
    }

    // 1. Websocket
    if (info.websocket !== false) {
        maybe_push(['websocket']);
    }

    // 2. Streaming
    if (pe['xhr-streaming'] && !info.null_origin) {
        protocols.push('xhr-streaming');
    } else {
        if (pe['xdr-streaming'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-streaming');
        } else {
            maybe_push(['iframe-eventsource',
                        'iframe-htmlfile']);
        }
    }

    // 3. Polling
    if (pe['xhr-polling'] && !info.null_origin) {
        protocols.push('xhr-polling');
    } else {
        if (pe['xdr-polling'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-polling');
        } else {
            maybe_push(['iframe-xhr-polling',
                        'jsonp-polling']);
        }
    }
    return protocols;
}
//         [*] End of lib/utils.js


//         [*] Including lib/dom.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// May be used by htmlfile jsonp and transports.
var MPrefix = '_sockjs_global';
utils.createHook = function() {
    var window_id = 'a' + utils.random_string(8);
    if (!(MPrefix in _window)) {
        var map = {};
        _window[MPrefix] = function(window_id) {
            if (!(window_id in map)) {
                map[window_id] = {
                    id: window_id,
                    del: function() {delete map[window_id];}
                };
            }
            return map[window_id];
        }
    }
    return _window[MPrefix](window_id);
};



utils.attachMessage = function(listener) {
    utils.attachEvent('message', listener);
};
utils.attachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.addEventListener(event, listener, false);
    } else {
        // IE quirks.
        // According to: http://stevesouders.com/misc/test-postmessage.php
        // the message gets delivered only to 'document', not 'window'.
        _document.attachEvent("on" + event, listener);
        // I get 'window' for ie8.
        _window.attachEvent("on" + event, listener);
    }
};

utils.detachMessage = function(listener) {
    utils.detachEvent('message', listener);
};
utils.detachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.removeEventListener(event, listener, false);
    } else {
        _document.detachEvent("on" + event, listener);
        _window.detachEvent("on" + event, listener);
    }
};


var on_unload = {};
// Things registered after beforeunload are to be called immediately.
var after_unload = false;

var trigger_unload_callbacks = function() {
    for(var ref in on_unload) {
        on_unload[ref]();
        delete on_unload[ref];
    };
};

var unload_triggered = function() {
    if(after_unload) return;
    after_unload = true;
    trigger_unload_callbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
utils.attachEvent('unload', unload_triggered);

utils.unload_add = function(listener) {
    var ref = utils.random_string(8);
    on_unload[ref] = listener;
    if (after_unload) {
        utils.delay(trigger_unload_callbacks);
    }
    return ref;
};
utils.unload_del = function(ref) {
    if (ref in on_unload)
        delete on_unload[ref];
};


utils.createIframe = function (iframe_url, error_callback) {
    var iframe = _document.createElement('iframe');
    var tref, unload_ref;
    var unattach = function() {
        clearTimeout(tref);
        // Explorer had problems with that.
        try {iframe.onload = null;} catch (x) {}
        iframe.onerror = null;
    };
    var cleanup = function() {
        if (iframe) {
            unattach();
            // This timeout makes chrome fire onbeforeunload event
            // within iframe. Without the timeout it goes straight to
            // onunload.
            setTimeout(function() {
                if(iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframe = null;
            }, 0);
            utils.unload_del(unload_ref);
        }
    };
    var onerror = function(r) {
        if (iframe) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    iframe.src = iframe_url;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function(){onerror('onerror');};
    iframe.onload = function() {
        // `onload` is triggered before scripts on the iframe are
        // executed. Give it few seconds to actually load stuff.
        clearTimeout(tref);
        tref = setTimeout(function(){onerror('onload timeout');}, 2000);
    };
    _document.body.appendChild(iframe);
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};

utils.createHtmlfile = function (iframe_url, error_callback) {
    var doc = new ActiveXObject('htmlfile');
    var tref, unload_ref;
    var iframe;
    var unattach = function() {
        clearTimeout(tref);
    };
    var cleanup = function() {
        if (doc) {
            unattach();
            utils.unload_del(unload_ref);
            iframe.parentNode.removeChild(iframe);
            iframe = doc = null;
            CollectGarbage();
        }
    };
    var onerror = function(r)  {
        if (doc) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[WPrefix] = _window[WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframe_url;
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};
//         [*] End of lib/dom.js


//         [*] Including lib/dom2.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AbstractXHRObject = function(){};
AbstractXHRObject.prototype = new EventEmitter(['chunk', 'finish']);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    var that = this;

    try {
        that.xhr = new XMLHttpRequest();
    } catch(x) {};

    if (!that.xhr) {
        try {
            that.xhr = new _window.ActiveXObject('Microsoft.XMLHTTP');
        } catch(x) {};
    }
    if (_window.ActiveXObject || _window.XDomainRequest) {
        // IE8 caches even POSTs
        url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);
    }

    // Explorer tends to keep connection open, even after the
    // tab gets closed: http://bugs.jquery.com/ticket/5280
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        that.xhr.open(method, url, true);
    } catch(e) {
        // IE raises an exception on wrong port.
        that.emit('finish', 0, '');
        that._cleanup();
        return;
    };

    if (!opts || !opts.no_credentials) {
        // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
        // "This never affects same-site requests."
        that.xhr.withCredentials = 'true';
    }
    if (opts && opts.headers) {
        for(var key in opts.headers) {
            that.xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    that.xhr.onreadystatechange = function() {
        if (that.xhr) {
            var x = that.xhr;
            switch (x.readyState) {
            case 3:
                // IE doesn't like peeking into responseText or status
                // on Microsoft.XMLHTTP and readystate=3
                try {
                    var status = x.status;
                    var text = x.responseText;
                } catch (x) {};
                // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                if (status === 1223) status = 204;

                // IE does return readystate == 3 for 404 answers.
                if (text && text.length > 0) {
                    that.emit('chunk', status, text);
                }
                break;
            case 4:
                var status = x.status;
                // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                if (status === 1223) status = 204;

                that.emit('finish', status, x.responseText);
                that._cleanup(false);
                break;
            }
        }
    };
    that.xhr.send(payload);
};

AbstractXHRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xhr) return;
    utils.unload_del(that.unload_ref);

    // IE needs this field to be a function
    that.xhr.onreadystatechange = function(){};

    if (abort) {
        try {
            that.xhr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

var XHRCorsObject = utils.XHRCorsObject = function() {
    var that = this, args = arguments;
    utils.delay(function(){that._start.apply(that, args);});
};
XHRCorsObject.prototype = new AbstractXHRObject();

var XHRLocalObject = utils.XHRLocalObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){
        that._start(method, url, payload, {
            no_credentials: true
        });
    });
};
XHRLocalObject.prototype = new AbstractXHRObject();



// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
var XDRObject = utils.XDRObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){that._start(method, url, payload);});
};
XDRObject.prototype = new EventEmitter(['chunk', 'finish']);
XDRObject.prototype._start = function(method, url, payload) {
    var that = this;
    var xdr = new XDomainRequest();
    // IE caches even POSTs
    url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);

    var onerror = xdr.ontimeout = xdr.onerror = function() {
        that.emit('finish', 0, '');
        that._cleanup(false);
    };
    xdr.onprogress = function() {
        that.emit('chunk', 200, xdr.responseText);
    };
    xdr.onload = function() {
        that.emit('finish', 200, xdr.responseText);
        that._cleanup(false);
    };
    that.xdr = xdr;
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        // Fails with AccessDenied if port number is bogus
        that.xdr.open(method, url);
        that.xdr.send(payload);
    } catch(x) {
        onerror();
    }
};

XDRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xdr) return;
    utils.unload_del(that.unload_ref);

    that.xdr.ontimeout = that.xdr.onerror = that.xdr.onprogress =
        that.xdr.onload = null;
    if (abort) {
        try {
            that.xdr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xdr = null;
};

XDRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

// 1. Is natively via XHR
// 2. Is natively via XDR
// 3. Nope, but postMessage is there so it should work via the Iframe.
// 4. Nope, sorry.
utils.isXHRCorsCapable = function() {
    if (_window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
        return 1;
    }
    // XDomainRequest doesn't work if page is served from file://
    if (_window.XDomainRequest && _document.domain) {
        return 2;
    }
    if (IframeTransport.enabled()) {
        return 3;
    }
    return 4;
};
//         [*] End of lib/dom2.js


//         [*] Including lib/sockjs.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SockJS = function(url, dep_protocols_whitelist, options) {
    if (this === _window) {
        // makes `new` optional
        return new SockJS(url, dep_protocols_whitelist, options);
    }
    
    var that = this, protocols_whitelist;
    that._options = {devel: false, debug: false, protocols_whitelist: [],
                     info: undefined, rtt: undefined};
    if (options) {
        utils.objectExtend(that._options, options);
    }
    that._base_url = utils.amendUrl(url);
    that._server = that._options.server || utils.random_number_string(1000);
    if (that._options.protocols_whitelist &&
        that._options.protocols_whitelist.length) {
        protocols_whitelist = that._options.protocols_whitelist;
    } else {
        // Deprecated API
        if (typeof dep_protocols_whitelist === 'string' &&
            dep_protocols_whitelist.length > 0) {
            protocols_whitelist = [dep_protocols_whitelist];
        } else if (utils.isArray(dep_protocols_whitelist)) {
            protocols_whitelist = dep_protocols_whitelist
        } else {
            protocols_whitelist = null;
        }
        if (protocols_whitelist) {
            that._debug('Deprecated API: Use "protocols_whitelist" option ' +
                        'instead of supplying protocol list as a second ' +
                        'parameter to SockJS constructor.');
        }
    }
    that._protocols = [];
    that.protocol = null;
    that.readyState = SockJS.CONNECTING;
    that._ir = createInfoReceiver(that._base_url);
    that._ir.onfinish = function(info, rtt) {
        that._ir = null;
        if (info) {
            if (that._options.info) {
                // Override if user supplies the option
                info = utils.objectExtend(info, that._options.info);
            }
            if (that._options.rtt) {
                rtt = that._options.rtt;
            }
            that._applyInfo(info, rtt, protocols_whitelist);
            that._didClose();
        } else {
            that._didClose(1002, 'Can\'t connect to server', true);
        }
    };
};
// Inheritance
SockJS.prototype = new REventTarget();

SockJS.version = "0.3.4";

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._debug = function() {
    if (this._options.debug)
        utils.log.apply(utils, arguments);
};

SockJS.prototype._dispatchOpen = function() {
    var that = this;
    if (that.readyState === SockJS.CONNECTING) {
        if (that._transport_tref) {
            clearTimeout(that._transport_tref);
            that._transport_tref = null;
        }
        that.readyState = SockJS.OPEN;
        that.dispatchEvent(new SimpleEvent("open"));
    } else {
        // The server might have been restarted, and lost track of our
        // connection.
        that._didClose(1006, "Server lost session");
    }
};

SockJS.prototype._dispatchMessage = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
            return;
    that.dispatchEvent(new SimpleEvent("message", {data: data}));
};

SockJS.prototype._dispatchHeartbeat = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
        return;
    that.dispatchEvent(new SimpleEvent('heartbeat', {}));
};

SockJS.prototype._didClose = function(code, reason, force) {
    var that = this;
    if (that.readyState !== SockJS.CONNECTING &&
        that.readyState !== SockJS.OPEN &&
        that.readyState !== SockJS.CLOSING)
            throw new Error('INVALID_STATE_ERR');
    if (that._ir) {
        that._ir.nuke();
        that._ir = null;
    }

    if (that._transport) {
        that._transport.doCleanup();
        that._transport = null;
    }

    var close_event = new SimpleEvent("close", {
        code: code,
        reason: reason,
        wasClean: utils.userSetCode(code)});

    if (!utils.userSetCode(code) &&
        that.readyState === SockJS.CONNECTING && !force) {
        if (that._try_next_protocol(close_event)) {
            return;
        }
        close_event = new SimpleEvent("close", {code: 2000,
                                                reason: "All transports failed",
                                                wasClean: false,
                                                last_event: close_event});
    }
    that.readyState = SockJS.CLOSED;

    utils.delay(function() {
                   that.dispatchEvent(close_event);
                });
};

SockJS.prototype._didMessage = function(data) {
    var that = this;
    var type = data.slice(0, 1);
    switch(type) {
    case 'o':
        that._dispatchOpen();
        break;
    case 'a':
        var payload = JSON.parse(data.slice(1) || '[]');
        for(var i=0; i < payload.length; i++){
            that._dispatchMessage(payload[i]);
        }
        break;
    case 'm':
        var payload = JSON.parse(data.slice(1) || 'null');
        that._dispatchMessage(payload);
        break;
    case 'c':
        var payload = JSON.parse(data.slice(1) || '[]');
        that._didClose(payload[0], payload[1]);
        break;
    case 'h':
        that._dispatchHeartbeat();
        break;
    }
};

SockJS.prototype._try_next_protocol = function(close_event) {
    var that = this;
    if (that.protocol) {
        that._debug('Closed transport:', that.protocol, ''+close_event);
        that.protocol = null;
    }
    if (that._transport_tref) {
        clearTimeout(that._transport_tref);
        that._transport_tref = null;
    }

    while(1) {
        var protocol = that.protocol = that._protocols.shift();
        if (!protocol) {
            return false;
        }
        // Some protocols require access to `body`, what if were in
        // the `head`?
        if (SockJS[protocol] &&
            SockJS[protocol].need_body === true &&
            (!_document.body ||
             (typeof _document.readyState !== 'undefined'
              && _document.readyState !== 'complete'))) {
            that._protocols.unshift(protocol);
            that.protocol = 'waiting-for-load';
            utils.attachEvent('load', function(){
                that._try_next_protocol();
            });
            return true;
        }

        if (!SockJS[protocol] ||
              !SockJS[protocol].enabled(that._options)) {
            that._debug('Skipping transport:', protocol);
        } else {
            var roundTrips = SockJS[protocol].roundTrips || 1;
            var to = ((that._options.rto || 0) * roundTrips) || 5000;
            that._transport_tref = utils.delay(to, function() {
                if (that.readyState === SockJS.CONNECTING) {
                    // I can't understand how it is possible to run
                    // this timer, when the state is CLOSED, but
                    // apparently in IE everythin is possible.
                    that._didClose(2007, "Transport timeouted");
                }
            });

            var connid = utils.random_string(8);
            var trans_url = that._base_url + '/' + that._server + '/' + connid;
            that._debug('Opening transport:', protocol, ' url:'+trans_url,
                        ' RTO:'+that._options.rto);
            that._transport = new SockJS[protocol](that, trans_url,
                                                   that._base_url);
            return true;
        }
    }
};

SockJS.prototype.close = function(code, reason) {
    var that = this;
    if (code && !utils.userSetCode(code))
        throw new Error("INVALID_ACCESS_ERR");
    if(that.readyState !== SockJS.CONNECTING &&
       that.readyState !== SockJS.OPEN) {
        return false;
    }
    that.readyState = SockJS.CLOSING;
    that._didClose(code || 1000, reason || "Normal closure");
    return true;
};

SockJS.prototype.send = function(data) {
    var that = this;
    if (that.readyState === SockJS.CONNECTING)
        throw new Error('INVALID_STATE_ERR');
    if (that.readyState === SockJS.OPEN) {
        that._transport.doSend(utils.quote('' + data));
    }
    return true;
};

SockJS.prototype._applyInfo = function(info, rtt, protocols_whitelist) {
    var that = this;
    that._options.info = info;
    that._options.rtt = rtt;
    that._options.rto = utils.countRTO(rtt);
    that._options.info.null_origin = !_document.domain;
    var probed = utils.probeProtocols();
    that._protocols = utils.detectProtocols(probed, protocols_whitelist, info);
};
//         [*] End of lib/sockjs.js


//         [*] Including lib/trans-websocket.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var WebSocketTransport = SockJS.websocket = function(ri, trans_url) {
    var that = this;
    var url = trans_url + '/websocket';
    if (url.slice(0, 5) === 'https') {
        url = 'wss' + url.slice(5);
    } else {
        url = 'ws' + url.slice(4);
    }
    that.ri = ri;
    that.url = url;
    var Constructor = _window.WebSocket || _window.MozWebSocket;

    that.ws = new Constructor(that.url);
    that.ws.onmessage = function(e) {
        that.ri._didMessage(e.data);
    };
    // Firefox has an interesting bug. If a websocket connection is
    // created after onunload, it stays alive even when user
    // navigates away from the page. In such situation let's lie -
    // let's not open the ws connection at all. See:
    // https://github.com/sockjs/sockjs-client/issues/28
    // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
    that.unload_ref = utils.unload_add(function(){that.ws.close()});
    that.ws.onclose = function() {
        that.ri._didMessage(utils.closeFrame(1006, "WebSocket connection broken"));
    };
};

WebSocketTransport.prototype.doSend = function(data) {
    this.ws.send('[' + data + ']');
};

WebSocketTransport.prototype.doCleanup = function() {
    var that = this;
    var ws = that.ws;
    if (ws) {
        ws.onmessage = ws.onclose = null;
        ws.close();
        utils.unload_del(that.unload_ref);
        that.unload_ref = that.ri = that.ws = null;
    }
};

WebSocketTransport.enabled = function() {
    return !!(_window.WebSocket || _window.MozWebSocket);
};

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;
//         [*] End of lib/trans-websocket.js


//         [*] Including lib/trans-sender.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var BufferedSender = function() {};
BufferedSender.prototype.send_constructor = function(sender) {
    var that = this;
    that.send_buffer = [];
    that.sender = sender;
};
BufferedSender.prototype.doSend = function(message) {
    var that = this;
    that.send_buffer.push(message);
    if (!that.send_stop) {
        that.send_schedule();
    }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.send_schedule_wait = function() {
    var that = this;
    var tref;
    that.send_stop = function() {
        that.send_stop = null;
        clearTimeout(tref);
    };
    tref = utils.delay(25, function() {
        that.send_stop = null;
        that.send_schedule();
    });
};

BufferedSender.prototype.send_schedule = function() {
    var that = this;
    if (that.send_buffer.length > 0) {
        var payload = '[' + that.send_buffer.join(',') + ']';
        that.send_stop = that.sender(that.trans_url, payload, function(success, abort_reason) {
            that.send_stop = null;
            if (success === false) {
                that.ri._didClose(1006, 'Sending error ' + abort_reason);
            } else {
                that.send_schedule_wait();
            }
        });
        that.send_buffer = [];
    }
};

BufferedSender.prototype.send_destructor = function() {
    var that = this;
    if (that._send_stop) {
        that._send_stop();
    }
    that._send_stop = null;
};

var jsonPGenericSender = function(url, payload, callback) {
    var that = this;

    if (!('_send_form' in that)) {
        var form = that._send_form = _document.createElement('form');
        var area = that._send_area = _document.createElement('textarea');
        area.name = 'd';
        form.style.display = 'none';
        form.style.position = 'absolute';
        form.method = 'POST';
        form.enctype = 'application/x-www-form-urlencoded';
        form.acceptCharset = "UTF-8";
        form.appendChild(area);
        _document.body.appendChild(form);
    }
    var form = that._send_form;
    var area = that._send_area;
    var id = 'a' + utils.random_string(8);
    form.target = id;
    form.action = url + '/jsonp_send?i=' + id;

    var iframe;
    try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = _document.createElement('<iframe name="'+ id +'">');
    } catch(x) {
        iframe = _document.createElement('iframe');
        iframe.name = id;
    }
    iframe.id = id;
    form.appendChild(iframe);
    iframe.style.display = 'none';

    try {
        area.value = payload;
    } catch(e) {
        utils.log('Your browser is seriously broken. Go home! ' + e.message);
    }
    form.submit();

    var completed = function(e) {
        if (!iframe.onerror) return;
        iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
        // Opera mini doesn't like if we GC iframe
        // immediately, thus this timeout.
        utils.delay(500, function() {
                       iframe.parentNode.removeChild(iframe);
                       iframe = null;
                   });
        area.value = '';
        // It is not possible to detect if the iframe succeeded or
        // failed to submit our form.
        callback(true);
    };
    iframe.onerror = iframe.onload = completed;
    iframe.onreadystatechange = function(e) {
        if (iframe.readyState == 'complete') completed();
    };
    return completed;
};

var createAjaxSender = function(AjaxObject) {
    return function(url, payload, callback) {
        var xo = new AjaxObject('POST', url + '/xhr_send', payload);
        xo.onfinish = function(status, text) {
            callback(status === 200 || status === 204,
                     'http status ' + status);
        };
        return function(abort_reason) {
            callback(false, abort_reason);
        };
    };
};
//         [*] End of lib/trans-sender.js


//         [*] Including lib/trans-jsonp-receiver.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Parts derived from Socket.io:
//    https://github.com/LearnBoost/socket.io/blob/0.6.17/lib/socket.io/transports/jsonp-polling.js
// and jQuery-JSONP:
//    https://code.google.com/p/jquery-jsonp/source/browse/trunk/core/jquery.jsonp.js
var jsonPGenericReceiver = function(url, callback) {
    var tref;
    var script = _document.createElement('script');
    var script2;  // Opera synchronous load trick.
    var close_script = function(frame) {
        if (script2) {
            script2.parentNode.removeChild(script2);
            script2 = null;
        }
        if (script) {
            clearTimeout(tref);
            // Unfortunately, you can't really abort script loading of
            // the script.
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror =
                script.onload = script.onclick = null;
            script = null;
            callback(frame);
            callback = null;
        }
    };

    // IE9 fires 'error' event after orsc or before, in random order.
    var loaded_okay = false;
    var error_timer = null;

    script.id = 'a' + utils.random_string(8);
    script.src = url;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.onerror = function(e) {
        if (!error_timer) {
            // Delay firing close_script.
            error_timer = setTimeout(function() {
                if (!loaded_okay) {
                    close_script(utils.closeFrame(
                        1006,
                        "JSONP script loaded abnormally (onerror)"));
                }
            }, 1000);
        }
    };
    script.onload = function(e) {
        close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onload)"));
    };

    script.onreadystatechange = function(e) {
        if (/loaded|closed/.test(script.readyState)) {
            if (script && script.htmlFor && script.onclick) {
                loaded_okay = true;
                try {
                    // In IE, actually execute the script.
                    script.onclick();
                } catch (x) {}
            }
            if (script) {
                close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onreadystatechange)"));
            }
        }
    };
    // IE: event/htmlFor/onclick trick.
    // One can't rely on proper order for onreadystatechange. In order to
    // make sure, set a 'htmlFor' and 'event' properties, so that
    // script code will be installed as 'onclick' handler for the
    // script object. Later, onreadystatechange, manually execute this
    // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
    // set. For reference see:
    //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    // Also, read on that about script ordering:
    //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    if (typeof script.async === 'undefined' && _document.attachEvent) {
        // According to mozilla docs, in recent browsers script.async defaults
        // to 'true', so we may use it to detect a good browser:
        // https://developer.mozilla.org/en/HTML/Element/script
        if (!/opera/i.test(navigator.userAgent)) {
            // Naively assume we're in IE
            try {
                script.htmlFor = script.id;
                script.event = "onclick";
            } catch (x) {}
            script.async = true;
        } else {
            // Opera, second sync script hack
            script2 = _document.createElement('script');
            script2.text = "try{var a = document.getElementById('"+script.id+"'); if(a)a.onerror();}catch(x){};";
            script.async = script2.async = false;
        }
    }
    if (typeof script.async !== 'undefined') {
        script.async = true;
    }

    // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
    tref = setTimeout(function() {
                          close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (timeout)"));
                      }, 35000);

    var head = _document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);
    if (script2) {
        head.insertBefore(script2, head.firstChild);
    }
    return close_script;
};
//         [*] End of lib/trans-jsonp-receiver.js


//         [*] Including lib/trans-jsonp-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// mssage could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors


var JsonPTransport = SockJS['jsonp-polling'] = function(ri, trans_url) {
    utils.polluteGlobalNamespace();
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(jsonPGenericSender);
    that._schedule_recv();
};

// Inheritnace
JsonPTransport.prototype = new BufferedSender();

JsonPTransport.prototype._schedule_recv = function() {
    var that = this;
    var callback = function(data) {
        that._recv_stop = null;
        if (data) {
            // no data - heartbeat;
            if (!that._is_closing) {
                that.ri._didMessage(data);
            }
        }
        // The message can be a close message, and change is_closing state.
        if (!that._is_closing) {
            that._schedule_recv();
        }
    };
    that._recv_stop = jsonPReceiverWrapper(that.trans_url + '/jsonp',
                                           jsonPGenericReceiver, callback);
};

JsonPTransport.enabled = function() {
    return true;
};

JsonPTransport.need_body = true;


JsonPTransport.prototype.doCleanup = function() {
    var that = this;
    that._is_closing = true;
    if (that._recv_stop) {
        that._recv_stop();
    }
    that.ri = that._recv_stop = null;
    that.send_destructor();
};


// Abstract away code that handles global namespace pollution.
var jsonPReceiverWrapper = function(url, constructReceiver, user_callback) {
    var id = 'a' + utils.random_string(6);
    var url_id = url + '?c=' + escape(WPrefix + '.' + id);

    // Unfortunately it is not possible to abort loading of the
    // script. We need to keep track of frake close frames.
    var aborting = 0;

    // Callback will be called exactly once.
    var callback = function(frame) {
        switch(aborting) {
        case 0:
            // Normal behaviour - delete hook _and_ emit message.
            delete _window[WPrefix][id];
            user_callback(frame);
            break;
        case 1:
            // Fake close frame - emit but don't delete hook.
            user_callback(frame);
            aborting = 2;
            break;
        case 2:
            // Got frame after connection was closed, delete hook, don't emit.
            delete _window[WPrefix][id];
            break;
        }
    };

    var close_script = constructReceiver(url_id, callback);
    _window[WPrefix][id] = close_script;
    var stop = function() {
        if (_window[WPrefix][id]) {
            aborting = 1;
            _window[WPrefix][id](utils.closeFrame(1000, "JSONP user aborted read"));
        }
    };
    return stop;
};
//         [*] End of lib/trans-jsonp-polling.js


//         [*] Including lib/trans-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AjaxBasedTransport = function() {};
AjaxBasedTransport.prototype = new BufferedSender();

AjaxBasedTransport.prototype.run = function(ri, trans_url,
                                            url_suffix, Receiver, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(createAjaxSender(AjaxObject));
    that.poll = new Polling(ri, Receiver,
                            trans_url + url_suffix, AjaxObject);
};

AjaxBasedTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.poll) {
        that.poll.abort();
        that.poll = null;
    }
};

// xhr-streaming
var XhrStreamingTransport = SockJS['xhr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XHRCorsObject);
};

XhrStreamingTransport.prototype = new AjaxBasedTransport();

XhrStreamingTransport.enabled = function() {
    // Support for CORS Ajax aka Ajax2? Opera 12 claims CORS but
    // doesn't do streaming.
    return (_window.XMLHttpRequest &&
            'withCredentials' in new XMLHttpRequest() &&
            (!/opera/i.test(navigator.userAgent)));
};
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
XhrStreamingTransport.need_body = true;


// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/


// xdr-streaming
var XdrStreamingTransport = SockJS['xdr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XDRObject);
};

XdrStreamingTransport.prototype = new AjaxBasedTransport();

XdrStreamingTransport.enabled = function() {
    return !!_window.XDomainRequest;
};
XdrStreamingTransport.roundTrips = 2; // preflight, ajax



// xhr-polling
var XhrPollingTransport = SockJS['xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRCorsObject);
};

XhrPollingTransport.prototype = new AjaxBasedTransport();

XhrPollingTransport.enabled = XhrStreamingTransport.enabled;
XhrPollingTransport.roundTrips = 2; // preflight, ajax


// xdr-polling
var XdrPollingTransport = SockJS['xdr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XDRObject);
};

XdrPollingTransport.prototype = new AjaxBasedTransport();

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.roundTrips = 2; // preflight, ajax
//         [*] End of lib/trans-xhr.js


//         [*] Including lib/trans-iframe.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Few cool transports do work only for same-origin. In order to make
// them working cross-domain we shall use iframe, served form the
// remote domain. New browsers, have capabilities to communicate with
// cross domain iframe, using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var IframeTransport = function() {};

IframeTransport.prototype.i_constructor = function(ri, trans_url, base_url) {
    var that = this;
    that.ri = ri;
    that.origin = utils.getOrigin(base_url);
    that.base_url = base_url;
    that.trans_url = trans_url;

    var iframe_url = base_url + '/iframe.html';
    if (that.ri._options.devel) {
        iframe_url += '?t=' + (+new Date);
    }
    that.window_id = utils.random_string(8);
    iframe_url += '#' + that.window_id;

    that.iframeObj = utils.createIframe(iframe_url, function(r) {
                                            that.ri._didClose(1006, "Unable to load an iframe (" + r + ")");
                                        });

    that.onmessage_cb = utils.bind(that.onmessage, that);
    utils.attachMessage(that.onmessage_cb);
};

IframeTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.iframeObj) {
        utils.detachMessage(that.onmessage_cb);
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (that.iframeObj.iframe.contentWindow) {
                that.postMessage('c');
            }
        } catch (x) {}
        that.iframeObj.cleanup();
        that.iframeObj = null;
        that.onmessage_cb = that.iframeObj = null;
    }
};

IframeTransport.prototype.onmessage = function(e) {
    var that = this;
    if (e.origin !== that.origin) return;
    var window_id = e.data.slice(0, 8);
    var type = e.data.slice(8, 9);
    var data = e.data.slice(9);

    if (window_id !== that.window_id) return;

    switch(type) {
    case 's':
        that.iframeObj.loaded();
        that.postMessage('s', JSON.stringify([SockJS.version, that.protocol, that.trans_url, that.base_url]));
        break;
    case 't':
        that.ri._didMessage(data);
        break;
    }
};

IframeTransport.prototype.postMessage = function(type, data) {
    var that = this;
    that.iframeObj.post(that.window_id + type + (data || ''), that.origin);
};

IframeTransport.prototype.doSend = function (message) {
    this.postMessage('m', message);
};

IframeTransport.enabled = function() {
    // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
    // huge delay, or not at all.
    var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
    return ((typeof _window.postMessage === 'function' ||
            typeof _window.postMessage === 'object') && (!konqueror));
};
//         [*] End of lib/trans-iframe.js


//         [*] Including lib/trans-iframe-within.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var curr_window_id;

var postMessage = function (type, data) {
    if(parent !== _window) {
        parent.postMessage(curr_window_id + type + (data || ''), '*');
    } else {
        utils.log("Can't postMessage, no parent window.", type, data);
    }
};

var FacadeJS = function() {};
FacadeJS.prototype._didClose = function (code, reason) {
    postMessage('t', utils.closeFrame(code, reason));
};
FacadeJS.prototype._didMessage = function (frame) {
    postMessage('t', frame);
};
FacadeJS.prototype._doSend = function (data) {
    this._transport.doSend(data);
};
FacadeJS.prototype._doCleanup = function () {
    this._transport.doCleanup();
};

utils.parent_origin = undefined;

SockJS.bootstrap_iframe = function() {
    var facade;
    curr_window_id = _document.location.hash.slice(1);
    var onMessage = function(e) {
        if(e.source !== parent) return;
        if(typeof utils.parent_origin === 'undefined')
            utils.parent_origin = e.origin;
        if (e.origin !== utils.parent_origin) return;

        var window_id = e.data.slice(0, 8);
        var type = e.data.slice(8, 9);
        var data = e.data.slice(9);
        if (window_id !== curr_window_id) return;
        switch(type) {
        case 's':
            var p = JSON.parse(data);
            var version = p[0];
            var protocol = p[1];
            var trans_url = p[2];
            var base_url = p[3];
            if (version !== SockJS.version) {
                utils.log("Incompatibile SockJS! Main site uses:" +
                          " \"" + version + "\", the iframe:" +
                          " \"" + SockJS.version + "\".");
            }
            if (!utils.flatUrl(trans_url) || !utils.flatUrl(base_url)) {
                utils.log("Only basic urls are supported in SockJS");
                return;
            }

            if (!utils.isSameOriginUrl(trans_url) ||
                !utils.isSameOriginUrl(base_url)) {
                utils.log("Can't connect to different domain from within an " +
                          "iframe. (" + JSON.stringify([_window.location.href, trans_url, base_url]) +
                          ")");
                return;
            }
            facade = new FacadeJS();
            facade._transport = new FacadeJS[protocol](facade, trans_url, base_url);
            break;
        case 'm':
            facade._doSend(data);
            break;
        case 'c':
            if (facade)
                facade._doCleanup();
            facade = null;
            break;
        }
    };

    // alert('test ticker');
    // facade = new FacadeJS();
    // facade._transport = new FacadeJS['w-iframe-xhr-polling'](facade, 'http://host.com:9999/ticker/12/basd');

    utils.attachMessage(onMessage);

    // Start
    postMessage('s');
};
//         [*] End of lib/trans-iframe-within.js


//         [*] Including lib/info.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var InfoReceiver = function(base_url, AjaxObject) {
    var that = this;
    utils.delay(function(){that.doXhr(base_url, AjaxObject);});
};

InfoReceiver.prototype = new EventEmitter(['finish']);

InfoReceiver.prototype.doXhr = function(base_url, AjaxObject) {
    var that = this;
    var t0 = (new Date()).getTime();
    var xo = new AjaxObject('GET', base_url + '/info');

    var tref = utils.delay(8000,
                           function(){xo.ontimeout();});

    xo.onfinish = function(status, text) {
        clearTimeout(tref);
        tref = null;
        if (status === 200) {
            var rtt = (new Date()).getTime() - t0;
            var info = JSON.parse(text);
            if (typeof info !== 'object') info = {};
            that.emit('finish', info, rtt);
        } else {
            that.emit('finish');
        }
    };
    xo.ontimeout = function() {
        xo.close();
        that.emit('finish');
    };
};

var InfoReceiverIframe = function(base_url) {
    var that = this;
    var go = function() {
        var ifr = new IframeTransport();
        ifr.protocol = 'w-iframe-info-receiver';
        var fun = function(r) {
            if (typeof r === 'string' && r.substr(0,1) === 'm') {
                var d = JSON.parse(r.substr(1));
                var info = d[0], rtt = d[1];
                that.emit('finish', info, rtt);
            } else {
                that.emit('finish');
            }
            ifr.doCleanup();
            ifr = null;
        };
        var mock_ri = {
            _options: {},
            _didClose: fun,
            _didMessage: fun
        };
        ifr.i_constructor(mock_ri, base_url, base_url);
    }
    if(!_document.body) {
        utils.attachEvent('load', go);
    } else {
        go();
    }
};
InfoReceiverIframe.prototype = new EventEmitter(['finish']);


var InfoReceiverFake = function() {
    // It may not be possible to do cross domain AJAX to get the info
    // data, for example for IE7. But we want to run JSONP, so let's
    // fake the response, with rtt=2s (rto=6s).
    var that = this;
    utils.delay(function() {
        that.emit('finish', {}, 2000);
    });
};
InfoReceiverFake.prototype = new EventEmitter(['finish']);

var createInfoReceiver = function(base_url) {
    if (utils.isSameOriginUrl(base_url)) {
        // If, for some reason, we have SockJS locally - there's no
        // need to start up the complex machinery. Just use ajax.
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    }
    switch (utils.isXHRCorsCapable()) {
    case 1:
        // XHRLocalObject -> no_credentials=true
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    case 2:
        return new InfoReceiver(base_url, utils.XDRObject);
    case 3:
        // Opera
        return new InfoReceiverIframe(base_url);
    default:
        // IE 7
        return new InfoReceiverFake();
    };
};


var WInfoReceiverIframe = FacadeJS['w-iframe-info-receiver'] = function(ri, _trans_url, base_url) {
    var ir = new InfoReceiver(base_url, utils.XHRLocalObject);
    ir.onfinish = function(info, rtt) {
        ri._didMessage('m'+JSON.stringify([info, rtt]));
        ri._didClose();
    }
};
WInfoReceiverIframe.prototype.doCleanup = function() {};
//         [*] End of lib/info.js


//         [*] Including lib/trans-iframe-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceIframeTransport = SockJS['iframe-eventsource'] = function () {
    var that = this;
    that.protocol = 'w-iframe-eventsource';
    that.i_constructor.apply(that, arguments);
};

EventSourceIframeTransport.prototype = new IframeTransport();

EventSourceIframeTransport.enabled = function () {
    return ('EventSource' in _window) && IframeTransport.enabled();
};

EventSourceIframeTransport.need_body = true;
EventSourceIframeTransport.roundTrips = 3; // html, javascript, eventsource


// w-iframe-eventsource
var EventSourceTransport = FacadeJS['w-iframe-eventsource'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/eventsource', EventSourceReceiver, utils.XHRLocalObject);
}
EventSourceTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-eventsource.js


//         [*] Including lib/trans-iframe-xhr-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrPollingIframeTransport = SockJS['iframe-xhr-polling'] = function () {
    var that = this;
    that.protocol = 'w-iframe-xhr-polling';
    that.i_constructor.apply(that, arguments);
};

XhrPollingIframeTransport.prototype = new IframeTransport();

XhrPollingIframeTransport.enabled = function () {
    return _window.XMLHttpRequest && IframeTransport.enabled();
};

XhrPollingIframeTransport.need_body = true;
XhrPollingIframeTransport.roundTrips = 3; // html, javascript, xhr


// w-iframe-xhr-polling
var XhrPollingITransport = FacadeJS['w-iframe-xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRLocalObject);
};

XhrPollingITransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-xhr-polling.js


//         [*] Including lib/trans-iframe-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// This transport generally works in any browser, but will cause a
// spinning cursor to appear in any browser other than IE.
// We may test this transport in all browsers - why not, but in
// production it should be only run in IE.

var HtmlFileIframeTransport = SockJS['iframe-htmlfile'] = function () {
    var that = this;
    that.protocol = 'w-iframe-htmlfile';
    that.i_constructor.apply(that, arguments);
};

// Inheritance.
HtmlFileIframeTransport.prototype = new IframeTransport();

HtmlFileIframeTransport.enabled = function() {
    return IframeTransport.enabled();
};

HtmlFileIframeTransport.need_body = true;
HtmlFileIframeTransport.roundTrips = 3; // html, javascript, htmlfile


// w-iframe-htmlfile
var HtmlFileTransport = FacadeJS['w-iframe-htmlfile'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/htmlfile', HtmlfileReceiver, utils.XHRLocalObject);
};
HtmlFileTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-htmlfile.js


//         [*] Including lib/trans-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var Polling = function(ri, Receiver, recv_url, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.Receiver = Receiver;
    that.recv_url = recv_url;
    that.AjaxObject = AjaxObject;
    that._scheduleRecv();
};

Polling.prototype._scheduleRecv = function() {
    var that = this;
    var poll = that.poll = new that.Receiver(that.recv_url, that.AjaxObject);
    var msg_counter = 0;
    poll.onmessage = function(e) {
        msg_counter += 1;
        that.ri._didMessage(e.data);
    };
    poll.onclose = function(e) {
        that.poll = poll = poll.onmessage = poll.onclose = null;
        if (!that.poll_is_closing) {
            if (e.reason === 'permanent') {
                that.ri._didClose(1006, 'Polling error (' + e.reason + ')');
            } else {
                that._scheduleRecv();
            }
        }
    };
};

Polling.prototype.abort = function() {
    var that = this;
    that.poll_is_closing = true;
    if (that.poll) {
        that.poll.abort();
    }
};
//         [*] End of lib/trans-polling.js


//         [*] Including lib/trans-receiver-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceReceiver = function(url) {
    var that = this;
    var es = new EventSource(url);
    es.onmessage = function(e) {
        that.dispatchEvent(new SimpleEvent('message',
                                           {'data': unescape(e.data)}));
    };
    that.es_close = es.onerror = function(e, abort_reason) {
        // ES on reconnection has readyState = 0 or 1.
        // on network error it's CLOSED = 2
        var reason = abort_reason ? 'user' :
            (es.readyState !== 2 ? 'network' : 'permanent');
        that.es_close = es.onmessage = es.onerror = null;
        // EventSource reconnects automatically.
        es.close();
        es = null;
        // Safari and chrome < 15 crash if we close window before
        // waiting for ES cleanup. See:
        //   https://code.google.com/p/chromium/issues/detail?id=89155
        utils.delay(200, function() {
                        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
                    });
    };
};

EventSourceReceiver.prototype = new REventTarget();

EventSourceReceiver.prototype.abort = function() {
    var that = this;
    if (that.es_close) {
        that.es_close({}, true);
    }
};
//         [*] End of lib/trans-receiver-eventsource.js


//         [*] Including lib/trans-receiver-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var _is_ie_htmlfile_capable;
var isIeHtmlfileCapable = function() {
    if (_is_ie_htmlfile_capable === undefined) {
        if ('ActiveXObject' in _window) {
            try {
                _is_ie_htmlfile_capable = !!new ActiveXObject('htmlfile');
            } catch (x) {}
        } else {
            _is_ie_htmlfile_capable = false;
        }
    }
    return _is_ie_htmlfile_capable;
};


var HtmlfileReceiver = function(url) {
    var that = this;
    utils.polluteGlobalNamespace();

    that.id = 'a' + utils.random_string(6, 26);
    url += ((url.indexOf('?') === -1) ? '?' : '&') +
        'c=' + escape(WPrefix + '.' + that.id);

    var constructor = isIeHtmlfileCapable() ?
        utils.createHtmlfile : utils.createIframe;

    var iframeObj;
    _window[WPrefix][that.id] = {
        start: function () {
            iframeObj.loaded();
        },
        message: function (data) {
            that.dispatchEvent(new SimpleEvent('message', {'data': data}));
        },
        stop: function () {
            that.iframe_close({}, 'network');
        }
    };
    that.iframe_close = function(e, abort_reason) {
        iframeObj.cleanup();
        that.iframe_close = iframeObj = null;
        delete _window[WPrefix][that.id];
        that.dispatchEvent(new SimpleEvent('close', {reason: abort_reason}));
    };
    iframeObj = constructor(url, function(e) {
                                that.iframe_close({}, 'permanent');
                            });
};

HtmlfileReceiver.prototype = new REventTarget();

HtmlfileReceiver.prototype.abort = function() {
    var that = this;
    if (that.iframe_close) {
        that.iframe_close({}, 'user');
    }
};
//         [*] End of lib/trans-receiver-htmlfile.js


//         [*] Including lib/trans-receiver-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrReceiver = function(url, AjaxObject) {
    var that = this;
    var buf_pos = 0;

    that.xo = new AjaxObject('POST', url, null);
    that.xo.onchunk = function(status, text) {
        if (status !== 200) return;
        while (1) {
            var buf = text.slice(buf_pos);
            var p = buf.indexOf('\n');
            if (p === -1) break;
            buf_pos += p+1;
            var msg = buf.slice(0, p);
            that.dispatchEvent(new SimpleEvent('message', {data: msg}));
        }
    };
    that.xo.onfinish = function(status, text) {
        that.xo.onchunk(status, text);
        that.xo = null;
        var reason = status === 200 ? 'network' : 'permanent';
        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
    }
};

XhrReceiver.prototype = new REventTarget();

XhrReceiver.prototype.abort = function() {
    var that = this;
    if (that.xo) {
        that.xo.close();
        that.dispatchEvent(new SimpleEvent('close', {reason: 'user'}));
        that.xo = null;
    }
};
//         [*] End of lib/trans-receiver-xhr.js


//         [*] Including lib/test-hooks.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// For testing
SockJS.getUtils = function(){
    return utils;
};

SockJS.getIframeTransport = function(){
    return IframeTransport;
};
//         [*] End of lib/test-hooks.js

                  return SockJS;
          })();
if ('_sockjs_onload' in window) setTimeout(_sockjs_onload, 1);

// AMD compliance
if (typeof define === 'function' && define.amd) {
    define('sockjs', [], function(){return SockJS;});
}
//     [*] End of lib/index.js

// [*] End of lib/all.js

module.exports = SockJS;
},{}],3:[function(require,module,exports){
var SockJS, inUserPages, r, sock, updateTabs, updateUserPages, user_pages, windows;

r = require('ramda');

SockJS = require('sockjs-browserify');

windows = {};

user_pages = [];

updateUserPages = function(new_pages) {
  return user_pages = r.concat(user_pages, new_pages);
};

inUserPages = function(url) {
  var k, v, _i, _len;
  for (v = _i = 0, _len = user_pages.length; _i < _len; v = ++_i) {
    k = user_pages[v];
    if (k === url) {
      return true;
    }
  }
  return false;
};

sock = new SockJS('http://localhost:9001/sock');

console.log(sock);

sock.onopen = function() {
  return console.log("CONNECTED -----");
};

sock.onmessage = function(e) {
  var msg;
  console.log(e.data);
  msg = JSON.parse(e.data);
  console.log(msg);
  updateUserPages(msg);
  return console.log(user_pages);
};

updateTabs = function(tab) {
  var tab_id, url, window_id;
  window_id = tab.windowId;
  tab_id = tab.id;
  url = tab.url;
  if (!windows.hasOwnProperty(window_id)) {
    windows[window_id] = {};
  }
  windows[window_id][tab_id] = url;
  sock.send(JSON.stringify(windows));
  return console.log(windows);
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active) {
    if (inUserPages(tab.url)) {
      return console.log("FOUND MATCH");
    }
  }
});



},{"ramda":1,"sockjs-browserify":2}]},{},[3])