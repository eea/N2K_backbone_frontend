import React from 'react';
import { loadModules } from "esri-loader";
import UtilsData from '../data/utils.json';
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

            let layers = [];

            let popupTemplate = {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "Date",
                        label: "Date",
                        format: {
                            dateFormat: "short-date"
                        }
                    },
                    {
                        fieldName: "SiteType",
                        label: "Site Type"
                    },
                    {
                        fieldName: "Priority",
                        label: "Priority"
                    },
                    {
                        fieldName: "Area",
                        label: "Area (ha)"
                    },
                    {
                        fieldName: "Length",
                        label: "Length (km)"
                    }
                ]
            };

            if(this.props.mapReference){
                let lastRelease = new FeatureLayer({
                    url: this.props.mapReference,
                    id: 1,
                    popupEnabled: true,
                    title: "Reference",
                    opacity: 0.5,
                    minScale : 10000000,
                    renderer: {
                        type: "simple",
                        symbol: {
                            type: "simple-fill",
                            color: UtilsData.COLORS.Blue,
                            style: "solid",
                            outline: {
                                width: 1,
                                color: "#444444"
                            }
                        },
                    },
                    popupTemplate: {
                        title: "Reference: {SiteCode} - {SiteName}",
                        content: [ popupTemplate ]
                    }
                });
                layers.push(lastRelease);
            }

            let mapSubmission = new FeatureLayer({
                url: this.props.mapSubmission,
                id: 0,
                popupEnabled: this.props.mapReference,
                title: "Submission",
                opacity: 0.5,
                minScale : 10000000,
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: UtilsData.COLORS.Yellow,
                        style: "solid",
                        outline: {
                            width: 1,
                            color: "#444444"
                        }
                    },
                },
                popupTemplate: {
                    title: "Submission: {SiteCode} - {SiteName}",
                    content: [ popupTemplate ]
                }
            });
            if(this.props.mapReference){
                layers.push(mapSubmission);
            }

            this.map = new Map({
                basemap: this.props.mapReference ? "gray-vector" : "osm",
                layers: layers
            });

            let siteLayer = new FeatureLayer({
                url: this.props.lineageChangeType === "Deletion" || this.props.noGeometry ? this.props.mapReference : this.props.mapSubmission,
                id: 3,
                popupEnabled: false,
                listMode: "hide",
                definitionExpression: "SiteCode = '" + this.props.siteCode + "'",
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: "transparent",
                        outline: {
                            style: "none",
                        }
                    },
                },
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
            this.view = new MapView(mapFeats);

            //Code to disable all events if required
            this.view.when(()=>{
                if(!this.props.mapReference){
                    this.view.ui.components = ["attribution"];
                }
            });
            
            this.setState({});

            this.zoom = new Zoom({
                view: this.view
            });
            this.view.ui.add(this.zoom, {
                position: "top-right"
            });

            if(this.props.mapReference){
                let layerList = new LayerList({view: this.view});
                this.view.ui.add(layerList,{position: "top-left"});
                
                const basemapToggle = new BasemapToggle({
                    view: this.view,
                    nextBasemap: "satellite"
                });
                this.view.ui.add(basemapToggle,"bottom-left");
            } 

            this.view.popup.visibleElements={closeButton:false};
            this.view.popup.dockEnabled = true;
            this.view.popup.dockOptions={buttonEnabled: false, breakpoint: false, position: "bottom-right"};
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
                    let polylineSymbol = {
                        type: "simple-fill",
                        color: "transparent",
                        style: "solid",
                        outline: {
                            color: "#000015",
                            width: 2
                        }
                    };
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
