<h1>Todos</h1>

<ul>
<?php
$todos = app\Todo::Instance()->find();
foreach ($todos as $t) {
    echo '<li><label><input type="checkbox" name="todo[' . $t->id . ']" />' . $t->string() . '</label>';
}
?>
</ul>

<form method="POST" action="api/todo/new">
<input type="text" name="description" placeholder="New todo" /> <input type="submit" value="Add" />
</form>