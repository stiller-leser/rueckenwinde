(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { Disabled, PanelBody, TextControl } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    function toPositiveInt(value, fallback) {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed < 0) {
            return fallback;
        }
        return parsed;
    }

    registerBlockType('rueckenwinde/kostenrechner', {
        edit: function (props) {
            const blockProps = useBlockProps();
            const { attributes, setAttributes } = props;
            const styleCosts = attributes.styleCosts || { low: 400, mittel: 800, komfort: 1400 };
            const vehicleMonthlyCosts = attributes.vehicleMonthlyCosts || { klein: 300, van: 600, lkw: 1000 };
            const shippingCosts = attributes.shippingCosts || { klein: 2000, van: 3500, lkw: 6000 };
            const costDriverTexts = attributes.costDriverTexts || {
                lkw: 'Treibstoff und Verschiffung',
                komfort: 'Lebenshaltung und Unterkunft',
                shortDuration: 'Verschiffung (kurze Reisedauer)',
                manyPeople: 'Lebenshaltung fuer mehrere Personen',
                van: 'Fahrzeugbetrieb und Wartung',
                default: 'Laufende Reiseausgaben'
            };

            return el(
                'div',
                blockProps,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Texte', initialOpen: true },
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
                        }),
                        el(TextControl, {
                            label: 'Label Kostentreiber',
                            value: attributes.costDriverLabel || '',
                            onChange: function (value) {
                                setAttributes({ costDriverLabel: value });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Texte Kostentreiber', initialOpen: false },
                        el(TextControl, {
                            label: 'Bei LKW',
                            value: costDriverTexts.lkw || '',
                            onChange: function (value) {
                                setAttributes({ costDriverTexts: Object.assign({}, costDriverTexts, { lkw: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Bei Komfort',
                            value: costDriverTexts.komfort || '',
                            onChange: function (value) {
                                setAttributes({ costDriverTexts: Object.assign({}, costDriverTexts, { komfort: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Bei kurzer Dauer (<= 6 Monate)',
                            value: costDriverTexts.shortDuration || '',
                            onChange: function (value) {
                                setAttributes({ costDriverTexts: Object.assign({}, costDriverTexts, { shortDuration: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Bei 4+ Personen',
                            value: costDriverTexts.manyPeople || '',
                            onChange: function (value) {
                                setAttributes({ costDriverTexts: Object.assign({}, costDriverTexts, { manyPeople: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Bei Van',
                            value: costDriverTexts.van || '',
                            onChange: function (value) {
                                setAttributes({ costDriverTexts: Object.assign({}, costDriverTexts, { van: value }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Standard',
                            value: costDriverTexts.default || '',
                            onChange: function (value) {
                                setAttributes({ costDriverTexts: Object.assign({}, costDriverTexts, { default: value }) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Reisestil (EUR pro Person / Monat)', initialOpen: false },
                        el(TextControl, {
                            label: 'Low Budget',
                            type: 'number',
                            value: styleCosts.low,
                            onChange: function (value) {
                                setAttributes({
                                    styleCosts: Object.assign({}, styleCosts, {
                                        low: toPositiveInt(value, 400)
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Mittel',
                            type: 'number',
                            value: styleCosts.mittel,
                            onChange: function (value) {
                                setAttributes({
                                    styleCosts: Object.assign({}, styleCosts, {
                                        mittel: toPositiveInt(value, 800)
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Komfort',
                            type: 'number',
                            value: styleCosts.komfort,
                            onChange: function (value) {
                                setAttributes({
                                    styleCosts: Object.assign({}, styleCosts, {
                                        komfort: toPositiveInt(value, 1400)
                                    })
                                });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Fahrzeugkosten (EUR pro Monat)', initialOpen: false },
                        el(TextControl, {
                            label: 'Motorrad/Kleinwagen',
                            type: 'number',
                            value: vehicleMonthlyCosts.klein,
                            onChange: function (value) {
                                setAttributes({
                                    vehicleMonthlyCosts: Object.assign({}, vehicleMonthlyCosts, {
                                        klein: toPositiveInt(value, 300)
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Van/4x4',
                            type: 'number',
                            value: vehicleMonthlyCosts.van,
                            onChange: function (value) {
                                setAttributes({
                                    vehicleMonthlyCosts: Object.assign({}, vehicleMonthlyCosts, {
                                        van: toPositiveInt(value, 600)
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'LKW/Expeditionsmobil',
                            type: 'number',
                            value: vehicleMonthlyCosts.lkw,
                            onChange: function (value) {
                                setAttributes({
                                    vehicleMonthlyCosts: Object.assign({}, vehicleMonthlyCosts, {
                                        lkw: toPositiveInt(value, 1000)
                                    })
                                });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Verschiffung (einmalig, EUR)', initialOpen: false },
                        el(TextControl, {
                            label: 'Motorrad/Kleinwagen',
                            type: 'number',
                            value: shippingCosts.klein,
                            onChange: function (value) {
                                setAttributes({
                                    shippingCosts: Object.assign({}, shippingCosts, {
                                        klein: toPositiveInt(value, 2000)
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Van/4x4',
                            type: 'number',
                            value: shippingCosts.van,
                            onChange: function (value) {
                                setAttributes({
                                    shippingCosts: Object.assign({}, shippingCosts, {
                                        van: toPositiveInt(value, 3500)
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'LKW/Expeditionsmobil',
                            type: 'number',
                            value: shippingCosts.lkw,
                            onChange: function (value) {
                                setAttributes({
                                    shippingCosts: Object.assign({}, shippingCosts, {
                                        lkw: toPositiveInt(value, 6000)
                                    })
                                });
                            }
                        })
                    )
                ),
                el(
                    Disabled,
                    null,
                    el(ServerSideRender, {
                        block: 'rueckenwinde/kostenrechner',
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
