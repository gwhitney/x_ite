---
title: Building Primitive Shapes
date: 2022-11-28
nav: tutorials-shapes-geometry-and-appearance
categories: [Tutorials]
tags: [Building, Primitive, Shapes]
---
## Motivation

Shapes are the building blocks of an X3D world. Primitive Shapes are standard building blocks:

- [Box](../components/geometry3d/box)
- [Cone](../components/geometry3d/cone)
- [Cylinder](../components/geometry3d/cylinder)
- [Sphere](../components/geometry3d/sphere)
- [Text](../components/text/text)
- and more from the [CADGeometry](../components//cadgeometry)**,** [Geometry2D](../components//geometry2d)**,** and [Rendering](../components//rendering) component

## Syntax: Shape

- A [Shape](../components/shape/shape) node builds a shape
  - *appearance* - color and texture
  - *geometry* - form, or structure

### XML Encoding

```xml
<Shape>
  <!-- appearance ... -->
  <!-- geometry ... -->
<Shape>
```

### Classic Encoding

```js
Shape {
  appearance ...
  geometry ...
}
```

## Specifying appearance

- [Shape](../components/shape/shape) appearance is described by appearance nodes
- For now, we'll use nodes to create a shaded white appearance:

### XML Encoding

```xml
<Shape>
  <Appearance>
    <Material/>
  </Appearance>
  <!-- geometry ... -->
</Shape>
```

### Classic Encoding

```js
Shape {
  appearance Appearance {
    material Material { }
  }
  geometry ...
}
```

## Specifying geometry

[Shape](../components/shape/shape) geometry is built with geometry nodes:

### XML Encoding

```xml
<Box ... />
<Cone ... />
<Cylinder ... />
<Sphere ... />
<Text ... />
```

### Classic Encoding

```js
Box { ... }
Cone { ... }
Cylinder { ... }
Sphere { ... }
Text { ... }
```

- Geometry node fields control dimensions
  - Dimensions usually in meters, but can be anything

## A sample primitive shape

### XML Encoding

```xml
<?xml version="1.0" encoding="UTF-8"?>
<X3D profile='Full' version='{{ site.x3d_latest_version }}' xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-{{ site.x3d_latest_version }}.xsd'>
  <Scene>
    <Shape>
      <Appearance>
        <Material/>
      </Appearance>
      <Cylinder
          radius='1.5'/>
    </Shape>
  </Scene>
</X3D>
```

### Classic Encoding

```js
#X3D V{{ site.x3d_latest_version }} utf8
# A cylinder
Shape {
  appearance Appearance {
    material Material { }
  }
  geometry Cylinder {
    height 2.0
    radius 1.5
  }
}
```

### Example

<x3d-canvas src="https://create3000.github.io/media/tutorials/scenes/cylinder1/cylinder1.x3dv" update="auto">
  <img src="https://create3000.github.io/media/tutorials/scenes/cylinder1/screenshot.png" alt="Cylinder"/>
</x3d-canvas>

[Download ZIP Archive](https://create3000.github.io/media/tutorials/scenes/cylinder1/cylinder1.zip)

## Building multiple shapes

- Shapes are built centered in the world
- A X3D file can contain multiple shapes
- Shapes overlap when built at the same location

## A sample file with multiple shapes

### XML Encoding

```xml
<?xml version="1.0" encoding="UTF-8"?>
<X3D profile='Full' version='{{ site.x3d_latest_version }}' xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-{{ site.x3d_latest_version }}.xsd'>
  <Scene>
    <Shape>
      <Appearance>
        <Material/>
      </Appearance>
      <Box
          size='1 1 1'/>
    </Shape>
    <Shape>
      <Appearance>
        <Material/>
      </Appearance>
      <Sphere
          radius='0.7'/>
    </Shape>
    <!-- ... -->
  </Scene>
</X3D>
```

### Classic Encoding

```js
#X3D V{{ site.x3d_latest_version }} utf8

Shape {
  appearance Appearance {
    material Material { }
  }
  geometry Box {
    size 1.0 1.0 1.0
  }
}

Shape {
  appearance Appearance {
    material Material { }
  }
  geometry Sphere {
    radius 0.7
  }
}

...
```

### Example

<x3d-canvas src="https://create3000.github.io/media/tutorials/scenes/multiple-shapes/multiple-shapes.x3dv" update="auto">
  <img src="https://create3000.github.io/media/tutorials/scenes/multiple-shapes/screenshot.png" alt="Multiple Shapes"/>
</x3d-canvas>

[Download ZIP Archive](https://create3000.github.io/media/tutorials/scenes/multiple-shapes/multiple-shapes.zip)

## Summary

- Shapes are built using a [Shape](../components/shape/shape) node
- [Shape](../components/shape/shape) geometry is built using geometry nodes, such as [Box](../components/geometry3d/box), [Cone](../components/geometry3d/cone), [Cylinder](../components/geometry3d/cylinder), [Sphere](../components/geometry3d/sphere), and [Text](../components/text/text)
- Text fonts are controlled using a [FontStyle](../components/text/fontstyle) node
