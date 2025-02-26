---
title: FogCoordinate
date: 2023-01-07
nav: components-EnvironmentalEffects
categories: [components, EnvironmentalEffects]
tags: [FogCoordinate, EnvironmentalEffects]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

FogCoordinate defines a set of explicit fog depths on a per-vertex basis, overriding Fog visibilityRange.

The FogCoordinate node belongs to the **EnvironmentalEffects** component and its default container field is *fogCoord.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DGeometricPropertyNode
    + FogCoordinate
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### MFFloat [in, out] **depth** [ ] <small>[0,1]</small>

*depth* contains a set of 3D coordinate (triplet) point values.

## See Also

- [X3D Specification of FogCoordinate node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/environmentalEffects.html#FogCoordinate){:target="_blank"}
