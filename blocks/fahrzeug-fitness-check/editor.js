(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps } = wp.blockEditor;
    const { TextControl, TextareaControl, SelectControl } = wp.components;
    const { useEffect, useState } = wp.element;
    const el = wp.element.createElement;

    const CLEARANCE_OPTIONS = [
        { label: '<20 cm', value: '0' },
        { label: '20-25 cm', value: '1' },
        { label: '>25 cm', value: '2' }
    ];

    const AWD_WEIGHT_OPTIONS = [
        { label: 'Niedrig', value: 'niedrig' },
        { label: 'Mittel', value: 'mittel' },
        { label: 'Hoch', value: 'hoch' }
    ];

    const REPAIR_DEMAND_OPTIONS = [
        { label: 'Mittel', value: 'mittel' },
        { label: 'Hoch', value: 'hoch' }
    ];

    const DEFAULT_PROFILES = [
        {
            id: 'usa-kanada-alaska',
            label: 'USA, Kanada, Alaska',
            roadQuality: 'Von Interstate bis Schotterpiste in Alaska, insgesamt gut.',
            fuelDistances: 'Meist 80-300 km, in Alaska bis ca. 450 km.',
            fuelAvailability: 'Sehr gut, in Alaska lokal ausgedünnt.',
            requiredClearance: 'Mindestens 20 cm, 20-25 cm empfehlenswert.',
            awdRelevance: 'Mittel, auf abgelegenen Schotterstrecken hilfreich.',
            recommendedRange: '300-500 km',
            fuelCanRequirement: '0-20 L empfehlenswert für Alaska.',
            minClearance: 1,
            minRangeKm: 300,
            minCanLiters: 0,
            awdWeight: 'mittel',
            repairDemand: 'mittel',
            presetException: ''
        },
        {
            id: 'mexiko',
            label: 'Mexiko',
            roadQuality: 'Mischung aus Mautstraßen, Landstraßen und teils ruppigen Zufahrten.',
            fuelDistances: 'Typisch 120-320 km, Baja teils länger.',
            fuelAvailability: 'Gut, außerhalb großer Achsen mit Planung fahren.',
            requiredClearance: 'Mindestens 20 cm für Pisten und Topes.',
            awdRelevance: 'Gering bis mittel, außerhalb Asphaltabschnitte nützlich.',
            recommendedRange: '300-450 km',
            fuelCanRequirement: '0-20 L für Baja als Reserve sinnvoll.',
            minClearance: 1,
            minRangeKm: 300,
            minCanLiters: 0,
            awdWeight: 'niedrig',
            repairDemand: 'mittel',
            presetException: 'Strandfahrten Baja California'
        },
        {
            id: 'zentralamerika',
            label: 'Guatemala, Belize, El Salvador, Honduras, Nicaragua, Costa Rica, Panama',
            roadQuality: 'Hauptachsen meist okay, Nebenstrecken oft eng und wechselhaft.',
            fuelDistances: 'Typisch 120-280 km.',
            fuelAvailability: 'Gut in Städten und entlang Hauptachsen.',
            requiredClearance: 'Mindestens 20 cm empfohlen.',
            awdRelevance: 'Gering bis mittel in Regenzeit und auf Nebenrouten.',
            recommendedRange: '250-400 km',
            fuelCanRequirement: 'Kein Muss, 20 L als Puffer komfortabel.',
            minClearance: 1,
            minRangeKm: 250,
            minCanLiters: 0,
            awdWeight: 'niedrig',
            repairDemand: 'mittel',
            presetException: ''
        },
        {
            id: 'kolumbien-ecuador-peru',
            label: 'Kolumbien, Ecuador, Peru',
            roadQuality: 'Küstenachsen gut, Andenpassagen und Nebenstrecken anspruchsvoll.',
            fuelDistances: 'Typisch 180-350 km, in Höhenlagen vereinzelt mehr.',
            fuelAvailability: 'Entlang Hauptachsen gut, in Andenregionen punktuell.',
            requiredClearance: 'Mindestens 20-25 cm empfohlen.',
            awdRelevance: 'Mittel bis hoch in Bergregionen und auf Pisten.',
            recommendedRange: '300-500 km',
            fuelCanRequirement: '20 L empfohlen für abgelegene Abschnitte.',
            minClearance: 1,
            minRangeKm: 300,
            minCanLiters: 20,
            awdWeight: 'mittel',
            repairDemand: 'hoch',
            presetException: ''
        },
        {
            id: 'bolivien-lagunenroute',
            label: 'Bolivien (inkl. Lagunenroute)',
            roadQuality: 'Häufig Wellblech, Sand, lose Passagen und große Höhen.',
            fuelDistances: 'Regelmäßig 300-500 km, Lagunenroute 500-700 km.',
            fuelAvailability: 'In abgelegenen Gebieten stark eingeschränkt.',
            requiredClearance: 'Mindestens >25 cm für Lagunenroute.',
            awdRelevance: 'Sehr hoch in Sand und auf rauen Hochlandpisten.',
            recommendedRange: '500-700 km',
            fuelCanRequirement: 'Mindestens 40 L zusätzlich verpflichtend.',
            minClearance: 2,
            minRangeKm: 500,
            minCanLiters: 40,
            awdWeight: 'hoch',
            repairDemand: 'hoch',
            presetException: ''
        },
        {
            id: 'suedkegel',
            label: 'Chile, Argentinien (inkl. Patagonien & Puna), Uruguay, Paraguay, Brasilien',
            roadQuality: 'Sehr unterschiedlich: Asphalt bis abgelegene Schotter- und Windpisten.',
            fuelDistances: 'Typisch 200-400 km, Patagonien/Puna 300-600 km.',
            fuelAvailability: 'Im Norden/Südosten gut, in Patagonien/Puna dünn.',
            requiredClearance: 'Mindestens 20-25 cm für Offroad-Alternativen.',
            awdRelevance: 'Mittel, in entlegenen Gebieten deutlich wichtiger.',
            recommendedRange: '300-600 km',
            fuelCanRequirement: '20 L empfohlen, in abgelegenen Regionen mehr.',
            minClearance: 1,
            minRangeKm: 300,
            minCanLiters: 20,
            awdWeight: 'mittel',
            repairDemand: 'hoch',
            presetException: 'Puna (Argentinien)'
        }
    ];

    function normalizeProfile(profile, index) {
        const fallback = DEFAULT_PROFILES[index] || DEFAULT_PROFILES[0];
        const safe = profile && typeof profile === 'object' ? profile : {};

        return {
            id: typeof safe.id === 'string' && safe.id ? safe.id : fallback.id,
            label: typeof safe.label === 'string' && safe.label ? safe.label : fallback.label,
            roadQuality: typeof safe.roadQuality === 'string' ? safe.roadQuality : fallback.roadQuality,
            fuelDistances: typeof safe.fuelDistances === 'string' ? safe.fuelDistances : fallback.fuelDistances,
            fuelAvailability: typeof safe.fuelAvailability === 'string' ? safe.fuelAvailability : fallback.fuelAvailability,
            requiredClearance: typeof safe.requiredClearance === 'string' ? safe.requiredClearance : fallback.requiredClearance,
            awdRelevance: typeof safe.awdRelevance === 'string' ? safe.awdRelevance : fallback.awdRelevance,
            recommendedRange: typeof safe.recommendedRange === 'string' ? safe.recommendedRange : fallback.recommendedRange,
            fuelCanRequirement: typeof safe.fuelCanRequirement === 'string' ? safe.fuelCanRequirement : fallback.fuelCanRequirement,
            minClearance: Number.isFinite(parseInt(safe.minClearance, 10)) ? parseInt(safe.minClearance, 10) : fallback.minClearance,
            minRangeKm: Number.isFinite(parseInt(safe.minRangeKm, 10)) ? parseInt(safe.minRangeKm, 10) : fallback.minRangeKm,
            minCanLiters: Number.isFinite(parseInt(safe.minCanLiters, 10)) ? parseInt(safe.minCanLiters, 10) : fallback.minCanLiters,
            awdWeight: typeof safe.awdWeight === 'string' && safe.awdWeight ? safe.awdWeight : fallback.awdWeight,
            repairDemand: typeof safe.repairDemand === 'string' && safe.repairDemand ? safe.repairDemand : fallback.repairDemand,
            presetException: typeof safe.presetException === 'string' ? safe.presetException : fallback.presetException
        };
    }

    function normalizeProfiles(value) {
        const source = Array.isArray(value) && value.length ? value : DEFAULT_PROFILES;
        return source.map(normalizeProfile);
    }

    function updateProfile(profiles, index, changes) {
        const next = profiles.slice();
        next[index] = Object.assign({}, next[index], changes);
        return next;
    }

    registerBlockType('rueckenwinde/fahrzeug-fitness-check', {
        title: 'Fahrzeug-Fitness-Check',
        icon: 'performance',
        category: 'widgets',

        attributes: {
            blockTitle: { type: 'string', default: 'Fahrzeug-Fitness-Check – Ist mein Camper dafür geeignet?' },
            introText: { type: 'string', default: 'Erfahrungsbasierte Einschätzung für die gesamte Panamericana nach Regionen.' },
            resultTitle: { type: 'string', default: 'Länder- und Regionsbewertung' },
            presetLabel: { type: 'string', default: 'Ich fahre einen Citroën Jumper (2WD)' },
            presetSubtext: { type: 'string', default: 'Basierend auf realer Panamericana-Erfahrung' },
            presetBadge: { type: 'string', default: 'Praxis-Setup: Citroën Jumper 2WD' },
            presetDisclaimer: {
                type: 'string',
                default: 'Hinweis: Dieses Praxis-Setup ist erprobt, ersetzt aber keine aktuelle Sicherheits- und Routenprüfung. Sonderfälle bleiben kritisch.'
            },
            countryProfiles: {
                type: 'array',
                default: DEFAULT_PROFILES
            }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps({ className: 'fahrzeug-fitness-check-editor' });
            const profiles = normalizeProfiles(attributes.countryProfiles);
            const [activeId, setActiveId] = useState(profiles[0] ? profiles[0].id : '');

            useEffect(function () {
                if (!profiles.length) {
                    return;
                }
                const found = profiles.some(function (entry) { return entry.id === activeId; });
                if (!found) {
                    setActiveId(profiles[0].id);
                }
            }, [profiles, activeId]);

            const activeIndex = profiles.findIndex(function (entry) { return entry.id === activeId; });
            const safeIndex = activeIndex === -1 ? 0 : activeIndex;
            const profile = profiles[safeIndex];

            function patchProfile(changes) {
                setAttributes({ countryProfiles: updateProfile(profiles, safeIndex, changes) });
            }

            return el('section', blockProps,
                el('h3', null, 'Fahrzeug-Fitness-Check (Editor)'),
                el(TextControl, {
                    label: 'Blocktitel',
                    value: attributes.blockTitle || '',
                    onChange: function (value) { setAttributes({ blockTitle: value }); }
                }),
                el(TextareaControl, {
                    label: 'Einleitung',
                    value: attributes.introText || '',
                    onChange: function (value) { setAttributes({ introText: value }); }
                }),
                el(TextControl, {
                    label: 'Titel Ergebnisbereich',
                    value: attributes.resultTitle || '',
                    onChange: function (value) { setAttributes({ resultTitle: value }); }
                }),
                el(TextControl, {
                    label: 'Preset Titel',
                    value: attributes.presetLabel || '',
                    onChange: function (value) { setAttributes({ presetLabel: value }); }
                }),
                el(TextControl, {
                    label: 'Preset Untertitel',
                    value: attributes.presetSubtext || '',
                    onChange: function (value) { setAttributes({ presetSubtext: value }); }
                }),
                el(TextControl, {
                    label: 'Preset Badge',
                    value: attributes.presetBadge || '',
                    onChange: function (value) { setAttributes({ presetBadge: value }); }
                }),
                el(TextareaControl, {
                    label: 'Preset Hinweistext',
                    value: attributes.presetDisclaimer || '',
                    onChange: function (value) { setAttributes({ presetDisclaimer: value }); }
                }),
                profile && el('div', { className: 'grenz-editor-card' },
                    el(SelectControl, {
                        label: 'Region bearbeiten',
                        value: profile.id,
                        options: profiles.map(function (entry) {
                            return { label: entry.label, value: entry.id };
                        }),
                        onChange: function (value) { setActiveId(value); }
                    }),
                    el(TextControl, {
                        label: 'Name der Region',
                        value: profile.label,
                        onChange: function (value) { patchProfile({ label: value }); }
                    }),
                    el(TextareaControl, {
                        label: 'Straßenqualität',
                        value: profile.roadQuality,
                        onChange: function (value) { patchProfile({ roadQuality: value }); }
                    }),
                    el(TextControl, {
                        label: 'Typische Tankdistanzen',
                        value: profile.fuelDistances,
                        onChange: function (value) { patchProfile({ fuelDistances: value }); }
                    }),
                    el(TextControl, {
                        label: 'Verfügbarkeit Treibstoff',
                        value: profile.fuelAvailability,
                        onChange: function (value) { patchProfile({ fuelAvailability: value }); }
                    }),
                    el(TextControl, {
                        label: 'Erforderliche Bodenfreiheit (Text)',
                        value: profile.requiredClearance,
                        onChange: function (value) { patchProfile({ requiredClearance: value }); }
                    }),
                    el(TextControl, {
                        label: 'AWD-Relevanz (Text)',
                        value: profile.awdRelevance,
                        onChange: function (value) { patchProfile({ awdRelevance: value }); }
                    }),
                    el(TextControl, {
                        label: 'Empfohlene Reichweite (Text)',
                        value: profile.recommendedRange,
                        onChange: function (value) { patchProfile({ recommendedRange: value }); }
                    }),
                    el(TextControl, {
                        label: 'Kanister-Empfehlung (Text)',
                        value: profile.fuelCanRequirement,
                        onChange: function (value) { patchProfile({ fuelCanRequirement: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Minimale Bodenfreiheit für Bewertung',
                        value: String(profile.minClearance),
                        options: CLEARANCE_OPTIONS,
                        onChange: function (value) { patchProfile({ minClearance: parseInt(value, 10) }); }
                    }),
                    el(TextControl, {
                        label: 'Mindest-Reichweite (km)',
                        value: String(profile.minRangeKm),
                        onChange: function (value) {
                            patchProfile({ minRangeKm: parseInt(value, 10) || 0 });
                        }
                    }),
                    el(TextControl, {
                        label: 'Mindest-Kanistervolumen (L)',
                        value: String(profile.minCanLiters),
                        onChange: function (value) {
                            patchProfile({ minCanLiters: parseInt(value, 10) || 0 });
                        }
                    }),
                    el(SelectControl, {
                        label: 'AWD-Gewichtung für Bewertung',
                        value: profile.awdWeight,
                        options: AWD_WEIGHT_OPTIONS,
                        onChange: function (value) { patchProfile({ awdWeight: value }); }
                    }),
                    el(SelectControl, {
                        label: 'Reparaturanforderung für Bewertung',
                        value: profile.repairDemand,
                        options: REPAIR_DEMAND_OPTIONS,
                        onChange: function (value) { patchProfile({ repairDemand: value }); }
                    }),
                    el(TextControl, {
                        label: 'Preset-Ausnahme (optional)',
                        value: profile.presetException,
                        onChange: function (value) { patchProfile({ presetException: value }); }
                    })
                )
            );
        },

        save: function (props) {
            const attrs = props.attributes;
            const profiles = normalizeProfiles(attrs.countryProfiles);
            const blockProps = useBlockProps.save({
                className: 'wp-block-rueckenwinde-fahrzeug-fitness-check',
                'data-country-profiles': encodeURIComponent(JSON.stringify(profiles))
            });

            return el('section', blockProps,
                el('div', { className: 'ffc-card ffc-input-card' },
                    el('h3', { className: 'ffc-title' }, attrs.blockTitle || 'Fahrzeug-Fitness-Check – Ist mein Camper dafür geeignet?'),
                    el('p', { className: 'ffc-intro' }, attrs.introText || 'Erfahrungsbasierte Einschätzung für die gesamte Panamericana nach Regionen.'),
                    el('button', {
                        type: 'button',
                        className: 'ffc-preset-toggle',
                        'aria-pressed': 'false'
                    },
                        el('strong', null, attrs.presetLabel || 'Ich fahre einen Citroën Jumper (2WD)'),
                        el('span', null, attrs.presetSubtext || 'Basierend auf realer Panamericana-Erfahrung')
                    ),
                    el('div', { className: 'ffc-preset-badge', hidden: true }, attrs.presetBadge || 'Praxis-Setup: Citroën Jumper 2WD'),
                    el('p', { className: 'ffc-preset-disclaimer', hidden: true }, attrs.presetDisclaimer || ''),
                    el('div', { className: 'ffc-input-grid' },
                        el('label', { className: 'ffc-field' },
                            el('span', null, 'Allradantrieb vorhanden'),
                            el('select', { className: 'ffc-input-awd', defaultValue: 'nein' },
                                el('option', { value: 'ja' }, 'Ja'),
                                el('option', { value: 'nein' }, 'Nein')
                            )
                        ),
                        el('label', { className: 'ffc-field' },
                            el('span', null, 'Bodenfreiheit'),
                            el('select', { className: 'ffc-input-clearance', defaultValue: '20to25' },
                                el('option', { value: 'lt20' }, '<20 cm'),
                                el('option', { value: '20to25' }, '20-25 cm'),
                                el('option', { value: 'gt25' }, '>25 cm')
                            )
                        ),
                        el('label', { className: 'ffc-field' },
                            el('span', null, 'Reichweite pro Tankfüllung'),
                            el('select', { className: 'ffc-input-range', defaultValue: '400to600' },
                                el('option', { value: 'lt400' }, '<400 km'),
                                el('option', { value: '400to600' }, '400-600 km'),
                                el('option', { value: 'gt600' }, '>600 km')
                            )
                        ),
                        el('label', { className: 'ffc-field' },
                            el('span', null, 'Reservekanister'),
                            el('select', { className: 'ffc-input-cans', defaultValue: '20' },
                                el('option', { value: '0' }, 'Kein'),
                                el('option', { value: '20' }, '1×20 L'),
                                el('option', { value: '40' }, '2×20 L+')
                            )
                        ),
                        el('label', { className: 'ffc-field' },
                            el('span', null, 'Ersatzteile & Reparierbarkeit'),
                            el('select', { className: 'ffc-input-repair', defaultValue: 'gut' },
                                el('option', { value: 'gut' }, 'Gut'),
                                el('option', { value: 'eingeschraenkt' }, 'Eingeschränkt'),
                                el('option', { value: 'schwierig' }, 'Schwierig')
                            )
                        )
                    ),
                    el('button', { type: 'button', className: 'ffc-evaluate' }, 'Eignung aktualisieren')
                ),
                el('div', { className: 'ffc-card ffc-result-card' },
                    el('h3', { className: 'ffc-title' }, attrs.resultTitle || 'Länder- und Regionsbewertung'),
                    el('div', { className: 'row grid-x' },
                        el('div', { className: 'ffc-accordion small-12 large-12 columns cell', 'aria-live': 'polite' },
                            profiles.map(function (profile, index) {
                            const panelId = 'ffc-panel-' + index;
                            return el('article', {
                                    key: profile.id,
                                    className: 'ffc-accordion-item',
                                    'data-profile-id': profile.id
                                },
                                el('button', {
                                        type: 'button',
                                        className: 'ffc-accordion-trigger',
                                        'aria-expanded': 'false',
                                        'aria-controls': panelId
                                    },
                                    el('span', { className: 'ffc-trigger-label' }, profile.label),
                                    el('span', { className: 'ffc-trigger-status ffc-status-neutral' }, 'Bewertung ausstehend')
                                ),
                                el('div', { id: panelId, className: 'ffc-accordion-panel', hidden: true },
                                    el('ul', { className: 'ffc-profile-list' },
                                        el('li', null, 'Straßenqualität: ', el('strong', null, profile.roadQuality)),
                                        el('li', null, 'Typische Tankdistanzen: ', el('strong', null, profile.fuelDistances)),
                                        el('li', null, 'Verfügbarkeit Treibstoff: ', el('strong', null, profile.fuelAvailability)),
                                        el('li', null, 'Erforderliche Bodenfreiheit: ', el('strong', null, profile.requiredClearance)),
                                        el('li', null, 'AWD-Relevanz: ', el('strong', null, profile.awdRelevance)),
                                        el('li', null, 'Empfohlene Reichweite: ', el('strong', null, profile.recommendedRange)),
                                        el('li', null, 'Kanister-Empfehlung: ', el('strong', null, profile.fuelCanRequirement))
                                    ),
                                    el('div', { className: 'ffc-panel-result-row' },
                                        el('span', null, 'Ergebnis:'),
                                        el('span', { className: 'ffc-panel-status ffc-status-neutral' }, 'Bewertung ausstehend')
                                    ),
                                    el('div', { className: 'ffc-country-measurements' },
                                        el('h4', null, 'Messwerte für diese Region'),
                                        el('ul', { className: 'ffc-measure-list' },
                                            el('li', { className: 'ffc-measure-range' }, 'Reichweite: -'),
                                            el('li', { className: 'ffc-measure-cans' }, 'Reservekanister: -'),
                                            el('li', { className: 'ffc-measure-clearance' }, 'Bodenfreiheit: -'),
                                            el('li', { className: 'ffc-measure-awd' }, 'Allrad: -')
                                        )
                                    ),
                                    el('ul', { className: 'ffc-result-hints' }),
                                    profile.presetException && el('div', { className: 'ffc-preset-exception', hidden: true },
                                        el('span', { className: 'ffc-status ffc-status-red' }, '🔴 Kritisch / nicht empfohlen'),
                                        el('span', null, profile.presetException)
                                    )
                                )
                                );
                            })
                        )
                    )
                )
            );
        }
    });
})(window.wp);
