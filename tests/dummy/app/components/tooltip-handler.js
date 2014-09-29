import Ember from 'ember';

export default Ember.Component.extend({
    tooltip: null,
    'open-on': 'click',
    'show-tooltip': function(target, content, options) {
      options = Ember.merge({
        target: target.$()[0],
        content: content.$()[0],
        position: 'top center',
        openOn: this.get('open-on')
      }, options);
      var tooltip = this.get('tooltip');
      if (tooltip != null) {
        tooltip.destory();
      }
      tooltip = new Tooltip(options);
      this.set('tooltip', tooltip);
      console.log('Show tooltip', arguments);
    },
    'hide-tooltip': function() {
      var tooltip = this.get('tooltip');
      if (tooltip) {
        tooltip.destory();
      }
      console.log('Close tooltip', arguments);
    }
  }
);
