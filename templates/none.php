<?php
/**
 * Template part for displaying a message that posts cannot be found
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package writers_blogily
 */

?>

<section class="no-results not-found">
	<header class="page-header">
		<h1 class="page-title"><?php esc_html_e( 'Oops! Diese Reise endete im Nirvana.', 'writers-blogily' ); ?></h1>
	</header><!-- .page-header -->

	<div class="page-content">
        <p>
            <?php esc_html_e( 'Aber keine Sorge - wer suchet der findet!', 'writers-blogily' ); ?>
        </p>
		<?php
            get_search_form();
        ?>
    </div><!-- .page-content -->
</section><!-- .no-results -->