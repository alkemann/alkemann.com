'use strict';
(function() {

///// globals
window.TM = window.TM || { Model: {}, View: {}, Collection: {}, Router: {} }
window.t = window.t || function(id) { return _.template($("#"+id).html()); }

// Events container for general pub/sub
window.vent = _.extend({}, Backbone.Events);

/////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////

TM.Router = Backbone.Router.extend({
  routes: {
    "purge": "purge"
  },

  purge: function() {
    vent.trigger('purge:clicked');
    this.navigate("");
  }


});


/////////////////////////////////////////////////////////
// App View
/////////////////////////////////////////////////////////

TM.View.App = Backbone.View.extend({
  el: '#content',

  // INIT
  initialize: function() {
    // Grab the collection
    this.collection = new TM.Collection.Tasks;
    this.collection.fetch({success: function() {
      vent.trigger("add:render");
    }});

    // Set up the view parts
    this.views = {};
    this.views.collection = new TM.View.TaskList({collection: this.collection});

    // Set up all events reaction for the ap
    vent.on('add:render',     this.renderAddView, this);
    vent.on('add:submit',     this.addSubmit, this);
    vent.on('purge:clicked',    this.purgeCompletedTodos, this);

    vent.on('remove:button',  removeButton);
    vent.on('update:submit',  updateSubmit);
    vent.on('done:changed',   doneCheckboxToggled);

    // Listen to all events and display them
    // vent.on('all', function(eventName) { console.info('EVENT: ' + eventName); });

    // Populate collection and render app view
    this.render();

    new TM.Router;
    Backbone.history.start();
  },

  // methods
  render: function() {
    // no template, modifies the #content div that exists on page
    this.$("#taskList").html( this.views.collection.el );
    return this;
  },
  renderAddView: function() {
    var tv = new TM.View.TaskAdd();
    var $listView = this.views.collection.$el;
    $listView.append(tv.render().el);
    window.$ii = $listView.find("input[type=text]");
    $ii.focus();
  },

  // events
  addSubmit: function(newTitle) {
    var m = new TM.Model.Task({description: newTitle});
    this.collection.push(m);
    m.save();
  },
  purgeCompletedTodos: function() {
    var completedTasks = [];
    this.collection.each(function(task) {
      if (task.get('status') != 0) completedTasks.push(task);
    });
    this.collection.remove(completedTasks);

    vent.trigger("taskList:render");
    vent.trigger("add:render");
  },

});

function updateSubmit(task, updates) {
  task.save(updates, {patch: true});
};

function removeButton(task) {
  task.destroy();
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


///////
})();
