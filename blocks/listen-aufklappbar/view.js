(function () {
    function initBlock(blockEl) {
        const triggers = blockEl.querySelectorAll('.lac-trigger');
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                const item = trigger.closest('.lac-item');
                const panel = item ? item.querySelector('.lac-panel') : null;
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

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-listen-aufklappbar');
        blocks.forEach(initBlock);
    });
})();
