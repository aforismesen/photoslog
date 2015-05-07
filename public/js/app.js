(function() {
  if (!this.require) {
    var modules = {}, cache = {};

    var require = function(name, root) {
      var path = expand(root, name), indexPath = expand(path, './index'), module, fn;
      module   = cache[path] || cache[indexPath];
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = indexPath]) {
        module = {id: path, exports: {}};
        cache[path] = module.exports;
        fn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        return cache[path] = module.exports;
      } else {
        throw 'module ' + name + ' not found';
      }
    };

    var expand = function(root, name) {
      var results = [], parts, part;
      // If path is relative
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.define = function(bundle) {
      for (var key in bundle) {
        modules[key] = bundle[key];
      }
    };

    this.require.modules = modules;
    this.require.cache   = cache;
  }

  return this.require;
}).call(this);
this.require.define({ "controller" : function(exports, require, module) {var Controller, EventDispatcher,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventDispatcher = require('eventDispatcher');

Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    if (options == null) {
      options = {};
    }
    Controller.__super__.constructor.apply(this, arguments);
    this.options = options;
    this.view = null;
  }

  return Controller;

})(EventDispatcher);

module.exports = Controller;}});this.require.define({ "eventDispatcher" : function(exports, require, module) {var EventDispatcher, Module,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Module = require('module');

EventDispatcher = (function(_super) {
  __extends(EventDispatcher, _super);

  function EventDispatcher() {
    this.triggerToSubviews = __bind(this.triggerToSubviews, this);
    this.trigger = __bind(this.trigger, this);
    this.off = __bind(this.off, this);
    this.on = __bind(this.on, this);
    this.eventCallbacks = {};
  }

  EventDispatcher.prototype.on = function(eventName, callback) {
    var _base;
    (_base = this.eventCallbacks)[eventName] || (_base[eventName] = []);
    return this.eventCallbacks[eventName].push(callback);
  };

  EventDispatcher.prototype.off = function(eventName, callback) {
    if (eventName == null) {
      eventName = null;
    }
    if (callback == null) {
      callback = null;
    }
    if (!eventName) {
      return this.eventCallbacks = {};
    } else if (!callback) {
      return this.eventCallbacks[eventName] = [];
    } else {
      return this.eventCallbacks[eventName] = this.eventCallbacks[eventName].map(function(cb) {
        if (cb !== callback) {
          return cb;
        }
      });
    }
  };

  EventDispatcher.prototype.trigger = function() {
    var args, callback, callbacks, eventName, _i, _len, _results;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    callbacks = this.eventCallbacks[eventName];
    if (callbacks == null) {
      return;
    }
    callbacks = callbacks.slice();
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      _results.push(callback.apply(null, args));
    }
    return _results;
  };

  EventDispatcher.prototype.triggerToSubviews = function() {
    var args, eventName, subview, _i, _len, _ref, _results;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    this.trigger.apply(this, arguments);
    if (this.subviews != null) {
      _ref = this.subviews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        _results.push(subview.triggerToSubviews.apply(subview, arguments));
      }
      return _results;
    }
  };

  EventDispatcher.prototype.propagateEvent = function(event, source) {
    return source.on(event, (function(_this) {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this.trigger.apply(_this, [event].concat(__slice.call(args)));
      };
    })(this));
  };

  return EventDispatcher;

})(Module);

