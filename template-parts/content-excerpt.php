<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package writers_blogily
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<a href="<?php esc_url(the_permalink()); ?>">
		<?php if ( has_post_thumbnail() ) : ?>
			<!-- <a href="<?php esc_url(the_permalink()); ?>" title="<?php esc_html(the_title_attribute()); ?>"> -->
				<?php the_post_thumbnail('large'); ?>
			<!-- </a> -->
		<?php endif; ?>
		<div class="article-contents">
			<header class="entry-header">
				<div class="entry-meta">
					<?php echo get_the_date('F j, Y'); ?>
				</div>
				<h2 class="entry-title"><?php the_title(); ?></h2>
			</header>
			<div class="entry-content">
				<!-- <a href="<?php esc_url(the_permalink()); ?>" title="<?php esc_html(the_title_attribute()); ?>"> -->
					<?php the_excerpt(); ?>
				<!-- </a> -->
			</div>
		</div>
	</a>
</article>
