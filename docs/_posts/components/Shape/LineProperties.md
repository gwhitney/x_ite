---
title: LineProperties
date: 2023-01-07
nav: components-Shape
categories: [components, Shape]
tags: [LineProperties, Shape]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

LineProperties allows precise fine-grained control over the rendering style of lines and edges for associated geometry nodes inside the same Shape.

The LineProperties node belongs to the **Shape** component and its default container field is *lineProperties.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DAppearanceChildNode
    + LineProperties
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **applied** TRUE

Whether or not LineProperties are *applied* to associated geometry.

### SFInt32 [in, out] **linetype** 1 <small>[1,∞)</small>

*linetype* selects a line pattern, with solid default if defined value isn't supported. Values with guaranteed support are 1 Solid, 2 Dashed, 3 Dotted, 4 Dashed-dotted, 5 Dash-dot-dot. Optionally supported values are 6 single-headed arrow (arrow tip occurs at last point of each individual list of points), 7 single dot, 8 double-headed arrow, 10 chain line, 11 center line, 12 hidden line, 13 phantom line, 14 break line 1, 15 break line 2, 16 User-specified dash pattern.

#### Hint

- [Detailed descriptions of lineType values are found at the ISO/IEC 9973 International Register of Graphical Items](https://www.iso.org/jtc1/sc24/register){:target="_blank"} [](https://isotc.iso.org/livelink/livelink/fetch/-8916524/8916549/8916590/6208440/class_pages/*linetype*.html){:target="_blank"}

### SFFloat [in, out] **linewidthScaleFactor** 0 <small>(-∞,∞)</small>

*linewidthScaleFactor* is a scale factor multiplied by browser-dependent nominal linewidth, mapped to nearest available line width. Values zero or less provide minimum available line width.

## Advisories

### Hints

- DEF/USE copies of a single node can provide a similar "look + feel" style for related shapes in a scene.
- [LineProperties illustration model](https://X3dGraphics.com/examples/X3dForWebAuthors/Chapter05AppearanceMaterialTextures/LinePropertiesExampleIndex.html){:target="_blank"}

### Warning

- Requires X3D `profile='Full'` or else include `<component name='Shape' level='2'/>`

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Shape/LineProperties/LineProperties.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of LineProperties node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/shape.html#LineProperties){:target="_blank"}
