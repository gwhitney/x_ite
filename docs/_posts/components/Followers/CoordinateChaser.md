---
title: CoordinateChaser
date: 2023-01-07
nav: components-Followers
categories: [components, Followers]
tags: [CoordinateChaser, Followers]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

CoordinateChaser generates a series of coordinate arrays that progressively change from initial value to destination value.

The CoordinateChaser node belongs to the **Followers** component and its default container field is *children.* It is available from X3D version 3.3 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DFollowerNode
      + X3DChaserNode
        + CoordinateChaser
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFVec3f [in] **set_value** <small>(-∞,∞)</small>

*set_value* resets current *value* of this node.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### MFVec3f [in] **set_destination** <small>(-∞,∞)</small>

*set_destination* resets *destination* value of this node.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a *destination* for ROUTE events.

### MFVec3f [ ] **initialValue** 0 0 0 <small>(-∞,∞)</small>

Initial starting value for this node.

### MFVec3f [ ] **initialDestination** 0 0 0 <small>(-∞,∞)</small>

Initial destination value for this node.

### SFTime [ ] **duration** 1 <small>[0,∞)</small>

*duration* is the time interval for filter response in seconds.

#### Hint

- *duration* is a nonnegative SFTime *duration* interval, not an absolute clock time.

### SFBool [out] **isActive**

*isActive* true/false events are sent when follower-node computation starts/stops.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### MFVec3f [out] **value_changed**

Computed output value that approaches within tolerance of destination value, as determined by elapsed time, order and tau.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hint

- ROUTE value_changed output events to a \<Coordinate\> node's point field, for example.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Followers/CoordinateChaser/CoordinateChaser.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of CoordinateChaser node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/followers.html#CoordinateChaser){:target="_blank"}
