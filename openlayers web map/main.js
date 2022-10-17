window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [4205350.880585076, 83791.89426449966],
            zoom: 7,
            maxZoom: 10,
            minZoom:4
            // rotation: 0.5
        }),
        // layers: [
        //     new ol.layer.Tile({
        //         source: new ol.source.OSM()
        //     })
        // ],
        target: 'js-map'
    })

    // Base Map Layer

    const OpenStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OSMStandard'
    })

    const openStreetMapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot{z}/{x}/{y}.png'
        }),
        visible: false,
        title: 'OSMHumanitarian'
    })

    const stamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        }),
        visible: false,
        title: 'StamenTerrain'
    })

    // Layer Group
    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapHumanitarian, OpenStreetMapStandard, stamenTerrain
        ]
    })
    map.addLayer(baseLayerGroup);

    // map.on('click', function(e){
    //     console.log(e.coordinate);
    // })

    // Layer Switcher Logic for Basemaps
    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
    for(let baseLayerElement of baseLayerElements){
        baseLayerElement.addEventListener('change', function(){
            console.log(this.value)
            let baseLayerElementValue = this.value;
            console.log(baseLayerElementValue)
            baseLayerGroup.getLayers().forEach(function(element, index, array){
                let baseLayerTitle = element.get('title');
                element.setVisible(baseLayerTitle === baseLayerElementValue);
                console.log(baseLayerTitle + ' ' + 'baseLayerElementValue:' +  baseLayerElementValue)
            })
        })
    }

    // Vector Layers
    const fillStyle = new ol.style.Fill({
        color: [84, 118, 255, 1]
    })

    const strokeStyle = new ol.style.Stroke({
        color: [46, 45, 45, 1],
        width: 1.2
    })

    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 7,
        stroke: strokeStyle
    })

    const EUCountriesGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './Countries.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title: 'EU Countries GeoJSON',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: circleStyle
        })
    })

    map.addLayer(EUCountriesGeoJSON)

    //  Vector Feature Popup Feature
    const overlayContainerElement = document.querySelector('.overlay-container');
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureAdditionalInfo = document.getElementById('feature-addtional-info');


    // Vector Feature Popup Logic
    map.on('click', function(e){
        overlayLayer.setPosition(undefined); // Disaapear if you click outside
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedCoordinate = e.coordinate;
            let clickedFeatureName = feature.get('name');
            let clickedFeatureAdditionalInfo = feature.get('additional info');
            // console.log(clickedFeatureName + ' ' + clickedFeatureAdditionalInfo)
            overlayLayer.setPosition(clickedCoordinate);
            overlayFeatureName.innerHTML = clickedFeatureName;
            overlayFeatureAdditionalInfo.innerHTML = clickedFeatureAdditionalInfo;

        },
        {
            layerFilter: function(layerCandidate){
                return layerCandidate.get('title') === 'EU Countries GeoJSON'
            }
        })
    })
}