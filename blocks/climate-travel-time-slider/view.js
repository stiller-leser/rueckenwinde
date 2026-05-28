(function () {
    const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
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

    const LEAFLET_ASSETS = {
        css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    };

    const AMERICAS_BOUNDS = {
        northLat: 83,
        southLat: -57,
        westLng: -179,
        eastLng: -26
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
            return 'Mittel';
        }
        return 'Nicht empfohlen';
    }

    function countryToLatLng(country) {
        const x = typeof country.x === 'number' ? country.x : 50;
        const y = typeof country.y === 'number' ? country.y : 50;
        const latSpan = AMERICAS_BOUNDS.northLat - AMERICAS_BOUNDS.southLat;
        const lngSpan = AMERICAS_BOUNDS.eastLng - AMERICAS_BOUNDS.westLng;

        return [
            AMERICAS_BOUNDS.northLat - (y / 100) * latSpan,
            AMERICAS_BOUNDS.westLng + (x / 100) * lngSpan
        ];
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizePopupLink(value) {
        const raw = typeof value === 'string' ? value.trim() : '';
        if (!raw) {
            return '';
        }
        return raw;
    }

    function popupHtml(country, state, selectedMonths) {
        const monthText = Array.from(selectedMonths).sort(function (a, b) {
            return a - b;
        }).map(function (idx) {
            return MONTHS[idx];
        }).join(', ');
        const link = normalizePopupLink(country.link);
        const linkRow = link
            ? '<div class="climate-popup-row"><a class="climate-popup-link" href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">Mehr Infos</a></div>'
            : '';

        return (
            '<div class="climate-popup">' +
                '<div class="climate-popup-title">' + country.name + '</div>' +
                '<div class="climate-popup-row"><strong>Monate:</strong> ' + monthText + '</div>' +
                '<div class="climate-popup-row"><strong>Strassenzustand:</strong> ' + ratingLabel(state) + '</div>' +
                '<div class="climate-popup-row"><strong>Strassenuebersicht:</strong> ' + country.summary + '</div>' +
                '<div class="climate-popup-row"><strong>Reisetipp:</strong> ' + country.tip + '</div>' +
                '<div class="climate-popup-row"><strong>Vanlife:</strong> ' + country.vanlife + '</div>' +
                linkRow +
            '</div>'
        );
    }

    function markerIcon(state, selected) {
        const selectedClass = selected ? 'is-selected' : 'is-muted';
        const html = '<span class="climate-leaflet-dot is-' + state + ' ' + selectedClass + '"></span>';

        return window.L.divIcon({
            className: 'climate-leaflet-marker',
            html: html,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -14]
        });
    }

    let leafletPromise;

    function loadLeaflet() {
        if (window.L && typeof window.L.map === 'function') {
            return Promise.resolve(window.L);
        }

        if (leafletPromise) {
            return leafletPromise;
        }

        leafletPromise = new Promise(function (resolve, reject) {
            const existingCss = document.querySelector('link[data-leaflet="climate-slider"]');
            if (!existingCss) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = LEAFLET_ASSETS.css;
                css.setAttribute('data-leaflet', 'climate-slider');
                document.head.appendChild(css);
            }

            const existingScript = document.querySelector('script[data-leaflet="climate-slider"]');
            if (existingScript) {
                existingScript.addEventListener('load', function () {
                    resolve(window.L);
                });
                existingScript.addEventListener('error', reject);
                return;
            }

            const script = document.createElement('script');
            script.src = LEAFLET_ASSETS.js;
            script.defer = true;
            script.setAttribute('data-leaflet', 'climate-slider');
            script.onload = function () {
                resolve(window.L);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });

        return leafletPromise;
    }

    function initBlock(blockEl, blockIndex) {
        const countries = parseCountries(blockEl);
        if (!countries.length) {
            return;
        }

        const mapEl = blockEl.querySelector('.climate-slider-map');
        let monthButtons = [];
        let monthGrid = blockEl.querySelector('.climate-month-grid');
        const controlsPanel = blockEl.querySelector('.climate-slider-controls');
        const countryCheckboxes = Array.prototype.slice.call(blockEl.querySelectorAll('.climate-country-checkbox'));
        const countryRows = Array.prototype.slice.call(blockEl.querySelectorAll('.climate-country-item'));
        const headingEl = blockEl.querySelector('.climate-slider-heading');
        const introEl = blockEl.querySelector('.climate-slider-intro');
        const controlTitles = blockEl.querySelectorAll('.climate-control-group h4');
        const legacyLegend = blockEl.querySelector('.climate-slider-legend');
        let monthSelectionTitle = controlTitles[0] && controlTitles[0].textContent
            ? controlTitles[0].textContent.trim()
            : 'Monat(e) wählen';

        const countriesById = {};
        countries.forEach(function (country) {
            countriesById[country.id] = country;
        });
        if (legacyLegend) {
            legacyLegend.remove();
        }

        if (headingEl && headingEl.textContent.trim() === 'Climate & Travel Time Slider') {
            headingEl.textContent = 'Klima- & Reisezeit-Slider';
        }
        if (introEl && introEl.textContent.trim() === 'Pick travel months and countries to compare road-focused travel conditions across the Panamericana.') {
            introEl.textContent = 'Wähle Reisemonate und Länder, um straßenbezogene Reisebedingungen entlang der Panamericana zu vergleichen.';
        }
        if (controlTitles[0]) {
            if (controlTitles[0].textContent.trim() === 'Select month(s)' || controlTitles[0].textContent.trim() === 'Monat(e) waehlen') {
                controlTitles[0].textContent = 'Monat(e) wählen';
            }
        }
        if (controlTitles[1]) {
            if (controlTitles[1].textContent.trim() === 'Select countries' || controlTitles[1].textContent.trim() === 'Laender waehlen') {
                controlTitles[1].textContent = 'Länder wählen';
            }
        }
        if (controlTitles[0] && controlTitles[0].textContent) {
            monthSelectionTitle = controlTitles[0].textContent.trim() || 'Monat(e) wählen';
        }

        const selectedMonths = new Set([new Date().getMonth()]);
        const defaultCountry = countries.find(function (country) {
            return (country.id || '').toLowerCase() === 'uruguay';
        }) || countries[0];
        const selectedCountries = new Set(defaultCountry ? [defaultCountry.id] : []);
        const storageKey = 'climate-slider-state::' + window.location.pathname + '::' + (blockEl.id || String(blockIndex));

        let leafletMap = null;
        const markersById = {};

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
                title.textContent = monthSelectionTitle;
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

        function syncMarkers() {
            Object.keys(markersById).forEach(function (id) {
                const marker = markersById[id];
                const country = countriesById[id];
                if (!marker || !country) {
                    return;
                }

                const score = avgScore(country);
                const state = ratingState(score);
                const selected = selectedCountries.has(id);

                marker.setIcon(markerIcon(state, selected));
                marker.setPopupContent(popupHtml(country, state, selectedMonths));

                if (selected) {
                    marker.openPopup();
                } else {
                    marker.closePopup();
                }
            });
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

            syncMarkers();
        }

        function initLeaflet() {
            if (!mapEl || !window.L || typeof window.L.map !== 'function') {
                return;
            }

            blockEl.classList.add('is-leaflet-ready');
            leafletMap = window.L.map(mapEl, {
                zoomControl: true,
                minZoom: 2,
                maxZoom: 7,
                worldCopyJump: false,
                scrollWheelZoom: false,
                dragging: true
            });

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leafletMap);

            leafletMap.fitBounds([
                [AMERICAS_BOUNDS.southLat, AMERICAS_BOUNDS.westLng],
                [AMERICAS_BOUNDS.northLat, AMERICAS_BOUNDS.eastLng]
            ], { padding: [24, 24] });

            countries.forEach(function (country) {
                const id = country.id;
                const latLng = countryToLatLng(country);
                const score = avgScore(country);
                const state = ratingState(score);
                const selected = selectedCountries.has(id);

                const marker = window.L.marker(latLng, {
                    icon: markerIcon(state, selected),
                    title: country.name
                }).addTo(leafletMap);

                marker.bindPopup(popupHtml(country, state, selectedMonths), {
                    autoClose: false,
                    closeOnClick: false,
                    offset: [0, -12]
                });

                marker.on('click', function () {
                    if (selectedCountries.has(id)) {
                        selectedCountries.delete(id);
                    } else {
                        selectedCountries.add(id);
                    }
                    saveState();
                    updateUI();
                });

                markersById[id] = marker;
            });

            setTimeout(function () {
                leafletMap.invalidateSize();
                syncMarkers();
            }, 0);
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
            });
        });

        restoreState();
        updateUI();

        loadLeaflet().then(function () {
            initLeaflet();
            updateUI();
        }).catch(function () {
            // Keep controls usable even when Leaflet fails to load.
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-climate-travel-time-slider');
        blocks.forEach(function (blockEl, index) {
            initBlock(blockEl, index);
        });
    });
})();
