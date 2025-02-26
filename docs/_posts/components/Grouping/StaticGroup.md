---
title: StaticGroup
date: 2023-01-07
nav: components-Grouping
categories: [components, Grouping]
tags: [StaticGroup, Grouping]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

StaticGroup is a Grouping node that can contain most nodes. StaticGroup children are guaranteed to not change, send events, receive events, or include re-USE-able content. This allows browser optimizations of contained-node content.

The StaticGroup node belongs to the **Grouping** component and its default container field is *children.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + StaticGroup (X3DBoundedObject)*
```

<small>\* Derived from multiple interfaces.</small>

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **visible** TRUE

Whether or not renderable content within this node is visually displayed.

#### Hints

- The *visible* field has no effect on animation behaviors, event passing or other non-visual characteristics.
- Content must be *visible* to be collidable and to be pickable.

### SFBool [in, out] **bboxDisplay** FALSE

Whether to display bounding box for associated geometry, aligned with world coordinates.

#### Hint

- The bounding box is displayed regardless of whether contained content is visible.

### SFVec3f [ ] **bboxSize** -1 -1 -1 <small>[0,∞) or −1 −1 −1</small>

Bounding box size is usually omitted, and can easily be calculated automatically by an X3D player at scene-loading time with minimal computational cost. Bounding box size can also be defined as an optional authoring hint that suggests an optimization or constraint.

#### Hints

- Can be useful for collision computations or inverse-kinematics (IK) engines.
- Precomputation and inclusion of bounding box information can speed up the initialization of large detailed models, with a corresponding cost of increased file size.
- [X3D Architecture, 10.2.2 Bounding boxes](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/grouping.html#BoundingBoxes){:target="_blank"}
- [X3D Architecture, 10.3.1 X3DBoundedObject](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/grouping.html#X3DBoundedObject){:target="_blank"}

### SFVec3f [ ] **bboxCenter** 0 0 0 <small>(-∞,∞)</small>

Bounding box center accompanies bboxSize and provides an optional hint for bounding box position offset from origin of local coordinate system.

#### Hints

- Precomputation and inclusion of bounding box information can speed up the initialization of large detailed models, with a corresponding cost of increased file size.
- [X3D Architecture, 10.2.2 Bounding boxes](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/grouping.html#BoundingBoxes){:target="_blank"}
- [X3D Architecture, 10.3.1 X3DBoundedObject](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/grouping.html#X3DBoundedObject){:target="_blank"}

### MFNode [ ] **children** [ ] <small>[X3DChildNode]</small>

Grouping nodes contain an ordered list of *children* nodes.

#### Hints

- Each grouping node defines a coordinate space for its *children*, relative to the coordinate space of its parent node. Thus transformations accumulate down the scene graph hierarchy.
- InputOnly MFNode addChildren field can append new X3DChildNode nodes via a ROUTE connection, duplicate input nodes (i.e. matching DEF, USE values) are ignored.

#### Warning

- StaticGroup does not support inputOnly MFNode fields addChildren or removeChildren.

## Advisories

### Hint

- Insert a Shape node before adding geometry or Appearance.

### Warning

- Requires X3D `profile='Full'` or else include `<component name='Grouping' level='3'/>`

## See Also

- [X3D Specification of StaticGroup node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/grouping.html#StaticGroup){:target="_blank"}
