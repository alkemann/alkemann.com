'use strict';
(function() {

///// globals
window.App = window.App || { Models: {}, Views: {}, Collections: {}, Router: {} }
window.t = window.t || function(id) { return _.template($("#"+id).html()); }

// Events container for general pub/sub
var vent = _.extend({}, Backbone.Events);

/////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
// Backend : Models & Collections
/////////////////////////////////////////////////////////

App.Models.Task = Backbone.Model.extend({
  defaults: {
    id: null,
    description: "",
    priority: 0,
    status: 0
  },
  urlRoot: 'api/todo.json',
  url: function() {
    return this.urlRoot + ( this.isNew() ? "" :  "?id=" + this.get('id') );
  },
});

App.Collections.Tasks = Backbone.Collection.extend({
    model: App.Models.Task,
    url:'api/todo.json'
});



/////////////////////////////////////////////////////////
// Views
/////////////////////////////////////////////////////////

// Add task view
App.Views.TaskAdd = Backbone.View.extend({

  template: t("taskAddTemplate"),
  events: {
    'submit .taskAdd': 'submitted',
    'blur .taskAdd input[type=text]': 'cancelled',
  },

  // init
  initialize: function () {},

  // methods
  render: function() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  },

  /// events
  submitted: function(e) {
    e.preventDefault();
    var newDescription = $(this.$el[0]).find("input[type=text]").val();
    if (newDescription != "")
      vent.trigger('add:submit', newDescription);

    this.undelegateEvents();
    this.remove();
  },
  cancelled: function(e) {
    vent.trigger('add:cancel');
    this.undelegateEvents();
    this.remove();
  },
});

// Task item view
App.Views.TaskItem = Backbone.View.extend({
  tagName: 'li',
  className: 'task',
  viewTemplate: t("taskListTemplate"),
  editTemplate: t("taskEditTemplate"),
  events: {
    'dblclick .taskView .label': 'renderEdit',
    'submit .taskEdit': 'update',
    'blur .taskEdit input[type=text]': 'render',
    'click .remove': 'removeClicked',
    'click .taskDone': 'toggleDone',
  },

  // init
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.removeItem); // Wondering about this
    // this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // methods
  render: function() {
    this.$el.html( this.viewTemplate( this.model.toJSON() ) );
    return this;
  },
  renderEdit: function() {
    this.$el.html( this.editTemplate( this.model.toJSON() ) );
    this.$el.find("input[type=text]").focus();
    return this;
  },
  removeItem: function() {
    this.remove();
  },

  // events
  update: function(e) {
    e.preventDefault();
    var newDescription = $(this.$el[0]).find("input[type=text]").val();
    if (newDescription != "")
      vent.trigger('update:submit', this.model, {description: newDescription});
  },
  removeClicked: function(e) {
    e.preventDefault();
    vent.trigger('remove:button', this.model);
  },
  toggleDone: function(e) {
    var newValue = this.$('.taskDone').is(":checked"); //.attr('checked') === 'checked';
    vent.trigger('done:changed', this.model, newValue);
  }
});


// Task list view
App.Views.TaskList = Backbone.View.extend({
  tagName: 'ol',
  style: 'color: blue',
  events: {
    'click .add button': 'add',
  },

  // init
  initialize: function () {
    vent.on('add:button', this.addStart, this);
    this.listenTo(this.collection, 'add', this.renderItem);
  },

  // methods
  renderItem: function(task) {
    var tv = new App.Views.TaskItem({model: task});
    this.$el.append(tv.render().el);
  },

  // events
  addStart: function(e) {
    var tv = new App.Views.TaskAdd({model: new App.Models.Task});
    this.$el.append(tv.render().el);
    window.$ii = this.$el.find("input[type=text]")
    $ii.focus();
  },

});


/////////////////////////////////////////////////////////
// App - runtime
/////////////////////////////////////////////////////////
var $task_content = $("#task-content");

var tasks = new App.Collections.Tasks();
tasks.fetch();

var tasksView = new App.Views.TaskList({collection: tasks});
$task_content.html(tasksView.render().el);

var $addButton = $("#add");
$addButton.on('click', function() {
  $addButton.hide();
  vent.trigger('add:button');
});
function showButton() { $addButton.show(); }
vent.on('add:submit', showButton);
vent.on('add:cancel', showButton);


vent.on('add:submit', function(newTitle) {
  var m = new App.Models.Task({description: newTitle});
  tasks.push(m);
  m.save();
});

vent.on('remove:button', function(task) {
  task.destroy();
});

vent.on('update:submit', function(task, updates) {
  task.save(updates, {patch: true});
});

vent.on('done:changed', function(task, newValue) {
  if (task.get('status') == 0 && newValue == true) {
    task.save({status: 1}, {patch: true})
  } else if (task.get('status') == '1' && newValue == false) {
    task.save({status: 0}, {patch: true})
  } else {
    console.log([newValue, task.toJSON()]);
  }
});


///////
})();
