<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package rueckenwin.de
 */

$theme_location = 'fallback';
$menus = get_registered_nav_menus();
if( isset( $menus[$args['menu']] ) ):
	$theme_location = $args['menu'];
endif;
if( is_null( $args['template'] ) ):
	$template = $args['menu'];
else:
	$template = $args['template'];
endif;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

	<?php wp_head(); ?>
	<?php if(is_page( array( 'impressum', 'datenschutz' ) )): ?>
	<meta name="robots" content="noindex,nofollow">
	<?php endif; ?>
</head>

<body <?php body_class(); ?>>
	<section class="navigation-wrapper">	
		<div class="glass"></div>	
		<div class="site grid-container">
			<header id="masthead" class="site-header grid-x grid-padding-x">
				<nav id="site-navigation" class="main-navigation large-12 medium-2 small-3 cell">
					<?php
					    wp_nav_menu( array(
						    'theme_location' => $theme_location,
						    'menu_id'        => 'primary-menu',
						) );
						?>
				</nav><!-- #site-navigation -->
			</header><!-- #masthead -->
		</div>
	</section>
    <?php 
        if ( is_front_page() ):
			get_rueckenwinde_part('index-header');
		else:
			get_rueckenwinde_part($template.'-header');
		endif;
    ?>

	<section id="page" class="site grid-container start-container-head">
		<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'writers-blogily' ); ?></a>
		<div id="content" class="site-content grid-x grid-padding-x">
