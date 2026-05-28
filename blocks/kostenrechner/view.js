(function () {
    const DEFAULT_BASISWERTE = { low: 400, mittel: 800, komfort: 1400 };
    const DEFAULT_FAHRZEUGKOSTEN = { klein: 300, van: 600, lkw: 1000 };
    const DEFAULT_VERSCHIFFUNG = { klein: 2000, van: 3500, lkw: 6000 };
    const DEFAULT_COST_DRIVER_TEXTS = {
        lkw: 'Treibstoff und Verschiffung',
        komfort: 'Lebenshaltung und Unterkunft',
        shortDuration: 'Verschiffung (kurze Reisedauer)',
        manyPeople: 'Lebenshaltung fuer mehrere Personen',
        van: 'Fahrzeugbetrieb und Wartung',
        default: 'Laufende Reiseausgaben'
    };

    function formatEuro(value) {
        return Math.round(value).toLocaleString('de-DE') + ' EUR';
    }

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

    function toCosts(source, fallback) {
        const safeSource = source && typeof source === 'object' ? source : {};
        return {
            low: Number.isFinite(Number(safeSource.low)) ? Number(safeSource.low) : fallback.low,
            mittel: Number.isFinite(Number(safeSource.mittel)) ? Number(safeSource.mittel) : fallback.mittel,
            komfort: Number.isFinite(Number(safeSource.komfort)) ? Number(safeSource.komfort) : fallback.komfort,
            klein: Number.isFinite(Number(safeSource.klein)) ? Number(safeSource.klein) : fallback.klein,
            van: Number.isFinite(Number(safeSource.van)) ? Number(safeSource.van) : fallback.van,
            lkw: Number.isFinite(Number(safeSource.lkw)) ? Number(safeSource.lkw) : fallback.lkw
        };
    }

    function toCostDriverTexts(source) {
        const safeSource = source && typeof source === 'object' ? source : {};
        return {
            lkw: typeof safeSource.lkw === 'string' && safeSource.lkw ? safeSource.lkw : DEFAULT_COST_DRIVER_TEXTS.lkw,
            komfort: typeof safeSource.komfort === 'string' && safeSource.komfort ? safeSource.komfort : DEFAULT_COST_DRIVER_TEXTS.komfort,
            shortDuration: typeof safeSource.shortDuration === 'string' && safeSource.shortDuration ? safeSource.shortDuration : DEFAULT_COST_DRIVER_TEXTS.shortDuration,
            manyPeople: typeof safeSource.manyPeople === 'string' && safeSource.manyPeople ? safeSource.manyPeople : DEFAULT_COST_DRIVER_TEXTS.manyPeople,
            van: typeof safeSource.van === 'string' && safeSource.van ? safeSource.van : DEFAULT_COST_DRIVER_TEXTS.van,
            default: typeof safeSource.default === 'string' && safeSource.default ? safeSource.default : DEFAULT_COST_DRIVER_TEXTS.default
        };
    }

    function getCostDriver(state, texts) {
        if (state.vehicle === 'lkw') {
            return texts.lkw;
        }
        if (state.style === 'komfort') {
            return texts.komfort;
        }
        if (state.duration <= 6) {
            return texts.shortDuration;
        }
        if (state.people >= 4) {
            return texts.manyPeople;
        }
        if (state.vehicle === 'van') {
            return texts.van;
        }
        return texts.default;
    }

    function setActiveOption(blockEl, group, value) {
        const buttons = blockEl.querySelectorAll('[data-group="' + group + '"] .kostenrechner__option');
        buttons.forEach(function (btn) {
            btn.classList.toggle('is-active', btn.dataset.value === value);
        });
    }

    function initBlock(blockEl) {
        const basiswerte = toCosts(
            parseJsonAttr(blockEl, 'data-style-costs'),
            { low: DEFAULT_BASISWERTE.low, mittel: DEFAULT_BASISWERTE.mittel, komfort: DEFAULT_BASISWERTE.komfort, klein: 0, van: 0, lkw: 0 }
        );
        const fahrzeugkosten = toCosts(
            parseJsonAttr(blockEl, 'data-vehicle-monthly-costs'),
            { low: 0, mittel: 0, komfort: 0, klein: DEFAULT_FAHRZEUGKOSTEN.klein, van: DEFAULT_FAHRZEUGKOSTEN.van, lkw: DEFAULT_FAHRZEUGKOSTEN.lkw }
        );
        const verschiffung = toCosts(
            parseJsonAttr(blockEl, 'data-shipping-costs'),
            { low: 0, mittel: 0, komfort: 0, klein: DEFAULT_VERSCHIFFUNG.klein, van: DEFAULT_VERSCHIFFUNG.van, lkw: DEFAULT_VERSCHIFFUNG.lkw }
        );
        const costDriverTexts = toCostDriverTexts(parseJsonAttr(blockEl, 'data-cost-driver-texts'));

        const state = {
            style: 'low',
            vehicle: 'klein',
            duration: 12,
            people: 2
        };

        const durationInput = blockEl.querySelector('[data-role="duration"]');
        const durationValue = blockEl.querySelector('[data-role="duration-value"]');
        const peopleValue = blockEl.querySelector('[data-role="people-value"]');
        const resultRange = blockEl.querySelector('[data-role="result-range"]');
        const resultDetail = blockEl.querySelector('[data-role="result-detail"]');
        const driverText = blockEl.querySelector('[data-role="driver-text"]');
        const decreaseBtn = blockEl.querySelector('[data-role="decrease"]');
        const increaseBtn = blockEl.querySelector('[data-role="increase"]');

        if (!durationInput || !durationValue || !peopleValue || !resultRange || !resultDetail || !driverText || !decreaseBtn || !increaseBtn) {
            return;
        }

        function updateResult() {
            const basis = basiswerte[state.style] * state.people;
            const fahrzeug = fahrzeugkosten[state.vehicle];
            const shipMonthly = verschiffung[state.vehicle] / state.duration;
            const totalMonthly = basis + fahrzeug + shipMonthly;
            const min = totalMonthly * 0.9;
            const max = totalMonthly * 1.1;

            resultRange.classList.add('is-updating');
            window.setTimeout(function () {
                resultRange.classList.remove('is-updating');
            }, 220);

            resultRange.textContent = formatEuro(min) + ' - ' + formatEuro(max);
            resultDetail.textContent = 'Rechnung: ((' + formatEuro(basiswerte[state.style]) + ' x ' + state.people + ') + ' + formatEuro(fahrzeug) + ') + (' + formatEuro(verschiffung[state.vehicle]) + ' / ' + state.duration + ') = ca. ' + formatEuro(totalMonthly) + ' / Monat';
            driverText.textContent = getCostDriver(state, costDriverTexts);
        }

        blockEl.querySelectorAll('[data-group="style"] .kostenrechner__option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.style = btn.dataset.value;
                setActiveOption(blockEl, 'style', state.style);
                updateResult();
            });
        });

        blockEl.querySelectorAll('[data-group="vehicle"] .kostenrechner__option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.vehicle = btn.dataset.value;
                setActiveOption(blockEl, 'vehicle', state.vehicle);
                updateResult();
            });
        });

        durationInput.addEventListener('input', function () {
            state.duration = Number(durationInput.value);
            durationValue.textContent = String(state.duration);
            updateResult();
        });

        decreaseBtn.addEventListener('click', function () {
            state.people = Math.max(1, state.people - 1);
            peopleValue.textContent = String(state.people);
            updateResult();
        });

        increaseBtn.addEventListener('click', function () {
            state.people = Math.min(5, state.people + 1);
            peopleValue.textContent = String(state.people);
            updateResult();
        });

        updateResult();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-kostenrechner');
        blocks.forEach(initBlock);
    });
})();
