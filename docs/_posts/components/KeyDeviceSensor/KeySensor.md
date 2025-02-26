---
title: KeySensor
date: 2023-01-07
nav: components-KeyDeviceSensor
categories: [components, KeyDeviceSensor]
tags: [KeySensor, KeyDeviceSensor]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

KeySensor generates events as the user presses keys on the keyboard. Browser support includes the notion of "keyboard focus".

The KeySensor node belongs to the **KeyDeviceSensor** component and its default container field is *children.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DSensorNode
      + X3DKeyDeviceSensorNode
        + KeySensor
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFBool [out] **controlKey**

*controlKey* generates true event when pressed, false event when released.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **shiftKey**

*shiftKey* generates true event when pressed, false event when released.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **altKey**

*altKey* generates true event when pressed, false event when released.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFInt32 [out] **actionKeyPress**

Action key press gives following values: HOME=000 END=1001 PGUP=1002 PGDN=1003 UP=1004 DOWN=1005 LEFT=1006 RIGHT=1007 F1..F12 = 1008..1019.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFInt32 [out] **actionKeyRelease**

Action key release gives following values: HOME=000 END=1001 PGUP=1002 PGDN=1003 UP=1004 DOWN=1005 LEFT=1006 RIGHT=1007 F1..F12 = 1008..1019.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFString [out] **keyPress**

Events generated when user presses character-producing keys on keyboard produces integer UTF-8 character values.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFString [out] **keyRelease**

Events generated when user releases character-producing keys on keyboard produces integer UTF-8 character values.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isActive**

Select geometry by activating the pointing device (for example, clicking the mouse) to generate *isActive* events. Output event *isActive*=true is sent when geometry is selected (for example, when primary mouse button is pressed), output event *isActive*=false is sent when geometry is deselected (for example, when primary mouse button is released).

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hint

- [Example scenes and authoring assets](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter08UserInteractivity){:target="_blank"}

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/KeyDeviceSensor/KeySensor/KeySensor.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of KeySensor node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/keyboard.html#KeySensor){:target="_blank"}
