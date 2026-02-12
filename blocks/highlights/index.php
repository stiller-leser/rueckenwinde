<?php
/**
 * Highlights Hero Block - Server Side Render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$heading = isset($attributes['heading']) ? wp_kses_post($attributes['heading']) : 'UNSERE HIGHLIGHTS';

$image1_src = isset($attributes['image1Src']) ? $attributes['image1Src'] : '';
$image1_alt = isset($attributes['image1Alt']) ? $attributes['image1Alt'] : 'Highlight 1';

$image2_src = isset($attributes['image2Src']) ? $attributes['image2Src'] : '';
$image2_alt = isset($attributes['image2Alt']) ? $attributes['image2Alt'] : 'Highlight 2';

$image3_src = isset($attributes['image3Src']) ? $attributes['image3Src'] : '';
$image3_alt = isset($attributes['image3Alt']) ? $attributes['image3Alt'] : 'Highlight 3';

$image1_url = isset($attributes['image1Url']) ? $attributes['image1Url'] : '';
$image1_label = isset($attributes['image1Label']) ? wp_kses_post($attributes['image1Label']) : '';
$image2_url = isset($attributes['image2Url']) ? $attributes['image2Url'] : '';
$image2_label = isset($attributes['image2Label']) ? wp_kses_post($attributes['image2Label']) : '';
$image3_url = isset($attributes['image3Url']) ? $attributes['image3Url'] : '';
$image3_label = isset($attributes['image3Label']) ? wp_kses_post($attributes['image3Label']) : '';
$images = isset($attributes['images']) ? $attributes['images'] : null;
$highlights_per_row = isset($attributes['highlightsPerRow']) ? (int) $attributes['highlightsPerRow'] : 3;
$highlights_per_row = max(1, min(6, $highlights_per_row));
$link_text = isset($attributes['linkText']) ? wp_kses_post($attributes['linkText']) : '>>WEITERLESEN [LINK]';
$link_url = isset($attributes['linkUrl']) ? $attributes['linkUrl'] : '';

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'highlights-hero-' . uniqid();

$resolved_images = is_array($images) && !empty($images) ? $images : array(
    array('src' => $image1_src, 'alt' => $image1_alt, 'url' => $image1_url, 'label' => $image1_label),
    array('src' => $image2_src, 'alt' => $image2_alt, 'url' => $image2_url, 'label' => $image2_label),
    array('src' => $image3_src, 'alt' => $image3_alt, 'url' => $image3_url, 'label' => $image3_label),
);
?>

<div id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-highlights-hero">
    <div class="highlights-hero-container">
        
        <h3 class="highlights-hero-heading">
            <?php echo nl2br(wp_kses_post($heading)); ?>
        </h3>

        <div class="row highlights-hero-images grid-x" style="--highlights-per-row: <?php echo esc_attr($highlights_per_row); ?>;">
            <?php foreach ($resolved_images as $image) : ?>
                <?php
                $src = isset($image['src']) ? $image['src'] : '';
                $alt = isset($image['alt']) ? $image['alt'] : '';
                $url = isset($image['url']) ? $image['url'] : '';
                $label = isset($image['label']) ? $image['label'] : '';
                ?>
                <div class="cell columns">
                    <div class="highlights-hero-image-wrapper">
                        <?php if (!empty($src)) : ?>
                            <?php if (!empty($url)) : ?>
                                <a href="<?php echo esc_url($url); ?>">
                            <?php endif; ?>
                            <img src="<?php echo esc_url($src); ?>" 
                                 alt="<?php echo esc_attr($alt); ?>" 
                                 class="highlights-hero-image">
                            <?php if (!empty($label)) : ?>
                                <span class="highlights-hero-image-label">
                                    <?php echo nl2br(wp_kses_post($label)); ?>
                                </span>
                            <?php endif; ?>
                            <?php if (!empty($url)) : ?>
                                </a>
                            <?php endif; ?>
                        <?php else : ?>
                            <div class="highlights-hero-image-placeholder">
                                <span>BILD</span>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <?php if (!empty($link_url)) : ?>
            <div class="highlights-hero-link-wrapper">
                <a href="<?php echo esc_url($link_url); ?>" class="highlights-hero-link">
                    <?php echo nl2br(wp_kses_post($link_text)); ?>
                </a>
            </div>
        <?php endif; ?>

    </div>
</div>
