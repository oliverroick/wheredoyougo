(function (global) {
    'use strict';

    var STYLE = {
        stroke: false,
        fill: true,
        fillColor: '#22313F',
        fillOpacity: 0.4
    };

    var HOVER = {
        stroke: true,
        color: '#F7CA18',
        opacity: 1,
        fill: true,
        fillColor: '#22313F',
        fillOpacity: 1
    };

    var HIGHLIGHT = {
        stroke: true,
        color: '#fff',
        opacity: 1,
        fill: true,
        fillColor: '#F7CA18',
        fillOpacity: 1
    };

    var highlightedFeature;

    var venueLayer = L.featureGroup();

    var Map = function () {
        L.mapbox.accessToken = SETTINGS.MAPBOX.pk;
        this.map = L.mapbox.map('map', 'mapbox.streets-basic', {zoomControl: false}).setView([51.50719323477933, -0.12754440307617188], 9);

        this.map.on('click', function (evt) {
            this.emitEvent('map:featureUnselect', highlightedFeature);
            this.unselectFeature();
        }.bind(this));

        this.map.on('dragstart', function (evt) {
            this.emitEvent('map:drag');
        }.bind(this));

        this.map.on('zoomend', function (evt) {
            if (highlightedFeature) {
                this.map.panTo(highlightedFeature.properties.location, {animate: true});
            }
        }.bind(this));

        venueLayer.addTo(this.map);
    };
    Map.prototype = new EventEmitter();
    Map.constructor = Map;

    Map.prototype.unselectFeature = function unselectFeature() {
        if (highlightedFeature) {
            highlightedFeature.setStyle(STYLE);
            highlightedFeature = null;
        }
    }

    Map.prototype.addCheckins = function addCheckins (checkins) {
        var markers = [];
        for (var key in checkins) {
            var checkin = checkins[key];
            var marker = L.circleMarker(checkin.location, STYLE);
            var radius = checkin.checkins <= 41 ? 10 + Math.floor(checkin.checkins/2) : 25;
            marker.setRadius(radius)

            marker.properties = checkin;

            marker.on('click', function(evt) {
                if (highlightedFeature) {
                    highlightedFeature.setStyle(STYLE);
                }

                highlightedFeature = evt.target;
                evt.target.setStyle(HIGHLIGHT);
                evt.target.bringToFront();
                var zoom = this.map.getZoom() > 14 ? this.map.getZoom() : 12;
                this.map.setView(evt.target.properties.location, zoom);
                this.emitEvent('map:featureSelect', evt.target);
            }.bind(this));

            marker.on('mouseover', function() {
                this.setStyle(HOVER);
                this.bringToFront();
            });

            marker.on('mouseout', function() {
                if (this !== highlightedFeature) {
                    this.setStyle(STYLE);
                } else {
                    this.setStyle(HIGHLIGHT);
                }
            });

            venueLayer.addLayer(marker);
        }
        this.map.fitBounds(venueLayer.getBounds());
    }

    global.map = new Map();
}(window.views ? window.views: window.views = {}));
