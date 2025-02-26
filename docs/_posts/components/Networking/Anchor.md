---
title: Anchor
date: 2023-01-07
nav: components-Networking
categories: [components, Networking]
tags: [Anchor, Networking]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

Anchor is a Grouping node that can contain most nodes. When the user selects any of the geometry contained by the Anchor node, the browser either jumps to another viewpoint (similar to HTML bookmark) or else loads content (such as X3D, an image or HTML) specified by the url field. Newly loaded content completely replaces current content, if the value of parameter field indicates using the same window.

The Anchor node belongs to the **Networking** component and its default container field is *children.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DGroupingNode (X3DBoundedObject)*
      + Anchor (X3DUrlObject)*
```

<small>\* Derived from multiple interfaces.</small>

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of the url asset.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFBool [in, out] **load** TRUE

The *load* field has no effect, Anchor operation is only triggered by user selection.

### MFString [in, out] **url** [ ] <small>[URI]</small>

Address of replacement world, or #ViewpointDEFName within the current scene, or alternate Web resource, activated by the user selecting Shape geometry within the Anchor children nodes.

#### Hints

- Jump to a world's internal viewpoint by appending viewpoint name (for example, #ViewpointName, someOtherCoolWorld.x3d#GrandTour).
- Jump to a local viewpoint by only using viewpoint name (for example, #GrandTour).
- Binding a different Viewpoint triggers an isBound event that can initiate other user-arrival reactions via event chains to interpolators or scripts.
- MFString arrays can have multiple values, so separate each individual string by quote marks "https://www.web3d.org" "https://www.web3d.org/about" "etc."
- Alternative XML encoding for quotation mark " is &amp;quot; (which is an example of a character entity).
- Can replace embedded blank(s) in *url* queries with %20 for each blank character.
- Pop up a new window with *url* value as follows: "JavaScript:window.open('somePage.html','popup','width=240,height=240');location.href='HelloWorld.x3d'"
- [X3D Scene Authoring Hints, urls](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#urls){:target="_blank"}

#### Warning

- Strictly match directory and filename capitalization for http links! This is important for portability. Some operating systems are forgiving of capitalization mismatches, but http/https *url* addresses and paths in Unix-based operating systems are all case sensitive and intolerant of uppercase/lowercase mismatches.

### MFString [in, out] **parameter** [ ]

If provided, *parameter* tells the X3D player where to to redirect the loaded url.

#### Hints

- Set *parameter* value as target=_blank to load the target url into a new browser frame.
- Set *parameter* value as target=frame_name to load target url into another browser frame.
- MFString arrays can have multiple values, so separate each individual string by quote marks. "https://www.web3d.org" "https://www.web3d.org/about" "etc." Interchange profile hint: this field may be ignored, applying the default value regardless.

### SFTime [in, out] **autoRefresh** 0 <small>[0,∞)</small>

The [*autoRefresh* field has no effect, Anchor operation is only triggered by user selection.

### SFTime [in, out] **autoRefreshTimeLimit** 3600 <small>[0,∞)</small>

The [*autoRefreshTimeLimit* field has no effect, Anchor operation is only triggered by user selection.

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

### MFNode [in] **addChildren**

Input field *addChildren*.

### MFNode [in] **removeChildren**

Input field *removeChildren*.

### MFNode [in, out] **children** [ ] <small>[X3DChildNode]</small>

Grouping nodes contain an ordered list of *children* nodes.

#### Hints

- Each grouping node defines a coordinate space for its *children*, relative to the coordinate space of its parent node. Thus transformations accumulate down the scene graph hierarchy.
- InputOnly MFNode addChildren field can append new X3DChildNode nodes via a ROUTE connection, duplicate input nodes (i.e. matching DEF, USE values) are ignored.
- InputOnly MFNode removeChildren field can remove nodes from the *children* list, unrecognized input nodes (i.e. nonmatching DEF, USE values) are ignored.
- [X3D Architecture 10.2.1 Grouping and *children* node types](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/grouping.html#GroupingAndChildrenNodes){:target="_blank"}

## Advisories

### Hints

- Insert a Shape node before adding geometry or Appearance.
- [When parent node is LoadSensor, apply `containerField='children'` (X3Dv4) or `containerField='watchList'` (X3Dv3).](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#fieldNameChanges){:target="_blank"}

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Networking/Anchor/Anchor.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of Anchor node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/networking.html#Anchor){:target="_blank"}
