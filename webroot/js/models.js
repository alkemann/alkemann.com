(function() {
'use strict';

window.TM = window.TM || { Model: {}, View: {}, Collection: {}, Router: {} }

/////////////////////////////////////////////////////////
// Backend : Models & Collections
/////////////////////////////////////////////////////////

TM.Model.Task = Backbone.Model.extend({
  defaults: {
    id: null,
    description: "",
    priority: 0,
    status: 0,
  },
  urlRoot: 'api/tasks',
  url: function() {
    return this.urlRoot + ( this.isNew() ? "" :  "?id=" + this.get('id') );
  },
});

TM.Collection.Tasks = Backbone.Collection.extend({
  model: TM.Model.Task,
  url:'api/tasks?limit=100&status=0',
  comparator: function(a, b) {
    var ai = parseInt(a.get('priority')),
        bi = parseInt(b.get('priority'));
    if (ai === bi) return 0;
    return ai < bi ? 1 : -1;
  }
});

/////
})();
