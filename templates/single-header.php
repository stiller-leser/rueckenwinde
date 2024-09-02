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
	<?php if ( has_post_thumbnail() ) : ?>
		<div class="post-thumbnail">
			<?php the_post_thumbnail('full'); ?>
		</div>
	<?php endif; ?>