<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package writers_blogily
 */

?>

</div><!-- #content -->
</div>

<div class="footer-container">
	<div class="site grid-container">
		<footer id="colophon" class="site-footer">
			<?php if ( is_active_sidebar( 'footer-widget-one') ||  is_active_sidebar( 'footer-widget-two') ||  is_active_sidebar( 'footer-widget-three')  ) : ?>
			<div class="footer-widgets-container">
				<div class="footer-widget-three">

					<?php if ( is_active_sidebar( 'footer-widget-one' ) ) : ?>
					<div class="footer-column">
						<?php dynamic_sidebar( 'footer-widget-one' ); ?>				
					</div>
				<?php endif; ?>

				<?php if ( is_active_sidebar( 'footer-widget-two' ) ) : ?>
				<div class="footer-column">
					<?php dynamic_sidebar( 'footer-widget-two' ); ?>				
				</div>
			<?php endif; ?>

			<?php if ( is_active_sidebar( 'footer-widget-three' ) ) : ?>
			<div class="footer-column">
				<?php dynamic_sidebar( 'footer-widget-three' ); ?>				
			</div>
		<?php endif; ?>

	</div>
</div>
<?php endif; ?>

<div class="site-info">
	<span class="footer-menu">
		<?php
		if ( has_nav_menu( 'footer-menu' ) ) {
			wp_nav_menu( array(
				'theme_location' => 'footer-menu',
				'menu_id'        => 'footer-menu',
				) );
		}
		?>
	</span>
</div><!-- .site-info -->
</footer><!-- #colophon -->
</div>
</div>
<?php wp_footer(); ?>

</body>
