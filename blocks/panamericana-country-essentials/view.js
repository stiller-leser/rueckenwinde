(function () {
    const KEYS = ['insurance', 'sim', 'cash', 'spareParts', 'apps'];

    function parseCountries(blockEl) {
        const raw = blockEl.getAttribute('data-countries');
        if (!raw) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function setActiveButton(blockEl, index) {
        const buttons = blockEl.querySelectorAll('.pce-country-btn');
        buttons.forEach(function (btn) {
            const isActive = Number(btn.getAttribute('data-country-index')) === index;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    function updateCards(blockEl, country) {
        const grid = blockEl.querySelector('[data-role="essentials-grid"]');
        if (!grid || !country) {
            return;
        }

        grid.classList.remove('is-visible');
        grid.classList.add('is-transitioning');

        window.setTimeout(function () {
            KEYS.forEach(function (key) {
                const textField = blockEl.querySelector('[data-field="text-' + key + '"]');
                const tipField = blockEl.querySelector('[data-field="tip-' + key + '"]');

                if (textField) {
                    textField.textContent = country.essentials && country.essentials[key] ? country.essentials[key] : '-';
                }
                if (tipField) {
                    tipField.textContent = country.tips && country.tips[key] ? country.tips[key] : '';
                }
            });

            grid.classList.remove('is-transitioning');
            grid.classList.add('is-visible');
        }, 30);
    }

    function initBlock(blockEl) {
        const countries = parseCountries(blockEl);
        const selectEl = blockEl.querySelector('[data-role="country-select"]');
        const buttons = blockEl.querySelectorAll('.pce-country-btn');

        if (!countries.length) {
            return;
        }

        function selectCountry(index) {
            if (index < 0 || index >= countries.length) {
                return;
            }
            setActiveButton(blockEl, index);
            if (selectEl) {
                selectEl.value = String(index);
            }
            updateCards(blockEl, countries[index]);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                const index = Number(button.getAttribute('data-country-index'));
                selectCountry(index);
            });
        });

        if (selectEl) {
            selectEl.addEventListener('change', function () {
                selectCountry(Number(selectEl.value));
            });
        }

        selectCountry(0);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-panamericana-country-essentials');
        blocks.forEach(initBlock);
    });
})();
