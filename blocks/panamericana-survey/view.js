/**
 * Panamericana Survey Block - Frontend behavior
 */

(function () {
    function initSurveyBlock(blockEl) {
        const cards = Array.prototype.slice.call(blockEl.querySelectorAll('.panamericana-survey-card'));
        const progressEl = blockEl.querySelector('.panamericana-survey-progress');
        const prevButton = blockEl.querySelector('.panamericana-survey-prev');
        const nextButton = blockEl.querySelector('.panamericana-survey-next');
        const submitButton = blockEl.querySelector('.panamericana-survey-submit');
        const resultBox = blockEl.querySelector('.panamericana-survey-result');
        const resultTitle = blockEl.querySelector('.panamericana-survey-result-title');
        const resultText = blockEl.querySelector('.panamericana-survey-result-text');
        const totalQuestions = parseInt(blockEl.getAttribute('data-total-questions') || '16', 10);
        let currentIndex = 0;

        if (!cards.length || !progressEl || !prevButton || !nextButton || !submitButton || !resultBox || !resultTitle || !resultText) {
            return;
        }

        function getCheckedInput(card) {
            return card.querySelector('.panamericana-survey-options input[type="radio"]:checked');
        }

        function showIncompleteMessage() {
            resultTitle.textContent = 'Fast geschafft';
            resultText.textContent = blockEl.getAttribute('data-incomplete-message') || 'Bitte beantworte alle Fragen.';
            resultBox.hidden = false;
            resultBox.classList.remove('is-mostly-yes', 'is-half', 'is-mostly-no');
            resultBox.classList.add('is-incomplete');
        }

        function updateStepVisibility() {
            cards.forEach(function (card, index) {
                const isCurrent = index === currentIndex;
                card.hidden = !isCurrent;
                card.classList.toggle('is-active', isCurrent);
            });

            progressEl.textContent = 'Frage ' + (currentIndex + 1) + ' von ' + totalQuestions;

            prevButton.disabled = currentIndex === 0;
            const onLastQuestion = currentIndex === (totalQuestions - 1);
            nextButton.hidden = onLastQuestion;
            submitButton.hidden = !onLastQuestion;
            resultBox.hidden = true;
        }

        cards.forEach(function (card) {
            const radios = card.querySelectorAll('.panamericana-survey-options input[type="radio"]');
            radios.forEach(function (radio) {
                radio.addEventListener('change', function () {
                    resultBox.hidden = true;
                });
            });
        });

        prevButton.addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateStepVisibility();
            }
        });

        nextButton.addEventListener('click', function () {
            const checked = getCheckedInput(cards[currentIndex]);
            if (!checked) {
                showIncompleteMessage();
                return;
            }

            if (currentIndex < totalQuestions - 1) {
                currentIndex += 1;
                updateStepVisibility();
            }
        });

        submitButton.addEventListener('click', function () {
            const unansweredIndex = cards.findIndex(function (card) {
                return !getCheckedInput(card);
            });

            if (unansweredIndex !== -1) {
                currentIndex = unansweredIndex;
                updateStepVisibility();
                showIncompleteMessage();
                return;
            }

            const checkedInputs = blockEl.querySelectorAll('.panamericana-survey-options input[type="radio"]:checked');
            let yesCount = 0;
            checkedInputs.forEach(function (input) {
                if (input.value === 'yes') {
                    yesCount += 1;
                }
            });

            resultBox.classList.remove('is-incomplete', 'is-mostly-yes', 'is-half', 'is-mostly-no');

            if (yesCount > totalQuestions / 2) {
                resultTitle.textContent = 'Meistens Ja';
                resultText.textContent = blockEl.getAttribute('data-result-mostly-yes') || '';
                resultBox.classList.add('is-mostly-yes');
            } else if (yesCount === totalQuestions / 2) {
                resultTitle.textContent = '50 / 50';
                resultText.textContent = blockEl.getAttribute('data-result-half') || '';
                resultBox.classList.add('is-half');
            } else {
                resultTitle.textContent = 'Meistens Nein';
                resultText.textContent = blockEl.getAttribute('data-result-mostly-no') || '';
                resultBox.classList.add('is-mostly-no');
            }

            resultBox.hidden = false;
        });

        updateStepVisibility();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const blocks = document.querySelectorAll('.wp-block-rueckenwinde-panamericana-survey');
        blocks.forEach(initSurveyBlock);
    });
})();