module.exports = EventDispatcher;}});this.require.define({ "module" : function(exports, require, module) {var Module, moduleKeywords,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

moduleKeywords = ['extended', 'included'];

Module = (function() {
  function Module() {}

  Module.extend = function(obj) {
    var func, name, _ref;
    for (name in obj) {
      func = obj[name];
      if (__indexOf.call(moduleKeywords, name) < 0) {
        this[name] = func;
      }
    }
    if ((_ref = obj.extended) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.include = function(obj) {
    var func, name, _ref;
    for (name in obj) {
      func = obj[name];
      if (__indexOf.call(moduleKeywords, name) < 0) {
        this.prototype[name] = func;
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }
    return this;
  };

  return Module;

})();

module.exports = Module;}});this.require.define({ "view" : function(exports, require, module) {var EventDispatcher, View, clone, convertCoordinateToScreen, getOffset, getRectsIntersection, getWindowSize, scroll,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventDispatcher = require('eventDispatcher');

scroll = require('scroll');

require('dynamics.js');

clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

getOffset = function(el, property) {
  var value;
  value = 0;
  while (el != null) {
    value += el[property];
    el = el.offsetParent;
  }
  return value;
};

convertCoordinateToScreen = function(coordinates) {
  var obj;
  obj = clone(coordinates);
  obj.x = coordinates.x - scroll.value.x;
  obj.y = coordinates.y - scroll.value.y;
  return obj;
};

getWindowSize = (function() {
  var gen, size;
  size = {};
  gen = function() {
    return size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
  gen();
  window.addEventListener('resize', gen);
  return function() {
    return size;
  };
})();

getRectsIntersection = function(a, b) {
  var num1, num2, x, y;
  x = Math.max(a.x, b.x);
  num1 = Math.min(a.x + a.width, b.x + b.width);
  y = Math.max(a.y, b.y);
  num2 = Math.min(a.y + a.height, b.y + b.height);
  if (num1 >= x && num2 >= y) {
    return {
      x: x,
      y: y,
      width: num1 - x,
      height: num2 - y
    };
  }
  return null;
};

View = (function(_super) {
  __extends(View, _super);

  View.prototype.tag = 'div';

  function View(options) {
    var c, className, _i, _j, _len, _len1, _ref, _ref1;
    this.options = options != null ? options : {};
    this.animate = __bind(this.animate, this);
    this.css = __bind(this.css, this);
    this.isVisible = __bind(this.isVisible, this);
    this.visibleBounds = __bind(this.visibleBounds, this);
    this.frame = __bind(this.frame, this);
    this.size = __bind(this.size, this);
    this.position = __bind(this.position, this);
    this.y = __bind(this.y, this);
    this.x = __bind(this.x, this);
    this.width = __bind(this.width, this);
    this.height = __bind(this.height, this);
    this.text = __bind(this.text, this);
    this.setSuperview = __bind(this.setSuperview, this);
    this.addSubviews = __bind(this.addSubviews, this);
    this.addSubview = __bind(this.addSubview, this);
    View.__super__.constructor.apply(this, arguments);
    this.el = this.el || this.options.el || document.createElement(this.options['tag'] || this.tag);
    _ref = [this.className, this.options.className];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      className = _ref[_i];
      _ref1 = (className != null ? className : '').split(' ');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        c = _ref1[_j];
        if (c !== '') {
          this.el.classList.add(c);
        }
      }
    }
    this.subviews = [];
    if (typeof this.render === "function") {
      this.render();
    }
    if (typeof this.bindEvents === "function") {
      this.bindEvents();
    }
    if (typeof this.layout === "function") {
      this.layout();
    }
  }

  View.prototype.addSubview = function(subview) {
    this.el.appendChild(subview.el);
    subview.setSuperview(this);
    return this.subviews.push(subview);
  };

  View.prototype.addSubviews = function(subviews) {
    var subview, _i, _len, _results;
    if (subviews == null) {
      subviews = [];
    }
    _results = [];
    for (_i = 0, _len = subviews.length; _i < _len; _i++) {
      subview = subviews[_i];
      _results.push(this.addSubview(subview));
    }
    return _results;
  };

  View.prototype.setSuperview = function(superview) {
    this.superview = superview;
    if (this.el.parentNode != null) {
      return this.triggerToSubviews('addedToDOM');
    }
  };

  View.prototype.text = function(text) {
    return this.el.innerHTML = text;
  };

  View.prototype.height = function() {
    return this.el.clientHeight;
  };

  View.prototype.width = function() {
    return this.el.clientWidth;
  };

  View.prototype.x = function() {
    return getOffset(this.el, 'offsetLeft');
  };

  View.prototype.y = function() {
    return getOffset(this.el, 'offsetTop');
  };

  View.prototype.position = function() {
    return {
      x: this.x(),
      y: this.y()
    };
  };

  View.prototype.size = function() {
    return {
      width: this.width(),
      height: this.height()
    };
  };

  View.prototype.frame = function() {
    return {
      x: this.x(),
      y: this.y(),
      width: this.width(),
      height: this.height()
    };
  };

  View.prototype.visibleBounds = function() {
    var viewFrameInScreen, windowFrame;
    viewFrameInScreen = convertCoordinateToScreen(this.frame());
    windowFrame = getWindowSize();
    windowFrame.x = 0;
    windowFrame.y = 0;
    return getRectsIntersection(viewFrameInScreen, windowFrame);
  };

  View.prototype.isVisible = function() {
    var style;
    style = window.getComputedStyle(this.el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  };

  View.prototype.css = function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    return dynamics.css.apply(dynamics, [this.el].concat(args));
  };

  View.prototype.animate = function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    return dynamics.apply(dynamics, [this.el].concat(args));
  };

  return View;

})(EventDispatcher);

module.exports = View;}});this.require.define({ "config" : function(exports, require, module) {module.exports = {};}});this.require.define({ "get" : function(exports, require, module) {var get;

get = function(path, callback) {
  var httpRequest;
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      return typeof callback === "function" ? callback(JSON.parse(httpRequest.responseText)) : void 0;
    }
  };
  httpRequest.open('GET', path);
  return httpRequest.send();
};

module.exports = get;}});this.require.define({ "months" : function(exports, require, module) {module.exports = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];}});this.require.define({ "queue" : function(exports, require, module) {var EventDispatcher, Queue,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventDispatcher = require('eventDispatcher');

Queue = (function(_super) {
  __extends(Queue, _super);

  function Queue() {
    this.tick = __bind(this.tick, this);
    this.addJob = __bind(this.addJob, this);
    this.jobs = [];
    this.runningJobs = [];
    this.maxConcurrent = 2;
  }

  Queue.prototype.addJob = function(job) {
    this.jobs.push(job);
    return this.tick();
  };

  Queue.prototype.tick = function() {
    var job;
    if (this.maxConcurrent <= this.runningJobs.length) {
      return;
    }
    if (this.jobs.length <= 0) {
      return;
    }
    job = this.jobs[0];
    this.jobs.splice(0, 1);
    this.runningJobs.push(job);
    return job((function(_this) {
      return function() {
        var pos;
        pos = _this.runningJobs.indexOf(job);
        _this.runningJobs.splice(pos, 1);
        return _this.tick();
      };
    })(this));
  };

  return Queue;

})(EventDispatcher);

module.exports = Queue;}});this.require.define({ "ratio" : function(exports, require, module) {var pixelRatio, _ref, _ref1;

pixelRatio = (_ref = window.devicePixelRatio) != null ? _ref : 1;

pixelRatio = (_ref1 = {
  1: 1,
  2: 2
}[pixelRatio]) != null ? _ref1 : 1;

module.exports = "" + pixelRatio + "x";}});this.require.define({ "router" : function(exports, require, module) {var EventDispatcher, init, parse, router, scroll;

EventDispatcher = require('eventDispatcher');

scroll = require('scroll');

router = new EventDispatcher;

router.goToHome = function(options) {
  if (options == null) {
    options = {};
  }
  return router.goTo({}, "", options);
};

router.goToGroup = function(group, options) {
  var state;
  if (options == null) {
    options = {};
  }
  if (group == null) {
    return router.goToHome();
  }
  state = {
    obj: group.path,
    type: 'group'
  };
  return router.goTo(state, "/" + group.path, options);
};

router.goTo = function(state, url, options) {
  if (options == null) {
    options = {};
  }
  if (options.trigger == null) {
    options.trigger = true;
  }
  if (JSON.stringify(router.state) === JSON.stringify(state)) {
    return;
  }
  router.state = state;
  if (options.trigger) {
    return router.trigger('change', state);
  }
};

router.state = {};

parse = function() {
  var match, path;
  path = window.location.pathname;
  match = path.match(/\/([^\/]*)\/?/);
  if ((match != null) && (match[1] != null) && match[1].length > 0) {
    return router.state = {
      obj: match[1] + '/',
      type: 'group'
    };
  }
};

init = function() {
  window.addEventListener('popstate', (function(_this) {
    return function(e) {
      if (!e.state) {
        return;
      }
      router.state = e.state;
      return router.trigger('change', e.state);
    };
  })(this));
  return parse();
};

init();

module.exports = router;}});this.require.define({ "scroll" : function(exports, require, module) {var EventDispatcher, animating, obj, restore, scroll, views;

EventDispatcher = require('eventDispatcher');

views = [];

animating = false;

obj = null;

restore = function(y) {
  var objAnimation, view, _i, _len;
  for (_i = 0, _len = views.length; _i < _len; _i++) {
    view = views[_i];
    view.css({
      translateY: 0,
      translateZ: 0
    });
  }
  window.scrollTo(0, y);
  document.body.style.height = "auto";
  scroll.scrolling = false;
  return objAnimation = null;
};

scroll = new EventDispatcher;

scroll.value = {
  x: 0,
  y: 0
};

scroll.scrolling = false;

window.addEventListener('scroll', function() {
  if (animating) {
    dynamics.stop(obj);
    restore(obj.y);
    animating = false;
  }
  scroll.value = {
    x: window.scrollX,
    y: window.scrollY
  };
  return scroll.trigger('change');
});

scroll.to = function(options) {
  var body, bodyHeight, html, initial;
  if (options == null) {
    options = {};
  }
  if (animating) {
    dynamics.stop(obj);
    animating = false;
  }
  scroll.scrolling = true;
  body = document.body;
  html = document.documentElement;
  bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  document.body.style.height = bodyHeight + "px";
  options.y = Math.min(options.y, bodyHeight - window.innerHeight);
  initial = window.scrollY;
  views = options.views;
  obj = {
    y: scroll.value.y
  };
  animating = true;
  return dynamics(obj, {
    y: options.y
  }, {
    type: dynamics.Spring,
    frequency: 9,
    friction: 350,
    anticipationStrength: 82,
    anticipationSize: 34,
    duration: 1000,
    change: function() {
      var view, _i, _len;
      if (!scroll.scrolling) {
        return;
      }
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        view.css({
          translateY: -obj.y + initial,
          translateZ: 0
        });
      }
      scroll.value = {
        x: scroll.value.x,
        y: obj.y
      };
      return scroll.trigger('change', obj.y);
    },
    complete: function() {
      if (!scroll.scrolling) {
        return;
      }
      return restore(obj.y);
    }
  });
};

module.exports = scroll;}});this.require.define({ "app" : function(exports, require, module) {var App, Controller, Fullscreen, Timeline, View, config, router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controller');

View = require('view');

Timeline = require('timeline');

Fullscreen = require('fullscreen');

router = require('router');

config = require('config');

App = (function(_super) {
  __extends(App, _super);

  function App() {
    this.onPhotoClick = __bind(this.onPhotoClick, this);
    this.onRouterChange = __bind(this.onRouterChange, this);
    this.bindEvents = __bind(this.bindEvents, this);
    App.__super__.constructor.apply(this, arguments);
    config.imagesRootPath = this.options.imagesRootPath;
    this.view = new View({
      el: document.body,
      className: 'appView'
    });
    this.timeline = new Timeline;
    this.view.addSubview(this.timeline.view);
    this.fullscreen = new Fullscreen;
    this.view.addSubview(this.fullscreen.view);
    this.bindEvents();
  }

  App.prototype.bindEvents = function() {
    this.timeline.on('photoClick', this.onPhotoClick);
    return router.on('change', this.onRouterChange);
  };

  App.prototype.onRouterChange = function(state) {
    if ((state != null ? state.type : void 0) === 'group') {
      return this.timeline.setSelectedGroup(state.obj);
    } else {
      return this.timeline.setSelectedGroup(null);
    }
  };

  App.prototype.onPhotoClick = function(timelineView, view, image) {
    return this.fullscreen.open(image, {
      view: view
    });
  };

  return App;

})(Controller);

module.exports = App;}});this.require.define({ "fullscreen" : function(exports, require, module) {var Controller, Fullscreen, ImageView, View, ratio,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controller');

View = require('view');

ImageView = require('imageView');

ratio = require('ratio');

Fullscreen = (function(_super) {
  __extends(Fullscreen, _super);

  function Fullscreen() {
    this.open = __bind(this.open, this);
    Fullscreen.__super__.constructor.apply(this, arguments);
    this.view = new View({
      className: 'fullscreenView'
    });
    this.view.css({
      visibility: 'hidden'
    });
    this.backgroundView = new View({
      className: 'backgroundView'
    });
    this.backgroundView.css({
      opacity: 0
    });
    this.view.addSubview(this.backgroundView);
  }

  Fullscreen.prototype.open = function(image, options) {
    var filePath, imageView, visibleBounds;
    if (options == null) {
      options = {};
    }
    filePath = image.files[ratio];
    imageView = new ImageView({
      className: image.type,
      imagePath: filePath,
      object: image
    });
    if (options.view != null) {
      visibleBounds = options.view.visibleBounds();
      imageView.css({
        left: visibleBounds.x,
        top: visibleBounds.y,
        width: options.view.width(),
        height: options.view.height()
      });
    }
    this.view.addSubview(imageView);
    this.view.css({
      visibility: 'visible'
    });
    return this.backgroundView.animate({
      opacity: 0.5
    }, {
      type: dynamics.EaseInOut,
      duration: 200
    });
  };

  return Fullscreen;

})(Controller);

module.exports = Fullscreen;}});this.require.define({ "timeline" : function(exports, require, module) {var Controller, PhotosGroupsView, Timeline, TimelineView, View, config, get, router, scroll,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controller');

View = require('view');

PhotosGroupsView = require('photosGroupsView');

TimelineView = require('timelineView');

get = require('get');

router = require('router');

scroll = require('scroll');

config = require('config');

Timeline = (function(_super) {
  __extends(Timeline, _super);

  function Timeline() {
    this.onPhotoClick = __bind(this.onPhotoClick, this);
    this.onSelectedGroupDidChange = __bind(this.onSelectedGroupDidChange, this);
    this.onClick = __bind(this.onClick, this);
    this.onScroll = __bind(this.onScroll, this);
    this.onLoad = __bind(this.onLoad, this);
    this.updateVisibleGroups = __bind(this.updateVisibleGroups, this);
    this.groupFromPath = __bind(this.groupFromPath, this);
    this.scrollToSelectedGroup = __bind(this.scrollToSelectedGroup, this);
    this.setSelectedGroup = __bind(this.setSelectedGroup, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.load = __bind(this.load, this);
    Timeline.__super__.constructor.apply(this, arguments);
    this.view = new View({
      className: 'mainView'
    });
    this.timelineView = new TimelineView;
    this.view.addSubview(this.timelineView);
    this.photosGroupsContainerView = new View({
      className: 'photosGroupsContainerView'
    });
    this.photosGroupsView = new PhotosGroupsView;
    this.photosGroupsContainerView.addSubview(this.photosGroupsView);
    this.view.addSubview(this.photosGroupsContainerView);
    this.load();
    this.bindEvents();
  }

  Timeline.prototype.load = function() {
    return get(config.imagesRootPath + 'info.json', this.onLoad);
  };

  Timeline.prototype.bindEvents = function() {
    this.timelineView.on('click', this.onClick);
    this.timelineView.on('selectedGroupDidChange', this.onSelectedGroupDidChange);
    this.photosGroupsView.on('click', this.onPhotoClick);
    return scroll.on('change', this.onScroll);
  };

  Timeline.prototype.setSelectedGroup = function(path, options) {
    var group;
    if (options == null) {
      options = {};
    }
    if (options.animated == null) {
      options.animated = true;
    }
    group = this.groupFromPath(path);
    this.timelineView.setSelectedGroup(group);
    scroll.to({
      y: this.photosGroupsView.groupViewY(group),
      views: [this.photosGroupsView],
      animated: options.animated
    });
    return this.onScroll();
  };

  Timeline.prototype.scrollToSelectedGroup = function() {};

  Timeline.prototype.groupFromPath = function(path) {
    var group, _i, _len, _ref;
    if (!this.groups) {
      return;
    }
    _ref = this.groups;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      if (group.path === path) {
        return group;
      }
    }
  };

  Timeline.prototype.updateVisibleGroups = function() {
    return this.timelineView.setVisibleGroups(this.photosGroupsView.visibleGroups());
  };

  Timeline.prototype.onLoad = function(data) {
    var _ref;
    this.groups = data.groups.reverse();
    this.photosGroupsView.setGroups(this.groups);
    this.timelineView.setGroups(this.groups);
    if (((_ref = router.state) != null ? _ref.type : void 0) === 'group') {
      return this.setSelectedGroup(router.state.obj, {
        animated: false
      });
    } else {
      return this.updateVisibleGroups();
    }
  };

  Timeline.prototype.onScroll = function() {
    return requestAnimationFrame((function(_this) {
      return function() {
        return _this.updateVisibleGroups();
      };
    })(this));
  };

  Timeline.prototype.onClick = function(group) {
    return router.goToGroup(group);
  };

  Timeline.prototype.onSelectedGroupDidChange = function(group) {};

  Timeline.prototype.onPhotoClick = function(photosGroupView, view, image) {
    return this.trigger('photoClick', this, view, image);
  };

  return Timeline;

})(Controller);

module.exports = Timeline;}});this.require.define({ "imageView" : function(exports, require, module) {var ImageView, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('view');

ImageView = (function(_super) {
  __extends(ImageView, _super);

  ImageView.prototype.className = 'imageView';

  function ImageView() {
    this.onClick = __bind(this.onClick, this);
    this.onLoad = __bind(this.onLoad, this);
    this.load = __bind(this.load, this);
    this.bindEvents = __bind(this.bindEvents, this);
    ImageView.__super__.constructor.apply(this, arguments);
    if (this.options.queue != null) {
      this.options.queue.addJob(this.load);
    } else {
      this.load();
    }
    this.bindEvents();
  }

  ImageView.prototype.bindEvents = function() {
    return this.el.addEventListener('click', this.onClick);
  };

  ImageView.prototype.load = function(done) {
    this.image = new Image;
    this.image.src = this.options.imagePath;
    return this.image.onload = (function(_this) {
      return function() {
        if (typeof done === "function") {
          done();
        }
        return _this.onLoad();
      };
    })(this);
  };

  ImageView.prototype.onLoad = function() {
    return this.el.style.backgroundImage = "url(" + this.options.imagePath + ")";
  };

  ImageView.prototype.onClick = function() {
    return this.trigger('click', this);
  };

  return ImageView;

})(View);

module.exports = ImageView;}});this.require.define({ "photosGroupView" : function(exports, require, module) {var ImageView, PhotosGroupView, View, config, months, ratio,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('view');

ImageView = require('imageView');

ratio = require('ratio');

months = require('months');

config = require('config');

PhotosGroupView = (function(_super) {
  __extends(PhotosGroupView, _super);

  function PhotosGroupView() {
    this.frame = __bind(this.frame, this);
    this.invalidate = __bind(this.invalidate, this);
    this.createImageView = __bind(this.createImageView, this);
    this.layout = __bind(this.layout, this);
    this.appendRowImages = __bind(this.appendRowImages, this);
    this.appendFullImage = __bind(this.appendFullImage, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.render = __bind(this.render, this);
    return PhotosGroupView.__super__.constructor.apply(this, arguments);
  }

  PhotosGroupView.prototype.className = 'photosGroupView';

  PhotosGroupView.prototype.render = function() {
    var date, monthString;
    this.label = new View({
      tag: 'h2'
    });
    this.label.text(this.options.group.name);
    this.addSubview(this.label);
    this.date = new View({
      tag: 'span'
    });
    date = new Date(this.options.group.date);
    monthString = months[date.getMonth()].toUpperCase();
    this.date.text("" + monthString + " " + (date.getFullYear()));
    this.label.addSubview(this.date);
    this.appendFullImage(this.options.group.images[0]);
    return this.appendRowImages(this.options.group.images.slice(1, +(this.options.group.images.length - 1) + 1 || 9e9));
  };

  PhotosGroupView.prototype.bindEvents = function() {
    window.addEventListener('resize', this.invalidate);
    window.addEventListener('resize', this.layout);
    return this.on('addedToDOM', this.layout);
  };

  PhotosGroupView.prototype.appendFullImage = function(image) {
    this.fullImage = image;
    image.view = this.createImageView(image);
    return this.addSubview(image.view);
  };

  PhotosGroupView.prototype.appendRowImages = function(images) {
    var i, image, margins, totalWidthAt1000, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
    this.images = images;
    margins = (this.images.length - 1) * 7;
    totalWidthAt1000 = 0;
    _ref = this.images;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      image = _ref[_i];
      image.ratio = image.size.width / image.size.height;
      totalWidthAt1000 += 1000 * image.ratio;
    }
    _ref1 = this.images;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      image = _ref1[_j];
      image.layout = {
        widthPercent: 1000 * image.ratio / totalWidthAt1000
      };
    }
    _ref2 = this.images;
    _results = [];
    for (i in _ref2) {
      image = _ref2[i];
      image.view = this.createImageView(image);
      this.addSubview(image.view);
      _results.push(image.view.el.style.width = "calc((100% - " + margins + "px) * " + image.layout.widthPercent + ")");
    }
    return _results;
  };

  PhotosGroupView.prototype.layout = function() {
    var height, i, image, margins, _ref;
    if (!this.images[0].view.width()) {
      return;
    }
    margins = (this.images.length - 1) * 7;
    height = this.images[0].view.width() / this.images[0].ratio;
    _ref = this.images;
    for (i in _ref) {
      image = _ref[i];
      image.view.el.style.height = "" + height + "px";
    }
    return this.fullImage.view.el.style.height = "" + (this.fullImage.size.height / this.fullImage.size.width * this.fullImage.view.width()) + "px";
  };

  PhotosGroupView.prototype.createImageView = function(image) {
    var filePath, imageView;
    filePath = image.files[ratio];
    imageView = new ImageView({
      className: image.type,
      queue: this.options.queue,
      imagePath: config.imagesRootPath + filePath,
      object: image
    });
    return imageView;
  };

  PhotosGroupView.prototype.invalidate = function() {
    return this.cachedFrame = null;
  };

  PhotosGroupView.prototype.frame = function() {
    if (!this.cachedFrame) {
      this.cachedFrame = PhotosGroupView.__super__.frame.apply(this, arguments);
    }
    return this.cachedFrame;
  };

  return PhotosGroupView;

})(View);

module.exports = PhotosGroupView;}});this.require.define({ "photosGroupsView" : function(exports, require, module) {var PhotosGroupView, PhotosGroupsView, Queue, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('view');

PhotosGroupView = require('photosGroupView');

Queue = require('queue');

PhotosGroupsView = (function(_super) {
  __extends(PhotosGroupsView, _super);

  PhotosGroupsView.prototype.className = 'photosGroupsView';

  function PhotosGroupsView() {
    this.onClick = __bind(this.onClick, this);
    this.viewForGroup = __bind(this.viewForGroup, this);
    this.groupViewY = __bind(this.groupViewY, this);
    this.visibleGroups = __bind(this.visibleGroups, this);
    this.setGroups = __bind(this.setGroups, this);
    PhotosGroupsView.__super__.constructor.apply(this, arguments);
    this.queue = new Queue;
  }

  PhotosGroupsView.prototype.setGroups = function(groups) {
    var group, photosGroupView, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = groups.length; _i < _len; _i++) {
      group = groups[_i];
      photosGroupView = new PhotosGroupView({
        group: group,
        queue: this.queue
      });
      photosGroupView.on('click', this.onClick);
      _results.push(this.addSubview(photosGroupView));
    }
    return _results;
  };

  PhotosGroupsView.prototype.visibleGroups = function() {
    var view, visibleBounds, visibleGroups, _i, _len, _ref;
    visibleGroups = [];
    _ref = this.subviews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      visibleBounds = view.visibleBounds();
      if (visibleBounds != null) {
        visibleGroups.push({
          group: view.options.group,
          rect: visibleBounds,
          portion: visibleBounds.height / view.height()
        });
      }
    }
    return visibleGroups;
  };

  PhotosGroupsView.prototype.groupViewY = function(group) {
    var view;
    view = this.viewForGroup(group);
    if (view != null) {
      return view.y() - 45;
    } else {
      return 0;
    }
  };

  PhotosGroupsView.prototype.viewForGroup = function(group) {
    var view, _i, _len, _ref;
    _ref = this.subviews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      if (view.options.group.path === (group != null ? group.path : void 0)) {
        return view;
      }
    }
  };

  PhotosGroupsView.prototype.onClick = function(photosGroupView, view, image) {
    return this.trigger('click', this, view, image);
  };

  return PhotosGroupsView;

})(View);

