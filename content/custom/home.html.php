<!-- Start HTML -->
<h1>Tasks</h1>
<div id="task-content"></div>
<div id="task-add"><button id='add'> + </button></div>


<!-- Templates -->
<script id="taskListTemplate" type="text/template">
    <form class="taskView"><input type="checkbox" class="taskDone" name="taskDone<%= id %>" value="<%= id %>" /> <span class="label"><%= description %></span>
    <button class="remove">DEL</button></form>
</script>
<script id="taskEditTemplate" type="text/template">
    <form class="taskEdit">
        <input type="text" name="taskEdit<%= id %>" onfocus="this.select();" value="<%= description %>" />
    </form>
</script>
<script id="taskAddTemplate" type="text/template">
    <form class="taskAdd">
        <input type="text" name="taskAdd<%= id %>" onfocus="this.select();" value="<%= description %>" placeholder="Placeholder text" />
    </form>
</script>

<!-- scripts -->
<script src="js/libs/underscore.js"></script>
<script src="js/libs/zepto.js"></script>
<script src="js/libs/backbone.js"></script>
<script src="js/app.js"></script>
