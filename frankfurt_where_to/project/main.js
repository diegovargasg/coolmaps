import "./style.css";
import { Map, View } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import cityShape from "../resources/frankfurt_shape/frankfurt_shape_3857.json" assert { type: "json" };
import heatGeoJson from "../resources/frankfurt_tennis_bar_3857.json" assert { type: "json" };
import tableTennisGeoJson from "../resources/frankfurt_table_tennis_3857.json" assert { type: "json" };
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import Colorize from "ol-ext/filter/Colorize";

const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: "red", width: 1 }),
});

const styles = {
  Point: new Style({
    image: image,
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 1,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 1,
    }),
  }),
  MultiPoint: new Style({
    image: image,
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "yellow",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.1)",
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: "magenta",
      width: 2,
    }),
    fill: new Fill({
      color: "magenta",
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255,0,0,0.2)",
    }),
  }),
};

const cityShapeStyle = new Style({
  stroke: new Stroke({
    color: "#112935",
    width: 1.5,
  })
});

const blur = document.getElementById("blur");
const radius = document.getElementById("radius");

// Table Tennis Layer
const tableTennisVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(tableTennisGeoJson),
});

const styleTableTennis = new Style({
  text: new Text({
    text: "\uf45d",
    font: '900 18px "Font Awesome 5 Free"',
    fill: new Fill({
      color: "#296483",
    }),
  }),
});

const tableTennisVectorLayer = new VectorLayer({
  source: tableTennisVectorSource,
  style: styleTableTennis,
  minZoom: 14
});

// City Shape Layer
const cityVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(cityShape),
});

const cityVectorLayer = new VectorLayer({
  source: cityVectorSource,
  style: cityShapeStyle,
});

// Heat Layer
const heatLayer = new HeatmapLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(heatGeoJson),
  }),
  opacity: 0.9,
  gradient: ['#0A7B83', '#2AA876', '#FFD265', '#F19C65', '#CE4D45'],
  //gradient: ['#0A7B83', '#2AA876'],
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
});

const OSMLayer = new TileLayer({
  source: new OSM()
});

const styleBar = new Style({
  text: new Text({
    text: "\uf0fc",
    font: '900 18px "Font Awesome 5 Free"',
    fill: new Fill({
      color: "blue",
    }),
  }),
});

const feature = new Feature({
  geometry: new Point([968939.263738710898906, 6468889.594608341343701]),
});
feature.setStyle(styleBar);

cityVectorLayer.getSource().addFeature(feature);

const map = new Map({
  target: "map",
  layers: [OSMLayer, cityVectorLayer, heatLayer, tableTennisVectorLayer],
  view: new View({
    center: [950087.313388021430001, 6456766.780438467860222],
    zoom: 11,
    //minZoom: 11
  }),
});

blur.addEventListener("input", function () {
  console.log("blur", blur.value);
  heatLayer.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener("input", function () {
  console.log("radius", radius.value);
  heatLayer.setRadius(parseInt(radius.value, 10));
});

const color = new Colorize({ operation: "color", red: 218, green: 234, blue: 243 });
OSMLayer.addFilter(color);

//const heatMapColor = new Colorize({ operation: "saturation", value: 1 });
// const heatMapColor = new Colorize({ operation: "color", red: 218, green: 234, blue: 243 });
// heatLayer.addFilter(heatMapColor);