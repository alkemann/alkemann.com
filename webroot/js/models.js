'use strict';

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
    url:'api/tasks?limit=100&status=0'
});

