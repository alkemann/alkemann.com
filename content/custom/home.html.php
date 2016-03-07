<!-- Start HTML -->
<h1>Tasks</h1>
<div id="task-content"></div>

<!-- Templates -->
<script id="taskListTemplate" type="text/template">
    <form class="taskView"><input type="checkbox" class="taskDone" name="taskDone<%= id %>" value="<%= id %>" /> <span class="label"><%= title %></span>
    <button class="remove">DEL</button></form>
</script>
<script id="taskEditTemplate" type="text/template">
    <form class="taskEdit">
        <input type="text" name="taskEdit<%= id %>" onfocus="this.select();" value="<%= title %>" />
    </form>
</script>
<script id="taskAddTemplate" type="text/template">
    <form class="taskAdd">
        <input type="text" name="taskAdd<%= id %>" onfocus="this.select();" value="<%= title %>" placeholder="Placeholder text" />
    </form>
</script>

<!-- scripts -->
<script src="js/libs/underscore.js"></script>
<script src="js/libs/zepto.js"></script>
<script src="js/libs/backbone.js"></script>
<script src="js/app.js"></script>
<!-- App runtime -->
<script type="text/javascript">
    /////////////////////////////////////////////////////////
    // App - runtime
    /////////////////////////////////////////////////////////
    window.$tt = $("#task-content");

    var tasks = new App.Collections.Tasks([
      {id: 1, title: "Learn backbone"},
      {id: 2, title: "Learn underscore"},
      {id: 3, title: "Learn implement backend api"},
      {id: 4, title: "Learn win"},
    ])
    var tasksView = new App.Views.TaskList({collection: tasks});
    $tt.html(tasksView.render().el);

</script>