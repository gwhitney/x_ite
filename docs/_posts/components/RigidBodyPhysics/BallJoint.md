---
title: BallJoint
date: 2023-01-07
nav: components-RigidBodyPhysics
categories: [components, RigidBodyPhysics]
tags: [BallJoint, RigidBodyPhysics]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

BallJoint represents an unconstrained joint between two bodies that pivot about a common anchor point. Contains two RigidBody nodes (containerField values body1, body2).

The BallJoint node belongs to the **RigidBodyPhysics** component and its default container field is *joints.* It is available from X3D version 3.2 or higher.

## Hierarchy

```
+ X3DNode
  + X3DRigidJointNode
    + BallJoint
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFString [in, out] **forceOutput** "NONE" <small>["ALL", "NONE", ...]</small>

*forceOutput* controls which output fields are generated for the next frame. Values are ALL, NONE, or exact names of output fields updated at start of next frame.

### SFVec3f [in, out] **anchorPoint** 0 0 0 <small>(-∞,∞)</small>

*anchorPoint* is joint center, specified in world coordinates.

### SFVec3f [out] **body1AnchorPoint**

*body1AnchorPoint* describes anchorPoint position relative to local coordinate reference frame.

#### Hint

- Can detect separation if *body1AnchorPoint*!=body2AnchorPoint.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFVec3f [out] **body2AnchorPoint**

*body2AnchorPoint* describes anchorPoint position relative to local coordinate reference frame.

#### Hint

- Can detect separation if body1AnchorPoint!=*body2AnchorPoint*.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFNode [in, out] **body1** NULL <small>[RigidBody]</small>

The *body1* and body2 fields indicate the two RigidBody nodes connected by this joint.

### SFNode [in, out] **body2** NULL <small>[RigidBody]</small>

The body1 and *body2* fields indicate the two RigidBody nodes connected by this joint.

## Advisories

### Hint

- RigidBodyPhysics component, level 2.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/RigidBodyPhysics/BallJoint/BallJoint.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of BallJoint node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/rigidBodyPhysics.html#BallJoint){:target="_blank"}
