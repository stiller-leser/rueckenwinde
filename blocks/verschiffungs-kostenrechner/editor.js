(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { Disabled, PanelBody, TextControl, SelectControl } = wp.components;
    const { ServerSideRender } = wp.serverSideRender;
    const el = wp.element.createElement;

    function toPositiveNumber(value, fallback) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed < 0) {
            return fallback;
        }
        return parsed;
    }

    function modelOptions() {
        return [
            { label: 'Rate pro m3', value: 'volume' },
            { label: 'Rate pro Fahrzeuglaenge', value: 'length' }
        ];
    }

    registerBlockType('rueckenwinde/verschiffungs-kostenrechner', {
        edit: function (props) {
            const blockProps = useBlockProps();
            const { attributes, setAttributes } = props;

            const handlingFees = attributes.handlingFees || { container: 650, flatRack: 950, roro: 500 };
            const ratePerM3 = attributes.ratePerM3 || { container: 110, flatRack: 145, roro: 80 };
            const ratePerLengthMeter = attributes.ratePerLengthMeter || { container: 230, flatRack: 300, roro: 170 };
            const pricingModelByShippingType = attributes.pricingModelByShippingType || { container: 'volume', flatRack: 'length', roro: 'length' };
            const vehicleSurcharge = attributes.vehicleSurcharge || { motorrad: 0, van: 260, lkw: 640 };
            const containerDimensions = attributes.containerDimensions || {
                standard: { length: 12032, width: 2340, height: 2590 },
                highCube: { length: 12032, width: 2340, height: 2590 }
            };
            const standardContainer = containerDimensions.standard || { length: 12032, width: 2340, height: 2590 };
            const highCubeContainer = containerDimensions.highCube || { length: 12032, width: 2340, height: 2590 };
            const containerFixedFreightByRoute = attributes.containerFixedFreightByRoute || {
                hamburgMontevideo: 4200,
                darienGap: 2200,
                hamburgHalifax: 3600
            };
            const handlingFeesByRoute = attributes.handlingFeesByRoute || {
                hamburgMontevideo: { container: 770, flatRack: 1070, roro: 620 },
                darienGap: { container: 650, flatRack: 950, roro: 500 },
                hamburgHalifax: { container: 730, flatRack: 1030, roro: 580 }
            };
            const ratePerM3ByRoute = attributes.ratePerM3ByRoute || {
                hamburgMontevideo: { flatRack: 171, roro: 94 },
                darienGap: { flatRack: 145, roro: 80 },
                hamburgHalifax: { flatRack: 156, roro: 86 }
            };
            const ratePerLengthMeterByRoute = attributes.ratePerLengthMeterByRoute || {
                hamburgMontevideo: { flatRack: 354, roro: 200 },
                darienGap: { flatRack: 300, roro: 170 },
                hamburgHalifax: { flatRack: 324, roro: 184 }
            };

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
                        }),
                        el(TextControl, {
                            label: 'Button-Text',
                            value: attributes.downloadButtonLabel || '',
                            onChange: function (value) {
                                setAttributes({ downloadButtonLabel: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Agenten-Liste URL',
                            value: attributes.agentListUrl || '',
                            onChange: function (value) {
                                setAttributes({ agentListUrl: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'USD -> EUR Kurs',
                            type: 'number',
                            step: '0.01',
                            value: attributes.currencyRateUsdToEur,
                            onChange: function (value) {
                                setAttributes({ currencyRateUsdToEur: toPositiveNumber(value, 0.92) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Hafen-Handling-Fees (USD, Fixkosten)', initialOpen: false },
                        el(TextControl, {
                            label: 'Container',
                            type: 'number',
                            value: handlingFees.container,
                            onChange: function (value) {
                                setAttributes({ handlingFees: Object.assign({}, handlingFees, { container: toPositiveNumber(value, 650) }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Flat Rack',
                            type: 'number',
                            value: handlingFees.flatRack,
                            onChange: function (value) {
                                setAttributes({ handlingFees: Object.assign({}, handlingFees, { flatRack: toPositiveNumber(value, 950) }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'RoRo',
                            type: 'number',
                            value: handlingFees.roro,
                            onChange: function (value) {
                                setAttributes({ handlingFees: Object.assign({}, handlingFees, { roro: toPositiveNumber(value, 500) }) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Frachtrate pro m3 (USD, nur Flat Rack / RoRo)', initialOpen: false },
                        el(TextControl, {
                            label: 'Flat Rack',
                            type: 'number',
                            value: ratePerM3.flatRack,
                            onChange: function (value) {
                                setAttributes({ ratePerM3: Object.assign({}, ratePerM3, { flatRack: toPositiveNumber(value, 145) }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'RoRo',
                            type: 'number',
                            value: ratePerM3.roro,
                            onChange: function (value) {
                                setAttributes({ ratePerM3: Object.assign({}, ratePerM3, { roro: toPositiveNumber(value, 80) }) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Frachtrate pro Fahrzeuglaenge (USD / m, nur Flat Rack / RoRo)', initialOpen: false },
                        el(TextControl, {
                            label: 'Flat Rack',
                            type: 'number',
                            value: ratePerLengthMeter.flatRack,
                            onChange: function (value) {
                                setAttributes({ ratePerLengthMeter: Object.assign({}, ratePerLengthMeter, { flatRack: toPositiveNumber(value, 300) }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'RoRo',
                            type: 'number',
                            value: ratePerLengthMeter.roro,
                            onChange: function (value) {
                                setAttributes({ ratePerLengthMeter: Object.assign({}, ratePerLengthMeter, { roro: toPositiveNumber(value, 170) }) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Abrechnungslogik je Versandart', initialOpen: false },
                        el(SelectControl, {
                            label: 'Flat Rack',
                            value: pricingModelByShippingType.flatRack,
                            options: modelOptions(),
                            onChange: function (value) {
                                setAttributes({
                                    pricingModelByShippingType: Object.assign({}, pricingModelByShippingType, { flatRack: value })
                                });
                            }
                        }),
                        el(SelectControl, {
                            label: 'RoRo',
                            value: pricingModelByShippingType.roro,
                            options: modelOptions(),
                            onChange: function (value) {
                                setAttributes({
                                    pricingModelByShippingType: Object.assign({}, pricingModelByShippingType, { roro: value })
                                });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Fahrzeug-Aufschlag (USD)', initialOpen: false },
                        el(TextControl, {
                            label: 'Motorrad',
                            type: 'number',
                            value: vehicleSurcharge.motorrad,
                            onChange: function (value) {
                                setAttributes({ vehicleSurcharge: Object.assign({}, vehicleSurcharge, { motorrad: toPositiveNumber(value, 0) }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'Van',
                            type: 'number',
                            value: vehicleSurcharge.van,
                            onChange: function (value) {
                                setAttributes({ vehicleSurcharge: Object.assign({}, vehicleSurcharge, { van: toPositiveNumber(value, 260) }) });
                            }
                        }),
                        el(TextControl, {
                            label: 'LKW',
                            type: 'number',
                            value: vehicleSurcharge.lkw,
                            onChange: function (value) {
                                setAttributes({ vehicleSurcharge: Object.assign({}, vehicleSurcharge, { lkw: toPositiveNumber(value, 640) }) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Container-Masse & Reifen', initialOpen: false },
                        el(TextControl, {
                            label: 'Standard-Container Laenge (cm)',
                            type: 'number',
                            value: standardContainer.length,
                            onChange: function (value) {
                                setAttributes({
                                    containerDimensions: Object.assign({}, containerDimensions, {
                                        standard: Object.assign({}, standardContainer, { length: toPositiveNumber(value, 12032) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Standard-Container Breite (cm)',
                            type: 'number',
                            value: standardContainer.width,
                            onChange: function (value) {
                                setAttributes({
                                    containerDimensions: Object.assign({}, containerDimensions, {
                                        standard: Object.assign({}, standardContainer, { width: toPositiveNumber(value, 2340) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Standard-Container Hoehe (cm)',
                            type: 'number',
                            value: standardContainer.height,
                            onChange: function (value) {
                                setAttributes({
                                    containerDimensions: Object.assign({}, containerDimensions, {
                                        standard: Object.assign({}, standardContainer, { height: toPositiveNumber(value, 2590) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'High-Cube Laenge (cm)',
                            type: 'number',
                            value: highCubeContainer.length,
                            onChange: function (value) {
                                setAttributes({
                                    containerDimensions: Object.assign({}, containerDimensions, {
                                        highCube: Object.assign({}, highCubeContainer, { length: toPositiveNumber(value, 12032) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'High-Cube Breite (cm)',
                            type: 'number',
                            value: highCubeContainer.width,
                            onChange: function (value) {
                                setAttributes({
                                    containerDimensions: Object.assign({}, containerDimensions, {
                                        highCube: Object.assign({}, highCubeContainer, { width: toPositiveNumber(value, 2340) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'High-Cube Hoehe (cm)',
                            type: 'number',
                            value: highCubeContainer.height,
                            onChange: function (value) {
                                setAttributes({
                                    containerDimensions: Object.assign({}, containerDimensions, {
                                        highCube: Object.assign({}, highCubeContainer, { height: toPositiveNumber(value, 2590) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hoehenreduktion mit Containerreifen (cm)',
                            type: 'number',
                            value: attributes.containerTyreReductionCm,
                            onChange: function (value) {
                                setAttributes({ containerTyreReductionCm: toPositiveNumber(value, 12) });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Container-Festpreis je Route (USD)', initialOpen: false },
                        el(TextControl, {
                            label: 'Hamburg / Montevideo',
                            type: 'number',
                            value: containerFixedFreightByRoute.hamburgMontevideo,
                            onChange: function (value) {
                                setAttributes({
                                    containerFixedFreightByRoute: Object.assign({}, containerFixedFreightByRoute, { hamburgMontevideo: toPositiveNumber(value, 4200) })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap Panama / Kolumbien',
                            type: 'number',
                            value: containerFixedFreightByRoute.darienGap,
                            onChange: function (value) {
                                setAttributes({
                                    containerFixedFreightByRoute: Object.assign({}, containerFixedFreightByRoute, { darienGap: toPositiveNumber(value, 2200) })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg / Halifax',
                            type: 'number',
                            value: containerFixedFreightByRoute.hamburgHalifax,
                            onChange: function (value) {
                                setAttributes({
                                    containerFixedFreightByRoute: Object.assign({}, containerFixedFreightByRoute, { hamburgHalifax: toPositiveNumber(value, 3600) })
                                });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Handling-Fees je Route (USD)', initialOpen: false },
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - Container',
                            type: 'number',
                            value: handlingFeesByRoute.hamburgMontevideo.container,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        hamburgMontevideo: Object.assign({}, handlingFeesByRoute.hamburgMontevideo, { container: toPositiveNumber(value, 770) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - Flat Rack',
                            type: 'number',
                            value: handlingFeesByRoute.hamburgMontevideo.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        hamburgMontevideo: Object.assign({}, handlingFeesByRoute.hamburgMontevideo, { flatRack: toPositiveNumber(value, 1070) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - RoRo',
                            type: 'number',
                            value: handlingFeesByRoute.hamburgMontevideo.roro,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        hamburgMontevideo: Object.assign({}, handlingFeesByRoute.hamburgMontevideo, { roro: toPositiveNumber(value, 620) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - Container',
                            type: 'number',
                            value: handlingFeesByRoute.darienGap.container,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        darienGap: Object.assign({}, handlingFeesByRoute.darienGap, { container: toPositiveNumber(value, 650) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - Flat Rack',
                            type: 'number',
                            value: handlingFeesByRoute.darienGap.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        darienGap: Object.assign({}, handlingFeesByRoute.darienGap, { flatRack: toPositiveNumber(value, 950) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - RoRo',
                            type: 'number',
                            value: handlingFeesByRoute.darienGap.roro,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        darienGap: Object.assign({}, handlingFeesByRoute.darienGap, { roro: toPositiveNumber(value, 500) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - Container',
                            type: 'number',
                            value: handlingFeesByRoute.hamburgHalifax.container,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        hamburgHalifax: Object.assign({}, handlingFeesByRoute.hamburgHalifax, { container: toPositiveNumber(value, 730) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - Flat Rack',
                            type: 'number',
                            value: handlingFeesByRoute.hamburgHalifax.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        hamburgHalifax: Object.assign({}, handlingFeesByRoute.hamburgHalifax, { flatRack: toPositiveNumber(value, 1030) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - RoRo',
                            type: 'number',
                            value: handlingFeesByRoute.hamburgHalifax.roro,
                            onChange: function (value) {
                                setAttributes({
                                    handlingFeesByRoute: Object.assign({}, handlingFeesByRoute, {
                                        hamburgHalifax: Object.assign({}, handlingFeesByRoute.hamburgHalifax, { roro: toPositiveNumber(value, 580) })
                                    })
                                });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Rate pro m3 je Route (Flat Rack / RoRo)', initialOpen: false },
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - Flat Rack',
                            type: 'number',
                            value: ratePerM3ByRoute.hamburgMontevideo.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerM3ByRoute: Object.assign({}, ratePerM3ByRoute, {
                                        hamburgMontevideo: Object.assign({}, ratePerM3ByRoute.hamburgMontevideo, { flatRack: toPositiveNumber(value, 171) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - RoRo',
                            type: 'number',
                            value: ratePerM3ByRoute.hamburgMontevideo.roro,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerM3ByRoute: Object.assign({}, ratePerM3ByRoute, {
                                        hamburgMontevideo: Object.assign({}, ratePerM3ByRoute.hamburgMontevideo, { roro: toPositiveNumber(value, 94) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - Flat Rack',
                            type: 'number',
                            value: ratePerM3ByRoute.darienGap.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerM3ByRoute: Object.assign({}, ratePerM3ByRoute, {
                                        darienGap: Object.assign({}, ratePerM3ByRoute.darienGap, { flatRack: toPositiveNumber(value, 145) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - RoRo',
                            type: 'number',
                            value: ratePerM3ByRoute.darienGap.roro,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerM3ByRoute: Object.assign({}, ratePerM3ByRoute, {
                                        darienGap: Object.assign({}, ratePerM3ByRoute.darienGap, { roro: toPositiveNumber(value, 80) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - Flat Rack',
                            type: 'number',
                            value: ratePerM3ByRoute.hamburgHalifax.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerM3ByRoute: Object.assign({}, ratePerM3ByRoute, {
                                        hamburgHalifax: Object.assign({}, ratePerM3ByRoute.hamburgHalifax, { flatRack: toPositiveNumber(value, 156) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - RoRo',
                            type: 'number',
                            value: ratePerM3ByRoute.hamburgHalifax.roro,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerM3ByRoute: Object.assign({}, ratePerM3ByRoute, {
                                        hamburgHalifax: Object.assign({}, ratePerM3ByRoute.hamburgHalifax, { roro: toPositiveNumber(value, 86) })
                                    })
                                });
                            }
                        })
                    ),
                    el(
                        PanelBody,
                        { title: 'Rate pro Fahrzeuglaenge je Route (Flat Rack / RoRo)', initialOpen: false },
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - Flat Rack',
                            type: 'number',
                            value: ratePerLengthMeterByRoute.hamburgMontevideo.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerLengthMeterByRoute: Object.assign({}, ratePerLengthMeterByRoute, {
                                        hamburgMontevideo: Object.assign({}, ratePerLengthMeterByRoute.hamburgMontevideo, { flatRack: toPositiveNumber(value, 354) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Montevideo - RoRo',
                            type: 'number',
                            value: ratePerLengthMeterByRoute.hamburgMontevideo.roro,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerLengthMeterByRoute: Object.assign({}, ratePerLengthMeterByRoute, {
                                        hamburgMontevideo: Object.assign({}, ratePerLengthMeterByRoute.hamburgMontevideo, { roro: toPositiveNumber(value, 200) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - Flat Rack',
                            type: 'number',
                            value: ratePerLengthMeterByRoute.darienGap.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerLengthMeterByRoute: Object.assign({}, ratePerLengthMeterByRoute, {
                                        darienGap: Object.assign({}, ratePerLengthMeterByRoute.darienGap, { flatRack: toPositiveNumber(value, 300) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Darien Gap - RoRo',
                            type: 'number',
                            value: ratePerLengthMeterByRoute.darienGap.roro,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerLengthMeterByRoute: Object.assign({}, ratePerLengthMeterByRoute, {
                                        darienGap: Object.assign({}, ratePerLengthMeterByRoute.darienGap, { roro: toPositiveNumber(value, 170) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - Flat Rack',
                            type: 'number',
                            value: ratePerLengthMeterByRoute.hamburgHalifax.flatRack,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerLengthMeterByRoute: Object.assign({}, ratePerLengthMeterByRoute, {
                                        hamburgHalifax: Object.assign({}, ratePerLengthMeterByRoute.hamburgHalifax, { flatRack: toPositiveNumber(value, 324) })
                                    })
                                });
                            }
                        }),
                        el(TextControl, {
                            label: 'Hamburg/Halifax - RoRo',
                            type: 'number',
                            value: ratePerLengthMeterByRoute.hamburgHalifax.roro,
                            onChange: function (value) {
                                setAttributes({
                                    ratePerLengthMeterByRoute: Object.assign({}, ratePerLengthMeterByRoute, {
                                        hamburgHalifax: Object.assign({}, ratePerLengthMeterByRoute.hamburgHalifax, { roro: toPositiveNumber(value, 184) })
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
                        block: 'rueckenwinde/verschiffungs-kostenrechner',
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
