import Ember from 'ember';
import {followParent} from 'ember-dom-actions/mixin';

export default Ember.Component.extend(
  followParent('show-tooltip'),
  {
    'show-tooltip': function(target) {
      console.log('Showing tooltip: ', target);
    }
  }
);