module.exports = PhotosGroupsView;}});this.require.define({ "timelineView" : function(exports, require, module) {var TimelineView, View, getWindowSize, months, multiply, pixelRatio, roundf, scroll, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('view');

scroll = require('scroll');

months = require('months');

pixelRatio = (_ref = window.devicePixelRatio) != null ? _ref : 1;

multiply = function(obj, value) {
  var k, newObj, v;
  newObj = {};
  for (k in obj) {
    v = obj[k];
    newObj[k] = v * value;
  }
  return newObj;
};

getWindowSize = (function() {
  var gen, size;
  size = {};
  gen = function() {
    return size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
  gen();
  window.addEventListener('resize', gen);
  return function() {
    return size;
  };
})();

roundf = function(v, decimal) {
  var d;
  d = Math.pow(10, decimal);
  return Math.round(v * d) / d;
};

TimelineView = (function(_super) {
  __extends(TimelineView, _super);

  TimelineView.prototype.className = 'timelineView';

  function TimelineView() {
    this.onScroll = __bind(this.onScroll, this);
    this.onResize = __bind(this.onResize, this);
    this.drawLine = __bind(this.drawLine, this);
    this.draw = __bind(this.draw, this);
    this.redraw = __bind(this.redraw, this);
    this.center = __bind(this.center, this);
    this.updateCanvasSize = __bind(this.updateCanvasSize, this);
    this.itemForGroup = __bind(this.itemForGroup, this);
    this.setGroups = __bind(this.setGroups, this);
    this.setSelectedGroup = __bind(this.setSelectedGroup, this);
    this.setVisibleGroups = __bind(this.setVisibleGroups, this);
    TimelineView.__super__.constructor.apply(this, arguments);
    this.translateY = 0;
    this.canvas = new View({
      tag: 'canvas',
      className: 'curvedLinesCanvas'
    });
    this.ctx = this.canvas.el.getContext("2d");
    this.addSubview(this.canvas);
    this.verticalLineView = new View({
      tag: 'span',
      className: 'verticalLineView'
    });
    this.addSubview(this.verticalLineView);
    this.containerView = new View({
      className: 'containerView'
    });
    this.addSubview(this.containerView);
    this.selectedGroup = null;
    window.addEventListener('resize', this.onResize);
    window.addEventListener('load', (function(_this) {
      return function() {
        _this.updateCanvasSize();
        _this.center();
        return _this.redraw();
      };
    })(this));
    scroll.on('change', this.onScroll);
  }

  TimelineView.prototype.setVisibleGroups = function(groups) {
    var group, maxGroup, maxPortion, selectedGroup, _i, _len;
    groups.sort(function(a, b) {
      return a.rect.y > b.rect.y;
    });
    this.visibleGroups = groups;
    selectedGroup = null;
    maxPortion = 0;
    maxGroup = null;
    for (_i = 0, _len = groups.length; _i < _len; _i++) {
      group = groups[_i];
      if (group.portion > 0.66) {
        selectedGroup = group.group;
        break;
      }
      if (group.portion > maxPortion) {
        maxPortion = group.portion;
        maxGroup = group.group;
      }
    }
    if (!selectedGroup) {
      selectedGroup = maxGroup;
    }
    if (this.selectedGroup !== selectedGroup) {
      this.setSelectedGroup(selectedGroup);
      this.trigger('selectedGroupDidChange', selectedGroup);
    }
    return this.redraw();
  };

  TimelineView.prototype.setSelectedGroup = function(group) {
    var item, _ref1, _ref2;
    if (this.selectedGroup !== group) {
      this.selectedGroup = group;
      if (this.selectedGroup) {
        item = this.itemForGroup(this.selectedGroup);
        if (item && item !== this.selectedItem) {
          if ((_ref1 = this.selectedItem) != null) {
            _ref1.el.classList.remove('selected');
          }
          item.el.classList.add('selected');
          return this.selectedItem = item;
        }
      } else {
        if ((_ref2 = this.selectedItem) != null) {
          _ref2.el.classList.remove('selected');
        }
        return this.selectedItem = null;
      }
    }
  };

  TimelineView.prototype.setGroups = function(groups) {
    var addYearView, currentYear, group, verticalLineViewHeight, _fn, _i, _len;
    currentYear = null;
    verticalLineViewHeight = 0;
    addYearView = (function(_this) {
      return function(year) {
        var yearView;
        yearView = new View({
          tag: 'p',
          className: 'yearView'
        });
        yearView.text(year);
        return _this.containerView.addSubview(yearView);
      };
    })(this);
    _fn = (function(_this) {
      return function(group) {
        var circleView, date, dateView, itemView, monthString, textView;
        date = new Date(group.date);
        if ((currentYear != null) && currentYear !== date.getFullYear()) {
          verticalLineViewHeight += 36;
          addYearView(currentYear);
        }
        itemView = new View({
          tag: 'a',
          group: group
        });
        itemView.el.addEventListener('click', function() {
          return _this.trigger('click', group);
        });
        textView = new View({
          tag: 'span',
          className: 'textView'
        });
        textView.text(group.name);
        itemView.addSubview(textView);
        dateView = new View({
          tag: 'span',
          className: 'dateView'
        });
        monthString = months[date.getMonth()].toUpperCase();
        dateView.text("" + monthString + " " + (date.getFullYear()));
        itemView.addSubview(dateView);
        circleView = new View({
          tag: 'span',
          className: 'circleView'
        });
        itemView.addSubview(circleView);
        verticalLineViewHeight += 36;
        _this.containerView.addSubview(itemView);
        return currentYear = date.getFullYear();
      };
    })(this);
    for (_i = 0, _len = groups.length; _i < _len; _i++) {
      group = groups[_i];
      _fn(group);
    }
    if (currentYear != null) {
      addYearView(currentYear);
    }
    return this.verticalLineView.el.style.height = (verticalLineViewHeight - 36) + "px";
  };

  TimelineView.prototype.itemForGroup = function(group) {
    var view, _i, _len, _ref1;
    _ref1 = this.containerView.subviews;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      view = _ref1[_i];
      if (view.options.group == null) {
        continue;
      }
      if (view.options.group.path === group.path) {
        return view;
      }
    }
    return null;
  };

  TimelineView.prototype.updateCanvasSize = function() {
    this.canvas.el.width = 95 * pixelRatio;
    return this.canvas.el.height = this.canvas.height() * pixelRatio;
  };

  TimelineView.prototype.center = function() {
    var height;
    height = this.height();
    this.marginTop = height * 0.4;
    this.marginTop = Math.max(16, this.marginTop);
    this.containerView.el.style.marginTop = "" + this.marginTop + "px";
    return this.verticalLineView.el.style.marginTop = "" + this.marginTop + "px";
  };

  TimelineView.prototype.redraw = function() {
    return requestAnimationFrame((function(_this) {
      return function() {
        return _this.draw(_this.ctx);
      };
    })(this));
  };

  TimelineView.prototype.draw = function(ctx) {
    var canvasHeight, canvasWidth, fullRect, group, groupRect, item, itemRect, maxY, minY, newHeight, rect, y1, y2, _i, _len, _ref1;
    if (!this.isVisible()) {
      return;
    }
    canvasWidth = this.canvas.el.width / pixelRatio;
    canvasHeight = this.canvas.el.height / pixelRatio;
    ctx.fillStyle = 'white';
    if (this.lastDrawnRect != null) {
      ctx.fillRect.apply(ctx, this.lastDrawnRect);
    } else {
      ctx.fillRect(0, 0, canvasWidth * pixelRatio, canvasHeight * pixelRatio);
    }
    if ((this.visibleGroups == null) || this.visibleGroups.length === 0) {
      this.lastDrawnRect = [0, 0, 0, 0];
      return;
    }
    fullRect = null;
    _ref1 = this.visibleGroups;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      item = this.itemForGroup(group.group);
      if (item == null) {
        continue;
      }
      itemRect = item.frame();
      itemRect.y += this.translateY;
      groupRect = group.rect;
      if (group.group === this.selectedGroup) {
        ctx.strokeStyle = '#0091FF';
        ctx.lineWidth = '3';
      } else {
        ctx.strokeStyle = "rgba(176, 176, 176, " + (Math.min(1, group.portion * 4)) + ")";
        ctx.lineWidth = '1';
      }
      y1 = itemRect.y + itemRect.height / 2;
      y2 = groupRect.y + groupRect.height / 2;
      minY = Math.min(y1, y2) - 5;
      maxY = Math.max(y1, y2) + 5;
      rect = [0, minY * pixelRatio, 95 * pixelRatio, (maxY - minY) * pixelRatio];
      if (fullRect != null) {
        newHeight = Math.max(fullRect[3] + fullRect[1], rect[3] + rect[1]) - Math.min(fullRect[1], rect[1]);
        minY = Math.min(fullRect[1], rect[1]);
        fullRect = [fullRect[0], minY, rect[2], newHeight];
      } else {
        fullRect = rect;
      }
      this.drawLine(ctx, {
        x: 0,
        y: y1
      }, {
        x: 95,
        y: y2
      });
    }
    return this.lastDrawnRect = fullRect;
  };

  TimelineView.prototype.drawLine = function(ctx, from, to) {
    var midX;
    from = multiply(from, pixelRatio);
    to = multiply(to, pixelRatio);
    midX = (from.x + to.x) / 2 + from.x;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(midX, from.y, midX, to.y, to.x, to.y);
    ctx.stroke();
    return ctx.closePath();
  };

  TimelineView.prototype.onResize = function() {
    this.updateCanvasSize();
    this.center();
    return this.redraw();
  };

  TimelineView.prototype.onScroll = function() {
    var height, percent, scrollY, transform;
    scrollY = scroll.value.y;
    height = document.body.clientHeight - getWindowSize().height;
    percent = scrollY / height;
    this.translateY = roundf(-percent * (this.containerView.height() - this.marginTop), 2);
    transform = "translate3d(0," + this.translateY + "px,0)";
    this.containerView.el.style.webkitTransform = transform;
    return this.verticalLineView.el.style.webkitTransform = transform;
  };

  return TimelineView;

})(View);

module.exports = TimelineView;}});this.require.define({ "dynamics.js" : function(exports, require, module) {window.dynamics = function() {
  (function() {
  if (!this.require) {
    var modules = {}, cache = {};

    var require = function(name, root) {
      var path = expand(root, name), indexPath = expand(path, './index'), module, fn;
      module   = cache[path] || cache[indexPath];
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = indexPath]) {
        module = {id: path, exports: {}};
        cache[path] = module.exports;
        fn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        return cache[path] = module.exports;
      } else {
        throw 'module ' + name + ' not found';
      }
    };

    var expand = function(root, name) {
      var results = [], parts, part;
      // If path is relative
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.define = function(bundle) {
      for (var key in bundle) {
        modules[key] = bundle[key];
      }
    };

    this.require.modules = modules;
    this.require.cache   = cache;
  }

  return this.require;
}).call(this);

var require = this.require;


this.require.define({"animation":function(exports, require, module){(function() {
  var Animation, curves, helpers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  curves = require('curves');

  helpers = require('helpers');

  Animation = (function() {
    function Animation(currentStyle, properties, options) {
      this.complete = __bind(this.complete, this);
      this.change = __bind(this.change, this);
      this.duration = __bind(this.duration, this);
      this.timeLeft = __bind(this.timeLeft, this);
      this.frame = __bind(this.frame, this);
      var k, v;
      this.currentStyle = {};
      for (k in currentStyle) {
        v = currentStyle[k];
        this.currentStyle[k] = v;
      }
      this.properties = helpers.parseProperties(properties);
      this.options = options;
      this.curve = new this.options.type(this.options);
      this.time = 0;
    }

    Animation.prototype.frame = function(ts) {
      var current, frame, property, t, value, _ref;
      this.time += ts;
      t = this.time / this.duration();
      if (t > 1) {
        t = 1;
      }
      frame = {};
      _ref = this.properties;
      for (property in _ref) {
        value = _ref[property];
        current = this.currentStyle[property];
        frame[property] = current + (this.curve.at(t)[1] * (value - current));
      }
      return frame;
    };

    Animation.prototype.timeLeft = function() {
      return Math.max(0, this.duration() - this.time);
    };

    Animation.prototype.duration = function() {
      return this.curve.options.duration;
    };

    Animation.prototype.change = function() {
      var _base;
      return typeof (_base = this.options).change === "function" ? _base.change() : void 0;
    };

    Animation.prototype.complete = function() {
      var _base;
      return typeof (_base = this.options).complete === "function" ? _base.complete() : void 0;
    };

    return Animation;

  })();

  module.exports = Animation;

}).call(this);
;}});


this.require.define({"curves":function(exports, require, module){(function() {
  var Bezier, Curve, CustomBezier, EaseIn, EaseInOut, EaseOut, Gravity, GravityWithForce, Linear, SelfSpring, Spring, curves,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  curves = {};

  Curve = (function() {
    Curve.properties = {};

    function Curve(options) {
      var k, v, _ref;
      this.options = options != null ? options : {};
      this.next = __bind(this.next, this);
      this.init = __bind(this.init, this);
      _ref = this.options.type.properties;
      for (k in _ref) {
        v = _ref[k];
        if ((this.options[k] == null) && !v.editable) {
          this.options[k] = v["default"];
        }
      }
    }

    Curve.prototype.init = function() {
      return this.t = 0;
    };

    Curve.prototype.next = function(step) {
      var r;
      if (this.t > 1) {
        this.t = 1;
      }
      r = this.at(this.t);
      this.t += step;
      return r;
    };

    Curve.prototype.editable = function() {
      return false;
    };

    Curve.prototype.at = function(t) {
      return [t, t];
    };

    return Curve;

  })();

  Linear = (function(_super) {
    __extends(Linear, _super);

    function Linear() {
      return Linear.__super__.constructor.apply(this, arguments);
    }

    Linear.properties = {
      duration: {
        min: 100,
        max: 4000,
        "default": 1000
      }
    };

    Linear.prototype.at = function(t) {
      return [t, t];
    };

    return Linear;

  })(Curve);

  Gravity = (function(_super) {
    __extends(Gravity, _super);

    Gravity.properties = {
      bounce: {
        min: 0,
        max: 80,
        "default": 40
      },
      gravity: {
        min: 1,
        max: 4000,
        "default": 1000
      },
      expectedDuration: {
        editable: false
      }
    };

    function Gravity(options) {
      this.options = options != null ? options : {};
      this.at = __bind(this.at, this);
      this.curve = __bind(this.curve, this);
      this.init = __bind(this.init, this);
      this.length = __bind(this.length, this);
      this.gravityValue = __bind(this.gravityValue, this);
      this.bounceValue = __bind(this.bounceValue, this);
      this.duration = __bind(this.duration, this);
      this.expectedDuration = __bind(this.expectedDuration, this);
      if (this.initialForce == null) {
        this.initialForce = false;
      }
      this.options.duration = this.duration();
      Gravity.__super__.constructor.call(this, this.options);
    }

    Gravity.prototype.expectedDuration = function() {
      return this.duration();
    };

    Gravity.prototype.duration = function() {
      return Math.round(1000 * 1000 / this.options.gravity * this.length());
    };

    Gravity.prototype.bounceValue = function() {
      return Math.min(this.options.bounce / 100, 80);
    };

    Gravity.prototype.gravityValue = function() {
      return this.options.gravity / 100;
    };

    Gravity.prototype.length = function() {
      var L, b, bounce, curve, gravity;
      bounce = this.bounceValue();
      gravity = this.gravityValue();
      b = Math.sqrt(2 / gravity);
      curve = {
        a: -b,
        b: b,
        H: 1
      };
      if (this.initialForce) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      while (curve.H > 0.001) {
        L = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L * bounce,
          H: curve.H * bounce * bounce
        };
      }
      return curve.b;
    };

    Gravity.prototype.init = function() {
      var L, b, bounce, curve, gravity, _results;
      Gravity.__super__.init.apply(this, arguments);
      L = this.length();
      gravity = this.gravityValue() * L * L;
      bounce = this.bounceValue();
      b = Math.sqrt(2 / gravity);
      this.curves = [];
      curve = {
        a: -b,
        b: b,
        H: 1
      };
      if (this.initialForce) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      this.curves.push(curve);
      _results = [];
      while (curve.b < 1 && curve.H > 0.001) {
        L = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L * bounce,
          H: curve.H * bounce * bounce
        };
        _results.push(this.curves.push(curve));
      }
      return _results;
    };

    Gravity.prototype.curve = function(a, b, H, t) {
      var L, c, t2;
      L = b - a;
      t2 = (2 / L) * t - 1 - (a * 2 / L);
      c = t2 * t2 * H - H + 1;
      if (this.initialForce) {
        c = 1 - c;
      }
      return c;
    };

    Gravity.prototype.at = function(t) {
      var bounce, curve, gravity, i, v;
      bounce = this.options.bounce / 100;
      gravity = this.options.gravity;
      i = 0;
      curve = this.curves[i];
      while (!(t >= curve.a && t <= curve.b)) {
        i += 1;
        curve = this.curves[i];
        if (!curve) {
          break;
        }
      }
      if (!curve) {
        v = this.initialForce ? 0 : 1;
      } else {
        v = this.curve(curve.a, curve.b, curve.H, t);
      }
      return [t, v];
    };

    return Gravity;

  })(Curve);

  GravityWithForce = (function(_super) {
    __extends(GravityWithForce, _super);

    GravityWithForce.prototype.returnsToSelf = true;

    function GravityWithForce(options) {
      this.options = options != null ? options : {};
      this.initialForce = true;
      GravityWithForce.__super__.constructor.call(this, this.options);
    }

    return GravityWithForce;

  })(Gravity);

  Spring = (function(_super) {
    __extends(Spring, _super);

    function Spring() {
      this.at = __bind(this.at, this);
      return Spring.__super__.constructor.apply(this, arguments);
    }

    Spring.properties = {
      frequency: {
        min: 0,
        max: 100,
        "default": 15
      },
      friction: {
        min: 1,
        max: 1000,
        "default": 200
      },
      anticipationStrength: {
        min: 0,
        max: 1000,
        "default": 0
      },
      anticipationSize: {
        min: 0,
        max: 99,
        "default": 0
      },
      duration: {
        min: 100,
        max: 4000,
        "default": 1000
      }
    };

    Spring.prototype.at = function(t) {
      var A, At, a, angle, b, decal, frequency, friction, frictionT, s, v, y0, yS;
      frequency = Math.max(1, this.options.frequency);
      friction = Math.pow(20, this.options.friction / 100);
      s = this.options.anticipationSize / 100;
      decal = Math.max(0, s);
      frictionT = (t / (1 - s)) - (s / (1 - s));
      if (t < s) {
        A = (function(_this) {
          return function(t) {
            var M, a, b, x0, x1;
            M = 0.8;
            x0 = s / (1 - s);
            x1 = 0;
            b = (x0 - (M * x1)) / (x0 - x1);
            a = (M - b) / x0;
            return (a * t * _this.options.anticipationStrength / 100) + b;
          };
        })(this);
        yS = (s / (1 - s)) - (s / (1 - s));
        y0 = (0 / (1 - s)) - (s / (1 - s));
        b = Math.acos(1 / A(yS));
        a = (Math.acos(1 / A(y0)) - b) / (frequency * (-s));
      } else {
        A = (function(_this) {
          return function(t) {
            return Math.pow(friction / 10, -t) * (1 - t);
          };
        })(this);
        b = 0;
        a = 1;
      }
      At = A(frictionT);
      angle = frequency * (t - s) * a + b;
      v = 1 - (At * Math.cos(angle));
      return [t, v, At, frictionT, angle];
    };

    return Spring;

  })(Curve);

  SelfSpring = (function(_super) {
    __extends(SelfSpring, _super);

    function SelfSpring() {
      this.at = __bind(this.at, this);
      return SelfSpring.__super__.constructor.apply(this, arguments);
    }

    SelfSpring.properties = {
      frequency: {
        min: 0,
        max: 100,
        "default": 15
      },
      friction: {
        min: 1,
        max: 1000,
        "default": 200
      },
      duration: {
        min: 100,
        max: 4000,
        "default": 1000
      }
    };

    SelfSpring.prototype.returnsToSelf = true;

    SelfSpring.prototype.at = function(t) {
      var A, At, At2, Ax, angle, frequency, friction, v;
      frequency = Math.max(1, this.options.frequency);
      friction = Math.pow(20, this.options.friction / 100);
      A = (function(_this) {
        return function(t) {
          return 1 - Math.pow(friction / 10, -t) * (1 - t);
        };
      })(this);
      At = A(t);
      At2 = A(1 - t);
      Ax = (Math.cos(t * 2 * 3.14 - 3.14) / 2) + 0.5;
      Ax = Math.pow(Ax, this.options.friction / 100);
      angle = frequency * t;
      v = Math.cos(angle) * Ax;
      return [t, v, Ax, -Ax];
    };

    return SelfSpring;

  })(Curve);

  Bezier = (function(_super) {
    __extends(Bezier, _super);

    Bezier.properties = {
      points: {
        type: 'points',
        "default": [
          {
            x: 0,
            y: 0,
            controlPoints: [
              {
                x: 0.2,
                y: 0
              }
            ]
          }, {
            x: 0.5,
            y: 1.2,
            controlPoints: [
              {
                x: 0.3,
                y: 1.2
              }, {
                x: 0.8,
                y: 1.2
              }
            ]
          }, {
            x: 1,
            y: 1,
            controlPoints: [
              {
                x: 0.8,
                y: 1
              }
            ]
          }
        ]
      },
      duration: {
        min: 100,
        max: 4000,
        "default": 1000
      }
    };

    function Bezier(options) {
      this.options = options != null ? options : {};
      this.at = __bind(this.at, this);
      this.yForX = __bind(this.yForX, this);
      this.B = __bind(this.B, this);
      this.returnsToSelf = this.options.points[this.options.points.length - 1].y === 0;
      Bezier.__super__.constructor.call(this, this.options);
    }

    Bezier.prototype.editable = function() {
      return true;
    };

    Bezier.prototype.B_ = function(t, p0, p1, p2, p3) {
      return (Math.pow(1 - t, 3) * p0) + (3 * Math.pow(1 - t, 2) * t * p1) + (3 * (1 - t) * Math.pow(t, 2) * p2) + Math.pow(t, 3) * p3;
    };

    Bezier.prototype.B = function(t, p0, p1, p2, p3) {
      return {
        x: this.B_(t, p0.x, p1.x, p2.x, p3.x),
        y: this.B_(t, p0.y, p1.y, p2.y, p3.y)
      };
    };

    Bezier.prototype.yForX = function(xTarget, Bs) {
      var B, aB, i, lower, percent, upper, x, xTolerance, _i, _len;
      B = null;
      for (_i = 0, _len = Bs.length; _i < _len; _i++) {
        aB = Bs[_i];
        if (xTarget >= aB(0).x && xTarget <= aB(1).x) {
          B = aB;
        }
        if (B !== null) {
          break;
        }
      }
      if (!B) {
        if (this.returnsToSelf) {
          return 0;
        } else {
          return 1;
        }
      }
      xTolerance = 0.0001;
      lower = 0;
      upper = 1;
      percent = (upper + lower) / 2;
      x = B(percent).x;
      i = 0;
      while (Math.abs(xTarget - x) > xTolerance && i < 100) {
        if (xTarget > x) {
          lower = percent;
        } else {
          upper = percent;
        }
        percent = (upper + lower) / 2;
        x = B(percent).x;
        i += 1;
      }
      return B(percent).y;
    };

    Bezier.prototype.at = function(t) {
      var Bs, i, k, points, x, y, _fn;
      x = t;
      points = this.options.points || Bezier.properties.points["default"];
      Bs = [];
      _fn = (function(_this) {
        return function(pointA, pointB) {
          var B;
          B = function(t) {
            return _this.B(t, pointA, pointA.controlPoints[pointA.controlPoints.length - 1], pointB.controlPoints[0], pointB);
          };
          return Bs.push(B);
        };
      })(this);
      for (i in points) {
        k = parseInt(i);
        if (k >= points.length - 1) {
          break;
        }
        _fn(points[k], points[k + 1]);
      }
      y = this.yForX(x, Bs);
      return [x, y];
    };

    return Bezier;

  })(Curve);

  CustomBezier = (function(_super) {
    __extends(CustomBezier, _super);

    CustomBezier.properties = {
      friction: {
        min: 1,
        max: 1000,
        "default": 500
      },
      duration: {
        min: 100,
        max: 4000,
        "default": 1000
      }
    };

    function CustomBezier(options) {
      this.options = options != null ? options : {};
      this.at = __bind(this.at, this);
      CustomBezier.__super__.constructor.apply(this, arguments);
      this.bezier = new Bezier({
        type: Bezier,
        duration: this.options.duration,
        points: this.options.points
      });
    }

    CustomBezier.prototype.editable = function() {
      return false;
    };

    CustomBezier.prototype.at = function(t) {
      return this.bezier.at(t);
    };

    return CustomBezier;

  })(Bezier);

  EaseInOut = (function(_super) {
    __extends(EaseInOut, _super);

    function EaseInOut(options) {
      if (options == null) {
        options = {};
      }
      options.friction = options.friction || EaseInOut.properties.friction["default"];
      options.points = [
        {
          x: 0,
          y: 0,
          controlPoints: [
            {
              x: 0.92 - (options.friction / 1000),
              y: 0
            }
          ]
        }, {
          x: 1,
          y: 1,
          controlPoints: [
            {
              x: 0.08 + (options.friction / 1000),
              y: 1
            }
          ]
        }
      ];
      EaseInOut.__super__.constructor.call(this, options);
    }

    return EaseInOut;

  })(CustomBezier);

  EaseIn = (function(_super) {
    __extends(EaseIn, _super);

    function EaseIn(options) {
      if (options == null) {
        options = {};
      }
      options.friction = options.friction || EaseIn.properties.friction["default"];
      options.points = [
        {
          x: 0,
          y: 0,
          controlPoints: [
            {
              x: 0.92 - (options.friction / 1000),
              y: 0
            }
          ]
        }, {
          x: 1,
          y: 1,
          controlPoints: [
            {
              x: 1,
              y: 1
            }
          ]
        }
      ];
      EaseIn.__super__.constructor.call(this, options);
    }

    return EaseIn;

  })(CustomBezier);

  EaseOut = (function(_super) {
    __extends(EaseOut, _super);

    function EaseOut(options) {
      if (options == null) {
        options = {};
      }
      options.friction = options.friction || EaseIn.properties.friction["default"];
      options.points = [
        {
          x: 0,
          y: 0,
          controlPoints: [
            {
              x: 0,
              y: 0
            }
          ]
        }, {
          x: 1,
          y: 1,
          controlPoints: [
            {
              x: 0.08 + (options.friction / 1000),
              y: 1
            }
          ]
        }
      ];
      EaseOut.__super__.constructor.call(this, options);
    }

    return EaseOut;

  })(CustomBezier);

  curves.Spring = Spring;

  curves.SelfSpring = SelfSpring;

  curves.Gravity = Gravity;

  curves.GravityWithForce = GravityWithForce;

  curves.Linear = Linear;

  curves.Bezier = Bezier;

  curves.EaseInOut = EaseInOut;

  curves.EaseIn = EaseIn;

  curves.EaseOut = EaseOut;

  module.exports = curves;

}).call(this);
;}});


this.require.define({"helpers":function(exports, require, module){(function() {
  var Set, helpers;

  Set = require('set');

  helpers = {};

  helpers.pxProperties = new Set(['marginTop', 'marginLeft', 'marginBottom', 'marginRight', 'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'top', 'left', 'bottom', 'right', 'translateX', 'translateY', 'translateZ', 'perspectiveX', 'perspectiveY', 'perspectiveZ', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'borderRadius']);

  helpers.degProperties = new Set(['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY', 'skewZ']);

  helpers.transformProperties = new Set(['translateX', 'translateY', 'translateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY', 'skewZ', 'perspective']);

  helpers.unitForProperty = function(k, v) {
    if (typeof v !== 'number') {
      return '';
    }
    if (helpers.pxProperties.contains(k)) {
      return 'px';
    } else if (helpers.degProperties.contains(k)) {
      return 'deg';
    }
    return '';
  };

  helpers.isDefaultValueForProperty = function(k, v) {
    if (k === 'scale') {
      return v === 1;
    } else {
      return v === 0;
    }
    return false;
  };

  helpers.transformValueForProperty = function(k, v) {
    var unit;
    if (Math.abs(v) < 0.0000001) {
      v = 0;
    }
    unit = helpers.unitForProperty(k, v);
    return "" + k + "(" + v + unit + ")";
  };

  helpers.axisForTransformProperty = function(property) {
    if (property === 'perspective' || property === 'skew') {
      return ['X', 'Y'];
    } else {
      return ['X', 'Y', 'Z'];
    }
  };

  helpers.parseProperties = function(properties) {
    var axis, match, newProperties, property, value, _i, _len, _ref;
    newProperties = {};
    for (property in properties) {
      value = properties[property];
      if (helpers.transformProperties.contains(property)) {
        match = property.match(/(translate|rotate|skew|scale|perspective)(X|Y|Z|)/);
        if (match && match[2].length > 0) {
          newProperties[property] = value;
        } else {
          _ref = helpers.axisForTransformProperty(match[1]);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            axis = _ref[_i];
            newProperties[match[1] + axis] = value;
          }
        }
      } else {
        newProperties[property] = value;
      }
    }
    return newProperties;
  };

  helpers.applyFrame = function(el, properties) {
    var k, v, _results;
    if ((el.style != null)) {
      return helpers.css(el, properties);
    } else {
      _results = [];
      for (k in properties) {
        v = properties[k];
        _results.push(el[k] = v);
      }
      return _results;
    }
  };

  helpers.css = function(el, properties) {
    var k, transforms, v, _base;
    properties = helpers.parseProperties(properties);
    if (el.dynamics == null) {
      el.dynamics = {};
    }
    if ((_base = el.dynamics).style == null) {
      _base.style = {};
    }
    for (k in properties) {
      v = properties[k];
      el.dynamics.style[k] = v;
    }
    transforms = [];
    for (k in properties) {
      v = properties[k];
      if (k === 'transform') {
        transforms.push(v);
      }
      if (helpers.transformProperties.contains(k)) {
        transforms.push(helpers.transformValueForProperty(k, v));
      } else {
        el.style[helpers.support.propertyWithPrefix(k)] = "" + v + (helpers.unitForProperty(k, v));
      }
    }
    if (transforms.length > 0) {
      return el.style[helpers.support.propertyWithPrefix("transform")] = transforms.join(' ');
    }
  };

  helpers.cacheFn = function(func) {
    var cachedMethod, data;
    data = {};
    cachedMethod = function() {
      var k, key, result, _i, _len;
      key = "";
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        k = arguments[_i];
        key += k.toString() + ",";
      }
      result = data[key];
      if (!result) {
        data[key] = result = func.apply(this, arguments);
      }
      return result;
    };
    return cachedMethod;
  };

  helpers.string = {};

  helpers.string.toDashed = function(str) {
    return str.replace(/([A-Z])/g, function($1) {
      return "-" + $1.toLowerCase();
    });
  };

  helpers.support = {};

  helpers.support.prefixFor = helpers.cacheFn(function(property) {
    var k, prefix, prop, propArray, propertyName, _i, _j, _len, _len1, _ref;
    if (document.body.style[property] !== void 0) {
      return '';
    }
    propArray = property.split('-');
    propertyName = "";
    for (_i = 0, _len = propArray.length; _i < _len; _i++) {
      prop = propArray[_i];
      propertyName += prop.substring(0, 1).toUpperCase() + prop.substring(1);
    }
    _ref = ["Webkit", "Moz"];
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      prefix = _ref[_j];
      k = prefix + propertyName;
      if (document.body.style[k] !== void 0) {
        return prefix;
      }
    }
    return '';
  });

  helpers.support.propertyWithPrefix = helpers.cacheFn(function(property) {
    var prefix;
    prefix = helpers.support.prefixFor(property);
    if (prefix === 'Moz') {
      return "" + prefix + (property.substring(0, 1).toUpperCase() + property.substring(1));
    }
    if (prefix !== '') {
      return "-" + (prefix.toLowerCase()) + "-" + (helpers.string.toDashed(property));
    }
    return helpers.string.toDashed(property);
  });

  helpers.support.animationEnd = helpers.cacheFn(function() {
    var eventName, prefix;
    prefix = helpers.support.prefixFor('animation');
    if (prefix.length > 0) {
      eventName = prefix.toLowerCase() + 'AnimationEnd';
    } else {
      eventName = 'animationend';
    }
    return eventName;
  });

  module.exports = helpers;

}).call(this);
;}});


