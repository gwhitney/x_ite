---
title: NurbsPatchSurface
date: 2023-01-07
nav: components-NURBS
categories: [components, NURBS]
tags: [NurbsPatchSurface, NURBS]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

NurbsPatchSurface defines a contiguous 3D Non-Uniform Rational B-Spline (NURBS) surface.

The NurbsPatchSurface node belongs to the **NURBS** component and its default container field is *geometry.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometryNode
    + X3DParametricGeometryNode
      + X3DNurbsSurfaceGeometryNode
        + NurbsPatchSurface
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFInt32 [in, out] **uTessellation** 0 <small>(-∞,∞)</small>

Hint for surface tessellation.

### SFInt32 [in, out] **vTessellation** 0 <small>(-∞,∞)</small>

Hint for surface tessellation.

### SFBool [ ] **solid** TRUE

Setting *solid* true means draw only one side of polygons (backface culling on), setting *solid* false means draw both sides of polygons (backface culling off).

#### Hints

- Mnemonic "this geometry is *solid* like a brick" (you don't render the inside of a brick).
- If in doubt, use *solid*='false' for maximum visibility.
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and visualization.

#### Warning

- Default value true can completely hide geometry if viewed from wrong side!

### SFBool [ ] **uClosed** FALSE

Whether opposite surface sides are closed (seamless) across u dimension.

### SFBool [ ] **vClosed** FALSE

Whether opposite surface sides are closed (seamless) across u dimension.

### SFInt32 [ ] **uOrder** 3 <small>[2,∞)</small>

Define order of surface by polynomials of degree = order-1.

### SFInt32 [ ] **vOrder** 3 <small>[2,∞)</small>

Define order of surface by polynomials of degree = order-1.

### SFInt32 [ ] **uDimension** 0 <small>[0,∞)</small>

Number of control points in u dimension.

### SFInt32 [ ] **vDimension** 0 <small>[0,∞)</small>

Number of control points in v dimension.

### MFDouble [ ] **uKnot** [ ] <small>(-∞,∞)</small>

Knot vector, where size = number of control points + order of curve.

### MFDouble [ ] **vKnot** [ ] <small>(-∞,∞)</small>

Knot vector, where size = number of control points + order of curve.

### MFDouble [in, out] **weight** [ ] <small>(0,∞)</small>

Vector assigning relative *weight* value to each control point.

### SFNode [in, out] **texCoord** NULL <small>[X3DTextureCoordinateNode|NurbsTextureCoordinate]</small>

Single contained NurbsTextureCoordinate, TextureCoordinate, TextureCoordinateGenerator or MultiTextureCoordinate node that can specify coordinates for texture mapping onto corresponding geometry.

### SFNode [in, out] **controlPoint** NULL <small>[X3DCoordinateNode]</small>

Single contained Coordinate or CoordinateDouble node that can specify control points for NURBS geometry definitions.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/NURBS/NurbsPatchSurface/NurbsPatchSurface.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of NurbsPatchSurface node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/nurbs.html#NurbsPatchSurface){:target="_blank"}
