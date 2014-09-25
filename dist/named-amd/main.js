define("ember-dom-actions/action",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * Returns a new DOMAction
     */
    __exports__["default"] = function(handler, options) {
      return new DOMAction(handler, options);
    }

    function DOMAction(handler, options) {
      if (!(this instanceof DOMAction)) {
        return new DOMAction(handler, options);
      }
      if (Ember.typeOf(handler) === 'string') {
        this.eventName = handler;
      }
      if (Ember.typeOf(handler) === 'function') {
        this.func = handler;
      }
      options = Ember.merge({
        afterRender: false,
        bubble: false
      }, options);

      this.afterRender = options.afterRender;
      this.bubble = options.bubble;
    }

    __exports__.DOMAction = DOMAction;DOMAction.prototype.constructor = DOMAction;

    /**
     * Name of the event to trigger on the
     * @type {null}
     */
    DOMAction.prototype.eventName = null;
    /**
     * View that this action targets
     * @type {null}
     */
    DOMAction.prototype.view = null;
    /**
     * Function that will be called when action is triggered
     * @type {null}
     */
    DOMAction.prototype.func = null;

    DOMAction.prototype.setup = function(view) {
      this.view = view;
    };

    DOMAction.prototype.apply = function(controller, args) {
      var view = this.view;

      if (view && this.eventName != null && view.trigger != null) {
        args.unshift(this.eventName);
        if (this.afterRender) {
          //Ember.run.scheduleOnce('afterRender', view, view.trigger, args);
          Ember.run.scheduleOnce('afterRender', view, function() {
            view.trigger.apply(view, args);
          });
        } else {
          view.trigger.apply(view, args);
        }
        if (this.bubble) {
          return true;
        }
      }

      if (this.func != null) {
        var controllerProxy = Ember.ObjectProxy.create({
          content: controller,
          view: view
        });
        return this.func.apply(controllerProxy, args);
      }
    };
  });
define("ember-dom-actions/factories/follow-parent",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * Returns a new Ember.View mixin that will cause the recipient of the mixin to bind to it's parent's event called {eventName}.
     * When the bound parent triggers {eventName}, the recipient will trigger {eventName} and pass along the arguments.
     * @param eventName
     * @returns {*}
     */
    __exports__["default"] = function followParent(eventName) {
      var options = {};
      var methodName = 'bind' + eventName.camelize();
      options[methodName] = function() {
        var parentView = this.get('parentView');
        if (parentView) {
          parentView.on(eventName, this, function(){
            var args = [].slice.apply(arguments);
            args.unshift(eventName);
            this.trigger.apply(this, args);
          });
        }
      }.on('didInsertElement');
      return Ember.Mixin.create(options);
    }
  });
define("ember-dom-actions",
  ["./action","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DOMAction = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = DOMAction;
  });
define("ember-dom-actions/mixins/bind-dom-actions",
  ["ember","../action","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var DOMAction = __dependency2__.DOMAction;

    /**
     * Ember.View mixin that will cause the view to bind itself to parent's controller's DOM Actions.
     * When used on Component, the mixin will go to parentView's controller.
     */
    __exports__["default"] = Ember.Mixin.create({
      _bindDOMActions: function() {
        var view;
        if (this instanceof Ember.Component) {
          view = this.get('parentView');
        } else if (this instanceof Ember.View){
          view = this;
        }
        Ember.assert("DOMActionMixin can only be used with a View or a Component", view != null);
        // get controller's actions hash
        var actions = view.get('controller._actions') || {};
        Ember.keys(actions).forEach(function(actionName){
          var action = actions[actionName];
          if (action instanceof DOMAction) {
            action.setup(this);
          }
        }, view);
      }.on('didInsertElement')
    });
  });
define("ember-dom-actions/mixins/nesting-helpers",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Mixin.create({
      /**
       * Return closes parent component of a specific type.
       * @param {string} componentName
       */
      parentComponent: function parentComponent(componentName) {
        var component = this.container.lookupFactory('component:%@'.fmt(componentName));
        Ember.assert('Must pass a valid component name - %@ was not found.', component);

        // TODO: write traversing mechanism
      },
      /**
       * Return first child component by component name.
       * @param componentName
       */
      childComponent: function childComponent(componentName) {
        var component = this.container.lookupFactory('component:%@'.fmt(componentName));
        Ember.assert('Must pass a valid component name - %@ was not found.', component);

        return (this.get('_childViews') || []).find(function findChild(item, index){
          // TODO: write recursive mechanism
          return item instanceof component;
        });
      }
    });
  });