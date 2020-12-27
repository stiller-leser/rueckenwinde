<?php
/**
 * Template part for displaying a message that posts cannot be found
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package rueckenwin.de
 */

?>

<section class="no-results not-found">
	<header class="page-header">
		<h2 class="page-title"><?php esc_html_e( 'Hier haben wir noch nichts verfasst.', 'rueckenwinde' ); ?></h2>
	</header><!-- .page-header -->
    <?php get_rueckenwinde_part('content-rand') ?>
</section><!-- .no-results -->