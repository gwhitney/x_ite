---
title: IndexedLineSet
date: 2023-01-07
nav: components-Rendering
categories: [components, Rendering]
tags: [IndexedLineSet, Rendering]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

IndexedLineSet defines polyline segments using index lists corresponding to vertex coordinates. IndexedLineSet is a geometry node that can contain a Coordinate or CoordinateDouble node and optionally a Color or ColorRGBA node.

The IndexedLineSet node belongs to the **Rendering** component and its default container field is *geometry.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometryNode
    + IndexedLineSet
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFInt32 [in] **set_colorIndex** <small>[0,∞) or -1</small>

*colorIndex* values define the order in which Color or ColorRGBA values are applied to polygons (or vertices).

#### Hints

- If *colorIndex* array is not provided, then Color or ColorRGBA values are indexed according to the coordIndex field.
- If colorPerVertex='false' then one index is provided for each polygon defined by the coordIndex array. No sentinel -1 values are included.
- If colorPerVertex='true' then a matching set of indices is provided, each separated by sentinel -1, that exactly corresponds to individual values in the coordIndex array polygon definitions.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### MFInt32 [in] **set_coordIndex** <small>[0,∞) or -1</small>

*coordIndex* indices provide the order in which coordinates are applied to construct each polyline. Order starts at index 0, commas are optional between sets.

#### Hint

- Sentinel value -1 is used to separate indices for each successive polyline.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### SFBool [ ] **colorPerVertex** TRUE

Whether Color node color values are applied to each point vertex (true) or per polyline (false).

#### Hint

- [X3D Scene Authoring Hints, Color](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#Color){:target="_blank"}

### MFInt32 [ ] **colorIndex** [ ] <small>[0,∞) or -1</small>

*colorIndex* values define the order in which Color or ColorRGBA values are applied to polygons (or vertices).

#### Hints

- If *colorIndex* array is not provided, then Color or ColorRGBA values are indexed according to the coordIndex field.
- If colorPerVertex='false' then one index is provided for each polygon defined by the coordIndex array. No sentinel -1 values are included.
- If colorPerVertex='true' then a matching set of indices is provided, each separated by sentinel -1, that exactly corresponds to individual values in the coordIndex array polygon definitions.
- If rendering Coordinate points originally defined for an IndexedFaceSet, index values may need to repeat initial each initial vertex to close the polygons.

#### Warning

- If child Color or ColorRGBA node is not provided, then geometry is rendered using corresponding Appearance and material/texture values.

### MFInt32 [ ] **coordIndex** [ ] <small>[0,∞) or -1</small>

*coordIndex* indices provide the order in which coordinates are applied to construct each polygon face. Order starts at index 0, commas are optional between sets, use -1 to separate indices for each polyline.

#### Hints

- If rendering Coordinate points originally defined for an IndexedFaceSet, index values may need to repeat initial each initial vertex to close the polygons.
- Sentinel value -1 is used to separate indices for each successive polyline.

#### Warning

- *coordIndex* is required in order to connect contained coordinate point values.

### MFNode [in, out] **attrib** [ ] <small>[X3DVertexAttributeNode]</small>

Single contained FloatVertexAttribute node that can specify list of per-vertex attribute information for programmable shaders.

#### Hint

- [X3D Architecture 32.2.2.4 Per-vertex attributes](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/shaders.html#Pervertexattributes){:target="_blank"}

### SFNode [in, out] **fogCoord** NULL <small>[FogCoordinate]</small>

Single contained FogCoordinate node that can specify depth parameters for fog in corresponding geometry.

### SFNode [in, out] **color** NULL <small>[X3DColorNode]</small>

Single contained Color or ColorRGBA node that can specify *color* values applied to corresponding vertices according to colorIndex and colorPerVertex fields.

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

- [Polygonal chain](https://en.wikipedia.org/wiki/Polygonal_chain){:target="_blank"}
- Either values in a contained Color node, or else Material emissiveColor in corresponding Appearance node, are used for rendering lines and points.
- Adding LineProperties to the corresponding Appearance node can modify the rendering style of these lines.
- If rendering Coordinate points originally defined for an IndexedFaceSet, index values may need to repeat each initial vertex to close each polygon outline.
- Step-wise variation or linear interpolation of color values can be used as a good scientific visualization technique to map arbitrary function values to a color map.
- Insert a Shape node before adding geometry or Appearance.
- For advanced extensibility, authors can substitute a type-matched ProtoInstance node (with correct containerField value) for contained node content.
- Consider including Fog (with Fog color matching Background color) to provide further depth cueing for IndexedLineSet (ILS).

### Warnings

- Lines are not lit, are not texture-mapped, and do not participate in collision detection.
- Use a different color (or Material emissiveColor) than the Background color, otherwise geometry is invisible.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Rendering/IndexedLineSet/IndexedLineSet.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of IndexedLineSet node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/rendering.html#IndexedLineSet){:target="_blank"}
