import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    paginate: function(page) {
      console.log('pagination action', page);
    }
  }
});
