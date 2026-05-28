<?php
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'pannen-log-' . wp_unique_id();
$title = isset($attributes['title']) ? $attributes['title'] : 'Interaktives Pannen-Log';
$subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : 'Unsere Stolpersteine auf der Panamericana: Problem, Loesung und Stress-Level auf einen Blick.';

$default_entries = array(
    array(
        'category' => 'Technik',
        'title' => 'Anlasser streikt im Regen',
        'ort' => 'San Cristobal de las Casas, Mexiko',
        'problem' => 'Der Motor sprang nach einer Nacht im Dauerregen nicht mehr an.',
        'solution' => 'Kontakte gereinigt, Starterrelais getauscht und Notstart-Kabel fest im Setup hinterlegt.',
        'stress' => 8,
    ),
    array(
        'category' => 'Grenze',
        'title' => 'Falscher Schalter bei der Ausreise',
        'ort' => 'Paso Canoas, Costa Rica/Panama',
        'problem' => 'Wir haben zuerst den Fahrzeug- statt den Personenprozess gestartet und Zeit verloren.',
        'solution' => 'Ablauf als Checkliste am Armaturenbrett, zuerst Migration, dann Zoll.',
        'stress' => 6,
    ),
    array(
        'category' => 'Gesundheit',
        'title' => 'Magen-Darm auf 3.800 m',
        'ort' => 'Cusco, Peru',
        'problem' => 'Kombination aus Hoehenanpassung und ungewohntem Essen hat uns ausgebremst.',
        'solution' => '48h Pause, Elektrolyte, leichter Kostplan und langsamere Etappen.',
        'stress' => 7,
    ),
    array(
        'category' => 'Buerokratie',
        'title' => 'Versicherungspolice nicht akzeptiert',
        'ort' => 'Mendoza, Argentinien',
        'problem' => 'Die digitale Police wurde ohne spanische Uebersetzung nicht anerkannt.',
        'solution' => 'Bilingualen Nachweis organisiert und als Offline-PDF plus Ausdruck abgelegt.',
        'stress' => 5,
    ),
    array(
        'category' => 'Technik',
        'title' => 'Solarregler ueberhitzt',
        'ort' => 'Atacama, Chile',
        'problem' => 'Bei extremer Hitze ging die Ladeleistung massiv runter.',
        'solution' => 'Regler versetzt, Luftspalt vergroessert und passiven Kuehlkoerper nachgeruestet.',
        'stress' => 7,
    ),
);

$entries = isset($attributes['entries']) && is_array($attributes['entries']) && !empty($attributes['entries']) ? $attributes['entries'] : $default_entries;

$allowed_categories = array('Technik', 'Grenze', 'Gesundheit', 'Buerokratie');

$normalized_entries = array();
foreach ($entries as $entry) {
    $category = isset($entry['category']) ? sanitize_text_field($entry['category']) : 'Technik';
    if (!in_array($category, $allowed_categories, true)) {
        $category = 'Technik';
    }

    $stress = isset($entry['stress']) ? intval($entry['stress']) : 5;
    $stress = max(1, min(10, $stress));

    $normalized_entries[] = array(
        'category' => $category,
        'title' => isset($entry['title']) ? sanitize_text_field($entry['title']) : 'Unbenannter Vorfall',
        'ort' => isset($entry['ort']) ? sanitize_text_field($entry['ort']) : '-',
        'problem' => isset($entry['problem']) ? sanitize_textarea_field($entry['problem']) : '-',
        'solution' => isset($entry['solution']) ? sanitize_textarea_field($entry['solution']) : '-',
        'stress' => $stress,
    );
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="wp-block-rueckenwinde-pannen-log" aria-label="Interaktives Pannen-Log">
    <header class="pannen-log__header">
        <h2 class="pannen-log__title"><?php echo esc_html($title); ?></h2>
        <p class="pannen-log__subtitle"><?php echo esc_html($subtitle); ?></p>
    </header>

    <nav class="pannen-log__filters" aria-label="Pannen nach Kategorie filtern">
        <button type="button" class="pannen-log__chip is-active" data-filter="alle">Alle</button>
        <button type="button" class="pannen-log__chip" data-filter="technik">Technik</button>
        <button type="button" class="pannen-log__chip" data-filter="grenze">Grenze</button>
        <button type="button" class="pannen-log__chip" data-filter="gesundheit">Gesundheit</button>
        <button type="button" class="pannen-log__chip" data-filter="buerokratie">Buerokratie</button>
    </nav>

    <div class="pannen-log__grid" data-role="cards-grid">
        <?php foreach ($normalized_entries as $entry) : ?>
            <?php $stress_width = (int) round(($entry['stress'] / 10) * 100); ?>
            <article class="pannen-log__card" data-category="<?php echo esc_attr(strtolower($entry['category'])); ?>" tabindex="0">
                <div class="pannen-log__card-head">
                    <span class="pannen-log__badge"><?php echo esc_html($entry['category']); ?></span>
                    <span class="pannen-log__stress-value">Stress <?php echo esc_html((string) $entry['stress']); ?>/10</span>
                </div>

                <h3 class="pannen-log__card-title"><?php echo esc_html($entry['title']); ?></h3>
                <p class="pannen-log__location"><?php echo esc_html($entry['ort']); ?></p>

                <div class="pannen-log__stress" aria-hidden="true">
                    <span class="pannen-log__stress-bar" style="width: <?php echo esc_attr((string) $stress_width); ?>%;"></span>
                </div>

                <div class="pannen-log__text-layer pannen-log__text-layer--problem">
                    <h4>Problem</h4>
                    <p class="pannen-log__problem"><?php echo esc_html($entry['problem']); ?></p>
                </div>

                <div class="pannen-log__text-layer pannen-log__text-layer--solution">
                    <h4>Loesung</h4>
                    <p class="pannen-log__solution"><?php echo esc_html($entry['solution']); ?></p>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</section>
