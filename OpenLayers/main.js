 /** * Elements that make up the popup.
       */
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');

   /**
       * Create an overlay to anchor the popup to the map.
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

var wmsSource =  new ol.source.TileWMS({
    url: 'http://localhost:7070/geoserver/gis4dev/wms',
    params:{'LAYERS': 'gis4dev:reporter_counties', 'TILED':true},
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
    transition: 0
})

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Tile({
        source: wmsSource
    })
  ],
  overlays: [overlay],
  view: new ol.View({
    center: [0, 0],
    zoom: 4
  })
});

map.on('singleclick', function(evt) {
    var viewResolution = /** @type {number} */ (map.getView().getResolution());
    var url = wmsSource.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, 'EPSG:4326',
      {'INFO_FORMAT': 'application/json'});
    if (url) {
      fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
    }
  });

// map.on('click', function(e){
//     console.log(e.coordinate[0] + ' - ' + e.coordinate[1])
// })

// map.on('pointermove', function(e){
//     // console.log(e)
// })

var vectorLayer = new ol.layer.VectorImage({
    source:  new ol.source.Vector({
        url: './data.geojson',
        format: new ol.format.GeoJSON()
    }),
});

map.addLayer(vectorLayer)
