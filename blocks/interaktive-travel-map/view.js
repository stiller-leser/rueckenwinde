(function () {
    const LEAFLET_ASSETS = {
        css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    };

    let leafletPromise;

    function loadLeaflet() {
        if (window.L) {
            return Promise.resolve(window.L);
        }
        if (leafletPromise) {
            return leafletPromise;
        }

        leafletPromise = new Promise(function (resolve, reject) {
            const existingCss = document.querySelector('link[data-leaflet="itm"]');
            if (!existingCss) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = LEAFLET_ASSETS.css;
                css.setAttribute('data-leaflet', 'itm');
                document.head.appendChild(css);
            }

            const done = function () {
                if (window.L) {
                    resolve(window.L);
                } else {
                    reject(new Error('Leaflet not available'));
                }
            };

            const existingScript = document.querySelector('script[data-leaflet="itm"]');
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

            const script = document.createElement('script');
            script.src = LEAFLET_ASSETS.js;
            script.async = true;
            script.setAttribute('data-leaflet', 'itm');
            script.addEventListener('load', done, { once: true });
            script.addEventListener('error', function () {
                reject(new Error('Leaflet load failed'));
            }, { once: true });
            document.body.appendChild(script);
        });

        return leafletPromise;
    }

    function parseConfig(mapEl) {
        const raw = mapEl.getAttribute('data-map-config');
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (_e) {
            return null;
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

    function createFullscreenControl(L, map, mapEl, labels) {
        const Control = L.Control.extend({
            options: { position: 'topright' },
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar');
                const btn = L.DomUtil.create('button', 'itm-fullscreen-btn', container);
                btn.type = 'button';
                btn.textContent = labels.enter;

                function isFs() {
                    return document.fullscreenElement === mapEl;
                }

                function syncLabel() {
                    btn.textContent = isFs() ? labels.exit : labels.enter;
                }

                btn.addEventListener('click', function () {
                    if (isFs()) {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        }
                    } else if (mapEl.requestFullscreen) {
                        mapEl.requestFullscreen();
                    }
                });

                document.addEventListener('fullscreenchange', function () {
                    syncLabel();
                    window.setTimeout(function () {
                        map.invalidateSize();
                    }, 80);
                });

                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.disableScrollPropagation(container);
                return container;
            }
        });

        return new Control();
    }

    function initMap(mapEl, L) {
        if (mapEl.getAttribute('data-itm-ready') === '1') {
            return;
        }

        const config = parseConfig(mapEl);
        if (!config) {
            return;
        }

        const map = L.map(mapEl, {
            zoomControl: true,
            attributionControl: true
        }).setView([config.initialCenterLat, config.initialCenterLng], config.initialZoom);

        L.tileLayer(config.mapTileUrl, {
            maxZoom: config.mapMaxZoom,
            attribution: config.mapTileAttribution
        }).addTo(map);

        const boundsParts = [];

        const routePoints = Array.isArray(config.routePoints) ? config.routePoints.map(toLatLngTuple).filter(Boolean) : [];
        if (routePoints.length > 1) {
            const route = L.polyline(routePoints, {
                color: config.brandColor,
                weight: config.routeWeight,
                opacity: config.routeOpacity,
                lineJoin: 'round'
            }).addTo(map);
            boundsParts.push(route.getBounds());
        }

        const countries = Array.isArray(config.visitedCountries) ? config.visitedCountries : [];
        countries.forEach(function (country) {
            const points = Array.isArray(country.polygon) ? country.polygon.map(toLatLngTuple).filter(Boolean) : [];
            if (points.length < 3) {
                return;
            }

            const polygon = L.polygon(points, {
                color: config.countryStrokeColor,
                weight: config.countryStrokeWeight,
                fillColor: config.countryFillColor,
                fillOpacity: config.countryFillOpacity
            }).addTo(map);

            const linkLabel = country.linkLabel && typeof country.linkLabel === 'string' ? country.linkLabel : 'Zum Blog-Beitrag';
            const countryName = country.name && typeof country.name === 'string' ? country.name : 'Land';
            const safeName = countryName.replace(/[<>&"']/g, '');
            if (country.postUrl) {
                polygon.bindPopup('<strong>' + safeName + '</strong><br><a href="' + country.postUrl + '">' + linkLabel + '</a>');
            } else {
                polygon.bindPopup('<strong>' + safeName + '</strong>');
            }

            boundsParts.push(polygon.getBounds());
        });

        const currentLatLng = [config.currentLat, config.currentLng];
        const markerHtml = '<span class="itm-current-marker" style="background:' + config.brandColor + '"></span>';
        const currentIcon = L.divIcon({
            className: 'itm-current-marker-wrap',
            html: markerHtml,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        const marker = L.marker(currentLatLng, { icon: currentIcon }).addTo(map);
        if (config.currentLabel) {
            marker.bindPopup(config.currentLabel);
        }
        boundsParts.push(L.latLngBounds([currentLatLng, currentLatLng]));

        if (config.enableFullscreen) {
            const control = createFullscreenControl(L, map, mapEl, {
                enter: config.fullscreenLabel || 'Full Screen',
                exit: config.exitFullscreenLabel || 'Exit Full Screen'
            });
            map.addControl(control);
        }

        if (boundsParts.length) {
            let merged = boundsParts[0];
            for (let i = 1; i < boundsParts.length; i += 1) {
                merged = merged.extend(boundsParts[i]);
            }
            map.fitBounds(merged.pad(0.14));
        }

        mapEl.setAttribute('data-itm-ready', '1');
        window.setTimeout(function () {
            map.invalidateSize();
        }, 120);
    }

    function initAll() {
        const maps = document.querySelectorAll('.wp-block-rueckenwinde-interaktive-travel-map .itm-map');
        if (!maps.length) {
            return;
        }

        loadLeaflet().then(function (L) {
            maps.forEach(function (mapEl) {
                initMap(mapEl, L);
            });
        }).catch(function () {
            maps.forEach(function (mapEl) {
                mapEl.textContent = 'Map konnte nicht geladen werden.';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
