---
title: TimeTrigger
date: 2023-01-07
nav: components-EventUtilities
categories: [components, EventUtilities]
tags: [TimeTrigger, EventUtilities]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

TimeTrigger converts boolean true events to time events.

The TimeTrigger node belongs to the **EventUtilities** component and its default container field is *children.* It is available from X3D version 3.0 or higher.

## Hierarchy

```
+ X3DNode
  + X3DChildNode
    + X3DTriggerNode
      + TimeTrigger
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFBool [in] **set_boolean**

If input event *set_boolean* is true, send output triggerTime event.

#### Hint

- For logical consistency, input event *set_boolean* false has no effect (under review as part of Mantis issue 519).

#### Warning

- It is an error to define this transient inputOnly field in an X3D file, instead only use it a destination for ROUTE events.

### SFTime [out] **triggerTime**

*triggerTime* is output time event, sent when input event set_boolean is true.

#### Warning

- It is an error to define this transient outputOnly field in an X3D file, instead only use it a source for ROUTE events.

## Advisories

### Hints

- [Example scenes and authoring assets](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter09-EventUtilitiesScripting){:target="_blank"}
- [X3D Event-Utility Node Diagrams](https://www.web3d.org/x3d/content/examples/X3dForWebAuthors/Chapter09-EventUtilitiesScripting/X3dEventUtilityNodeEventDiagrams.pdf){:target="_blank"}

## See Also

- [X3D Specification of TimeTrigger node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/eventUtilities.html#TimeTrigger){:target="_blank"}
