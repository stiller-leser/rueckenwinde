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

?>

<?php if ( get_header_image() ) : ?>
	<?php if ( is_front_page() ) : ?>
		<?php
			$custom_header = get_custom_header();
		?>
		<section class="content-wrap" style="background-image:url(<?php echo esc_url($custom_header->url); ?>)">	
			<div class="glass"></div>			
			<div class="bottom-header-wrapper">
				<!-- <?php
				$writers_blogily_description = get_bloginfo( 'description', 'display' );
				if ( $writers_blogily_description || is_customize_preview() ) :
					?>
					<h3 class="site-description"><?php echo $writers_blogily_description; /* WPCS: xss ok. */ ?></h3>
				<?php endif; ?> -->
			</div>
			<a id="back-home" href="/"></a>
			<?php if ( is_active_sidebar( 'header-widget-area' ) ) {
				dynamic_sidebar( 'header-widget-area' );
			}?>
		</section>
	<?php endif; ?>
<?php endif; ?>