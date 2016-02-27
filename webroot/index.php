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
require_once(CONFIG_PATH . 'bootstrap.php');
require_once(CONFIG_PATH . 'routes.php');

dbp(['_config', '_classes']);

try {
    $Dispatch = new alkemann\hl\core\Dispatch();
    $Dispatch->run();
} catch (Exception $e) {
    $errorHandler = new alkemann\hl\core\ErrorHandler($e);
    $errorHandler->dispatch($Dispatch);
    $errorHandler->deal();
}
