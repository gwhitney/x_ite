---
title: MultiTextureCoordinate
date: 2023-01-07
nav: components-Texturing
categories: [components, Texturing]
tags: [MultiTextureCoordinate, Texturing]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

MultiTextureCoordinate contains multiple TextureCoordinate or TextureCoordinateGenerator nodes, for use by a parent polygonal geometry node such as IndexedFaceSet or a Triangle* node. Each of the contained texture coordinate nodes correspond to the multiple texture nodes contained in a sibling Appearance/MultiTexture node.

The MultiTextureCoordinate node belongs to the **Texturing** component and its default container field is *texCoord.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometricPropertyNode
    + X3DTextureCoordinateNode
      + MultiTextureCoordinate
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFNode [in, out] **texCoord** [ ] <small>[X3DTextureCoordinateNode]</small>

Zero or more contained TextureCoordinate or TextureCoordinateGenerator nodes that specify texture coordinates for the different texture channels, used for texture mapping onto corresponding geometry.

#### Warning

- MultiTextureCoordinate may not contain another MultiTextureCoordinate node.

## Advisories

### Hints

- Add Shape and then polygonal/planar geometry before adding MultiTextureCoordinate.
- [Texture mapping](https://en.wikipedia.org/wiki/Texture_mapping){:target="_blank"}
- Multitexturing is accomplished using MultiTexture, MultiTextureCoordinate and MultiTextureTransform nodes.
- [X3D Texturing component Figure 18.2 Lightmap example](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/texturing.html#f-Lightmapexample){:target="_blank"}
- [X3D Texturing component Table 18.2: Comparison of single texture and multitexture attributes](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/texturing.html#t-SingleAndMultitextureAttrs){:target="_blank"}

### Warnings

- The number of textures to be blended may have a significant impact on performance, depending on available graphics hardware capabilities.
- MultiTextureCoordinate may not contain another MultiTextureCoordinate node.

## See Also

- [X3D Specification of MultiTextureCoordinate node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/texturing.html#MultiTextureCoordinate){:target="_blank"}
