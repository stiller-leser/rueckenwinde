(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, SelectControl, Button } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;

    const CATEGORY_KEYS = ['freeCamping', 'costs', 'safety', 'roads', 'bureaucracy'];

    const DEFAULT_CATEGORY_LABELS = {
        freeCamping: 'Freistehen',
        costs: 'Kosten',
        safety: 'Sicherheit',
        roads: 'Straßen',
        bureaucracy: 'Bürokratie'
    };

    const DEFAULT_CATEGORY_ICONS = {
        freeCamping: '🏕',
        costs: '💰',
        safety: '🛡',
        roads: '🛣',
        bureaucracy: '📄'
    };

    const DEFAULT_RATING_LABELS = {
        high: 'Sehr geeignet',
        moderate: 'Mittel',
        low: 'Wenig geeignet'
    };

    const DEFAULT_COUNTRIES = [
            {
                    "name": "Uruguay",
                    "ratings": {
                            "freeCamping": "high",
                            "costs": "moderate",
                            "safety": "high",
                            "roads": "high",
                            "bureaucracy": "high"
                    },
                    "tips": {
                            "freeCamping": "Einfache Übernachtungsplätze gibt es oft an der Küste und in kleinen Orten.",
                            "costs": "Sprit und Lebensmittel liegen meist im mittleren Bereich.",
                            "safety": "Meist ruhige Stimmung, in Städten trotzdem normal vorsichtig sein.",
                            "roads": "Die Hauptstrecken sind zuverlässig und vanfreundlich.",
                            "bureaucracy": "Grenz- und Papierkram ist in der Regel unkompliziert."
                    }
            },
            {
                    "name": "Argentinien",
                    "ratings": {
                            "freeCamping": "high",
                            "costs": "moderate",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Viel Platz bietet viele gute Übernachtungsmöglichkeiten.",
                            "costs": "Preise können stark schwanken, Budget regelmäßig anpassen.",
                            "safety": "In vielen Regionen entspannt, in Großstädten besonders aufmerksam.",
                            "roads": "Sehr gute Fernstraßen, in abgelegenen Gebieten teils rau.",
                            "bureaucracy": "An Grenzen sind Verzögerungen möglich."
                    }
            },
            {
                    "name": "Chile",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "low",
                            "safety": "high",
                            "roads": "high",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Freistehen geht, ist aber häufig strenger geregelt.",
                            "costs": "Häufig eines der teureren Länder auf der Route.",
                            "safety": "Wirkt oft strukturiert und gut planbar für Overlander.",
                            "roads": "Auf den Hauptachsen ist die Straßenqualität sehr gut.",
                            "bureaucracy": "Kontrollen, z. B. bei Lebensmitteln, können streng sein."
                    }
            },
            {
                    "name": "Peru",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Viele ruhige Plätze, in Orten besser kurz nachfragen.",
                            "costs": "Alltag und Essen sind oft budgetfreundlich.",
                            "safety": "Die Lage unterscheidet sich stark je nach Region.",
                            "roads": "Bergstrecken sind langsam und fahrerisch anspruchsvoll.",
                            "bureaucracy": "Üblicher Grenzablauf mit Dokumentenkontrollen."
                    }
            },
            {
                    "name": "Bolivien",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "low",
                            "bureaucracy": "low"
                    },
                    "tips": {
                            "freeCamping": "Abgelegene Gegenden bieten viele flexible Stopps.",
                            "costs": "Meist günstig für ein kleines Reisebudget.",
                            "safety": "Höhe und Isolation erfordern gute Vorbereitung.",
                            "roads": "Von okay bis sehr schlecht ist alles dabei.",
                            "bureaucracy": "Grenzen und Genehmigungen brauchen oft Geduld."
                    }
            },
            {
                    "name": "Brasilien",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "moderate",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Besser mit Apps und lokalen Empfehlungen arbeiten.",
                            "costs": "Kosten variieren je nach Region und Saison.",
                            "safety": "Regionale Unterschiede sind groß, Route bewusst wählen.",
                            "roads": "Hauptstraßen sind oft gut, abgelegen teils wechselhaft.",
                            "bureaucracy": "Üblicher Papierkram, je nach Grenze unterschiedlich."
                    }
            },
            {
                    "name": "Ecuador",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Mix aus Freistehen und privaten Alternativen.",
                            "costs": "Für Langzeitreisen oft gut kalkulierbar.",
                            "safety": "Vor Grenzübertritten regionale Infos prüfen.",
                            "roads": "Berge, Wetter und Verkehr verlängern Etappen.",
                            "bureaucracy": "Normaler Aufwand bei Ein- und Ausreise."
                    }
            },
            {
                    "name": "Kolumbien",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "low"
                    },
                    "tips": {
                            "freeCamping": "Möglichst bewährte Spots und Apps nutzen.",
                            "costs": "Gutes Preis-Leistungs-Verhältnis im Alltag.",
                            "safety": "Route bewusst wählen, Nachtfahrten vermeiden.",
                            "roads": "Viele kurvige Bergstraßen verlangsamen die Reise.",
                            "bureaucracy": "Grenz- und Fahrzeugprozess kann Zeit kosten."
                    }
            },
            {
                    "name": "Paraguay",
                    "ratings": {
                            "freeCamping": "high",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Wenig Verkehr und viel Raum machen Stopps einfacher.",
                            "costs": "Sprit und Alltag sind oft günstig.",
                            "safety": "Mit normaler Vorsicht gut machbar.",
                            "roads": "Abseits der Hauptachsen teils wechselhafte Qualität.",
                            "bureaucracy": "Meist machbar, Dokumente sauber bereithalten."
                    }
            },
            {
                    "name": "Panama",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "moderate",
                            "safety": "moderate",
                            "roads": "high",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Mit bekannten Plätzen an Küste und Inland planen.",
                            "costs": "In touristischen Regionen steigen Kosten schnell.",
                            "safety": "Häufig stabil, lokale Hotspots meiden.",
                            "roads": "Die Panamericana ist auf langen Abschnitten gut.",
                            "bureaucracy": "Logistik und Grenzthemen brauchen oft extra Zeit."
                    }
            },
            {
                    "name": "Costa Rica",
                    "ratings": {
                            "freeCamping": "low",
                            "costs": "low",
                            "safety": "high",
                            "roads": "high",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Freistehen ist begrenzt, bezahlte Plätze sind üblich.",
                            "costs": "Eher eines der teureren Länder in Mittelamerika.",
                            "safety": "Für Reisende oft angenehm und gut strukturiert.",
                            "roads": "Hauptstrecken sind okay, Wetter kann Bedingungen ändern.",
                            "bureaucracy": "Grenzprozess ist standardisiert, aber teils langsam."
                    }
            },
            {
                    "name": "Honduras",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "low",
                            "roads": "moderate",
                            "bureaucracy": "low"
                    },
                    "tips": {
                            "freeCamping": "Lieber sichere, empfohlene Übernachtungsorte nutzen.",
                            "costs": "Alltag und Sprit sind oft günstig.",
                            "safety": "Routenwahl und Übernachtungsort sind entscheidend.",
                            "roads": "Qualität variiert stark je nach Region.",
                            "bureaucracy": "Grenzablauf kann zäh sein und Zeit kosten."
                    }
            },
            {
                    "name": "Nicaragua",
                    "ratings": {
                            "freeCamping": "high",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Viele Naturregionen erlauben flexible Etappen.",
                            "costs": "Gut geeignet für kleinere Tagesbudgets.",
                            "safety": "Vor Ort aktuelle Lageinfos einholen.",
                            "roads": "Auf typischen Routen meist gut fahrbar.",
                            "bureaucracy": "Üblicher Papierkram und Kontrollen an Grenzen."
                    }
            },
            {
                    "name": "Guatemala",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "low",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Kombination aus privaten Plätzen und einzelnen Freistehspots.",
                            "costs": "Häufig budgetfreundlich im Alltag.",
                            "safety": "Lokale Empfehlungen für Route und Parken sind wichtig.",
                            "roads": "Berge und Verkehr machen Etappen oft langsam.",
                            "bureaucracy": "Grenzformalitäten mit guter Dokumentenordnung machbar."
                    }
            },
            {
                    "name": "El Salvador",
                    "ratings": {
                            "freeCamping": "low",
                            "costs": "moderate",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Freie Plätze sind begrenzt, sichere Alternativen nutzen.",
                            "costs": "Kosten liegen oft im Mittelfeld.",
                            "safety": "In vielen Regionen besser, trotzdem vorausschauend planen.",
                            "roads": "Kurze Distanzen, aber lokal dichter Verkehr.",
                            "bureaucracy": "Grenzschritte sind meist überschaubar."
                    }
            },
            {
                    "name": "Belize",
                    "ratings": {
                            "freeCamping": "low",
                            "costs": "low",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Wirklich freie Spots sind selten, Campingplätze sind üblich.",
                            "costs": "Oft teurer als Nachbarländer.",
                            "safety": "Mit guter Platzwahl meist gut machbar.",
                            "roads": "Hauptrouten okay, abgelegene Zufahrten langsamer.",
                            "bureaucracy": "Normale Grenz- und Fahrzeugkontrollen einplanen."
                    }
            },
            {
                    "name": "Mexiko",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "high",
                            "safety": "moderate",
                            "roads": "moderate",
                            "bureaucracy": "moderate"
                    },
                    "tips": {
                            "freeCamping": "Viele Möglichkeiten mit Apps und Community-Tipps.",
                            "costs": "In vielen Regionen gutes Preis-Leistungs-Verhältnis.",
                            "safety": "Reisestil und Routenwahl beeinflussen viel.",
                            "roads": "Von sehr guten Mautstraßen bis zu rauen Nebenrouten.",
                            "bureaucracy": "Import- und Permit-Regeln genau beachten."
                    }
            },
            {
                    "name": "USA",
                    "ratings": {
                            "freeCamping": "low",
                            "costs": "low",
                            "safety": "high",
                            "roads": "high",
                            "bureaucracy": "high"
                    },
                    "tips": {
                            "freeCamping": "In vielen Regionen eingeschränkt, öffentliche Flächen gezielt nutzen.",
                            "costs": "Sprit, Stellplätze und Services sind oft teuer.",
                            "safety": "Klare Regeln und gute Infrastruktur auf vielen Strecken.",
                            "roads": "Sehr gutes Straßennetz für lange Etappen.",
                            "bureaucracy": "Abläufe sind klar, Regeln werden konsequent geprüft."
                    }
            },
            {
                    "name": "Kanada",
                    "ratings": {
                            "freeCamping": "moderate",
                            "costs": "low",
                            "safety": "high",
                            "roads": "high",
                            "bureaucracy": "high"
                    },
                    "tips": {
                            "freeCamping": "Je nach Provinz gibt es gute Frei- und Naturstellplätze.",
                            "costs": "Sprit, Reparaturen und Camping können teuer sein.",
                            "safety": "Sehr geeignet für ruhiges, planbares Overlanding.",
                            "roads": "Hauptstrecken sind meist in sehr gutem Zustand.",
                            "bureaucracy": "Regeln sind klar, Grenzkontrollen sind streng."
                    }
            }
    ];

    function normalizeCountries(list) {
        const source = Array.isArray(list) && list.length ? list : DEFAULT_COUNTRIES;

        return source.map(function (country) {
            const safeCountry = country && typeof country === 'object' ? country : {};
            const ratings = safeCountry.ratings && typeof safeCountry.ratings === 'object' ? safeCountry.ratings : {};
            const tips = safeCountry.tips && typeof safeCountry.tips === 'object' ? safeCountry.tips : {};

            const normalizedRatings = {};
            const normalizedTips = {};

            CATEGORY_KEYS.forEach(function (key) {
                const rating = ratings[key];
                normalizedRatings[key] = (rating === 'high' || rating === 'moderate' || rating === 'low') ? rating : 'moderate';
                normalizedTips[key] = typeof tips[key] === 'string' ? tips[key] : '';
            });

            return {
                name: typeof safeCountry.name === 'string' && safeCountry.name ? safeCountry.name : 'Land',
                ratings: normalizedRatings,
                tips: normalizedTips
            };
        });
    }

    function normalizeCategoryLabels(raw) {
        const source = raw && typeof raw === 'object' ? raw : {};
        const normalized = {};
        CATEGORY_KEYS.forEach(function (key) {
            normalized[key] = typeof source[key] === 'string' && source[key] ? source[key] : DEFAULT_CATEGORY_LABELS[key];
        });
        return normalized;
    }

    function normalizeCategoryIcons(raw) {
        const source = raw && typeof raw === 'object' ? raw : {};
        const normalized = {};
        CATEGORY_KEYS.forEach(function (key) {
            normalized[key] = typeof source[key] === 'string' && source[key] ? source[key] : DEFAULT_CATEGORY_ICONS[key];
        });
        return normalized;
    }

    function normalizeRatingLabels(raw) {
        const source = raw && typeof raw === 'object' ? raw : {};
        return {
            high: typeof source.high === 'string' && source.high ? source.high : DEFAULT_RATING_LABELS.high,
            moderate: typeof source.moderate === 'string' && source.moderate ? source.moderate : DEFAULT_RATING_LABELS.moderate,
            low: typeof source.low === 'string' && source.low ? source.low : DEFAULT_RATING_LABELS.low
        };
    }

    function ratingLabel(level, labels) {
        const safeLabels = normalizeRatingLabels(labels);
        if (level === 'high') {
            return safeLabels.high;
        }
        if (level === 'moderate') {
            return safeLabels.moderate;
        }
        return safeLabels.low;
    }

    registerBlockType('rueckenwinde/vanlife-country-comparison', {
        title: __('Vanlife-Ländervergleich', 'rueckenwinde'),
        icon: 'chart-bar',
        category: 'design',

        attributes: {
            heading: { type: 'string', default: 'Vanlife-Ländervergleich' },
            intro: { type: 'string', default: 'Vergleiche Panamericana-Länder nach Freistehen, Kosten, Sicherheit, Straßen und Bürokratie.' },
            accentColor: { type: 'string', default: '#FFC400' },
            categoryLabels: { type: 'object', default: DEFAULT_CATEGORY_LABELS },
            categoryIcons: { type: 'object', default: DEFAULT_CATEGORY_ICONS },
            ratingLabels: { type: 'object', default: DEFAULT_RATING_LABELS },
            countries: { type: 'array', default: DEFAULT_COUNTRIES }
        },

        edit: function (props) {
            const { attributes, setAttributes, isSelected } = props;
            const blockProps = useBlockProps({
                className: 'vanlife-comparison-block-editor'
            });

            const countries = normalizeCountries(attributes.countries);
            const categoryLabels = normalizeCategoryLabels(attributes.categoryLabels);
            const categoryIcons = normalizeCategoryIcons(attributes.categoryIcons);
            const labels = normalizeRatingLabels(attributes.ratingLabels);

            function updateCountry(index, updates) {
                const next = countries.slice();
                next[index] = Object.assign({}, next[index], updates);
                setAttributes({ countries: next });
            }

            function updateRating(index, key, value) {
                const country = countries[index];
                const ratings = Object.assign({}, country.ratings, {});
                ratings[key] = value;
                updateCountry(index, { ratings: ratings });
            }

            function updateTip(index, key, value) {
                const country = countries[index];
                const tips = Object.assign({}, country.tips, {});
                tips[key] = value;
                updateCountry(index, { tips: tips });
            }

            function removeCountry(index) {
                setAttributes({
                    countries: countries.filter(function (_, i) {
                        return i !== index;
                    })
                });
            }

            function addCountry() {
                setAttributes({
                    countries: countries.concat([
                        {
                            name: 'Neues Land',
                            ratings: { freeCamping: 'moderate', costs: 'moderate', safety: 'moderate', roads: 'moderate', bureaucracy: 'moderate' },
                            tips: { freeCamping: '', costs: '', safety: '', roads: '', bureaucracy: '' }
                        }
                    ])
                });
            }

            if (!isSelected) {
                return el(
                    'div',
                    blockProps,
                    el('div', { className: 'vanlife-editor-collapsed' },
                        el('h3', null, attributes.heading || 'Vanlife-Ländervergleich'),
                        el('p', null, attributes.intro || ''),
                        el('p', { className: 'vanlife-editor-collapsed-meta' }, countries.length + ' Länder konfiguriert. Block anklicken zum Bearbeiten.')
                    )
                );
            }

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: __('Allgemeine Einstellungen', 'rueckenwinde'), initialOpen: true },
                        el(TextControl, {
                            label: __('Überschrift', 'rueckenwinde'),
                            value: attributes.heading || '',
                            onChange: function (value) {
                                setAttributes({ heading: value });
                            }
                        }),
                        el(TextareaControl, {
                            label: __('Einleitung', 'rueckenwinde'),
                            value: attributes.intro || '',
                            onChange: function (value) {
                                setAttributes({ intro: value });
                            }
                        }),
                        el(TextControl, {
                            label: __('Akzentfarbe', 'rueckenwinde'),
                            value: attributes.accentColor || '#FFC400',
                            onChange: function (value) {
                                setAttributes({ accentColor: value || '#FFC400' });
                            },
                            help: __('Hex-Farbe, z. B. #FFC400', 'rueckenwinde')
                        }),
                        el(TextControl, {
                            label: __('Kategorie: Freistehen', 'rueckenwinde'),
                            value: categoryLabels.freeCamping,
                            onChange: function (value) {
                                setAttributes({ categoryLabels: Object.assign({}, categoryLabels, { freeCamping: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Kategorie: Kosten', 'rueckenwinde'),
                            value: categoryLabels.costs,
                            onChange: function (value) {
                                setAttributes({ categoryLabels: Object.assign({}, categoryLabels, { costs: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Kategorie: Sicherheit', 'rueckenwinde'),
                            value: categoryLabels.safety,
                            onChange: function (value) {
                                setAttributes({ categoryLabels: Object.assign({}, categoryLabels, { safety: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Kategorie: Straßen', 'rueckenwinde'),
                            value: categoryLabels.roads,
                            onChange: function (value) {
                                setAttributes({ categoryLabels: Object.assign({}, categoryLabels, { roads: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Kategorie: Bürokratie', 'rueckenwinde'),
                            value: categoryLabels.bureaucracy,
                            onChange: function (value) {
                                setAttributes({ categoryLabels: Object.assign({}, categoryLabels, { bureaucracy: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Icon: Freistehen', 'rueckenwinde'),
                            value: categoryIcons.freeCamping,
                            onChange: function (value) {
                                setAttributes({ categoryIcons: Object.assign({}, categoryIcons, { freeCamping: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Icon: Kosten', 'rueckenwinde'),
                            value: categoryIcons.costs,
                            onChange: function (value) {
                                setAttributes({ categoryIcons: Object.assign({}, categoryIcons, { costs: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Icon: Sicherheit', 'rueckenwinde'),
                            value: categoryIcons.safety,
                            onChange: function (value) {
                                setAttributes({ categoryIcons: Object.assign({}, categoryIcons, { safety: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Icon: Straßen', 'rueckenwinde'),
                            value: categoryIcons.roads,
                            onChange: function (value) {
                                setAttributes({ categoryIcons: Object.assign({}, categoryIcons, { roads: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Icon: Bürokratie', 'rueckenwinde'),
                            value: categoryIcons.bureaucracy,
                            onChange: function (value) {
                                setAttributes({ categoryIcons: Object.assign({}, categoryIcons, { bureaucracy: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Skala: Sehr geeignet', 'rueckenwinde'),
                            value: labels.high,
                            onChange: function (value) {
                                setAttributes({ ratingLabels: Object.assign({}, labels, { high: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Skala: Mittel', 'rueckenwinde'),
                            value: labels.moderate,
                            onChange: function (value) {
                                setAttributes({ ratingLabels: Object.assign({}, labels, { moderate: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: __('Skala: Wenig geeignet', 'rueckenwinde'),
                            value: labels.low,
                            onChange: function (value) {
                                setAttributes({ ratingLabels: Object.assign({}, labels, { low: value }) });
                            }
                        })
                    )
                ),
                el('h3', null, attributes.heading || 'Vanlife-Ländervergleich'),
                el('p', null, attributes.intro || ''),
                el('p', { className: 'vanlife-editor-note' }, __('Bearbeite unten Länder, Bewertungen und Tooltip-Texte.', 'rueckenwinde')),
                countries.map(function (country, index) {
                    return el(
                        'div',
                        { key: 'country-' + index, className: 'vanlife-editor-country-card' },
                        el(TextControl, {
                            label: __('Land', 'rueckenwinde') + ' ' + (index + 1),
                            value: country.name,
                            onChange: function (value) {
                                updateCountry(index, { name: value });
                            }
                        }),
                        CATEGORY_KEYS.map(function (key) {
                            return el(
                                'div',
                                { key: key, className: 'vanlife-editor-category-row' },
                                el('strong', null, categoryLabels[key]),
                                el(SelectControl, {
                                    label: __('Bewertung', 'rueckenwinde'),
                                    value: country.ratings[key],
                                    options: [
                                        { label: labels.high + ' (Grün)', value: 'high' },
                                        { label: labels.moderate + ' (Gelb)', value: 'moderate' },
                                        { label: labels.low + ' (Rot)', value: 'low' }
                                    ],
                                    onChange: function (value) {
                                        updateRating(index, key, value);
                                    }
                                }),
                                el(TextControl, {
                                    label: __('Tooltip-Hinweis', 'rueckenwinde'),
                                    value: country.tips[key] || '',
                                    onChange: function (value) {
                                        updateTip(index, key, value);
                                    }
                                })
                            );
                        }),
                        el('div', { className: 'vanlife-editor-country-preview' },
                            CATEGORY_KEYS.map(function (key) {
                                return el('span', {
                                    key: 'preview-' + key,
                                    className: 'vanlife-editor-badge is-' + country.ratings[key]
                                }, categoryLabels[key] + ': ' + ratingLabel(country.ratings[key], labels));
                            })
                        ),
                        el(Button, {
                            variant: 'secondary',
                            isDestructive: true,
                            onClick: function () {
                                removeCountry(index);
                            }
                        }, __('Land entfernen', 'rueckenwinde'))
                    );
                }),
                el(Button, {
                    variant: 'primary',
                    onClick: addCountry
                }, __('Land hinzufügen', 'rueckenwinde'))
            );
        },

        save: function (props) {
            const { attributes } = props;
            const countries = normalizeCountries(attributes.countries);
            const hasUruguay = countries.some(function (country) {
                return country.name.toLowerCase() === 'uruguay';
            });
            const defaultCountry = hasUruguay
                ? 'uruguay'
                : (countries[0] && countries[0].name ? countries[0].name.toLowerCase() : '');
            const blockProps = useBlockProps.save({
                className: 'wp-block-rueckenwinde-vanlife-country-comparison',
                style: {
                    '--vanlife-accent': attributes.accentColor || '#FFC400'
                },
                'data-default-country': defaultCountry
            });

            const heading = attributes.heading || 'Vanlife-Ländervergleich';
            const intro = attributes.intro || '';
            const categoryLabels = normalizeCategoryLabels(attributes.categoryLabels);
            const categoryIcons = normalizeCategoryIcons(attributes.categoryIcons);
            const labels = normalizeRatingLabels(attributes.ratingLabels);

            return el(
                'section',
                blockProps,
                el('div', { className: 'vanlife-comparison-header' },
                    el('h3', { className: 'vanlife-comparison-heading' }, heading),
                    el('p', { className: 'vanlife-comparison-intro' }, intro),
                    el('button', { type: 'button', className: 'vanlife-toggle-countries', 'aria-expanded': 'false' }, 'Alle Länder anzeigen')
                ),
                el('div', { className: 'vanlife-comparison-filters' },
                    el('label', null,
                        'Land',
                        el('select', { className: 'vanlife-filter-country' },
                            el('option', { value: 'all' }, 'Alle Länder'),
                            countries.map(function (country, index) {
                                return el('option', { key: 'country-option-' + index, value: country.name.toLowerCase() }, country.name);
                            })
                        )
                    ),
                    el('label', null,
                        'Kategorie',
                        el('select', { className: 'vanlife-filter-category' },
                            el('option', { value: 'all' }, 'Alle Kategorien'),
                            CATEGORY_KEYS.map(function (key) {
                                return el('option', { key: 'category-option-' + key, value: key }, categoryLabels[key]);
                            })
                        )
                    )
                ),
                el('div', { className: 'vanlife-comparison-scroll' },
                    el('div', { className: 'vanlife-comparison-table' },
                        el('div', { className: 'vanlife-comparison-row is-head' },
                            el('div', { className: 'vanlife-comparison-col country-col' }, 'Land'),
                            el('div', { className: 'vanlife-comparison-col category-col', 'data-category-col': 'freeCamping' }, categoryIcons.freeCamping + ' ' + categoryLabels.freeCamping),
                            el('div', { className: 'vanlife-comparison-col category-col', 'data-category-col': 'costs' }, categoryIcons.costs + ' ' + categoryLabels.costs),
                            el('div', { className: 'vanlife-comparison-col category-col', 'data-category-col': 'safety' }, categoryIcons.safety + ' ' + categoryLabels.safety),
                            el('div', { className: 'vanlife-comparison-col category-col', 'data-category-col': 'roads' }, categoryIcons.roads + ' ' + categoryLabels.roads),
                            el('div', { className: 'vanlife-comparison-col category-col', 'data-category-col': 'bureaucracy' }, categoryIcons.bureaucracy + ' ' + categoryLabels.bureaucracy)
                        ),
                        countries.map(function (country, index) {
                            return el('div', {
                                    key: 'row-' + index,
                                    className: 'vanlife-comparison-row vanlife-country-row',
                                    'data-country': country.name.toLowerCase()
                                },
                                el('div', { className: 'vanlife-comparison-col country-col country-name' }, country.name),
                                CATEGORY_KEYS.map(function (key) {
                                    const level = country.ratings[key];
                                    const tip = country.tips[key] || '';
                                    return el('div', {
                                            key: 'cell-' + key,
                                            className: 'vanlife-comparison-col vanlife-cell is-' + level,
                                            'data-category-col': key,
                                            'data-rating': level,
                                            'data-tip': tip
                                        },
                                        el('button', {
                                            type: 'button',
                                            className: 'vanlife-cell-trigger',
                                            'aria-label': categoryLabels[key] + ' - ' + ratingLabel(level, labels)
                                        },
                                            el('span', { className: 'vanlife-rating-icons' },
                                                level === 'high' ? '+++': (level === 'moderate' ? '++-' : '+--')
                                            ),
                                            el('span', { className: 'vanlife-rating-label' }, ratingLabel(level, labels))
                                        ),
                                        el('span', { className: 'vanlife-cell-tooltip', role: 'tooltip' }, tip)
                                    );
                                })
                            );
                        })
                    )
                )
            );
        }
    });
})(window.wp);
