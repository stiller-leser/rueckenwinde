(function () {
    function parseJsonAttr(blockEl, attrName) {
        const raw = blockEl.getAttribute(attrName) || '';
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

    function parseBorders(blockEl) {
        return parseJsonAttr(blockEl, 'data-borders');
    }

    function parseCountryRules(blockEl) {
        return parseJsonAttr(blockEl, 'data-country-rules');
    }

    function bestMatch(items, land, landKey) {
        let best = null;
        let bestScore = -1;

        items.forEach(function (item) {
            let score = 0;
            if ((item[landKey] || '').toLowerCase() === land.toLowerCase()) {
                score += 3;
            }
            if (score > bestScore) {
                best = item;
                bestScore = score;
            }
        });

        return best || items[0] || null;
    }

    function statusClassForText(value) {
        const text = (value || '').toLowerCase();
        if (text.indexOf('nicht nötig') !== -1 || text.indexOf('nicht erforderlich') !== -1 || text === 'nein') {
            return 'is-success';
        }
        if (text.indexOf('empfohlen') !== -1 || text === 'ja') {
            return 'is-warning';
        }
        return 'is-error';
    }

    function setStatus(node, text) {
        if (!node) {
            return;
        }
        node.textContent = text;
        node.classList.remove('is-success', 'is-warning', 'is-error');
        node.classList.add(statusClassForText(text));
    }

    function initSummary(blockEl, borders, countryRules) {
        const submit = blockEl.querySelector('.gec-submit');
        const land = blockEl.querySelector('.gec-reiseland');
        const summary = blockEl.querySelector('.gec-summary-module');
        const visum = blockEl.querySelector('.gec-visum');
        const tip = blockEl.querySelector('.gec-tip');
        const vers = blockEl.querySelector('.gec-versicherung');
        const aufenthalt = blockEl.querySelector('.gec-aufenthalt');

        if (!submit || !land || !summary || !visum || !tip || !vers || !aufenthalt) {
            return;
        }

        submit.addEventListener('click', function () {
            const hasRules = Array.isArray(countryRules) && countryRules.length > 0;
            const match = hasRules
                ? bestMatch(countryRules, land.value || '', 'land')
                : bestMatch(borders, land.value || '', 'zielland');

            if (!match) {
                return;
            }

            setStatus(visum, (match.visum || '-') + ' / ' + (match.visumTage || '-') + ' Tage');
            setStatus(tip, match.tip === 'Ja' ? 'Erforderlich' : 'Nicht erforderlich');
            setStatus(vers, match.versicherung || '-');
            setStatus(aufenthalt, (match.aufenthaltsdauer || '-') + ' Tage');
            summary.hidden = false;
        });
    }

    function initAccordion(blockEl) {
        const triggers = blockEl.querySelectorAll('.gec-accordion-trigger');
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                const item = trigger.closest('.gec-accordion-item');
                const panel = item ? item.querySelector('.gec-accordion-panel') : null;
                if (!item || !panel) {
                    return;
                }

                const expanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                item.classList.toggle('is-open', !expanded);
                panel.hidden = expanded;
            });
        });
    }

    function initBlock(blockEl) {
        const borders = parseBorders(blockEl);
        if (!borders.length) {
            return;
        }
        const countryRules = parseCountryRules(blockEl);
        initSummary(blockEl, borders, countryRules);
        initAccordion(blockEl);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-grenz-einreise-checker');
        blocks.forEach(initBlock);
    });
})();
