<?php
$block_id = isset($attributes['anchor']) ? $attributes['anchor'] : 'verschiffungs-kostenrechner-' . wp_unique_id();

$title = isset($attributes['title']) ? $attributes['title'] : 'Interaktiver Verschiffungs-Kostenrechner';
$subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : 'Panama <-> Kolumbien: schnelle Schaetzung fuer eure Transportkosten';
$download_button_label = isset($attributes['downloadButtonLabel']) ? $attributes['downloadButtonLabel'] : 'Aktuelle Agenten-Liste herunterladen';
$agent_list_url = isset($attributes['agentListUrl']) ? esc_url_raw($attributes['agentListUrl']) : '#';

$currency_rate = isset($attributes['currencyRateUsdToEur']) ? floatval($attributes['currencyRateUsdToEur']) : 0.92;
if ($currency_rate <= 0) {
    $currency_rate = 0.92;
}

$default_handling_fees = array(
    'container' => 650,
    'flatRack' => 950,
    'roro' => 500,
);
$default_rate_per_m3 = array(
    'container' => 110,
    'flatRack' => 145,
    'roro' => 80,
);
$default_rate_per_length_meter = array(
    'container' => 230,
    'flatRack' => 300,
    'roro' => 170,
);
$default_pricing_model = array(
    'container' => 'volume',
    'flatRack' => 'length',
    'roro' => 'length',
);
$default_vehicle_surcharge = array(
    'motorrad' => 0,
    'van' => 260,
    'lkw' => 640,
);
$default_container_dimensions = array(
    'standard' => array(
        'length' => 12032,
        'width' => 2340,
        'height' => 2590,
    ),
    'highCube' => array(
        'length' => 12032,
        'width' => 2340,
        'height' => 2590,
    ),
);
$default_container_tyre_reduction_cm = 12;
$default_container_fixed_freight_by_route = array(
    'hamburgMontevideo' => 4200,
    'darienGap' => 2200,
    'hamburgHalifax' => 3600,
);
$default_route_freight_multiplier = array(
    'hamburgMontevideo' => 1.18,
    'darienGap' => 1,
    'hamburgHalifax' => 1.08,
);
$default_route_handling_surcharge = array(
    'hamburgMontevideo' => 120,
    'darienGap' => 0,
    'hamburgHalifax' => 80,
);
$default_handling_fees_by_route = array(
    'hamburgMontevideo' => array('container' => 770, 'flatRack' => 1070, 'roro' => 620),
    'darienGap' => array('container' => 650, 'flatRack' => 950, 'roro' => 500),
    'hamburgHalifax' => array('container' => 730, 'flatRack' => 1030, 'roro' => 580),
);
$default_rate_per_m3_by_route = array(
    'hamburgMontevideo' => array('flatRack' => 171, 'roro' => 94),
    'darienGap' => array('flatRack' => 145, 'roro' => 80),
    'hamburgHalifax' => array('flatRack' => 156, 'roro' => 86),
);
$default_rate_per_length_meter_by_route = array(
    'hamburgMontevideo' => array('flatRack' => 354, 'roro' => 200),
    'darienGap' => array('flatRack' => 300, 'roro' => 170),
    'hamburgHalifax' => array('flatRack' => 324, 'roro' => 184),
);

