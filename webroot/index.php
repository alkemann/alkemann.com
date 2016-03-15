<?php
define('FIRST_APP_CONSTANT', 'FIRST_APP_CONSTANT');
//** auto defines - dont change these
define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(dirname(__FILE__))));
define('WEBROOT_DIR', basename(dirname(__FILE__)));
define('WWW_ROOT', dirname(__FILE__) . DS);
define('CONTENT_PATH', ROOT . DS . 'content' . DS);
define('LAYOUT_PATH', CONTENT_PATH . 'layout' . DS);
define('LIBS_PATH', ROOT . DS . 'vendor' . DS);
define('RESOURCE_DIR', 'resources');
define('LOGS_PATH', ROOT . DS . RESOURCE_DIR . DS . 'logs' . DS);
define('LOCALES_PATH', ROOT . DS . RESOURCE_DIR . DS . 'locales' . DS);
define('CONFIG_PATH', ROOT . DS . RESOURCE_DIR . DS . 'configs' . DS);
define('HL_PATH', LIBS_PATH . 'alkemann/h.l/src' . DS );

require_once(CONFIG_PATH . 'defines.php');
require_once(LIBS_PATH . 'autoload.php');
require_once(HL_PATH . 'bootstrap.php');
require_once(CONFIG_PATH . 'routes.php');

if (DEBUG) dbp(['_config', '_classes']);

$request = new alkemann\hl\core\Request();
try {
    $request->response()->render();
} catch (Exception $e) {
   alkemann\hl\core\handleError($e, $request);
}
