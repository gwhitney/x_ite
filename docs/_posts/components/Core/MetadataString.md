---
title: MetadataString
date: 2023-01-07
nav: components-Core
categories: [components, Core]
tags: [MetadataString, Core]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

MetadataString contains a typed list of values providing metadata information about its parent node. Further information about this specific Metadata* node may be provided by a single child Metadata* node with `containerField='metadata'.`

The MetadataString node belongs to the **Core** component and its default container field is *value.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + MetadataString (X3DMetadataObject)*
```

<small>\* Derived from multiple interfaces.</small>

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **name** ""

Depending on the metadata vocabulary, the attribute *name* is usually required for metadata nodes.

#### Hints

- Well-defined names can simplify design and debugging through improved author understanding.
- [X3D Scene Authoring Hints, Naming Conventions](https://www.web3d.org/x3d/content/examples/X3dSceneAuthoringHints.html#NamingConventions){:target="_blank"}

#### Warning

- *name* field is not included if this instance is a USE node, in order to avoid potential mismatches.

### SFString [in, out] **reference** ""

Reference to the metadata standard or definition defining this particular metadata value.

### MFString [in, out] **value** [ ]

The *value* attribute is a strictly typed data array providing relevant metadata information.

#### Hint

- Many XML tools substitute XML character references for special characters automatically if needed within an attribute *value* (such as &amp;#38; for &amp; ampersand character, or &amp;#34; for " quotation-mark character).

## Advisories

### Hints

- Typically use `containerField='value'` if the parent node is MetadataSet.
- Explicitly defining containerField for Metadata nodes is always allowed and also unambiguous across each version of X3D.
- [Each of the Metadata nodes are allowed as top-level root nodes in a scene, if doing that be sure to explicitly define `containerField='metadata'.`](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-DIS/Part01/concepts.html#Rootnodes){:target="_blank"}
- If present, an IS statement is the first child within any other node.
- An IS statement precedes any sibling Metadata* node, which in turn precedes any other sibling nodes.
- Comments are not readable when a model file is loaded for viewing, but WorldInfo and Metadata* nodes are persistent and inspectable at run time.
- [X3D for Web Authors, Chapter 15, Metadata Information](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter15-Metadata/Chapter15-MetadataInformation.html){:target="_blank"}

### Warnings

- Default `containerField='metadata'` in X3D 3 changed to default `containerField='value'` in X3D 4.0, allowing construction of much terser MetadataSet vocabulary structures.
- Metadata nodes can only contain other Metadata nodes.

## See Also

- [X3D Specification of MetadataString node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/core.html#MetadataString){:target="_blank"}
