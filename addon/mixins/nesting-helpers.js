import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Return closes parent component of a specific type.
   * @param {string} componentName
   */
  parentComponent: function parentComponent(componentName) {
    var component = this.container.lookupFactory('component:%@'.fmt(componentName));
    Ember.assert('Must pass a valid component name - %@ was not found.', component);

    // TODO: write traversing mechanism
  },
  /**
   * Return first child component by component name.
   * @param componentName
   */
  childComponent: function childComponent(componentName) {
    var component = this.container.lookupFactory('component:%@'.fmt(componentName));
    Ember.assert('Must pass a valid component name - %@ was not found.', component);

    return (this.get('_childViews') || []).find(function findChild(item){
      // TODO: write recursive mechanism
      return item instanceof component;
    });
  }
});
