---
title: Contact
date: 2023-01-07
nav: components-RigidBodyPhysics
categories: [components, RigidBodyPhysics]
tags: [Contact, RigidBodyPhysics]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

Contact nodes are produced as output events when two collidable objects or spaces make contact.

The Contact node belongs to the **RigidBodyPhysics** component and its default container field is *contacts.* It is available from X3D version 3.2 or higher.

## Hierarchy

```
+ X3DNode
  + Contact
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFVec3f [in, out] **position** 0 0 0 <small>(-∞,∞)</small>

*position* (x, y, z in meters) of exact location of collision.

### SFVec3f [in, out] **contactNormal** 0 1 0 <small>(-∞,∞)</small>

*contactNormal* is unit vector describing normal between two colliding bodies.

### SFFloat [in, out] **depth** 0 <small>(-∞,∞)</small>

*depth* indicates how deep the current intersection is along normal vector.

### MFString [in, out] **appliedParameters** "BOUNCE"

Default global parameters for collision outputs of rigid body physics system. Contact node can override parent CollisionCollection node. Selectable values for array: "BOUNCE" "USER_FRICTION" "FRICTION_COEFFICIENT_2" "ERROR_REDUCTION" "CONSTANT_FORCE" "SPEED_1" "SPEED_2" "SLIP_1" "SLIP_2".

#### Hint

- BOUNCE: bounce value is used; USER_FRICTION: apply user-supplied value; FRICTION_COEFFICIENT_2: apply frictionCoefficients values; ERROR_REDUCTION: apply softnessErrorCorrection value; CONSTANT_FORCE: apply softnessConstantForceMix value; SPEED_1: apply first component of surfaceSpeed array; SPEED_2: apply second component of surfaceSpeed array; SLIP_1: apply first component of slipFactors array; SLIP_2: apply second component of slipFactors array.

### SFFloat [in, out] **bounce** 0 <small>[0,1]</small>

*bounce* indicates bounciness (0 = no *bounce* at all, 1 = maximum *bounce*).

### SFFloat [in, out] **minBounceSpeed** <small>[0,∞)</small>

*minBounceSpeed* m/s needed to bounce.

### SFVec3f [in, out] **frictionDirection** 0 1 0 <small>(-∞,∞)</small>

*frictionDirection* controls friction vector.

#### Hint

- Value of (0 0 0) indicates no friction.

### SFVec2f [in, out] **frictionCoefficients** 0 0 <small>[0,∞)</small>

*frictionCoefficients* used for computing surface drag.

### SFVec2f [in, out] **surfaceSpeed** 0 0 <small>(-∞,∞)</small>

*surfaceSpeed* defines speed vectors for computing surface drag, if contact surfaces move independently of bodies.

### SFVec2f [in, out] **slipCoefficients** 0 0 <small>(-∞,∞)</small>

*slipCoefficients* used for computing surface drag.

### SFFloat [in, out] **softnessConstantForceMix** 0.0001 <small>[0,1]</small>

*softnessConstantForceMix* value applies a constant force value to make colliding surfaces appear to be somewhat soft.

### SFFloat [in, out] **softnessErrorCorrection** 0.8 <small>[0,1]</small>

*softnessErrorCorrection* indicates fraction of collision error fixed in a set of evaluations (0 = no error correction, 1 = all errors corrected in single step).

### SFNode [in, out] **geometry1** NULL <small>[X3DNBodyCollidableNode]</small>

The *geometry1* and geometry2 fields specify collision-related information about body1 and body2.

### SFNode [in, out] **geometry2** NULL <small>[X3DNBodyCollidableNode]</small>

The geometry1 and *geometry2* fields specify collision-related information about body1 and body2.

### SFNode [in, out] **body1** NULL <small>[RigidBody]</small>

The *body1* and body2 fields specify two top-level nodes that should be evaluated in the physics model as a single set of interactions with respect to each other.

### SFNode [in, out] **body2** NULL <small>[RigidBody]</small>

The body1 and *body2* fields specify two top-level nodes that should be evaluated in the physics model as a single set of interactions with respect to each other.

## Advisories

### Hint

- Each Contact node contains two RigidBody nodes (`containerField='body1'` and `containerField='body2')` as well as two CollidableShape or CollidableOffset nodes (`containerField='geometry1'` and `containerField='geometry2').`

### Warning

- Contact nodes are transient and can only occur at run time. It is an error to define this transient node in an X3D file.

## See Also

- [X3D Specification of Contact node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/rigidBodyPhysics.html#Contact){:target="_blank"}
