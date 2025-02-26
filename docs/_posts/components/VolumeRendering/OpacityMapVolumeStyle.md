---
title: OpacityMapVolumeStyle
date: 2023-01-07
nav: components-VolumeRendering
categories: [components, VolumeRendering]
tags: [OpacityMapVolumeStyle, VolumeRendering]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

OpacityMapVolumeStyle specifies that volumetric data is rendered using opacity mapped to a transfer function texture.

The OpacityMapVolumeStyle node belongs to the **VolumeRendering** component and its default container field is *renderStyle.* It is available from X3D version 3.3 or higher.

## Hierarchy

```
+ X3DNode
  + X3DVolumeRenderStyleNode
    + X3DComposableVolumeRenderStyleNode
      + OpacityMapVolumeStyle
```

## Fields

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFNode [in, out] **transferFunction** NULL <small>[X3DTexture2DNode,X3DTexture3DNode]</small>

The *transferFunction* field holds a single texture representation in either two or three dimensions that maps the voxel data values to a specific colour output. If no value is supplied for this field, the default implementation shall generate a 256x1 alpha-only image that blends from completely transparent at pixel 0 to fully opaque at pixel 255.The texture may be any number of dimensions and any number of components. The voxel values are used as a lookup coordinates into the transfer function texture, where the texel value represents the output colour.

## Advisories

### Hint

- Contains a single ImageTexture2D or ImageTexture3D node with `containerField='transferFunction'.` Voxel values are used as lookup coordinates into the transfer function texture, where the texel value represents the output color.

### Warning

- Requires X3D `profile='Full'` or else include `<component name='VolumeRendering' level='2'/>`

## See Also

- [X3D Specification of OpacityMapVolumeStyle node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/volume.html#OpacityMapVolumeStyle){:target="_blank"}
