<?php

defined('ABSPATH') || exit;

function get_rueckenwinde_header($menu, $template = null) {
    $header_template = RUECKENWINDE_PLUGIN_DIR . '/templates/header.php';
    if (file_exists($header_template)) {
        load_template($header_template, null, array('menu' => $menu, 'template' => $template));
    }
}

function get_rueckenwinde_footer() {
    $footer_template = RUECKENWINDE_PLUGIN_DIR . '/templates/footer.php';
    if (file_exists($footer_template)) {
        load_template($footer_template);
    }
}

function get_rueckenwinde_part($part) {
    $template_part = RUECKENWINDE_PLUGIN_DIR . '/template-parts/' . basename($part . '.php');
    if (file_exists($template_part)) {
        load_template($template_part, false);
    }
}
