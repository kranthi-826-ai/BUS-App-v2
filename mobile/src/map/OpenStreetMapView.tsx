import React, {useMemo} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {WebView} from 'react-native-webview';

type Point={latitude:number;longitude:number};
type Stop=Point&{name:string;selected?:boolean};
export function OpenStreetMapView({bus,stops}:{bus?:Point;stops:Stop[]}){
 const center=bus ?? stops[0];
 const html=useMemo(()=>center?buildHtml(center,bus,stops):'',[center,bus,stops]);
 if(!center)return <View style={styles.empty}><Text>Map will appear when verified stops or a live bus position are available.</Text></View>;
 return <WebView style={styles.map} originWhitelist={['*']} source={{html}} javaScriptEnabled />;
}
function buildHtml(center:Point,bus:Point|undefined,stops:Stop[]){
 const safeStops=JSON.stringify(stops).replace(/</g,'\\u003c');
 const safeBus=JSON.stringify(bus??null);
 return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"></head><body style="margin:0"><div id="map" style="height:100vh"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>const map=L.map('map').setView([${center.latitude},${center.longitude}],14);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);const stops=${safeStops};stops.forEach(s=>L.marker([s.latitude,s.longitude]).addTo(map).bindPopup((s.selected?'Your stop: ':'')+s.name));const bus=${safeBus};if(bus)L.circleMarker([bus.latitude,bus.longitude],{radius:10,color:'#08764f',fillColor:'#00a878',fillOpacity:1}).addTo(map).bindPopup('Live bus');</script></body></html>`;
}
const styles=StyleSheet.create({map:{height:260,borderRadius:20,overflow:'hidden'},empty:{height:160,alignItems:'center',justifyContent:'center',padding:20,backgroundColor:'#e1f4ec',borderRadius:20}});
