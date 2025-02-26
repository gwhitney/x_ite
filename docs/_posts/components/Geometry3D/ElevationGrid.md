---
title: ElevationGrid
date: 2023-01-07
nav: components-Geometry3D
categories: [components, Geometry3D]
tags: [ElevationGrid, Geometry3D]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

ElevationGrid is a geometry node defining a rectangular height field, with default values for a 1m by 1m square at height 0. Vertices corresponding to ElevationGrid height values define quadrilaterals, which are placed above or below a flat surface.

The ElevationGrid node belongs to the **Geometry3D** component and its default container field is *geometry.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometryNode
    + ElevationGrid
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFFloat [in] **set_height** <small>(-∞,∞)</small>

Grid array of *height* vertices with upward direction along +Y axis, with xDimension rows and zDimension columns.

#### Hint

- *height* array values are given in row-major order from left to right along X axis, then back to front along Z axis.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### SFInt32 [ ] **xDimension** 0 <small>[0,∞)</small>

Number of elements in the height array along X direction.

#### Hint

- Total horizontal x-axis distance equals (*xDimension*-1) * xSpacing.

#### Warning

- *xDimension* \< 2 means that ElevationGrid contains no quadrilaterals.

### SFInt32 [ ] **zDimension** 0 <small>[0,∞)</small>

Number of elements in the height array along Z direction.

#### Hint

- Total horizontal z-axis distance equals (*zDimension*-1) * zSpacing.

#### Warning

- *zDimension* \< 2 means that ElevationGrid contains no quadrilaterals.

### SFFloat [ ] **xSpacing** 1 <small>(0,∞)</small>

Meters distance between grid-array vertices along X direction.

#### Hint

- Total horizontal x-axis distance equals (xDimension-1) * *xSpacing*.

### SFFloat [ ] **zSpacing** 1 <small>(0,∞)</small>

Meters distance between grid-array vertices along Z direction.

#### Hint

- Total lateral z-axis distance equals (zDimension-1) * *zSpacing*.

### SFBool [ ] **solid** TRUE

Setting *solid* true means draw only one side of polygons (backface culling on), setting *solid* false means draw both sides of polygons (backface culling off).

#### Hints

- Mnemonic "this geometry is *solid* like a brick" (you don't render the inside of a brick).
- If in doubt, use *solid*='false' for maximum visibility.
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and visualization.

#### Warning

- Default value true can completely hide geometry if viewed from wrong side!

### SFBool [ ] **ccw** TRUE

*ccw* defines clockwise/counterclockwise ordering of vertex coordinates, which in turn defines front/back orientation of polygon normals according to Right-Hand Rule (RHR).

#### Hints

- A good debugging technique for problematic polygons is to try changing the value of *ccw*, which can reverse solid effects (single-sided backface culling) and normal-vector direction.
- [Clockwise](https://en.wikipedia.org/wiki/Clockwise){:target="_blank"}

#### Warning

- Consistent and correct ordering of left-handed or right-handed point sequences is important throughout the coord array of point values.

### SFFloat [ ] **creaseAngle** 0 <small>[0,∞)</small>

*creaseAngle* defines angle (in radians) for determining whether adjacent polygons are drawn with sharp edges or smooth shading. If angle between normals of two adjacent polygons is less than *creaseAngle*, smooth shading is rendered across the shared line segment.

#### Hints

- *creaseAngle*=0 means render all edges sharply, *creaseAngle*=3.14159 means render all edges smoothly.
- [Radian units for angular measure](https://en.wikipedia.org/wiki/Radian){:target="_blank"}

### SFBool [ ] **colorPerVertex** TRUE

Whether Color node color values are applied to each point vertex (true) or per quadrilateral (false).

#### Hint

- [X3D Scene Authoring Hints, Color](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#Color){:target="_blank"}

### SFBool [ ] **normalPerVertex** TRUE

Whether Normal node vector values are applied to each point vertex (true) or per quadrilateral (false).

#### Hint

- If no child Normal node is provided, the X3D browser shall automatically generate normals, using creaseAngle to determine smoothed shading across shared vertices.

### MFNode [in, out] **attrib** [ ] <small>[X3DVertexAttributeNode]</small>

Single contained FloatVertexAttribute node that can specify list of per-vertex attribute information for programmable shaders.

#### Hint

- [X3D Architecture 32.2.2.4 Per-vertex attributes](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/shaders.html#Pervertexattributes){:target="_blank"}

### SFNode [in, out] **fogCoord** NULL <small>[FogCoordinate]</small>

Single contained FogCoordinate node that can specify depth parameters for fog in corresponding geometry.

### SFNode [in, out] **color** NULL <small>[X3DColorNode]</small>

Single contained Color or ColorRGBA node that can specify *color* values applied to corresponding vertices according to colorPerVertex field.

### SFNode [in, out] **texCoord** NULL <small>[X3DTextureCoordinateNode]</small>

Single contained TextureCoordinate, TextureCoordinateGenerator or MultiTextureCoordinate node that can specify coordinates for texture mapping onto corresponding geometry.

### SFNode [in, out] **normal** NULL <small>[X3DNormalNode]</small>

Single contained Normal node that can specify perpendicular vectors for corresponding vertices to support rendering computations, applied according to the normalPerVertex field.

#### Hint

- Useful for special effects. Normal vector computation by 3D graphics hardware is quite fast so adding normals to a scene is typically unnecessary.

#### Warning

- *normal* vectors increase file size, typically doubling geometry definitions.

### MFFloat [ ] **height** [ ] <small>(-∞,∞)</small>

Grid array of *height* vertices with upward direction along +Y axis, with xDimension rows and zDimension columns.

#### Hint

- *height* array values are given in row-major order from left to right along X axis, then back to front along Z axis.

#### Warning

- *height* array values are not retained or available at run time since a browser is permitted to condense geometry.

## Advisories

### Hints

- The height array defines (xDimension-1)*(zDimension-1) quadrilaterals.
- Positive direction for normal of each triangle is on same side of the quadrilateral. Triangles are defined either counterclockwise or clockwise depending on value of ccw field.
- ElevationGrid can contain Color or ColorRGBA, Normal and TextureCoordinate nodes.
- Insert a Shape node before adding geometry or Appearance.
- For advanced extensibility, authors can substitute a type-matched ProtoInstance node (with correct containerField value) for contained node content.

### Warning

- Generated quadrilaterals can be nonplanar. Tessellation splits quadrilaterals into triangles along seam starting at initial vertex of the quadrilateral and proceeding to opposite vertex.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Geometry3D/ElevationGrid/ElevationGrid.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of ElevationGrid node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/geometry3D.html#ElevationGrid){:target="_blank"}
