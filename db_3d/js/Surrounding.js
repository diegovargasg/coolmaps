const ALLOWED_ELEMENTS = {
  Polygon: [
    {
      type: "natural",
      elements: ["water"],
      renderedAs: "water",
    },
    {
      type: "water",
      elements: ["basin"],
      renderedAs: "water",
    },
    {
      type: "leisure",
      elements: ["park", "playground"],
      renderedAs: "grass",
    },
  ],
  LineString: [
    {
      type: "highway",
      elements: ["primary", "secondary", "tertiary", "residential"],
      renderedAs: "road",
    },
  ],
};

class Surrounding {
  constructor(coordinates, properties, geometryType, center) {
    this.coordinates = coordinates;
    this.properties = properties;
    this.geometryType = geometryType;
    this.center = center;
    this.type = null;

    // There's no configuration for such geometry
    if (typeof ALLOWED_ELEMENTS[this.geometryType] === "undefined") {
      return;
    }

    for (let i = 0; i < ALLOWED_ELEMENTS[this.geometryType].length; i++) {
      const type = ALLOWED_ELEMENTS[this.geometryType][i].type;
      const elements = ALLOWED_ELEMENTS[this.geometryType][i].elements;
      const renderedAs = ALLOWED_ELEMENTS[this.geometryType][i].renderedAs;

      if (this.properties[type] && elements.includes(this.properties[type])) {
        this.type = renderedAs;
        break;
      }
    }
  }

  getGeometry() {
    if (this.geometryType === "Polygon") {
      return this.generatePolygone();
    } else if (this.geometryType === "LineString") {
      return this.generateLine();
    }
  }

  generatePolygone() {
    let shape, geometry;
    let gaps = [];

    this.coordinates.forEach((coordinate, index) => {
      if (index === 0) {
        shape = generateShape(coordinate, this.center);
      } else {
        gaps.push(generateShape(coordinate, this.center));
      }
    });

    gaps.forEach((gap) => {
      shape.holes.push(gap);
    });

    geometry = generateGeometry(shape, {
      curveSegments: 1,
      depth: 0.01,
      bevelEnabled: false,
    });

    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);
    return geometry;
  }

  generateLine() {
    let points = [];
    let line, geometry;
    let MAT_ROAD = new THREE.LineDashedMaterial({ color: 0xfde293 });

    this.coordinates.forEach((coordinate) => {
      let el = coordinate;
      if (!el[0] || !el[1]) return;
      let elp = [el[0], el[1]];
      elp = GPSRelativePositionTurf([elp[0], elp[1]], this.center);
      points.push(new THREE.Vector3(elp[0], 0.5, elp[1]));
    });

    geometry = generateLine(points);

    line = new THREE.Line(geometry, MAT_ROAD);
    //line.info = info
    line.computeLineDistances();
    line.position.set(line.position.x, 0.5, line.position.z);
    return line;
  }
}
