---
title: TextureCoordinate
date: 2023-01-07
nav: components-Texturing
categories: [components, Texturing]
tags: [TextureCoordinate, Texturing]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

TextureCoordinate specifies 2D (s,t) texture-coordinate points, used by vertex-based geometry nodes (such as IndexedFaceSet or ElevationGrid) to map textures to vertices (and patches to NURBS surfaces).

The TextureCoordinate node belongs to the **Texturing** component and its default container field is *texCoord.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometricPropertyNode
    + X3DTextureCoordinateNode
      + X3DSingleTextureCoordinateNode
        + TextureCoordinate
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **mapping** ""

The *mapping* label identifies which texture coordinates and transformations are used to compute texture effects from corresponding geometry on a given material.

#### Hint

- [TODO support planned to perform multiple-node *mapping* validation checks using X3D Schematron or X3D Validator](https://savage.nps.edu/X3dValidator){:target="_blank"}

### MFVec2f [in, out] **point** [ ] <small>(-∞,∞)</small>

Pairs of 2D (s,t) texture coordinates, either in range [0,1] or higher if repeating.

## Advisories

### Hints

- Add Shape and then polygonal/planar geometry before adding TextureCoordinate.
- [Texture mapping](https://en.wikipedia.org/wiki/Texture_mapping){:target="_blank"}
- [X3D Texturing component Figure 18.1, Texture map coordinate system](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/texturing.html#f-TextureMapCoordSystem){:target="_blank"}

## See Also

- [X3D Specification of TextureCoordinate node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/texturing.html#TextureCoordinate){:target="_blank"}
