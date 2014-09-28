import Ember from 'ember';
import DOMAction from 'ember-dom-actions/action';
import DispatcherMixin from 'ember-dom-actions/mixins/dispatcher';

export default Ember.Handlebars.makeBoundHelper(onActionHelper);
var get = Ember.get;

/**
 * Bind an event emitter to an action on context via a Handlebars Helper
 *
 * {{on-action 'paginate' trigger="jump-to-top"}}
 *
 * @param {string} actionName
 * @param {object} options
 */
function onActionHelper(actionName, options){
  Ember.assert("{{on-action}} actionName parameter is missing.", actionName != null);

  var context = get(options, 'hash.context') || this;
  var view = get(options, 'data.view');
  var eventName = get(options, 'hash.trigger') || actionName;
  var actions = get(context, '_actions') || {};
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
  var domAction = action instanceof DOMAction ? action : DOMAction.convert(context, actionName, eventName);
  domAction.register(eventName, view);

  if (DispatcherMixin.detect(view)) {
    view.register(eventName, domAction);
  }
}
