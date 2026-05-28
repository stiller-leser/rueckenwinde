<?php
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'kostenrechner-' . wp_unique_id();

$default_style_costs = array(
    'low' => 400,
    'mittel' => 800,
    'komfort' => 1400,
);
$default_vehicle_monthly_costs = array(
    'klein' => 300,
    'van' => 600,
    'lkw' => 1000,
);
$default_shipping_costs = array(
    'klein' => 2000,
    'van' => 3500,
    'lkw' => 6000,
);

$style_costs = isset($attributes['styleCosts']) && is_array($attributes['styleCosts']) ? $attributes['styleCosts'] : array();
$vehicle_monthly_costs = isset($attributes['vehicleMonthlyCosts']) && is_array($attributes['vehicleMonthlyCosts']) ? $attributes['vehicleMonthlyCosts'] : array();
$shipping_costs = isset($attributes['shippingCosts']) && is_array($attributes['shippingCosts']) ? $attributes['shippingCosts'] : array();

$style_costs = array(
    'low' => isset($style_costs['low']) ? absint($style_costs['low']) : $default_style_costs['low'],
    'mittel' => isset($style_costs['mittel']) ? absint($style_costs['mittel']) : $default_style_costs['mittel'],
    'komfort' => isset($style_costs['komfort']) ? absint($style_costs['komfort']) : $default_style_costs['komfort'],
);
$vehicle_monthly_costs = array(
    'klein' => isset($vehicle_monthly_costs['klein']) ? absint($vehicle_monthly_costs['klein']) : $default_vehicle_monthly_costs['klein'],
    'van' => isset($vehicle_monthly_costs['van']) ? absint($vehicle_monthly_costs['van']) : $default_vehicle_monthly_costs['van'],
    'lkw' => isset($vehicle_monthly_costs['lkw']) ? absint($vehicle_monthly_costs['lkw']) : $default_vehicle_monthly_costs['lkw'],
);
$shipping_costs = array(
    'klein' => isset($shipping_costs['klein']) ? absint($shipping_costs['klein']) : $default_shipping_costs['klein'],
    'van' => isset($shipping_costs['van']) ? absint($shipping_costs['van']) : $default_shipping_costs['van'],
    'lkw' => isset($shipping_costs['lkw']) ? absint($shipping_costs['lkw']) : $default_shipping_costs['lkw'],
);

$title = isset($attributes['title']) ? $attributes['title'] : 'Panamericana Kosten-Schnellrechner';
$subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : 'Schnelle Monatskalkulation fuer eure Reiseplanung auf rueckenwind.de';
$cost_driver_label = isset($attributes['costDriverLabel']) ? $attributes['costDriverLabel'] : 'Groesster Kostentreiber';
$default_cost_driver_texts = array(
    'lkw' => 'Treibstoff und Verschiffung',
    'komfort' => 'Lebenshaltung und Unterkunft',
    'shortDuration' => 'Verschiffung (kurze Reisedauer)',
    'manyPeople' => 'Lebenshaltung fuer mehrere Personen',
    'van' => 'Fahrzeugbetrieb und Wartung',
    'default' => 'Laufende Reiseausgaben',
);
$cost_driver_texts = isset($attributes['costDriverTexts']) && is_array($attributes['costDriverTexts']) ? $attributes['costDriverTexts'] : array();
$cost_driver_texts = array(
    'lkw' => isset($cost_driver_texts['lkw']) ? sanitize_text_field($cost_driver_texts['lkw']) : $default_cost_driver_texts['lkw'],
    'komfort' => isset($cost_driver_texts['komfort']) ? sanitize_text_field($cost_driver_texts['komfort']) : $default_cost_driver_texts['komfort'],
    'shortDuration' => isset($cost_driver_texts['shortDuration']) ? sanitize_text_field($cost_driver_texts['shortDuration']) : $default_cost_driver_texts['shortDuration'],
    'manyPeople' => isset($cost_driver_texts['manyPeople']) ? sanitize_text_field($cost_driver_texts['manyPeople']) : $default_cost_driver_texts['manyPeople'],
    'van' => isset($cost_driver_texts['van']) ? sanitize_text_field($cost_driver_texts['van']) : $default_cost_driver_texts['van'],
    'default' => isset($cost_driver_texts['default']) ? sanitize_text_field($cost_driver_texts['default']) : $default_cost_driver_texts['default'],
);
?>

