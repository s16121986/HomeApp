<?php

$config = parse_ini_file(ROOT_PATH . '/.env', true, INI_SCANNER_TYPED);
//var_dump($config);exit;
$dbConfig = [
	'host' => $config['DB_HOST'],
	'database' => $config['DB_DATABASE'],
	'username' => $config['DB_USERNAME'],
	'password' => $config['DB_PASSWORD'],
	'charset' => 'utf8'
];
$mysqli = new mysqli();
$mysqli->init();
$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);

$port = null;
$socket = null;

$flag = $mysqli->real_connect($dbConfig['host'], $dbConfig['username'], $dbConfig['password'], $dbConfig['database'], $port, $socket);
if (!$flag || $mysqli->connect_error)
	throw new Exception\RuntimeException(
		'Connection error', null, new Exception\ErrorException($mysqli->connect_error, $mysqli->connect_errno)
	);

$mysqli->set_charset($dbConfig['charset']);

register_shutdown_function(function () use ($mysqli) {
	$mysqli->close();
});

return $mysqli;
//$mysqli->query('SET time_zone="' . $dbConfig['timezone'] . '"'); //SET time_zone = '-05:00';
