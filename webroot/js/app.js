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
  defaults: {id: null, title: ""}
});

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
  addTemplate: t("taskAddTemplate"),
  events: {
    'dblclick .taskView .label': 'renderEdit',
    'submit .taskEdit': 'update',
    'submit .taskAdd': 'add',
    'blur .taskEdit input[type=text]': 'render',
    'blur .taskAdd input[type=text]': 'cancelAdd',
  },

  // init
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    // this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // methods
  render: function() {
    this.$el.html( this.viewTemplate( this.model.toJSON() ) );
    return this;
  },
  renderAdd: function() {
    this.$el.html( this.addTemplate( this.model.toJSON() ) );
    return this;
  },
  renderEdit: function() {
    this.$el.html( this.editTemplate( this.model.toJSON() ) );
    this.$el.find("input[type=text]").focus();
    return this;
  },

  /// events
  add: function(e) {
    e.preventDefault();
    var newTitle = $(this.$el[0]).find("input[type=text]").val();
    if (newTitle != "")
      this.model.set('title', newTitle);
  },
  cancelAdd: function(e) {
    this.undelegateEvents();
    this.remove();
    vent.trigger('taskAdd:cancel');
  },
  update: function(e) {
    e.preventDefault();
    var newTitle = $(this.$el[0]).find("input[type=text]").val();
    if (newTitle != "")
      this.model.set('title', newTitle);
  },
  remove: function(e) {},
  add: function(e) {}
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
    vent.on('taskAdd:cancel', this.addCancelled, this)
  },

  // methods
  render: function() {
    this.collection.each(this.addItem, this);
    this.$el.append("<li class='add'><button> + </button></li>")
    return this;
  },
  addItem: function(task) {
    var tv = new App.Views.TaskItem({model: task});
    this.$el.append(tv.render().el);
  },
  addCancelled: function() {
    var model = this.collection.pop();
    model.destroy();
  },


  // events
  add: function() {
    var $li = this.$el.find("li.add");
    var buttonHtml = $li[0];
    $li.remove();
    var m = new App.Models.Task({}); // title: "<do this>"
    this.collection.push(m);
    var tv = new App.Views.TaskItem({model: m});
    this.$el.append(tv.renderAdd().el);
    window.$ii = this.$el.find("input[type=text]")
    $ii.focus();

    this.$el.append(buttonHtml);
  }

});

})();
