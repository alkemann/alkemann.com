<?php

use alkemann\hl\core\Router;
use alkemann\hl\core\Response;
use alkemann\hl\core\Request;
use alkemann\hl\core\Error;

Router::alias('/', 'home');

// Post new resoure
Router::add('|^api/(?<resource>\w+)$|', function($request) {
    switch ($request->param('resource')) {
        case 'task':
        case 'todo':
            $model = app\Todo::instance();
            break;
        default:
            return new Error(404);
    }
    $json = $request->getPostBody();
    if (!$json) return new Error(400, "Missing a post body");
    $data = json_decode($json, true);
    if ($data === false || $data === null) return new Error(400, "Invalid json body");
    $entity = $model->create($data);
    if (!$entity->save($data)) return new Error(400, "Invalid data");
    return new Response($entity); // automatically json encoded
}, Request::POST);


// Get or Update resoure
Router::add('|^api/(?<resource>\w+)/(?<id>\d+)$|', function($request) {
    switch ($request->param('resource')) {
        case 'task':
        case 'todo':
            $model = app\Todo::instance();
            break;
        default:
            return new Error(404);
    }

    $entity = $model->get($request->param('id'));
    if (!$entity) return new Error(404);

    switch ($request->method()) {

        case Request::GET:
            break; // nothing to do

        case Request::PATCH:
        case Request::PUT:
            $json = $request->getPostBody();
            if (!$json)
                return new Error(400, "Missing a post body");
            $data = json_decode($json, true);
            if ($data === false || $data === null)
                return new Error(400, "Invalid json body");
            if (!$entity->save($data))
                return new Error(400, "Invalid data");
            break;

        case Request::DELETE:
            if (!$entity->delete()) return new Error(500, "Unable to delete");
            break;
    }

    return new Response($entity); // automatically json encoded
}, [Request::GET, Request::PATCH, Request::PUT, Request::DELETE]);


// List GET endpoint(s)
Router::add('|^api/(?<resource>\w+)$|', function($request) {
    switch ($request->param('resource')) {
        case 'tasks':
        case 'todos':
            $model = app\Todo::instance();
            break;
        default:
            return new Error(404);
    }
    // TODO get conditions nicer out of URL GET params
    $conditions = $_GET;
    unset($conditions['url']);
    $options = [];
    if (isset($conditions['limit'])) {
        $options['limit'] = $conditions['limit'];
        unset($conditions['limit']);
    }
    if (isset($conditions['order'])) {
        $options['order'] = $conditions['order'];
        unset($conditions['order']);
    }
    if (isset($conditions['fields'])) {
        $options['fields'] = $conditions['fields'];
        unset($conditions['fields']);
    }
    $entities = $model->find($conditions, $options);
    return new Response($entities);
}, Request::GET);
