---
title: Polypoint2D
date: 2023-01-07
nav: components-Geometry2D
categories: [components, Geometry2D]
tags: [Polypoint2D, Geometry2D]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

Polypoint2D is a geometry node that defines a set of 2D points in X-Y plane.

The Polypoint2D node belongs to the **Geometry2D** component and its default container field is *geometry.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometryNode
    + Polypoint2D
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFVec2f [in, out] **point** [ ] <small>(-∞,∞)</small>

2D coordinates of vertices.

#### Hint

- For size animation, modify the scale of a parent/ancestor Transform node instead.

#### Warning

- Simple-geometry dimensions are initializeOnly and cannot be changed after initial creation, avoiding the need for potentially expensive tessellation at run time.

## Advisories

### Hint

- [Insert a Shape node before adding geometry or Appearance. Examples: X3D Example Archives, X3D for Web Authors, Chapter 10 Geometry 2D](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter10Geometry2D){:target="_blank"}

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Geometry2D/Polypoint2D/Polypoint2D.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of Polypoint2D node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/geometry2D.html#Polypoint2D){:target="_blank"}