this.require.define({"animations":function(exports, require, module){(function() {
  var Animation, Animations, helpers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Animation = require('animation');

  helpers = require('helpers');

  Animations = (function() {
    function Animations(arr, style) {
      this.complete = __bind(this.complete, this);
      this.change = __bind(this.change, this);
      this.duration = __bind(this.duration, this);
      this.timeLeft = __bind(this.timeLeft, this);
      this.frame = __bind(this.frame, this);
      var animation, animationArr, axis, frame, property, transformKeys, type, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      this.style = style;
      this.animations = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        animationArr = arr[_i];
        animation = new Animation(style, animationArr[0], animationArr[1]);
        this.animations.push(animation);
      }
      frame = this.animations[0].frame(0);
      transformKeys = [];
      for (property in frame) {
        value = frame[property];
        if (helpers.transformProperties.contains(property)) {
          transformKeys.push(property);
        }
      }
      this.initialTransform = [];
      _ref = ['translate', 'scale', 'skew', 'perspective', 'rotate'];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        type = _ref[_j];
        _ref1 = ['X', 'Y', 'Z'];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          axis = _ref1[_k];
          if (axis === 'Z' && (type === 'skew' || type === 'perspective')) {
            continue;
          }
          property = type + axis;
          if (transformKeys.indexOf(property) === -1) {
            value = this.style[property];
            if (helpers.isDefaultValueForProperty(property, value)) {
              continue;
            }
            this.initialTransform.push(helpers.transformValueForProperty(property, value));
          }
        }
      }
    }

    Animations.prototype.frame = function(ts) {
      var frame, newFrame, property, transform, unit, value;
      frame = this.animations[0].frame(ts);
      return frame;
      newFrame = {};
      transform = this.initialTransform.slice();
      for (property in frame) {
        value = frame[property];
        if (helpers.transformProperties.contains(property)) {
          transform.push(helpers.transformValueForProperty(property, value));
        } else {
          if (Math.abs(value) < 0.0000001) {
            value = 0;
          }
          unit = helpers.unitForProperty(property, value);
          newFrame[helpers.support.propertyWithPrefix(property)] = value + unit;
        }
      }
      if (transform.length > this.initialTransform.length) {
        newFrame[helpers.support.propertyWithPrefix("transform")] = transform.join(' ');
      }
      return newFrame;
    };

    Animations.prototype.timeLeft = function() {
      var animation, times, _i, _len, _ref;
      times = [];
      _ref = this.animations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        animation = _ref[_i];
        times.push(animation.timeLeft());
      }
      return Math.max.apply(Math, times);
    };

    Animations.prototype.duration = function() {
      var animation, durations, _i, _len, _ref;
      durations = [];
      _ref = this.animations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        animation = _ref[_i];
        durations.push(animation.duration());
      }
      return Math.max.apply(Math, durations);
    };

    Animations.prototype.change = function() {
      var animation, _i, _len, _ref, _results;
      _ref = this.animations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        animation = _ref[_i];
        _results.push(animation.change());
      }
      return _results;
    };

    Animations.prototype.complete = function() {
      var animation, _i, _len, _ref, _results;
      _ref = this.animations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        animation = _ref[_i];
        _results.push(animation.complete());
      }
      return _results;
    };

    return Animations;

  })();

  module.exports = Animations;

}).call(this);
;}});


