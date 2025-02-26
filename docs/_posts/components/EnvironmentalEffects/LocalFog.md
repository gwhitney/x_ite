---
title: LocalFog
date: 2023-01-07
nav: components-EnvironmentalEffects
categories: [components, EnvironmentalEffects]
tags: [LocalFog, EnvironmentalEffects]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

LocalFog simulates atmospheric effects by blending distant objects with fog color. LocalFog effects occur around the local transformation center, rather than bound to the viewer. The nearest LocalFog node within range takes precedence over other LocalFog and Fog nodes.

The LocalFog node belongs to the **EnvironmentalEffects** component and its default container field is *children.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + LocalFog (X3DFogObject)*
```

<small>\* Derived from multiple interfaces.</small>

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **enabled** TRUE

Enables/disables node operation.

### SFString [in, out] **fogType** "LINEAR" <small>["LINEAR"|"EXPONENTIAL"]</small>

Specifies algorithm for rate of increasing Fog, either LINEAR or EXPONENTIAL.

#### Hint

- EXPONENTIAL is more natural but also more computationally expensive.

#### Warning

- Do not wrap extra quotation marks around these SFString enumeration values, since "quotation" "marks" are only used for MFString values.

### SFColor [in, out] **color** 1 1 1 <small>[0,1]</small>

Fog *color*.

#### Hints

- Match Background *color* to make objects fade away.
- [X3D Scene Authoring Hints, Color](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#Color){:target="_blank"}

### SFFloat [in, out] **visibilityRange** 0 <small>[0,-∞)</small>

Distance in meters where objects are totally obscured by the fog, using local coordinate system.

#### Hint

- *visibilityRange* 0 disables Fog.

## Advisories

### Hints

- LocalFog effects are based on its position in the world, as given by current transformation hierarchy.
- LocalFog effects remain independent of current view location.

### Warnings

- LocalFog only affects geometry within the same scene subgraph.
- LocalFog is not a bindable node.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/EnvironmentalEffects/LocalFog/LocalFog.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of LocalFog node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/environmentalEffects.html#LocalFog){:target="_blank"}
