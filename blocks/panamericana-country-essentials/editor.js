(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, Button, SelectControl, Disabled } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const { useState, useEffect } = wp.element;
    const el = wp.element.createElement;

    const KEYS = ['insurance', 'sim', 'cash', 'spareParts', 'apps'];
    const KEY_LABELS = {
        insurance: 'Versicherung',
        sim: 'SIM',
        cash: 'Bargeld',
        spareParts: 'Ersatzteile',
        apps: 'Apps'
    };

    const DEFAULT_COUNTRY = {
        name: 'Neues Land',
        flagIcon: '🏳️',
        essentials: {
            insurance: '',
            sim: '',
            cash: '',
            spareParts: '',
            apps: ''
        },
        tips: {
            insurance: '',
            sim: '',
            cash: '',
            spareParts: '',
            apps: ''
        }
    };

    function normalizeCountry(country, index) {
        const safe = country && typeof country === 'object' ? country : {};
        const essentials = safe.essentials && typeof safe.essentials === 'object' ? safe.essentials : {};
        const tips = safe.tips && typeof safe.tips === 'object' ? safe.tips : {};

        const normalized = {
            name: typeof safe.name === 'string' && safe.name ? safe.name : ('Land ' + (index + 1)),
            flagIcon: typeof safe.flagIcon === 'string' && safe.flagIcon ? safe.flagIcon : '🏳️',
            essentials: {},
            tips: {}
        };

        KEYS.forEach(function (key) {
            normalized.essentials[key] = typeof essentials[key] === 'string' ? essentials[key] : '';
            normalized.tips[key] = typeof tips[key] === 'string' ? tips[key] : '';
        });

        return normalized;
    }

    function normalizeCountries(countries) {
        if (!Array.isArray(countries) || !countries.length) {
            return [normalizeCountry(DEFAULT_COUNTRY, 0)];
        }
        return countries.map(normalizeCountry);
    }

    registerBlockType('rueckenwinde/panamericana-country-essentials', {
        edit: function (props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const countries = normalizeCountries(attributes.countries);
            const [activeIndex, setActiveIndex] = useState(0);
            const activeCountry = countries[activeIndex] || countries[0];

            useEffect(function () {
                if (activeIndex > countries.length - 1) {
                    setActiveIndex(Math.max(0, countries.length - 1));
                }
            }, [activeIndex, countries.length]);

            function saveCountries(next) {
                setAttributes({ countries: next });
            }

            function updateCountry(index, changes) {
                const next = countries.slice();
                next[index] = Object.assign({}, next[index], changes);
                saveCountries(next);
            }

            function updateCountryField(index, scope, key, value) {
                const next = countries.slice();
                const target = Object.assign({}, next[index]);
                const scoped = Object.assign({}, target[scope]);
                scoped[key] = value;
                target[scope] = scoped;
                next[index] = target;
                saveCountries(next);
            }

            function addCountry() {
                const next = countries.concat([normalizeCountry(DEFAULT_COUNTRY, countries.length)]);
                saveCountries(next);
                setActiveIndex(next.length - 1);
            }

            function duplicateCountry(index) {
                const clone = normalizeCountry(countries[index], index);
                const next = countries.slice();
                next.splice(index + 1, 0, clone);
                saveCountries(next);
                setActiveIndex(index + 1);
            }

            function removeCountry(index) {
                if (countries.length <= 1) {
                    saveCountries([normalizeCountry(DEFAULT_COUNTRY, 0)]);
                    setActiveIndex(0);
                    return;
                }
                const next = countries.filter(function (_, i) {
                    return i !== index;
                });
                saveCountries(next);
                setActiveIndex(Math.max(0, index - 1));
            }

            function moveCountry(from, to) {
                if (to < 0 || to >= countries.length || from === to) {
                    return;
                }
                const next = countries.slice();
                const moved = next.splice(from, 1)[0];
                next.splice(to, 0, moved);
                saveCountries(next);
                setActiveIndex(to);
            }

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Allgemein', initialOpen: true },
                        el(TextControl, {
                            label: 'Titel',
                            value: attributes.title || '',
                            onChange: function (value) {
                                setAttributes({ title: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Untertitel',
                            value: attributes.subtitle || '',
                            onChange: function (value) {
                                setAttributes({ subtitle: value });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Laender (CRUD)', initialOpen: true },
                        el(SelectControl, {
                            label: 'Land auswaehlen',
                            value: String(activeIndex),
                            options: countries.map(function (country, index) {
                                return {
                                    label: (index + 1) + '. ' + country.flagIcon + ' ' + country.name,
                                    value: String(index)
                                };
                            }),
                            onChange: function (value) {
                                setActiveIndex(parseInt(value, 10) || 0);
                            }
                        }),
                        el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' } },
                            el(Button, { variant: 'secondary', onClick: addCountry }, 'Neu'),
                            el(Button, { variant: 'secondary', onClick: function () { duplicateCountry(activeIndex); } }, 'Duplizieren'),
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () { moveCountry(activeIndex, activeIndex - 1); },
                                disabled: activeIndex === 0
                            }, 'Nach oben'),
                            el(Button, {
                                variant: 'secondary',
                                onClick: function () { moveCountry(activeIndex, activeIndex + 1); },
                                disabled: activeIndex === countries.length - 1
                            }, 'Nach unten'),
                            el(Button, {
                                variant: 'tertiary',
                                isDestructive: true,
                                onClick: function () { removeCountry(activeIndex); }
                            }, 'Loeschen')
                        ),
                        activeCountry && el(TextControl, {
                            label: 'Landname',
                            value: activeCountry.name,
                            onChange: function (value) {
                                updateCountry(activeIndex, { name: value });
                            }
                        }),
                        activeCountry && el(TextControl, {
                            label: 'Flag-Icon',
                            value: activeCountry.flagIcon,
                            onChange: function (value) {
                                updateCountry(activeIndex, { flagIcon: value });
                            }
                        }),
                        activeCountry && KEYS.map(function (key) {
                            return el('div', { key: key, style: { marginTop: '10px' } },
                                el(TextareaControl, {
                                    label: KEY_LABELS[key] + ' - Text',
                                    rows: 3,
                                    value: activeCountry.essentials[key],
                                    onChange: function (value) {
                                        updateCountryField(activeIndex, 'essentials', key, value);
                                    }
                                }),
                                el(TextControl, {
                                    label: KEY_LABELS[key] + ' - Short-Tip',
                                    value: activeCountry.tips[key],
                                    onChange: function (value) {
                                        updateCountryField(activeIndex, 'tips', key, value);
                                    }
                                })
                            );
                        })
                    )
                ),
                el(
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/panamericana-country-essentials',
                        attributes: attributes,
                        httpMethod: 'POST'
                    })
                )
            );
        },

        save: function () {
            return null;
        }
    });
})(window.wp);
