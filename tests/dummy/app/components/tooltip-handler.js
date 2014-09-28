import Ember from 'ember';

export default Ember.Component.extend(
  {
    handles: ['show-tooltip', 'hide-tooltip'],
    tooltip: null,
    'show-tooltip': function(target, content, options) {
      options = Ember.merge({
        target: target.$()[0],
        content: content.$()[0],
        position: 'top center'
      }, options);
      var tooltip = this.get('tooltip');
      if (tooltip != null) {
        tooltip.destory();
      }
      tooltip = new Tooltip(options);
      this.set('tooltip', tooltip);
      console.log('Showing tooltip: ', target);
    }.on('show-tooltip'),
    'hide-tooltip': function() {
      var tooltip = this.get('tooltip');
      if (tooltip) {
        tooltip.destory();
      }
      console.log('Hiding tooltip: ', target);
    }.on('hide-tooltip')
  }
);
