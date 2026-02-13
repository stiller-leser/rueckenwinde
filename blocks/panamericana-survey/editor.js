/**
 * Panamericana Survey Block - Editor
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;

    const DEFAULT_QUESTIONS = [
        'Kannst du gut damit umgehen, nicht zu wissen, was morgen passiert?',
        'Reizt dich der Weg mehr als das Ziel?',
        'Kommst du mit langen Phasen von Ruhe, Weite und wenig Input klar?',
        'Bist du bereit, Plaene spontan ueber Bord zu werfen?',
        'Kannst du mehrere Tage auf engem Raum leben?',
        'Ist Freistehen fuer dich wichtiger als Komfort?',
        'Stoert es dich nicht, wenn Infrastruktur fehlt (Duschen, Toiletten, WLAN)?',
        'Bist du bereit, dein Fahrzeug selbst zu pflegen und kleine Probleme zu loesen?',
        'Machst du auch lange Fahrten, ohne dass jeden Tag etwas \"passiert\"?',
        'Kommst du mit schlechten Strassen, Wind und Wetter klar?',
        'Faehrst du lieber langsam als moeglichst effizient?',
        'Hast du Geduld mit Buerokratie, Grenzen und Regeln?',
        'Kannst du akzeptieren, dass Dinge in anderen Laendern anders laufen?',
        'Ist Improvisation fuer dich kein Stress, sondern Teil des Abenteuers?',
        'Kannst du mit finanzieller Unsicherheit umgehen (Wechselkurse, Preise)?',
        'Bist du bereit, dein Sicherheitsgefuehl staendig neu anzupassen?'
    ];

    function ensure16Questions(items) {
        const source = Array.isArray(items) ? items.slice(0, 16) : [];
        while (source.length < 16) {
            source.push(DEFAULT_QUESTIONS[source.length]);
        }
        return source;
    }

    registerBlockType('rueckenwinde/panamericana-survey', {
        title: __('Panamericana Survey', 'rueckenwinde'),
        icon: 'forms',
        category: 'widgets',

        attributes: {
            heading: { type: 'string', default: 'Ist die Panamericana das Richtige fuer dich?' },
            intro: { type: 'string', default: 'Beantworte die 16 Fragen mit Ja oder Nein.' },
            questions: {
                type: 'array',
                default: DEFAULT_QUESTIONS
            },
            yesLabel: { type: 'string', default: 'Ja' },
            noLabel: { type: 'string', default: 'Nein' },
            submitLabel: { type: 'string', default: 'Ergebnis anzeigen' },
            incompleteMessage: { type: 'string', default: 'Bitte beantworte zuerst alle 16 Fragen.' },
            resultMostlyYes: { type: 'string', default: 'Die Panamericana ist ein Fit fuer dich.' },
            resultHalf: { type: 'string', default: 'Die Panamericana koennte fuer dich funktionieren.' },
            resultMostlyNo: { type: 'string', default: 'Die Panamericana ist wahrscheinlich nicht das richtige Abenteuer fuer dich.' }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const questions = ensure16Questions(attributes.questions);

            function updateQuestion(index, value) {
                const next = questions.slice();
                next[index] = value;
                setAttributes({ questions: next });
            }

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: __('Labels & Ergebnisse', 'rueckenwinde'), initialOpen: true },
                        el(TextControl, {
                            label: __('Antwort Label: Ja', 'rueckenwinde'),
                            value: attributes.yesLabel || 'Ja',
                            onChange: function (value) { setAttributes({ yesLabel: value }); }
                        }),
                        el(TextControl, {
                            label: __('Antwort Label: Nein', 'rueckenwinde'),
                            value: attributes.noLabel || 'Nein',
                            onChange: function (value) { setAttributes({ noLabel: value }); }
                        }),
                        el(TextControl, {
                            label: __('Button Text', 'rueckenwinde'),
                            value: attributes.submitLabel || '',
                            onChange: function (value) { setAttributes({ submitLabel: value }); }
                        }),
                        el(TextareaControl, {
                            label: __('Hinweis bei fehlenden Antworten', 'rueckenwinde'),
                            value: attributes.incompleteMessage || '',
                            onChange: function (value) { setAttributes({ incompleteMessage: value }); }
                        }),
                        el(TextareaControl, {
                            label: __('Ergebnis: Meist Ja', 'rueckenwinde'),
                            value: attributes.resultMostlyYes || '',
                            onChange: function (value) { setAttributes({ resultMostlyYes: value }); }
                        }),
                        el(TextareaControl, {
                            label: __('Ergebnis: 50/50', 'rueckenwinde'),
                            value: attributes.resultHalf || '',
                            onChange: function (value) { setAttributes({ resultHalf: value }); }
                        }),
                        el(TextareaControl, {
                            label: __('Ergebnis: Meist Nein', 'rueckenwinde'),
                            value: attributes.resultMostlyNo || '',
                            onChange: function (value) { setAttributes({ resultMostlyNo: value }); }
                        })
                    )
                ),
                el('div', { className: 'panamericana-survey-inline-editor' },
                    el(TextControl, {
                        label: __('Ueberschrift', 'rueckenwinde'),
                        value: attributes.heading || '',
                        onChange: function (value) { setAttributes({ heading: value }); }
                    }),
                    el(TextareaControl, {
                        label: __('Einleitung', 'rueckenwinde'),
                        value: attributes.intro || '',
                        onChange: function (value) { setAttributes({ intro: value }); }
                    }),
                    el('div', { className: 'panamericana-survey-inline-grid' },
                        questions.map(function (question, index) {
                            return el('div', { key: 'question-inline-' + index, className: 'panamericana-survey-inline-card' },
                                el(TextControl, {
                                    label: __('Frage', 'rueckenwinde') + ' ' + (index + 1),
                                    value: question || '',
                                    onChange: function (value) { updateQuestion(index, value); }
                                })
                            );
                        })
                    )
                ),
                el('p', { className: 'panamericana-survey-editor-note' }, __('Frontend-Vorschau im Editor deaktiviert (kein ServerSideRender). Speichern und im Frontend testen.', 'rueckenwinde')),
                el(
                    'div',
                    { className: 'panamericana-survey-editor-preview-placeholder' },
                    __('Die Fragen und Ergebnisse funktionieren weiterhin im Frontend wie gewohnt.', 'rueckenwinde')
                )
            );
        },

        save: function (props) {
            const { attributes } = props;
            const questions = ensure16Questions(attributes.questions);
            const blockProps = useBlockProps.save({
                className: 'wp-block-rueckenwinde-panamericana-survey'
            });
            const heading = attributes.heading || 'Ist die Panamericana das Richtige fuer dich?';
            const intro = attributes.intro || 'Beantworte die 16 Fragen mit Ja oder Nein.';
            const yesLabel = attributes.yesLabel || 'Ja';
            const noLabel = attributes.noLabel || 'Nein';
            const submitLabel = attributes.submitLabel || 'Ergebnis anzeigen';
            const incompleteMessage = attributes.incompleteMessage || 'Bitte beantworte zuerst alle 16 Fragen.';
            const resultMostlyYes = attributes.resultMostlyYes || 'Die Panamericana ist ein Fit fuer dich.';
            const resultHalf = attributes.resultHalf || 'Die Panamericana koennte fuer dich funktionieren.';
            const resultMostlyNo = attributes.resultMostlyNo || 'Die Panamericana ist wahrscheinlich nicht das richtige Abenteuer fuer dich.';

            return el(
                'div',
                Object.assign({}, blockProps, {
                    'data-total-questions': '16',
                    'data-incomplete-message': incompleteMessage,
                    'data-result-mostly-yes': resultMostlyYes,
                    'data-result-half': resultHalf,
                    'data-result-mostly-no': resultMostlyNo
                }),
                el('div', { className: 'panamericana-survey-container' },
                    el('h3', { className: 'panamericana-survey-heading' }, heading),
                    el('p', { className: 'panamericana-survey-intro' }, intro),
                    el('p', { className: 'panamericana-survey-progress', 'aria-live': 'polite' }),
                    el('div', { className: 'panamericana-survey-grid' },
                        questions.map(function (question, index) {
                            const questionName = 'panamericana-question-' + index;
                            return el('div', { key: 'card-' + index, className: 'panamericana-survey-card', 'data-question-index': String(index) },
                                el('p', { className: 'panamericana-survey-question-number' }, 'Frage ' + (index + 1)),
                                el('p', { className: 'panamericana-survey-question' }, question || ''),
                                el('fieldset', { className: 'panamericana-survey-options' },
                                    el('legend', { className: 'screen-reader-text' }, question || ''),
                                    el('label', { className: 'panamericana-survey-option' },
                                        el('input', { type: 'radio', name: questionName, value: 'yes' }),
                                        el('span', null, yesLabel)
                                    ),
                                    el('label', { className: 'panamericana-survey-option' },
                                        el('input', { type: 'radio', name: questionName, value: 'no' }),
                                        el('span', null, noLabel)
                                    )
                                )
                            );
                        })
                    ),
                    el('div', { className: 'panamericana-survey-actions' },
                        el('button', { type: 'button', className: 'panamericana-survey-prev' }, 'Zurueck'),
                        el('button', { type: 'button', className: 'panamericana-survey-next' }, 'Weiter'),
                        el('button', { type: 'button', className: 'panamericana-survey-submit' }, submitLabel)
                    ),
                    el('div', { className: 'panamericana-survey-result', hidden: true, 'aria-live': 'polite' },
                        el('p', { className: 'panamericana-survey-result-title' }),
                        el('p', { className: 'panamericana-survey-result-text' })
                    )
                )
            );
        }
    });
})(window.wp);
