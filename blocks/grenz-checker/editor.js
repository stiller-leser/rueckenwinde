(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps } = wp.blockEditor;
    const { TextControl, TextareaControl, SelectControl, Button } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;
    const { useEffect, useState } = wp.element;

    const VEHICLE_OPTIONS = ['Camper', 'PKW', 'Motorrad'];
    const YES_NO = ['Ja', 'Nein'];
    const INSURANCE_OPTIONS = ['Pflicht', 'Empfohlen', 'Nicht noetig'];

    const DEFAULT_BORDERS = [
        {
            id: 'mexiko-guatemala-la-mesilla',
            herkunftsland: 'Mexiko',
            zielland: 'Guatemala',
            grenzname: 'La Mesilla',
            flaggeHerkunft: '🇲🇽',
            flaggeZiel: '🇬🇹',
            nationalitaet: 'Deutschland',
            fahrzeugtyp: 'Camper',
            visum: 'Nein',
            aufenthaltsdauer: '90',
            verlaengerungMoeglich: 'Ja',
            tip: 'Ja',
            tipGueltigkeit: '90',
            tipKostenUsd: '20',
            dokumente: ['Reisepass', 'Fahrzeugschein', 'Fuehrerschein'],
            versicherung: 'Pflicht',
            versicherungPflicht: 'Ja',
            versicherungAbschluss: ['An der Grenze', 'Online'],
            durchschnittDauer: '1-3',
            wartezeitVariabel: 'Ja',
            erfahrungsbericht: 'Die Abwicklung war freundlich, aber mit Wartezeit am Mittag.',
            besonderheiten: ['Kopien vorher anfertigen', 'Bargeld in kleiner Stueckelung']
        },
        {
            id: 'guatemala-honduras-agua-caliente',
            herkunftsland: 'Guatemala',
            zielland: 'Honduras',
            grenzname: 'Agua Caliente',
            flaggeHerkunft: '🇬🇹',
            flaggeZiel: '🇭🇳',
            nationalitaet: 'Deutschland',
            fahrzeugtyp: 'Camper',
            visum: 'Nein',
            aufenthaltsdauer: '90',
            verlaengerungMoeglich: 'Nein',
            tip: 'Ja',
            tipGueltigkeit: '90',
            tipKostenUsd: '35',
            dokumente: ['Reisepass', 'Fahrzeugschein', 'Fuehrerschein'],
            versicherung: 'Pflicht',
            versicherungPflicht: 'Ja',
            versicherungAbschluss: ['An der Grenze'],
            durchschnittDauer: '2-4',
            wartezeitVariabel: 'Ja',
            erfahrungsbericht: 'Mehrere Schalter, aber insgesamt gut organisiert.',
            besonderheiten: ['Frueh ankommen', 'Stifte und Kopien mitnehmen']
        }
    ];

    function sanitizeId(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'grenze';
    }

    function linesToArray(value) {
        return (value || '').split(/\n+/).map(function (line) {
            return line.trim();
        }).filter(Boolean);
    }

    function arrayToLines(value) {
        return Array.isArray(value) ? value.join('\n') : '';
    }

    function normalizeYesNo(value, fallback) {
        return YES_NO.indexOf(value) !== -1 ? value : fallback;
    }

    function normalizeInsurance(value) {
        return INSURANCE_OPTIONS.indexOf(value) !== -1 ? value : 'Empfohlen';
    }

    function normalizeVehicle(value) {
        return VEHICLE_OPTIONS.indexOf(value) !== -1 ? value : 'Camper';
    }

    function normalizeBorder(border, index) {
        const safe = border && typeof border === 'object' ? border : {};
        const herkunftsland = typeof safe.herkunftsland === 'string' && safe.herkunftsland ? safe.herkunftsland : 'Land A';
        const zielland = typeof safe.zielland === 'string' && safe.zielland ? safe.zielland : 'Land B';
        const grenzname = typeof safe.grenzname === 'string' && safe.grenzname ? safe.grenzname : ('Grenze ' + (index + 1));
        const fallbackId = sanitizeId(herkunftsland + '-' + zielland + '-' + grenzname);

        return {
            id: typeof safe.id === 'string' && safe.id ? sanitizeId(safe.id) : fallbackId,
            herkunftsland: herkunftsland,
            zielland: zielland,
            grenzname: grenzname,
            flaggeHerkunft: typeof safe.flaggeHerkunft === 'string' && safe.flaggeHerkunft ? safe.flaggeHerkunft : '🏳️',
            flaggeZiel: typeof safe.flaggeZiel === 'string' && safe.flaggeZiel ? safe.flaggeZiel : '🏳️',
            nationalitaet: typeof safe.nationalitaet === 'string' && safe.nationalitaet ? safe.nationalitaet : 'Deutschland',
            fahrzeugtyp: normalizeVehicle(safe.fahrzeugtyp),
            visum: normalizeYesNo(safe.visum, 'Nein'),
            aufenthaltsdauer: typeof safe.aufenthaltsdauer === 'string' && safe.aufenthaltsdauer ? safe.aufenthaltsdauer : '90',
            verlaengerungMoeglich: normalizeYesNo(safe.verlaengerungMoeglich, 'Nein'),
            tip: normalizeYesNo(safe.tip, 'Ja'),
            tipGueltigkeit: typeof safe.tipGueltigkeit === 'string' && safe.tipGueltigkeit ? safe.tipGueltigkeit : '90',
            tipKostenUsd: typeof safe.tipKostenUsd === 'string' && safe.tipKostenUsd ? safe.tipKostenUsd : '0',
            dokumente: Array.isArray(safe.dokumente) && safe.dokumente.length ? safe.dokumente : ['Reisepass', 'Fahrzeugschein', 'Fuehrerschein'],
            versicherung: normalizeInsurance(safe.versicherung),
            versicherungPflicht: normalizeYesNo(safe.versicherungPflicht, 'Ja'),
            versicherungAbschluss: Array.isArray(safe.versicherungAbschluss) && safe.versicherungAbschluss.length ? safe.versicherungAbschluss : ['An der Grenze'],
            durchschnittDauer: typeof safe.durchschnittDauer === 'string' && safe.durchschnittDauer ? safe.durchschnittDauer : '1-3',
            wartezeitVariabel: normalizeYesNo(safe.wartezeitVariabel, 'Ja'),
            erfahrungsbericht: typeof safe.erfahrungsbericht === 'string' ? safe.erfahrungsbericht : '',
            besonderheiten: Array.isArray(safe.besonderheiten) ? safe.besonderheiten : []
        };
    }

    function normalizeBorders(borders) {
        const source = Array.isArray(borders) && borders.length ? borders : DEFAULT_BORDERS;
        return source.map(normalizeBorder);
    }

    registerBlockType('rueckenwinde/grenz-checker', {
        title: __('Grenz-Checker', 'rueckenwinde'),
        icon: 'location-alt',
        category: 'widgets',

        attributes: {
            checkerTitle: { type: 'string', default: 'Grenzanforderungen auf einen Blick' },
            routeTitle: { type: 'string', default: 'Grenzen auf unserer Route' },
            bordersData: { type: 'array', default: DEFAULT_BORDERS }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'grenz-checker-editor' });
            const borders = normalizeBorders(attributes.bordersData);
            const [activeId, setActiveId] = useState(borders[0] ? borders[0].id : '');

            useEffect(function () {
                if (!borders.length) {
                    return;
                }
                const found = borders.some(function (item) { return item.id === activeId; });
                if (!found) {
                    setActiveId(borders[0].id);
                }
            }, [borders, activeId]);

            const activeIndex = borders.findIndex(function (item) { return item.id === activeId; });
            const safeIndex = activeIndex === -1 ? 0 : activeIndex;
            const border = borders[safeIndex];

            function updateBorder(index, changes) {
                const next = borders.slice();
                next[index] = Object.assign({}, next[index], changes);
                setAttributes({ bordersData: next });
            }

            function addBorder() {
                const i = borders.length + 1;
                const fresh = normalizeBorder({
                    id: 'grenze-' + i,
                    herkunftsland: 'Land A',
                    zielland: 'Land B',
                    grenzname: 'Grenze ' + i,
                    flaggeHerkunft: '🏳️',
                    flaggeZiel: '🏳️',
                    besonderheiten: []
                }, i);
                const next = borders.concat([fresh]);
                setAttributes({ bordersData: next });
                setActiveId(fresh.id);
            }

            function removeBorder(index) {
                const next = borders.filter(function (_, i) { return i !== index; });
                setAttributes({ bordersData: next });
                if (next.length) {
                    setActiveId(next[Math.max(0, index - 1)].id);
                }
            }

            function moveBorder(from, to) {
                if (to < 0 || to >= borders.length || from === to) {
                    return;
                }
                const next = borders.slice();
                const moved = next.splice(from, 1)[0];
                next.splice(to, 0, moved);
                setAttributes({ bordersData: next });
                setActiveId(moved.id);
            }

            return el('section', blockProps,
                el('h3', null, 'Grenz-Checker (Editor)'),
                el(TextControl, {
                    label: 'Titel oberer Checker',
                    value: attributes.checkerTitle || '',
                    onChange: function (value) { setAttributes({ checkerTitle: value }); }
                }),
                el(TextControl, {
                    label: 'Titel Grenzliste',
                    value: attributes.routeTitle || '',
                    onChange: function (value) { setAttributes({ routeTitle: value }); }
                }),
                el('div', { className: 'grenz-editor-preview-note' },
                    'Frontend zeigt kompakten Checker + Zusammenfassung + Akkordeon. Hier bearbeitest du alle Grenzdaten.'
                ),
                border && el('div', { className: 'grenz-editor-card' },
                    el(SelectControl, {
                        label: 'Grenzuebergang bearbeiten',
                        value: border.id,
                        options: borders.map(function (item) {
                            return {
                                label: item.flaggeHerkunft + ' ' + item.herkunftsland + ' -> ' + item.flaggeZiel + ' ' + item.zielland + ' - ' + item.grenzname,
                                value: item.id
                            };
                        }),
                        onChange: function (value) { setActiveId(value); }
                    }),
                    el(TextControl, {
                        label: 'Herkunftsland',
                        value: border.herkunftsland,
                        onChange: function (value) {
                            const nextId = sanitizeId(value + '-' + border.zielland + '-' + border.grenzname);
                            updateBorder(safeIndex, { herkunftsland: value, id: nextId });
                            setActiveId(nextId);
                        }
                    }),
                    el(TextControl, {
                        label: 'Zielland',
                        value: border.zielland,
                        onChange: function (value) {
                            const nextId = sanitizeId(border.herkunftsland + '-' + value + '-' + border.grenzname);
                            updateBorder(safeIndex, { zielland: value, id: nextId });
                            setActiveId(nextId);
                        }
                    }),
                    el(TextControl, {
                        label: 'Grenzname',
                        value: border.grenzname,
                        onChange: function (value) {
                            const nextId = sanitizeId(border.herkunftsland + '-' + border.zielland + '-' + value);
                            updateBorder(safeIndex, { grenzname: value, id: nextId });
                            setActiveId(nextId);
                        }
                    }),
                    el(TextControl, {
                        label: 'Flagge Herkunft',
                        value: border.flaggeHerkunft,
                        onChange: function (value) { updateBorder(safeIndex, { flaggeHerkunft: value }); }
                    }),
                    el(TextControl, {
                        label: 'Flagge Ziel',
                        value: border.flaggeZiel,
                        onChange: function (value) { updateBorder(safeIndex, { flaggeZiel: value }); }
                    }),
                    el(TextControl, {
                        label: 'Nationalitaet',
                        value: border.nationalitaet,
                        onChange: function (value) { updateBorder(safeIndex, { nationalitaet: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Fahrzeugtyp',
                        value: border.fahrzeugtyp,
                        options: VEHICLE_OPTIONS.map(function (type) { return { label: type, value: type }; }),
                        onChange: function (value) { updateBorder(safeIndex, { fahrzeugtyp: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Visum',
                        value: border.visum,
                        options: YES_NO.map(function (v) { return { label: v, value: v }; }),
                        onChange: function (value) { updateBorder(safeIndex, { visum: value }); }
                    }),
                    el(TextControl, {
                        label: 'Aufenthaltsdauer (Tage)',
                        value: border.aufenthaltsdauer,
                        onChange: function (value) { updateBorder(safeIndex, { aufenthaltsdauer: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Verlaengerung moeglich',
                        value: border.verlaengerungMoeglich,
                        options: YES_NO.map(function (v) { return { label: v, value: v }; }),
                        onChange: function (value) { updateBorder(safeIndex, { verlaengerungMoeglich: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Temporaere Fahrzeugeinfuhr (TIP)',
                        value: border.tip,
                        options: YES_NO.map(function (v) { return { label: v, value: v }; }),
                        onChange: function (value) { updateBorder(safeIndex, { tip: value }); }
                    }),
                    el(TextControl, {
                        label: 'TIP Gueltigkeit (Tage)',
                        value: border.tipGueltigkeit,
                        onChange: function (value) { updateBorder(safeIndex, { tipGueltigkeit: value }); }
                    }),
                    el(TextControl, {
                        label: 'TIP Kosten (USD)',
                        value: border.tipKostenUsd,
                        onChange: function (value) { updateBorder(safeIndex, { tipKostenUsd: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Versicherung (Summary)',
                        value: border.versicherung,
                        options: INSURANCE_OPTIONS.map(function (v) { return { label: v, value: v }; }),
                        onChange: function (value) { updateBorder(safeIndex, { versicherung: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Versicherung Pflicht',
                        value: border.versicherungPflicht,
                        options: YES_NO.map(function (v) { return { label: v, value: v }; }),
                        onChange: function (value) { updateBorder(safeIndex, { versicherungPflicht: value }); }
                    }),
                    el(TextControl, {
                        label: 'Abschluss moeglich (eine Angabe pro Zeile)',
                        value: arrayToLines(border.versicherungAbschluss),
                        onChange: function (value) { updateBorder(safeIndex, { versicherungAbschluss: linesToArray(value) }); }
                    }),
                    el(TextControl, {
                        label: 'Durchschnittliche Dauer (Stunden, z. B. 1-3)',
                        value: border.durchschnittDauer,
                        onChange: function (value) { updateBorder(safeIndex, { durchschnittDauer: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Wartezeit variabel',
                        value: border.wartezeitVariabel,
                        options: YES_NO.map(function (v) { return { label: v, value: v }; }),
                        onChange: function (value) { updateBorder(safeIndex, { wartezeitVariabel: value }); }
                    }),
                    el(TextareaControl, {
                        label: 'Dokumente (eine Angabe pro Zeile)',
                        value: arrayToLines(border.dokumente),
                        onChange: function (value) { updateBorder(safeIndex, { dokumente: linesToArray(value) }); }
                    }),
                    el(TextareaControl, {
                        label: 'Unsere Erfahrung',
                        value: border.erfahrungsbericht,
                        onChange: function (value) { updateBorder(safeIndex, { erfahrungsbericht: value }); }
                    }),
                    el(TextareaControl, {
                        label: 'Besonderheiten & Tipps (eine Angabe pro Zeile)',
                        value: arrayToLines(border.besonderheiten),
                        onChange: function (value) { updateBorder(safeIndex, { besonderheiten: linesToArray(value) }); }
                    }),
                    el('div', { className: 'grenz-editor-actions' },
                        el(Button, { variant: 'secondary', onClick: function () { moveBorder(safeIndex, safeIndex - 1); }, disabled: safeIndex === 0 }, 'Nach oben'),
                        el(Button, { variant: 'secondary', onClick: function () { moveBorder(safeIndex, safeIndex + 1); }, disabled: safeIndex === borders.length - 1 }, 'Nach unten'),
                        el(Button, { variant: 'secondary', onClick: addBorder }, 'Neue Grenze'),
                        el(Button, { variant: 'secondary', isDestructive: true, onClick: function () { removeBorder(safeIndex); }, disabled: borders.length <= 1 }, 'Grenze loeschen')
                    )
                )
            );
        },

        save: function (props) {
            const attrs = props.attributes;
            const borders = normalizeBorders(attrs.bordersData);
            const blockProps = useBlockProps.save({
                className: 'wp-block-rueckenwinde-grenz-checker',
                'data-borders': encodeURIComponent(JSON.stringify(borders))
            });

            const nationalitaeten = [];
            const reiselaender = [];
            borders.forEach(function (item) {
                if (item.nationalitaet && nationalitaeten.indexOf(item.nationalitaet) === -1) {
                    nationalitaeten.push(item.nationalitaet);
                }
                if (item.zielland && reiselaender.indexOf(item.zielland) === -1) {
                    reiselaender.push(item.zielland);
                }
            });

            return el('section', blockProps,
                el('div', { className: 'grenz-checker-top' },
                    el('h3', { className: 'grenz-checker-title' }, attrs.checkerTitle || 'Grenzanforderungen auf einen Blick'),
                    el('div', { className: 'grenz-checker-form' },
                        el('label', { className: 'grenz-checker-field' },
                            el('span', null, 'Nationalitaet'),
                            el('select', { className: 'grenz-input-nationalitaet' },
                                nationalitaeten.map(function (item) {
                                    return el('option', { key: 'nat-' + item, value: item }, item);
                                })
                            )
                        ),
                        el('label', { className: 'grenz-checker-field' },
                            el('span', null, 'Reiseland'),
                            el('select', { className: 'grenz-input-reiseland' },
                                reiselaender.map(function (item) {
                                    return el('option', { key: 'land-' + item, value: item }, item);
                                })
                            )
                        ),
                        el('fieldset', { className: 'grenz-checker-vehicle', 'aria-label': 'Fahrzeugtyp' },
                            el('legend', null, 'Fahrzeugtyp'),
                            VEHICLE_OPTIONS.map(function (type, idx) {
                                const id = 'fahrzeug-' + type.toLowerCase();
                                return el('label', { key: 'veh-' + type, className: 'grenz-vehicle-option', htmlFor: id },
                                    el('input', {
                                        id: id,
                                        type: 'radio',
                                        name: 'grenz-fahrzeugtyp',
                                        value: type,
                                        defaultChecked: idx === 0,
                                        className: 'grenz-input-fahrzeugtyp'
                                    }),
                                    el('span', null, type)
                                );
                            })
                        ),
                        el('button', { type: 'button', className: 'grenz-checker-submit' }, 'Grenzanforderungen anzeigen')
                    ),
                    el('div', { className: 'grenz-summary-card', hidden: true, 'aria-live': 'polite' },
                        el('div', { className: 'grenz-summary-row' },
                            el('span', { className: 'grenz-summary-label' }, '🛂 Visum'),
                            el('span', { className: 'grenz-summary-value grenz-visum-value' })
                        ),
                        el('div', { className: 'grenz-summary-row' },
                            el('span', { className: 'grenz-summary-label' }, '🚐 Temporaere Fahrzeugeinfuhr (TIP)'),
                            el('span', { className: 'grenz-summary-value grenz-tip-value' })
                        ),
                        el('div', { className: 'grenz-summary-row' },
                            el('span', { className: 'grenz-summary-label' }, '🛡️ Versicherung'),
                            el('span', { className: 'grenz-summary-value grenz-versicherung-value' })
                        ),
                        el('div', { className: 'grenz-summary-row' },
                            el('span', { className: 'grenz-summary-label' }, '⏱️ Maximale Aufenthaltsdauer'),
                            el('span', { className: 'grenz-summary-value grenz-aufenthalt-value' })
                        )
                    )
                ),
                el('div', { className: 'grenz-route-section' },
                    el('h3', { className: 'grenz-route-title' }, attrs.routeTitle || 'Grenzen auf unserer Route'),
                    el('div', { className: 'grenz-accordion-list' },
                        borders.map(function (item, idx) {
                            const panelId = 'grenz-panel-' + idx;
                            return el('article', { key: item.id, className: 'grenz-accordion-item', 'data-border-id': item.id },
                                el('button', {
                                    type: 'button',
                                    className: 'grenz-accordion-trigger',
                                    'aria-expanded': 'false',
                                    'aria-controls': panelId
                                },
                                    el('span', { className: 'grenz-trigger-main' },
                                        item.flaggeHerkunft + ' ' + item.herkunftsland + ' → ' + item.flaggeZiel + ' ' + item.zielland
                                    ),
                                    el('span', { className: 'grenz-trigger-sub' }, item.grenzname)
                                ),
                                el('div', { id: panelId, className: 'grenz-accordion-panel', hidden: true },
                                    el('section', { className: 'grenz-detail-group' },
                                        el('h4', null, '🛂 Einreise (Person)'),
                                        el('p', null, 'Visum: ' + item.visum),
                                        el('p', null, 'Aufenthaltsdauer: ' + item.aufenthaltsdauer + ' Tage'),
                                        el('p', null, 'Verlaengerung moeglich: ' + item.verlaengerungMoeglich)
                                    ),
                                    el('section', { className: 'grenz-detail-group' },
                                        el('h4', null, '🚐 Fahrzeug & Zoll'),
                                        el('p', null, 'Temporaere Fahrzeugeinfuhr (TIP): ' + item.tip),
                                        el('p', null, 'Gueltigkeit: ' + item.tipGueltigkeit + ' Tage'),
                                        el('p', null, 'Kosten: ca. ' + item.tipKostenUsd + ' USD'),
                                        el('p', null, 'Benoetigte Dokumente:'),
                                        el('ul', null,
                                            (item.dokumente || []).map(function (doc, i) {
                                                return el('li', { key: item.id + '-doc-' + i }, doc);
                                            })
                                        )
                                    ),
                                    el('section', { className: 'grenz-detail-group' },
                                        el('h4', null, '🛡️ Versicherung'),
                                        el('p', null, 'Pflicht: ' + item.versicherungPflicht),
                                        el('p', null, 'Abschluss moeglich:'),
                                        el('ul', null,
                                            (item.versicherungAbschluss || []).map(function (entry, i) {
                                                return el('li', { key: item.id + '-vers-' + i }, entry);
                                            })
                                        )
                                    ),
                                    el('section', { className: 'grenz-detail-group' },
                                        el('h4', null, '⏱️ Ablauf & Dauer'),
                                        el('p', null, 'Durchschnittliche Dauer: ' + item.durchschnittDauer + ' Stunden'),
                                        el('p', null, 'Wartezeit variabel: ' + item.wartezeitVariabel)
                                    ),
                                    el('section', { className: 'grenz-detail-group' },
                                        el('h4', null, '💬 Unsere Erfahrung'),
                                        el('p', null, item.erfahrungsbericht || '-')
                                    ),
                                    el('section', { className: 'grenz-detail-group' },
                                        el('h4', null, '⚠️ Besonderheiten & Tipps'),
                                        el('ul', null,
                                            (item.besonderheiten || []).map(function (entry, i) {
                                                return el('li', { key: item.id + '-tip-' + i }, entry);
                                            })
                                        )
                                    )
                                )
                            );
                        })
                    )
                )
            );
        }
    });
})(window.wp);
