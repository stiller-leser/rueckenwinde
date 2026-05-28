(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, Button, SelectControl } = wp.components;
    const { __ } = wp.i18n;
    const el = wp.element.createElement;
    const { useEffect, useRef, useState } = wp.element;

    const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const SAVE_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const POSITION_MIGRATION = {
        canada: { old: [47, 8], next: [27, 16] },
        usa: { old: [47, 15], next: [27, 24] },
        mexico: { old: [44, 24], next: [24, 33] },
        belize: { old: [48, 30], next: [25, 40] },
        guatemala: { old: [44, 31], next: [24, 41] },
        elsalvador: { old: [42, 33], next: [23, 42.5] },
        honduras: { old: [46, 33], next: [25.5, 41.5] },
        nicaragua: { old: [45, 36], next: [25.5, 44] },
        costarica: { old: [44, 39], next: [25.5, 46.5] },
        panama: { old: [47, 42], next: [27, 48.5] },
        colombia: { old: [50, 47], next: [30, 53] },
        ecuador: { old: [49, 53], next: [29, 58] },
        peru: { old: [51, 60], next: [31, 65] },
        bolivia: { old: [56, 67], next: [35, 70] },
        paraguay: { old: [60, 72], next: [37, 76] },
        brasil: { old: [66, 66], next: [41, 66] },
        chile: { old: [46, 74], next: [27, 75] },
        argentina: { old: [52, 82], next: [32, 82] },
        uruguay: { old: [58, 84], next: [36, 84] }
    };

    const LEAFLET_ASSETS = {
        css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    };

    const AMERICAS_BOUNDS = {
        northLat: 83,
        southLat: -57,
        westLng: -179,
        eastLng: -26
    };

    let leafletEditorPromise;

    function loadLeafletEditor(targetWindow, targetDocument) {
        const win = targetWindow || window;
        const doc = targetDocument || document;

        if (win.L && typeof win.L.map === 'function') {
            return Promise.resolve(win.L);
        }

        if (leafletEditorPromise) {
            return leafletEditorPromise;
        }

        leafletEditorPromise = new Promise(function (resolve, reject) {
            const existingCss = doc.querySelector('link[data-leaflet="climate-slider-editor"]');
            if (!existingCss) {
                const css = doc.createElement('link');
                css.rel = 'stylesheet';
                css.href = LEAFLET_ASSETS.css;
                css.setAttribute('data-leaflet', 'climate-slider-editor');
                doc.head.appendChild(css);
            }

            const existingScript = doc.querySelector('script[data-leaflet="climate-slider-editor"]');
            if (existingScript) {
                if (win.L && typeof win.L.map === 'function') {
                    resolve(win.L);
                    return;
                }

                existingScript.addEventListener('load', function () {
                    resolve(win.L);
                });
                existingScript.addEventListener('error', reject);
                return;
            }

            const script = doc.createElement('script');
            script.src = LEAFLET_ASSETS.js;
            script.defer = true;
            script.setAttribute('data-leaflet', 'climate-slider-editor');
            script.onload = function () {
                resolve(win.L);
            };
            script.onerror = reject;
            doc.head.appendChild(script);
        });

        return leafletEditorPromise;
    }

    function countryToLatLng(country) {
        const x = typeof country.x === 'number' ? country.x : 50;
        const y = typeof country.y === 'number' ? country.y : 50;
        const latSpan = AMERICAS_BOUNDS.northLat - AMERICAS_BOUNDS.southLat;
        const lngSpan = AMERICAS_BOUNDS.eastLng - AMERICAS_BOUNDS.westLng;

        return [
            AMERICAS_BOUNDS.northLat - (y / 100) * latSpan,
            AMERICAS_BOUNDS.westLng + (x / 100) * lngSpan
        ];
    }

    function latLngToCountryPosition(lat, lng) {
        const latSpan = AMERICAS_BOUNDS.northLat - AMERICAS_BOUNDS.southLat;
        const lngSpan = AMERICAS_BOUNDS.eastLng - AMERICAS_BOUNDS.westLng;
        const x = ((lng - AMERICAS_BOUNDS.westLng) / lngSpan) * 100;
        const y = ((AMERICAS_BOUNDS.northLat - lat) / latSpan) * 100;

        return {
            x: Number(Math.max(8, Math.min(92, x)).toFixed(1)),
            y: Number(Math.max(5, Math.min(95, y)).toFixed(1))
        };
    }

    function editorMarkerIcon(L, country, activeCountryId) {
        const isActive = country.id === activeCountryId;
        const html =
            '<span class="climate-editor-leaflet-dot-core"></span>' +
            '<span class="climate-editor-leaflet-dot-label">' + country.name + '</span>';

        return L.divIcon({
            className: 'climate-editor-leaflet-dot' + (isActive ? ' is-active' : ''),
            html: html,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    const DEFAULT_COUNTRIES = [
            {
                    "id": "alaska",
                    "name": "Alaska",
                    "summary": "Very short season with rough weather and long distances.",
                    "tip": "Use weather windows and keep extra time and fuel buffer.",
                    "vanlife": "Seasonal high",
                    "ratings": [
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0
                    ],
                    "x": 11.5,
                    "y": 9
            },
            {
                    "id": "canada",
                    "name": "Canada",
                    "summary": "Long winter season with snow and ice on many routes.",
                    "tip": "Prioritize summer windows for mountain roads and camps.",
                    "vanlife": "High in summer, low in winter",
                    "ratings": [
                            0,
                            0,
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 27,
                    "y": 16
            },
            {
                    "id": "usa",
                    "name": "USA",
                    "summary": "Huge climate spread from snow belts to deserts.",
                    "tip": "Match route with season; avoid winter mountain crossings.",
                    "vanlife": "High with route planning",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 27,
                    "y": 24
            },
            {
                    "id": "mexico",
                    "name": "Mexico",
                    "summary": "Dry season generally better for road reliability.",
                    "tip": "In rainy months, allow extra buffer for mountain roads.",
                    "vanlife": "High",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 24,
                    "y": 33
            },
            {
                    "id": "belize",
                    "name": "Belize",
                    "summary": "Wet season can reduce comfort and traction.",
                    "tip": "Dry months are easier for slower overland travel.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25,
                    "y": 40
            },
            {
                    "id": "guatemala",
                    "name": "Guatemala",
                    "summary": "Mountain terrain plus rain can slow travel strongly.",
                    "tip": "Use daylight driving and conservative daily distances.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 24,
                    "y": 41
            },
            {
                    "id": "elsalvador",
                    "name": "El Salvador",
                    "summary": "Short distances, weather still impacts road comfort.",
                    "tip": "Dry months are simplest for quick overland crossings.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 23,
                    "y": 42.5
            },
            {
                    "id": "honduras",
                    "name": "Honduras",
                    "summary": "Rain and road quality changes can affect pace.",
                    "tip": "Plan shorter legs in rainy periods.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25.5,
                    "y": 41.5
            },
            {
                    "id": "nicaragua",
                    "name": "Nicaragua",
                    "summary": "Dry months are typically easiest for road travel.",
                    "tip": "In wet months, expect slower timing and more detours.",
                    "vanlife": "High in dry season",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25.5,
                    "y": 44
            },
            {
                    "id": "costarica",
                    "name": "Costa Rica",
                    "summary": "Rainy season can heavily impact driving comfort.",
                    "tip": "Best flow often in drier months with stable roads.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 25.5,
                    "y": 46.5
            },
            {
                    "id": "panama",
                    "name": "Panama",
                    "summary": "Strong wet season; route pacing matters.",
                    "tip": "Prioritize dry months for smoother transfers.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 27,
                    "y": 48.5
            },
            {
                    "id": "colombia",
                    "name": "Colombia",
                    "summary": "Conditions vary by altitude and region.",
                    "tip": "Combine weather check with route-specific road intel.",
                    "vanlife": "Moderate to high",
                    "ratings": [
                            2,
                            2,
                            2,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            2,
                            2
                    ],
                    "x": 30,
                    "y": 53
            },
            {
                    "id": "ecuador",
                    "name": "Ecuador",
                    "summary": "Mountain weather windows influence travel speed.",
                    "tip": "Keep flexible timing for highland rain and fog.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            1,
                            1,
                            0,
                            0,
                            0,
                            1,
                            1,
                            2,
                            2
                    ],
                    "x": 29,
                    "y": 58
            },
            {
                    "id": "peru",
                    "name": "Peru",
                    "summary": "Andean roads are sensitive to rain and landslides.",
                    "tip": "Dry periods are best for mountain and canyon sections.",
                    "vanlife": "High in dry season",
                    "ratings": [
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 31,
                    "y": 65
            },
            {
                    "id": "bolivia",
                    "name": "Bolivia",
                    "summary": "Altitude and rough roads require stable windows.",
                    "tip": "Aim for drier months and avoid extreme wet stretches.",
                    "vanlife": "Moderate",
                    "ratings": [
                            2,
                            2,
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            1,
                            2,
                            2,
                            2
                    ],
                    "x": 35,
                    "y": 70
            },
            {
                    "id": "paraguay",
                    "name": "Paraguay",
                    "summary": "Summer heat can be intense for long driving days.",
                    "tip": "Shoulder seasons are often easier for vanlife rhythm.",
                    "vanlife": "Moderate to high",
                    "ratings": [
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            1
                    ],
                    "x": 37,
                    "y": 76
            },
            {
                    "id": "brasil",
                    "name": "Brasil",
                    "summary": "Large regional contrasts in rain and road stress.",
                    "tip": "Select regional windows, not one national assumption.",
                    "vanlife": "Moderate",
                    "ratings": [
                            1,
                            1,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            1,
                            1
                    ],
                    "x": 41,
                    "y": 66
            },
            {
                    "id": "chile",
                    "name": "Chile",
                    "summary": "North-south span means very different driving seasons.",
                    "tip": "Use summer for southern routes and high passes.",
                    "vanlife": "High with timing",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 27,
                    "y": 75
            },
            {
                    "id": "argentina",
                    "name": "Argentina",
                    "summary": "Patagonia wind and seasonal extremes affect comfort.",
                    "tip": "Shoulder months can balance weather and road access.",
                    "vanlife": "High with route planning",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 32,
                    "y": 82
            },
            {
                    "id": "patagonia",
                    "name": "Patagonia",
                    "summary": "Strong winds and fast weather shifts affect comfort and speed.",
                    "tip": "Plan shorter legs and keep reserve days for wind.",
                    "vanlife": "Moderate to high with timing",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 28.5,
                    "y": 93
            },
            {
                    "id": "uruguay",
                    "name": "Uruguay",
                    "summary": "Stable roads but wetter and cooler winter periods.",
                    "tip": "Spring and autumn usually offer easiest driving rhythm.",
                    "vanlife": "High",
                    "ratings": [
                            0,
                            0,
                            1,
                            2,
                            2,
                            2,
                            2,
                            2,
                            1,
                            1,
                            0,
                            0
                    ],
                    "x": 36,
                    "y": 84
            }
    ];

    function sanitizeId(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'country';
    }

    function normalizeRatings(ratings) {
        const source = Array.isArray(ratings) ? ratings.slice(0, 12) : [];
        while (source.length < 12) {
            source.push(1);
        }

        return source.map(function (value) {
            const parsed = parseInt(value, 10);
            if (parsed < 0 || parsed > 2 || Number.isNaN(parsed)) {
                return 1;
            }
            return parsed;
        });
    }

    function parseRatingsText(value) {
        const parts = (value || '').split(',').map(function (part) {
            return part.trim();
        });
        return normalizeRatings(parts);
    }

    function ratingsToText(ratings) {
        return normalizeRatings(ratings).join(',');
    }

    function normalizeLink(value) {
        const raw = typeof value === 'string' ? value.trim() : '';
        if (!raw) {
            return '';
        }
        return raw;
    }

    function normalizeCountry(country, index) {
        const safe = country && typeof country === 'object' ? country : {};
        const name = typeof safe.name === 'string' && safe.name ? safe.name : ('Land ' + (index + 1));
        const id = typeof safe.id === 'string' && safe.id ? sanitizeId(safe.id) : sanitizeId(name);
        const migration = POSITION_MIGRATION[id];
        const oldX = typeof safe.x === 'number' ? safe.x : null;
        const oldY = typeof safe.y === 'number' ? safe.y : null;
        const matchesOld = migration &&
            oldX !== null && oldY !== null &&
            Math.abs(oldX - migration.old[0]) < 0.01 &&
            Math.abs(oldY - migration.old[1]) < 0.01;
        const resolvedX = matchesOld ? migration.next[0] : oldX;
        const resolvedY = matchesOld ? migration.next[1] : oldY;

        const normalizedLink = normalizeLink(safe.link);
        const normalizedCountry = {
            id: id,
            name: name,
            summary: typeof safe.summary === 'string' ? safe.summary : '',
            tip: typeof safe.tip === 'string' ? safe.tip : '',
            vanlife: typeof safe.vanlife === 'string' ? safe.vanlife : 'Mittel',
            ratings: normalizeRatings(safe.ratings),
            x: typeof resolvedX === 'number' ? Math.max(8, Math.min(92, resolvedX)) : 50,
            y: typeof resolvedY === 'number' ? Math.max(5, Math.min(95, resolvedY)) : (10 + index * 4)
        };

        if (normalizedLink) {
            normalizedCountry.link = normalizedLink;
        }

        return normalizedCountry;
    }

    function normalizeCountries(countries) {
        if (Array.isArray(countries)) {
            return countries.map(normalizeCountry);
        }
        return DEFAULT_COUNTRIES.map(normalizeCountry);
    }

    registerBlockType('rueckenwinde/climate-travel-time-slider', {
        title: __('Klima- & Reisezeit-Slider', 'rueckenwinde'),
        icon: 'location-alt',
        category: 'design',

        attributes: {
            heading: { type: 'string', default: 'Climate & Travel Time Slider' },
            intro: { type: 'string', default: 'Pick travel months and countries to compare road-focused travel conditions across the Panamericana.' },
            monthSelectionTitle: { type: 'string', default: 'Monat(e) wählen' },
            countrySelectionTitle: { type: 'string', default: 'Länder wählen' },
            accentColor: { type: 'string', default: '#FFC400' },
            mapImageUrl: { type: 'string', default: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Americas_satellite_map.jpg' },
            countriesData: { type: 'array', default: DEFAULT_COUNTRIES }
        },

        edit: function (props) {
            const { attributes, setAttributes, isSelected } = props;
            const countries = normalizeCountries(attributes.countriesData);
            const blockProps = useBlockProps({ className: 'climate-slider-editor' });
            const [activeCountryId, setActiveCountryId] = useState(countries[0] ? countries[0].id : '');
            const [editorCountryId, setEditorCountryId] = useState(countries[0] ? countries[0].id : '');
            const [leafletFailed, setLeafletFailed] = useState(false);
            const [mapReady, setMapReady] = useState(false);
            const mapRef = useRef(null);
            const leafletMapRef = useRef(null);
            const markersRef = useRef({});
            const countriesRef = useRef(countries);
            const activeCountryIdRef = useRef(activeCountryId);

            function updateCountry(index, changes) {
                const current = countriesRef.current || [];
                if (index < 0 || index >= current.length) {
                    return;
                }
                const next = current.slice();
                next[index] = Object.assign({}, next[index], changes);
                setAttributes({ countriesData: next });
            }

            function updateCountryById(countryId, changes) {
                const current = countriesRef.current || [];
                const index = current.findIndex(function (entry) {
                    return entry.id === countryId;
                });
                if (index === -1) {
                    return;
                }
                updateCountry(index, changes);
            }

            function removeCountry(index) {
                setAttributes({
                    countriesData: countries.filter(function (_, i) {
                        return i !== index;
                    })
                });
            }

            function moveCountry(fromIndex, toIndex) {
                if (fromIndex < 0 || fromIndex >= countries.length || toIndex < 0 || toIndex >= countries.length || fromIndex === toIndex) {
                    return;
                }

                const next = countries.slice();
                const moved = next.splice(fromIndex, 1)[0];
                next.splice(toIndex, 0, moved);
                setAttributes({ countriesData: next });
                setEditorCountryId(moved.id);
                setActiveCountryId(moved.id);
            }

            function addCountry() {
                const i = countries.length + 1;
                setAttributes({
                    countriesData: countries.concat([{
                        id: 'country-' + i,
                        name: 'Land ' + i,
                        summary: '',
                        tip: '',
                        link: '',
                        vanlife: 'Mittel',
                        ratings: [1,1,1,1,1,1,1,1,1,1,1,1],
                        x: 50,
                        y: Math.max(5, Math.min(95, 8 + i * 3))
                    }])
                });
            }

            useEffect(function () {
                countriesRef.current = countries;
                activeCountryIdRef.current = activeCountryId;
            }, [countries, activeCountryId]);

            useEffect(function () {
                const raw = attributes.countriesData;
                if (!Array.isArray(raw) || raw.length !== 1) {
                    return;
                }

                const only = raw[0] && typeof raw[0] === 'object' ? raw[0] : null;
                const onlyId = only && typeof only.id === 'string' ? sanitizeId(only.id) : '';
                if (onlyId !== 'canada') {
                    return;
                }

                // One-time recovery for legacy content that only persisted Canada.
                setAttributes({ countriesData: DEFAULT_COUNTRIES });
                setEditorCountryId(DEFAULT_COUNTRIES[0].id);
                setActiveCountryId(DEFAULT_COUNTRIES[0].id);
            }, [attributes.countriesData, setAttributes]);

            useEffect(function () {
                if (!countries.length) {
                    return;
                }

                const hasActive = countries.some(function (country) {
                    return country.id === activeCountryId;
                });
                const hasEditor = countries.some(function (country) {
                    return country.id === editorCountryId;
                });

                if (!hasActive) {
                    setActiveCountryId(countries[0].id);
                }
                if (!hasEditor) {
                    setEditorCountryId(countries[0].id);
                }
            }, [countries, activeCountryId, editorCountryId]);

            useEffect(function () {
                let cancelled = false;
                let clickHandler = null;
                let retryTimer = null;

                function tryInitMap() {
                    if (cancelled || leafletMapRef.current) {
                        return;
                    }

                    const mapNode = mapRef.current;
                    if (!mapNode || !mapNode.ownerDocument) {
                        retryTimer = setTimeout(tryInitMap, 120);
                        return;
                    }

                    const mapDocument = mapNode.ownerDocument;
                    const mapWindow = mapDocument.defaultView || window;

                    loadLeafletEditor(mapWindow, mapDocument).then(function (L) {
                        if (cancelled || !mapRef.current || leafletMapRef.current) {
                            return;
                        }

                        const map = L.map(mapRef.current, {
                            zoomControl: true,
                            minZoom: 2,
                            maxZoom: 7,
                            scrollWheelZoom: false,
                            worldCopyJump: false
                        });

                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; OpenStreetMap contributors'
                        }).addTo(map);

                        map.fitBounds([
                            [AMERICAS_BOUNDS.southLat, AMERICAS_BOUNDS.westLng],
                            [AMERICAS_BOUNDS.northLat, AMERICAS_BOUNDS.eastLng]
                        ], { padding: [24, 24] });

                        clickHandler = function (evt) {
                            const activeId = activeCountryIdRef.current;
                            if (!activeId) {
                                return;
                            }
                            const pos = latLngToCountryPosition(evt.latlng.lat, evt.latlng.lng);
                            updateCountryById(activeId, pos);
                        };
                        map.on('click', clickHandler);

                        leafletMapRef.current = map;
                        setMapReady(true);

                        setTimeout(function () {
                            if (!cancelled && leafletMapRef.current) {
                                leafletMapRef.current.invalidateSize();
                            }
                        }, 0);
                    }).catch(function () {
                        setLeafletFailed(true);
                    });
                }

                tryInitMap();

                return function () {
                    cancelled = true;
                    if (retryTimer) {
                        clearTimeout(retryTimer);
                    }
                    const map = leafletMapRef.current;
                    if (!map) {
                        return;
                    }

                    if (clickHandler) {
                        map.off('click', clickHandler);
                    }
                    map.remove();
                    leafletMapRef.current = null;
                    markersRef.current = {};
                    setMapReady(false);
                };
            }, []);

            useEffect(function () {
                const map = leafletMapRef.current;
                const mapNode = mapRef.current;
                if (!map || !mapNode || !mapNode.ownerDocument) {
                    return;
                }
                const mapWindow = mapNode.ownerDocument.defaultView || window;
                const L = mapWindow.L;
                if (!L) {
                    return;
                }

                const markerStore = markersRef.current;
                Object.keys(markerStore).forEach(function (id) {
                    markerStore[id].remove();
                    delete markerStore[id];
                });

                countries.forEach(function (country) {
                    const latLng = countryToLatLng(country);

                    const marker = L.marker(latLng, {
                        draggable: true,
                        title: country.name,
                        icon: editorMarkerIcon(L, country, activeCountryId)
                    }).addTo(map);

                    marker.on('click', function () {
                        setActiveCountryId(country.id);
                        setEditorCountryId(country.id);
                    });

                    marker.on('dragstart', function () {
                        setActiveCountryId(country.id);
                        setEditorCountryId(country.id);
                    });

                    marker.on('dragend', function (evt) {
                        const pos = latLngToCountryPosition(evt.target.getLatLng().lat, evt.target.getLatLng().lng);
                        updateCountryById(country.id, pos);
                    });

                    markerStore[country.id] = marker;
                });
            }, [countries, activeCountryId, mapReady]);

            const currentEditorIndex = countries.findIndex(function (country) {
                return country.id === editorCountryId;
            });
            const safeEditorIndex = currentEditorIndex === -1 ? 0 : currentEditorIndex;
            const editorCountry = countries[safeEditorIndex];

            if (!isSelected) {
                return el('div', blockProps,
                    el('div', { className: 'climate-slider-editor-collapsed' },
                        el('h3', null, attributes.heading || 'Climate & Travel Time Slider'),
                        el('p', null, attributes.intro || ''),
                        el('p', { className: 'climate-slider-editor-meta' }, countries.length + ' Länder konfiguriert. Zum Bearbeiten Block anklicken.')
                    )
                );
            }

            return el('div', blockProps,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Allgemein', 'rueckenwinde'), initialOpen: true },
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
                        el(TextControl, {
                            label: __('Titel Monate', 'rueckenwinde'),
                            value: attributes.monthSelectionTitle || 'Monat(e) wählen',
                            onChange: function (value) { setAttributes({ monthSelectionTitle: value }); }
                        }),
                        el(TextControl, {
                            label: __('Titel Länder', 'rueckenwinde'),
                            value: attributes.countrySelectionTitle || 'Länder wählen',
                            onChange: function (value) { setAttributes({ countrySelectionTitle: value }); }
                        }),
                        el(TextControl, {
                            label: __('Akzentfarbe', 'rueckenwinde'),
                            value: attributes.accentColor || '#FFC400',
                            onChange: function (value) { setAttributes({ accentColor: value || '#FFC400' }); },
                            help: __('Hex-Wert wie #FFC400', 'rueckenwinde')
                        }),
                        el('p', {
                            className: 'climate-slider-editor-meta'
                        }, __('Die Karte verwendet jetzt Leaflet + OpenStreetMap-Kacheln im Editor und Frontend.', 'rueckenwinde'))
                    )
                ),
                el('h3', null, attributes.heading || 'Climate & Travel Time Slider'),
                el('p', null, attributes.intro || ''),
                el('div', { className: 'climate-editor-inline-settings' },
                    el(TextControl, {
                        label: 'Titel Monat(e) wählen',
                        value: attributes.monthSelectionTitle || 'Monat(e) wählen',
                        onChange: function (value) { setAttributes({ monthSelectionTitle: value }); }
                    }),
                    el(TextControl, {
                        label: 'Titel Länder wählen',
                        value: attributes.countrySelectionTitle || 'Länder wählen',
                        onChange: function (value) { setAttributes({ countrySelectionTitle: value }); }
                    })
                ),
                el('p', { className: 'climate-slider-editor-note' }, 'Monatsbewertungen als 12 Werte bearbeiten (0=rot, 1=gelb, 2=grün) in der Reihenfolge Jan-Dez.'),
                el('div', { className: 'climate-editor-month-grid', 'aria-hidden': 'true' },
                    MONTHS.map(function (month) {
                        return el('span', { key: 'month-preview-' + month, className: 'climate-editor-month-box' }, month);
                    })
                ),
                el('div', { className: 'climate-editor-map-wrap' },
                    el('p', { className: 'climate-editor-map-help' }, 'Marker ziehen, um Länder neu zu positionieren. Tipp: \"Auf Karte fokussieren\" klicken und dann genau auf die Karte klicken.'),
                    el('div', {
                            className: 'climate-editor-map',
                            ref: mapRef
                        }),
                    leafletFailed && el('p', { className: 'climate-editor-map-help' }, 'Leaflet konnte in diesem Editor-Kontext nicht geladen werden. X/Y kann unten weiterhin manuell gesetzt werden.')
                ),
                editorCountry && el('div', { className: 'climate-slider-country-card' },
                        el(SelectControl, {
                            label: 'Land bearbeiten',
                            value: editorCountry.id,
                            options: countries.map(function (country) {
                                return { label: country.name, value: country.id };
                            }),
                            onChange: function (value) {
                                setEditorCountryId(value);
                                setActiveCountryId(value);
                            }
                        }),
                        el(TextControl, {
                            label: 'Ländername',
                            value: editorCountry.name,
                            onChange: function (value) {
                                const nextId = sanitizeId(value);
                                updateCountry(safeEditorIndex, { name: value, id: nextId });
                                setEditorCountryId(nextId);
                                setActiveCountryId(nextId);
                            }
                        }),
                        el(TextControl, {
                            label: 'Land-ID',
                            value: editorCountry.id,
                            onChange: function (value) {
                                const nextId = sanitizeId(value);
                                updateCountry(safeEditorIndex, { id: nextId });
                                setEditorCountryId(nextId);
                                setActiveCountryId(nextId);
                            },
                            help: 'Wird intern fuer Interaktionen verwendet.'
                        }),
                        el(TextareaControl, {
                            label: 'Klima- / Straßenübersicht',
                            value: editorCountry.summary,
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { summary: value });
                            }
                        }),
                        el(TextareaControl, {
                            label: 'Reisetipp',
                            value: editorCountry.tip,
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { tip: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Popup-Link',
                            value: editorCountry.link || '',
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { link: value });
                            },
                            help: 'Optional. Wird unten im Popup als Link angezeigt.'
                        }),
                        el(TextControl, {
                            label: 'Vanlife-Eignungstext',
                            value: editorCountry.vanlife,
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { vanlife: value });
                            }
                        }),
                        el(TextControl, {
                            label: 'Monatsbewertungen (12 Werte)',
                            value: ratingsToText(editorCountry.ratings),
                            onChange: function (value) {
                                updateCountry(safeEditorIndex, { ratings: parseRatingsText(value) });
                            },
                            help: MONTHS.join(', ') + ' = 0/1/2'
                        }),
                        el(TextControl, {
                            label: 'Kartenposition X (%)',
                            value: String(editorCountry.x),
                            onChange: function (value) {
                                const parsed = parseFloat(value);
                                if (!Number.isNaN(parsed)) {
                                    updateCountry(safeEditorIndex, { x: Math.max(8, Math.min(92, parsed)) });
                                }
                            }
                        }),
                        el(TextControl, {
                            label: 'Kartenposition Y (%)',
                            value: String(editorCountry.y),
                            onChange: function (value) {
                                const parsed = parseFloat(value);
                                if (!Number.isNaN(parsed)) {
                                    updateCountry(safeEditorIndex, { y: Math.max(5, Math.min(95, parsed)) });
                                }
                            }
                        }),
                        el(Button, {
                            variant: 'secondary',
                            onClick: function () { setActiveCountryId(editorCountry.id); }
                        }, 'Auf Karte fokussieren'),
                        el(Button, {
                            variant: 'secondary',
                            disabled: safeEditorIndex === 0,
                            onClick: function () { moveCountry(safeEditorIndex, safeEditorIndex - 1); }
                        }, 'Land nach oben'),
                        el(Button, {
                            variant: 'secondary',
                            disabled: safeEditorIndex === countries.length - 1,
                            onClick: function () { moveCountry(safeEditorIndex, safeEditorIndex + 1); }
                        }, 'Land nach unten'),
                        el(Button, {
                            variant: 'secondary',
                            isDestructive: true,
                            onClick: function () { removeCountry(safeEditorIndex); }
                        }, 'Land entfernen')
                    ),
                el(Button, { variant: 'primary', onClick: addCountry }, 'Land hinzufuegen')
            );
        },

        save: function (props) {
            const attrs = props.attributes;
            const countries = normalizeCountries(attrs.countriesData);
            const mapImageUrl = attrs.mapImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/2/21/Americas_satellite_map.jpg';
            const blockProps = useBlockProps.save({
                className: 'wp-block-rueckenwinde-climate-travel-time-slider',
                style: {
                    '--climate-accent': attrs.accentColor || '#FFC400',
                    '--climate-map-image': 'url(\"' + mapImageUrl + '\")'
                },
                'data-countries': encodeURIComponent(JSON.stringify(countries))
            });

            return el('section', blockProps,
                el('div', { className: 'climate-slider-header' },
                    el('h3', { className: 'climate-slider-heading' }, attrs.heading || 'Climate & Travel Time Slider'),
                    el('p', { className: 'climate-slider-intro' }, attrs.intro || '')
                ),
                el('div', { className: 'climate-slider-layout' },
                    el('div', { className: 'climate-slider-map-panel' },
                        el('div', { className: 'climate-slider-map' },
                            countries.map(function (country) {
                                return el('button', {
                                        key: country.id,
                                        type: 'button',
                                        className: 'climate-country-node',
                                        'data-country-id': country.id,
                                        style: { left: country.x + '%', top: country.y + '%' },
                                        'aria-label': country.name
                                    },
                                    el('span', { className: 'climate-country-dot' }),
                                    el('span', { className: 'climate-country-name' }, country.name)
                                );
                            })
                        ),
                        el('div', { className: 'climate-slider-tooltip', hidden: true })
                    ),
                    el('div', { className: 'climate-slider-controls' },
                        el('div', { className: 'climate-control-group' },
                            el('h4', null, attrs.monthSelectionTitle || 'Monat(e) wählen'),
                            el('div', { className: 'climate-month-grid' },
                                SAVE_MONTHS.map(function (month, idx) {
                                    return el('button', {
                                        key: month,
                                        type: 'button',
                                        className: 'climate-month-btn',
                                        'data-month-index': String(idx),
                                        'aria-pressed': 'false'
                                    }, month);
                                })
                            )
                        ),
                        el('div', { className: 'climate-control-group' },
                            el('h4', null, attrs.countrySelectionTitle || 'Länder wählen'),
                            el('div', { className: 'climate-country-list' },
                                countries.map(function (country) {
                                    const isDefaultChecked = country.id === 'uruguay';
                                    return el('label', { key: country.id, className: 'climate-country-item', 'data-country-row': country.id },
                                        el('input', {
                                            type: 'checkbox',
                                            className: 'climate-country-checkbox',
                                            'data-country-id': country.id,
                                            defaultChecked: isDefaultChecked
                                        }),
                                        el('span', { className: 'country-item-name' }, country.name),
                                        el('span', { className: 'country-item-state' }, 'Moderate')
                                    );
                                })
                            )
                        )
                    )
                )
            );
        },

        deprecated: [
            {
                save: function (props) {
                    const attrs = props.attributes;
                    const countries = normalizeCountries(attrs.countriesData);
                    const mapImageUrl = attrs.mapImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/2/21/Americas_satellite_map.jpg';
                    const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const blockProps = useBlockProps.save({
                        className: 'wp-block-rueckenwinde-climate-travel-time-slider',
                        style: {
                            '--climate-accent': attrs.accentColor || '#FFC400',
                            '--climate-map-image': 'url(\"' + mapImageUrl + '\")'
                        },
                        'data-countries': encodeURIComponent(JSON.stringify(countries))
                    });

                    return el('section', blockProps,
                        el('div', { className: 'climate-slider-header' },
                            el('h3', { className: 'climate-slider-heading' }, attrs.heading || 'Climate & Travel Time Slider'),
                            el('p', { className: 'climate-slider-intro' }, attrs.intro || '')
                        ),
                        el('div', { className: 'climate-slider-layout' },
                            el('div', { className: 'climate-slider-map-panel' },
                                el('div', { className: 'climate-slider-map' },
                                    countries.map(function (country) {
                                        return el('button', {
                                                key: country.id,
                                                type: 'button',
                                                className: 'climate-country-node',
                                                'data-country-id': country.id,
                                                style: { left: country.x + '%', top: country.y + '%' },
                                                'aria-label': country.name
                                            },
                                            el('span', { className: 'climate-country-dot' }),
                                            el('span', { className: 'climate-country-name' }, country.name)
                                        );
                                    })
                                ),
                                el('div', { className: 'climate-slider-tooltip', hidden: true })
                            ),
                            el('div', { className: 'climate-slider-controls' },
                                el('div', { className: 'climate-control-group' },
                                    el('h4', null, attrs.monthSelectionTitle || 'Monat(e) wählen'),
                                    el('div', { className: 'climate-month-grid' },
                                        englishMonths.map(function (month, idx) {
                                            return el('button', {
                                                key: month,
                                                type: 'button',
                                                className: 'climate-month-btn',
                                                'data-month-index': String(idx),
                                                'aria-pressed': 'false'
                                            }, month);
                                        })
                                    )
                                ),
                                el('div', { className: 'climate-control-group' },
                                    el('h4', null, attrs.countrySelectionTitle || 'Länder wählen'),
                                    el('div', { className: 'climate-country-list' },
                                        countries.map(function (country) {
                                            const isDefaultChecked = country.id === 'uruguay';
                                            return el('label', { key: country.id, className: 'climate-country-item', 'data-country-row': country.id },
                                                el('input', {
                                                    type: 'checkbox',
                                                    className: 'climate-country-checkbox',
                                                    'data-country-id': country.id,
                                                    defaultChecked: isDefaultChecked
                                                }),
                                                el('span', { className: 'country-item-name' }, country.name),
                                                el('span', { className: 'country-item-state' }, 'Moderate')
                                            );
                                        })
                                    )
                                )
                            )
                        )
                    );
                }
            }
        ]
    });
})(window.wp);
