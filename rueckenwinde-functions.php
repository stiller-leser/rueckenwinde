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

            .master, 
            .category-description {
                background-color: white;
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
            main article a h2.entry-title, 
            .index-footer-widget-area h2 {
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_headline_color' )); ?>;
            }

            .blog.related-posts main article h4 a,
            article .entry-meta a,
            article .entry-meta a time,
            .comments-area .comment-metadata time,
            .privacy-policy .entry-content a,
            #secondary a,
            .single .content-area a.url,
            .master i {
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_link_color' )); ?> !important;
            }

            #secondary .srpw-summary p,
            .entry-title a,
            .entry-content a p,
            .entry-content p,
            .comment-content p,
            .privacy-policy li,
            #iot-menu-left li a {
                color: <?php echo esc_attr(get_theme_mod( 'rueckenwinde_excerpt_color' )); ?> !important;
            }

            #secondary .widget-title {
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
        </style>
    <?php
}
add_action( 'wp_head', 'rueckenwinde_style', 999 );

function rueckenwinde_add_sections( $wp_customize ) {
    // Paragliding Section
    $wp_customize->add_section( 'abc' , array(
        'title'      => __( 'Paragliding' , 'rueckenwinde' ),
        'priority'   => 30
    ) );

    // Paragliding Header Image
    $wp_customize->add_setting('rueckenwinde_paragliding_header_image_setting', array(
        'transport'         => 'refresh',
        'height'         => 325,
    ));

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'rueckenwinde_paragliding_header_image_control', array(
        'label'             => __('Header Image', 'rueckenwinde'),
        'section'           => 'abc',
        'settings'          => 'rueckenwinde_paragliding_header_image_setting',    
    )));

    // Reisen section
    $wp_customize->add_section( 'rueckenwinde_reisen_section' , array(
        'title'      => __( 'Reisen' , 'rueckenwinde' ),
        'priority'   => 30
    ) );

    // Reisen Header Image
    $wp_customize->add_setting('rueckenwinde_reisen_header_image_setting', array(
        'transport'         => 'refresh',
        'height'         => 325,
    ));

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'rueckenwinde_reisen_header_image_control', array(
        'label'             => __('Header Image', 'rueckenwinde'),
        'section'           => 'rueckenwinde_reisen_section',
        'settings'          => 'rueckenwinde_reisen_header_image_setting',    
    )));

    // Vanlife section
    $wp_customize->add_section( 'rueckenwinde_vanlife_section' , array(
        'title'      => __( 'Vanlife' , 'rueckenwinde' ),
        'priority'   => 30
    ) );

    // Vanlife Header Image
    $wp_customize->add_setting('rueckenwinde_vanlife_header_image_setting', array(
        'transport'         => 'refresh',
        'height'         => 325,
    ));

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'rueckenwinde_vanlife_header_image_control', array(
        'label'             => __('Header Image', 'rueckenwinde'),
        'section'           => 'rueckenwinde_vanlife_section',
        'settings'          => 'rueckenwinde_vanlife_header_image_setting',    
    )));
}

add_action( 'customize_register', 'rueckenwinde_add_sections' );

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
        'rueckenwinde_excerpt_color',
        array(
            'default' => '#ffffff',
        )
    );
    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'rueckenwinde_excerpt_color',
            array(
                'label'      => __( 'Excerpt color', 'rueckenwinde' ),
                'section'    => 'colors',
                'settings'   => 'rueckenwinde_excerpt_color'
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

function namespace_add_custom_types( $query ) {
    if( (is_category() || is_tag()) && $query->is_archive() && empty( $query->query_vars['suppress_filters'] ) ) {
        $query->set( 'post_type', array(
            'post', 'paragliding', 'reisen', 'vanlife'
        ));
    }
}
add_action( 'pre_get_posts', 'namespace_add_custom_types' );

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
register_nav_menu( 'paragliding', __( 'Paragliding Navigation', 'rueckenwinde' ) );
register_nav_menu( 'paragliding-archive', __( 'Paragliding Archive Navigation', 'rueckenwinde' ) );
register_nav_menu( 'reisen', __( 'Reisen Navigation', 'rueckenwinde' ) );
register_nav_menu( 'reisen-archive', __( 'Reisen Archive Navigation', 'rueckenwinde' ) );
register_nav_menu( 'vanlife', __( 'Vanlife Navigation', 'rueckenwinde' ) );
register_nav_menu( 'vanlife-archive', __( 'Vanlife Archive Navigation', 'rueckenwinde' ) );