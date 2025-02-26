---
title: DirectionalLight
date: 2023-01-07
nav: components-Lighting
categories: [components, Lighting]
tags: [DirectionalLight, Lighting]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

DirectionalLight defines parallel light rays that illuminate geometric shapes. Lighting illuminates all geometry except lines and points. By default, light scope only illuminates peer geometry and children nodes within the scene graph hierarchy. No source location is needed since rays are parallel from an infinitely distant source. DirectionalLight nodes do not attenuate with distance. Lights have no visible shape themselves and lighting effects continue through any intermediate geometry.

The DirectionalLight node belongs to the **Lighting** component and its default container field is *children.* It is available since VRML 2.0 and from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DLightNode
      + DirectionalLight
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in, out] **global** FALSE

Global lights illuminate all objects within their volume of lighting influence. Scoped lights only illuminate objects within the same transformation hierarchy.

#### Warning

- DirectionalLight default *global*=false to limit scope and avoid inadvertently illuminating every object in a large scene. PointLight and SpotLight default *global*=true since their effects are each limited by maximum radius value.

### SFBool [in, out] **on** TRUE

Enables/disables this light source.

### SFColor [in, out] **color** 1 1 1 <small>[0,1]</small>

*color* of light, applied to colors of objects.

#### Hint

- [X3D Scene Authoring Hints, Color](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#Color){:target="_blank"}

### SFFloat [in, out] **intensity** 1 <small>[0,∞)</small>

Brightness of direct emission from the light.

### SFFloat [in, out] **ambientIntensity** 0 <small>[0,1]</small>

Brightness of ambient (nondirectional background) emission from the light. Interchange profile hint: this field may be ignored, applying the default value regardless.

### SFVec3f [in, out] **direction** 0 0 -1 <small>(-∞,∞)</small>

Orientation vector of light relative to local coordinate system.

#### Hint

- Animate *direction* to simulate time-of-day sunlight effects.

### SFBool [in, out] **shadows** FALSE

*shadows* field indicates whether or not this light casts a shadow behind illuminated X3DShapeNode geometry.

### SFColor [in, out] **shadowColor** 0 0 0 <small>[0,1]</small> <small class="yellow">non standard</small>

Color of shadow, applied to colors of objects.

### SFFloat [in, out] **shadowIntensity** 1 <small>[0,1]</small>

*shadowIntensity* field defines how much light is obscured by shapes that cast shadows, ranging from 0 (light not obscured, no visible shadows) to 1 (light completely obscured, full-intensity shadows).

### SFFloat [in, out] **shadowBias** 0.005 <small>[0,1]</small> <small class="yellow">non standard</small>

The shadowBias value controls the visibility of *shadow acne*.

### SFInt32 [ ] **shadowMapSize** 1024 <small>[0,∞)</small> <small class="yellow">non standard</small>

Size of the shadow map in pixels, must be power of two.

## Advisories

### Hints

- Animate direction to simulate time-of-day sunlight effects.
- The bound NavigationInfo controls whether headlight is enabled on/off. Interchange profile hint: light might not be scoped by parent Group or Transform.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Lighting/DirectionalLight/DirectionalLight.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of DirectionalLight node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/lighting.html#DirectionalLight){:target="_blank"}
