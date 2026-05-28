<?php
/*
Plugin Name: Rueckenwinde - Grandchild theme plugin
Description: Grandchild theme for rueckenwin.de build as a plugin.
Author: Kaj-Sören Mossdorf
Author URI: https://rueckenwin.de
Version: 1.0
*/

// Remove that annoying pro ad in the customizer
function remove_pro_ad( $wp_customize ) {
    $wp_customize->remove_section( 'writers-blogily_theme' );
}
add_action( 'customize_register', 'remove_pro_ad', 999 );

function remove_my_action(){
      remove_action( 'wp_head', 'seo_writers_blogily_customize_register_output');
}
add_action( 'wp', 'remove_my_action' );

function remove_meow_apps(){
    remove_menu_page( 'admin.php?page=meowapps-main-menu' );
}
add_action( 'admin_menu', 'remove_meow_apps', 999 );

function rueckenwinde_style() {
    ?>
        <style>
            body,
            #iot-menu-left {
                background: #<?php echo esc_attr(get_theme_mod( 'background_color' )); ?> !important;
            }

            .master:not(:first-child) {
                border-color: #<?php echo esc_attr(get_theme_mod( 'background_color' )); ?> !important;
            }

            .category-description {
                background-color: white;
            }

            p {
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_color' )); ?>;
            }

            #secondary .widget h4,
            #secondary .srpw-title {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_sidebar' )); ?> !important;
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
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_article_p' )); ?>;
            }

            html #page h1,
            #page #about h1,
            .site-title h1,
            html #site-description h1 {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_h1' )); ?>;
            }

            html #page h2,
            .site-title h2 {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_h2' )); ?>;
            }

            html #page h3,
            html #page .srpw-title {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_h3' )); ?>;
            }

            html #page h4,
            #secondary .widget .widgettitle,
            .master .content h4,
            .highlights-hero-image-label,
            html #page .yotu-videos .yotu-video .yotu-video-title {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_h4' )); ?>;
            }

            html #page h5,
            #secondary .widget h3 {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_h5' )); ?>;
            }

            html #page h6 {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_h6' )); ?>;
            }

            #site-navigation .menu .page_item a,
            #site-navigation .menu .menu-item a {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_nav' )); ?>;
            }

            .master .content p {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_master_p' )); ?>;
            }

            .site-branding h1 i,
            .site-branding h1 div,
            .site-branding h2 i,
            .site-branding h2 div {
                color: #<?php echo esc_attr(get_theme_mod( 'header_textcolor' )); ?>;
            }

            #primary-menu a,
            .site-description,
            span.footer-info-right a,
            .footer-menu li a,
            .footer-widgets-container h4,
            .footer-widgets-container a {
                color: <?php echo esc_attr(get_theme_mod( 'navigation_link_color' )); ?>;
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
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_headline_color' )); ?>;
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
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_link_color' )); ?> !important;
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
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_color' )); ?> !important;
            }

            #secondary .widget-title,
            #secondary .widgettitle,
            .yotu-videos .yotu-video .yotu-video-title {
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_sidebar_color' )); ?> !important;
            }

            #secondary .srpw-time,
            main article .entry-meta,
            .entry-meta *,
            .comments-area .comment-metadata time,
            .single .content-area .fn,
            nf-section div {
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_meta_color' )); ?> !important;
            }

            .post-type-archive-panamericana .content-wrap,
            .panamericana .master {
                background-image: url(<?php echo esc_url( z_taxonomy_image_url(193) )?>);
            }

            .post-type-archive-reiseziele .content-wrap,
            .reiseziele .master {
                background-image: url(<?php echo esc_url( z_taxonomy_image_url(9) )?>);
            }

            .post-type-archive-reiseplanung .content-wrap,
            .reiseplanung .master {
                background-image: url(<?php echo esc_url( z_taxonomy_image_url(209) )?>);
            }

            .post-type-archive-vanlife .content-wrap,
            .vanlife .master {
                background-image: url(<?php echo esc_url( z_taxonomy_image_url(15) )?>);
            }

            .post-type-archive-paragliding .content-wrap,
            .paragliding .master {
                background-image: url(<?php echo esc_url( z_taxonomy_image_url(208) )?>);
            }

            @media screen and (max-width: 950px) {
                .master .content p {
                    font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_master_p_mobile' )); ?>;
                }
            }
        </style>
    <?php
}
add_action( 'wp_head', 'rueckenwinde_style', 999 );

