---
title: StreamAudioSource
date: 2023-01-31
nav: components-Sound
categories: [components, Sound]
tags: [StreamAudioSource, Sound]
---
<style>
.post h3 {
   word-spacing: 0.2em;
}
</style>

## Overview

StreamAudioSource operates as an audio source whose media is received from a MediaStream obtained using the WebRTC or Media Capture and Streams APIs. This media source might originate from a remote microphone or sound-processing channed provided by a remote peer on a WebRTC call.\.

The StreamAudioSource node belongs to the **Sound** component and its default container field is *children.* It is available from X3D version 4.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DTimeDependentNode
      + X3DSoundSourceNode
        + StreamAudioSource
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of the url asset.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFFloat [in, out] **gain** 1 <small>(-∞,∞)</small>

The *gain* field is a factor that represents the amount of linear amplification to apply to the output of the node.

#### Hint

- Negative *gain* factors negate the input signal.

#### Warning

- Decibel values shall not be used.

### MFString [in, out] **streamIdentifier** [ ]

Stream identification TBD

#### Hint

- [W3C Media Capture and Streams](https://www.w3.org/TR/mediacapture-streams){:target="_blank"}

### SFTime [in, out] **startTime** 0 <small>(-∞,∞)</small>

Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

### SFTime [in, out] **resumeTime** 0 <small>(-∞,∞)</small>

When *resumeTime* becomes \<= time now, isPaused becomes false and AudioClip becomes active. Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

### SFTime [in, out] **pauseTime** 0 <small>(-∞,∞)</small>

When time now \>= *pauseTime*, isPaused becomes true and AudioClip becomes paused. Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

### SFTime [in, out] **stopTime** 0 <small>(-∞,∞)</small>

Absolute time: number of seconds since January 1, 1970, 00:00:00 GMT.

#### Hint

- ROUTE a time value matching system clock to this field, such as output event from TouchSensor touchTime or TimeTrigger triggerTime.

#### Warnings

- An active TimeSensor node ignores set_cycleInterval and set_startTime events.
- An active TimeSensor node ignores set_stopTime event values less than or equal to startTime.

### SFBool [out] **isPaused**

*isPaused* true/false events are sent when AudioClip is paused/resumed.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isActive**

*isActive* true/false events are sent when playback starts/stops.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFTime [out] **elapsedTime**

Current elapsed time since AudioClip activated/running, cumulative in seconds, and not counting any paused time.

#### Hint

- *elapsedTime* is a nonnegative SFTime duration interval, not an absolute clock time.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#mediastreamaudiosourcenode){:target="_blank"}

## See Also

- [X3D Specification of StreamAudioSource node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/sound.html#StreamAudioSource){:target="_blank"}
