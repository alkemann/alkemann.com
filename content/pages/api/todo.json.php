<?php
ini_set('html_errors', false);
$api = new app\Api($this, $this->request(), app\Todo::instance());
$result = $api();
echo json_encode($result);