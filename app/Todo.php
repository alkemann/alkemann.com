<?php

namespace app;

use alkemann\hl\data\Connection;
use alkemann\hl\data\Db;

class Todo extends \alkemann\hl\data\Model
{

    public static function instance()
    {
        return
            new Todo(
                new Db(
                    new Connection(['database' => 'todos', 'username' => 'root', 'password' => ''])
                ), 
                [
                    'db' => 'todos',
                    'table' => 'todos',
                    'fields' => ['id', 'priority', 'description', 'status', 'updated', 'created']
                ]
            );
    }

    public function string($entity)
    {
        return $entity->description;
    }
}