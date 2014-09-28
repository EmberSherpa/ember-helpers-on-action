import DOMAction from '../action';

export default Ember.Mixin.create({
  registry: null,
  createRegistry: function() {
    this.set('registry', {});
  }.on('init'),
  bindHandlers: function() {
    this.get('childViews')
      .filter(function(view){
        return view.hasOwnProperty('handles')
      })
      .forEach(function(view){
        // register view with the dispatcher

      }, this);
  }.on('willInsertElement'),
  register: function(action) {
    if (action instanceof DOMAction) {

    }
  }
});
