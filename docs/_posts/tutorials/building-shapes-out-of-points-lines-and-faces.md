---
title: Building Shapes out of Points, Lines, and Faces
date: 2022-11-28
nav: tutorials-animation-sensors-and-geometry
categories: [Tutorials]
tags: [Building, Shapes, Points, Lines, Faces]
---
## Motivation

Complex shapes are hard to build with primitive shapes:

- TerrainAnimals
- Plants
- Machinery

Instead, build shapes out of atomic components:

- Points, lines, and faces

## Building shapes using coordinates

Shape building is like a 3-D connect-the-dots game:

- Place dots at 3-D locations
- Connect-the-dots to form shapes

A coordinate specifies a 3-D dot location. Measured relative to a coordinate system origin. A geometry node specifies how to connect the dots.

## Syntax: Coordinate

A [Coordinate](../components/rendering/coordinate) node contains a list of coordinates for use in building a shape.

### XML Encoding

```xml
<!-- X Y Z -->
<Coordinate
    point='2.0 1.0 3.0, 4.0 2.5 5.3, ...'/>
```

### Classic Encoding

```js
Coordinate {
  point [
   #X   Y   Z
    2.0 1.0 3.0,
    4.0 2.5 5.3,
    ...
  ]
}
```

## Using geometry coordinates

Build coordinate-based shapes using geometry nodes:

- [PointSet](../components/rendering/pointset)
- [IndexedLineSet](../components/rendering/indexedlineset)
- [IndexedFaceSet](../components/geometry3d/indexedfaceset)

For all three nodes, use a [Coordinate](../components/rendering/coordinate) node as the value of the coord field.

## Syntax: PointSet

A [PointSet](../components/rendering/pointset) geometry node creates geometry out of points:

- One point (a dot) is placed at each coordinate

### XML Encoding

```xml
<Shape>
  <Appearance><!-- ... --></Appearance>
  <PointSet>
    <Coordinate
        point='...'/>
  </PointSet>
</Shape>
```

### Classic Encoding

```js
Shape {
  appearance Appearance { ... }
  geometry PointSet {
    coord Coordinate {
      point [  ...  ]
    }
  }
}
```

## Syntax: IndexedLineSet

An [IndexedLineSet](../components/rendering/indexedlineset) geometry node creates geometry out of lines:

- A straight line is drawn between pairs of selected coordinates

### XML Encoding

```xml
<Shape>
  <Appearance><!-- ... --></Appearance>
  <IndexedLineSet
      coordIndex='...'>
    <Coordinate>
        point='...'/>
  </IndexedLineSet>
</Shape>
```

### Classic Encoding

```js
Shape {
  appearance Appearance { ... }
  geometry  IndexedLineSet {
    coordIndex [ ... ]
    coord Coordinate {
      point [ ... ]
    }
  }
}
```

## Using line set coordinate indexes

Each coordinate in a [Coordinate](../components/rendering/coordinate) node is implicitly numbered

- Index 0 is the first coordinate
- Index **1** is the second coordinate, etc.

To build a line shape:

- Make a list of coordinates, using their indexes
- List coordinate indexes in the *coordIndex* field of the [IndexedLineSet](../components/rendering/indexedlineset) node

A line is drawn between pairs of coordinate indexes:

- **-1** marks a break in the line
- A line is not automatically drawn from the last index back to the first

|                                                |                                 |
|------------------------------------------------|---------------------------------|
| *coordIndex* \[ 1, 0, 3, 8, -1, 5, 9, 0, -1 \] |                                 |
| 1, 0, 3, 8,                                    | Draw line from 1 to 0 to 3 to 8 |
| -1,                                            | End line, start next            |
| 5, 9, 0                                        | Draw line from 5 to 9 to 0      |

## Syntax: IndexedFaceSet

An [IndexedFaceSet](../components/geometry3d/indexedfaceset) geometry node creates geometry out of faces:

- A flat face (polygon) is drawn using an outline specified by coordinate indexes

### XML Encoding

```xml
<Shape>
  <Appearance><!-- ... --></Appearance>
  <IndexedFaceSet
      coordIndex='...'>
    <Coordinate>
        point='...'/>
  </IndexedFaceSet>
</Shape>
```

