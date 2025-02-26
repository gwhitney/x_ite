---
title: ShaderPart
date: 2023-01-07
nav: components-Shaders
categories: [components, Shaders]
tags: [ShaderPart, Shaders]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

ShaderPart defines the source for a portion of source code used by a ComposedShader node. The source is not required to be a complete shader for all of the vertex/fragment processing.

The ShaderPart node belongs to the **Shaders** component and its default container field is *parts.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + ShaderPart (X3DUrlObject)*
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

### SFString [ ] **type** "VERTEX" <small>["VERTEX"|"FRAGMENT"]</small>

*type* indicates whether this ShaderProgram is a vertex or fragment (pixel) shader.

#### Warning

- Do not wrap extra quotation marks around these SFString enumeration values, since "quotation" "marks" are only used for MFString values.

### SFBool [in, out] **load** TRUE

*load*=true means *load* immediately, *load*=false means defer loading or else unload a previously loaded scene.

#### Hints

- Allows author to design when Inline loading occurs via user interaction, event chains or scripting.
- Use a separate LoadSensor node to detect when loading is complete.

### MFString [in, out] **url** [ ] <small>[URI]</small>

Location and filename of shader. Multiple locations are more reliable, and including a Web address lets e-mail attachments work.

#### Hints

- MFString arrays can have multiple values, so separate each individual string by quote marks "https://www.web3d.org" "https://www.web3d.org/about" "etc."
- Alternative XML encoding for quotation mark " is &amp;quot; (which is an example of a character entity).
- Can replace embedded blank(s) in *url* queries with %20 for each blank character.
- [X3D Scene Authoring Hints, urls](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#urls){:target="_blank"}
- Embedded ecmascript: source can also be contained in the sourceCode pseudo-field without escape characters, equivalent to last entry in the *url* list, when using other API codebases and file encodings.

#### Warning

- Strictly match directory and filename capitalization for http links! This is important for portability. Some operating systems are forgiving of capitalization mismatches, but http/https *url* addresses and paths in Unix-based operating systems are all case sensitive and intolerant of uppercase/lowercase mismatches.

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

- ShaderPart can contain a CDATA block of plain-text source code.
- Embedded ecmascript: source can also be contained in the sourceCode pseudo-field without escape characters, equivalent to last entry in the url list, when using other API codebases and file encodings.
- Insert an XML Character Data (CDATA) block within the Script node to contain source code embedded within an X3D scene, avoiding the need for escape characters.
- A contained XML Character Data (CDATA) block for source code protects whitespace, line breaks, and literal characters (such as &amp; for ampersand character, \< for less-than-sign character, and \> for greater-than-sign character) from unintended escape-character modifications by XML parsers.
- ShaderPart subprograms are written in the same language, which is specified in the parent ComposedShader node.
- [When parent node is LoadSensor, apply `containerField='children'` (X3Dv4) or `containerField='watchList'` (X3Dv3).](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#fieldNameChanges){:target="_blank"}

### Warnings

- ShaderPart contains no field declarations.
- Strict order is required for contained constructs: first field declarations (if any), then IS/connect statements (if any), and finally CDATA source-code block.

## Example

<x3d-canvas src="https://create3000.github.io/media/examples/Shaders/ShaderPart/ShaderPart.x3d" update="auto"></x3d-canvas>

## See Also

- [X3D Specification of ShaderPart node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/shaders.html#ShaderPart){:target="_blank"}
