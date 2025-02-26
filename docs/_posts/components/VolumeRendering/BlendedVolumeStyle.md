---
title: BlendedVolumeStyle
date: 2023-01-07
nav: components-VolumeRendering
categories: [components, VolumeRendering]
tags: [BlendedVolumeStyle, VolumeRendering]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

BlendedVolumeStyle combines rendering of two voxel data sets into one by blending voxel values.

The BlendedVolumeStyle node belongs to the **VolumeRendering** component and its default container field is *renderStyle.* It is available from X3D version 3.3 or higher.

## Hierarchy

```
+ X3DNode
  + X3DVolumeRenderStyleNode
    + X3DComposableVolumeRenderStyleNode
      + BlendedVolumeStyle
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFFloat [in, out] **weightConstant1** 0.5 <small>[0,1]</small>

*weightConstant1* is used when weightFunction1=CONSTANT

### SFFloat [in, out] **weightConstant2** 0.5 <small>[0,1]</small>

*weightConstant2* is used when weightFunction2=CONSTANT

### SFString [in, out] **weightFunction1** "CONSTANT" <small>["CONSTANT", "ALPHA0", "ALPHA1", "TABLE", "ONE_MINUS_ALPHA0", "ONE_MINUS_ALPHA1"]</small>

Specifies 2D textures used to determine weight values when weight function is set to TABLE.

#### Hints

- [X3D Architecture Table 41.3, Weight function types](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/volume.html#t-WeightFunctionTypes){:target="_blank"}
- [X3D Architecture Table 41.4, Transfer function to weight mapping](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/volume.html#t-transferFunctionToWeightMapping){:target="_blank"}

#### Warning

- Do not wrap extra quotation marks around these SFString enumeration values, since "quotation" "marks" are only used for MFString values.

### SFString [in, out] **weightFunction2** "CONSTANT" <small>["CONSTANT", "ALPHA0", "ALPHA1", "TABLE", "ONE_MINUS_ALPHA0", "ONE_MINUS_ALPHA1"]</small>

Specifies 2D textures used to determine weight values when weight function is set to TABLE.

#### Hints

- [X3D Architecture Table 41.3, Weight function types](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/volume.html#t-WeightFunctionTypes){:target="_blank"}
- [X3D Architecture Table 41.4, Transfer function to weight mapping](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/volume.html#t-transferFunctionToWeightMapping){:target="_blank"}

#### Warning

- Do not wrap extra quotation marks around these SFString enumeration values, since "quotation" "marks" are only used for MFString values.

### SFNode [in, out] **weightTransferFunction1** NULL <small>[X3DTexture2DNode]</small>

The *weightTransferFunction1* and weightTransferFunction2 fields specify two-dimensional textures that are used to determine the weight values when the weight function is set to "TABLE". The output weight value depends on the number of components in the textures as specified in Table 41.4.

#### Hint

- Https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/volume.html#t-transferFunctionToWeightMapping

### SFNode [in, out] **weightTransferFunction2** NULL <small>[X3DTexture2DNode]</small>

The weightTransferFunction1 and *weightTransferFunction2* fields specify two-dimensional textures that are used to determine the weight values when the weight function is set to "TABLE". The output weight value depends on the number of components in the textures as specified in Table 41.4.

#### Hint

- Https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/volume.html#t-transferFunctionToWeightMapping

### SFNode [in, out] **renderStyle** NULL <small>[X3DComposableVolumeRenderStyleNode]</small>

Single contained X3DComposableVolumeRenderStyleNode node that defines specific rendering technique for data in the voxels field, and the result is blended with parent VolumeData or SegmentedVoliumeData node.

### SFNode [in, out] **voxels** NULL <small>[X3DTexture3DNode]</small>

Single contained X3DTexture3DNode (ComposedTexture3D, ImageTexture3D, PixelTexture3D) that provides second set of raw voxel information utilized by corresponding rendering styles. Any number of color components (1-4) may be defined.

## Advisories

### Hint

- BlendedVolumeStyle can contain just one each of following: VolumeStyle node with `containerField='renderStyle',` Texture3D node with `containerField='voxels',` Texture2D node with `containerField='weightTransferFunction1'` and Texture2D node with `containerField='weightTransferFunction2'.`

### Warning

- Requires X3D `profile='Full'` or else include `<component name='VolumeRendering' level='3'/>`

## See Also

- [X3D Specification of BlendedVolumeStyle node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/volume.html#BlendedVolumeStyle){:target="_blank"}
