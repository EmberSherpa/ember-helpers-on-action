import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    'show-tooltip': function(){
      this.sendAction('action', this);
    }
  }
});