function rueckenwinde_add_colors( $wp_customize ) {
    // Link color
    $wp_customize->add_setting(
        'rueckenwinde_link_color',
        array(
            'default' => '#333333',
        )
    );
    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'rueckenwinde_link_color',
            array(
                'label'      => __( 'Link color', 'rueckenwinde' ),
                'section'    => 'colors',
                'settings'   => 'rueckenwinde_link_color'
            )
        )
    );

    // Headline box
    $wp_customize->add_setting(
        'rueckenwinde_headline_color',
        array(
            'default' => '#000',
        )
    );
    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'rueckenwinde_headline_color',
            array(
                'label'      => __( 'Headline color', 'rueckenwinde' ),
                'section'    => 'colors',
                'settings'   => 'rueckenwinde_headline_color'
            )
        )
    );

    // Excerpt box
    $wp_customize->add_setting(
        'rueckenwinde_font_color',
        array(
            'default' => '#ffffff',
        )
    );
    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'rueckenwinde_font_color',
            array(
                'label'      => __( 'Font color', 'rueckenwinde' ),
                'section'    => 'colors',
                'settings'   => 'rueckenwinde_font_color'
            )
        )
    );

    // Sidebar box
    $wp_customize->add_setting(
        'rueckenwinde_sidebar_color',
        array(
            'default' => '#ffffff',
        )
    );
    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'rueckenwinde_sidebar_color',
            array(
                'label'      => __( 'Sidebar color', 'rueckenwinde' ),
                'section'    => 'colors',
                'settings'   => 'rueckenwinde_sidebar_color'
            )
        )
    );

    // Meta box
    $wp_customize->add_setting(
        'rueckenwinde_meta_color',
        array(
            'default' => '#bbb',
        )
    );
    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'rueckenwinde_meta_color',
            array(
                'label'      => __( 'Meta color', 'rueckenwinde' ),
                'section'    => 'colors',
                'settings'   => 'rueckenwinde_meta_color'
            )
        )
    );
}

add_action( 'customize_register', 'rueckenwinde_add_colors', 999 );

