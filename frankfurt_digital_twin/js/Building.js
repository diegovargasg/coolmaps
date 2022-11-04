class Building {
  constructor(coordinates, properties, center) {
    this.coordinates = coordinates;
    this.properties = properties;
    this.center = center;

    this.height = this.properties["height"] ? this.properties["height"] : 1;
    this.minHeight = this.properties["minHeight"] ? this.properties["minHeight"] : 0;

    this.height = this.height - this.minHeight;
  }

  generate() {
    if(this.properties["shape"] === "sphere") {
      return this.generateSphere(); 
    } else {
      return this.generateBox();
    }
  }

  generateBox() {
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
      //depth: 0.05 * this.height,
      depth: 0.01 * this.height,
      bevelEnabled: false,
    });

    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);

    if(this.minHeight > 0) {
      geometry.translate(0, (0.01*this.minHeight), 0);
    }

    return geometry;
  }

  generateSphere() {
    const features = turf.points(...this.coordinates);
    const centerSphere = turf.center(features);
    const height = this.properties["height"]
    const minHeight = this.properties["minHeight"] ? this.properties["minHeight"] : 0;
    const finalHeight = height - minHeight;
    const radius = 0.01*(finalHeight/2);
    const z = (0.01*(minHeight+finalHeight/2));

    let elPosition = GPSRelativePositionTurf(centerSphere.geometry.coordinates, this.center);
    let geometry = new THREE.SphereGeometry(radius, 16, 8);
    geometry.translate(-elPosition[0], z, elPosition[1]);

    return geometry;
  }
}
