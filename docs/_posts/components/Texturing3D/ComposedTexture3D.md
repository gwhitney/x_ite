---
title: ComposedTexture3D
date: 2023-01-07
nav: components-Texturing3D
categories: [components, Texturing3D]
tags: [ComposedTexture3D, Texturing3D]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

ComposedTexture3D defines a 3D image-based texture map as a collection of 2D texture sources at various depths.

The ComposedTexture3D node belongs to the **Texturing3D** component and its default container field is *texture.* It is available from X3D version 3.1 or higher.

## Hierarchy

```
+ X3DNode
  + X3DAppearanceChildNode
    + X3DTextureNode
      + X3DSingleTextureNode
        + X3DTexture3DNode
          + ComposedTexture3D
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of the url asset.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFBool [ ] **repeatS** FALSE

Whether to repeat texture along S axis horizontally from left to right.

### SFBool [ ] **repeatT** FALSE

Whether to repeat texture along T axis vertically from top to bottom.

### SFBool [ ] **repeatR** FALSE

Whether to repeat texture along R axis from front to back.

### SFNode [ ] **textureProperties** NULL <small>[TextureProperties]</small>

Single contained TextureProperties node that can specify additional visual attributes applied to corresponding texture images.

### MFNode [in, out] **texture** [ ] <small>[X3DTexture2DNode]</small>

Collection of 2D *texture* sources.

## Advisories

### Hints

- Insert 2^n ImageTexture, PixelTexture or MovieTexture child nodes. The first image is at depth 0 and each following image is at an increasing depth value in the R direction.
- Can contain a single TextureProperties node.
- Insert Shape and Appearance nodes before adding texture.
- [X3D Architecture 33.2.2 3D texturing concepts](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/texture3D.html#3DTextureconcepts){:target="_blank"}

### Warning

- Requires X3D `profile='Full'` or else include `<component name='Texturing3D' level='1'/>`

## See Also

- [X3D Specification of ComposedTexture3D node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/texture3D.html#ComposedTexture3D){:target="_blank"}
