<?php

use alkemann\h2l\Connections;

$options = [
	'db' => 'todos',
	'user' => 'todos',
	'pass' => 'todos',
];
Connections::add('default', function() use ($options) { return new PDO($options); });