function rueckenwinde_add_font_sizes( $wp_customize ) {
    // Add new section for font sizes
    $wp_customize->add_section(
        'rueckenwinde_font_sizes',
        array(
            'title'    => __( 'Schriftgrößen', 'rueckenwinde' ),
            'priority' => 30,
        )
    );

    // Sidebar font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_sidebar',
        array(
            'default' => '16px',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_sidebar',
        array(
            'label'      => __( 'Sidebar Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_sidebar'
        )
    );

    // Article p font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_article_p',
        array(
            'default' => '18px',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_article_p',
        array(
            'label'      => __( 'Artikel-Text Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_article_p'
        )
    );

    // H1 font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_h1',
        array(
            'default' => '2.5em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_h1',
        array(
            'label'      => __( 'H1 Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_h1'
        )
    );

    // H2 font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_h2',
        array(
            'default' => '2em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_h2',
        array(
            'label'      => __( 'H2 Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_h2'
        )
    );

    // H3 font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_h3',
        array(
            'default' => '1.75em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_h3',
        array(
            'label'      => __( 'H3 Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_h3'
        )
    );

    // H4 font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_h4',
        array(
            'default' => '1.5em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_h4',
        array(
            'label'      => __( 'H4 Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_h4'
        )
    );

    // H5 font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_h5',
        array(
            'default' => '1.25em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_h5',
        array(
            'label'      => __( 'H5 Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_h5'
        )
    );

    // H6 font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_h6',
        array(
            'default' => '1em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_h6',
        array(
            'label'      => __( 'H6 Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_h6'
        )
    );

    // Navigation font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_nav',
        array(
            'default' => '1.8em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_nav',
        array(
            'label'      => __( 'Navigation Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_nav'
        )
    );

    // Master p font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_master_p',
        array(
            'default' => '2em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_master_p',
        array(
            'label'      => __( 'Master-Text Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_master_p'
        )
    );

    // Master p font size mobile
    $wp_customize->add_setting(
        'rueckenwinde_font_size_master_p_mobile',
        array(
            'default' => '1.3em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_master_p_mobile',
        array(
            'label'      => __( 'Master-Text Schriftgröße (Mobile)', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_master_p_mobile'
        )
    );
}

add_action( 'customize_register', 'rueckenwinde_add_font_sizes', 999 ); 

function get_rueckenwinde_header($menu, $template = null) {
    $header_template = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/templates/' . basename( 'header.php' );
    if ( file_exists( $header_template ) ):
        load_template($header_template, null, array('menu' => $menu, 'template' => $template));
    endif;
}

function get_rueckenwinde_footer() {
    $footer_template = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/templates/' . basename( 'footer.php' );
    if ( file_exists( $footer_template ) ):
        load_template($footer_template);
    endif;
}

function get_rueckenwinde_part($part) {
    $template_part = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/template-parts/' . basename( $part.'.php' );
    if ( file_exists( $template_part ) ):
        load_template($template_part, false);
    endif; 
}

function rueckenwinde_scripts() {
    wp_enqueue_style( 'rueckenwinde-styles', plugins_url( 'rueckenwinde-styles.css', __FILE__ ), array(), '1.0' );
    wp_enqueue_script( 'rueckenwinde-scripts', plugins_url( 'rueckenwinde-scripts.js', __FILE__ ), array( 'jquery' ), '1.0' );
}
add_action( 'wp_enqueue_scripts', 'rueckenwinde_scripts', 999 );

// Search for templates in plugin 'templates' dir, and load if exists
function rueckenwinde_template_include( $template ) {
    if ( file_exists( untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/templates/' . basename( $template ) ) )
        $template = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/templates/' . basename( $template );
    return $template;
}
add_filter( 'template_include', 'rueckenwinde_template_include', 11 );

function my_cptui_add_post_types_to_archives( $query ) {
	// We do not want unintended consequences.
	if ( is_admin() || ! $query->is_main_query() ) {
		return;    
	}

	if ( is_category() || is_tag() && empty( $query->query_vars['suppress_filters'] ) ) {
		$cptui_post_types = cptui_get_post_type_slugs();

		$query->set(
			'post_type',
			array_merge(
				array( 'post', 'reiseziele', 'reiseplanung', 'vanlife', 'paragliding' ),
				$cptui_post_types
			)
		);
	}
}
add_filter( 'pre_get_posts', 'my_cptui_add_post_types_to_archives' );

function rueckenwinde_header_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Header-Widget-Area', 'rueckenwinde' ),
        'id'            => 'header-widget-area',
        'before_widget' => '<div class="widget header-widget-area">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
}
add_action( 'widgets_init', 'rueckenwinde_header_widgets_init' );

function rueckenwinde_index_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Index-Widget-Area', 'rueckenwinde' ),
        'id'            => 'index-widget-area',
        'before_widget' => '<div class="widget index-widget-area">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
}
add_action( 'widgets_init', 'rueckenwinde_index_widgets_init' );

function rueckenwinde_index_footer_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Index-Footer-Widget-Area', 'rueckenwinde' ),
        'id'            => 'index-footer-widget-area',
        'before_widget' => '<div class="widget index-footer-widget-area">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
}
add_action( 'widgets_init', 'rueckenwinde_index_footer_widgets_init' );
  
register_nav_menu( 'frontpage', __( 'Frontpage Navigation', 'rueckenwinde' ) );
// register_nav_menu( 'paragliding', __( 'Paragliding Navigation', 'rueckenwinde' ) );
// register_nav_menu( 'paragliding-archive', __( 'Paragliding Archive Navigation', 'rueckenwinde' ) );
// register_nav_menu( 'reisen', __( 'Reisen Navigation', 'rueckenwinde' ) );
// register_nav_menu( 'reisen-archive', __( 'Reisen Archive Navigation', 'rueckenwinde' ) );
// register_nav_menu( 'vanlife', __( 'Vanlife Navigation', 'rueckenwinde' ) );
// register_nav_menu( 'vanlife-archive', __( 'Vanlife Archive Navigation', 'rueckenwinde' ) );

/**
 * Gutenberg Block Editor für Kategorie-Beschreibungen aktivieren
*/

/**
 * Block Pattern Kategorie registrieren
 */
add_action( 'init', function () {

    $blocks_dir = plugin_dir_path( __FILE__ ) . 'blocks/';

    foreach ( glob( $blocks_dir . '*/block.json' ) as $block_json ) {
        $dir = dirname( $block_json );
        register_block_type( $dir );
    }

});

add_action('enqueue_block_editor_assets', 'rueckenwinde_editor_foundation');
function rueckenwinde_editor_foundation() {
    wp_enqueue_style(
        'foundation-editor',
        get_template_directory_uri() . '/css/foundation.css',
        array(),
        '6.7.4'
    );
}

/**
 * Globale CTA Einstellungen (Backend) fuer Beratungs-Widget.
 */
add_action('admin_init', function () {
    register_setting('rueckenwinde_cta_settings_group', 'rueckenwinde_cta_settings', array(
        'type' => 'array',
        'sanitize_callback' => function ($input) {
            $input = is_array($input) ? $input : array();
            return array(
                'headline' => isset($input['headline']) ? sanitize_text_field($input['headline']) : '',
                'text' => isset($input['text']) ? sanitize_textarea_field($input['text']) : '',
                'bullet_time' => isset($input['bullet_time']) ? sanitize_text_field($input['bullet_time']) : '',
                'bullet_safety' => isset($input['bullet_safety']) ? sanitize_text_field($input['bullet_safety']) : '',
                'bullet_contacts' => isset($input['bullet_contacts']) ? sanitize_text_field($input['bullet_contacts']) : '',
                'button_label' => isset($input['button_label']) ? sanitize_text_field($input['button_label']) : '',
                'button_url' => isset($input['button_url']) ? esc_url_raw($input['button_url']) : '',
                'profile_image_url' => isset($input['profile_image_url']) ? esc_url_raw($input['profile_image_url']) : ''
            );
        },
        'default' => array(
            'headline' => 'Lass uns deine Route checken',
            'text' => 'Seit ueber drei Jahren sind wir auf der Panamericana unterwegs. Wir helfen dir, typische Fehler zu vermeiden und deine Planung auf echte Praxis abzustimmen.',
            'bullet_time' => 'Mehr Zeit durch klare Prioritaeten',
            'bullet_safety' => 'Mehr Sicherheit durch erprobte Routen',
            'bullet_contacts' => 'Insider-Kontakte vor Ort',
            'button_label' => 'Jetzt Termin anfragen',
            'button_url' => '#',
            'profile_image_url' => ''
        )
    ));
});

add_action('admin_menu', function () {
    add_options_page(
        'Rueckenwind CTA',
        'Rueckenwind CTA',
        'manage_options',
        'rueckenwind-cta',
        function () {
            $settings = get_option('rueckenwinde_cta_settings', array());
            $settings = is_array($settings) ? $settings : array();
            ?>
            <div class="wrap">
                <h1>Rueckenwind CTA</h1>
                <form method="post" action="options.php">
                    <?php settings_fields('rueckenwinde_cta_settings_group'); ?>
                    <table class="form-table" role="presentation">
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_headline">Headline</label></th>
                            <td><input id="rueckenwinde_cta_headline" class="regular-text" type="text" name="rueckenwinde_cta_settings[headline]" value="<?php echo esc_attr(isset($settings['headline']) ? $settings['headline'] : ''); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_text">Text</label></th>
                            <td><textarea id="rueckenwinde_cta_text" class="large-text" rows="4" name="rueckenwinde_cta_settings[text]"><?php echo esc_textarea(isset($settings['text']) ? $settings['text'] : ''); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_bullet_time">Bullet 1</label></th>
                            <td><input id="rueckenwinde_cta_bullet_time" class="regular-text" type="text" name="rueckenwinde_cta_settings[bullet_time]" value="<?php echo esc_attr(isset($settings['bullet_time']) ? $settings['bullet_time'] : ''); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_bullet_safety">Bullet 2</label></th>
                            <td><input id="rueckenwinde_cta_bullet_safety" class="regular-text" type="text" name="rueckenwinde_cta_settings[bullet_safety]" value="<?php echo esc_attr(isset($settings['bullet_safety']) ? $settings['bullet_safety'] : ''); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_bullet_contacts">Bullet 3</label></th>
                            <td><input id="rueckenwinde_cta_bullet_contacts" class="regular-text" type="text" name="rueckenwinde_cta_settings[bullet_contacts]" value="<?php echo esc_attr(isset($settings['bullet_contacts']) ? $settings['bullet_contacts'] : ''); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_button_label">Button Text</label></th>
                            <td><input id="rueckenwinde_cta_button_label" class="regular-text" type="text" name="rueckenwinde_cta_settings[button_label]" value="<?php echo esc_attr(isset($settings['button_label']) ? $settings['button_label'] : ''); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_button_url">Button URL</label></th>
                            <td><input id="rueckenwinde_cta_button_url" class="regular-text" type="url" name="rueckenwinde_cta_settings[button_url]" value="<?php echo esc_attr(isset($settings['button_url']) ? $settings['button_url'] : ''); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_cta_profile_image_url">Profilbild URL</label></th>
                            <td><input id="rueckenwinde_cta_profile_image_url" class="regular-text" type="url" name="rueckenwinde_cta_settings[profile_image_url]" value="<?php echo esc_attr(isset($settings['profile_image_url']) ? $settings['profile_image_url'] : ''); ?>"></td>
                        </tr>
                    </table>
                    <?php submit_button('CTA speichern'); ?>
                </form>
            </div>
            <?php
        }
	    );
	});

/**
 * Globale Defaults fuer den dynamischen In-Article Shop-CTA.
 */
add_action('admin_init', function () {
    register_setting('rueckenwinde_shop_cta_settings_group', 'rueckenwinde_shop_cta_settings', array(
        'type' => 'array',
        'sanitize_callback' => function ($input) {
            $input = is_array($input) ? $input : array();
            return array(
                'icon' => isset($input['icon']) ? sanitize_text_field($input['icon']) : '🧭',
                'headline' => isset($input['headline']) ? sanitize_text_field($input['headline']) : '',
                'text_template' => isset($input['text_template']) ? sanitize_textarea_field($input['text_template']) : '',
                'button_label' => isset($input['button_label']) ? sanitize_text_field($input['button_label']) : '',
                'button_url' => isset($input['button_url']) ? esc_url_raw($input['button_url']) : '',
                'fallback_country' => isset($input['fallback_country']) ? sanitize_text_field($input['fallback_country']) : ''
            );
        },
        'default' => array(
            'icon' => '🧭',
            'headline' => 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt',
            'text_template' => 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].',
            'button_label' => 'Hol dir den Guide (PDF)',
            'button_url' => '#',
            'fallback_country' => 'dieses Land'
        )
    ));
});

add_action('admin_menu', function () {
    add_options_page(
        'Panamericana Shop CTA',
        'Panamericana Shop CTA',
        'manage_options',
        'rueckenwind-panamericana-shop-cta',
        function () {
            $defaults = array(
                'icon' => '🧭',
                'headline' => 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt',
                'text_template' => 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].',
                'button_label' => 'Hol dir den Guide (PDF)',
                'button_url' => '#',
                'fallback_country' => 'dieses Land'
            );
            $settings = get_option('rueckenwinde_shop_cta_settings', array());
            $settings = is_array($settings) ? wp_parse_args($settings, $defaults) : $defaults;
            ?>
            <div class="wrap">
                <h1>Panamericana Shop CTA</h1>
                <form method="post" action="options.php">
                    <?php settings_fields('rueckenwinde_shop_cta_settings_group'); ?>
                    <table class="form-table" role="presentation">
                        <tr>
                            <th scope="row"><label for="rueckenwinde_shop_cta_icon">Icon</label></th>
                            <td><input id="rueckenwinde_shop_cta_icon" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[icon]" value="<?php echo esc_attr($settings['icon']); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_shop_cta_headline">Headline</label></th>
                            <td><input id="rueckenwinde_shop_cta_headline" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[headline]" value="<?php echo esc_attr($settings['headline']); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_shop_cta_text_template">Text-Template</label></th>
                            <td>
                                <textarea id="rueckenwinde_shop_cta_text_template" class="large-text" rows="5" name="rueckenwinde_shop_cta_settings[text_template]"><?php echo esc_textarea($settings['text_template']); ?></textarea>
                                <p class="description">Platzhalter fuer Land: <code>[Dynamic_Country_Name]</code></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_shop_cta_button_label">Button Text</label></th>
                            <td><input id="rueckenwinde_shop_cta_button_label" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[button_label]" value="<?php echo esc_attr($settings['button_label']); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_shop_cta_button_url">Button URL</label></th>
                            <td><input id="rueckenwinde_shop_cta_button_url" class="regular-text" type="url" name="rueckenwinde_shop_cta_settings[button_url]" value="<?php echo esc_attr($settings['button_url']); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="rueckenwinde_shop_cta_fallback_country">Fallback-Land</label></th>
                            <td><input id="rueckenwinde_shop_cta_fallback_country" class="regular-text" type="text" name="rueckenwinde_shop_cta_settings[fallback_country]" value="<?php echo esc_attr($settings['fallback_country']); ?>"></td>
                        </tr>
                    </table>
                    <?php submit_button('Shop-CTA speichern'); ?>
                </form>
            </div>
            <?php
        }
    );
});

/**
 * CTA automatisch am Ende von Blogposts und Tool-Posttypes anfuegen.
 */
add_filter('the_content', function ($content) {
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
}, 20);

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

/**
 * Panamericana Shop-CTA automatisch nach dem ersten Drittel von Blog-Artikeln einfuegen.
 */
add_filter('the_content', function ($content) {
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
        'icon' => '🧭',
        'headline' => 'Hinter den Kulissen: Die Fakten zu diesem Abschnitt',
        'textTemplate' => 'Ich teile hier meine Reiseberichte, aber im kompletten Panamericana-Guide findest du alle GPS-Daten, Grenz-Hacks und Kostenaufstellungen fuer [Dynamic_Country_Name].',
        'buttonLabel' => 'Hol dir den Guide (PDF)',
        'buttonUrl' => '#',
        'fallbackCountry' => 'dieses Land'
    );
    $option_values = get_option('rueckenwinde_shop_cta_settings', array());
    $option_values = is_array($option_values) ? $option_values : array();
    $mapped_option_values = array(
        'icon' => isset($option_values['icon']) ? $option_values['icon'] : $default_attrs['icon'],
        'headline' => isset($option_values['headline']) ? $option_values['headline'] : $default_attrs['headline'],
        'textTemplate' => isset($option_values['text_template']) ? $option_values['text_template'] : $default_attrs['textTemplate'],
        'buttonLabel' => isset($option_values['button_label']) ? $option_values['button_label'] : $default_attrs['buttonLabel'],
        'buttonUrl' => isset($option_values['button_url']) ? $option_values['button_url'] : $default_attrs['buttonUrl'],
        'fallbackCountry' => isset($option_values['fallback_country']) ? $option_values['fallback_country'] : $default_attrs['fallbackCountry']
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
}, 25);

if (!function_exists('rueckenwinde_lead_get_pending')) {
    function rueckenwinde_lead_get_pending() {
        $pending = get_option('rueckenwinde_lead_pending', array());
        return is_array($pending) ? $pending : array();
    }
}

if (!function_exists('rueckenwinde_lead_get_confirmed')) {
    function rueckenwinde_lead_get_confirmed() {
        $confirmed = get_option('rueckenwinde_lead_confirmed', array());
        return is_array($confirmed) ? $confirmed : array();
    }
}

if (!function_exists('rueckenwinde_lead_send_pdf_email')) {
    function rueckenwinde_lead_send_pdf_email($email, $subject, $body_template, $pdf_url, $pdf_label) {
        $subject = sanitize_text_field($subject);
        $body_template = sanitize_textarea_field($body_template);
        $pdf_url = esc_url_raw($pdf_url);
        $pdf_label = sanitize_text_field($pdf_label);

        if (!is_email($email) || $subject === '') {
            return false;
        }

        $replacements = array(
            '{{pdf_url}}' => $pdf_url,
            '{{pdf_label}}' => $pdf_label
        );
        $message = strtr($body_template, $replacements);

        return wp_mail($email, $subject, $message);
    }
}

if (!function_exists('rueckenwinde_lead_capture_submit')) {
    function rueckenwinde_lead_capture_submit() {
        if (!isset($_POST['rw_lead_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['rw_lead_nonce'])), 'rueckenwinde_lead_capture_submit')) {
            wp_die('Ungueltige Anfrage.');
        }

        $redirect_url = isset($_POST['redirect_url']) ? esc_url_raw(wp_unslash($_POST['redirect_url'])) : home_url('/');
        $redirect_url = wp_validate_redirect($redirect_url, home_url('/'));

        $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
        $consent = isset($_POST['consent']) ? (int) $_POST['consent'] : 0;
        $honeypot = isset($_POST['website']) ? trim((string) wp_unslash($_POST['website'])) : '';

        if ($honeypot !== '') {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'check_email', $redirect_url));
            exit;
        }

        if (!is_email($email) || $consent !== 1) {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', $redirect_url));
            exit;
        }

        $pdf_url = isset($_POST['pdf_url']) ? esc_url_raw(wp_unslash($_POST['pdf_url'])) : '';
        $pdf_label = isset($_POST['pdf_label']) ? sanitize_text_field(wp_unslash($_POST['pdf_label'])) : 'Jetzt PDF herunterladen';
        $confirm_subject = isset($_POST['confirm_subject']) ? sanitize_text_field(wp_unslash($_POST['confirm_subject'])) : 'Bitte bestaetige deine Anmeldung';
        $confirm_body = isset($_POST['confirm_body']) ? sanitize_textarea_field(wp_unslash($_POST['confirm_body'])) : "Danke fuer dein Interesse. Bitte bestaetige deine Anmeldung ueber diesen Link:\n\n{{confirm_url}}\n\nDanach senden wir dir dein PDF.";
        $delivery_subject = isset($_POST['delivery_subject']) ? sanitize_text_field(wp_unslash($_POST['delivery_subject'])) : 'Hier ist dein PDF';
        $delivery_body = isset($_POST['delivery_body']) ? sanitize_textarea_field(wp_unslash($_POST['delivery_body'])) : "Super, deine Anmeldung ist bestaetigt. Hier ist dein PDF:\n\n{{pdf_url}}\n\nViel Erfolg bei deiner Planung!";

        $confirmed = rueckenwinde_lead_get_confirmed();
        foreach ($confirmed as $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            if (strtolower($entry['email']) === strtolower($email)) {
                rueckenwinde_lead_send_pdf_email($email, $delivery_subject, $delivery_body, $pdf_url, $pdf_label);
                wp_safe_redirect(add_query_arg('rw_lead_status', 'already_confirmed', $redirect_url));
                exit;
            }
        }

        $token = wp_generate_password(32, false, false);
        $confirm_url = add_query_arg(
            array(
                'rw_lead_confirm' => '1',
                'token' => $token
            ),
            home_url('/')
        );

        $message = strtr($confirm_body, array('{{confirm_url}}' => $confirm_url));
        $mail_sent = wp_mail($email, $confirm_subject, $message);
        if (!$mail_sent) {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'error', $redirect_url));
            exit;
        }

        $pending = rueckenwinde_lead_get_pending();
        $pending[$token] = array(
            'email' => $email,
            'consent' => 1,
            'created_at' => current_time('mysql'),
            'redirect_url' => $redirect_url,
            'pdf_url' => $pdf_url,
            'pdf_label' => $pdf_label,
            'delivery_subject' => $delivery_subject,
            'delivery_body' => $delivery_body
        );
        update_option('rueckenwinde_lead_pending', $pending, false);

        wp_safe_redirect(add_query_arg('rw_lead_status', 'check_email', $redirect_url));
        exit;
    }
}
add_action('admin_post_nopriv_rueckenwinde_lead_capture_submit', 'rueckenwinde_lead_capture_submit');
add_action('admin_post_rueckenwinde_lead_capture_submit', 'rueckenwinde_lead_capture_submit');

if (!function_exists('rueckenwinde_lead_capture_confirm')) {
    function rueckenwinde_lead_capture_confirm() {
        if (!isset($_GET['rw_lead_confirm']) || !isset($_GET['token'])) {
            return;
        }

        $token = sanitize_text_field(wp_unslash($_GET['token']));
        if ($token === '') {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', home_url('/')));
            exit;
        }

        $pending = rueckenwinde_lead_get_pending();
        if (!isset($pending[$token]) || !is_array($pending[$token])) {
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', home_url('/')));
            exit;
        }

        $entry = $pending[$token];
        $email = isset($entry['email']) ? sanitize_email($entry['email']) : '';
        $redirect_url = isset($entry['redirect_url']) ? esc_url_raw($entry['redirect_url']) : home_url('/');
        $redirect_url = wp_validate_redirect($redirect_url, home_url('/'));
        $pdf_url = isset($entry['pdf_url']) ? esc_url_raw($entry['pdf_url']) : '';
        $pdf_label = isset($entry['pdf_label']) ? sanitize_text_field($entry['pdf_label']) : 'Jetzt PDF herunterladen';
        $delivery_subject = isset($entry['delivery_subject']) ? sanitize_text_field($entry['delivery_subject']) : 'Hier ist dein PDF';
        $delivery_body = isset($entry['delivery_body']) ? sanitize_textarea_field($entry['delivery_body']) : "Super, deine Anmeldung ist bestaetigt. Hier ist dein PDF:\n\n{{pdf_url}}\n\nViel Erfolg bei deiner Planung!";

        if (!is_email($email)) {
            unset($pending[$token]);
            update_option('rueckenwinde_lead_pending', $pending, false);
            wp_safe_redirect(add_query_arg('rw_lead_status', 'invalid', $redirect_url));
            exit;
        }

        $confirmed = rueckenwinde_lead_get_confirmed();
        $confirmed[] = array(
            'email' => $email,
            'consent' => 1,
            'confirmed_at' => current_time('mysql'),
            'source' => $redirect_url
        );
        update_option('rueckenwinde_lead_confirmed', $confirmed, false);

        unset($pending[$token]);
        update_option('rueckenwinde_lead_pending', $pending, false);

        rueckenwinde_lead_send_pdf_email($email, $delivery_subject, $delivery_body, $pdf_url, $pdf_label);

        wp_safe_redirect(add_query_arg('rw_lead_status', 'confirmed', $redirect_url));
        exit;
    }
}
add_action('init', 'rueckenwinde_lead_capture_confirm');

if (!function_exists('rueckenwinde_leads_get_admin_url')) {
    function rueckenwinde_leads_get_admin_url($args = array()) {
        return add_query_arg($args, admin_url('admin.php?page=rueckenwinde-leads'));
    }
}

if (!function_exists('rueckenwinde_leads_find_confirmed_index_by_email')) {
    function rueckenwinde_leads_find_confirmed_index_by_email($email, $confirmed) {
        $email = strtolower(trim((string) $email));
        if ($email === '' || !is_array($confirmed)) {
            return -1;
        }
        foreach ($confirmed as $idx => $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            if (strtolower((string) $entry['email']) === $email) {
                return (int) $idx;
            }
        }
        return -1;
    }
}

if (!function_exists('rueckenwinde_leads_find_pending_token_by_email')) {
    function rueckenwinde_leads_find_pending_token_by_email($email, $pending) {
        $email = strtolower(trim((string) $email));
        if ($email === '' || !is_array($pending)) {
            return '';
        }
        foreach ($pending as $token => $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            if (strtolower((string) $entry['email']) === $email) {
                return (string) $token;
            }
        }
        return '';
    }
}

if (!function_exists('rueckenwinde_leads_admin_export_csv')) {
    function rueckenwinde_leads_admin_export_csv() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('rueckenwinde_leads_export_csv');

        $pending = rueckenwinde_lead_get_pending();
        $confirmed = rueckenwinde_lead_get_confirmed();

        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="rueckenwinde-leads-' . gmdate('Y-m-d') . '.csv"');

        $out = fopen('php://output', 'w');
        if (!$out) {
            wp_die('CSV konnte nicht erstellt werden.');
        }

        fputcsv($out, array('email', 'status', 'created_at', 'confirmed_at', 'source'));

        foreach ($confirmed as $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            fputcsv($out, array(
                sanitize_email($entry['email']),
                'confirmed',
                '',
                isset($entry['confirmed_at']) ? sanitize_text_field($entry['confirmed_at']) : '',
                isset($entry['source']) ? esc_url_raw($entry['source']) : ''
            ));
        }

        foreach ($pending as $entry) {
            if (!is_array($entry) || empty($entry['email'])) {
                continue;
            }
            fputcsv($out, array(
                sanitize_email($entry['email']),
                'pending',
                isset($entry['created_at']) ? sanitize_text_field($entry['created_at']) : '',
                '',
                isset($entry['redirect_url']) ? esc_url_raw($entry['redirect_url']) : ''
            ));
        }

        fclose($out);
        exit;
    }
}
add_action('admin_post_rueckenwinde_leads_export_csv', 'rueckenwinde_leads_admin_export_csv');

if (!function_exists('rueckenwinde_leads_admin_delete_one')) {
    function rueckenwinde_leads_admin_delete_one() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('rueckenwinde_leads_delete_one');

        $email = isset($_GET['email']) ? sanitize_email(wp_unslash($_GET['email'])) : '';
        $status = isset($_GET['lead_status']) ? sanitize_key(wp_unslash($_GET['lead_status'])) : '';
        $redirect = rueckenwinde_leads_get_admin_url();

        if (!is_email($email) || ($status !== 'confirmed' && $status !== 'pending')) {
            wp_safe_redirect(add_query_arg('notice', 'invalid', $redirect));
            exit;
        }

        if ($status === 'confirmed') {
            $confirmed = rueckenwinde_lead_get_confirmed();
            $idx = rueckenwinde_leads_find_confirmed_index_by_email($email, $confirmed);
            if ($idx >= 0) {
                array_splice($confirmed, $idx, 1);
                update_option('rueckenwinde_lead_confirmed', $confirmed, false);
            }
        } else {
            $pending = rueckenwinde_lead_get_pending();
            $token = rueckenwinde_leads_find_pending_token_by_email($email, $pending);
            if ($token !== '' && isset($pending[$token])) {
                unset($pending[$token]);
                update_option('rueckenwinde_lead_pending', $pending, false);
            }
        }

        wp_safe_redirect(add_query_arg('notice', 'deleted', $redirect));
        exit;
    }
}
add_action('admin_post_rueckenwinde_leads_delete_one', 'rueckenwinde_leads_admin_delete_one');

if (!function_exists('rueckenwinde_leads_admin_delete_all')) {
    function rueckenwinde_leads_admin_delete_all() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('rueckenwinde_leads_delete_all');

        update_option('rueckenwinde_lead_confirmed', array(), false);
        update_option('rueckenwinde_lead_pending', array(), false);

        wp_safe_redirect(add_query_arg('notice', 'deleted_all', rueckenwinde_leads_get_admin_url()));
        exit;
    }
}
add_action('admin_post_rueckenwinde_leads_delete_all', 'rueckenwinde_leads_admin_delete_all');

add_action('admin_menu', function () {
    add_menu_page(
        'Rueckenwinde Leads',
        'Leads',
        'manage_options',
        'rueckenwinde-leads',
        function () {
            if (!current_user_can('manage_options')) {
                wp_die('Keine Berechtigung.');
            }

            $pending = rueckenwinde_lead_get_pending();
            $confirmed = rueckenwinde_lead_get_confirmed();
            $notice = isset($_GET['notice']) ? sanitize_key(wp_unslash($_GET['notice'])) : '';
            ?>
            <div class="wrap">
                <h1>Rueckenwinde Leads</h1>

                <?php if ($notice === 'deleted') : ?>
                    <div class="notice notice-success is-dismissible"><p>Kontakt wurde geloescht.</p></div>
                <?php elseif ($notice === 'deleted_all') : ?>
                    <div class="notice notice-success is-dismissible"><p>Alle Kontakte wurden geloescht.</p></div>
                <?php elseif ($notice === 'invalid') : ?>
                    <div class="notice notice-error is-dismissible"><p>Ungueltige Anfrage.</p></div>
                <?php endif; ?>

                <p>
                    <a class="button button-primary" href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=rueckenwinde_leads_export_csv'), 'rueckenwinde_leads_export_csv')); ?>">CSV exportieren</a>
                    <a class="button button-secondary" href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=rueckenwinde_leads_delete_all'), 'rueckenwinde_leads_delete_all')); ?>" onclick="return confirm('Wirklich alle Leads loeschen?');">Alle loeschen</a>
                </p>

                <h2>Bestaetigt (<?php echo esc_html((string) count($confirmed)); ?>)</h2>
                <table class="widefat striped">
                    <thead>
                        <tr>
                            <th>E-Mail</th>
                            <th>Bestaetigt am</th>
                            <th>Quelle</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($confirmed)) : ?>
                            <tr><td colspan="4">Keine bestaetigten Kontakte vorhanden.</td></tr>
                        <?php else : ?>
                            <?php foreach ($confirmed as $entry) : ?>
                                <?php
                                $email = isset($entry['email']) ? sanitize_email($entry['email']) : '';
                                if ($email === '') {
                                    continue;
                                }
                                $confirmed_at = isset($entry['confirmed_at']) ? sanitize_text_field($entry['confirmed_at']) : '';
                                $source = isset($entry['source']) ? esc_url_raw($entry['source']) : '';
                                $delete_url = wp_nonce_url(
                                    add_query_arg(
                                        array(
                                            'action' => 'rueckenwinde_leads_delete_one',
                                            'lead_status' => 'confirmed',
                                            'email' => $email
                                        ),
                                        admin_url('admin-post.php')
                                    ),
                                    'rueckenwinde_leads_delete_one'
                                );
                                ?>
                                <tr>
                                    <td><?php echo esc_html($email); ?></td>
                                    <td><?php echo esc_html($confirmed_at); ?></td>
                                    <td>
                                        <?php if ($source !== '') : ?>
                                            <a href="<?php echo esc_url($source); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($source); ?></a>
                                        <?php endif; ?>
                                    </td>
                                    <td><a class="button button-link-delete" href="<?php echo esc_url($delete_url); ?>" onclick="return confirm('Kontakt loeschen?');">Loeschen</a></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>

                <h2 style="margin-top:24px;">Pending (<?php echo esc_html((string) count($pending)); ?>)</h2>
                <table class="widefat striped">
                    <thead>
                        <tr>
                            <th>E-Mail</th>
                            <th>Angelegt am</th>
                            <th>Quelle</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($pending)) : ?>
                            <tr><td colspan="4">Keine offenen Kontakte vorhanden.</td></tr>
                        <?php else : ?>
                            <?php foreach ($pending as $entry) : ?>
                                <?php
                                if (!is_array($entry)) {
                                    continue;
                                }
                                $email = isset($entry['email']) ? sanitize_email($entry['email']) : '';
                                if ($email === '') {
                                    continue;
                                }
                                $created_at = isset($entry['created_at']) ? sanitize_text_field($entry['created_at']) : '';
                                $source = isset($entry['redirect_url']) ? esc_url_raw($entry['redirect_url']) : '';
                                $delete_url = wp_nonce_url(
                                    add_query_arg(
                                        array(
                                            'action' => 'rueckenwinde_leads_delete_one',
                                            'lead_status' => 'pending',
                                            'email' => $email
                                        ),
                                        admin_url('admin-post.php')
                                    ),
                                    'rueckenwinde_leads_delete_one'
                                );
                                ?>
                                <tr>
                                    <td><?php echo esc_html($email); ?></td>
                                    <td><?php echo esc_html($created_at); ?></td>
                                    <td>
                                        <?php if ($source !== '') : ?>
                                            <a href="<?php echo esc_url($source); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($source); ?></a>
                                        <?php endif; ?>
                                    </td>
                                    <td><a class="button button-link-delete" href="<?php echo esc_url($delete_url); ?>" onclick="return confirm('Kontakt loeschen?');">Loeschen</a></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
            <?php
        },
        'dashicons-email-alt',
        59
    );
});
