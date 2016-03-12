<?php
ini_set('html_errors', false);

use alkemann\hl\data\Connection;
use alkemann\hl\data\Db;

$db = new Db(new Connection(['database' => 'todos', 'username' => 'root', 'password' => '']));
$db = $db->db('todos');

$result = true;
$ids = $this->request()->param('task');
if (empty($ids) || !is_array($ids)) {
    $this->respondWith400("Did not send an array of IDs");
}
$count = count($ids);
foreach ($ids as $i => $id) {
    $result = $result && $db->update('todos', ['id' => $id], ['priority' => $count-$i, 'updated' => 'NOW()']);
}

if ($result) 
    echo json_encode($result);
else 
    $this->respondWith400("Did not save as many as sent!");

