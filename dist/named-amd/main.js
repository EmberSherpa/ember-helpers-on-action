define("ember-dom-actions/action",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var DOMAction = Ember.Object.extend(Ember.Evented, {
      /**
       * Name of the action that is being triggered
       */
      actionName: null,
      /**
       * Original function defined on the controller
       */
      actionFunction: null,
      /**
       * Name of the event to trigger
       */
      eventName: null,
      /**
       * Object where the action is defined
       */
      source: null,
      apply: function(target, args) {
        this.trigger('action', args);
        return this.perform(target, args);
      },
      /**
       * Call the function that this object wraps
       * @param target
       * @param args
       * @returns {*}
       */
      perform: function(target, args) {
        return this.get('actionFunction').apply(target, args);
      },
      /**
       * Bind an event to this object. This allows us to trigger an event by same name on all registered views.
       * @param view
       */
      register: function(view) {
        Ember.assert("View must be an Ember.view", view instanceof Ember.View);
        var eventName = this.get('eventName');
        this.on('action', function triggerViewAction(args){
          view.trigger.apply(view, [eventName].concat(args));
        });
        Ember.Logger.info('Registered %@ onto %@'.fmt(eventName, view.toString()));
      }
    });

    DOMAction.reopenClass({
      convert: function(target, actionName, eventName) {
        Ember.assert("Target must implement Ember.ActionHandlerMixin - ie. be controller.", Ember.ActionHandler.detect(target));
        var func =  target._actions[actionName];
        var action = DOMAction.create({
          actionFunction: func,
          actionName: actionName,
          eventName: eventName,
          source: target
        });
        target._actions[actionName] = action;
        return action;
      }
    });

    __exports__["default"] = DOMAction;
  });
define("ember-dom-actions/helper",
  ["ember","ember-dom-actions/action","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var DOMAction = __dependency2__["default"] || __dependency2__;

    var get = Ember.get;

    /**
     * Bind an event emitter to an action on context via a Handlebars Helper
     *
     * {{on-action 'paginate' trigger="jump-to-top"}}
     *
     * @param {string} actionName
     * @param {object} options
     */
    __exports__["default"] = function onActionHelper(actionName, options){
      Ember.assert("{{on-action}} actionName parameter is missing.", actionName != null);

      var context = get(options, 'hash.context') || this;
      var view = get(options, 'data.view.parentView');
      var eventName = get(options, 'hash.trigger') || actionName;
      if (get(context, '_actions') == null) {
        context._actions = {};
      }
      var actions = get(context, '_actions');
      var action;

      if (actions.hasOwnProperty(actionName)) {
        action = actions[actionName];
      } else {
        var bubble = options.hash.bubble || false;
        action = function defaultAction() {
          return bubble;
        };
        actions[actionName] = action;
      }
      action = action instanceof DOMAction ? action : DOMAction.convert(context, actionName, eventName);

      /**
       * Register view with the action.
       * When action is triggered, the event will be triggered on this view.
       */
      action.register(view);
    }
  });
define("ember-dom-actions",
  ["./action","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DOMAction = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = DOMAction;
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

        return (this.get('_childViews') || []).find(function findChild(item){
          // TODO: write recursive mechanism
          return item instanceof component;
        });
      }
    });
  });