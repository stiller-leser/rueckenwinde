<?php

defined('ABSPATH') || exit;

add_action('customize_register', 'remove_pro_ad', 999);
function remove_pro_ad($wp_customize) {
    $wp_customize->remove_section('writers-blogily_theme');
}

add_action('wp', 'remove_my_action');
function remove_my_action() {
    remove_action('wp_head', 'seo_writers_blogily_customize_register_output');
}

add_action('admin_menu', 'remove_meow_apps', 999);
function remove_meow_apps() {
    remove_menu_page('admin.php?page=meowapps-main-menu');
}

function rueckenwinde_scripts() {
    wp_enqueue_style('rueckenwinde-styles', RUECKENWINDE_PLUGIN_URL . '/rueckenwinde-styles.css', array(), '1.0');
    wp_enqueue_script('rueckenwinde-scripts', RUECKENWINDE_PLUGIN_URL . '/rueckenwinde-scripts.js', array('jquery'), '1.0');
}
add_action('wp_enqueue_scripts', 'rueckenwinde_scripts', 999);

add_filter('template_include', 'rueckenwinde_template_include', 11);
function rueckenwinde_template_include($template) {
    $plugin_template = RUECKENWINDE_PLUGIN_DIR . '/templates/' . basename($template);
    if (file_exists($plugin_template)) {
        $template = $plugin_template;
    }
    return $template;
}

add_filter('pre_get_posts', 'my_cptui_add_post_types_to_archives');
function my_cptui_add_post_types_to_archives($query) {
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    if ((is_category() || is_tag()) && empty($query->query_vars['suppress_filters'])) {
        $cptui_post_types = cptui_get_post_type_slugs();

        $query->set(
            'post_type',
            array_merge(
                array('post', 'reiseziele', 'reiseplanung', 'vanlife', 'paragliding'),
                $cptui_post_types
            )
        );
    }
}

