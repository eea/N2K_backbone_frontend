import React from 'react';
import { loadModules } from "esri-loader";
import {DataLoader} from './DataLoader';

var GeoJSONLayer;

class MapViewer extends React.Component {

    constructor(props) {
        super(props);
        this.dl = new(DataLoader);
        this.mapDiv = this.props.container?this.props.container:"mapDiv";
        this.map=null;
    }

    componentDidUpdate(){
        if(document.querySelectorAll(".esri-layer-list__item").length > 0) {
            if(!document.querySelectorAll(".esri-layer-list__item")[0].querySelector(".esri-layer-list__item-label .legend-color")){
                document.querySelectorAll(".esri-layer-list__item")[0].querySelector(".esri-layer-list__item-label").insertAdjacentHTML( 'beforeend', "<span class='legend-color legend-color-0'></span>" );
            }
            if(document.querySelectorAll(".esri-layer-list__item")[1]&&!document.querySelectorAll(".esri-layer-list__item")[1]?.querySelector(".esri-layer-list__item-label .legend-color")){
                document.querySelectorAll(".esri-layer-list__item")[1].querySelector(".esri-layer-list__item-label").insertAdjacentHTML( 'beforeend', "<span class='legend-color legend-color-1'></span>" );
            }
        }
    }

    componentDidMount(){
        loadModules(
            ["esri/Map", "esri/views/MapView", "esri/widgets/Zoom", "esri/layers/GeoJSONLayer", "esri/widgets/LayerList", "esri/layers/FeatureLayer",
            "esri/layers/MapImageLayer", "esri/widgets/BasemapToggle"],
            { css: true }
          ).then(([Map, MapView, Zoom, _GeoJSONLayer, LayerList, FeatureLayer, MapImageLayer, BasemapToggle]) => {
            GeoJSONLayer = _GeoJSONLayer;

            let layers=[];

            if(this.props.latestRelease){
                let lastRelease = new FeatureLayer({
                    url: this.props.latestRelease,
                    id: 1,
                    popupEnabled: true,
                    title: "Last Release",
                    opacity: 0.5,
                    renderer: {
                        type: "simple",
                        symbol: {
                            type: "simple-fill",
                            color: "#4fc1c5",
                            style: "solid",
                            outline: {
                                width: 1,
                                color: "#444444"
                            }
                        },
                    }
                });
                layers.push(lastRelease);
            }

            let reportedSpatial = new FeatureLayer({
                url: this.props.reportedSpatial,
                id: 0,
                popupEnabled: this.props.latestRelease,
                title: "Reported Geometries",
                opacity: 0.5,
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: "#fed100",
                        style: "solid",
                        outline: {
                            width: 1,
                            color: "#444444"
                        }
                    },
                }
            });
            if(this.props.latestRelease){
                layers.push(reportedSpatial);
            }

            this.map = new Map({
                basemap: this.props.latestRelease ? "gray-vector" : "osm",
                layers: layers
            });

            let siteLayer = new FeatureLayer({
                url: this.props.lineageChangeType === "Deletion" ? this.props.latestRelease : this.props.reportedSpatial,
                id: 3,
                popupEnabled: false,
                listMode: "hide",
                definitionExpression: "SiteCode = '" + this.props.siteCode + "'",
            });
            this.map.add(siteLayer);

            let mapFeats = {
                container: this.mapDiv,
                map: this.map,
                center: [0,40],
                zoom: 5,
                ui: {
                    components: ["attribution"]
                }
            }
            if(!this.props.latestRelease){
                mapFeats["navigation"] = {
                    mouseWheelZoomEnabled: false,
                    browserTouchPanEnabled: false
                }
            }
          
            this.view = new MapView(mapFeats);

            //Code to disable all events if required
            this.view.when(()=>{
                if(!this.props.latestRelease){
                    let stopEvtPropagation= (event) => {
                        event.stopPropagation();
                    }
        
                    // exlude the zoom widget from the default UI
                    this.view.ui.components = ["attribution"];
            
                    // disable mouse wheel scroll zooming on the view
                    this.view.on("mouse-wheel", stopEvtPropagation);
            
                    // disable zooming via double-click on the view
                    this.view.on("double-click", stopEvtPropagation);
            
                    // disable zooming out via double-click + Control on the view
                    this.view.on("double-click", ["Control"], stopEvtPropagation);
            
                    // disables pinch-zoom and panning on the view
                    this.view.on("drag", stopEvtPropagation);
            
                    // disable the view's zoom box to prevent the Shift + drag
                    // and Shift + Control + drag zoom gestures.
                    this.view.on("drag", ["Shift"], stopEvtPropagation);
                    this.view.on("drag", ["Shift", "Control"], stopEvtPropagation);
            
                    // prevents zooming with the + and - keys
                    this.view.on("key-down", (event) => {
                        const prohibitedKeys = ["+", "-", "Shift", "_", "=", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
                        const keyPressed = event.key;
                        if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                            event.stopPropagation();
                        }
                    });
                }
            });
            
            this.setState({});
            if(this.props.latestRelease){
                this.zoom = new Zoom({
                    view: this.view
                });
                this.view.ui.add(this.zoom, {
                    position: "top-right"
                });

                let layerList = new LayerList({view: this.view});
                this.view.ui.add(layerList,{position: "top-left"});
                
                const basemapToggle = new BasemapToggle({
                    view: this.view,
                    nextBasemap: "satellite"
                });
                this.view.ui.add(basemapToggle,"bottom-left");
            } 

            this.view.popup.visibleElements={closeButton:false};
            this.view.popup.dockOptions={buttonEnabled: false};
            this.view.popup.defaultPopupTemplateEnabled = true;
            this.view.popup.autoOpenEnabled = true;

            this.getReportedGeometry(siteLayer,this.props.siteCode);
        });
    }

    getReportedGeometry(layer,code){
        let query = layer.createQuery();
        query.where = "SiteCode = '" + code + "'";
        layer.queryFeatures(query)
        .then(
            res => {
                for(let i in res.features){
                    let feat = res.features[i];
                    this.view.goTo({
                        extent: feat?.geometry?.extent
                    });
                    let polylineSymbol = {};

                    if(this.props.lastRelease) {
                        polylineSymbol = {
                            type: "simple-line",  // autocasts as SimpleLineSymbol()
                            color: "#000015",
                            width: 2
                        };
                    }
                    else {
                        polylineSymbol = {
                            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                            color: [ 0, 0, 21, 0.25 ],
                            style: "solid",
                            outline: {  // autocasts as new SimpleLineSymbol()
                              color: "#000015",
                              width: 2
                            }
                        };
                    }
                    feat.symbol = polylineSymbol;
                    this.view.graphics.add(feat);
                }
            }
        );

    }

    render(){
        return(
            <>
                <div id={this.mapDiv} style={{ width: '100%', height: '600px' }} />
            </>
        );
    }
}

export default MapViewer;