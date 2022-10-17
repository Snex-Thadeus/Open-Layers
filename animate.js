var tileLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        attribution: ['Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye'],
        attributionCallabsible: false,
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 23,
    })
});

var map = new ol.Map({
    layers: [tileLayer],
    target: "map",
    view: new ol.View({
        center: [0, 0],
        zoom: 1,
    }),
});

var source = new ol.source.Vector({

});

var vector = new ol.layer.Vector({
    source: source
});

map.addLayer(vector);

var pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color: 'rgb(255, 0, 0)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgb(255, 0, 0)',
            width: 0.5
        }),
    })
});

function addRandomPoint() {
    var x = Math.random() * 360 - 180;
    var y = Math.random() * 180 - 90;
    var geom = new ol.geom.Point(ol.proj.fromLonLat([x, y]));
    var feat = new ol.Feature(geom);
    feat.setStyle(pointStyle);
    source.addFeature(feat);
};

var duration = 2000;

function flash(feature){
    var startTime = new Date().getTime();
    var listener = tileLayer.on('postrender', animate);

    function animate(event){
        var vectorContext = ol.render.getVectorContext(event);
        var frameState = event.frameState;
        var geom = feature.getGeometry().clone();
        var elapsed = frameState.time - startTime;
        var timeRatio = elapsed / duration;
        var radius = ol.easing.easeOut(timeRatio) * 30;
        var opacity = ol.easing.easeOut(1 - timeRatio);

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, ' + opacity + ')',
                    width: 0.25 + opacity
                })
            })
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(geom);

        if (elapsed > duration) {
            ol.Observable.unByKey(listener);
            return;
        }

        map.render();
    }
};

source.on('addfeature', function(e){
    flash(e.feature);
});

window.setInterval(addRandomPoint, 1000);