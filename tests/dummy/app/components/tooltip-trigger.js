import Ember from 'ember';
import NestingHelpersMixin from 'ember-dom-actions/mixins/nesting-helpers';

export default Ember.Component.extend(NestingHelpersMixin, {
  /**
   * Content to be passed to the tooltip handler.
   * @type {string}
   */
  content: null,
  /**
   * Position of the tooltip relative to this element
   */
  position: 'top center',
  actions: {
    'show': function(){
      var content = this.get('content') || this.childComponent('tooltip-content');
      this.sendAction('action', this, content, {
        position: this.get('position')
      });
    }
  }
});
