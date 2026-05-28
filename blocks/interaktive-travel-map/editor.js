(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const {
        PanelBody,
        TextControl,
        TextareaControl,
        RangeControl,
        ToggleControl,
        Notice
    } = wp.components;
    const { useEffect, useRef, useState } = wp.element;
    const el = wp.element.createElement;

    const LEAFLET_ASSETS = {
        css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    };

    let leafletEditorPromise;

    function loadLeaflet() {
        if (window.L) {
            return Promise.resolve(window.L);
        }
        if (leafletEditorPromise) {
            return leafletEditorPromise;
        }

        leafletEditorPromise = new Promise(function (resolve, reject) {
            const doc = window.document;
            const existingCss = doc.querySelector('link[data-leaflet="itm-editor"]');
            if (!existingCss) {
                const css = doc.createElement('link');
                css.rel = 'stylesheet';
                css.href = LEAFLET_ASSETS.css;
                css.setAttribute('data-leaflet', 'itm-editor');
                doc.head.appendChild(css);
            }

            const done = function () {
                if (window.L) {
                    resolve(window.L);
                } else {
                    reject(new Error('Leaflet not available'));
                }
            };

            const existingScript = doc.querySelector('script[data-leaflet="itm-editor"]');
            if (existingScript) {
                if (window.L) {
                    done();
                } else {
                    existingScript.addEventListener('load', done, { once: true });
                    existingScript.addEventListener('error', function () {
                        reject(new Error('Leaflet load failed'));
                    }, { once: true });
                }
                return;
            }

            const script = doc.createElement('script');
            script.src = LEAFLET_ASSETS.js;
            script.async = true;
            script.setAttribute('data-leaflet', 'itm-editor');
            script.addEventListener('load', done, { once: true });
            script.addEventListener('error', function () {
                reject(new Error('Leaflet load failed'));
            }, { once: true });
            doc.body.appendChild(script);
        });

        return leafletEditorPromise;
    }

    function stableJson(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch (_e) {
            return '[]';
        }
    }

    function toLatLngTuple(point) {
        if (!point || typeof point !== 'object') {
            return null;
        }
        if (typeof point.lat !== 'number' || typeof point.lng !== 'number') {
            return null;
        }
        return [point.lat, point.lng];
    }

    function createMapLayers(L, map, attrs) {
        const layerGroup = L.layerGroup().addTo(map);
        const bounds = [];

        const routePoints = Array.isArray(attrs.routePoints) ? attrs.routePoints.map(toLatLngTuple).filter(Boolean) : [];
        if (routePoints.length > 1) {
            const route = L.polyline(routePoints, {
                color: attrs.brandColor || '#123a6f',
                weight: attrs.routeWeight || 4,
                opacity: attrs.routeOpacity || 0.95,
                lineJoin: 'round'
            }).addTo(layerGroup);
            bounds.push(route.getBounds());
        }

        const countries = Array.isArray(attrs.visitedCountries) ? attrs.visitedCountries : [];
        countries.forEach(function (country) {
            const points = Array.isArray(country.polygon) ? country.polygon.map(toLatLngTuple).filter(Boolean) : [];
            if (points.length < 3) {
                return;
            }

            const polygon = L.polygon(points, {
                color: attrs.countryStrokeColor || '#123a6f',
                weight: attrs.countryStrokeWeight || 1,
                fillColor: attrs.countryFillColor || '#123a6f',
                fillOpacity: attrs.countryFillOpacity || 0.2
            }).addTo(layerGroup);

            const countryName = country.name && typeof country.name === 'string' ? country.name : 'Land';
            const linkLabel = country.linkLabel && typeof country.linkLabel === 'string' ? country.linkLabel : 'Zum Blog-Beitrag';
            if (country.postUrl) {
                polygon.bindPopup('<strong>' + countryName + '</strong><br><a href="' + country.postUrl + '">' + linkLabel + '</a>');
            } else {
                polygon.bindPopup('<strong>' + countryName + '</strong>');
            }

            bounds.push(polygon.getBounds());
        });

        const currentLat = typeof attrs.currentLat === 'number' ? attrs.currentLat : -41.1335;
        const currentLng = typeof attrs.currentLng === 'number' ? attrs.currentLng : -71.3103;
        const markerHtml = '<span class="itm-current-marker" style="background:' + (attrs.brandColor || '#123a6f') + '"></span>';
        const currentIcon = L.divIcon({
            className: 'itm-current-marker-wrap',
            html: markerHtml,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        const marker = L.marker([currentLat, currentLng], { icon: currentIcon }).addTo(layerGroup);
        if (attrs.currentLabel) {
            marker.bindPopup(attrs.currentLabel);
        }

        bounds.push(L.latLngBounds([[currentLat, currentLng], [currentLat, currentLng]]));

        if (bounds.length) {
            let merged = bounds[0];
            for (let i = 1; i < bounds.length; i += 1) {
                merged = merged.extend(bounds[i]);
            }
            map.fitBounds(merged.pad(0.14));
        }

        return layerGroup;
    }

    registerBlockType('rueckenwinde/interaktive-travel-map', {
        edit: function (props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            const mapRef = useRef(null);
            const mapInstanceRef = useRef(null);
            const layerGroupRef = useRef(null);

            const [routeJson, setRouteJson] = useState(stableJson(attributes.routePoints || []));
            const [countriesJson, setCountriesJson] = useState(stableJson(attributes.visitedCountries || []));
            const [routeError, setRouteError] = useState('');
            const [countriesError, setCountriesError] = useState('');
            const [leafletError, setLeafletError] = useState(false);

            useEffect(function () {
                setRouteJson(stableJson(attributes.routePoints || []));
            }, [attributes.routePoints]);

            useEffect(function () {
                setCountriesJson(stableJson(attributes.visitedCountries || []));
            }, [attributes.visitedCountries]);

            useEffect(function () {
                let cancelled = false;

                loadLeaflet().then(function (L) {
                    if (cancelled || !mapRef.current) {
                        return;
                    }

                    if (!mapInstanceRef.current) {
                        const map = L.map(mapRef.current, {
                            zoomControl: true,
                            attributionControl: true
                        }).setView(
                            [attributes.initialCenterLat || -16.5, attributes.initialCenterLng || -66.2],
                            attributes.initialZoom || 4
                        );

                        L.tileLayer(attributes.mapTileUrl || 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                            maxZoom: attributes.mapMaxZoom || 19,
                            attribution: attributes.mapTileAttribution || '&copy; OpenStreetMap contributors &copy; CARTO'
                        }).addTo(map);

                        mapInstanceRef.current = map;
                    }

                    if (layerGroupRef.current) {
                        layerGroupRef.current.remove();
                    }

                    layerGroupRef.current = createMapLayers(L, mapInstanceRef.current, attributes);
                    setLeafletError(false);

                    window.setTimeout(function () {
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.invalidateSize();
                        }
                    }, 120);
                }).catch(function () {
                    if (!cancelled) {
                        setLeafletError(true);
                    }
                });

                return function () {
                    cancelled = true;
                };
            }, [attributes]);

            useEffect(function () {
                return function () {
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.remove();
                        mapInstanceRef.current = null;
                        layerGroupRef.current = null;
                    }
                };
            }, []);

            function parseRoute() {
                try {
                    const parsed = JSON.parse(routeJson || '[]');
                    if (!Array.isArray(parsed)) {
                        throw new Error('Route muss ein Array sein.');
                    }
                    setAttributes({ routePoints: parsed });
                    setRouteError('');
                } catch (err) {
                    setRouteError(err.message || 'Route-JSON ist ungueltig.');
                }
            }

            function parseCountries() {
                try {
                    const parsed = JSON.parse(countriesJson || '[]');
                    if (!Array.isArray(parsed)) {
                        throw new Error('Laender muessen ein Array sein.');
                    }
                    setAttributes({ visitedCountries: parsed });
                    setCountriesError('');
                } catch (err) {
                    setCountriesError(err.message || 'Laender-JSON ist ungueltig.');
                }
            }

            return el('div', blockProps,
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Allgemein', initialOpen: true },
                        el(TextControl, {
                            label: 'Titel',
                            value: attributes.title || '',
                            onChange: function (value) { setAttributes({ title: value }); }
                        }),
                        el(RangeControl, {
                            label: 'Hoehe (px)',
                            min: 260,
                            max: 900,
                            value: attributes.height || 520,
                            onChange: function (value) { setAttributes({ height: Number(value) || 520 }); }
                        }),
                        el(RangeControl, {
                            label: 'Initial Zoom',
                            min: 2,
                            max: 12,
                            value: attributes.initialZoom || 4,
                            onChange: function (value) { setAttributes({ initialZoom: Number(value) || 4 }); }
                        }),
                        el(TextControl, {
                            label: 'Initial Center Lat',
                            value: String(attributes.initialCenterLat),
                            onChange: function (value) { setAttributes({ initialCenterLat: parseFloat(value) || 0 }); }
                        }),
                        el(TextControl, {
                            label: 'Initial Center Lng',
                            value: String(attributes.initialCenterLng),
                            onChange: function (value) { setAttributes({ initialCenterLng: parseFloat(value) || 0 }); }
                        })
                    ),
                    el(PanelBody, { title: 'Design', initialOpen: false },
                        el(TextControl, {
                            label: 'Markenfarbe Route',
                            value: attributes.brandColor || '#123a6f',
                            onChange: function (value) { setAttributes({ brandColor: value }); }
                        }),
                        el(RangeControl, {
                            label: 'Route Strichstaerke',
                            min: 1,
                            max: 12,
                            value: attributes.routeWeight || 4,
                            onChange: function (value) { setAttributes({ routeWeight: Number(value) || 4 }); }
                        }),
                        el(RangeControl, {
                            label: 'Route Opacity',
                            min: 0.1,
                            max: 1,
                            step: 0.05,
                            value: attributes.routeOpacity || 0.95,
                            onChange: function (value) { setAttributes({ routeOpacity: Number(value) || 0.95 }); }
                        }),
                        el(TextControl, {
                            label: 'Laender Fill Farbe',
                            value: attributes.countryFillColor || '#123a6f',
                            onChange: function (value) { setAttributes({ countryFillColor: value }); }
                        }),
                        el(RangeControl, {
                            label: 'Laender Fill Opacity',
                            min: 0.05,
                            max: 0.8,
                            step: 0.05,
                            value: attributes.countryFillOpacity || 0.2,
                            onChange: function (value) { setAttributes({ countryFillOpacity: Number(value) || 0.2 }); }
                        }),
                        el(TextControl, {
                            label: 'Laender Randfarbe',
                            value: attributes.countryStrokeColor || '#123a6f',
                            onChange: function (value) { setAttributes({ countryStrokeColor: value }); }
                        }),
                        el(RangeControl, {
                            label: 'Laender Randstaerke',
                            min: 0,
                            max: 8,
                            value: attributes.countryStrokeWeight || 1,
                            onChange: function (value) { setAttributes({ countryStrokeWeight: Number(value) || 1 }); }
                        })
                    ),
                    el(PanelBody, { title: 'Current Location', initialOpen: false },
                        el(TextControl, {
                            label: 'Current Lat',
                            value: String(attributes.currentLat),
                            onChange: function (value) { setAttributes({ currentLat: parseFloat(value) || 0 }); }
                        }),
                        el(TextControl, {
                            label: 'Current Lng',
                            value: String(attributes.currentLng),
                            onChange: function (value) { setAttributes({ currentLng: parseFloat(value) || 0 }); }
                        }),
                        el(TextControl, {
                            label: 'Marker Label',
                            value: attributes.currentLabel || '',
                            onChange: function (value) { setAttributes({ currentLabel: value }); }
                        })
                    ),
                    el(PanelBody, { title: 'Map Tiles', initialOpen: false },
                        el(TextControl, {
                            label: 'Tile URL',
                            value: attributes.mapTileUrl || '',
                            onChange: function (value) { setAttributes({ mapTileUrl: value }); }
                        }),
                        el(TextControl, {
                            label: 'Attribution',
                            value: attributes.mapTileAttribution || '',
                            onChange: function (value) { setAttributes({ mapTileAttribution: value }); }
                        }),
                        el(RangeControl, {
                            label: 'Max Zoom',
                            min: 5,
                            max: 22,
                            value: attributes.mapMaxZoom || 19,
                            onChange: function (value) { setAttributes({ mapMaxZoom: Number(value) || 19 }); }
                        })
                    ),
                    el(PanelBody, { title: 'Fullscreen', initialOpen: false },
                        el(ToggleControl, {
                            label: 'Fullscreen aktivieren',
                            checked: !!attributes.enableFullscreen,
                            onChange: function (value) { setAttributes({ enableFullscreen: !!value }); }
                        }),
                        el(TextControl, {
                            label: 'Button Label',
                            value: attributes.fullscreenLabel || 'Full Screen',
                            onChange: function (value) { setAttributes({ fullscreenLabel: value }); }
                        }),
                        el(TextControl, {
                            label: 'Exit Label',
                            value: attributes.exitFullscreenLabel || 'Exit Full Screen',
                            onChange: function (value) { setAttributes({ exitFullscreenLabel: value }); }
                        })
                    ),
                    el(PanelBody, { title: 'Daten: Route', initialOpen: false },
                        el(TextareaControl, {
                            label: 'Route JSON (Array aus {lat,lng,label})',
                            rows: 12,
                            value: routeJson,
                            onChange: function (value) { setRouteJson(value); },
                            onBlur: parseRoute
                        }),
                        routeError ? el(Notice, { status: 'error', isDismissible: false }, routeError) : null
                    ),
                    el(PanelBody, { title: 'Daten: Erreichte Laender', initialOpen: false },
                        el(TextareaControl, {
                            label: 'Laender JSON (Array aus {name,postUrl,linkLabel,polygon:[{lat,lng}]})',
                            rows: 14,
                            value: countriesJson,
                            onChange: function (value) { setCountriesJson(value); },
                            onBlur: parseCountries
                        }),
                        countriesError ? el(Notice, { status: 'error', isDismissible: false }, countriesError) : null
                    )
                ),
                el(Notice, { status: 'info', isDismissible: false }, 'Live-Vorschau im Editor aktiv. Alles bleibt anpassbar.'),
                leafletError ? el(Notice, { status: 'warning', isDismissible: false }, 'Leaflet konnte im Editor nicht geladen werden. Frontend-Pruefung empfohlen.') : null,
                el('div', {
                    ref: mapRef,
                    className: 'itm-map',
                    style: {
                        height: ((attributes.height && Number(attributes.height)) || 520) + 'px'
                    }
                })
            );
        },
        save: function () {
            return null;
        }
    });
})(window.wp);
