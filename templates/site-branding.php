<div class="site-branding large-4 medium-10 small-9 cell">
    <?php
        if ( is_front_page() && is_home() ) :
    ?>
            <div class="logo-container">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home"><h1><i class="fas fa-wind"></i><div><?php bloginfo( 'name' ); ?></div></h1></a>
    <?php
        else :
    ?>
            <div class="logo-container">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home"><h2><i class="fas fa-wind"></i><div><?php bloginfo( 'name' ); ?></div></h2></a>
    <?php
        endif;
    ?>
            </div>	
</div><!-- .site-branding -->