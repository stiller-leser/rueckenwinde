(function () {
    function normalizeFilter(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function applyFilter(blockEl, filterValue) {
        const cards = blockEl.querySelectorAll('.pannen-log__card');
        cards.forEach(function (card) {
            const category = normalizeFilter(card.getAttribute('data-category'));
            const show = filterValue === 'alle' || category === filterValue;
            card.classList.toggle('is-hidden', !show);
            if (!show) {
                card.classList.remove('is-revealed');
            }
        });
    }

    function initFilters(blockEl) {
        const chips = blockEl.querySelectorAll('.pannen-log__chip');
        if (!chips.length) {
            return;
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                const filterValue = normalizeFilter(chip.getAttribute('data-filter'));
                chips.forEach(function (item) {
                    item.classList.toggle('is-active', item === chip);
                });
                applyFilter(blockEl, filterValue || 'alle');
            });
        });
    }

    function initCardReveal(blockEl) {
        const cards = blockEl.querySelectorAll('.pannen-log__card');
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                card.classList.toggle('is-revealed');
            });

            card.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    card.classList.toggle('is-revealed');
                }
            });
        });
    }

    function initBlock(blockEl) {
        initFilters(blockEl);
        initCardReveal(blockEl);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-pannen-log');
        blocks.forEach(initBlock);
    });
})();
