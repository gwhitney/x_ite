---
title: IndexedQuadSet
date: 2023-01-07
nav: components-CADGeometry
categories: [components, CADGeometry]
tags: [IndexedQuadSet, CADGeometry]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

IndexedQuadSet is a geometry node that defines planar quadrilaterals. IndexedQuadSet contains a Coordinate or CoordinateDouble node, and can also contain Color or ColorRGBA, Normal and TextureCoordinate nodes.

The IndexedQuadSet node belongs to the **CADGeometry** component and its default container field is *geometry.* It is available from X3D version 3.1 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometryNode
    + X3DComposedGeometryNode
      + IndexedQuadSet
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFInt32 [in] **set_index** <small>[0,∞)</small>

Input field *set_index*.

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

### SFBool [ ] **colorPerVertex** TRUE

Whether Color or ColorRGBA values are applied to each point vertex (true) or to each polygon face (false).

#### Hint

- [X3D Scene Authoring Hints, Color](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#Color){:target="_blank"}

#### Warnings

- The provided value of IndexedQuadSet *colorPerVertex* field is ignored and always treated as true.
- If child Color or ColorRGBA node is not provided, then geometry is rendered using corresponding Appearance and material/texture values.

### SFBool [ ] **normalPerVertex** TRUE

Whether Normal node vector values are applied to each point vertex (true) or to each polygon face (false).

#### Hint

- If no child Normal node is provided, the X3D browser shall automatically generate normals, using creaseAngle to determine smoothed shading across shared vertices.

### MFInt32 [ ] **index** [ ] <small>[0,∞)</small>

*index* values provide order in which coordinates are applied. Order starts at *index* 0, commas are optional between sets. Four unique indices are defined for each quadrilateral.

#### Warning

- -1 sentinel values are not allowed.

### MFNode [in, out] **attrib** [ ] <small>[X3DVertexAttributeNode]</small>

Single contained FloatVertexAttribute node that can specify list of per-vertex attribute information for programmable shaders.

#### Hint

- [X3D Architecture 32.2.2.4 Per-vertex attributes](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/shaders.html#Pervertexattributes){:target="_blank"}

### SFNode [in, out] **fogCoord** NULL <small>[FogCoordinate]</small>

Single contained FogCoordinate node that can specify depth parameters for fog in corresponding geometry.

### SFNode [in, out] **color** NULL <small>[X3DColorNode]</small>

Single contained Color or ColorRGBA node that can specify *color* values applied to corresponding vertices according to colorIndex and colorPerVertex fields.

### SFNode [in, out] **texCoord** NULL <small>[X3DTextureCoordinateNode]</small>

Single contained TextureCoordinate, TextureCoordinateGenerator or MultiTextureCoordinate node that can specify coordinates for texture mapping onto corresponding geometry.

### SFNode [in, out] **normal** NULL <small>[X3DNormalNode]</small>

Single contained Normal node that can specify perpendicular vectors for corresponding vertices to support rendering computations, applied according to the normalPerVertex field.

#### Hint

- Useful for special effects. Normal vector computation by 3D graphics hardware is quite fast so adding normals to a scene is typically unnecessary.

#### Warning

- *normal* vectors increase file size, typically doubling geometry definitions.

### SFNode [in, out] **coord** NULL <small>[X3DCoordinateNode]</small>

Single contained Coordinate or CoordinateDouble node that can specify a list of vertex values.

## Advisories

### Hints

- [Quadrilateral](https://en.wikipedia.org/wiki/Quadrilateral){:target="_blank"}
- [Quadrilateral](https://en.wikipedia.org/wiki/Quadrilateral){:target="_blank"}
- Color, normal and texCoord values are applied in the same order as coord values.
- Insert a Shape node before adding geometry or Appearance.
- For advanced extensibility, authors can substitute a type-matched ProtoInstance node (with correct containerField value) for contained node content.
- [X3D for Advanced Modeling (X3D4AM) slideset](https://x3dgraphics.com/slidesets/X3dForAdvancedModeling/ComputerAidedDesignInterchangeProfile.pdf){:target="_blank"}

### Warnings

- Requires X3D `profile='Full'` or else include `<component name='CADGeometry' level='1'/>`
- Rendering characteristics are undefined if polygons are not planar.
- Avoid self-intersecting polygon line segments, otherwise defined geometry is irregular and rendering results are undefined.

## See Also

- [X3D Specification of IndexedQuadSet node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/CADGeometry.html#IndexedQuadSet){:target="_blank"}
