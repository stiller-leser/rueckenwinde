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

            .credits {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_credits' )); ?>;
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
            .tagebuch-link {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_article_p' )); ?>;
            }

            .footer-menu li a {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_footer_menu' )); ?>;
            }

            body {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_body' )); ?>;
            }

            #about p {
                font-size: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_font_size_about_p' )); ?>;
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
            .highlights-hero-image-label {
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

    // Credits font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_credits',
        array(
            'default' => '12px',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_credits',
        array(
            'label'      => __( 'Credits Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_credits'
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

    // Footer menu font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_footer_menu',
        array(
            'default' => '13px',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_footer_menu',
        array(
            'label'      => __( 'Footer-Menü Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_footer_menu'
        )
    );

    // Body font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_body',
        array(
            'default' => '0.8rem',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_body',
        array(
            'label'      => __( 'Body Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_body'
        )
    );

    // About p font size
    $wp_customize->add_setting(
        'rueckenwinde_font_size_about_p',
        array(
            'default' => '1.2em',
        )
    );
    $wp_customize->add_control(
        'rueckenwinde_font_size_about_p',
        array(
            'label'      => __( 'About-Text Schriftgröße', 'rueckenwinde' ),
            'section'    => 'rueckenwinde_font_sizes',
            'type'       => 'text',
            'settings'   => 'rueckenwinde_font_size_about_p'
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