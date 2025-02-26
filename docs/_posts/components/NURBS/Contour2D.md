---
title: Contour2D
date: 2023-01-07
nav: components-NURBS
categories: [components, NURBS]
tags: [Contour2D, NURBS]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

Contour2D groups a set of curve segments into a composite contour. The children segments form a closed loop, with first point of first child repeated as last point of last child, and last point of each segment repeated as the first point of the next consecutive segment. The children segments are type NurbsCurve2D or ContourPolyline2D, enumerated in the consecutive order of contour topology.

The Contour2D node belongs to the **NURBS** component and its default container field is *trimmingContour.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + Contour2D
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFNode [in] **addChildren**

Input field *addChildren*.

### MFNode [in] **removeChildren**

Input field *removeChildren*.

### MFNode [in, out] **children** [ ] <small>[NurbsCurve2D|ContourPolyline2D]</small>

The *children* form a closed loop with first point of first child repeated as last point of last child, and the last point of a segment repeated as first point of the consecutive one.

#### Hint

- *children* nodes are listed in consecutive order according to topology of the contour.

## Advisories

### Hint

- Contour2D is used as the trimmingContour field of the NurbsTrimmedSurface node.

### Warning

- Contour2D is not a renderable geometry node.

## See Also

- [X3D Specification of Contour2D node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/nurbs.html#Contour2D){:target="_blank"}
