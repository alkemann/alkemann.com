(function() {
'use strict';

window.TM   = window.TM || { Model: {}, View: {}, Collection: {} }

/////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////

TM.Router = Backbone.Router.extend({
  routes: {
    "purge": "purge",
    "add": "add",
  },

  // Route actions
  purge: function() {
    vent.trigger('purge:clicked');
    this.navigate("");
  },
  add: function() {
    vent.trigger('add:focus');
  },

});

TM.router = new TM.Router;
Backbone.history.start();


/////
})();
