<?php
/**
 * Template part for displaying a search box and random posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package rueckenwin.de
 */

?>
    <div class="page-content">
        <p>
            <?php esc_html_e( 'Können wir dir bei deiner Suche behilflich sein?', 'rueckenwinde' ); ?>
        </p>
		<?php
            get_search_form();
        ?>
        <p>
            <?php 
                esc_html_e( 'Bevor du gehst: Vielleicht findest du ja einen dieser Artikel interessant?', 'rueckenwinde'); 
            ?>
        </p>
        <div class="random-posts">
            <?php
                $args = array(
                    'post_type' => array(
                        'post',
                        'reisen',
                        'paragliding'
                    ),
                    'orderby'   => 'rand',
                    'posts_per_page' => 5, 
                );
                $query = new WP_Query( $args );
                if ( $query->have_posts() ):
                    while ( $query->have_posts() ):
                        $query->the_post();
                        get_rueckenwinde_part( 'content-excerpt' );
                    endwhile;
                    /* Restore original Post Data */
                    wp_reset_postdata();
                endif;
            ?>
        </div>        
    </div><!-- .page-content -->