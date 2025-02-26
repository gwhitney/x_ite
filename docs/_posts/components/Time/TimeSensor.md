---
title: TimeSensor
date: 2023-01-07
nav: components-Time
categories: [components, Time]
tags: [TimeSensor, Time]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

TimeSensor continuously generates events as time passes. Typical use: ROUTE thisTimeSensorDEF.fraction_changed TO someInterpolatorDEF.set_fraction. Interchange profile hint: TimeSensor may be ignored if cycleInterval \< 0.01 second.

The TimeSensor node belongs to the **Time** component and its default container field is *children.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DTimeDependentNode
      + TimeSensor (X3DSensorNode)*
```

<small>\* Derived from multiple interfaces.</small>

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of this node.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFTime [in, out] **cycleInterval** 1 <small>(0,∞)</small>

*cycleInterval* is loop duration in seconds. Interchange profile hint: TimeSensor may be ignored if *cycleInterval* \< 0.01 second.

#### Hint

- *cycleInterval* is a nonnegative SFTime duration interval, not an absolute clock time.

#### Warning

- An active TimeSensor node ignores set_cycleInterval and set_startTime events.

### SFBool [in, out] **loop** FALSE

Repeat indefinitely when *loop*=true, repeat only once when *loop*=false.

### SFTime [in, out] **startTime** 0 <small>(-∞,∞)</small>

When time now \>= *startTime*, isActive becomes true and TimeSensor becomes active. Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

### SFTime [in, out] **resumeTime** 0 <small>(-∞,∞)</small>

When *resumeTime* becomes \<= time now, isPaused becomes false and TimeSensor becomes inactive. Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

#### Warning

- Not supported in VRML97.

### SFTime [in, out] **pauseTime** 0 <small>(-∞,∞)</small>

When time now \>= *pauseTime*, isPaused becomes true and TimeSensor becomes paused. Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

#### Warning

- Not supported in VRML97.

### SFTime [in, out] **stopTime** 0 <small>(-∞,∞)</small>

When *stopTime* becomes \<= time now, isActive becomes false and TimeSensor becomes inactive. Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

#### Warnings

- An active TimeSensor node ignores set_cycleInterval and set_startTime events.
- An active TimeSensor node ignores set_stopTime event values less than or equal to startTime.

### SFBool [out] **isPaused**

*isPaused* true/false events are sent when TimeSensor is paused/resumed.

#### Warnings

- Not supported in VRML97.
- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isActive**

*isActive* true/false events are sent when TimeSensor starts/stops running.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFTime [out] **cycleTime**

*cycleTime* sends a time outputOnly at startTime, and also at the beginning of each new cycle (useful for synchronization with other time-based objects).

#### Hints

- The first *cycleTime* event for a TimeSensor node can be used as an alarm (single pulse at a specified time).
- *cycleTime* is a nonnegative SFTime duration interval, not an absolute clock time.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFTime [out] **elapsedTime**

Current elapsed time since TimeSensor activated/running, cumulative in seconds, and not counting any paused time.

#### Hint

- *elapsedTime* is a nonnegative SFTime duration interval, not an absolute clock time.

#### Warnings

- Not supported in VRML97.
- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFFloat [out] **fraction_changed**

*fraction_changed* continuously sends value in range [0,1] showing time progress in the current cycle.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFTime [out] **time**

Time continuously sends the absolute *time* (value 0.0 matches 1 January 1970) in seconds for a given simulation tick.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hints

- [Event timing details are explained in X3D Specification 4.4.8.3 Execution model](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/concepts.html#ExecutionModel){:target="_blank"}
- [X3D Architecture 8 Time component](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/time.html){:target="_blank"}
- [Example scenes and authoring assets](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter07EventAnimationInterpolation){:target="_blank"}

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Time/TimeSensor/TimeSensor.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of TimeSensor node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/time.html#TimeSensor){:target="_blank"}
