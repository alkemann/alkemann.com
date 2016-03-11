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


/////////////////////////////////////////////////////////
// General local functions
/////////////////////////////////////////////////////////

vent.on('remove:button', destroyRemovedTasks);
vent.on('update:submit', updateTask);
vent.on('done:changed',  doneCheckboxToggled);


/////////////////////////////////////////////////////////
// General local functions
/////////////////////////////////////////////////////////

function updateTask(task, updates) {
  task.save(updates, {patch: true});
};

function doneCheckboxToggled(task, newValue) {
  if (task.get('status') == 0 && newValue == true) {
    task.save({status: 1}, {patch: true})
  } else if (task.get('status') == '1' && newValue == false) {
    task.save({status: 0}, {patch: true})
  } else {
    console.error([newValue, task.toJSON()]);
  }
};

function destroyRemovedTasks(task) {
  task.destroy();
}



/////
})();
