(function () {
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const POSITION_MIGRATION = {
        canada: { old: [47, 8], next: [27, 16] },
        usa: { old: [47, 15], next: [27, 24] },
        mexico: { old: [44, 24], next: [24, 33] },
        belize: { old: [48, 30], next: [25, 40] },
        guatemala: { old: [44, 31], next: [24, 41] },
        elsalvador: { old: [42, 33], next: [23, 42.5] },
        honduras: { old: [46, 33], next: [25.5, 41.5] },
        nicaragua: { old: [45, 36], next: [25.5, 44] },
        costarica: { old: [44, 39], next: [25.5, 46.5] },
        panama: { old: [47, 42], next: [27, 48.5] },
        colombia: { old: [50, 47], next: [30, 53] },
        ecuador: { old: [49, 53], next: [29, 58] },
        peru: { old: [51, 60], next: [31, 65] },
        bolivia: { old: [56, 67], next: [35, 70] },
        paraguay: { old: [60, 72], next: [37, 76] },
        brasil: { old: [66, 66], next: [41, 66] },
        chile: { old: [46, 74], next: [27, 75] },
        argentina: { old: [52, 82], next: [32, 82] },
        uruguay: { old: [58, 84], next: [36, 84] }
    };

    function parseCountries(blockEl) {
        const raw = blockEl.getAttribute('data-countries') || '';
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(decodeURIComponent(raw));
            return parsed.map(function (country) {
                const id = (country.id || '').toLowerCase();
                const migration = POSITION_MIGRATION[id];
                if (!migration) {
                    return country;
                }

                const x = typeof country.x === 'number' ? country.x : null;
                const y = typeof country.y === 'number' ? country.y : null;
                const matchesOld = x !== null && y !== null &&
                    Math.abs(x - migration.old[0]) < 0.01 &&
                    Math.abs(y - migration.old[1]) < 0.01;

                if (!matchesOld) {
                    return country;
                }

                return Object.assign({}, country, {
                    x: migration.next[0],
                    y: migration.next[1]
                });
            });
        } catch (err) {
            return [];
        }
    }

    function ratingState(score) {
        if (score >= 1.5) {
            return 'ideal';
        }
        if (score >= 0.75) {
            return 'moderate';
        }
        return 'poor';
    }

    function ratingLabel(state) {
        if (state === 'ideal') {
            return 'Ideal';
        }
        if (state === 'moderate') {
            return 'Moderate';
        }
        return 'Not recommended';
    }

    function initBlock(blockEl, blockIndex) {
        const countries = parseCountries(blockEl);
        if (!countries.length) {
            return;
        }

        const map = blockEl.querySelector('.climate-slider-map');
        const tooltip = blockEl.querySelector('.climate-slider-tooltip');
        let monthButtons = [];
        let monthGrid = blockEl.querySelector('.climate-month-grid');
        const controlsPanel = blockEl.querySelector('.climate-slider-controls');
        const countryCheckboxes = Array.prototype.slice.call(blockEl.querySelectorAll('.climate-country-checkbox'));
        const countryRows = Array.prototype.slice.call(blockEl.querySelectorAll('.climate-country-item'));
        const countryNodes = Array.prototype.slice.call(blockEl.querySelectorAll('.climate-country-node'));

        const countriesById = {};
        countries.forEach(function (country) {
            countriesById[country.id] = country;
        });

        const selectedMonths = new Set([new Date().getMonth()]);
        const defaultCountry = countries.find(function (country) {
            return (country.id || '').toLowerCase() === 'uruguay';
        }) || countries[0];
        const selectedCountries = new Set(defaultCountry ? [defaultCountry.id] : []);
        const storageKey = 'climate-slider-state::' + window.location.pathname + '::' + (blockEl.id || String(blockIndex));

        function saveState() {
            const payload = {
                months: Array.from(selectedMonths),
                countries: Array.from(selectedCountries)
            };
            try {
                window.localStorage.setItem(storageKey, JSON.stringify(payload));
            } catch (err) {
                // ignore storage errors
            }
        }

        function restoreState() {
            try {
                const raw = window.localStorage.getItem(storageKey);
                if (!raw) {
                    return;
                }
                const parsed = JSON.parse(raw);
                const validMonths = Array.isArray(parsed.months) ? parsed.months : [];
                const validCountries = Array.isArray(parsed.countries) ? parsed.countries : [];

                selectedMonths.clear();
                validMonths.forEach(function (m) {
                    const idx = parseInt(m, 10);
                    if (!Number.isNaN(idx) && idx >= 0 && idx < 12) {
                        selectedMonths.add(idx);
                    }
                });
                if (!selectedMonths.size) {
                    selectedMonths.add(new Date().getMonth());
                }

                selectedCountries.clear();
                validCountries.forEach(function (id) {
                    if (countriesById[id]) {
                        selectedCountries.add(id);
                    }
                });
                if (!selectedCountries.size && defaultCountry) {
                    selectedCountries.add(defaultCountry.id);
                }
            } catch (err) {
                // ignore malformed stored data
            }
        }

        function ensureMonthGrid() {
            if (monthGrid && monthGrid.isConnected) {
                return monthGrid;
            }

            if (!controlsPanel) {
                return null;
            }

            let monthGroup = controlsPanel.querySelector('.climate-control-group');
            if (!monthGroup) {
                monthGroup = document.createElement('div');
                monthGroup.className = 'climate-control-group';
                const title = document.createElement('h4');
                title.textContent = 'Select month(s)';
                monthGroup.appendChild(title);
                controlsPanel.insertBefore(monthGroup, controlsPanel.firstChild);
            }

            monthGrid = monthGroup.querySelector('.climate-month-grid');
            if (!monthGrid) {
                monthGrid = document.createElement('div');
                monthGrid.className = 'climate-month-grid';
                monthGroup.appendChild(monthGrid);
            }

            return monthGrid;
        }

        function buildMonthButtons() {
            const grid = ensureMonthGrid();
            if (!grid) {
                return;
            }

            grid.innerHTML = '';
            monthButtons = MONTHS.map(function (month, idx) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'climate-month-btn';
                btn.setAttribute('data-month-index', String(idx));
                btn.setAttribute('aria-pressed', 'false');
                btn.textContent = month;

                btn.addEventListener('click', function (evt) {
                    evt.preventDefault();
                    const monthIndex = parseInt(btn.getAttribute('data-month-index'), 10);
                    if (selectedMonths.has(monthIndex)) {
                    if (selectedMonths.size === 1) {
                        return;
                    }
                    selectedMonths.delete(monthIndex);
                } else {
                    selectedMonths.add(monthIndex);
                }
                saveState();
                updateUI();
                hideTooltip();
            });

                grid.appendChild(btn);
                return btn;
            });
        }

        function ensureMonthButtons() {
            const grid = ensureMonthGrid();
            if (!grid) {
                return;
            }

            const currentButtons = grid.querySelectorAll('.climate-month-btn');
            if (currentButtons.length !== 12) {
                buildMonthButtons();
                return;
            }

            const missingIndex = Array.prototype.some.call(currentButtons, function (btn, idx) {
                return btn.getAttribute('data-month-index') !== String(idx);
            });

            if (missingIndex) {
                buildMonthButtons();
                return;
            }

            monthButtons = Array.prototype.slice.call(currentButtons);
        }

        function avgScore(country) {
            const ratings = Array.isArray(country.ratings) ? country.ratings : [];
            const months = Array.from(selectedMonths);
            let sum = 0;
            let count = 0;

            months.forEach(function (m) {
                const value = parseInt(ratings[m], 10);
                if (!Number.isNaN(value)) {
                    sum += value;
                    count += 1;
                }
            });

            if (!count) {
                return 1;
            }
            return sum / count;
        }

        function setTooltip(country, state, x, y) {
            if (!tooltip) {
                return;
            }

            const monthText = Array.from(selectedMonths).sort().map(function (idx) {
                return MONTHS[idx];
            }).join(', ');

            tooltip.innerHTML =
                '<strong>' + country.name + '</strong><br>' +
                'Months: ' + monthText + '<br>' +
                'Road condition: <strong>' + ratingLabel(state) + '</strong><br>' +
                country.summary + '<br>' +
                'Tip: ' + country.tip + '<br>' +
                'Vanlife: ' + country.vanlife;
            tooltip.hidden = false;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        }

        function hideTooltip() {
            if (tooltip) {
                tooltip.hidden = true;
            }
        }

        function updateUI() {
            ensureMonthButtons();

            monthButtons.forEach(function (button) {
                const idx = parseInt(button.getAttribute('data-month-index'), 10);
                const active = selectedMonths.has(idx);
                button.classList.toggle('is-active', active);
                button.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            countryCheckboxes.forEach(function (checkbox) {
                const id = checkbox.getAttribute('data-country-id');
                checkbox.checked = selectedCountries.has(id);
            });

            countryRows.forEach(function (row) {
                const id = row.getAttribute('data-country-row');
                const country = countriesById[id];
                if (!country) {
                    return;
                }

                const score = avgScore(country);
                const state = ratingState(score);
                const stateEl = row.querySelector('.country-item-state');
                if (stateEl) {
                    stateEl.textContent = ratingLabel(state);
                    stateEl.classList.remove('is-ideal', 'is-moderate', 'is-poor');
                    stateEl.classList.add('is-' + state);
                }
            });

            countryNodes.forEach(function (node) {
                const id = node.getAttribute('data-country-id');
                const country = countriesById[id];
                if (!country) {
                    return;
                }

                const score = avgScore(country);
                const state = ratingState(score);
                const selected = selectedCountries.has(id);

                node.classList.remove('is-ideal', 'is-moderate', 'is-poor', 'is-selected', 'is-muted');
                node.classList.add('is-' + state);

                if (selected) {
                    node.classList.add('is-selected');
                } else {
                    node.classList.add('is-muted');
                }
            });
        }

        buildMonthButtons();

        countryCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                const id = checkbox.getAttribute('data-country-id');
                if (checkbox.checked) {
                    selectedCountries.add(id);
                } else {
                    selectedCountries.delete(id);
                }
                saveState();
                updateUI();
                hideTooltip();
            });
        });

        countryNodes.forEach(function (node) {
            function openFromNode() {
                const id = node.getAttribute('data-country-id');
                const country = countriesById[id];
                if (!country || !map) {
                    return;
                }

                if (selectedCountries.has(id)) {
                    selectedCountries.delete(id);
                } else {
                    selectedCountries.add(id);
                }

                saveState();
                const rect = map.getBoundingClientRect();
                const nodeRect = node.getBoundingClientRect();
                const score = avgScore(country);
                const state = ratingState(score);
                updateUI();
                setTooltip(country, state, nodeRect.left - rect.left + 12, nodeRect.top - rect.top - 12);
            }

            node.addEventListener('click', function (evt) {
                evt.preventDefault();
                openFromNode();
            });

            node.addEventListener('mouseenter', function () {
                const id = node.getAttribute('data-country-id');
                const country = countriesById[id];
                if (!country || !map) {
                    return;
                }

                const rect = map.getBoundingClientRect();
                const nodeRect = node.getBoundingClientRect();
                const score = avgScore(country);
                const state = ratingState(score);
                setTooltip(country, state, nodeRect.left - rect.left + 12, nodeRect.top - rect.top - 12);
            });

            node.addEventListener('mouseleave', hideTooltip);
            node.addEventListener('blur', hideTooltip);
        });

        blockEl.addEventListener('mouseleave', hideTooltip);

        // Keep DOM node positions synced with migrated coordinates.
        countryNodes.forEach(function (node) {
            const id = node.getAttribute('data-country-id');
            const country = countriesById[id];
            if (!country) {
                return;
            }
            node.style.left = country.x + '%';
            node.style.top = country.y + '%';
        });

        restoreState();
        updateUI();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-climate-travel-time-slider');
        blocks.forEach(function (blockEl, index) {
            initBlock(blockEl, index);
        });
    });
})();