$handling_fees = isset($attributes['handlingFees']) && is_array($attributes['handlingFees']) ? $attributes['handlingFees'] : array();
$rate_per_m3 = isset($attributes['ratePerM3']) && is_array($attributes['ratePerM3']) ? $attributes['ratePerM3'] : array();
$rate_per_length_meter = isset($attributes['ratePerLengthMeter']) && is_array($attributes['ratePerLengthMeter']) ? $attributes['ratePerLengthMeter'] : array();
$pricing_model = isset($attributes['pricingModelByShippingType']) && is_array($attributes['pricingModelByShippingType']) ? $attributes['pricingModelByShippingType'] : array();
$vehicle_surcharge = isset($attributes['vehicleSurcharge']) && is_array($attributes['vehicleSurcharge']) ? $attributes['vehicleSurcharge'] : array();
$container_dimensions = isset($attributes['containerDimensions']) && is_array($attributes['containerDimensions']) ? $attributes['containerDimensions'] : array();
$container_tyre_reduction_cm = isset($attributes['containerTyreReductionCm']) ? floatval($attributes['containerTyreReductionCm']) : $default_container_tyre_reduction_cm;
$container_fixed_freight_by_route = isset($attributes['containerFixedFreightByRoute']) && is_array($attributes['containerFixedFreightByRoute']) ? $attributes['containerFixedFreightByRoute'] : array();
$route_freight_multiplier = isset($attributes['routeFreightMultiplier']) && is_array($attributes['routeFreightMultiplier']) ? $attributes['routeFreightMultiplier'] : array();
$route_handling_surcharge = isset($attributes['routeHandlingSurcharge']) && is_array($attributes['routeHandlingSurcharge']) ? $attributes['routeHandlingSurcharge'] : array();
$handling_fees_by_route = isset($attributes['handlingFeesByRoute']) && is_array($attributes['handlingFeesByRoute']) ? $attributes['handlingFeesByRoute'] : array();
$rate_per_m3_by_route = isset($attributes['ratePerM3ByRoute']) && is_array($attributes['ratePerM3ByRoute']) ? $attributes['ratePerM3ByRoute'] : array();
$rate_per_length_meter_by_route = isset($attributes['ratePerLengthMeterByRoute']) && is_array($attributes['ratePerLengthMeterByRoute']) ? $attributes['ratePerLengthMeterByRoute'] : array();

