(function() {
'use strict';

window.TM = window.TM || { Model: {}, View: {}, Collection: {}, Router: {} }

/////////////////////////////////////////////////////////
// Views
/////////////////////////////////////////////////////////


// List all items view
TM.View.TaskList = Backbone.View.extend({
  tagName: 'div',
  attributes: {id: "myTaskListUl"},  // dynamic id?
  dragulaSettings: {
    revertOnSpill: true,
  },

  // init
  initialize: function () {
    // initializiation

    // events
    this.drake = dragula(this.dragulaSettings);
    this.listenTo(this.collection, 'add', this.renderItem);
    this.listenTo(this.collection, 'sort', this.renderFull);
    vent.on('taskList:render', this.renderFull, this);

    // dirty hack
    var theCollection = this.collection;
    this.drake.on("drop", function(moved, from_container, to_container, item_beneath) {
      // console.info({
      //   moved: moved,
      //   from_container: from_container,
      //   to_container: to_container,
      //   item_beneath: item_beneath,
      //   that: this
      // });
      var pri  = parseInt(item_beneath.attributes['data-priority'].value) + 1,
          id   = moved.attributes['data-id'].value,
          task = theCollection.get(id);

      vent.trigger("task:update", task, {priority: pri});
    });
  },

  // methods
  renderFull: function() {
    this.$el.html("");
    this.collection.each(this.renderItem, this);

    // This belongs on a "on rendered" event .. TODO is there such a thing?
    this.drake.containers = [document.querySelector('#myTaskListUl')];
    return this;
  },
  renderItem: function(task) {
    var tv = new TM.View.TaskItem({model: task});
    this.$el.append(tv.render().el);
  },

});


// Display existing Task item in list
TM.View.TaskItem = Backbone.View.extend({
  tagName: 'div',
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
    this.$el.attr("data-id", this.model.id);
    this.$el.attr("data-priority", this.model.get('priority'));
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
      vent.trigger('task:update', this.model, {description: newDescription});
  },
  removeClicked: function(e) {
    e.preventDefault();
    vent.trigger('remove:button', this.model);
  },
  toggleDone: function(e) {
    var newValue = this.$('.taskDone').is(":checked");
    vent.trigger('done:changed', this.model, newValue);
  }
});


// Add task view
TM.View.TaskAdd = Backbone.View.extend({
  template: t("taskAddTemplate"),
  events: {
    'submit .taskAdd': 'submitted',
  },

  // init
  initialize: function() {
    vent.on('add:focus', this.setFocus, this);
  },

  // methods
  render: function() {
    this.$el.html( this.template() );
    return this;
  },
  setFocus: function() {
    this.$("input[type=text]").focus();
  },

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


/////
})();
