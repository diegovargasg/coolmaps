class Geometry {
  constructor(coordinates, properties, center) {
    this.coordinates = coordinates;
    this.properties = properties;
    this.center = center;

    this.height = this.properties["height"] ? this.properties["height"] : 1;
    this.minHeight = this.properties["minHeight"] ? this.properties["minHeight"] : 0;

    this.height = this.height - this.minHeight;
    this.gaps = this.properties["gaps"] ? this.properties["gaps"] : 0;
  }

  generate() {
    if (this.properties["shape"] === "sphere") {
      return this.generateSphere();
    } else if (this.properties["roofShape"] === "pyramid") {
      return this.generatePyramid();
    } else {
      return this.generateBox();
    }
  }

  generateBox() {
    let shape, geometry;
    let gaps = [];

    this.coordinates.forEach((coordinate, index) => {
      if (index + 1 > this.gaps) {
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

    geometry.rotateZ(33);
    geometry.translate(-5, -2.5, 0);
    geometry.scale(15, 15, 15);

    return geometry;
  }
}
