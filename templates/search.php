<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package rueckenwin.de
 */

get_rueckenwinde_header('homepage');
?>

<section id="primary" class="content-area large-8 medium-8 small-12 cell fp-blog-grid">

	<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

		<header class="page-header">
			<h1 class="page-title">
				<?php
				/* translators: %s: search query. */
				printf( esc_html__( 'Suchergebnisse für: %s', 'rueckenwinde' ), '<span>' . get_search_query() . '</span>' );
				?>
			</h1>
		</header><!-- .page-header -->

		<?php
		/* Start the Loop */
		while ( have_posts() ) :
			the_post();

			/**
			 * Run the loop for the search to output the results.
			 * If you want to overload this in a child theme then include a file
			 * called content-search.php and that will be used instead.
			 */
			get_rueckenwinde_part( 'content-excerpt' );

		endwhile;

		the_posts_pagination();

		else :

			get_rueckenwinde_part( 'content-none' );

		endif;
		?>

	</main><!-- #main -->

</section><!-- #primary -->

<?php
get_sidebar();
?>
</section>
<?php
get_footer();
