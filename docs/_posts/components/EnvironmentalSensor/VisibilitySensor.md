---
title: VisibilitySensor
date: 2023-01-07
nav: components-EnvironmentalSensor
categories: [components, EnvironmentalSensor]
tags: [VisibilitySensor, EnvironmentalSensor]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

VisibilitySensor detects when user can see a specific object or region as they navigate the world. The region sensed for visibility to the user is bounded by a rectangular box.

The VisibilitySensor node belongs to the **EnvironmentalSensor** component and its default container field is *children.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DSensorNode
      + X3DEnvironmentalSensorNode
        + VisibilitySensor
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFVec3f [in, out] **size** 0 0 0 <small>[0,∞)</small>

*size* of visibility box, measured from center in meters.

### SFVec3f [in, out] **center** 0 0 0 <small>(-∞,∞)</small>

Translation offset from origin of local coordinate system.

### SFTime [out] **enterTime**

Time event generated when user's camera enters visibility region for sensor.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFTime [out] **exitTime**

Time event generated when user's camera exits visibility region for sensor.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isActive**

*isActive* true/false events are sent when triggering the sensor. *isActive*=true when entering visibility region, *isActive*=false when exiting visibility region.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hints

- Often used to attract user attention or improve performance.
- This sensor detects user interactions affecting peer nodes and their child geometry.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/EnvironmentalSensor/VisibilitySensor/VisibilitySensor.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of VisibilitySensor node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/environmentalSensor.html#VisibilitySensor){:target="_blank"}
