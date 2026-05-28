(function () {
    function initBlock(blockEl) {
        const form = blockEl.querySelector('.email-lead-pdf__form');
        if (!form) {
            return;
        }

        const consent = form.querySelector('input[name="consent"]');
        const button = form.querySelector('.email-lead-pdf__button');
        if (!consent || !button) {
            return;
        }

        function syncState() {
            const allowed = !!consent.checked;
            button.disabled = !allowed;
            button.setAttribute('aria-disabled', allowed ? 'false' : 'true');
        }

        syncState();
        consent.addEventListener('change', syncState);
    }

    function initAll() {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-email-lead-pdf');
        blocks.forEach(initBlock);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
