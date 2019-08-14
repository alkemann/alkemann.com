<?php

namespace app;

use alkemann\h2l\data\Db;
use alkemann\h2l\traits\{Entity, Model};

class Todo implements \JsonSerializable
{
    use Entity, Model;

    public static $table = 'todos';

    public function delete()
    {
        return $this->save(['status' => $this->status - 10]);
    }

    public function JsonSerialize()
    {
        return $this->data;
    }
}
