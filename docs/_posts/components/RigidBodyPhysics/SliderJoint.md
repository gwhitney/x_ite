---
title: SliderJoint
date: 2023-01-07
nav: components-RigidBodyPhysics
categories: [components, RigidBodyPhysics]
tags: [SliderJoint, RigidBodyPhysics]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

SliderJoint constrains all movement between body1 and body2 along a single axis. Contains two RigidBody nodes (containerField values body1, body2).

The SliderJoint node belongs to the **RigidBodyPhysics** component and its default container field is *joints.* It is available from X3D version 3.2 or higher.

## Hierarchy

```
+ X3DNode
  + X3DRigidJointNode
    + SliderJoint
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFString [in, out] **forceOutput** "NONE" <small>["ALL", "NONE", ...]</small>

*forceOutput* controls which output fields are generated for the next frame. Values are ALL, NONE, or exact names of output fields updated at start of next frame.

### SFVec3f [in, out] **axis** 0 1 0 <small>(-∞,∞)</small>

*axis* is normalized vector specifying direction of motion.

### SFFloat [in, out] **minSeparation** 0 <small>[0,∞)</small>

*minSeparation* is minimum separation distance between the two bodies.

#### Hint

- If (*minSeparation* is less than maxSeparation) then no stop is effective.

### SFFloat [in, out] **maxSeparation** 1 <small>[0,∞)</small>

*maxSeparation* is maximum separation distance between the two bodies.

#### Hint

- If (minSeparation is less than *maxSeparation*) then no stop is effective.

### SFFloat [in, out] **sliderForce** 0 <small>[-∞,∞)</small> <small class="red">not supported</small>

*sliderForce* value is used to apply a force (specified in force base units) along the axis of the slider in equal and opposite directions to the two bodies. A positive value applies a force such that the two bodies accelerate away from each other, while a negative value applies a force such that the two bodies accelerate toward each other.

### SFFloat [in, out] **stopBounce** 0 <small>[0,1]</small> <small class="red">not supported</small>

*stopBounce* is velocity factor for bounce back once stop point is reached.

#### Hint

- 0 means no bounce, 1 means return velocity matches.

### SFFloat [in, out] **stopErrorCorrection** 1 <small>[0,1]</small> <small class="red">not supported</small>

*stopErrorCorrection* is fraction of error correction performed during time step once stop point is reached.

#### Hint

- 0 means no error correction, 1 means all error corrected in single step.

### SFFloat [out] **separation** <small class="red">not supported</small>

*separation* indicates final *separation* distance between the two bodies.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFFloat [out] **separationRate** <small class="red">not supported</small>

*separationRate* indicates change in separation distance over time between the two bodies.

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

<x3d-canvas src="https://create3000.github.io/media/examples/RigidBodyPhysics/SliderJoint/SliderJoint.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of SliderJoint node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/rigidBodyPhysics.html#SliderJoint){:target="_blank"}