function rueckenwinde_header_widgets_init() {
    register_sidebar(array(
        'name'          => __('Header-Widget-Area', 'rueckenwinde'),
        'id'            => 'header-widget-area',
        'before_widget' => '<div class="widget header-widget-area">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'rueckenwinde_header_widgets_init');

function rueckenwinde_index_widgets_init() {
    register_sidebar(array(
        'name'          => __('Index-Widget-Area', 'rueckenwinde'),
        'id'            => 'index-widget-area',
        'before_widget' => '<div class="widget index-widget-area">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'rueckenwinde_index_widgets_init');

function rueckenwinde_index_footer_widgets_init() {
    register_sidebar(array(
        'name'          => __('Index-Footer-Widget-Area', 'rueckenwinde'),
        'id'            => 'index-footer-widget-area',
        'before_widget' => '<div class="widget index-footer-widget-area">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'rueckenwinde_index_footer_widgets_init');

register_nav_menu('frontpage', __('Frontpage Navigation', 'rueckenwinde'));

add_action('init', 'rueckenwinde_register_blocks');
function rueckenwinde_register_blocks() {
    $blocks_dir = RUECKENWINDE_PLUGIN_DIR . 'blocks/';
    foreach (glob($blocks_dir . '*/block.json') as $block_json) {
        register_block_type(dirname($block_json));
    }
}

add_action('enqueue_block_editor_assets', 'rueckenwinde_editor_foundation');
function rueckenwinde_editor_foundation() {
    wp_enqueue_style(
        'foundation-editor',
        get_template_directory_uri() . '/css/foundation.css',
        array(),
        '6.7.4'
    );
}

add_filter('the_content', 'rueckenwinde_auto_append_cta', 20);
function rueckenwinde_auto_append_cta($content) {
    if (is_admin() || !is_main_query() || !in_the_loop() || !is_singular()) {
        return $content;
    }

    $post_type = get_post_type();
    $allowed_types = apply_filters('rueckenwinde_cta_auto_post_types', array('post', 'reiseplanung', 'vanlife', 'reiseziele', 'paragliding'));
    if (!in_array($post_type, $allowed_types, true)) {
        return $content;
    }

    if (strpos($content, 'wp:rueckenwinde/beratungs-cta') !== false) {
        return $content;
    }

    $cta_block = do_blocks('<!-- wp:rueckenwinde/beratungs-cta /-->');
    return $content . $cta_block;
}

if (!function_exists('rueckenwinde_is_panamericana_post')) {
    function rueckenwinde_is_panamericana_post($post_id) {
        if (!$post_id) {
            return false;
        }

        if (has_category('panamericana', $post_id)) {
            return true;
        }

        $categories = get_the_category($post_id);
        if (!is_array($categories)) {
            return false;
        }

        foreach ($categories as $category) {
            if (!isset($category->slug) || !isset($category->name)) {
                continue;
            }
            if (strtolower($category->slug) === 'panamericana' || strtolower($category->name) === 'panamericana') {
                return true;
            }
        }

        return false;
    }
}

if (!function_exists('rueckenwinde_insert_html_after_first_third')) {
    function rueckenwinde_insert_html_after_first_third($content, $insertion_html) {
        $plain_text = trim(wp_strip_all_tags($content));
        if ($plain_text === '') {
            return $content . $insertion_html;
        }

        $strlen = function_exists('mb_strlen') ? 'mb_strlen' : 'strlen';
        $target_length = (int) floor($strlen($plain_text) / 3);
        if ($target_length < 1) {
            return $content . $insertion_html;
        }

        $pattern = '/<\/(?:p|ul|ol|blockquote|figure|h2|h3|h4|table)>/i';
        if (!preg_match_all($pattern, $content, $matches, PREG_OFFSET_CAPTURE)) {
            return $content . $insertion_html;
        }

        foreach ($matches[0] as $match) {
            $end_position = (int) $match[1] + $strlen($match[0]);
            $slice = substr($content, 0, $end_position);
            $slice_text = trim(wp_strip_all_tags($slice));
            if ($slice_text !== '' && $strlen($slice_text) >= $target_length) {
                return substr($content, 0, $end_position) . $insertion_html . substr($content, $end_position);
            }
        }

        return $content . $insertion_html;
    }
}

add_filter('the_content', 'rueckenwinde_auto_append_panamericana_shop_cta', 25);
function rueckenwinde_auto_append_panamericana_shop_cta($content) {
    if (is_admin() || !is_main_query() || !in_the_loop() || !is_singular('post')) {
        return $content;
    }

    $post_id = get_the_ID();
    if (!$post_id || !rueckenwinde_is_panamericana_post($post_id)) {
        return $content;
    }

    if (
        strpos($content, 'wp:rueckenwinde/panamericana-inarticle-shop-cta') !== false ||
        strpos($content, 'wp-block-rueckenwinde-panamericana-inarticle-shop-cta') !== false
    ) {
        return $content;
    }

    $default_attrs = array(
        'icon'            => '🧭',
        'headline'        => 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt',
        'textTemplate'    => 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].',
        'buttonLabel'     => 'Hol dir den Guide (PDF)',
        'buttonUrl'       => '#',
        'fallbackCountry' => 'dieses Land',
    );
    $option_values = get_option('rueckenwinde_shop_cta_settings', array());
    $option_values = is_array($option_values) ? $option_values : array();
    $mapped_option_values = array(
        'icon'            => isset($option_values['icon']) ? $option_values['icon'] : $default_attrs['icon'],
        'headline'        => isset($option_values['headline']) ? $option_values['headline'] : $default_attrs['headline'],
        'textTemplate'    => isset($option_values['text_template']) ? $option_values['text_template'] : $default_attrs['textTemplate'],
        'buttonLabel'     => isset($option_values['button_label']) ? $option_values['button_label'] : $default_attrs['buttonLabel'],
        'buttonUrl'       => isset($option_values['button_url']) ? $option_values['button_url'] : $default_attrs['buttonUrl'],
        'fallbackCountry' => isset($option_values['fallback_country']) ? $option_values['fallback_country'] : $default_attrs['fallbackCountry'],
    );
    $attrs = apply_filters(
        'rueckenwinde_panamericana_inarticle_shop_cta_attrs',
        wp_parse_args($mapped_option_values, $default_attrs),
        $post_id
    );
    $block_markup = sprintf(
        '<!-- wp:rueckenwinde/panamericana-inarticle-shop-cta %s /-->',
        wp_json_encode($attrs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
    );

    $cta_html = do_blocks($block_markup);
    return rueckenwinde_insert_html_after_first_third($content, $cta_html);
}
