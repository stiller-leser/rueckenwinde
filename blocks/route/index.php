<?php
/**
 * Route Hero Block - Server Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$heading = isset($attributes['heading']) ? wp_kses_post($attributes['heading']) : 'UNSERE ROUTE';
$image_src = isset($attributes['imageSrc']) ? $attributes['imageSrc'] : '';
$image_alt = isset($attributes['imageAlt']) ? $attributes['imageAlt'] : 'Route Bild';
$image_position = isset($attributes['imagePosition']) ? $attributes['imagePosition'] : 'left';
$list_items = isset($attributes['listItems']) ? $attributes['listItems'] : null;
$start_end = isset($attributes['startEnd']) ? $attributes['startEnd'] : 'Start -> Ende';
$feeling = isset($attributes['feeling']) ? $attributes['feeling'] : 'Fahrgefühl';
$climate = isset($attributes['climate']) ? $attributes['climate'] : 'Klima & Reisezeit';
$link_text = isset($attributes['linkText']) ? wp_kses_post($attributes['linkText']) : '>>WEITERLESEN [LINK]';
$link_url = isset($attributes['linkUrl']) ? $attributes['linkUrl'] : '';

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'route-hero-' . uniqid();

$resolved_list_items = is_array($list_items) ? $list_items : array($start_end, $feeling, $climate);
$layout_class = $image_position === 'right' ? ' is-image-right' : '';
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-route-hero">
    <div class="route-hero-container">
        
        <h3 class="route-hero-heading">
            <?php echo nl2br(wp_kses_post($heading)); ?>
        </h3>

        <div class="grid-x route-hero-content<?php echo esc_attr($layout_class); ?>">
            
            <!-- Left: Image -->
            <div class="cell large-6 route-hero-image-cell">
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
            <div class="cell large-6 route-hero-info-cell">
                <div class="route-hero-info">
                    
                    <div class="route-hero-fill-section">
                        <ul class="route-hero-list">
                            <?php foreach ($resolved_list_items as $item) : ?>
                                <li><?php echo nl2br(wp_kses_post($item)); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <?php if (!empty($link_url)) : ?>
                        <a href="<?php echo esc_url($link_url); ?>" class="route-hero-link">
                            <?php echo nl2br(wp_kses_post($link_text)); ?>
                        </a>
                    <?php endif; ?>

                </div>
            </div>

        </div>

    </div>
</div>
