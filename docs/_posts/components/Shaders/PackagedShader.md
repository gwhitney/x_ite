---
title: PackagedShader
date: 2023-01-07
nav: components-Shaders
categories: [components, Shaders]
tags: [PackagedShader, Shaders]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

PackagedShader contains a url for a single file that may contain a number of shaders and combined effects.

The PackagedShader node belongs to the **Shaders** component and its default container field is *shaders.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DAppearanceChildNode
    + X3DShaderNode
      + PackagedShader (X3DUrlObject, X3DProgrammableShaderObject)*
```

<small>\* Derived from multiple interfaces.</small>

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **description** ""

Author-provided prose that describes intended purpose of the url asset.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute value (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

### SFBool [in] **activate**

*activate* forces the shader to *activate* the contained objects.

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### SFBool [out] **isSelected**

*isSelected* indicates this shader instance is selected for use by browser

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFBool [out] **isValid**

*isValid* indicates whether current shader objects can be run as a shader program.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

### SFString [ ] **language** "" <small>["Cg"|"GLSL"|"HLSL"|...]</small>

The *language* field indicates to the X3D player which shading *language* is used. The *language* field may be used to optionally determine the *language* type if no MIME-type information is available.

#### Hint

- Recognized values include "Cg" "GLSL" "HLSL".

### SFBool [in, out] **load** TRUE

*load*=true means *load* immediately, *load*=false means defer loading or else unload a previously loaded scene.

#### Hints

- Allows author to design when Inline loading occurs via user interaction, event chains or scripting.
- Use a separate LoadSensor node to detect when loading is complete.

### MFString [in, out] **url** [ ] <small>[URI]</small>

*url* points to a shader source-code file that may contain a number of shaders and combined effects.

#### Hint

- [X3D Scene Authoring Hints, urls](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#urls){:target="_blank"}

### SFTime [in, out] **autoRefresh** 0 <small>[0,∞)</small>

*autoRefresh* defines interval in seconds before automatic reload of current url asset is performed.

#### Hints

- If preceding file loading fails or load field is false, no refresh is performed.
- Repeated refresh attempts to reload currently loaded entry of url list. If that fails, the browser retries other entries in the url list.

#### Warning

- Automatically reloading content has security considerations and needs to be considered carefully.

### SFTime [in, out] **autoRefreshTimeLimit** 3600 <small>[0,∞)</small>

*autoRefreshTimeLimit* defines maximum duration that automatic refresh activity can occur.

#### Hint

- Automatic refresh is different than query and response timeouts performed by a networking library while sequentially attempting to retrieve addressed content from a url list.

#### Warning

- Automatically reloading content has security considerations and needs to be considered carefully.

## Advisories

### Hints

- PackagedShader contains field declarations and then corresponding IS/connect statements (if any).
- Apply default `containerField='shaders'` when parent node is Appearance.
- [When parent node is LoadSensor, apply `containerField='children'` (X3Dv4) or `containerField='watchList'` (X3Dv3).](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#fieldNameChanges){:target="_blank"}

### Warning

- PackagedShader does not contain CDATA section of plain-text source code.

## See Also

- [X3D Specification of PackagedShader node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/shaders.html#PackagedShader){:target="_blank"}
