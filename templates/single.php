<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package writers_blogily
 */
$object = get_queried_object();
$post_type = 'homepage';
if( is_null($object->post_type) ):
    $post_type = $object->rewrite['post_type'];
else:
    $post_type = $object->post_type;
endif;
get_rueckenwinde_header("frontpage", 'single');
?>
	<style>
        #header-wrap {
            background-image: url('<?php echo esc_url(get_the_post_thumbnail_url($post, 'full')); ?>');
            background-size: cover;
        }
    </style>

</div><!-- first content -->
		</section><!-- first page -->
		
		<section id="page" class="site grid-container">
			<div id="content" class="site-content grid-x grid-padding-x">
				<div id="primary" class="content-area large-8 medium-8 small-12 cell">
					<main id="main" class="site-main">
						<?php
							while ( have_posts() ) :
								the_post();

								get_template_part( 'template-parts/content', get_post_type() );

								// Related posts start
								$categories = get_the_category($post->ID); 
								if ($categories) { 
									$category_ids = array(); 
									foreach($categories as $individual_category) 
										$category_ids[] = $individual_category->term_id; 
										$args=array( 
											'category__in' => $category_ids, 
											'post__not_in' => array($post->ID), 
											'ignore_sticky_posts' => 1, 
											'showposts'=> 3,
											'orderby' => 'rand'
										);
										$my_query = new wp_query( $args ); if( $my_query->have_posts() ) {
										echo '<div class="related-posts blog"><div class="postauthor-top"><h3>'.esc_html__('Related Posts', 'writers-blogily').'</h3></div><main>';
										$pexcerpt=1; $j = 0; $counter = 0; 
										while( $my_query->have_posts() ) { 
											$my_query->the_post();?>
											<article class="post excerpt  <?php echo (++$j % 3== 0) ? 'last' : ''; ?>">
												<?php if ( has_post_thumbnail() ) : ?>
													<a href="<?php esc_url(the_permalink()); ?>" title="<?php esc_html(the_title_attribute()); ?>">
														<?php the_post_thumbnail('large'); ?>
													</a>
												<?php endif; ?>
												<div class="article-contents">
													<header class="entry-header">
														<?php 
														if ( 'post' === get_post_type() ) :
															?>
														<div class="entry-meta">
															<?php echo esc_html(get_the_date('F j, Y')); ?>
														</div>
														<?php
														the_title( '<h4 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h4>' );
														?>
													<?php endif; ?>
												</div>
											</article><!--.post.excerpt-->
												<?php $pexcerpt++;?>
											<?php 
											} echo '</div></main>'; 
										}
									// End foreach
								} 
								wp_reset_postdata();
								// Related posts end

								// If comments are open or we have at least one comment, load up the comment template.
								if ( comments_open() || get_comments_number() ) :
									comments_template();
								endif;

							endwhile; // End of the loop.
						?>

					</main><!-- #main -->
					<!-- Start Related Posts -->
					<!-- End Related Posts -->
				</div><!-- #primary -->
<?php
get_sidebar();
get_rueckenwinde_footer();
