---
title: PointProperties
date: 2023-01-07
nav: components-Shape
categories: [components, Shape]
tags: [PointProperties, Shape]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

PointProperties allows precise fine-grained control over the rendering style of PointSet node points inside the same Shape.

The PointProperties node belongs to the **Shape** component and its default container field is *pointProperties.* It is available from X3D version 4.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DAppearanceChildNode
    + PointProperties
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFFloat [in, out] **pointSizeScaleFactor** 1 <small>(1,∞)</small>

Nominal rendered point size is a browser-dependent minimum renderable point size, which is then multiplied by an additional *pointSizeScaleFactor* (which is greater than or equal to 1).

#### Hint

- Additional sizing modifications are determined by pointSizeMinValue, pointSizeMaxValue, and attenuation array.

### SFFloat [in, out] **pointSizeMinValue** 1 <small>[0,∞)</small>

*pointSizeMinValue* is minimum allowed scaling factor on nominal browser point scaling.

#### Warning

- Maintain *pointSizeMinValue* \<= pointSizeMaxValue.

### SFFloat [in, out] **pointSizeMaxValue** 1 <small>(0,∞)</small>

*pointSizeMaxValue* is maximum allowed scaling factor on nominal browser point scaling.

#### Warning

- Maintain pointSizeMinValue \<= *pointSizeMaxValue*.

### MFFloat [in, out] **attenuation** [ 1, 0, 0 ] <small>(0,∞)</small>

Are set to default values if undefined. Together these parameters define *attenuation* factor 1/(a + b×r + c×r^2) where r is the distance from observer position (current viewpoint) to each point.

#### Hint

- Nominal point size is multiplied by *attenuation* factor and then clipped to a minimum value of pointSizeMinValue × minimum renderable point size, then clipped to maximum size of pointSizeMaxValue × minimum renderable point size.

## Advisories

### Hints

- DEF/USE copies of a single node can provide a similar "look + feel" style for related shapes in a scene.
- When an X3DTextureNode is defined in the same Appearance instance as PointProperties node, the points of a PointSet shall be displayed as point sprites using the given texture(s).

### Warning

- Requires X3D `profile='Full'` or else include `<component name='Shape' level='5'/>`

## See Also

- [X3D Specification of PointProperties node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/shape.html#LineProperties){:target="_blank"}
