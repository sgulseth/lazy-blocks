;(function (name, definition) {
    var root = this;
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    } else if(typeof exports === 'function') {
        module.exports = definition();
    } else {
        window[name] = definition();
    }
})('LazyBlocks', function() {
    'use strict';
    var lazyNum = 0;

    function raf(cb) {
        return function() {
            return (window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function(cb) {
                    setTimeout(cb, 1000 / 60);
                  })(cb);
        }
    }

    function bind(func, obj) {
        var args = Array.prototype.slice.call(arguments, 2);
        return function() {
            return func.apply(obj, args);
        };
    };

    function on(el, ev, callback) {
        if (el.addEventListener) {
            on = function(el, ev, callback) {
                return el.addEventListener(ev, callback, false);
            };
        }
        else {
            on = function(el, ev, callback) {
                return el.attachEvent('on'+ ev, callback);
            };
        }
        on(el, ev, callback);
    };

    function throttle (callback, limit, self) {
        var wait = false;
        return function () {
            if (!wait) {
                callback.apply(self);
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, limit);
            }
        }
    };

    function defaultCallback(element) {
        var comment, i = 0;
        do {
            comment = element.childNodes[i];
            i++;
        } while(comment.nodeType != 8 && i < element.childNodes.length);

        if (comment.nodeType === 8) {
            var el = document.createElement('div');
            var html = comment.nodeValue

            el.innerHTML = html;

            el = el.childNodes[0];
            element.parentNode.replaceChild(el, element);
        }
    }

    function Loader(params){
        this.element = params.element;
        this.threshold = params.threshold;
        this.aboveTheFold = params.aboveTheFold;

        if (params.callback) {
            this.callback = raf(bind(params.callback, null, this.element));
        } else {
            this.callback = raf(bind(defaultCallback, null, this.element));
        }
    };

    Loader.prototype = {
        visible: function(scrollTop) {
            var offset = this.element.getBoundingClientRect();

            return (
                 (offset.top-window.innerHeight-this.threshold) <= 0 &&
                (offset.bottom+this.threshold >= 0 || this.aboveTheFold === true)
            );
        },
    };

    function Lazy(params) {
        var elements = params.elements;
        var i;

        this.loaders = {};
        this.options = {
            threshold: params.threshold || 100,
            throttle: params.throttle || 500,
            aboveTheFold: params.aboveTheFold || false,
            callback: params.callback,
        };


        if (typeof(elements.length) === 'undefined'){
            elements = [elements];
        }

        for (i = elements.length - 1; i >= 0; i--) {
            this.loaders[lazyNum++] = new Loader({
                element: elements[i],
                aboveTheFold: this.options.aboveTheFold,
                threshold: this.options.threshold,
                callback: this.options.callback
            });
        }

        on(window, 'scroll', throttle(bind(this.execute, this), this.options.throttle));
    };

    Lazy.prototype = {
        execute: function() {
            var scrollTop = window.scrollY;
            var i;
            for (i in this.loaders) {
                if (this.loaders[i].visible(scrollTop)) {
                    this.loaders[i].callback();
                    delete this.loaders[i]
                }
            }
            return this;
        },
        detach: function() {
            var i;
            for(i in this.loaders) {
                this.loaders[i].callback();
                delete this.loaders[i]
            }
            return this;
        },
        addElement: function(element, params) {
            params = params || {};
            this.loaders[lazyNum++] = new Loader({
                element: element,
                aboveTheFold: (params.aboveTheFold || this.options.aboveTheFold),
                threshold: (params.threshold || this.options.threshold),
                callback: (params.callback || this.options.callback)
            });
            return this;
        }
    }

    return Lazy;
});

