<link rel="stylesheet" href="css/dragula.css">
<!-- Start HTML -->
<div id="content">
    <h1>Tasks</h1>
    <ul class="taskMenu"><li><a href="#purge">Archive completed tasks</a></li></ul>
    <div id="taskList"></div>
</div>

<!-- Templates -->
<script id="taskListTemplate" type="text/template">
	<input type="checkbox" class="taskDone" name="taskDone<%= id %>" value="<%= id %>" <%= status == 1 ? 'checked="checked"' : '' %> />
    <span class="label taskDescription <%= status == 1 ? 'done' : '' %> "><%= description %></span>
    <a href="#delete/<%= id %>" class="remove">X</a>
</script>
<script id="taskEditTemplate" type="text/template">
    <form class="taskEdit">
        <input type="text" name="taskEdit<%= id %>" onfocus="this.select();" value="<%= description %>" />
    </form>
</script>
<script id="taskAddTemplate" type="text/template">
    <form class="taskAdd">
        <input type="text" name="taskAdd" onfocus="this.select();" placeholder="Next task?" />
    </form>
</script>

<!-- scripts -->
<script src="js/libs/underscore.js"></script>
<script src="js/libs/zepto.js"></script>
<script src="js/libs/backbone.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/dragula/3.6.8/dragula.min.js'></script>
<script src="js/app.js"></script>
<script src="js/router.js"></script>
<script src="js/models.js"></script>
<script src="js/views.js"></script>
<script type="text/javascript"> (function() { 
    var app = new TM.View.App;
    window.app = app;
})();</script>
