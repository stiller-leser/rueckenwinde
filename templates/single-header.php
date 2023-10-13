<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package writers_blogily
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

	<?php wp_head(); ?>
	<?php if(is_page( array( 'contact-us', 'privacy-policy' ) )): ?>
	<meta name="robots" content="noindex,nofollow">
	<?php endif; ?>
</head>

<body <?php body_class(); ?>>
	<section class="navigation-wrapper">		
		<div class="site grid-container">
			<header id="masthead" class="site-header grid-x grid-padding-x">
				<div class="site-branding large-4 medium-10 small-9 cell">
					<!-- <?php
					the_custom_logo();
					if ( is_front_page() && is_home() ) :
						?>
					<div class="logo-container">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home"><h1><i class="fas fa-wind"></i><div><?php bloginfo( 'name' ); ?></div></h1></a>
						<?php
						else :
							?>
						<div class="logo-container">
							<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home"><h2><i class="fas fa-wind"></i><div><?php bloginfo( 'name' ); ?></div></h2></a>
							<?php
							endif;
							?>
					</div>	 -->
				</div><!-- .site-branding -->

				<nav id="site-navigation" class="main-navigation large-8 medium-2 small-3 cell">
					<?php
					wp_nav_menu( array(
						'theme_location' => 'menu-1',
						'menu_id'        => 'primary-menu',
						) );
						?>
				</nav><!-- #site-navigation -->
			</header><!-- #masthead -->
		</div>
	</section>
