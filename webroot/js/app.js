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
    this.collection.fetch();

    // Set up the view parts
    this.views = {};
    this.views.collection = new TM.View.TaskList({collection: this.collection});
    this.views.$addButton = this.$("#taskAdd button");

    // Set up all events reaction for the ap
    vent.on('add:button',     this.addStart, this);
    vent.on('add:submit',     this.showButton, this);
    vent.on('add:cancel',     this.showButton, this);
    vent.on('add:submit',     this.addSubmit, this);
    vent.on('remove:button',  this.removeButton, this);
    vent.on('update:submit',  this.updateSubmit, this);
    vent.on('done:changed',   this.doneCheckboxToggled, this);

    // Populate collection and render app view
    this.render();
  },

  // methods
  render: function() {
    // no template, modifies the #content div that exists on page
    this.$("#taskList").html( this.views.collection.render().el );
    return this;
  },
  showButton: function() {
    this.views.$addButton.show();
  },

  // events
  addStart: function() {
    this.views.$addButton.hide();
    var tv = new TM.View.TaskAdd({model: new TM.Model.Task});
    var $listView = this.views.collection.$el;
    $listView.append(tv.render().el);
    window.$ii = $listView.find("input[type=text]");
    $ii.focus();
  },
  addSubmit: function(newTitle) {
    var m = new TM.Model.Task({description: newTitle});
    this.collection.push(m);
    m.save();
  },
  updateSubmit: function(task, updates) {
    task.save(updates, {patch: true});
  },
  removeButton: function(task) {
    task.destroy();
  },
  doneCheckboxToggled: function(task, newValue) {
    if (task.get('status') == 0 && newValue == true) {
      task.save({status: 1}, {patch: true})
    } else if (task.get('status') == '1' && newValue == false) {
      task.save({status: 0}, {patch: true})
    } else {
      console.error([newValue, task.toJSON()]);
    }
  }

});


///////
})();