$handling_fees = array(
    'container' => isset($handling_fees['container']) ? max(0, floatval($handling_fees['container'])) : $default_handling_fees['container'],
    'flatRack' => isset($handling_fees['flatRack']) ? max(0, floatval($handling_fees['flatRack'])) : $default_handling_fees['flatRack'],
    'roro' => isset($handling_fees['roro']) ? max(0, floatval($handling_fees['roro'])) : $default_handling_fees['roro'],
);
$rate_per_m3 = array(
    'container' => isset($rate_per_m3['container']) ? max(0, floatval($rate_per_m3['container'])) : $default_rate_per_m3['container'],
    'flatRack' => isset($rate_per_m3['flatRack']) ? max(0, floatval($rate_per_m3['flatRack'])) : $default_rate_per_m3['flatRack'],
    'roro' => isset($rate_per_m3['roro']) ? max(0, floatval($rate_per_m3['roro'])) : $default_rate_per_m3['roro'],
);
$rate_per_length_meter = array(
    'container' => isset($rate_per_length_meter['container']) ? max(0, floatval($rate_per_length_meter['container'])) : $default_rate_per_length_meter['container'],
    'flatRack' => isset($rate_per_length_meter['flatRack']) ? max(0, floatval($rate_per_length_meter['flatRack'])) : $default_rate_per_length_meter['flatRack'],
    'roro' => isset($rate_per_length_meter['roro']) ? max(0, floatval($rate_per_length_meter['roro'])) : $default_rate_per_length_meter['roro'],
);
$pricing_model = array(
    'container' => (isset($pricing_model['container']) && in_array($pricing_model['container'], array('volume', 'length'), true)) ? $pricing_model['container'] : $default_pricing_model['container'],
    'flatRack' => (isset($pricing_model['flatRack']) && in_array($pricing_model['flatRack'], array('volume', 'length'), true)) ? $pricing_model['flatRack'] : $default_pricing_model['flatRack'],
    'roro' => (isset($pricing_model['roro']) && in_array($pricing_model['roro'], array('volume', 'length'), true)) ? $pricing_model['roro'] : $default_pricing_model['roro'],
);
$vehicle_surcharge = array(
    'motorrad' => isset($vehicle_surcharge['motorrad']) ? max(0, floatval($vehicle_surcharge['motorrad'])) : $default_vehicle_surcharge['motorrad'],
    'van' => isset($vehicle_surcharge['van']) ? max(0, floatval($vehicle_surcharge['van'])) : $default_vehicle_surcharge['van'],
    'lkw' => isset($vehicle_surcharge['lkw']) ? max(0, floatval($vehicle_surcharge['lkw'])) : $default_vehicle_surcharge['lkw'],
);
$container_dimensions = array(
    'standard' => array(
        'length' => isset($container_dimensions['standard']['length']) ? max(1, floatval($container_dimensions['standard']['length'])) : $default_container_dimensions['standard']['length'],
        'width' => isset($container_dimensions['standard']['width']) ? max(1, floatval($container_dimensions['standard']['width'])) : $default_container_dimensions['standard']['width'],
        'height' => isset($container_dimensions['standard']['height']) ? max(1, floatval($container_dimensions['standard']['height'])) : $default_container_dimensions['standard']['height'],
    ),
    'highCube' => array(
        'length' => isset($container_dimensions['highCube']['length']) ? max(1, floatval($container_dimensions['highCube']['length'])) : $default_container_dimensions['highCube']['length'],
        'width' => isset($container_dimensions['highCube']['width']) ? max(1, floatval($container_dimensions['highCube']['width'])) : $default_container_dimensions['highCube']['width'],
        'height' => isset($container_dimensions['highCube']['height']) ? max(1, floatval($container_dimensions['highCube']['height'])) : $default_container_dimensions['highCube']['height'],
    ),
);
$container_tyre_reduction_cm = max(0, $container_tyre_reduction_cm);
$container_fixed_freight_by_route = array(
    'hamburgMontevideo' => isset($container_fixed_freight_by_route['hamburgMontevideo']) ? max(0, floatval($container_fixed_freight_by_route['hamburgMontevideo'])) : $default_container_fixed_freight_by_route['hamburgMontevideo'],
    'darienGap' => isset($container_fixed_freight_by_route['darienGap']) ? max(0, floatval($container_fixed_freight_by_route['darienGap'])) : $default_container_fixed_freight_by_route['darienGap'],
    'hamburgHalifax' => isset($container_fixed_freight_by_route['hamburgHalifax']) ? max(0, floatval($container_fixed_freight_by_route['hamburgHalifax'])) : $default_container_fixed_freight_by_route['hamburgHalifax'],
);
$route_freight_multiplier = array(
    'hamburgMontevideo' => isset($route_freight_multiplier['hamburgMontevideo']) ? max(0, floatval($route_freight_multiplier['hamburgMontevideo'])) : $default_route_freight_multiplier['hamburgMontevideo'],
    'darienGap' => isset($route_freight_multiplier['darienGap']) ? max(0, floatval($route_freight_multiplier['darienGap'])) : $default_route_freight_multiplier['darienGap'],
    'hamburgHalifax' => isset($route_freight_multiplier['hamburgHalifax']) ? max(0, floatval($route_freight_multiplier['hamburgHalifax'])) : $default_route_freight_multiplier['hamburgHalifax'],
);
$route_handling_surcharge = array(
    'hamburgMontevideo' => isset($route_handling_surcharge['hamburgMontevideo']) ? max(0, floatval($route_handling_surcharge['hamburgMontevideo'])) : $default_route_handling_surcharge['hamburgMontevideo'],
    'darienGap' => isset($route_handling_surcharge['darienGap']) ? max(0, floatval($route_handling_surcharge['darienGap'])) : $default_route_handling_surcharge['darienGap'],
    'hamburgHalifax' => isset($route_handling_surcharge['hamburgHalifax']) ? max(0, floatval($route_handling_surcharge['hamburgHalifax'])) : $default_route_handling_surcharge['hamburgHalifax'],
);
$handling_fees_by_route = array(
    'hamburgMontevideo' => array(
        'container' => isset($handling_fees_by_route['hamburgMontevideo']['container']) ? max(0, floatval($handling_fees_by_route['hamburgMontevideo']['container'])) : $default_handling_fees_by_route['hamburgMontevideo']['container'],
        'flatRack' => isset($handling_fees_by_route['hamburgMontevideo']['flatRack']) ? max(0, floatval($handling_fees_by_route['hamburgMontevideo']['flatRack'])) : $default_handling_fees_by_route['hamburgMontevideo']['flatRack'],
        'roro' => isset($handling_fees_by_route['hamburgMontevideo']['roro']) ? max(0, floatval($handling_fees_by_route['hamburgMontevideo']['roro'])) : $default_handling_fees_by_route['hamburgMontevideo']['roro'],
    ),
    'darienGap' => array(
        'container' => isset($handling_fees_by_route['darienGap']['container']) ? max(0, floatval($handling_fees_by_route['darienGap']['container'])) : $default_handling_fees_by_route['darienGap']['container'],
        'flatRack' => isset($handling_fees_by_route['darienGap']['flatRack']) ? max(0, floatval($handling_fees_by_route['darienGap']['flatRack'])) : $default_handling_fees_by_route['darienGap']['flatRack'],
        'roro' => isset($handling_fees_by_route['darienGap']['roro']) ? max(0, floatval($handling_fees_by_route['darienGap']['roro'])) : $default_handling_fees_by_route['darienGap']['roro'],
    ),
    'hamburgHalifax' => array(
        'container' => isset($handling_fees_by_route['hamburgHalifax']['container']) ? max(0, floatval($handling_fees_by_route['hamburgHalifax']['container'])) : $default_handling_fees_by_route['hamburgHalifax']['container'],
        'flatRack' => isset($handling_fees_by_route['hamburgHalifax']['flatRack']) ? max(0, floatval($handling_fees_by_route['hamburgHalifax']['flatRack'])) : $default_handling_fees_by_route['hamburgHalifax']['flatRack'],
        'roro' => isset($handling_fees_by_route['hamburgHalifax']['roro']) ? max(0, floatval($handling_fees_by_route['hamburgHalifax']['roro'])) : $default_handling_fees_by_route['hamburgHalifax']['roro'],
    ),
);
$rate_per_m3_by_route = array(
    'hamburgMontevideo' => array(
        'flatRack' => isset($rate_per_m3_by_route['hamburgMontevideo']['flatRack']) ? max(0, floatval($rate_per_m3_by_route['hamburgMontevideo']['flatRack'])) : $default_rate_per_m3_by_route['hamburgMontevideo']['flatRack'],
        'roro' => isset($rate_per_m3_by_route['hamburgMontevideo']['roro']) ? max(0, floatval($rate_per_m3_by_route['hamburgMontevideo']['roro'])) : $default_rate_per_m3_by_route['hamburgMontevideo']['roro'],
    ),
    'darienGap' => array(
        'flatRack' => isset($rate_per_m3_by_route['darienGap']['flatRack']) ? max(0, floatval($rate_per_m3_by_route['darienGap']['flatRack'])) : $default_rate_per_m3_by_route['darienGap']['flatRack'],
        'roro' => isset($rate_per_m3_by_route['darienGap']['roro']) ? max(0, floatval($rate_per_m3_by_route['darienGap']['roro'])) : $default_rate_per_m3_by_route['darienGap']['roro'],
    ),
    'hamburgHalifax' => array(
        'flatRack' => isset($rate_per_m3_by_route['hamburgHalifax']['flatRack']) ? max(0, floatval($rate_per_m3_by_route['hamburgHalifax']['flatRack'])) : $default_rate_per_m3_by_route['hamburgHalifax']['flatRack'],
        'roro' => isset($rate_per_m3_by_route['hamburgHalifax']['roro']) ? max(0, floatval($rate_per_m3_by_route['hamburgHalifax']['roro'])) : $default_rate_per_m3_by_route['hamburgHalifax']['roro'],
    ),
);
$rate_per_length_meter_by_route = array(
    'hamburgMontevideo' => array(
        'flatRack' => isset($rate_per_length_meter_by_route['hamburgMontevideo']['flatRack']) ? max(0, floatval($rate_per_length_meter_by_route['hamburgMontevideo']['flatRack'])) : $default_rate_per_length_meter_by_route['hamburgMontevideo']['flatRack'],
        'roro' => isset($rate_per_length_meter_by_route['hamburgMontevideo']['roro']) ? max(0, floatval($rate_per_length_meter_by_route['hamburgMontevideo']['roro'])) : $default_rate_per_length_meter_by_route['hamburgMontevideo']['roro'],
    ),
    'darienGap' => array(
        'flatRack' => isset($rate_per_length_meter_by_route['darienGap']['flatRack']) ? max(0, floatval($rate_per_length_meter_by_route['darienGap']['flatRack'])) : $default_rate_per_length_meter_by_route['darienGap']['flatRack'],
        'roro' => isset($rate_per_length_meter_by_route['darienGap']['roro']) ? max(0, floatval($rate_per_length_meter_by_route['darienGap']['roro'])) : $default_rate_per_length_meter_by_route['darienGap']['roro'],
    ),
    'hamburgHalifax' => array(
        'flatRack' => isset($rate_per_length_meter_by_route['hamburgHalifax']['flatRack']) ? max(0, floatval($rate_per_length_meter_by_route['hamburgHalifax']['flatRack'])) : $default_rate_per_length_meter_by_route['hamburgHalifax']['flatRack'],
        'roro' => isset($rate_per_length_meter_by_route['hamburgHalifax']['roro']) ? max(0, floatval($rate_per_length_meter_by_route['hamburgHalifax']['roro'])) : $default_rate_per_length_meter_by_route['hamburgHalifax']['roro'],
    ),
);
?>

