(function() {

///// globals
window.App = window.App || { Models: {}, Views: {}, Collections: {}, Router: {} }
window.t = window.t || function(id) { return _.template($("#"+id).html()); }

/////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
// Models
/////////////////////////////////////////////////////////

App.Models.Task = Backbone.Model.extend({
  defaults: {id: null, title: ""}
});


/////////////////////////////////////////////////////////
// Collections
/////////////////////////////////////////////////////////

App.Collections.Tasks = Backbone.Collection.extend({model: App.Models.Task});


/////////////////////////////////////////////////////////
// Views
/////////////////////////////////////////////////////////

// Task item view
App.Views.TaskItem = Backbone.View.extend({
  tagName: 'li',
  className: 'task',
  viewTemplate: t("taskListTemplate"),
  editTemplate: t("taskEditTemplate"),
  events: {
    'dblclick .taskView .label': 'edit',
    'submit .taskEdit': 'update',
    'blur .taskEdit input[type=text]': 'render',
  },

  // methods
  render: function() {
    this.$el.html( this.viewTemplate( this.model.toJSON() ) );
    return this;
  },

  /// events
  edit: function(e) {
    this.$el.html( this.editTemplate( this.model.toJSON() ) );
    this.$el.find("input[type=text]").focus();
  },
  update: function(e) {
    e.preventDefault();
    // grab new value and set to model
    var $input = $(this.$el[0]).find("input[type=text]");
    var newTitle = $input.val();
    this.model.set('title', newTitle);
    // set view back
    this.$el.html( this.viewTemplate( this.model.toJSON() ) );
  },
  remove: function(e) {},
  add: function(e) {}
});

// Task list view
App.Views.TaskList = Backbone.View.extend({
  tagName: 'ol',
  style: 'color: blue',

  // methods
  render: function() {
    this.collection.each(this.addItem, this);
    return this;
  },
  addItem: function(task) {
    var tv = new App.Views.TaskItem({model: task});
    this.$el.append(tv.render().el);
  }

});

})();