this.require.define({"matrix":function(exports, require, module){(function() {
  var Matrix, Vector, helpers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Vector = require('vector');

  helpers = require('helpers');

  Matrix = (function() {
    function Matrix(els) {
      this.els = els;
      this.toString = __bind(this.toString, this);
      this.decompose = __bind(this.decompose, this);
      this.inverse = __bind(this.inverse, this);
      this.augment = __bind(this.augment, this);
      this.toRightTriangular = __bind(this.toRightTriangular, this);
      this.transpose = __bind(this.transpose, this);
      this.multiply = __bind(this.multiply, this);
      this.dup = __bind(this.dup, this);
      this.e = __bind(this.e, this);
    }

    Matrix.prototype.e = function(i, j) {
      if (i < 1 || i > this.els.length || j < 1 || j > this.els[0].length) {
        return null;
      }
      return this.els[i - 1][j - 1];
    };

    Matrix.prototype.dup = function() {
      return new Matrix(this.els);
    };

    Matrix.prototype.multiply = function(matrix) {
      var M, c, cols, elements, i, j, ki, kj, nc, ni, nj, returnVector, sum;
      returnVector = matrix.modulus ? true : false;
      M = matrix.els || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = new Matrix(M).els;
      }
      ni = this.els.length;
      ki = ni;
      kj = M[0].length;
      cols = this.els[0].length;
      elements = [];
      ni += 1;
      while (--ni) {
        i = ki - ni;
        elements[i] = [];
        nj = kj;
        nj += 1;
        while (--nj) {
          j = kj - nj;
          sum = 0;
          nc = cols;
          nc += 1;
          while (--nc) {
            c = cols - nc;
            sum += this.els[i][c] * M[c][j];
          }
          elements[i][j] = sum;
        }
      }
      M = new Matrix(elements);
      if (returnVector) {
        return M.col(1);
      } else {
        return M;
      }
    };

    Matrix.prototype.transpose = function() {
      var cols, elements, i, j, ni, nj, rows;
      rows = this.els.length;
      cols = this.els[0].length;
      elements = [];
      ni = cols;
      ni += 1;
      while (--ni) {
        i = cols - ni;
        elements[i] = [];
        nj = rows;
        nj += 1;
        while (--nj) {
          j = rows - nj;
          elements[i][j] = this.els[j][i];
        }
      }
      return new Matrix(elements);
    };

    Matrix.prototype.toRightTriangular = function() {
      var M, els, i, j, k, kp, multiplier, n, np, p, _i, _j, _ref, _ref1;
      M = this.dup();
      n = this.els.length;
      k = n;
      kp = this.els[0].length;
      while (--n) {
        i = k - n;
        if (M.els[i][i] === 0) {
          for (j = _i = _ref = i + 1; _ref <= k ? _i < k : _i > k; j = _ref <= k ? ++_i : --_i) {
            if (M.els[j][i] !== 0) {
              els = [];
              np = kp;
              np += 1;
              while (--np) {
                p = kp - np;
                els.push(M.els[i][p] + M.els[j][p]);
              }
              M.els[i] = els;
              break;
            }
          }
        }
        if (M.els[i][i] !== 0) {
          for (j = _j = _ref1 = i + 1; _ref1 <= k ? _j < k : _j > k; j = _ref1 <= k ? ++_j : --_j) {
            multiplier = M.els[j][i] / M.els[i][i];
            els = [];
            np = kp;
            np += 1;
            while (--np) {
              p = kp - np;
              els.push(p <= i ? 0 : M.els[j][p] - M.els[i][p] * multiplier);
            }
            M.els[j] = els;
          }
        }
      }
      return M;
    };

    Matrix.prototype.augment = function(matrix) {
      var M, T, cols, i, j, ki, kj, ni, nj;
      M = matrix.els || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = new Matrix(M).els;
      }
      T = this.dup();
      cols = T.els[0].length;
      ni = T.els.length;
      ki = ni;
      kj = M[0].length;
      if (ni !== M.length) {
        return null;
      }
      ni += 1;
      while (--ni) {
        i = ki - ni;
        nj = kj;
        nj += 1;
        while (--nj) {
          j = kj - nj;
          T.els[i][cols + j] = M[i][j];
        }
      }
      return T;
    };

    Matrix.prototype.inverse = function() {
      var M, divisor, els, i, inverse_elements, j, ki, kp, new_element, np, p, vni, _i;
      vni = this.els.length;
      ki = ni;
      M = this.augment(Matrix.I(ni)).toRightTriangular();
      kp = M.els[0].length;
      inverse_elements = [];
      ni += 1;
      while (--ni) {
        i = ni - 1;
        els = [];
        np = kp;
        inverse_elements[i] = [];
        divisor = M.els[i][i];
        np += 1;
        while (--np) {
          p = kp - np;
          new_element = M.els[i][p] / divisor;
          els.push(new_element);
          if (p >= ki) {
            inverse_elements[i].push(new_element);
          }
        }
        M.els[i] = els;
        for (j = _i = 0; 0 <= i ? _i < i : _i > i; j = 0 <= i ? ++_i : --_i) {
          els = [];
          np = kp;
          np += 1;
          while (--np) {
            p = kp - np;
            els.push(M.els[j][p] - M.els[i][p] * M.els[j][i]);
          }
          M.els[j] = els;
        }
      }
      return new Matrix(inverse_elements);
    };

    Matrix.I = function(n) {
      var els, i, j, k, nj;
      els = [];
      k = n;
      n += 1;
      while (--n) {
        i = k - n;
        els[i] = [];
        nj = k;
        nj += 1;
        while (--nj) {
          j = k - nj;
          els[i][j] = i === j ? 1 : 0;
        }
      }
      return new Matrix(els);
    };

    Matrix.prototype.decompose = function() {
      var els, i, inversePerspectiveMatrix, j, k, matrix, pdum3, perspective, perspectiveMatrix, quaternion, result, rightHandSide, rotate, row, rowElement, s, scale, skew, t, translate, transposedInversePerspectiveMatrix, type, typeKey, v, w, x, y, z, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      matrix = this;
      translate = [];
      scale = [];
      skew = [];
      quaternion = [];
      perspective = [];
      els = [];
      for (i = _i = 0; _i <= 3; i = ++_i) {
        els[i] = [];
        for (j = _j = 0; _j <= 3; j = ++_j) {
          els[i][j] = matrix.els[i][j];
        }
      }
      if (els[3][3] === 0) {
        return false;
      }
      for (i = _k = 0; _k <= 3; i = ++_k) {
        for (j = _l = 0; _l <= 3; j = ++_l) {
          els[i][j] /= els[3][3];
        }
      }
      perspectiveMatrix = matrix.dup();
      for (i = _m = 0; _m <= 2; i = ++_m) {
        perspectiveMatrix.els[i][3] = 0;
      }
      perspectiveMatrix.els[3][3] = 1;
      if (els[0][3] !== 0 || els[1][3] !== 0 || els[2][3] !== 0) {
        rightHandSide = new Vector(els.slice(0, 4)[3]);
        inversePerspectiveMatrix = perspectiveMatrix.inverse();
        transposedInversePerspectiveMatrix = inversePerspectiveMatrix.transpose();
        perspective = transposedInversePerspectiveMatrix.multiply(rightHandSide).els;
        for (i = _n = 0; _n <= 2; i = ++_n) {
          els[i][3] = 0;
        }
        els[3][3] = 1;
      } else {
        perspective = [0, 0, 0, 1];
      }
      for (i = _o = 0; _o <= 2; i = ++_o) {
        translate[i] = els[3][i];
        els[3][i] = 0;
      }
      row = [];
      for (i = _p = 0; _p <= 2; i = ++_p) {
        row[i] = new Vector(els[i].slice(0, 3));
      }
      scale[0] = row[0].length();
      row[0] = row[0].normalize();
      skew[0] = row[0].dot(row[1]);
      row[1] = row[1].combine(row[0], 1.0, -skew[0]);
      scale[1] = row[1].length();
      row[1] = row[1].normalize();
      skew[0] /= scale[1];
      skew[1] = row[0].dot(row[2]);
      row[2] = row[2].combine(row[0], 1.0, -skew[1]);
      skew[2] = row[1].dot(row[2]);
      row[2] = row[2].combine(row[1], 1.0, -skew[2]);
      scale[2] = row[2].length();
      row[2] = row[2].normalize();
      skew[1] /= scale[2];
      skew[2] /= scale[2];
      pdum3 = row[1].cross(row[2]);
      if (row[0].dot(pdum3) < 0) {
        for (i = _q = 0; _q <= 2; i = ++_q) {
          scale[i] *= -1;
          for (j = _r = 0; _r <= 2; j = ++_r) {
            row[i].els[j] *= -1;
          }
        }
      }
      rowElement = function(index, elementIndex) {
        return row[index].els[elementIndex];
      };
      rotate = [];
      rotate[1] = Math.asin(-rowElement(0, 2));
      if (Math.cos(rotate[1]) !== 0) {
        rotate[0] = Math.atan2(rowElement(1, 2), rowElement(2, 2));
        rotate[2] = Math.atan2(rowElement(0, 1), rowElement(0, 0));
      } else {
        rotate[0] = Math.atan2(-rowElement(2, 0), rowElement(1, 1));
        rotate[1] = 0;
      }
      t = rowElement(0, 0) + rowElement(1, 1) + rowElement(2, 2) + 1.0;
      if (t > 1e-4) {
        s = 0.5 / Math.sqrt(t);
        w = 0.25 / s;
        x = (rowElement(2, 1) - rowElement(1, 2)) * s;
        y = (rowElement(0, 2) - rowElement(2, 0)) * s;
        z = (rowElement(1, 0) - rowElement(0, 1)) * s;
      } else if ((rowElement(0, 0) > rowElement(1, 1)) && (rowElement(0, 0) > rowElement(2, 2))) {
        s = Math.sqrt(1.0 + rowElement(0, 0) - rowElement(1, 1) - rowElement(2, 2)) * 2.0;
        x = 0.25 * s;
        y = (rowElement(0, 1) + rowElement(1, 0)) / s;
        z = (rowElement(0, 2) + rowElement(2, 0)) / s;
        w = (rowElement(2, 1) - rowElement(1, 2)) / s;
      } else if (rowElement(1, 1) > rowElement(2, 2)) {
        s = Math.sqrt(1.0 + rowElement(1, 1) - rowElement(0, 0) - rowElement(2, 2)) * 2.0;
        x = (rowElement(0, 1) + rowElement(1, 0)) / s;
        y = 0.25 * s;
        z = (rowElement(1, 2) + rowElement(2, 1)) / s;
        w = (rowElement(0, 2) - rowElement(2, 0)) / s;
      } else {
        s = Math.sqrt(1.0 + rowElement(2, 2) - rowElement(0, 0) - rowElement(1, 1)) * 2.0;
        x = (rowElement(0, 2) + rowElement(2, 0)) / s;
        y = (rowElement(1, 2) + rowElement(2, 1)) / s;
        z = 0.25 * s;
        w = (rowElement(1, 0) - rowElement(0, 1)) / s;
      }
      quaternion = [x, y, z, w];
      result = {
        translate: translate,
        scale: scale,
        skew: skew,
        quaternion: quaternion,
        perspective: perspective,
        rotate: rotate
      };
      for (typeKey in result) {
        type = result[typeKey];
        for (k in type) {
          v = type[k];
          if (isNaN(v)) {
            type[k] = 0;
          }
        }
      }
      return result;
    };

    Matrix.interpolate = function(decomposedA, decomposedB, t, only) {
      var angle, decomposed, i, invscale, invth, k, qa, qb, scale, th, _i, _j, _k, _l, _len, _ref, _ref1;
      if (only == null) {
        only = null;
      }
      decomposed = {};
      _ref = ['translate', 'scale', 'skew', 'perspective'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        decomposed[k] = [];
        for (i = _j = 0, _ref1 = decomposedA[k].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          if ((only == null) || only.indexOf(k) > -1 || only.indexOf("" + k + ['x', 'y', 'z'][i]) > -1) {
            decomposed[k][i] = (decomposedB[k][i] - decomposedA[k][i]) * t + decomposedA[k][i];
          } else {
            decomposed[k][i] = decomposedA[k][i];
          }
        }
      }
      if ((only == null) || only.indexOf('rotate') !== -1) {
        qa = decomposedA.quaternion;
        qb = decomposedB.quaternion;
        angle = qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2] + qa[3] * qb[3];
        if (angle < 0.0) {
          for (i = _k = 0; _k <= 3; i = ++_k) {
            qa[i] = -qa[i];
          }
          angle = -angle;
        }
        if (angle + 1.0 > .05) {
          if (1.0 - angle >= .05) {
            th = Math.acos(angle);
            invth = 1.0 / Math.sin(th);
            scale = Math.sin(th * (1.0 - t)) * invth;
            invscale = Math.sin(th * t) * invth;
          } else {
            scale = 1.0 - t;
            invscale = t;
          }
        } else {
          qb[0] = -qa[1];
          qb[1] = qa[0];
          qb[2] = -qa[3];
          qb[3] = qa[2];
          scale = Math.sin(piDouble * (.5 - t));
          invscale = Math.sin(piDouble * t);
        }
        decomposed.quaternion = [];
        for (i = _l = 0; _l <= 3; i = ++_l) {
          decomposed.quaternion[i] = qa[i] * scale + qb[i] * invscale;
        }
      } else {
        decomposed.quaternion = decomposedA.quaternion;
      }
      return decomposed;
    };

    Matrix.recompose = function(decomposedMatrix) {
      var i, j, match, matrix, quaternion, skew, temp, w, x, y, z, _i, _j, _k, _l;
      matrix = Matrix.I(4);
      for (i = _i = 0; _i <= 3; i = ++_i) {
        matrix.els[i][3] = decomposedMatrix.perspective[i];
      }
      quaternion = decomposedMatrix.quaternion;
      x = quaternion[0];
      y = quaternion[1];
      z = quaternion[2];
      w = quaternion[3];
      skew = decomposedMatrix.skew;
      match = [[1, 0], [2, 0], [2, 1]];
      for (i = _j = 2; _j >= 0; i = --_j) {
        if (skew[i]) {
          temp = Matrix.I(4);
          temp.els[match[i][0]][match[i][1]] = skew[i];
          matrix = matrix.multiply(temp);
        }
      }
      matrix = matrix.multiply(new Matrix([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0], [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0], [0, 0, 0, 1]]));
      for (i = _k = 0; _k <= 2; i = ++_k) {
        for (j = _l = 0; _l <= 2; j = ++_l) {
          matrix.els[i][j] *= decomposedMatrix.scale[i];
        }
        matrix.els[3][i] = decomposedMatrix.translate[i];
      }
      return matrix;
    };

    Matrix.prototype.toString = function() {
      var i, j, str, _i, _j;
      str = 'matrix3d(';
      for (i = _i = 0; _i <= 3; i = ++_i) {
        for (j = _j = 0; _j <= 3; j = ++_j) {
          str += this.els[i][j];
          if (!(i === 3 && j === 3)) {
            str += ',';
          }
        }
      }
      str += ')';
      return str;
    };

    Matrix.transformStringToMatrixString = helpers.cacheFn(function(transform) {
      var matrixEl, result, style;
      matrixEl = document.createElement('div');
      matrixEl.style.position = 'absolute';
      matrixEl.style.visibility = 'hidden';
      matrixEl.style[helpers.support.propertyWithPrefix("transform")] = transform;
      document.body.appendChild(matrixEl);
      style = window.getComputedStyle(matrixEl, null);
      result = style.transform || style[helpers.support.propertyWithPrefix("transform")];
      document.body.removeChild(matrixEl);
      return result;
    });

    Matrix.fromTransform = function(transform) {
      var digits, elements, i, match, matrixElements, _i;
      match = transform.match(/matrix3?d?\(([-0-9, \.]*)\)/);
      if (match) {
        digits = match[1].split(',');
        digits = digits.map(parseFloat);
        if (digits.length === 6) {
          elements = [digits[0], digits[1], 0, 0, digits[2], digits[3], 0, 0, 0, 0, 1, 0, digits[4], digits[5], 0, 1];
        } else {
          elements = digits;
        }
      } else {
        elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      }
      matrixElements = [];
      for (i = _i = 0; _i <= 3; i = ++_i) {
        matrixElements.push(elements.slice(i * 4, i * 4 + 4));
      }
      return new Matrix(matrixElements);
    };

    return Matrix;

  })();

  module.exports = Matrix;

}).call(this);
;}});


