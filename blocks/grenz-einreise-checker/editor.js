(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps } = wp.blockEditor;
    const { Button, SelectControl, TextControl, TextareaControl } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;
    const { useEffect, useState } = wp.element;

    const VEHICLE_TYPE = 'Camper';
    const STATUS_OPTIONS = ['Ja', 'Nein'];
    const INSURANCE_OPTIONS = ['Pflicht', 'Empfohlen', 'Nicht nötig'];

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
            visumTage: '90',
            aufenthaltsdauer: '90',
            tip: 'Ja',
            versicherung: 'Pflicht',
            kosten: 'ca. 20 USD',
            einreisePerson: ['Visum: Nein', 'Aufenthaltsdauer: 90 Tage'],
            fahrzeugZoll: ['Temporäre Fahrzeugeinfuhr (TIP): Ja', 'Dokumente: Reisepass, Fahrzeugschein, Führerschein'],
            versicherungDetails: ['Pflicht: Ja', 'Abschluss: An der Grenze oder online'],
            ablaufDauer: ['Durchschnittliche Dauer: 1-3 Stunden', 'Wartezeit variabel: Ja'],
            erfahrungsbericht: 'Freundlicher Ablauf, mittags mehr Wartezeit.',
            besonderheiten: ['Bargeld in kleiner Stückelung mitnehmen', 'Kopien vorab vorbereiten']
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
            visumTage: '90',
            aufenthaltsdauer: '90',
            tip: 'Ja',
            versicherung: 'Pflicht',
            kosten: 'ca. 35 USD',
            einreisePerson: ['Visum: Nein', 'Aufenthaltsdauer: 90 Tage'],
            fahrzeugZoll: ['Temporäre Fahrzeugeinfuhr (TIP): Ja', 'Mehrere Schalter einplanen'],
            versicherungDetails: ['Pflicht: Ja', 'Abschluss: An der Grenze'],
            ablaufDauer: ['Durchschnittliche Dauer: 2-4 Stunden', 'Wartezeit variabel: Ja'],
            erfahrungsbericht: 'Gut organisiert, aber mit Laufwegen zwischen Schaltern.',
            besonderheiten: ['Früh starten', 'Öffnungszeiten vorab prüfen']
        }
    ];

    const DEFAULT_COUNTRY_RULES = [
        {
            id: 'rule-guatemala',
            land: 'Guatemala',
            nationalitaet: 'Deutschland',
            fahrzeugtyp: 'Camper',
            visum: 'Nein',
            visumTage: '90',
            aufenthaltsdauer: '90',
            tip: 'Ja',
            versicherung: 'Pflicht',
            kosten: 'ca. 20 USD'
        },
        {
            id: 'rule-honduras',
            land: 'Honduras',
            nationalitaet: 'Deutschland',
            fahrzeugtyp: 'Camper',
            visum: 'Nein',
            visumTage: '90',
            aufenthaltsdauer: '90',
            tip: 'Ja',
            versicherung: 'Pflicht',
            kosten: 'ca. 35 USD'
        }
    ];

    function sanitizeId(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'eintrag';
    }

    function linesToArray(value) {
        return (value || '').split(/\n+/).map(function (line) {
            return line.trim();
        }).filter(Boolean);
    }

    function arrayToLines(list) {
        return Array.isArray(list) ? list.join('\n') : '';
    }

    function inOptions(value, options, fallback) {
        return options.indexOf(value) !== -1 ? value : fallback;
    }

    function normalizeBorder(border, index) {
        const safe = border && typeof border === 'object' ? border : {};
        const herkunftsland = typeof safe.herkunftsland === 'string' && safe.herkunftsland ? safe.herkunftsland : 'Land A';
        const zielland = typeof safe.zielland === 'string' && safe.zielland ? safe.zielland : 'Land B';
        const grenzname = typeof safe.grenzname === 'string' && safe.grenzname ? safe.grenzname : ('Grenze ' + (index + 1));

        return {
            id: typeof safe.id === 'string' && safe.id ? safe.id : sanitizeId(herkunftsland + '-' + zielland + '-' + grenzname),
            herkunftsland: herkunftsland,
            zielland: zielland,
            grenzname: grenzname,
            flaggeHerkunft: typeof safe.flaggeHerkunft === 'string' && safe.flaggeHerkunft ? safe.flaggeHerkunft : '🏳️',
            flaggeZiel: typeof safe.flaggeZiel === 'string' && safe.flaggeZiel ? safe.flaggeZiel : '🏳️',
            nationalitaet: typeof safe.nationalitaet === 'string' && safe.nationalitaet ? safe.nationalitaet : 'Deutschland',
            fahrzeugtyp: typeof safe.fahrzeugtyp === 'string' && safe.fahrzeugtyp ? safe.fahrzeugtyp : VEHICLE_TYPE,
            visum: inOptions(safe.visum, STATUS_OPTIONS, 'Nein'),
            visumTage: typeof safe.visumTage === 'string' && safe.visumTage ? safe.visumTage : '90',
            aufenthaltsdauer: typeof safe.aufenthaltsdauer === 'string' && safe.aufenthaltsdauer ? safe.aufenthaltsdauer : '90',
            tip: inOptions(safe.tip, STATUS_OPTIONS, 'Ja'),
            versicherung: inOptions(safe.versicherung, INSURANCE_OPTIONS, 'Empfohlen'),
            kosten: typeof safe.kosten === 'string' ? safe.kosten : '',
            einreisePerson: Array.isArray(safe.einreisePerson) ? safe.einreisePerson : [],
            fahrzeugZoll: Array.isArray(safe.fahrzeugZoll) ? safe.fahrzeugZoll : [],
            versicherungDetails: Array.isArray(safe.versicherungDetails) ? safe.versicherungDetails : [],
            ablaufDauer: Array.isArray(safe.ablaufDauer) ? safe.ablaufDauer : [],
            erfahrungsbericht: typeof safe.erfahrungsbericht === 'string' ? safe.erfahrungsbericht : '',
            besonderheiten: Array.isArray(safe.besonderheiten) ? safe.besonderheiten : []
        };
    }

    function normalizeBorders(items) {
        const source = Array.isArray(items) && items.length ? items : DEFAULT_BORDERS;
        return source.map(normalizeBorder);
    }

    function normalizeCountryRule(rule, index) {
        const safe = rule && typeof rule === 'object' ? rule : {};
        const land = typeof safe.land === 'string' && safe.land ? safe.land : ('Land ' + (index + 1));
        return {
            id: typeof safe.id === 'string' && safe.id ? safe.id : sanitizeId('rule-' + land + '-' + index),
            land: land,
            nationalitaet: typeof safe.nationalitaet === 'string' && safe.nationalitaet ? safe.nationalitaet : 'Deutschland',
            fahrzeugtyp: typeof safe.fahrzeugtyp === 'string' && safe.fahrzeugtyp ? safe.fahrzeugtyp : VEHICLE_TYPE,
            visum: inOptions(safe.visum, STATUS_OPTIONS, 'Nein'),
            visumTage: typeof safe.visumTage === 'string' && safe.visumTage ? safe.visumTage : '90',
            aufenthaltsdauer: typeof safe.aufenthaltsdauer === 'string' && safe.aufenthaltsdauer ? safe.aufenthaltsdauer : '90',
            tip: inOptions(safe.tip, STATUS_OPTIONS, 'Ja'),
            versicherung: inOptions(safe.versicherung, INSURANCE_OPTIONS, 'Empfohlen'),
            kosten: typeof safe.kosten === 'string' ? safe.kosten : ''
        };
    }

    function normalizeCountryRules(items) {
        const source = Array.isArray(items) && items.length ? items : DEFAULT_COUNTRY_RULES;
        return source.map(normalizeCountryRule);
    }

    function renderSaveMarkup(attrs, itemElementTag, includeCountryRulesAttr, includeNationalityField, includeVehicleField) {
        const borders = normalizeBorders(attrs.bordersData);
        const countryRules = normalizeCountryRules(attrs.countryRules);
        const saveProps = {
            className: 'wp-block-rueckenwinde-grenz-einreise-checker',
            'data-borders': encodeURIComponent(JSON.stringify(borders))
        };
        if (includeCountryRulesAttr) {
            saveProps['data-country-rules'] = encodeURIComponent(JSON.stringify(countryRules));
        }
        const blockProps = useBlockProps.save(saveProps);

        const nats = [];
        const lands = [];
        if (includeCountryRulesAttr) {
            countryRules.forEach(function (item) {
                if (item.nationalitaet && nats.indexOf(item.nationalitaet) === -1) {
                    nats.push(item.nationalitaet);
                }
                if (item.land && lands.indexOf(item.land) === -1) {
                    lands.push(item.land);
                }
            });
        }
        if (!nats.length || !lands.length) {
            borders.forEach(function (item) {
                if (item.nationalitaet && nats.indexOf(item.nationalitaet) === -1) {
                    nats.push(item.nationalitaet);
                }
                if (item.zielland && lands.indexOf(item.zielland) === -1) {
                    lands.push(item.zielland);
                }
            });
        }

        return el('section', blockProps,
            el('div', { className: 'gec-input-module' },
                el('h3', { className: 'gec-title' }, attrs.checkerTitle || 'Grenz- & Einreise-Checker'),
                el('div', { className: 'gec-input-grid' },
                    includeNationalityField && el('label', { className: 'gec-field' },
                        el('span', null, 'Nationalität'),
                        el('select', { className: 'gec-nationalitaet' },
                            nats.map(function (value) {
                                return el('option', { key: 'nat-' + value, value: value }, value);
                            })
                        )
                    ),
                    el('label', { className: 'gec-field' },
                        el('span', null, 'Reiseland'),
                        el('select', { className: 'gec-reiseland' },
                            lands.map(function (value) {
                                return el('option', { key: 'land-' + value, value: value }, value);
                            })
                        )
                    ),
                    includeVehicleField && el('fieldset', { className: 'gec-field gec-vehicle', 'aria-label': 'Fahrzeugtyp' },
                        el('legend', null, 'Fahrzeugtyp'),
                        ['Camper', 'PKW', 'Motorrad'].map(function (item, idx) {
                            const id = 'gec-veh-' + item.toLowerCase();
                            return el('label', { key: 'veh-' + item, htmlFor: id },
                                el('input', {
                                    id: id,
                                    className: 'gec-fahrzeugtyp',
                                    type: 'radio',
                                    name: 'gec-fahrzeugtyp',
                                    value: item,
                                    defaultChecked: idx === 0
                                }),
                                el('span', null, item)
                            );
                        })
                    ),
                    el('button', { type: 'button', className: 'gec-submit' }, 'Grenzanforderungen anzeigen')
                )
            ),
            el('div', { className: 'gec-summary-module', hidden: true, 'aria-live': 'polite' },
                el('div', { className: 'gec-summary-item' },
                    el('span', { className: 'gec-summary-label' }, '🛂 Visum'),
                    el('span', { className: 'gec-summary-value gec-visum' })
                ),
                el('div', { className: 'gec-summary-item' },
                    el('span', { className: 'gec-summary-label' }, '🚐 Temporäre Fahrzeugeinfuhr (TIP)'),
                    el('span', { className: 'gec-summary-value gec-tip' })
                ),
                el('div', { className: 'gec-summary-item' },
                    el('span', { className: 'gec-summary-label' }, '🛡️ Versicherung'),
                    el('span', { className: 'gec-summary-value gec-versicherung' })
                ),
                el('div', { className: 'gec-summary-item' },
                    el('span', { className: 'gec-summary-label' }, '⏱️ Maximale Aufenthaltsdauer'),
                    el('span', { className: 'gec-summary-value gec-aufenthalt' })
                )
            ),
            el('section', { className: 'gec-border-list-module' },
                el('h3', { className: 'gec-route-title' }, attrs.routeTitle || 'Grenzen auf unserer Route'),
                el('div', { className: 'gec-accordion' },
                    borders.map(function (item, index) {
                        const panelId = 'gec-panel-' + index;
                        return el(itemElementTag, { key: item.id, className: 'gec-accordion-item', 'data-border-id': item.id },
                            el('button', {
                                type: 'button',
                                className: 'gec-accordion-trigger',
                                'aria-expanded': 'false',
                                'aria-controls': panelId
                            },
                                el('span', { className: 'gec-trigger-route' }, item.flaggeHerkunft + ' ' + item.herkunftsland + ' → ' + item.flaggeZiel + ' ' + item.zielland),
                                el('span', { className: 'gec-trigger-name' }, item.grenzname)
                            ),
                            el('div', { id: panelId, className: 'gec-accordion-panel', hidden: true },
                                el('section', { className: 'gec-detail-section' },
                                    el('h4', null, 'Einreise (Person)'),
                                    el('ul', null, (item.einreisePerson || []).map(function (line, i) {
                                        return el('li', { key: item.id + '-ein-' + i }, line);
                                    }))
                                ),
                                el('section', { className: 'gec-detail-section' },
                                    el('h4', null, 'Fahrzeug & Zoll'),
                                    el('ul', null, (item.fahrzeugZoll || []).map(function (line, i) {
                                        return el('li', { key: item.id + '-fz-' + i }, line);
                                    }))
                                ),
                                el('section', { className: 'gec-detail-section' },
                                    el('h4', null, 'Versicherung'),
                                    el('ul', null, (item.versicherungDetails || []).map(function (line, i) {
                                        return el('li', { key: item.id + '-ver-' + i }, line);
                                    }))
                                ),
                                el('section', { className: 'gec-detail-section' },
                                    el('h4', null, 'Ablauf & Dauer'),
                                    el('ul', null, (item.ablaufDauer || []).map(function (line, i) {
                                        return el('li', { key: item.id + '-abl-' + i }, line);
                                    }))
                                ),
                                el('section', { className: 'gec-detail-section' },
                                    el('h4', null, 'Unsere Erfahrung'),
                                    el('ul', null,
                                        el('li', null, item.erfahrungsbericht || '-')
                                    )
                                ),
                                el('section', { className: 'gec-detail-section' },
                                    el('h4', null, 'Besonderheiten & Tipps'),
                                    el('ul', null, (item.besonderheiten || []).map(function (line, i) {
                                        return el('li', { key: item.id + '-tip-' + i }, line);
                                    }))
                                )
                            )
                        );
                    })
                )
            )
        );
    }

    registerBlockType('rueckenwinde/grenz-einreise-checker', {
        title: __('Grenz- & Einreise-Checker', 'rueckenwinde'),
        icon: 'location-alt',
        category: 'widgets',

        attributes: {
            checkerTitle: { type: 'string', default: 'Grenz- & Einreise-Checker' },
            routeTitle: { type: 'string', default: 'Grenzen auf unserer Route' },
            bordersData: { type: 'array', default: DEFAULT_BORDERS },
            countryRules: { type: 'array', default: DEFAULT_COUNTRY_RULES }
        },

        edit: function (props) {
            const { attributes, setAttributes, isSelected } = props;
            const blockProps = useBlockProps({ className: 'grenz-einreise-editor' });
            const borders = normalizeBorders(attributes.bordersData);
            const countryRules = normalizeCountryRules(attributes.countryRules);
            const [activeId, setActiveId] = useState(borders[0] ? borders[0].id : '');
            const [activeRuleId, setActiveRuleId] = useState(countryRules[0] ? countryRules[0].id : '');

            useEffect(function () {
                if (!borders.length) {
                    return;
                }
                const exists = borders.some(function (item) { return item.id === activeId; });
                if (!exists) {
                    setActiveId(borders[0].id);
                }
            }, [borders, activeId]);

            useEffect(function () {
                if (!countryRules.length) {
                    return;
                }
                const exists = countryRules.some(function (item) { return item.id === activeRuleId; });
                if (!exists) {
                    setActiveRuleId(countryRules[0].id);
                }
            }, [countryRules, activeRuleId]);

            const idx = borders.findIndex(function (item) { return item.id === activeId; });
            const safeIdx = idx === -1 ? 0 : idx;
            const border = borders[safeIdx];

            const ruleIdx = countryRules.findIndex(function (item) { return item.id === activeRuleId; });
            const safeRuleIdx = ruleIdx === -1 ? 0 : ruleIdx;
            const rule = countryRules[safeRuleIdx];

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
                    flaggeZiel: '🏳️'
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

            function updateRule(index, changes) {
                const next = countryRules.slice();
                next[index] = Object.assign({}, next[index], changes);
                setAttributes({ countryRules: next });
            }

            function addRule() {
                const i = countryRules.length + 1;
                const fresh = normalizeCountryRule({
                    id: 'rule-land-' + i,
                    land: 'Neues Land ' + i
                }, i);
                const next = countryRules.concat([fresh]);
                setAttributes({ countryRules: next });
                setActiveRuleId(fresh.id);
            }

            function removeRule(index) {
                const next = countryRules.filter(function (_, i) { return i !== index; });
                setAttributes({ countryRules: next });
                if (next.length) {
                    setActiveRuleId(next[Math.max(0, index - 1)].id);
                }
            }

            if (!isSelected) {
                return el('section', blockProps,
                    el('h3', null, attributes.checkerTitle || 'Grenz- & Einreise-Checker'),
                    el('p', { className: 'grenz-einreise-editor-compact' },
                        countryRules.length + ' Länderprofile · ' + borders.length + ' Grenzübergänge'
                    )
                );
            }

            return el('section', blockProps,
                el('h3', null, 'Grenz- & Einreise-Checker (Editor)'),
                el(TextControl, {
                    label: 'Titel Checker',
                    value: attributes.checkerTitle || '',
                    onChange: function (value) { setAttributes({ checkerTitle: value }); }
                }),
                el(TextControl, {
                    label: 'Titel Grenzliste',
                    value: attributes.routeTitle || '',
                    onChange: function (value) { setAttributes({ routeTitle: value }); }
                }),
                rule && el('div', { className: 'grenz-einreise-editor-card' },
                    el('h4', null, 'Länderanforderungen bearbeiten'),
                    el(SelectControl, {
                        label: 'Landesprofil bearbeiten',
                        value: rule.id,
                        options: countryRules.map(function (item) {
                            return {
                                label: item.land + ' (Camper)',
                                value: item.id
                            };
                        }),
                        onChange: function (value) { setActiveRuleId(value); }
                    }),
                    el(TextControl, {
                        label: 'Reiseland',
                        value: rule.land,
                        onChange: function (value) {
                            const id = sanitizeId('rule-' + value + '-camper');
                            updateRule(safeRuleIdx, { land: value, id: id });
                            setActiveRuleId(id);
                        }
                    }),
                    el(TextControl, {
                        label: 'Fahrzeugtyp',
                        value: VEHICLE_TYPE,
                        disabled: true
                    }),
                    el(SelectControl, {
                        label: 'Visum (Ja / Nein)',
                        value: rule.visum,
                        options: STATUS_OPTIONS.map(function (item) { return { label: item, value: item }; }),
                        onChange: function (value) { updateRule(safeRuleIdx, { visum: value }); }
                    }),
                    el(TextControl, {
                        label: 'Visum (Tage)',
                        value: rule.visumTage,
                        onChange: function (value) { updateRule(safeRuleIdx, { visumTage: value }); }
                    }),
                    el(TextControl, {
                        label: 'Max. Aufenthaltsdauer (Tage)',
                        value: rule.aufenthaltsdauer,
                        onChange: function (value) { updateRule(safeRuleIdx, { aufenthaltsdauer: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Temporäre Fahrzeugeinfuhr (TIP)',
                        value: rule.tip,
                        options: STATUS_OPTIONS.map(function (item) { return { label: item, value: item }; }),
                        onChange: function (value) { updateRule(safeRuleIdx, { tip: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Versicherung',
                        value: rule.versicherung,
                        options: INSURANCE_OPTIONS.map(function (item) { return { label: item, value: item }; }),
                        onChange: function (value) { updateRule(safeRuleIdx, { versicherung: value }); }
                    }),
                    el(TextControl, {
                        label: 'Kosten',
                        value: rule.kosten,
                        onChange: function (value) { updateRule(safeRuleIdx, { kosten: value }); }
                    }),
                    el('div', { className: 'grenz-einreise-editor-actions' },
                        el(Button, { variant: 'secondary', onClick: addRule }, 'Land hinzufügen'),
                        el(Button, { variant: 'secondary', isDestructive: true, onClick: function () { removeRule(safeRuleIdx); }, disabled: countryRules.length <= 1 }, 'Land löschen')
                    )
                ),
                border && el('div', { className: 'grenz-einreise-editor-card' },
                    el('h4', null, 'Grenzübergang bearbeiten'),
                    el(SelectControl, {
                        label: 'Grenzübergang bearbeiten',
                        value: border.id,
                        options: borders.map(function (item) {
                            return {
                                label: item.flaggeHerkunft + ' ' + item.herkunftsland + ' → ' + item.flaggeZiel + ' ' + item.zielland + ' - ' + item.grenzname,
                                value: item.id
                            };
                        }),
                        onChange: function (value) { setActiveId(value); }
                    }),
                    el(TextControl, {
                        label: 'Herkunftsland',
                        value: border.herkunftsland,
                        onChange: function (value) {
                            const id = sanitizeId(value + '-' + border.zielland + '-' + border.grenzname);
                            updateBorder(safeIdx, { herkunftsland: value, id: id });
                            setActiveId(id);
                        }
                    }),
                    el(TextControl, {
                        label: 'Zielland',
                        value: border.zielland,
                        onChange: function (value) {
                            const id = sanitizeId(border.herkunftsland + '-' + value + '-' + border.grenzname);
                            updateBorder(safeIdx, { zielland: value, id: id });
                            setActiveId(id);
                        }
                    }),
                    el(TextControl, {
                        label: 'Grenzname',
                        value: border.grenzname,
                        onChange: function (value) {
                            const id = sanitizeId(border.herkunftsland + '-' + border.zielland + '-' + value);
                            updateBorder(safeIdx, { grenzname: value, id: id });
                            setActiveId(id);
                        }
                    }),
                    el(TextControl, {
                        label: 'Flagge Herkunft',
                        value: border.flaggeHerkunft,
                        onChange: function (value) { updateBorder(safeIdx, { flaggeHerkunft: value }); }
                    }),
                    el(TextControl, {
                        label: 'Flagge Ziel',
                        value: border.flaggeZiel,
                        onChange: function (value) { updateBorder(safeIdx, { flaggeZiel: value }); }
                    }),
                    el(TextControl, {
                        label: 'Fahrzeugtyp',
                        value: VEHICLE_TYPE,
                        disabled: true
                    }),
                    el(SelectControl, {
                        label: 'Visum (Ja / Nein)',
                        value: border.visum,
                        options: STATUS_OPTIONS.map(function (item) { return { label: item, value: item }; }),
                        onChange: function (value) { updateBorder(safeIdx, { visum: value }); }
                    }),
                    el(TextControl, {
                        label: 'Visum (Tage)',
                        value: border.visumTage,
                        onChange: function (value) { updateBorder(safeIdx, { visumTage: value }); }
                    }),
                    el(TextControl, {
                        label: 'Aufenthaltsdauer (Tage)',
                        value: border.aufenthaltsdauer,
                        onChange: function (value) { updateBorder(safeIdx, { aufenthaltsdauer: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Temporäre Fahrzeugeinfuhr (TIP)',
                        value: border.tip,
                        options: STATUS_OPTIONS.map(function (item) { return { label: item, value: item }; }),
                        onChange: function (value) { updateBorder(safeIdx, { tip: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Versicherung',
                        value: border.versicherung,
                        options: INSURANCE_OPTIONS.map(function (item) { return { label: item, value: item }; }),
                        onChange: function (value) { updateBorder(safeIdx, { versicherung: value }); }
                    }),
                    el(TextControl, {
                        label: 'Kosten',
                        value: border.kosten,
                        onChange: function (value) { updateBorder(safeIdx, { kosten: value }); }
                    }),
                    el(TextareaControl, {
                        label: 'Einreise (Person) - Stichpunkte (eine Zeile pro Punkt)',
                        value: arrayToLines(border.einreisePerson),
                        onChange: function (value) { updateBorder(safeIdx, { einreisePerson: linesToArray(value) }); }
                    }),
                    el(TextareaControl, {
                        label: 'Fahrzeug & Zoll - Stichpunkte',
                        value: arrayToLines(border.fahrzeugZoll),
                        onChange: function (value) { updateBorder(safeIdx, { fahrzeugZoll: linesToArray(value) }); }
                    }),
                    el(TextareaControl, {
                        label: 'Versicherung - Stichpunkte',
                        value: arrayToLines(border.versicherungDetails),
                        onChange: function (value) { updateBorder(safeIdx, { versicherungDetails: linesToArray(value) }); }
                    }),
                    el(TextareaControl, {
                        label: 'Ablauf & Dauer - Stichpunkte',
                        value: arrayToLines(border.ablaufDauer),
                        onChange: function (value) { updateBorder(safeIdx, { ablaufDauer: linesToArray(value) }); }
                    }),
                    el(TextareaControl, {
                        label: 'Unsere Erfahrung',
                        value: border.erfahrungsbericht,
                        onChange: function (value) { updateBorder(safeIdx, { erfahrungsbericht: value }); }
                    }),
                    el(TextareaControl, {
                        label: 'Besonderheiten & Tipps - Stichpunkte',
                        value: arrayToLines(border.besonderheiten),
                        onChange: function (value) { updateBorder(safeIdx, { besonderheiten: linesToArray(value) }); }
                    }),
                    el('div', { className: 'grenz-einreise-editor-actions' },
                        el(Button, { variant: 'secondary', onClick: function () { moveBorder(safeIdx, safeIdx - 1); }, disabled: safeIdx === 0 }, 'Nach oben'),
                        el(Button, { variant: 'secondary', onClick: function () { moveBorder(safeIdx, safeIdx + 1); }, disabled: safeIdx === borders.length - 1 }, 'Nach unten'),
                        el(Button, { variant: 'secondary', onClick: addBorder }, 'Neue Grenze'),
                        el(Button, { variant: 'secondary', isDestructive: true, onClick: function () { removeBorder(safeIdx); }, disabled: borders.length <= 1 }, 'Grenze löschen')
                    )
                )
            );
        },

        save: function (props) {
            return renderSaveMarkup(props.attributes, 'div', true, false, false);
        },

        deprecated: [
            {
                save: function (props) {
                    return renderSaveMarkup(props.attributes, 'article', false, false, false);
                }
            },
            {
                save: function (props) {
                    return renderSaveMarkup(props.attributes, 'div', false, false, false);
                }
            },
            {
                save: function (props) {
                    return renderSaveMarkup(props.attributes, 'div', true, true, false);
                }
            },
            {
                save: function (props) {
                    return renderSaveMarkup(props.attributes, 'div', true, true, true);
                }
            },
            {
                save: function (props) {
                    return renderSaveMarkup(props.attributes, 'article', true, true, true);
                }
            }
        ]
    });
})(window.wp);
