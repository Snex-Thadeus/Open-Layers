window.onload = init;

function init(){
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            source: new ol.source.Stamen({layer: 'watercolor',})
            // source: new ol.source.OSM()
            }),
            new ol.layer.Tile({
            source: new ol.source.Stamen({layer: 'terrain-labels',})
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([37.9062, 0.0236]),
            zoom: 4
        })
    });

    //  Layer Styles
    var fillStyle = new ol.style.Fill({
        color: [255, 0, 0, 0.25]
    })

    var strokeStyle = new ol.style.Stroke({
        color: [0, 0, 0, 1.0],
        width: 1.5
    })

    // Add a Vector Layer
    var exampleLayer = new ol.layer.VectorImage({
        source : new ol.source.Vector({
            url: './data/polygon.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'Example Polygons',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle
        })
    })

    map.addLayer(exampleLayer);
}