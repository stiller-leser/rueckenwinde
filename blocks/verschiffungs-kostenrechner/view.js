(function () {
    const DEFAULT_HANDLING_FEES = { container: 650, flatRack: 950, roro: 500 };
    const DEFAULT_RATE_PER_M3 = { container: 110, flatRack: 145, roro: 80 };
    const DEFAULT_RATE_PER_LENGTH = { container: 230, flatRack: 300, roro: 170 };
    const DEFAULT_PRICING_MODEL = { container: 'volume', flatRack: 'length', roro: 'length' };
    const DEFAULT_VEHICLE_SURCHARGE = { motorrad: 0, van: 260, lkw: 640 };
    const DEFAULT_CONTAINER_DIMENSIONS = {
        standard: { length: 12032, width: 2340, height: 2590 },
        highCube: { length: 12032, width: 2340, height: 2590 }
    };
    const DEFAULT_TYRE_REDUCTION_CM = 12;
    const DEFAULT_CONTAINER_FIXED_FREIGHT_BY_ROUTE = {
        hamburgMontevideo: 4200,
        darienGap: 2200,
        hamburgHalifax: 3600
    };
    const DEFAULT_HANDLING_FEES_BY_ROUTE = {
        hamburgMontevideo: { container: 770, flatRack: 1070, roro: 620 },
        darienGap: { container: 650, flatRack: 950, roro: 500 },
        hamburgHalifax: { container: 730, flatRack: 1030, roro: 580 }
    };
    const DEFAULT_RATE_PER_M3_BY_ROUTE = {
        hamburgMontevideo: { flatRack: 171, roro: 94 },
        darienGap: { flatRack: 145, roro: 80 },
        hamburgHalifax: { flatRack: 156, roro: 86 }
    };
    const DEFAULT_RATE_PER_LENGTH_BY_ROUTE = {
        hamburgMontevideo: { flatRack: 354, roro: 200 },
        darienGap: { flatRack: 300, roro: 170 },
        hamburgHalifax: { flatRack: 324, roro: 184 }
    };
    const ROUTE_LABELS = {
        hamburgMontevideo: 'Hamburg / Montevideo',
        darienGap: 'Darien Gap Panama / Kolumbien',
        hamburgHalifax: 'Hamburg / Halifax'
    };
    const DEFAULT_USD_TO_EUR = 0.92;

    function parseJsonAttr(blockEl, attrName) {
        const raw = blockEl.getAttribute(attrName);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (err) {
            return null;
        }
    }

    function parseNumber(value, fallback) {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
    }

    function toFeeMap(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        return {
            container: parseNumber(safeSource.container, fallback.container),
            flatRack: parseNumber(safeSource.flatRack, fallback.flatRack),
            roro: parseNumber(safeSource.roro, fallback.roro)
        };
    }

    function toPricingModelMap(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        function validModel(value, fb) {
            return value === 'volume' || value === 'length' ? value : fb;
        }
        return {
            container: validModel(safeSource.container, fallback.container),
            flatRack: validModel(safeSource.flatRack, fallback.flatRack),
            roro: validModel(safeSource.roro, fallback.roro)
        };
    }

    function toContainerDimensions(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        const standard = safeSource.standard && typeof safeSource.standard === 'object' ? safeSource.standard : {};
        const highCube = safeSource.highCube && typeof safeSource.highCube === 'object' ? safeSource.highCube : {};
        return {
            standard: {
                length: parseNumber(standard.length, fallback.standard.length),
                width: parseNumber(standard.width, fallback.standard.width),
                height: parseNumber(standard.height, fallback.standard.height)
            },
            highCube: {
                length: parseNumber(highCube.length, fallback.highCube.length),
                width: parseNumber(highCube.width, fallback.highCube.width),
                height: parseNumber(highCube.height, fallback.highCube.height)
            }
        };
    }

    function toRouteMap(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        return {
            hamburgMontevideo: parseNumber(safeSource.hamburgMontevideo, fallback.hamburgMontevideo),
            darienGap: parseNumber(safeSource.darienGap, fallback.darienGap),
            hamburgHalifax: parseNumber(safeSource.hamburgHalifax, fallback.hamburgHalifax)
        };
    }

    function toRouteShippingMap(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        function row(routeKey, rowFallback) {
            const raw = safeSource[routeKey] && typeof safeSource[routeKey] === 'object' ? safeSource[routeKey] : {};
            return {
                container: parseNumber(raw.container, rowFallback.container),
                flatRack: parseNumber(raw.flatRack, rowFallback.flatRack),
                roro: parseNumber(raw.roro, rowFallback.roro)
            };
        }
        return {
            hamburgMontevideo: row('hamburgMontevideo', fallback.hamburgMontevideo),
            darienGap: row('darienGap', fallback.darienGap),
            hamburgHalifax: row('hamburgHalifax', fallback.hamburgHalifax)
        };
    }

    function toRouteShippingPartialMap(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        function row(routeKey, rowFallback) {
            const raw = safeSource[routeKey] && typeof safeSource[routeKey] === 'object' ? safeSource[routeKey] : {};
            return {
                flatRack: parseNumber(raw.flatRack, rowFallback.flatRack),
                roro: parseNumber(raw.roro, rowFallback.roro)
            };
        }
        return {
            hamburgMontevideo: row('hamburgMontevideo', fallback.hamburgMontevideo),
            darienGap: row('darienGap', fallback.darienGap),
            hamburgHalifax: row('hamburgHalifax', fallback.hamburgHalifax)
        };
    }

    function formatCurrency(value, currency) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(Math.round(value));
    }

    function evaluateFit(lengthCm, widthCm, effectiveHeightCm, dimensionLimit) {
        const reasons = [];
        if (lengthCm > dimensionLimit.length) {
            reasons.push('Laenge > ' + Math.round(dimensionLimit.length / 10) + ' cm');
        }
        if (widthCm > dimensionLimit.width) {
            reasons.push('Breite > ' + Math.round(dimensionLimit.width / 10) + ' cm');
        }
        if (effectiveHeightCm > dimensionLimit.height) {
            reasons.push('Hoehe > ' + Math.round(dimensionLimit.height / 10) + ' cm');
        }
        return { fits: reasons.length === 0, reasons: reasons };
    }

    function fitText(label, fitState) {
        if (fitState.fits) {
            return label + ': moeglich';
        }
        return label + ': nicht moeglich (' + fitState.reasons.join(', ') + ')';
    }

    function initBlock(blockEl) {
        const handlingFees = toFeeMap(parseJsonAttr(blockEl, 'data-handling-fees'), DEFAULT_HANDLING_FEES);
        const ratePerM3 = toFeeMap(parseJsonAttr(blockEl, 'data-rate-per-m3'), DEFAULT_RATE_PER_M3);
        const ratePerLength = toFeeMap(parseJsonAttr(blockEl, 'data-rate-per-length-meter'), DEFAULT_RATE_PER_LENGTH);
        const pricingModel = toPricingModelMap(parseJsonAttr(blockEl, 'data-pricing-model'), DEFAULT_PRICING_MODEL);
        const vehicleSurcharge = (function () {
            const data = parseJsonAttr(blockEl, 'data-vehicle-surcharge');
            const safeData = data && typeof data === 'object' ? data : {};
            return {
                motorrad: parseNumber(safeData.motorrad, DEFAULT_VEHICLE_SURCHARGE.motorrad),
                van: parseNumber(safeData.van, DEFAULT_VEHICLE_SURCHARGE.van),
                lkw: parseNumber(safeData.lkw, DEFAULT_VEHICLE_SURCHARGE.lkw)
            };
        })();

        const containerDimensions = toContainerDimensions(parseJsonAttr(blockEl, 'data-container-dimensions'), DEFAULT_CONTAINER_DIMENSIONS);
        const containerTyreReductionCm = parseNumber(blockEl.getAttribute('data-container-tyre-reduction-cm'), DEFAULT_TYRE_REDUCTION_CM);
        const usdToEur = parseNumber(blockEl.getAttribute('data-usd-to-eur'), DEFAULT_USD_TO_EUR);
        const containerFixedFreightByRoute = toRouteMap(parseJsonAttr(blockEl, 'data-container-fixed-freight-by-route'), DEFAULT_CONTAINER_FIXED_FREIGHT_BY_ROUTE);
        const handlingFeesByRoute = toRouteShippingMap(parseJsonAttr(blockEl, 'data-handling-fees-by-route'), DEFAULT_HANDLING_FEES_BY_ROUTE);
        const ratePerM3ByRoute = toRouteShippingPartialMap(parseJsonAttr(blockEl, 'data-rate-per-m3-by-route'), DEFAULT_RATE_PER_M3_BY_ROUTE);
        const ratePerLengthByRoute = toRouteShippingPartialMap(parseJsonAttr(blockEl, 'data-rate-per-length-meter-by-route'), DEFAULT_RATE_PER_LENGTH_BY_ROUTE);

        const routeInput = blockEl.querySelector('[data-role="route"]');
        const vehicleTypeInput = blockEl.querySelector('[data-role="vehicle-type"]');
        const lengthInput = blockEl.querySelector('[data-role="length"]');
        const widthInput = blockEl.querySelector('[data-role="width"]');
        const heightInput = blockEl.querySelector('[data-role="height"]');
        const containerTyresInput = blockEl.querySelector('[data-role="container-tyres"]');
        const shippingTypeInputs = blockEl.querySelectorAll('[data-role="shipping-type"]');
        const containerTypeWrap = blockEl.querySelector('[data-role="container-type-wrap"]');
        const containerTypeInput = blockEl.querySelector('[data-role="container-type"]');

        const lengthValueEl = blockEl.querySelector('[data-role="length-value"]');
        const widthValueEl = blockEl.querySelector('[data-role="width-value"]');
        const heightValueEl = blockEl.querySelector('[data-role="height-value"]');
        const effectiveHeightEl = blockEl.querySelector('[data-role="effective-height"]');

        const resultCardEl = blockEl.querySelector('[data-role="result-card"]');
        const resultUsdEl = blockEl.querySelector('[data-role="result-usd"]');
        const resultEurEl = blockEl.querySelector('[data-role="result-eur"]');
        const resultFormulaEl = blockEl.querySelector('[data-role="result-formula"]');
        const fitStandardEl = blockEl.querySelector('[data-role="fit-standard"]');
        const fitHighCubeEl = blockEl.querySelector('[data-role="fit-high-cube"]');

        if (!routeInput || !vehicleTypeInput || !lengthInput || !widthInput || !heightInput || !containerTyresInput || !containerTypeWrap || !containerTypeInput || !lengthValueEl || !widthValueEl || !heightValueEl || !effectiveHeightEl || !resultCardEl || !resultUsdEl || !resultEurEl || !resultFormulaEl || !fitStandardEl || !fitHighCubeEl) {
            return;
        }

        const defaultLengthMax = parseNumber(lengthInput.max, 1300);
        const defaultHeightMax = parseNumber(heightInput.max, 450);

        function getSelectedShippingType() {
            const selected = blockEl.querySelector('[data-role="shipping-type"]:checked');
            return selected ? selected.value : 'container';
        }

        function activeContainerKey() {
            return containerTypeInput.value === 'highCube' ? 'highCube' : 'standard';
        }

        function applyContainerLimits() {
            if (getSelectedShippingType() !== 'container') {
                containerTypeWrap.classList.add('is-hidden');
                lengthInput.max = String(defaultLengthMax);
                heightInput.max = String(defaultHeightMax);
                return;
            }

            containerTypeWrap.classList.remove('is-hidden');
            const dim = containerDimensions[activeContainerKey()];
            const maxLengthCm = Math.floor(dim.length / 10);
            const tyreBonusCm = containerTyresInput.checked ? containerTyreReductionCm : 0;
            const maxHeightCm = Math.floor(dim.height / 10) + Math.floor(tyreBonusCm);

            lengthInput.max = String(maxLengthCm);
            heightInput.max = String(maxHeightCm);

            if (parseNumber(lengthInput.value, 0) > maxLengthCm) {
                lengthInput.value = String(maxLengthCm);
            }
            if (parseNumber(heightInput.value, 0) > maxHeightCm) {
                heightInput.value = String(maxHeightCm);
            }
        }

        function getEffectiveHeightCm() {
            const baseHeight = parseNumber(heightInput.value, 0);
            if (!containerTyresInput.checked) {
                return baseHeight;
            }
            return Math.max(0, baseHeight - containerTyreReductionCm);
        }

        function getContainerFitState() {
            const lengthMm = parseNumber(lengthInput.value, 0) * 10;
            const widthMm = parseNumber(widthInput.value, 0) * 10;
            const effectiveHeightMm = getEffectiveHeightCm() * 10;
            return {
                standard: evaluateFit(lengthMm, widthMm, effectiveHeightMm, containerDimensions.standard),
                highCube: evaluateFit(lengthMm, widthMm, effectiveHeightMm, containerDimensions.highCube)
            };
        }

        function updateDimensionLabels() {
            const effectiveHeightCm = getEffectiveHeightCm();
            lengthValueEl.textContent = String(lengthInput.value) + ' cm';
            widthValueEl.textContent = String(widthInput.value) + ' cm';
            heightValueEl.textContent = String(heightInput.value) + ' cm';
            effectiveHeightEl.textContent = 'Effektive Hoehe fuer Container: ' + Math.round(effectiveHeightCm) + ' cm';
        }

        function calculateTotalUsd(containerFitState) {
            const lengthCm = parseNumber(lengthInput.value, 0);
            const widthCm = parseNumber(widthInput.value, 0);
            const heightCm = parseNumber(heightInput.value, 0);
            const shippingType = getSelectedShippingType();
            const vehicleType = vehicleTypeInput.value || 'van';
            const routeKey = routeInput.value || 'darienGap';
            const routeLabel = ROUTE_LABELS[routeKey] || ROUTE_LABELS.darienGap;

            const volumeM3 = (lengthCm * widthCm * heightCm) / 1000000;
            const lengthMeter = lengthCm / 100;

            const routeHandlingRow = handlingFeesByRoute[routeKey] || handlingFeesByRoute.darienGap;
            const handling = routeHandlingRow[shippingType] || 0;
            const surcharge = vehicleSurcharge[vehicleType] || 0;
            const model = pricingModel[shippingType] || 'volume';

            let freight = 0;
            let freightLabel = '';
            if (shippingType === 'container') {
                freight = containerFixedFreightByRoute[routeKey] || 0;
                freightLabel = 'Festpreis Route ' + routeLabel + ' (' + formatCurrency(freight, 'USD') + ')';
            } else if (model === 'length') {
                const routeRate = (ratePerLengthByRoute[routeKey] && ratePerLengthByRoute[routeKey][shippingType]) || (ratePerLength[shippingType] || 0);
                freight = lengthMeter * routeRate;
                freightLabel = lengthMeter.toFixed(2) + ' m x ' + formatCurrency(routeRate, 'USD');
            } else {
                const routeRate = (ratePerM3ByRoute[routeKey] && ratePerM3ByRoute[routeKey][shippingType]) || (ratePerM3[shippingType] || 0);
                freight = volumeM3 * routeRate;
                freightLabel = volumeM3.toFixed(2) + ' m3 x ' + formatCurrency(routeRate, 'USD');
            }

            const totalUsd = handling + surcharge + freight;
            const totalEur = totalUsd * usdToEur;

            let formula = 'Route ' + routeLabel + ': Handling ' + formatCurrency(handling, 'USD') + ' + Aufschlag ' + formatCurrency(surcharge, 'USD') + ' + Fracht (' + freightLabel + ')';
            if (shippingType === 'container' && !containerFitState.highCube.fits) {
                formula = 'Hinweis: Container aktuell nicht moeglich. ' + formula;
            }

            return { totalUsd: totalUsd, totalEur: totalEur, formula: formula };
        }

        function updateFitOutput(containerFitState) {
            fitStandardEl.textContent = fitText('Standard-Container', containerFitState.standard);
            fitHighCubeEl.textContent = fitText('High-Cube-Container', containerFitState.highCube);
            fitStandardEl.classList.toggle('is-ok', containerFitState.standard.fits);
            fitStandardEl.classList.toggle('is-bad', !containerFitState.standard.fits);
            fitHighCubeEl.classList.toggle('is-ok', containerFitState.highCube.fits);
            fitHighCubeEl.classList.toggle('is-bad', !containerFitState.highCube.fits);
        }

        function updateResult() {
            applyContainerLimits();
            updateDimensionLabels();
            const fitState = getContainerFitState();
            const result = calculateTotalUsd(fitState);

            updateFitOutput(fitState);
            resultCardEl.classList.toggle('is-container-not-possible', !fitState.highCube.fits);
            resultCardEl.classList.add('is-updating');
            window.setTimeout(function () {
                resultCardEl.classList.remove('is-updating');
            }, 200);

            resultUsdEl.textContent = formatCurrency(result.totalUsd, 'USD');
            resultEurEl.textContent = formatCurrency(result.totalEur, 'EUR');
            resultFormulaEl.textContent = result.formula;
        }

        [routeInput, lengthInput, widthInput, heightInput, vehicleTypeInput, containerTyresInput, containerTypeInput].forEach(function (inputEl) {
            inputEl.addEventListener('input', updateResult);
            inputEl.addEventListener('change', updateResult);
        });

        shippingTypeInputs.forEach(function (inputEl) {
            inputEl.addEventListener('change', updateResult);
        });

        [lengthInput, widthInput, heightInput].forEach(function (inputEl) {
            inputEl.addEventListener('pointerenter', function () {
                resultCardEl.classList.add('is-hovering');
            });
            inputEl.addEventListener('pointerleave', function () {
                resultCardEl.classList.remove('is-hovering');
            });
        });

        updateResult();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-verschiffungs-kostenrechner');
        blocks.forEach(initBlock);
    });
})();
