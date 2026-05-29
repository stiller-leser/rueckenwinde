<?php

defined('ABSPATH') || exit;

add_action('wp_enqueue_scripts', 'rueckenwinde_dynamic_styles', 1000);
function rueckenwinde_dynamic_styles() {
    $bg_color              = '#' . get_theme_mod('background_color');
    $header_textcolor      = '#' . get_theme_mod('header_textcolor');
    $font_color            = get_theme_mod('rueckenwinde_font_color');
    $headline_color        = get_theme_mod('rueckenwinde_headline_color');
    $link_color            = get_theme_mod('rueckenwinde_link_color');
    $sidebar_color         = get_theme_mod('rueckenwinde_sidebar_color');
    $meta_color            = get_theme_mod('rueckenwinde_meta_color');
    $nav_link_color        = get_theme_mod('navigation_link_color');
    $font_size_sidebar     = get_theme_mod('rueckenwinde_font_size_sidebar');
    $font_size_article_p   = get_theme_mod('rueckenwinde_font_size_article_p');
    $font_size_h1          = get_theme_mod('rueckenwinde_font_size_h1');
    $font_size_h2          = get_theme_mod('rueckenwinde_font_size_h2');
    $font_size_h3          = get_theme_mod('rueckenwinde_font_size_h3');
    $font_size_h4          = get_theme_mod('rueckenwinde_font_size_h4');
    $font_size_h5          = get_theme_mod('rueckenwinde_font_size_h5');
    $font_size_h6          = get_theme_mod('rueckenwinde_font_size_h6');
    $font_size_nav         = get_theme_mod('rueckenwinde_font_size_nav');
    $font_size_master_p    = get_theme_mod('rueckenwinde_font_size_master_p');
    $font_size_master_mobile = get_theme_mod('rueckenwinde_font_size_master_p_mobile');

    $css = "
body,
#iot-menu-left {
    background: {$bg_color} !important;
}

.master:not(:first-child) {
    border-color: {$bg_color} !important;
}

.category-description {
    background-color: white;
}

p {
    color: {$font_color};
}

#secondary .widget h4,
#secondary .srpw-title {
    font-size: {$font_size_sidebar} !important;
}

.blog main article p,
.search-results main article p,
.archive main article p,
.entry-content :is(p,li,a),
.srpw-summary :is(a,p),
.comment-content p,
.country-hero-title,
.route-hero-info :is(li,a),
.highlights-hero-link,
.tagebuch-body,
.tagebuch-link,
.laendernavigation a,
.credits,
.footer-menu li a,
#about p {
    font-size: {$font_size_article_p};
}

html #page h1,
#page #about h1,
.site-title h1,
html #site-description h1 {
    font-size: {$font_size_h1};
}

html #page h2,
.site-title h2 {
    font-size: {$font_size_h2};
}

html #page h3,
html #page .srpw-title {
    font-size: {$font_size_h3};
}

html #page h4,
#secondary .widget .widgettitle,
.master .content h4,
.highlights-hero-image-label,
html #page .yotu-videos .yotu-video .yotu-video-title {
    font-size: {$font_size_h4};
}

html #page h5,
#secondary .widget h3 {
    font-size: {$font_size_h5};
}

html #page h6 {
    font-size: {$font_size_h6};
}

#site-navigation .menu .page_item a,
#site-navigation .menu .menu-item a {
    font-size: {$font_size_nav};
}

.master .content p {
    font-size: {$font_size_master_p};
}

.site-branding h1 i,
.site-branding h1 div,
.site-branding h2 i,
.site-branding h2 div {
    color: {$header_textcolor};
}

#primary-menu a,
.site-description,
span.footer-info-right a,
.footer-menu li a,
.footer-widgets-container h4,
.footer-widgets-container a {
    color: {$nav_link_color};
}

.single .content-area h1,
.single .content-area h2,
.single .content-area h3,
.single .content-area h4,
.single .content-area h5,
.single .content-area h6,
#page #site-description h1,
.page .content-area h1,
.page .content-area h2,
.page .content-area h3,
.page .content-area h4,
.page .content-area h5,
.page .content-area h6,
.page .content-area th,
.single .content-area th,
.blog.related-posts main article h4 a,
.single b.fn,
.page b.fn,
.error404 h1,
.search-results h1.page-title,
.search-no-results h1.page-title,
.archive h1.page-title,
.index-footer-widget-area h2,
main article a h2.entry-title,
main h1,
main .master .content h4,
#about h1 {
    color: {$headline_color};
}

.blog.related-posts main article h4 a,
article .entry-meta a,
article .entry-meta a time,
.comments-area .comment-metadata time,
.privacy-policy .entry-content a,
#secondary a,
.single .content-area a.url,
.master i,
.srpw-li a,
.entry-content p a {
    color: {$link_color} !important;
}

