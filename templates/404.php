<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package rueckenwin.de
 */

get_rueckenwinde_header('homepage');
?>

<div id="primary" class="content-area large-8 medium-8 small-12 cell">
	<main id="main" class="site-main">

		<section class="error-404 not-found">
			<header class="page-header">
				<h1 class="page-title"><?php esc_html_e( 'Oops! Diese Reise endete im Nirvana.', 'rueckenwinde' ); ?></h1>
			</header><!-- .page-header -->

			<?php get_rueckenwinde_part('content-rand') ?>

		</main><!-- #main -->
	</div><!-- #primary -->

	<?php
	get_sidebar();

	get_footer();
