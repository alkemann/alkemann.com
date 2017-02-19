<?php

namespace app;

use alkemann\hl\data\Connection;
use alkemann\hl\data\Db;
use alkemann\hl\data\Entity;

class Todo extends \alkemann\hl\data\Model
{

    public static function instance()
    {
        return
            new Todo([
                'table' => 'todos',
                'connection' => CONFIG_PATH . 'connection.php'
            ]);
    }

    public function string(Entity $entity)
    {
        return $entity->description;
    }

    public function delete(Entity $entity, array $options = [])
    {
        return $this->save($entity, ['status' => $entity->status - 10]);
    }
}
