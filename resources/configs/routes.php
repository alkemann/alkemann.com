<?php

use alkemann\h2l\{Router, Log, Response, Request, response\Error, util\Http };
use app\Json;

Router::alias('/', 'home');

// Post new resoure
Router::add('|^/api/(?<resource>\w+)$|', function($request) {
    ini_set('html_errors', 0);
    switch ($request->param('resource')) {
        case 'tasks':
        case 'todo':
            $model = app\Todo::class;
            break;
        default:
            return new Json(null, 404);
    }
    $json = $request->body();
    if (!$json) return new Json("Missing a post body", 400);
    if (is_string($json)) {
        $data = json_decode($json, true);
    } else {
        $data = $json;
    }
    if (!is_array($data)) {
         return new Json("Bad request body", 400);
    }
    $entity = new $model($data);
    if (!$entity->save($data)) return new Json(400, "Invalid data");
    return new Json($entity); // automatically json encoded
}, Http::POST);


// Get or Update resoure
Router::add('|^/api/(?<resource>\w+)/(?<id>\d+)$|', function($request) {
    ini_set('html_errors', 0);
    switch ($request->param('resource')) {
        case 'tasks':
        case 'todo':
            $model = app\Todo::class;
            break;
        default:
            return new Json(null, 404);
    }

    $entity = $model::get($request->param('id'));
    if (!$entity) return new Json(null, 404);

    switch ($request->method()) {

        case Http::GET:
            break; // nothing to do

        case Http::PATCH:
        case Http::PUT:
            $json = $request->body();
            if (!$json) return new Json("Missing a post body", 400);
            if (is_string($json)) {
                $data = json_decode($json, true);
            } else {
                $data = $json;
            }
            if (!is_array($data)) {
                 return new Json("Bad request body", 400);
            }
            if ($data === false || $data === null)
                return new Json("Invalid json body", 400);
            if (!$entity->save($data))
                return new Json("Invalid data", 400);
            break;

        case Http::DELETE:
            if (!$entity->delete()) return new Json("Unable to delete", 500);
            break;
    }

    return new Json($entity); // automatically json encoded
}, [Http::GET, Http::PATCH, Http::PUT, Http::DELETE]);


// List GET endpoint(s)
Router::add('|^/api/(?<resource>\w+)$|', function($request) {
    ini_set('html_errors', 0);
    switch ($request->param('resource')) {
        case 'tasks':
        case 'todo':
            $model = app\Todo::class;
            break;
        default:
            return new Json(null, 404);
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
    $entities = $model::findAsArray($conditions, $options);
    return new Json(array_values($entities));
}, Http::GET);