this.require.define({"set":function(exports, require, module){(function() {
  var Set;

  Set = (function() {
    function Set(array) {
      var v, _i, _len;
      this.obj = {};
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        v = array[_i];
        this.obj[v] = 1;
      }
    }

    Set.prototype.contains = function(v) {
      return this.obj[v] === 1;
    };

    return Set;

  })();

  module.exports = Set;

}).call(this);
;}});


this.require.define({"vector":function(exports, require, module){(function() {
  var Vector,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Vector = (function() {
    function Vector(els) {
      this.els = els;
      this.combine = __bind(this.combine, this);
      this.normalize = __bind(this.normalize, this);
      this.length = __bind(this.length, this);
      this.cross = __bind(this.cross, this);
      this.dot = __bind(this.dot, this);
      this.e = __bind(this.e, this);
    }

    Vector.prototype.e = function(i) {
      if (i < 1 || i > this.els.length) {
        return null;
      } else {
        return this.els[i - 1];
      }
    };

    Vector.prototype.dot = function(vector) {
      var V, n, product;
      V = vector.els || vector;
      product = 0;
      n = this.els.length;
      if (n !== V.length) {
        return null;
      }
      n += 1;
      while (--n) {
        product += this.els[n - 1] * V[n - 1];
      }
      return product;
    };

    Vector.prototype.cross = function(vector) {
      var A, B;
      B = vector.els || vector;
      if (this.els.length !== 3 || B.length !== 3) {
        return null;
      }
      A = this.els;
      return new Vector([(A[1] * B[2]) - (A[2] * B[1]), (A[2] * B[0]) - (A[0] * B[2]), (A[0] * B[1]) - (A[1] * B[0])]);
    };

    Vector.prototype.length = function() {
      var a, e, _i, _len, _ref;
      a = 0;
      _ref = this.els;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        a += Math.pow(e, 2);
      }
      return Math.sqrt(a);
    };

    Vector.prototype.normalize = function() {
      var e, i, length, newElements, _ref;
      length = this.length();
      newElements = [];
      _ref = this.els;
      for (i in _ref) {
        e = _ref[i];
        newElements[i] = e / length;
      }
      return new Vector(newElements);
    };

    Vector.prototype.combine = function(b, ascl, bscl) {
      var i, result, _i;
      result = [];
      for (i = _i = 0; _i <= 2; i = ++_i) {
        result[i] = (ascl * this.els[i]) + (bscl * b.els[i]);
      }
      return new Vector(result);
    };

    return Vector;

  })();

  module.exports = Vector;

}).call(this);
;}});


