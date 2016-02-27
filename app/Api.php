<?php

namespace app;

use alkemann\hl\core\Request;
use alkemann\hl\core\Render;

class Api {

    protected $model;
    protected $request;
    protected $render;

    public function __construct(Render $render, Request $request, $model) {
        $this->render   = $render;
        $this->request  = $request;
        $this->model    = $model;
    }

    public function __invoke() {
        $request    = $this->request;
        switch ($request->method()) {

            case Request::GET :
                if (isset($_GET['id'])) { // Get single entity
                    $id = $_GET['id'];
                    $round = $this->model->get($id);
                    if ($round) {
                        return $round;
                    } else {
                        $this->render->respondWith404();
                    }
                } else { // Get list of entities
                    $conditions = $_GET;
                    $options = [];
                    if (isset($conditions['limit'])) {
                        $options['limit'] = $conditions['limit'];
                        unset($conditions['limit']);
                    }
                    return $this->model->find($conditions, $options);
                }
            break;

            case Request::POST :
                $json = $request->getPostBody();
                if (!$json) {
                    return $this->render->respondWith400("Missing a post body");
                }
                $data = json_decode($json, true);
                if ($data === false || $data === null) {
                    return $this->render->respondWith400("Invalid json body");
                }
                $entity = $this->model->create($data);
                if ($entity->save()) {
                    dd($entity, $data);
                    return $entity;
                } else {
                    return $this->render->respondWith400("Invalid data");
                }
            break;

            default:
                throw new Exception("Unsupported HTTP request method: " . $this->request()->method());
        }
    }
}