<section
    id="<?php echo esc_attr($block_id); ?>"
    class="wp-block-rueckenwinde-verschiffungs-kostenrechner"
    data-handling-fees="<?php echo esc_attr(wp_json_encode($handling_fees)); ?>"
    data-rate-per-m3="<?php echo esc_attr(wp_json_encode($rate_per_m3)); ?>"
    data-rate-per-length-meter="<?php echo esc_attr(wp_json_encode($rate_per_length_meter)); ?>"
    data-pricing-model="<?php echo esc_attr(wp_json_encode($pricing_model)); ?>"
    data-vehicle-surcharge="<?php echo esc_attr(wp_json_encode($vehicle_surcharge)); ?>"
    data-container-dimensions="<?php echo esc_attr(wp_json_encode($container_dimensions)); ?>"
    data-container-tyre-reduction-cm="<?php echo esc_attr($container_tyre_reduction_cm); ?>"
    data-container-fixed-freight-by-route="<?php echo esc_attr(wp_json_encode($container_fixed_freight_by_route)); ?>"
    data-route-freight-multiplier="<?php echo esc_attr(wp_json_encode($route_freight_multiplier)); ?>"
    data-route-handling-surcharge="<?php echo esc_attr(wp_json_encode($route_handling_surcharge)); ?>"
    data-handling-fees-by-route="<?php echo esc_attr(wp_json_encode($handling_fees_by_route)); ?>"
    data-rate-per-m3-by-route="<?php echo esc_attr(wp_json_encode($rate_per_m3_by_route)); ?>"
    data-rate-per-length-meter-by-route="<?php echo esc_attr(wp_json_encode($rate_per_length_meter_by_route)); ?>"
    data-usd-to-eur="<?php echo esc_attr($currency_rate); ?>"
