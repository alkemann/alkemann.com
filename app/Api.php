<?php

namespace app;

use alkemann\hl\core\Request;
use alkemann\hl\core\Page;

class Api {

    protected $model;
    protected $request;
    protected $render;

    public function __construct(Page $render, Request $request, $model) {
        $this->render   = $render;
        $this->request  = $request;
        $this->model    = $model;
    }

    public function __invoke() {
        $request    = $this->request;
        $id         = $request->param('id');
        switch ($request->method()) {

            case Request::GET :
                if ($id) { // Get single entity
                    $entity = $this->model->get($id);
                    if ($entity) {
                        return $entity;
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
                    if (isset($conditions['order'])) {
                        $options['order'] = $conditions['order'];
                        unset($conditions['order']);
                    }
                    return $this->model->find($conditions, $options);
                }
            break;

            case Request::DELETE :
                if ($id) { // Get single entity
                    $entity = $this->model->get($id);
                    if ($entity) {
                        return $entity->delete();
                    } else {
                        $this->render->respondWith404();
                    }
                } else {
                    $this->render->respondWith400("Missing id");
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
                if ($id || isset($data['id'])) { // Update entity
                    return $this->render->respondWith400("Use PUT for Update");
                }
                $entity = $this->model->create($data);
                if ($entity->save()) {
                    return $entity;
                } else {
                    return $this->render->respondWith400("Invalid data");
                }
            break;

            case Request::PATCH :
            case Request::PUT :
                $json = $request->getPostBody();
                if (!$json) {
                    return $this->render->respondWith400("Missing a post body");
                }
                $data = json_decode($json, true);
                if ($data === false || $data === null) {
                    return $this->render->respondWith400("Invalid json body");
                }
                if (!$id) { // Update entity
                    return $this->render->respondWith404();
                }
                $entity = $this->model->get($id);
                if (!$entity) {
                    return $this->render->respondWith404();
                }
                if ($entity->save($data)) {
                    return $entity;
                } else {
                    return $this->render->respondWith400("Invalid data");
                }
            break;

            default:
                throw new \Exception("Unsupported HTTP request method: " . $request->method());
        }
    }
}