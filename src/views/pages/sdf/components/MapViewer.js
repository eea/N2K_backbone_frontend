import React from 'react';
import { loadModules } from "esri-loader";
import {DataLoader} from '../../../../components/DataLoader';

var GeoJSONLayer;

class MapViewer extends React.Component {

    constructor(props) {
        super(props);
        this.dl = new(DataLoader);
        this.mapDiv = this.props.container?this.props.container:"mapDiv";
        this.map=null;
    }

    componentDidMount(){
        loadModules(
            ["esri/Map", "esri/views/MapView", "esri/widgets/Zoom", "esri/layers/GeoJSONLayer", "esri/widgets/LayerList", "esri/layers/FeatureLayer",
            "esri/layers/MapImageLayer"],
            { css: true }
          ).then(([Map, MapView, Zoom, _GeoJSONLayer, LayerList, FeatureLayer, MapImageLayer]) => {
            GeoJSONLayer = _GeoJSONLayer;

            let layers=[];

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
            layers.push(reportedSpatial);

            this.map = new Map({
                basemap: "osm",
                //layers: layers,
                slider: false
            });

            let mapFeats = {
                container: this.mapDiv,
                map: this.map,
                center: [10,50],
                zoom: 4,
                ui: {
                    components: ["attribution"]
                }
            }
          
            this.view = new MapView(mapFeats);
            
            this.setState({});

            this.view.popup.visibleElements={closeButton:false};
            this.view.popup.dockOptions={buttonEnabled: false};
            this.view.popup.defaultPopupTemplateEnabled = true;
            this.view.popup.autoOpenEnabled = true;

            this.getReportedGeometry(reportedSpatial,this.props.siteCode);
        });
    }

    getReportedGeometry(layer,code){
        let query = layer.createQuery();
        query.where = "SiteCode = '" + code + "'";
        layer.queryFeatures(query)
        .then(
            res =>{
                for(let i in res.features){
                    let feat = res.features[i];
                    this.view.extent = feat?.geometry?.extent;
                    
                    // this.view.goTo({
                    //     extent: feat?.geometry?.extent
                    // });

                    let polylineSymbol = {
                                             type: "simple-line",  // autocasts as SimpleLineSymbol()
                                             color: "#000015",
                                             width: 2
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
