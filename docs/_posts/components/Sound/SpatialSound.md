---
title: SpatialSound
date: 2023-01-31
nav: components-Sound
categories: [components, Sound]
tags: [SpatialSound, Sound]
---
<style>
.post h3 {
   word-spacing: 0.2em;
}
</style>

## Overview

The SpatialSound node controls the 3D spatialization of sound playback by a child AudioClip or MovieTexture node. Sound intensity includes stereo support, varying according to user location and view direction in the scene.

The SpatialSound node belongs to the **Sound** component and its default container field is *children.* It is available from X3D version 4.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DSoundNode
      + SpatialSound
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

### SFBool [ ] **spatialize** TRUE

Whether to *spatialize* sound playback relative to viewer.

#### Hint

- Only effective within the auralization volume.

### SFFloat [in, out] **coneInnerAngle** 6.2832 <small>[0,2π]</small>

*coneInnerAngle* is centered along direction and defines the inner conical volume, inside of which no source gain reduction occurs.

#### Hints

- ConeOuterAngle value is greater than or equal to *coneInnerAngle*.
- [X3D4 Architecture Figure 16.3, SpatialSound Panning Gain Relationships](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/sound.html#f-AudioPannerListenerRelationships){:target="_blank"}

### SFFloat [in, out] **coneOuterAngle** 6.2832 <small>[0,2π]</small>

*coneOuterAngle* is centered along direction and defines an outer conical volume, within which the sound gain decreases linearly from full gain to coneOuterGain. Outside of *coneOuterAngle*, gain equals coneOuterGain.

#### Hints

- *coneOuterAngle* value is greater than or equal to coneInnerAngle.
- [X3D4 Architecture Figure 16.3, SpatialSound Panning Gain Relationships](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/sound.html#f-AudioPannerListenerRelationships){:target="_blank"}

### SFFloat [in, out] **coneOuterGain** 0 <small>(-∞,∞)</small>

*coneOuterGain* is minimum gain value found outside coneOuterAngle.

### SFVec3f [in, out] **direction** 0 0 1 <small>(-∞,∞)</small>

*direction* of sound axis, relative to local coordinate system.

### SFString [in, out] **distanceModel** "INVERSE" <small>["LINEAR" "INVERSE" "EXPONENTIAL"]</small>

*distanceModel* determines how field specifies which algorithm to use for sound attenuation, corresponding to distance between an audio source and a listener, as it moves away from the listener.

#### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#enumdef-distancemodeltype){:target="_blank"}

### SFBool [in, out] **dopplerEnabled** FALSE

*dopplerEnabled* enables/disables whether real-time Doppler effects (due to relation motion between sources and listeners) are computed by browser between virtual sound sources and active listening locations, then applied to received frequency at active listening locations.

#### Hints

- Functional support requires player support for Sound component level 3.
- [Wikipedia Doppler effect](https://en.wikipedia.org/wiki/Doppler_effect){:target="_blank"}

### SFBool [in, out] **enableHRTF** FALSE

*enableHRTF* enables/disables Head Related Transfer Function (HRTF) auralization, if available. SpatialSound enabledHRTF=true corresponds to panningModelType HRTF, enabledHRTF=false corresponds to panningModelType equalpower.

#### Hints

- [W3C Audio API](https://www.w3.org/TR/webaudio/#enumdef-panningmodeltype){:target="_blank"}
- [Wikipedia HRTF](https://en.wikipedia.org/wiki/3D_sound_localization#Head-related_Transfer_Function_(HRTF)){:target="_blank"}

### SFFloat [in, out] **gain** 1 <small>(-∞,∞)</small>

The *gain* field is a factor that represents the amount of linear amplification to apply to the output of the node.

#### Hint

- Negative *gain* factors negate the input signal.

#### Warning

- Decibel values shall not be used.

### SFFloat [in, out] **intensity** 1 <small>[0,1]</small>

Factor [0,1] adjusting loudness (decibels) of emitted sound.

### SFVec3f [in, out] **location** 0 0 0 <small>(-∞,∞)</small>

Position of sound ellipsoid center, relative to local coordinate system.

#### Hint

- Improve audibility by setting *location*='0 1.6 0' so that center height of sound ellipsoid matches typical NavigationInfo avatarSize height.

### SFFloat [in, out] **maxDistance** 10000 <small>[0,∞)</small>

*maxDistance* is the maximum distance where sound is renderable between source and listener, after which no reduction in sound volume occurs.

### SFFloat [in, out] **priority** 0 <small>[0,1]</small>

Player hint [0,1] if needed to choose which sounds to play.

### SFFloat [in, out] **referenceDistance** 1 <small>[0,∞)</small>

*referenceDistance* for reducing volume as source moves further from the listener. For distances less than this value, volume is not reduced.

#### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#dom-pannernode-refdistance){:target="_blank"}

### SFFloat [in, out] **rolloffFactor** 1 <small>[0,∞)</small>

*rolloffFactor* indicates how quickly volume is reduced as source moves further from listener.

#### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#dom-pannernode-rollofffactor){:target="_blank"}

### MFNode [in, out] **children** [ ] <small>[X3DSoundChannelNode,X3DSoundProcessingNode,X3DSoundSourceNode]</small>

The *children* field specifies audio-graph sound sources providing input signals for this node. If multiple input signals are provided by the inputs *children* field, all channels are mixed together and merged prior to presentation.

#### Hint

- Can be original (DEF) or referenced (USE) nodes.

#### Warning

- Contained AudioClip or MovieTexture nodes must have `containerField='children'` to override otherwise-incorrect defaults.

## Advisories

### Hints

- If the audio source is stereo or multi-channel, channel separation is retained during playback.
- [X3D Sound component Figure 16.2 Sound Node Geometry](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/sound.html#f-Soundnodegeometry){:target="_blank"}
- [W3C Web Audio API, PannerNode Interface](https://www.w3.org/TR/webaudio/#pannernode){:target="_blank"}
- [X3D Scene Authoring Hints:Audio](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#Audio){:target="_blank"}
- [Wikipedia 3D sound localization](https://en.wikipedia.org/wiki/3D_sound_localization){:target="_blank"}

### Warning

- While providing sounds on the ground plane, ensure that the audible auralization volume is sufficiently elevated to match avatar height.

## See Also

- [X3D Specification of SpatialSound node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/sound.html#SpatialSound){:target="_blank"}
