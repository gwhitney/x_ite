---
title: ScalarDamper
date: 2023-01-07
nav: components-Followers
categories: [components, Followers]
tags: [ScalarDamper, Followers]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

ScalarDamper generates a series of floating-point values that progressively change from initial value to destination value.

The ScalarDamper node belongs to the **Followers** component and its default container field is *children.* It is available from X3D version 3.3 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DFollowerNode
      + X3DDamperNode
        + ScalarDamper
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFFloat [in] **set_value** <small>(-∞,∞)</small>

*set_value* resets current *value* of this node.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### SFFloat [in] **set_destination** <small>(-∞,∞)</small>

*set_destination* resets *destination* value of this node.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a *destination* for ROUTE events.

### SFFloat [ ] **initialValue** 0 <small>(-∞,∞)</small>

Initial starting value for this node.

### SFFloat [ ] **initialDestination** 0 <small>(-∞,∞)</small>

Initial destination value for this node.

### SFInt32 [ ] **order** 3 <small>[0..5]</small>

*order* defines the number of internal filters (larger means smoother response, longer delay).

### SFTime [in, out] **tau** 0.3 <small>[0,∞)</small>

*tau* is the exponential-decay time constant for filter response in seconds.

### SFFloat [in, out] **tolerance** -1 <small>-1 or [0,∞)</small>

Absolute value for satisfactory completion proximity (-1 lets browser choose).

### SFBool [out] **isActive**

*isActive* true/false events are sent when follower-node computation starts/stops.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFFloat [out] **value_changed**

Computed output value that approaches within tolerance of destination value, as determined by elapsed time, order and tau.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hint

- ROUTE value_changed output events to an interpolator node's set_fraction field, for example.

## See Also

- [X3D Specification of ScalarDamper node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/followers.html#ScalarDamper){:target="_blank"}
