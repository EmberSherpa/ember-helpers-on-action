import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    close: function() {
      // TODO: implement parent discovery
      this.sendAction('action', this.parent('tooltip-trigger'));
    }
  }
});