>
    <div class="shipping-costs">
        <header class="shipping-costs__header">
            <h2 class="shipping-costs__title"><?php echo esc_html($title); ?></h2>
            <p class="shipping-costs__subtitle"><?php echo esc_html($subtitle); ?></p>
        </header>

        <div class="shipping-costs__grid">
            <div class="shipping-costs__panel">
                <div class="shipping-costs__section">
                    <label class="shipping-costs__label" for="<?php echo esc_attr($block_id); ?>-route">Route</label>
                    <select id="<?php echo esc_attr($block_id); ?>-route" class="shipping-costs__select" data-role="route">
                        <option value="hamburgMontevideo">Verschiffung Hamburg / Montevideo</option>
                        <option value="darienGap">Verschiffung Darien Gap Panama / Kolumbien</option>
                        <option value="hamburgHalifax">Verschiffung Hamburg / Halifax</option>
                    </select>
                </div>

                <div class="shipping-costs__section">
                    <label class="shipping-costs__label" for="<?php echo esc_attr($block_id); ?>-vehicle">Fahrzeugtyp</label>
                    <select id="<?php echo esc_attr($block_id); ?>-vehicle" class="shipping-costs__select" data-role="vehicle-type">
                        <option value="van">Van</option>
                        <option value="lkw">LKW</option>
                        <option value="motorrad">Motorrad</option>
                    </select>
                </div>

                <div class="shipping-costs__section">
                    <div class="shipping-costs__label-row">
                        <label class="shipping-costs__label" for="<?php echo esc_attr($block_id); ?>-length">Laenge</label>
                        <span class="shipping-costs__value" data-role="length-value">520 cm</span>
                    </div>
                    <input id="<?php echo esc_attr($block_id); ?>-length" type="range" min="150" max="1300" step="10" value="520" data-role="length" />
                </div>

                <div class="shipping-costs__section">
                    <div class="shipping-costs__label-row">
                        <label class="shipping-costs__label" for="<?php echo esc_attr($block_id); ?>-width">Breite</label>
                        <span class="shipping-costs__value" data-role="width-value">210 cm</span>
                    </div>
                    <input id="<?php echo esc_attr($block_id); ?>-width" type="range" min="70" max="320" step="5" value="210" data-role="width" />
                </div>

                <div class="shipping-costs__section">
                    <div class="shipping-costs__label-row">
                        <label class="shipping-costs__label" for="<?php echo esc_attr($block_id); ?>-height">Hoehe</label>
                        <span class="shipping-costs__value" data-role="height-value">270 cm</span>
                    </div>
                    <input id="<?php echo esc_attr($block_id); ?>-height" type="range" min="80" max="450" step="5" value="270" data-role="height" />
                </div>

                <div class="shipping-costs__section">
                    <label class="shipping-costs__checkbox">
                        <input type="checkbox" data-role="container-tyres" />
                        <span>Containerreifen montiert (Hoehe -<?php echo esc_html(number_format_i18n($container_tyre_reduction_cm, 0)); ?> cm)</span>
                    </label>
                    <p class="shipping-costs__hint" data-role="effective-height">Effektive Hoehe fuer Container: 270 cm</p>
                </div>

                <fieldset class="shipping-costs__section shipping-costs__fieldset" aria-label="Versandart">
                    <legend class="shipping-costs__label">Versandart</legend>
                    <label class="shipping-costs__radio">
                        <input type="radio" name="<?php echo esc_attr($block_id); ?>-shipping-type" value="container" data-role="shipping-type" checked />
                        <span>Container</span>
                    </label>
                    <label class="shipping-costs__radio">
                        <input type="radio" name="<?php echo esc_attr($block_id); ?>-shipping-type" value="flatRack" data-role="shipping-type" />
                        <span>Flat Rack</span>
                    </label>
                    <label class="shipping-costs__radio">
                        <input type="radio" name="<?php echo esc_attr($block_id); ?>-shipping-type" value="roro" data-role="shipping-type" />
                        <span>RoRo</span>
                    </label>
                </fieldset>

                <div class="shipping-costs__section is-hidden" data-role="container-type-wrap">
                    <label class="shipping-costs__label" for="<?php echo esc_attr($block_id); ?>-container-type">Container-Typ</label>
                    <select id="<?php echo esc_attr($block_id); ?>-container-type" class="shipping-costs__select" data-role="container-type">
                        <option value="standard">Normaler Container</option>
                        <option value="highCube">High-Cube-Container</option>
                    </select>
                </div>
            </div>

            <aside class="shipping-costs__result" data-role="result-card">
                <p class="shipping-costs__meta">Geschaetzte Gesamtsumme</p>
                <p class="shipping-costs__usd" data-role="result-usd">USD 0</p>
                <p class="shipping-costs__eur" data-role="result-eur">EUR 0</p>
                <p class="shipping-costs__formula" data-role="result-formula"></p>
                <div class="shipping-costs__fit" data-role="container-fit">
                    <p class="shipping-costs__fit-line" data-role="fit-standard">Standard-Container: -</p>
                    <p class="shipping-costs__fit-line" data-role="fit-high-cube">High-Cube-Container: -</p>
                </div>
                <a class="shipping-costs__button" href="<?php echo esc_url($agent_list_url); ?>" target="_blank" rel="noopener" data-role="agent-link">
                    <?php echo esc_html($download_button_label); ?>
                </a>
            </aside>
        </div>
    </div>
</section>
