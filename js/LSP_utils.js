(function(win, doc, undefined) {
    'use strict';

    win.utils = {

        /**
         * Constructs a child of queue object to execute sync and async functions on the same stack.
         * 
         * For example:
         * 
         * var queue = new utils.queue();
         * queue.repeat(2).sync(function() { // this queue will be repeated two times
         *      return '1'; // the result of sync functions you should return as usual
         * }).async(function() {
         *      queue.result(); // to get the result of previous function call .result()
         *      setTimeout(function(){
         *          queue.result(); // result will be safe until you return new result
         *          queue.execute(); // you CAN'T execute queue while it is executing
         *          queue.reset().execute(); // but you can reset and then execute it from the beginning
         *          queue.proceed('2'); // the result of async functions you should pass to .proceed() as argument
         *      }, 500);
         * }).sleep(
         *      1000 // sleep function will pause all queue for requested amount of milliseconds
         *  ).callback(function() { // callback fucntion will be called only once
         *      queue.result(); // this will return result of last executed function
         * }).execute();
         *
         * // you can execute the queue again after it's execution:
         * queue.execute();
         * // or clean it and then re-fill with other functions:
         * queue.clean().sync( ...
         * 
         */
        queue: (function(_) {
            return(_ = function() {
                this.clean();
            }).prototype = {
                /**
                 * Add async function in queue
                 * Somewhere in this function you must run .proceed() method to go further
                 * @param  {Function} callback Function to be executed
                 * @return {Object}                   
                 */
                async: function(callback) {
                    if(typeof callback === 'undefined') {
                        callback = function(){};
                    }
                    if(typeof callback === 'function') {
                        callback.waitForAsyncProceed = callback.waitForAsyncResult = true;
                        this._queue.push(callback);
                    }
                    return this;
                },
                /**
                 * Add function in queue
                 * Queue will wait for return from this function before going to the next step
                 * @param  {Function} callback Function to be executed
                 * @return {Object}            
                 */
                sync: function(callback) {
                    if(typeof callback === 'function') {
                        this._queue.push(callback);
                    }
                    return this;
                },
                /**
                 * Set the number of repetitions of queue
                 * @param  {Number} times
                 * @return {Object}       
                 */
                repeat: function(repeat) {
                    if(repeat == repeat | 0) {
                        this._repeat = Math.max(repeat-1, 0);
                    }
                    this._counter = this._repeat;
                    return this;
                },
                /**
                 * Set the callback, which will be called when queue finish execution
                 * @param  {Function} callback 
                 * @return {Object}
                 */
                callback: function(callback) {
                    if(typeof callback === 'function') {
                        this._callback = callback;
                    }
                    return this;
                },
                /**
                 * Start execution of queue
                 * @return {Object}
                 */
                execute: function() {
                    if(!this._execution) {
                        this._execution = true;
                        this.proceed();
                    }
                    return this;
                },
                /**
                 * Stop execution and reset queue to initial state
                 * @return {Object}
                 */
                reset: function () {
                    this._cursor    = 0;
                    this._execution = false;
                    this._counter   = this._repeat;
                    this._result    = this.undefined;
                    return this;
                },
                /**
                 * Reset to initial state and clean stack and callback
                 * @return {Object}
                 */
                clean: function() {
                    this._queue     = [];
                    this._repeat    = 0;
                    this._counter   = 0;
                    this.reset();
                    return this;
                },
                /**
                 * Add a "sleep" function to stack
                 * @param  {Number} time Time to sleep in milliseconds
                 * @return {Object}
                 */
                sleep: function(time) {
                    this.async(function(time) {
                        setTimeout(this.proceed.bind(this), time);
                    }.bind(this, time));
                    this._queue[this._queue.length-1].waitForAsyncResult = false;
                    return this;
                },
                /**
                 * Stop queue, call global callback and reset queue
                 * @return {Object}
                 */
                stop: function() {
                    this._cursor  = this._queue.length;
                    this._counter = 0;
                    return this;
                },
                /**
                 * Set or get current cursor
                 * @param  {integer} step
                 * @return {Object}
                 */
                setCursor: function(cursor) {
                    this._cursor = Math.min(this._queue.length, Math.max(0,cursor));
                    return this;
                },
                getCursor: function() {
                    return this._cursor;
                },
                /**
                 * Function which will switch queue to the next tick
                 * @return {Object}
                 */
                proceed: function() {
                    if(this._execution) {
                        if (this._cursor > 0 && this._queue[this._cursor-1].waitForAsyncResult) {
                            this._result = arguments[0];
                        }
                        if(this._cursor === this._queue.length) {
                            if(this._counter) {
                                this._counter--;
                                this._cursor = 0;
                            } else {
                                this._callback && this._callback(this);
                                return this.reset();
                            }
                        }
                        if(this._queue[this._cursor].waitForAsyncProceed) {
                            this._queue[this._cursor++](this);
                        } else {
                            this._result = this._queue[this._cursor++](this);
                            this.proceed();
                        }
                    }
                    return this;
                },
                /**
                 * Return result of last executed function
                 * @return {Any}
                 */
                result: function() {
                    return this._result;
                }
        },_})(),



        isFunction: function(f) {
            // Good in old Chrome builds where RegExp is typeof 'function'
            return ({}).toString.call(f)==='[object Function]';
        },



        isElement: function(e) {
            return e instanceof (win.HTMLElement || win.Element);
        },


        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },


        getRandomMoney: function(min, max) {
            return (Math.random() * (max - min + 1) + min).toFixed(2);
        },


        /**
         * Create HTMLElement and set some params
         * @param  {string} node name
         * @param  {object} params, ex: {attr: {prop:val}, css: {prop:val}, html: '', text: ''}
         * @return {HTMLElement}
         */
        node: function(node, params) {
            if(node === 'fragment') {
                return doc.createDocumentFragment();
            } else {
                node = doc.createElement(node);
                if(params) {
                    var prop;
                    if(params.text) {
                        node.appendChild(doc.createTextNode(params.text+''));
                    }
                    if(params.html) {
                        node.innerHTML = params.html+'';
                    }
                    if(params.css) {
                        for(prop in params.css) {
                            node.style[prop] = params.css[prop];
                        }
                    }
                    if(params.attr) {
                        for(prop in params.attr) {
                            node.setAttribute(prop,params.attr[prop]);
                        }
                    }
                }
                return node;
            }
        }

    };

})(window, document, void(0));
