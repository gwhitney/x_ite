---
title: TouchSensor
date: 2023-01-07
nav: components-PointingDeviceSensor
categories: [components, PointingDeviceSensor]
tags: [TouchSensor, PointingDeviceSensor]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

TouchSensor tracks location and state of the pointing device, detecting when a user points at or selects (activates) geometry.

The TouchSensor node belongs to the **PointingDeviceSensor** component and its default container field is *children.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DSensorNode
      + X3DPointingDeviceSensorNode
        + X3DTouchSensorNode
          + TouchSensor
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of this node.

#### Hints

- Include space characters since a *description* is not a DEF identifier. Write short phrases that make descriptions clear and readable.
- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFVec2f [out] **hitTexCoord_changed**

When pointing device selects geometry, send event containing texture coordinates of surface at the hitPoint.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFVec3f [out] **hitNormal_changed**

When pointing device selects geometry, send event containing surface normal vector at the hitPoint.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFVec3f [out] **hitPoint_changed**

When pointing device selects geometry, send event containing 3D point on surface of underlying geometry, as measured in reference frame for TouchSensor's local coordinate system.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isOver**

Hover over geometry by aiming the mouse (or pointing device) to generate *isOver* events. Sensor sends output event *isOver*=true event when pointing device moves over sensor's geometry, and later sends output event *isOver*=false event when pointing device moves off.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isActive**

Select geometry by activating the pointing device (for example, clicking the mouse) to generate *isActive* events. Output event *isActive*=true is sent when pointing device selection is activated, output event *isActive*=false is sent when pointing device is deselected.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFTime [out] **touchTime**

Time event generated when sensor is touched by pointing device, and then deselected by the user.

#### Hint

- *touchTime* event is generated when following three conditions are all met: (a) pointing device was pointing towards geometry when initially activated (isActive=true), (b) pointing device is currently pointing towards the geometry (isOver=true), and (c) pointing device selection is deactivated/deselected by user (isActive=false event is also generated).

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hints

- This sensor detects user interactions affecting peer nodes and their child geometry.
- [X3D Architecture 20.2.1 Overview of pointing device sensors](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/pointingDeviceSensor.html#OverviewOfPointingDeviceSensors){:target="_blank"}
- [X3D Architecture 20.2.3 Activating and manipulating pointing device sensors](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/pointingDeviceSensor.html#Activatingandmanipulating){:target="_blank"}
- [Example scenes and authoring assets](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter08UserInteractivity){:target="_blank"}

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/PointingDeviceSensor/TouchSensor/TouchSensor.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of TouchSensor node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/pointingDeviceSensor.html#TouchSensor){:target="_blank"}
