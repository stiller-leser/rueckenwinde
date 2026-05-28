(function () {
    function decodeBorders(blockEl) {
        const raw = blockEl.getAttribute('data-borders') || '';
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(decodeURIComponent(raw));
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function statusClassForVisum(visum) {
        return visum === 'Ja' ? 'is-yellow' : 'is-green';
    }

    function statusClassForTip(tip) {
        return tip === 'Ja' ? 'is-yellow' : 'is-green';
    }

    function statusClassForVersicherung(versicherung) {
        if (versicherung === 'Pflicht') {
            return 'is-red';
        }
        if (versicherung === 'Empfohlen') {
            return 'is-yellow';
        }
        return 'is-green';
    }

    function bestBorderMatch(borders, nationalitaet, reiseland, fahrzeugtyp) {
        let best = null;
        let bestScore = -1;

        borders.forEach(function (item) {
            let score = 0;
            if ((item.zielland || '').toLowerCase() === reiseland.toLowerCase()) {
                score += 3;
            }
            if ((item.nationalitaet || '').toLowerCase() === nationalitaet.toLowerCase()) {
                score += 2;
            }
            if ((item.fahrzeugtyp || '').toLowerCase() === fahrzeugtyp.toLowerCase()) {
                score += 1;
            }

            if (score > bestScore) {
                best = item;
                bestScore = score;
            }
        });

        return best || (borders[0] || null);
    }

    function setStatus($el, text, statusClass) {
        if (!$el) {
            return;
        }
        $el.textContent = text;
        $el.classList.remove('is-green', 'is-yellow', 'is-red');
        $el.classList.add(statusClass);
    }

    function initAccordion(blockEl) {
        const triggers = blockEl.querySelectorAll('.grenz-accordion-trigger');
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                const item = trigger.closest('.grenz-accordion-item');
                const panel = item ? item.querySelector('.grenz-accordion-panel') : null;
                if (!item || !panel) {
                    return;
                }

                const isOpen = item.classList.contains('is-open');
                item.classList.toggle('is-open', !isOpen);
                trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
                panel.hidden = isOpen;
            });
        });
    }

    function initSummary(blockEl, borders) {
        const submit = blockEl.querySelector('.grenz-checker-submit');
        const natSelect = blockEl.querySelector('.grenz-input-nationalitaet');
        const countrySelect = blockEl.querySelector('.grenz-input-reiseland');
        const vehicleInput = function () {
            return blockEl.querySelector('.grenz-input-fahrzeugtyp:checked');
        };

        const summary = blockEl.querySelector('.grenz-summary-card');
        const visumValue = blockEl.querySelector('.grenz-visum-value');
        const tipValue = blockEl.querySelector('.grenz-tip-value');
        const versValue = blockEl.querySelector('.grenz-versicherung-value');
        const aufenthaltValue = blockEl.querySelector('.grenz-aufenthalt-value');

        if (!submit || !natSelect || !countrySelect || !summary || !visumValue || !tipValue || !versValue || !aufenthaltValue) {
            return;
        }

        submit.addEventListener('click', function () {
            const vehicle = vehicleInput();
            const fahrzeugtyp = vehicle ? vehicle.value : 'Camper';
            const border = bestBorderMatch(borders, natSelect.value || '', countrySelect.value || '', fahrzeugtyp);

            if (!border) {
                return;
            }

            setStatus(
                visumValue,
                border.visum + ' - ' + (border.aufenthaltsdauer || '-') + ' Tage',
                statusClassForVisum(border.visum)
            );

            setStatus(
                tipValue,
                border.tip === 'Ja' ? 'Erforderlich' : 'Nicht erforderlich',
                statusClassForTip(border.tip)
            );

            setStatus(
                versValue,
                border.versicherung || '-',
                statusClassForVersicherung(border.versicherung)
            );

            setStatus(
                aufenthaltValue,
                (border.aufenthaltsdauer || '-') + ' Tage',
                'is-green'
            );

            summary.hidden = false;
        });
    }

    function initBlock(blockEl) {
        const borders = decodeBorders(blockEl);
        if (!borders.length) {
            return;
        }

        initAccordion(blockEl);
        initSummary(blockEl, borders);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-grenz-checker');
        blocks.forEach(initBlock);
    });
})();
