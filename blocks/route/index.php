<?php
/**
 * Route Hero Block - Server Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$heading = isset($attributes['heading']) ? $attributes['heading'] : 'UNSERE ROUTE';
$image_src = isset($attributes['imageSrc']) ? $attributes['imageSrc'] : '';
$image_alt = isset($attributes['imageAlt']) ? $attributes['imageAlt'] : 'Route Bild';
$fill_label = isset($attributes['fillLabel']) ? $attributes['fillLabel'] : 'Ausfüllen:';
$start_end = isset($attributes['startEnd']) ? $attributes['startEnd'] : 'Start -> Ende';
$feeling = isset($attributes['feeling']) ? $attributes['feeling'] : 'Fahrgefühl';
$climate = isset($attributes['climate']) ? $attributes['climate'] : 'Klima & Reisezeit';
$link_text = isset($attributes['linkText']) ? $attributes['linkText'] : '>>WEITERLESEN [LINK]';
$link_url = isset($attributes['linkUrl']) ? $attributes['linkUrl'] : '';

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'route-hero-' . uniqid();
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-route-hero">
    <div class="route-hero-container">
        
        <h2 class="route-hero-heading">
            <?php echo esc_html($heading); ?>
        </h2>

        <div class="grid-x route-hero-content">
            
            <!-- Left: Image -->
            <div class="cell large-6">
                <div class="route-hero-image-wrapper">
                    <?php if (!empty($image_src)) : ?>
                        <img src="<?php echo esc_url($image_src); ?>" 
                             alt="<?php echo esc_attr($image_alt); ?>" 
                             class="route-hero-image">
                    <?php else : ?>
                        <div class="route-hero-image-placeholder">
                            <span>BILD Route</span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Right: Info -->
            <div class="cell large-6">
                <div class="route-hero-info">
                    
                    <div class="route-hero-fill-section">
                        <h3 class="route-hero-fill-label">
                            <?php echo esc_html($fill_label); ?>
                        </h3>
                        
                        <ul class="route-hero-list">
                            <li><?php echo esc_html($start_end); ?></li>
                            <li><?php echo esc_html($feeling); ?></li>
                            <li><?php echo esc_html($climate); ?></li>
                        </ul>
                    </div>

                    <?php if (!empty($link_url)) : ?>
                        <a href="<?php echo esc_url($link_url); ?>" class="route-hero-link">
                            <?php echo esc_html($link_text); ?>
                        </a>
                    <?php else : ?>
                        <div class="route-hero-link-placeholder">
                            <?php echo esc_html($link_text); ?>
                        </div>
                    <?php endif; ?>

                </div>
            </div>

        </div>

    </div>
</div>