### Classic Encoding

```js
Shape {
  appearance Appearance { ... }
  geometry IndexedFaceSet {
    coordIndex [ ... ]
    coord Coordinate {
      point [  ...  ]
    }
  }
}
```

## Using face set coordinate index lists

To build a face shape

- Make a list of coordinates, using their indexes
- List coordinate indexes in the *coordIndex* field of the [IndexedFaceSet](../components/geometry3d/indexedfaceset) node

A triangle is drawn connecting sequences of coordinate indexes:

- **-1** marks a break in the sequence
- Each face is automatically closed, connecting the last index back to the first

|                                                |                                      |
|------------------------------------------------|--------------------------------------|
| *coordIndex* \[ 1, 0, 3, 8, -1, 5, 9, 0, -1 \] |                                      |
| 1, 0, 3, 8                                     | Draw face from 1 to 0 to 3 to 8 to 1 |
| -1,                                            | End face, start next                 |
| 5, 9, 0                                        | Draw face from 5 to 9 to 0 to 5      |
| -1                                             | End face                             |

## Syntax: IndexedFaceSet

An [IndexedFaceSet](../components/geometry3d/indexedfaceset) geometry node creates geometry out of faces:

- *solid* - shape is solid
- *ccw* - faces are counter-clockwise
- *convex* - faces are convex

### XML Encoding

```xml
<Shape>
  <Appearance><!-- ... --></Appearance>
  <IndexedFaceSet
      solid='true'
      ccw='true'
      convex='true'
      coordIndex='...'>
    <Coordinate ... />
  </IndexedFaceSet>
</Shape>
```

### Classic Encoding

```js
Shape {
  appearance Appearance { ... }
  geometry IndexedFaceSet {
    solid TRUE
    ccw TRUE
    convex TRUE
    coordIndex [ ... ]
    coord Coordinate { ... }
  }
}
```

## Using shape control

A solid shape is one where the insides are never seen:

- If never seen, don't attempt to draw them
- When *solid* **TRUE**, the back sides (inside) of faces are not drawn

The front of a face has coordinates in counter-clockwise order:

- When *ccw* **FALSE**, the other side is the front

Faces are assumed to be convex

- When *convex* **FALSE,** concave faces are automatically broken into multiple convex faces

## Syntax: CoordinateInterpolator

A [CoordinateInterpolator](../components/interpolation/coordinateinterpolator) node describes a coordinate path:

- *keys* - key fractions
- *keyValues* - key coordinate lists (X, Y, Z lists)

### XML Encoding

```xml
<CoordinateInterpolator
    key='0.0, ...'
    keyValue='0.0 1.0 0.0, ...'/>
```

### Classic Encoding

```js
CoordinateInterpolator {
  key [ 0.0, ... ]
  keyValue [ 0.0 1.0 0.0, ... ]
}
```

Typically route into a [Coordinate](../components/rendering/coordinate) node's set\_point input.

## Interpolating coordinate lists

A [CoordinateInterpolator](../components/interpolation/coordinateinterpolator) node interpolates lists of coordinates:

- Each output is a list of coordinates

If n output coordinates are needed for t fractional times:

- n × t coordinates are needed in the key value list

## Summary

- Shapes are built by connecting together coordinates
- Coordinates are listed in a [Coordinate](../components/rendering/coordinate) node
- Coordinates are implicitly numbers starting at 0
- Coordinate index lists give the order in which to use coordinates

The [PointSet](../components/rendering/pointset) node draws a dot at every coordinate:

- The *coord* field value is a Coordinate node

The [IndexedLineSet](../components/rendering/indexedlineset) node draws lines between coordinates:

- The *coord* field value is a Coordinate node
- The *coordIndex* field value is a list of coordinate indexes

The [IndexedFaceSet](../components/geometry3d/indexedfaceset) node draws faces outlined by coordinates:

- The *coord* field value is a Coordinate node
- The *coordIndex* field value is a list of coordinate indexes

The [CoordinateInterpolator](../components/interpolation/coordinateinterpolator) node converts times to coordinates.