(function() {
  var Animations, Matrix, ct, curve, curves, dynamics, getStyle, helpers, runningAnimations, startAnimations, tick, type;

  curves = require('curves');

  helpers = require('helpers');

  Animations = require('animations');

  Matrix = require('matrix');

  ct = 0;

  runningAnimations = [];

  tick = function(t) {
    var frame, running, toRemove, ts, _i, _j, _len, _len1;
    ts = t - ct;
    ct = t;
    toRemove = [];
    for (_i = 0, _len = runningAnimations.length; _i < _len; _i++) {
      running = runningAnimations[_i];
      frame = running.animations.frame(ts);
      helpers.applyFrame(running.element, frame);
      if (running.animations.timeLeft() <= 0) {
        toRemove.push(running);
      }
      running.animations.change();
    }
    for (_j = 0, _len1 = toRemove.length; _j < _len1; _j++) {
      running = toRemove[_j];
      runningAnimations.splice(runningAnimations.indexOf(running), 1);
      running.animations.complete();
    }
    return requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  startAnimations = function(element, animations, options) {
    if (options == null) {
      options = {};
    }
    dynamics.stop(element);
    return runningAnimations.push({
      element: element,
      animations: animations,
      options: options
    });
  };

  getStyle = function(element, properties) {
    var property, style, _base, _i, _len;
    if (element.style != null) {
      if (element.dynamics == null) {
        element.dynamics = {};
      }
      if ((_base = element.dynamics).style == null) {
        _base.style = {};
      }
      style = element.dynamics.style;
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        property = properties[_i];
        if (style[property] == null) {
          style[property] = 0;
        }
      }
      return style;
    } else {
      return element;
    }
  };

  dynamics = function(element, properties, options) {
    var allProperties, animation, animations, animationsArr, style, _i, _len;
    if (properties instanceof Array) {
      animationsArr = properties;
    } else {
      animationsArr = [[properties, options]];
    }
    allProperties = [];
    for (_i = 0, _len = animationsArr.length; _i < _len; _i++) {
      animation = animationsArr[_i];
      allProperties = allProperties.concat(Object.keys(animation[0]));
    }
    style = getStyle(element, allProperties);
    animations = new Animations(animationsArr, style);
    return startAnimations(element, animations, options);
  };

  for (type in curves) {
    curve = curves[type];
    dynamics[type] = curve;
  }

  dynamics.stop = function(element) {
    var running, _i, _len, _ref, _results;
    _ref = runningAnimations.slice();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      running = _ref[_i];
      if (running.element === element) {
        _results.push(runningAnimations.splice(runningAnimations.indexOf(running), 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  dynamics.css = helpers.css;

  this.dynamics = dynamics;

}).call(this);

  return this.dynamics;
}.apply({});}});
;
