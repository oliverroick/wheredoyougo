Map = {
    map: null,

    osmLayer: null,

    heatmap: null,

    clusterLayer: null,

    selectControl: null,

    popup: null,

    init: function () {
        this.map = new OpenLayers.Map('map', {
            maxResolution: 156543.0339,
            units: 'm',
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
            theme: 'lib/OpenLayers/theme/dark/style.css',
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoom()]
        });

        var layer = new OpenLayers.Layer.Stamen("toner");
        this.map.addLayer(layer);


        this.clusterLayer = new OpenLayers.Layer.Vector("Foursquare Check-ins", {
                strategies: [new OpenLayers.Strategy.Cluster({distance: 35})],
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: "${radius}",
                        fillColor: "#ed2d1c",
                        fillOpacity: 0.7,
                        strokeColor: "#ffffff",
                        strokeWidth: 2,
                        strokeOpacity: 0.8,
                        label: "${getLabel}",
                        fontFamily: "Helvetica",
                        fontColor: "#ffffff"
                    }, {
                        context: {
                            radius: function(feature) {
                                var c = 0;
                                feature.cluster.each(function(f) {
                                    c += f.attributes.count;
                                });
                                return Math.min(c, 26) + 9;
                            },
                            getLabel: function(feature) {
                                var c = 0;
                                feature.cluster.each(function(f) {
                                    c += f.attributes.count;
                                });
                                return c;
                            }
                        }
                    }),
                    "select": new OpenLayers.Style({
                        pointRadius: "${radius}",
                        fillColor: "#43c5dd",
                        fillOpacity: 0.7,
                        strokeColor: "#ffffff",
                        strokeWidth: 2,
                        strokeOpacity: 0.8,
                        label: "${getLabel}",
                        fontFamily: "Helvetica",
                        fontColor: "#ffffff"
                    }, {
                        context: {
                            radius: function(feature) {
                                var c = 0;
                                feature.cluster.each(function(f) {
                                    c += f.attributes.count;
                                });
                                return Math.min(c, 26) + 9;
                            },
                            getLabel: function(feature) {
                                var c = 0;
                                feature.cluster.each(function(f) {
                                    c += f.attributes.count;
                                });
                                return c;
                            }
                        }
                    })
                })
            }, {isBaseLayer: false});

        this.map.addLayer(this.clusterLayer);

        this.map.setCenter(new OpenLayers.LonLat(0,0).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913")
        ), 3);

        this.selectControl = new OpenLayers.Control.SelectFeature(this.clusterLayer, {
            clickout: true
        });
        this.map.addControl(this.selectControl);

        this.clusterLayer.events.on({
            'featureselected': this.featureSelect.bind(this),
            'featureunselected': this.featureUnSelect.bind(this),
            'featuresremoved': this.featureUnSelect.bind(this)
        });
    },

    featureSelect: function (e) {
        var html = '<div class="popover right">' +
            '<div class="arrow"></div>' +
            '<h3 class="popover-title">Your check-ins here</h3>' +
            '<div class="popover-content">';

        html += '<table class="table table-striped table-condensed"><thead><tr><th colspan="2">Venue</th><th>#</th></tr></thead><tbody>';
        e.feature.cluster.each(function (feature) {
            var imgTd = '';
            if (feature.attributes.img != null) {
                imgTd = '<img src="' + feature.attributes.img.prefix + feature.attributes.img.sizes[0] + feature.attributes.img.name + '" width="' + feature.attributes.img.sizes[0] + '" height="' + feature.attributes.img.sizes[0] + '">'
            }

            html += '<tr><td width="32">' + imgTd + '</td><td><a href="https://foursquare.com/v/' + feature.attributes.id + '" target="_blank">' + feature.attributes.name + '</a></td><td>' + feature.attributes.count + '</td></tr>';
        });

        html += '</tbody><table></div></div>';
        this.popup = new OpenLayers.Popup("clusterPopup",
            new OpenLayers.LonLat(e.feature.geometry.x, e.feature.geometry.y),
            new OpenLayers.Size(300, 250),
            html,
            false
        );
        this.popup.panMapIfOutOfView = true;
        this.map.addPopup(this.popup);
    },

    featureUnSelect: function (f) {
        if (this.popup != null) {
            this.map.removePopup(this.popup);
            this.popup = null;
         }
    },

    initCluster: function (venues) {
        var features = [];
        venues.each(function(checkin) {
            var geom = new OpenLayers.Geometry.Point(checkin.lon, checkin.lat).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913")
                );

            features.push(new OpenLayers.Feature.Vector(geom,
                {
                    name: checkin.name,
                    count: checkin.count,
                    id: checkin.id,
                    img: checkin.img
                }
            ));
        });

        this.clusterLayer.removeAllFeatures();
        this.clusterLayer.addFeatures(features);

        this.map.zoomToExtent(this.clusterLayer.getDataExtent());

        this.selectControl.activate();
    }
}