#secondary .srpw-summary p,
.no-results h2,
.entry-title a,
.entry-content a p,
.entry-content p,
.comment-content p,
.privacy-policy li,
.sub-menu .menu-item a,
#iot-menu-left li a,
.stat-value {
    color: {$font_color} !important;
}

#secondary .widget-title,
#secondary .widgettitle,
.yotu-videos .yotu-video .yotu-video-title {
    color: {$sidebar_color} !important;
}

#secondary .srpw-time,
main article .entry-meta,
.entry-meta *,
.comments-area .comment-metadata time,
.single .content-area .fn,
nf-section div {
    color: {$meta_color} !important;
}

.post-type-archive-panamericana .content-wrap,
.panamericana .master {
    background-image: url(" . esc_url(z_taxonomy_image_url(193)) . ");
}

.post-type-archive-reiseziele .content-wrap,
.reiseziele .master {
    background-image: url(" . esc_url(z_taxonomy_image_url(9)) . ");
}

.post-type-archive-reiseplanung .content-wrap,
.reiseplanung .master {
    background-image: url(" . esc_url(z_taxonomy_image_url(209)) . ");
}

.post-type-archive-vanlife .content-wrap,
.vanlife .master {
    background-image: url(" . esc_url(z_taxonomy_image_url(15)) . ");
}

.post-type-archive-paragliding .content-wrap,
.paragliding .master {
    background-image: url(" . esc_url(z_taxonomy_image_url(208)) . ");
}

@media screen and (max-width: 950px) {
    .master .content p {
        font-size: {$font_size_master_mobile};
    }
}
";

    wp_add_inline_style('rueckenwinde-styles', $css);
}

add_action('customize_register', 'rueckenwinde_add_colors', 999);
function rueckenwinde_add_colors($wp_customize) {
    $colors = array(
        'rueckenwinde_link_color'     => array('label' => 'Link color',     'default' => '#333333'),
        'rueckenwinde_headline_color' => array('label' => 'Headline color', 'default' => '#000'),
        'rueckenwinde_font_color'     => array('label' => 'Font color',     'default' => '#ffffff'),
        'rueckenwinde_sidebar_color'  => array('label' => 'Sidebar color',  'default' => '#ffffff'),
        'rueckenwinde_meta_color'     => array('label' => 'Meta color',     'default' => '#bbb'),
    );

    foreach ($colors as $setting_id => $config) {
        $wp_customize->add_setting($setting_id, array('default' => $config['default']));
        $wp_customize->add_control(
            new WP_Customize_Color_Control($wp_customize, $setting_id, array(
                'label'    => __($config['label'], 'rueckenwinde'),
                'section'  => 'colors',
                'settings' => $setting_id,
            ))
        );
    }
}

add_action('customize_register', 'rueckenwinde_add_font_sizes', 999);
function rueckenwinde_add_font_sizes($wp_customize) {
    $wp_customize->add_section('rueckenwinde_font_sizes', array(
        'title'    => __('Schriftgrößen', 'rueckenwinde'),
        'priority' => 30,
    ));

    $font_sizes = array(
        'rueckenwinde_font_size_sidebar'        => array('label' => 'Sidebar Schriftgröße',             'default' => '16px'),
        'rueckenwinde_font_size_article_p'      => array('label' => 'Artikel-Text Schriftgröße',        'default' => '18px'),
        'rueckenwinde_font_size_h1'             => array('label' => 'H1 Schriftgröße',                  'default' => '2.5em'),
        'rueckenwinde_font_size_h2'             => array('label' => 'H2 Schriftgröße',                  'default' => '2em'),
        'rueckenwinde_font_size_h3'             => array('label' => 'H3 Schriftgröße',                  'default' => '1.75em'),
        'rueckenwinde_font_size_h4'             => array('label' => 'H4 Schriftgröße',                  'default' => '1.5em'),
        'rueckenwinde_font_size_h5'             => array('label' => 'H5 Schriftgröße',                  'default' => '1.25em'),
        'rueckenwinde_font_size_h6'             => array('label' => 'H6 Schriftgröße',                  'default' => '1em'),
        'rueckenwinde_font_size_nav'            => array('label' => 'Navigation Schriftgröße',           'default' => '1.8em'),
        'rueckenwinde_font_size_master_p'       => array('label' => 'Master-Text Schriftgröße',         'default' => '2em'),
        'rueckenwinde_font_size_master_p_mobile' => array('label' => 'Master-Text Schriftgröße (Mobile)', 'default' => '1.3em'),
    );

    foreach ($font_sizes as $setting_id => $config) {
        $wp_customize->add_setting($setting_id, array('default' => $config['default']));
        $wp_customize->add_control($setting_id, array(
            'label'    => __($config['label'], 'rueckenwinde'),
            'section'  => 'rueckenwinde_font_sizes',
            'type'     => 'text',
            'settings' => $setting_id,
        ));
    }
}
