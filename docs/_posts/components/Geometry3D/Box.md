---
title: Box
date: 2023-01-07
nav: components-Geometry3D
categories: [components, Geometry3D]
tags: [Box, Geometry3D]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

Box is a geometry node specifying a rectangular cuboid.

The Box node belongs to the **Geometry3D** component and its default container field is *geometry.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometryNode
    + Box
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFVec3f [ ] **size** 2 2 2 <small>(0,∞)</small>

*size* x y z in meters.

#### Hint

- For *size* animation, modify the scale of a parent/ancestor Transform node instead.

#### Warning

- Simple-geometry dimensions are initializeOnly and cannot be changed after initial creation, avoiding the need for potentially expensive tessellation at run time.

### SFBool [ ] **solid** TRUE

Setting *solid* true means draw only one side of polygons (backface culling on), setting *solid* false means draw both sides of polygons (backface culling off).

#### Hints

- Mnemonic "this geometry is *solid* like a brick" (you don't render the inside of a brick).
- If in doubt, use *solid*='false' for maximum visibility.
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and visualization.

#### Warnings

- Default value true can completely hide geometry if viewed from wrong side!
- *solid* false not supported in VRML97.

## Advisories

### Hints

- [Cuboid](https://en.wikipedia.org/wiki/Cuboid){:target="_blank"}
- [Parallelepiped](https://en.wikipedia.org/wiki/Parallelepiped){:target="_blank"}
- Insert a Shape node before adding geometry or Appearance.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Geometry3D/Box/Box.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of Box node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/geometry3D.html#Box){:target="_blank"}
