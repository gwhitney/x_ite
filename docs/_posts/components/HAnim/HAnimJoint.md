---
title: HAnimJoint
date: 2023-01-07
nav: components-HAnim
categories: [components, HAnim]
tags: [HAnimJoint, HAnim]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

HAnimJoint node can represent each joint in a body. The child HAnimSegment node provides a visual representation of the skeleton segment.

The HAnimJoint node belongs to the **HAnim** component and its default container field is *children.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DGroupingNode
      + HAnimJoint
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of this node.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFString [in, out] **name** ""

Unique *name* attribute must be defined so that HAnimJoint node can be identified at run time for animation purposes.

#### Hints

- [HAnim Specification part 1, Humanoid Joint-Segment Hierarchy](https://www.web3d.org/documents/specifications/19774/V2.0/Architecture/concepts.html#Hierarchy){:target="_blank"}
- Well-defined names can simplify design and debugging through improved author understanding.
- [X3D Scene Authoring Hints, Naming Conventions](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#NamingConventions){:target="_blank"}
- [HAnim2 Names HAnim1 Alias Tables](https://www.web3d.org/x3d/content/examples/HumanoidAnimation/HAnim2NameHAnim1AliasTables.txt){:target="_blank"}
- Candidate names found in the HAnim Specification are humanoid_root, sacroiliac, l_hip, l_knee, l_talocrural, l_talocalcaneonavicular, l_cuneonavicular_1, l_tarsometatarsal_1, l_metatarsophalangeal_1, l_tarsal_interphalangeal_1, l_cuneonavicular_2, l_tarsometatarsal_2, l_metatarsophalangeal_2, l_tarsal_proximal_interphalangeal_2, l_tarsal_distal_interphalangeal_2, l_cuneonavicular_3, l_tarsometatarsal_3, l_metatarsophalangeal_3, l_tarsal_proximal_interphalangeal_3, l_tarsal_distal_interphalangeal_3, l_calcaneocuboid, l_transversetarsal, l_tarsometatarsal_4, l_metatarsophalangeal_4, l_tarsal_proximal_interphalangeal_4, l_tarsal_distal_interphalangeal_4, l_tarsometatarsal_5, l_metatarsophalangeal_5, l_tarsal_proximal_interphalangeal_5, l_tarsal_distal_interphalangeal_5, r_hip, r_knee, r_talocrural, r_talocalcaneonavicular, r_cuneonavicular_1, r_tarsometatarsal_1, r_metatarsophalangeal_1, r_tarsal_interphalangeal_1, r_cuneonavicular_2, r_tarsometatarsal_2, r_metatarsophalangeal_2, r_tarsal_proximal_interphalangeal_2, r_tarsal_distal_interphalangeal_2, r_cuneonavicular_3, r_tarsometatarsal_3, r_metatarsophalangeal_3, r_tarsal_proximal_interphalangeal_3, r_tarsal_distal_interphalangeal_3, r_calcaneocuboid, r_transversetarsal, r_tarsometatarsal_4, r_metatarsophalangeal_4, r_tarsal_proximal_interphalangeal_4, r_tarsal_distal_interphalangeal_4, r_tarsometatarsal_5, r_metatarsophalangeal_5, r_tarsal_proximal_interphalangeal_5, r_tarsal_distal_interphalangeal_5, vl5, vl4, vl3, vl2, vl1, vt12, vt11, vt10, vt9, vt8, vt7, vt6, vt5, vt4, vt3, vt2, vt1, vc7, vc6, vc5, vc4, vc3, vc2, vc1, skullbase, l_eyelid_joint, r_eyelid_joint, l_eyeball_joint, r_eyeball_joint, l_eyebrow_joint, r_eyebrow_joint, temporomandibular, l_sternoclavicular, l_acromioclavicular, l_shoulder, l_elbow, l_radiocarpal, l_midcarpal_1, l_carpometacarpal_1, l_metacarpophalangeal_1, l_carpal_interphalangeal_1, l_midcarpal_2, l_carpometacarpal_2, l_metacarpophalangeal_2, l_carpal_proximal_interphalangeal_2, l_carpal_distal_interphalangeal_2, l_midcarpal_3, l_carpometacarpal_3, l_metacarpophalangeal_3, l_carpal_proximal_interphalangeal_3, l_carpal_distal_interphalangeal_3, l_midcarpal_4_5, l_carpometacarpal_4, l_metacarpophalangeal_4, l_carpal_proximal_interphalangeal_4, l_carpal_distal_interphalangeal_4, l_carpometacarpal_5, l_metacarpophalangeal_5, l_carpal_proximal_interphalangeal_5, l_carpal_distal_interphalangeal_5, r_sternoclavicular, r_acromioclavicular, r_shoulder, r_elbow, r_radiocarpal, r_midcarpal_1, r_carpometacarpal_1, r_metacarpophalangeal_1, r_carpal_interphalangeal_1, r_midcarpal_2, r_carpometacarpal_2, r_metacarpophalangeal_2, r_carpal_proximal_interphalangeal_2, r_carpal_distal_interphalangeal_2, r_midcarpal_3, r_carpometacarpal_3, r_metacarpophalangeal_3, r_carpal_proximal_interphalangeal_3, r_carpal_distal_interphalangeal_3, r_midcarpal_4_5, r_carpometacarpal_4, r_metacarpophalangeal_4, r_carpal_proximal_interphalangeal_4, r_carpal_distal_interphalangeal_4, r_carpometacarpal_5, r_metacarpophalangeal_5, r_carpal_proximal_interphalangeal_5, r_carpal_distal_interphalangeal_5

#### Warnings

- *name* prefix must match ancestor HAnimHumanoid *name* followed by underscore character, if more than one humanoid appears within a scene file. For example, 'Nancy_' prepended before location *name*.
- *name* field is not included if this instance is a USE node, in order to avoid potential mismatches. Examples: humanoid_root sacroiliac l_hip l_knee l_ankle etc. as listed in HAnim Specification.
- [Note precise spelling of special HAnimJoint *name*='humanoid_root' according to](https://www.web3d.org/documents/specifications/19774/V2.0/Architecture/concepts.html#TheBody){:target="_blank"}

### SFVec3f [in, out] **translation** 0 0 0 <small>(-∞,∞)</small>

Position of children relative to local coordinate system.

#### Hint

- Since default pose faces along +Z axis, -x values are right side and +x values are left side within HAnimHumanoid.

#### Warning

- Usually HAnimJoint position is controlled by the center field, not the *translation* field.

### SFRotation [in, out] **rotation** 0 0 1 0 <small>(-∞,∞) or [-1,1]</small>

Orientation of children relative to local coordinate system.

#### Warning

- Default pose is typically empty (or an identity *rotation*) to avoid distorted body animations.

### SFVec3f [in, out] **scale** 1 1 1 <small>(0,∞)</small>

Non-uniform x-y-z *scale* of child coordinate system, adjusted by center and scaleOrientation.

### SFRotation [in, out] **scaleOrientation** 0 0 1 0 <small>(-∞,∞) or [-1,1]</small>

Preliminary rotation of coordinate system before scaling (to allow scaling around arbitrary orientations).

### SFVec3f [in, out] **center** 0 0 0 <small>(-∞,∞)</small>

Translation offset from origin of local coordinate system.

#### Hint

- Usually HAnimJoint position is controlled by the *center* field, not the translation field.

### MFFloat [in, out] **llimit** [ ] <small>(-∞,∞)</small>

Lower limit for minimum joint rotation in radians.

#### Hints

- Always contains 3 values, one for each local axis.
- An empty array is equivalent to 0 0 0.

#### Warning

- Field shall contain three values or else be an empty array. Behavior is undefined when array length is 1, 2, or greater than 3.

### MFFloat [in, out] **ulimit** [ ] <small>(-∞,∞)</small>

Upper limit for maximum joint rotation in radians.

#### Hints

- Always contains 3 values, one for each local axis.
- An empty array is equivalent to 0 0 0.

#### Warning

- Field shall contain three values or else be an empty array. Behavior is undefined when array length is 1, 2, or greater than 3.

### SFRotation [in, out] **limitOrientation** 0 0 1 0 <small>(-∞,∞) or [-1,1]</small>

Orientation of upper/lower rotation limits, relative to HAnimJoint center.

### MFFloat [in, out] **stiffness** [ 0, 0, 0 ] <small>[0,1]</small>

A scale factor of (1 - *stiffness*) is applied around the corresponding axis (X, Y, or Z for entries 0, 1 and 2 of the *stiffness* field). Thus a *stiffness* value of zero means that no rotation scaling occurs, while a *stiffness* value of one means that no rotation occurs regardless of any provided rotation.

#### Hints

- An empty array is equivalent to 0 0 0.
- Used by inverse kinematics (IK) systems.

#### Warning

- Field shall contain three values or else be an empty array. Behavior is undefined when array length is 1, 2, or greater than 3.

### MFInt32 [in, out] **skinCoordIndex** [ ] <small>[0,∞)</small>

Coordinate index values referencing which vertices are influenced by the HAnimJoint.

#### Hint

- Corresponding skinCoord Coordinate and skinNormal Normal nodes are directly contained within the ancestor HAnimHumanoid node for this HAnimJoint.

#### Warnings

- -1 sentinel values are not allowed.
- Index values for HAnimHumanoid skin IndexedFaceSet, skinCoord and skinNormal nodes must all be consistently defined together with HAnimJoint HAnimSegment and HAnimDisplacer nodes for proper skin animation.

### MFFloat [in, out] **skinCoordWeight** [ ]

Weight deformation values for the corresponding values in the skinCoordIndex field.

#### Warning

- Index values for HAnimHumanoid skin IndexedFaceSet, skinCoord and skinNormal nodes must all be consistently defined together with HAnimJoint HAnimSegment and HAnimDisplacer nodes for proper skin animation.

### MFNode [in, out] **displacers** [ ] <small>[HAnimDisplacer]</small>

The *displacers* field stores HAnimDisplacer objects for a particular HAnimJoint object.

#### Warning

- Index values for HAnimHumanoid skin IndexedFaceSet, skinCoord and skinNormal nodes must all be consistently defined together with HAnimJoint HAnimSegment and HAnimDisplacer nodes for proper skin animation.

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

### MFNode [in, out] **children** [ ] <small>[HAnimJoint,HAnimSegment,HAnimSite]</small>

Grouping nodes contain an ordered list of *children* nodes.

#### Hints

- Each grouping node defines a coordinate space for its *children*, relative to the coordinate space of its parent node. Thus transformations accumulate down the scene graph hierarchy.
- Place any geometry for this HAnimJoint in the child HAnimSegment, wrapped within a Transform having the same translation value as the current HAnimJoint center value.
- InputOnly MFNode addChildren field can append new X3DChildNode nodes via a ROUTE connection, duplicate input nodes (i.e. matching DEF, USE values) are ignored.
- InputOnly MFNode removeChildren field can remove nodes from the *children* list, unrecognized input nodes (i.e. nonmatching DEF, USE values) are ignored.
- [X3D Architecture 10.2.1 Grouping and *children* node types](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/grouping.html#GroupingAndChildrenNodes){:target="_blank"}

#### Warning

- HAnimJoint can only contain HAnimJoint or HAnimSegment nodes (each having default `containerField='children').`

## Advisories

### Hints

- HAnimJoint may only get inserted as one (or more) root nodes of HAnimHumanoid skeleton field, as a child of another HAnimJoint node, or as a USE node in the HAnimHumanoid joints field.
- Visualization shapes for HAnimJoint nodes can be placed in child HAnimSegment or HAnimSite nodes.
- [HAnim Specification](https://www.web3d.org/documents/specifications/19774/V2.0){:target="_blank"}
- [HAnim Specification part 1, Joint](https://www.web3d.org/documents/specifications/19774/V2.0/Architecture/ObjectInterfaces.html#Joint){:target="_blank"}
- [X3D for Advanced Modeling (X3D4AM) slideset](https://x3dgraphics.com/slidesets/X3dForAdvancedModeling/HumanoidAnimation.pdf){:target="_blank"}
- [HAnim2 default values for Joint and Site (feature point) nodes](https://www.web3d.org/x3d/content/examples/HumanoidAnimation/HAnim2DefaultValuesJointsFeaturePoints.txt){:target="_blank"}

### Warnings

- HAnimJoint can only contain certain nodes: HAnimJoint, HAnimSegment, HAnimSite (with `containerField='children')` and also HAnimDisplacer nodes (with `containerField='displacers').`
- An HAnimJoint may not be a child of an HAnimSegment.
- Requires X3D `profile='Full'` or else include `<component name='HAnim' level='1'/>`
- For X3D3 HAnim1, spelling of component name is 'H-Anim' (including hyphen).
- For X3D3 HAnim1, spelling of component name is 'H-Anim' (including hyphen).
- The number of contained \<HAnimJoint USE='*' `containerField='joints'/>` nodes at top level of HAnimHumanoid needs to match the number of corresponding HAnimJoint node instances found within the preceding skeleton hierarchy.

## See Also

- [X3D Specification of HAnimJoint node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/hanim.html#HAnimJoint){:target="_blank"}
