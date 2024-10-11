<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package rueckenwin.de
 */
// $object = get_queried_object();
// $slug = 'homepage';
// if(isset($object->category_parent) && !is_null($object->category_parent) && !is_null(get_category($object->category_parent)->slug)):
//     $category = get_category($object->category_parent);
//     $slug = $category->slug.'-archive';
// else:
//     if( !isset($object->slug) ):
//         if( isset($object->rewrite['slug']) ):
//             $slug = $object->rewrite['slug'];
//         endif;
//     else:
//         $slug = $object->slug;
//     endif;
// endif;

get_rueckenwinde_header("frontpage", "category");

$catID = get_the_category();
if(isset($catID[0])):
    $category_description = category_description( $catID[0] ); 
else:
    $category_description = category_description( $catID ); 
endif;
$category_title = single_cat_title( $prefix = '', $display = false ); 
?>

<?php if (function_exists('z_taxonomy_image_url')): ?>
    <style>
        #header-wrap {
            background-image: url('<?php echo esc_url(z_taxonomy_image_url($cat->term_id)); ?>');
            background-size: cover;
        }
    </style>
<?php endif; ?>

    <div id="primary" class="content-area large-8 medium-8 small-12 cell fp-blog-grid">
        <main id="main" class="site-main">
            <?php
                $category = get_queried_object();
                if ( $category && !empty($category->description) ) :
            ?>
                    <section class="category-description">
                        <?php if (function_exists('z_taxonomy_image')) z_taxonomy_image(); ?>
                        <h1>
                            <?php esc_html_e($category_title); ?> 
                        </h1>
                        <?php   
                            echo "<p>" . esc_html($category->description) . "</p>";
                        ?>
                    </section>
            <?php
                endif;

                if ( have_posts() ):
                    /* Start the Loop */
                    while ( have_posts() ) :
                        the_post();
                        /*
                            * Include the Post-Type-specific template for the content.
                            * If you want to override this in a child theme, then include a file
                            * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                        */
                        get_rueckenwinde_part( 'content-excerpt' );
                    endwhile;
                    the_posts_pagination();
                else :
                    get_rueckenwinde_part( 'none' );
                endif;
            ?>
        </main><!-- #main -->
    </div><!-- #primary -->
<?php
get_sidebar();
?>
</section>
<?php
get_footer();
