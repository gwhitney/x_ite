---
title: Controlling Navigation
date: 2022-11-28
nav: tutorials-textures-lights-and-environment
categories: [Tutorials]
tags: [Controlling, Navigation]
---
## Motivation

- Different types of worlds require different styles of navigation
  - Walk through a dungeon
  - Fly through a cloud world
  - Examine shapes in a CAD application
- You can select the navigation type
- You can describe the size and speed of the viewer's avatar

## Selecting navigation types

There are five standard navigation keywords:

- **WALK** - walk, pulled down by gravity
- **FLY** - fly, unaffected by gravity
- **EXAMINE** - examine an object at "arms length"
- **NONE** - no navigation, movement controlled by world not viewer!
- **ANY** - allows user to change navigation type

Some browsers support additional navigation types.

## Specifying avatars

- Avatar size (width, height, step height) and speed can be specified

## Controlling the headlight

- By default, a headlight is placed on the avatar's head and aimed in the head direction
- You can turn this headlight on and off
  - Most browsers provide a menu option to control the headlight
  - You can also control the headlight with the [NavigationInfo](../components/navigation/navigationinfo) node

## Syntax: NavigationInfo

A [NavigationInfo](../components/navigation/navigationinfo) node selects the navigation type and avatar characteristics:

- *type* - navigation style
- *avatarSize* and speed - avatar characteristics
- *headlight* - headlight on or off

### XML Encoding

```xml
<NavigationInfo
  type='"WALK", "ANY"'
  avatarSize='0.25, 1.6, 0.75'
  speed='1.0'
  headlight='true'/>
```

### Classic Encoding

```js
NavigationInfo {
  type       [ "WALK", "ANY" ]
  avatarSize [ 0.25, 1.6, 0.75 ]
  speed      1.0
  headlight  TRUE
}
```

## Summary

The navigation type specifies how a viewer can move in a world:

- walk, fly, examine, or none

The avatar overall size and speed specify the viewer's avatar characteristics.
