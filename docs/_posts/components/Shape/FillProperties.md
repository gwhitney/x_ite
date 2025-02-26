---
title: FillProperties
date: 2023-01-07
nav: components-Shape
categories: [components, Shape]
tags: [FillProperties, Shape]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

FillProperties indicates whether appearance is filled or hatched for associated geometry nodes inside the same Shape. Hatches are applied on top of the already rendered appearance of the node, and are not affected by lighting.

The FillProperties node belongs to the **Shape** component and its default container field is *fillProperties.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DAppearanceChildNode
    + FillProperties
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **filled** TRUE

Whether or not associated geometry is *filled*.

### SFBool [in, out] **hatched** TRUE

Whether or not associated geometry is *hatched*.

### SFInt32 [in, out] **hatchStyle** 1 <small>[0,∞)</small>

*hatchStyle* selects a hatch pattern from ISO/IEC 9973 International Register of Graphical Items. 1=Horizontal equally spaced parallel lines. 2=Vertical equally spaced parallel lines. 3=Positive slope equally spaced parallel lines. 4=Negative slope equally spaced parallel lines. 5=Horizontal/vertical crosshatch. 6=Positive slope/negative slope crosshatch. 7=(cast iron or malleable iron and general use for all materials). 8=(steel). 9=(bronze, brass, copper, and compositions). 10=(white metal, zinc, lead, babbit, and alloys). 11=(magnesium, aluminum, and aluminum alloys). 12=(rubber, plastic, and electrical insulation). 13=(cork, felt, fabric, leather, and fibre). 14=(thermal insulation). 15=(titanium and refi-actory material). 16=(marble, slate, porcelain, glass, etc.). 17=(earth). 18=(sand). 19=(repeating dot).

#### Hint

- [Detailed descriptions of hatchstyle values are found at the ISO/IEC 9973 International Register of Graphical Items](https://www.iso.org/jtc1/sc24/register){:target="_blank"} [](https://isotc.iso.org/livelink/livelink/fetch/-8916524/8916549/8916590/6208440/class_pages/hatchstyle.html){:target="_blank"}

### SFColor [in, out] **hatchColor** 1 1 1 <small>[0,1]</small>

Color of the hatch pattern.

## Advisories

### Hint

- DEF/USE copies of a single node can provide a similar "look + feel" style for related shapes in a scene.

### Warning

- Requires X3D `profile='Full'` or else include `<component name='Shape' level='3'/>`

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Shape/FillProperties/FillProperties.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of FillProperties node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/shape.html#FillProperties){:target="_blank"}