<div
    id="<?php echo esc_attr($block_id); ?>"
    class="wp-block-rueckenwinde-kostenrechner"
    aria-label="Kosten-Schnellrechner Panamericana"
    data-style-costs="<?php echo esc_attr(wp_json_encode($style_costs)); ?>"
    data-vehicle-monthly-costs="<?php echo esc_attr(wp_json_encode($vehicle_monthly_costs)); ?>"
    data-shipping-costs="<?php echo esc_attr(wp_json_encode($shipping_costs)); ?>"
    data-cost-driver-texts="<?php echo esc_attr(wp_json_encode($cost_driver_texts)); ?>"
>
    <main class="kostenrechner__rechner" aria-label="Kosten-Schnellrechner Panamericana">
        <header class="kostenrechner__header">
            <h2 class="kostenrechner__title"><?php echo esc_html($title); ?></h2>
            <p class="kostenrechner__subtitle"><?php echo esc_html($subtitle); ?></p>
        </header>

        <section class="kostenrechner__grid">
            <div class="kostenrechner__panel">
                <div class="kostenrechner__section">
                    <div class="kostenrechner__label">
                        <span>Reisestil</span>
                        <span class="kostenrechner__hint">Budget pro Person und Monat</span>
                    </div>
                    <div class="kostenrechner__option-row" data-group="style">
                        <button class="kostenrechner__option is-active" type="button" data-value="low">Low Budget<small><?php echo esc_html(number_format_i18n($style_costs['low'])); ?> EUR</small></button>
                        <button class="kostenrechner__option" type="button" data-value="mittel">Mittel<small><?php echo esc_html(number_format_i18n($style_costs['mittel'])); ?> EUR</small></button>
                        <button class="kostenrechner__option" type="button" data-value="komfort">Komfort<small><?php echo esc_html(number_format_i18n($style_costs['komfort'])); ?> EUR</small></button>
                    </div>
                </div>

                <div class="kostenrechner__section">
                    <div class="kostenrechner__label">
                        <span>Dauer</span>
                        <span class="kostenrechner__hint"><span data-role="duration-value">12</span> Monate</span>
                    </div>
                    <input data-role="duration" type="range" min="3" max="36" value="12" step="1" />
                </div>

                <div class="kostenrechner__section kostenrechner__section--vehicle">
                    <div class="kostenrechner__label">
                        <span>Fahrzeug</span>
                        <span class="kostenrechner__hint">Betrieb + Verschiffung</span>
                    </div>
                    <div class="kostenrechner__option-row" data-group="vehicle">
                        <button class="kostenrechner__option is-active" type="button" data-value="klein">
                            <span class="kostenrechner__icon" aria-hidden="true">🏍️</span>
                            Motorrad/Kleinwagen
                        </button>
                        <button class="kostenrechner__option" type="button" data-value="van">
                            <span class="kostenrechner__icon" aria-hidden="true">🚐</span>
                            Van/4x4
                        </button>
                        <button class="kostenrechner__option" type="button" data-value="lkw">
                            <span class="kostenrechner__icon" aria-hidden="true">🚚</span>
                            LKW/Expeditionsmobil
                        </button>
                    </div>
                </div>

                <div class="kostenrechner__section">
                    <div class="kostenrechner__label">
                        <span>Personen</span>
                        <span class="kostenrechner__hint">1 bis 5</span>
                    </div>
                    <div class="kostenrechner__counter" aria-label="Personenzahl auswaehlen">
                        <button type="button" data-role="decrease" aria-label="Personen verringern">-</button>
                        <span class="kostenrechner__counter-value" data-role="people-value">2</span>
                        <button type="button" data-role="increase" aria-label="Personen erhoehen">+</button>
                    </div>
                </div>
            </div>

            <aside class="kostenrechner__output">
                <div class="kostenrechner__result-card">
                    <h3 class="kostenrechner__result-title">Monatliche Kostenspanne</h3>
                    <p class="kostenrechner__result-value" data-role="result-range">0 EUR - 0 EUR</p>
                    <p class="kostenrechner__formula" data-role="result-detail"></p>
                </div>

                <div class="kostenrechner__driver">
                    <strong><?php echo esc_html($cost_driver_label); ?></strong>
                    <span data-role="driver-text">-</span>
                </div>
            </aside>
        </section>
    </main>
</div>
