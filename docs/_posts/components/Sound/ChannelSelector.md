---
title: ChannelSelector
date: 2023-01-31
nav: components-Sound
categories: [components, Sound]
tags: [ChannelSelector, Sound]
---
<style>
.post h3 {
   word-spacing: 0.2em;
}
</style>

## Overview

ChannelSelector selects a single channel output from all input channels.

The ChannelSelector node belongs to the **Sound** component and its default container field is *children.* It is available from X3D version 4.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DSoundNode
      + X3DSoundChannelNode
        + ChannelSelector
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

### SFInt32 [in, out] **channelSelection** 0 <small>[0,∞)</small>

*channelSelection* is single channel of interest from those provided by input nodes.

### SFInt32 [out] **channelCount**

*channelCount* reports number of channels provided by input nodes.

#### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#dom-audionode-channelcount){:target="_blank"}

### SFString [in, out] **channelCountMode** "MAX" <small>["MAX", "CLAMPED-MAX", "EXPLICIT"]</small>

*channelCountMode* determines how individual channels are counted when up-mixing and down-mixing connections to any inputs.

#### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#dom-audionode-channelcountmode){:target="_blank"}

### SFString [in, out] **channelInterpretation** "SPEAKERS" <small>["SPEAKERS", "DISCRETE"]</small>

*channelInterpretation* determines how individual channels are treated when up-mixing and down-mixing connections to any inputs.

#### Hint

- [W3C Web Audio API](https://www.w3.org/TR/webaudio/#dom-audionode-channelinterpretation){:target="_blank"}

### MFNode [in, out] **children** [ ] <small>[X3DSoundChannelNode,X3DSoundProcessingNode,X3DSoundSourceNode]</small>

The *children* field specifies audio-graph sound sources providing input signals for this node. If multiple input signals are provided by the inputs *children* field, all channels are mixed together and merged prior to presentation.

#### Hint

- Can be original (DEF) or referenced (USE) nodes.

#### Warning

- Contained AudioClip or MovieTexture nodes must have `containerField='children'` to override otherwise-incorrect defaults.

## Advisories

### Hint

- ChannelSelector is a utility node to complement ChannelSplitter.

## See Also

- [X3D Specification of ChannelSelector node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/sound.html#ChannelSelector){:target="_blank"}
