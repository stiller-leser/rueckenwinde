<?php
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'panamericana-country-essentials-' . wp_unique_id();
$title = isset($attributes['title']) ? $attributes['title'] : 'Panamericana Country-Essentials';
$subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : 'Waehle ein Land und erhalte sofort die wichtigsten Reise-Essentials.';

$default_countries = array(
    array(
        'name' => 'Mexiko',
        'flagIcon' => '🇲🇽',
        'essentials' => array(
            'insurance' => 'Kfz-Haftpflicht lokal abschliessen und Police offline speichern.',
            'sim' => 'Telcel SIM mit grossem Datenpaket ist auf der Route meist die stabilste Wahl.',
            'cash' => 'In kleineren Orten ausreichend Bargeld dabeihaben, Kartenzahlung ist nicht immer moeglich.',
            'spareParts' => 'Basis-Ersatzteile in Grenznaehe schwerer zu bekommen, vorher aufstocken.',
            'apps' => 'iOverlander, Maps.me und WhatsApp sind fuer Spot-Suche und lokale Kontakte essenziell.'
        ),
        'tips' => array(
            'insurance' => 'Tipp: Kopie der Police im Handschuhfach und als PDF auf dem Handy.',
            'sim' => 'Tipp: APN direkt am Schalter pruefen lassen.',
            'cash' => 'Tipp: Kleine Scheine fuer Maut und Parkplaetze bereithalten.',
            'spareParts' => 'Tipp: Verschleissteile schon vor Chiapas besorgen.',
            'apps' => 'Tipp: Offline-Karten vor Bergregionen herunterladen.'
        )
    )
);

$countries = isset($attributes['countries']) && is_array($attributes['countries']) && !empty($attributes['countries']) ? $attributes['countries'] : $default_countries;

$keys = array('insurance', 'sim', 'cash', 'spareParts', 'apps');
$labels = array(
    'insurance' => 'Versicherung',
    'sim' => 'SIM',
    'cash' => 'Bargeld',
    'spareParts' => 'Ersatzteile',
    'apps' => 'Apps',
);
$icons = array(
    'insurance' => '🛡',
    'sim' => '📶',
    'cash' => '💵',
    'spareParts' => '🔧',
    'apps' => '📱',
);

$normalized_countries = array();
foreach ($countries as $country) {
    $safe_country = is_array($country) ? $country : array();
    $essentials = isset($safe_country['essentials']) && is_array($safe_country['essentials']) ? $safe_country['essentials'] : array();
    $tips = isset($safe_country['tips']) && is_array($safe_country['tips']) ? $safe_country['tips'] : array();

    $normalized = array(
        'name' => isset($safe_country['name']) && $safe_country['name'] !== '' ? sanitize_text_field($safe_country['name']) : 'Unbenanntes Land',
        'flagIcon' => isset($safe_country['flagIcon']) ? sanitize_text_field($safe_country['flagIcon']) : '🏳️',
        'essentials' => array(),
        'tips' => array(),
    );

    foreach ($keys as $key) {
        $normalized['essentials'][$key] = isset($essentials[$key]) ? sanitize_textarea_field($essentials[$key]) : '-';
        $normalized['tips'][$key] = isset($tips[$key]) ? sanitize_textarea_field($tips[$key]) : '';
    }

    $normalized_countries[] = $normalized;
}

$initial_country = !empty($normalized_countries) ? $normalized_countries[0] : null;
?>

<section
    id="<?php echo esc_attr($block_id); ?>"
    class="wp-block-rueckenwinde-panamericana-country-essentials"
    data-countries="<?php echo esc_attr(wp_json_encode($normalized_countries)); ?>"
>
    <header class="pce-header">
        <h2 class="pce-title"><?php echo esc_html($title); ?></h2>
        <p class="pce-subtitle"><?php echo esc_html($subtitle); ?></p>
    </header>

    <div class="pce-selector-wrap" aria-label="Land auswaehlen">
        <div class="pce-selector" role="tablist" aria-label="Laender-Menue">
            <?php foreach ($normalized_countries as $index => $country) : ?>
                <button
                    type="button"
                    role="tab"
                    class="pce-country-btn <?php echo $index === 0 ? 'is-active' : ''; ?>"
                    data-country-index="<?php echo esc_attr((string) $index); ?>"
                    aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>"
                >
                    <span class="pce-flag"><?php echo esc_html($country['flagIcon']); ?></span>
                    <span class="pce-country-name"><?php echo esc_html($country['name']); ?></span>
                </button>
            <?php endforeach; ?>
        </div>

        <label class="pce-select-label" for="<?php echo esc_attr($block_id); ?>-select">Land</label>
        <select id="<?php echo esc_attr($block_id); ?>-select" class="pce-select" data-role="country-select">
            <?php foreach ($normalized_countries as $index => $country) : ?>
                <option value="<?php echo esc_attr((string) $index); ?>"><?php echo esc_html($country['flagIcon'] . ' ' . $country['name']); ?></option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="pce-grid" data-role="essentials-grid">
        <?php foreach ($keys as $key) : ?>
            <article class="pce-card" data-category="<?php echo esc_attr($key); ?>">
                <div class="pce-card-head">
                    <span class="pce-card-icon" aria-hidden="true"><?php echo esc_html($icons[$key]); ?></span>
                    <h3 class="pce-card-title"><?php echo esc_html($labels[$key]); ?></h3>
                </div>
                <p class="pce-card-text" data-field="text-<?php echo esc_attr($key); ?>"><?php echo $initial_country ? esc_html($initial_country['essentials'][$key]) : '-'; ?></p>
                <p class="pce-card-tip" data-field="tip-<?php echo esc_attr($key); ?>"><?php echo $initial_country ? esc_html($initial_country['tips'][$key]) : ''; ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>
