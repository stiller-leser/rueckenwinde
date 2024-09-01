<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package rueckenwin.de
 */
get_rueckenwinde_header('frontpage');
?>
	<div id="about">
		<?php
			$page = get_page_by_path( 'ueber-uns' );
		?>
		<h1><?php echo get_the_title( $page ); ?></h1>
		<div id="picture">
			<?php echo get_the_post_thumbnail($page, 'thumbnail'); ?>
		</div>
		<div id="post">
			<?php echo $page->post_content ?>
		</div>
		<div style="float: none"></div>
	</div>
	<div id="primary" class="content-area large-12 medium-12 small-12 cell fp-blog-grid">
		<main id="main" class="site-main">
			<?php if ( is_active_sidebar( 'index-widget-area' ) ) {
				dynamic_sidebar( 'index-widget-area' );
			}?>
			<?php
				/**$query = new WP_Query( array ( 
					'category_name' => 'Featured',
					'post_type' => array('post','reisen','paragliding','vanlife'),
					'nopaging' => true,
					'posts_per_page' => 50
				) );
				if ( $query->have_posts() ) :
					/* Start the Loop */
					/**while ( $query->have_posts() ): 
						$query->the_post();
						/*
						* Include the Post-Type-specific template for the content.
						* If you want to override this in a child theme, then include a file
						* called content-___.php (where ___ is the Post Type name) and that will be used instead.
						*/
						/**get_rueckenwinde_part( 'content-excerpt' );
					endwhile;
					the_posts_pagination();
				//else :
				//	get_template_part( 'template-parts/content', 'none' );
				endif;
				wp_reset_postdata();**/
			?>
		</main><!-- #main -->
	</div><!-- #primary -->
<?php
	// get_sidebar();
?>
<?php if ( is_active_sidebar( 'index-footer-widget-area' ) ) {
	dynamic_sidebar( 'index-footer-widget-area' );
}?>
<?php
	get_rueckenwinde_footer();
?>