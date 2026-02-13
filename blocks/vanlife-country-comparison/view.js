(function () {
    function initBlock(blockEl) {
        const countryFilter = blockEl.querySelector('.vanlife-filter-country');
        const categoryFilter = blockEl.querySelector('.vanlife-filter-category');
        let toggleCountriesButton = blockEl.querySelector('.vanlife-toggle-countries');
        const header = blockEl.querySelector('.vanlife-comparison-header');
        const rows = Array.prototype.slice.call(blockEl.querySelectorAll('.vanlife-country-row'));
        const categoryColumns = Array.prototype.slice.call(blockEl.querySelectorAll('[data-category-col]'));
        const cells = Array.prototype.slice.call(blockEl.querySelectorAll('.vanlife-cell'));
        const defaultCountry = (blockEl.getAttribute('data-default-country') || 'uruguay').toLowerCase();
        const defaultCountryLabel = defaultCountry
            ? defaultCountry.replace(/\b\w/g, function (char) { return char.toUpperCase(); })
            : 'default country';
        let showAllCountries = false;

        if (!toggleCountriesButton && header) {
            toggleCountriesButton = document.createElement('button');
            toggleCountriesButton.type = 'button';
            toggleCountriesButton.className = 'vanlife-toggle-countries';
            toggleCountriesButton.setAttribute('aria-expanded', 'false');
            toggleCountriesButton.textContent = 'Alle Länder anzeigen';
            header.appendChild(toggleCountriesButton);
        }

        function applyFilters() {
            const countryValue = countryFilter ? countryFilter.value : 'all';
            const categoryValue = categoryFilter ? categoryFilter.value : 'all';

            rows.forEach(function (row) {
                const rowCountry = row.getAttribute('data-country');
                let matchCountry = countryValue === 'all' || rowCountry === countryValue;

                if (!showAllCountries && countryValue === 'all') {
                    matchCountry = rowCountry === defaultCountry;
                }

                row.hidden = !matchCountry;
            });

            categoryColumns.forEach(function (col) {
                const key = col.getAttribute('data-category-col');
                col.hidden = categoryValue !== 'all' && key !== categoryValue;
            });
        }

        function updateToggleButtonLabel() {
            if (!toggleCountriesButton) {
                return;
            }

            if (showAllCountries) {
                toggleCountriesButton.textContent = 'Nur ' + defaultCountryLabel + ' anzeigen';
                toggleCountriesButton.setAttribute('aria-expanded', 'trü');
            } else {
                toggleCountriesButton.textContent = 'Alle Länder anzeigen';
                toggleCountriesButton.setAttribute('aria-expanded', 'false');
            }
        }

        if (countryFilter) {
            countryFilter.addEventListener('change', applyFilters);
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyFilters);
        }

        if (toggleCountriesButton) {
            toggleCountriesButton.addEventListener('click', function () {
                showAllCountries = !showAllCountries;

                if (!showAllCountries && countryFilter) {
                    countryFilter.value = 'all';
                }

                updateToggleButtonLabel();
                applyFilters();
            });
        }

        cells.forEach(function (cell) {
            const trigger = cell.querySelector('.vanlife-cell-trigger');

            if (!trigger) {
                return;
            }

            trigger.addEventListener('click', function () {
                const isOpen = cell.classList.contains('is-open');
                cells.forEach(function (other) {
                    other.classList.remove('is-open');
                });

                if (!isOpen) {
                    cell.classList.add('is-open');
                }
            });
        });

        document.addEventListener('click', function (event) {
            if (!blockEl.contains(event.target)) {
                cells.forEach(function (cell) {
                    cell.classList.remove('is-open');
                });
            }
        });

        updateToggleButtonLabel();
        applyFilters();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-vanlife-country-comparison');
        blocks.forEach(initBlock);
    });
})();
