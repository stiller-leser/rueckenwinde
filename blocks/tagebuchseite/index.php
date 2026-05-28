<?php
$entry_date = isset($attributes['entryDate']) ? sanitize_text_field($attributes['entryDate']) : '';
$entry_title = isset($attributes['entryTitle']) ? sanitize_text_field($attributes['entryTitle']) : '';
$sections = isset($attributes['sections']) && is_array($attributes['sections']) ? $attributes['sections'] : array();

$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'tagebuchseite-' . wp_unique_id();

$render_section = static function ($section) {
    if (!is_array($section) || !isset($section['type'])) {
        return;
    }

    $type = sanitize_key($section['type']);
    $title = isset($section['title']) ? sanitize_text_field($section['title']) : '';
    $text = isset($section['text']) ? wp_kses_post($section['text']) : '';
    $media_url = isset($section['mediaUrl']) ? esc_url($section['mediaUrl']) : '';
    $media_alt = isset($section['mediaAlt']) ? sanitize_text_field($section['mediaAlt']) : '';
    $frame_style = isset($section['frameStyle']) && in_array($section['frameStyle'], array('tape', 'corners'), true) ? $section['frameStyle'] : 'tape';
    $layout = isset($section['layout']) && in_array($section['layout'], array('full', 'left', 'right', 'inline_left', 'inline_right'), true) ? $section['layout'] : 'full';
    $photo_width = isset($section['photoWidth']) ? max(20, min(100, intval($section['photoWidth']))) : 100;
    $frame_height = isset($section['frameHeight']) ? max(160, min(700, intval($section['frameHeight']))) : 320;
    $frame_shift_x = isset($section['frameShiftX']) ? max(-260, min(260, intval($section['frameShiftX']))) : 0;
    $frame_shift_y = isset($section['frameShiftY']) ? max(-260, min(260, intval($section['frameShiftY']))) : 0;
    $zoom = isset($section['zoom']) ? max(50, min(220, intval($section['zoom']))) : 100;
    $offset_x = isset($section['offsetX']) ? max(-300, min(300, intval($section['offsetX']))) : 0;
    $offset_y = isset($section['offsetY']) ? max(-300, min(300, intval($section['offsetY']))) : 0;

    if ($type === 'text') {
        ?>
        <article class="tagebuchseite-section tagebuchseite-section--text">
            <?php if ($title !== '') : ?>
                <h3 class="tagebuchseite-section-title"><?php echo esc_html($title); ?></h3>
            <?php endif; ?>
            <div class="tagebuchseite-section-text"><?php echo nl2br($text); ?></div>
        </article>
        <?php
        return;
    }

    if ($type === 'photo') {
        $frame_class = $frame_style === 'corners' ? 'is-corners' : 'is-tape';
        ?>
        <article class="tagebuchseite-section tagebuchseite-section--photo layout-<?php echo esc_attr($layout); ?>" style="--ts-photo-width: <?php echo esc_attr($photo_width); ?>%;">
            <?php if ($title !== '') : ?>
                <h3 class="tagebuchseite-section-title"><?php echo esc_html($title); ?></h3>
            <?php endif; ?>
            <div class="tagebuchseite-photo-layout">
                <div class="tagebuchseite-photo-frame <?php echo esc_attr($frame_class); ?>" style="height: <?php echo esc_attr($frame_height); ?>px; transform: translate(<?php echo esc_attr($frame_shift_x); ?>px, <?php echo esc_attr($frame_shift_y); ?>px);">
                    <?php if ($media_url !== '') : ?>
                        <img src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($media_alt); ?>" loading="lazy" style="width: <?php echo esc_attr($zoom); ?>%; transform: translate(<?php echo esc_attr($offset_x); ?>px, <?php echo esc_attr($offset_y); ?>px);" />
                    <?php else : ?>
                        <div class="tagebuchseite-photo-placeholder">Foto oder GIF einfuegen</div>
                    <?php endif; ?>
                </div>
                <?php if ($text !== '') : ?>
                    <div class="tagebuchseite-section-caption"><?php echo nl2br($text); ?></div>
                <?php endif; ?>
            </div>
        </article>
        <?php
        return;
    }

    $label = 'Notiz';
    if ($type === 'highlight_day') {
        $label = 'Highlight des Tages';
    } elseif ($type === 'highlight_week') {
        $label = 'Highlight der Woche';
    } elseif ($type === 'spot_week') {
        $label = 'Stellplatz der Woche';
    }

    ?>
    <article class="tagebuchseite-section tagebuchseite-section--highlight tagebuchseite-section--<?php echo esc_attr($type); ?>">
        <h3 class="tagebuchseite-badge-label"><?php echo esc_html($label); ?></h3>
        <?php if ($title !== '' && $title !== $label) : ?>
            <h4 class="tagebuchseite-section-title"><?php echo esc_html($title); ?></h4>
        <?php endif; ?>
        <div class="tagebuchseite-section-text"><?php echo nl2br($text); ?></div>
    </article>
    <?php
};
?>

<section id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-tagebuchseite" aria-label="Tagebuchseite">
    <div class="tagebuchseite-paper">
        <header class="tagebuchseite-header">
            <?php if ($entry_date !== '') : ?>
                <p class="tagebuchseite-date"><?php echo esc_html($entry_date); ?></p>
            <?php endif; ?>
            <?php if ($entry_title !== '') : ?>
                <h2 class="tagebuchseite-title"><?php echo esc_html($entry_title); ?></h2>
            <?php endif; ?>
        </header>

        <div class="tagebuchseite-content">
            <?php foreach ($sections as $section) : ?>
                <?php $render_section($section); ?>
            <?php endforeach; ?>
        </div>
    </div>
</section>
