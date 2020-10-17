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
 * @package rueckenwinde
 */
get_rueckenwinde_header('frontpage');
?>

<div id="primary" class="content-area large-8 medium-8 small-12 cell fp-blog-grid">
		<main id="main" class="site-main">

		<?php
			$query = new WP_Query( array ( 'category_name' => 'featured' ) );
			if ( $query->have_posts() ) :
				/* Start the Loop */
				while ( $query->have_posts() ): 
					$query->the_post();
				/*
				* Include the Post-Type-specific template for the content.
				* If you want to override this in a child theme, then include a file
				* called content-___.php (where ___ is the Post Type name) and that will be used instead.
				*/
                    get_rueckenwinde_part( 'content-excerpt' );
				endwhile;
				the_posts_pagination();
			else :
				get_template_part( 'template-parts/content', 'none' );
			endif;
		?>

		</main><!-- #main -->
	</div><!-- #primary -->
<?php
	get_sidebar();
	get_rueckenwinde_footer();
