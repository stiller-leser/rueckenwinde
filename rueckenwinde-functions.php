<?php
/*
Plugin Name: Rueckenwinde - Grandchild theme plugin
Description: Grandchild theme for rueckenwin.de build as a plugin.
Author: Kaj-Sören Mossdorf
Author URI: https://rueckenwin.de
Version: 1.0
*/

defined('ABSPATH') || exit;

$inc_dir = plugin_dir_path(__FILE__) . 'inc/';

require_once $inc_dir . 'constants.php';
require_once $inc_dir . 'template-tags.php';
require_once $inc_dir . 'functions.php';
require_once $inc_dir . 'customizer.php';
require_once $inc_dir . 'admin-pages.php';
require_once $inc_dir . 'lead-capture.php';
