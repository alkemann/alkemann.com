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


vent.on("task:update",   updateTask);
vent.on('remove:button', destroyRemovedTasks);
vent.on('done:changed',  toggleStatusOfTask);
vent.on('list:sorted',   saveListSortOrder);


/////////////////////////////////////////////////////////
// General functions
/////////////////////////////////////////////////////////

function updateTask(task, updates) {
  task.save(updates, {patch: true});
};

function toggleStatusOfTask(task, newStatusValue) {
  if (task.get('status') == 0 && newStatusValue == true) {
    task.save({status: 1}, {patch: true})
  } else if (task.get('status') == '1' && newStatusValue == false) {
    task.save({status: 0}, {patch: true})
  } else {
    console.error([newStatusValue, task.toJSON()]);
  }
};

function destroyRemovedTasks(task) {
  task.destroy();
}

function saveListSortOrder(saveString) {
  // TODO save in delayed timeout
  $.post('/api/tasks/sort.json?' + saveString)
    .error(function(data) {
      console.error('Error: ' + data);
    });
}

/////
})();
