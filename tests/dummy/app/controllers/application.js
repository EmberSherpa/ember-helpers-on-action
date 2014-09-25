import Ember from 'ember';
import domAction from 'ember-dom-actions/action';

export default Ember.Controller.extend({
  actions: {
    'show-tooltip': domAction('show-tooltip'),
    'hide-tooltip': domAction('hide-tooltip')
  }
});
