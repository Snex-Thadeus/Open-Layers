 /*** Elements that make up the popup.
       */
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');

/*** Create an overlay to anchor the popup to the map.
       */
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

// Map init
var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source:new ol.source.XYZ({
            attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
      }),
    ],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({
      center: [0, 0],
      zoom: 4
    }),
  });

//   CREATE TILE WMS LAYER

// //    Create WMS Source
// var wmsSource = new ol.source.TileWMS({
//     url: "http://localhost:7070/geoserver/gis4dev/wms",
//     params: {LAYERS : 'gis4dev:reporter_counties'},
//     serverType: 'geoserver',
// });

//    Create WMS Source
var wmsSource =  new ol.source.TileWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {'LAYERS': 'ne:ne', 'TILED': true},
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  });

// Create WMS Layer
var wmsLayer = new ol.layer.Tile({
    source: wmsSource,
});

// Add Layer to Map

map.addLayer(wmsLayer);

// // CREATE IMAGE WMS LAYER
// // Create image wms source
// var imgWmsSource = new ol.source.ImageWMS({
//     url: "http://localhost:7070/geoserver/gis4dev/wms",
//     params: {LAYERS : 'gis4dev:reporter_counties'},
//     serverType: 'geoserver',
// });

// // Create image wms layer
// var imgWmsLayer = new ol.layer.Image({
//     source: imgWmsSource,
// });

// // add layer to the map
// map.addLayer(imgWmsLayer);

// CREATE VECTOR LAYER FROM GEOJSON
var vectorSource = new ol.source.Vector({
    url: "/data/point.geojson",
    format: new ol.format.GeoJSON(),
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            fille: new ol.style.Fill({
                color: 'rgba(255,0,0,0.5)',
            }),
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1.25
            }),
            radius: 5
        })
    })
});


map.addLayer(vectorLayer);

// CREATE HEATMAP
var heatMapLayer = new ol.layer.Heatmap({
    source: vectorSource
});

// map.addLayer(heatMapLayer);

// map.on click
map.on('click', function(e){
    var flag_vectorFound = false;
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
        console.log(feature)
        var name =  feature.getProperties().name;
        content.innerHTML = '<b> Town Name : </b>' + name;
        overlay.setPosition(feature.getGeometry().getCoordinates());
        flag_vectorFound = true
    });
    if (!flag_vectorFound) {
    var viewResolution = /** @type {number} */ (map.getView().getResolution());
    var url = wmsSource.getGetFeatureInfoUrl(
        e.coordinate, viewResolution, 'EPSG:3857',
        {'INFO_FORMAT': 'application/json'});
        fetch(url)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            var name = data.features[0].properties.admin;
            content.innerHTML = '<b> Name : </b>' + name;
            overlay.setPosition(e.coordinate);
          })
        .catch(err => console.log(err))
    }  
});