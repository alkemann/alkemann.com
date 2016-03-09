'use strict';

// List all items view
TM.View.TaskList = Backbone.View.extend({
  tagName: 'ol',


  // init
  initialize: function () {
    this.listenTo(this.collection, 'add', this.renderItem);
    this.listenTo(this.collection, 'sort', this.renderFull);
    vent.on('taskList:render', this.renderFull, this);
  },

  // methods
  renderFull: function() {
    this.$el.html("");
    this.collection.each(this.renderItem, this);
    return this;
  },
  renderItem: function(task) {
    var tv = new TM.View.TaskItem({model: task});
    this.$el.append(tv.render().el);
  },

});

// Display existing Task item in list
TM.View.TaskItem = Backbone.View.extend({
  tagName: 'li',
  className: 'task',
  viewTemplate: t("taskListTemplate"),
  editTemplate: t("taskEditTemplate"),
  events: {
    'dblclick .taskDescription': 'renderEdit',
    'blur .taskEdit input[type=text]': 'render',
    'submit .taskEdit': 'update',
    'click .remove': 'removeClicked',
    'click .taskDone': 'toggleDone',
  },

  // init
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.removeItem);
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

// Add task view
TM.View.TaskAdd = Backbone.View.extend({
  template: t("taskAddTemplate"),
  events: {
    'submit .taskAdd': 'submitted',
  },

  // methods
  render: function() {
    this.$el.html( this.template() );
    return this;
  }
,
  /// events
  submitted: function(e) {
    e.preventDefault();
    var newDescription = $(this.$el[0]).find("input[type=text]").val();
    if (newDescription != "")
      vent.trigger('add:submit', newDescription);

    this.remove();
    vent.trigger('add:render'); // default behavior is to keep adding new
  },

});