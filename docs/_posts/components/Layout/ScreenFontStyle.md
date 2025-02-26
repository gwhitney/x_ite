---
title: ScreenFontStyle
date: 2023-01-07
nav: components-Layout
categories: [components, Layout]
tags: [ScreenFontStyle, Layout]
---
<style>
.post h3 {
  word-spacing: 0.2em;
}
</style>

## Overview

ScreenFontStyle is an X3DFontStyleNode defines the size, family, justification, and other styles used within a screen layout. ScreenFontStyle renders text so that it appears identical to typical 2D applications by specifying pointSize in points (as in 2D document layout) rather than size in meters. Each glyph of text is rendered as a quadrilateral with a texture applied.

The ScreenFontStyle node belongs to the **Layout** component and its default container field is *fontStyle.* It is available from X3D version 3.2 or higher.

## Hierarchy

```
+ X3DNode
  + X3DFontStyleNode
    + ScreenFontStyle
```

## Fields

### SFNode [in, out] **metadata** NULL <small>[X3DMetadataObject]</small>

Information about this node can be contained in a MetadataBoolean, MetadataDouble, MetadataFloat, MetadataInteger, MetadataString or MetadataSet node.

#### Hint

- [X3D Architecture 7.2.4 Metadata](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/core.html#Metadata){:target="_blank"}

### SFString [in, out] **language** ""

Language codes consist of a primary code and a (possibly empty) series of subcodes. [ *language*-code = primary-code ( "-" subcode )* ] Two-letter primary codes are reserved for *language* abbreviations. Two-letter primary codes include en (English), fr (French), de (German), it (Italian), nl (Dutch), el (Greek), es (Spanish), pt (Portuguese), ar (Arabic), he (Hebrew), ru (Russian), zh (Chinese), ja (Japanese), hi (Hindi), ur (Urdu), and sa (Sanskrit). Any two-letter subcode is understood to be a country code.

#### Hints

- [See ISO639.2 Codes for the Representation of Names of Languages](http://www.loc.gov/standards/iso639-2/php/code_list.php){:target="_blank"}
- [See RFC3066 Tags for the Identification of Languages](https://tools.ietf.org/html/rfc3066){:target="_blank"}
- [See ISO3166 or](http://xml.coverpages.org/languageIdentifiers.html){:target="_blank"}
- [Relates to Internationalization (i18n)](http://www.w3.org/standards/webdesign/i18n){:target="_blank"}
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

#### Warning

- Do not wrap extra quotation marks around these SFString enumeration values, since "quotation" "marks" are only used for MFString values.

### MFString [in, out] **family** "SERIF" <small>String or [URI]</small>

Array of quoted font *family* names in preference order, browsers use the first supported *family*.

#### Hints

- Example *family* array might be "Times" "SERIF"
- Values with guaranteed support include "SERIF" "SANS" "TYPEWRITER".
- SERIF and SANS are variable-width fonts (for example, Times Roman and Arial).
- TYPEWRITER is a fixed-width font (for example, Courier).
- MFString arrays can have multiple values, so "separate each individual string" "by using quote marks".
- [See 15.2.2.2 Font *family* and style](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/text.html#Fontfamilyandstyle){:target="_blank"} for details.
- [Relates to Internationalization (i18n)](http://www.w3.org/standards/webdesign/i18n){:target="_blank"}
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

#### Warning

- Font *family* support often varies.

### SFString [in, out] **style** "PLAIN" <small>["PLAIN"|"BOLD"|"ITALIC"|"BOLDITALIC"|""]</small>

Pick one of four values for text *style* (PLAIN or BOLD or ITALIC or BOLDITALIC).

#### Hints

- [See 15.2.2.2 Font family and *style*](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/text.html#Fontfamilyandstyle){:target="_blank"} for details.
- Overlapping functionality with CSS *style* attribute provides a "best of both worlds" approach. The *style* attribute provides an inline block of CSS source for element styling, reserved for use by Cascading Style Sheets (CSS) and XML stylesheets.
- [X3D Architecture Annex L, HTML authoring guidelines, CSS considerations](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/htmlGuidelines.html#CSS){:target="_blank"}
- [W3C Cascading Style Sheets](https://www.w3.org/Style/CSS){:target="_blank"}
- [CSS Snapshot](https://www.w3.org/TR/css-2018){:target="_blank"}
- Https://www.w3.org/TR/css-*style*-attr
- [Wikibooks, XML - Managing Data Exchange/XSLT and Style Sheets](https://en.wikibooks.org/wiki/XML_-_Managing_Data_Exchange/XSLT_and_Style_Sheets){:target="_blank"}

#### Warnings

- Overloaded name for CSS *style* attribute.
- Do not wrap extra quotation marks around these SFString enumeration values, since "quotation" "marks" are only used for MFString values.

### SFFloat [in, out] **pointSize** 12 <small>(0,∞)</small>

*pointSize* field specifies the size of text in points. Nominal height (in local coordinate system) of text glyphs, also sets default spacing between adjacent lines of text.

#### Hints

- *pointSize* replaces the size field of the FontStyle node.
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

### SFFloat [in, out] **spacing** 1 <small>[0,∞)</small>

Adjustment factor for line *spacing* between adjacent lines of text.

#### Hint

- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

### SFBool [in, out] **horizontal** TRUE

Whether text direction is *horizontal* (true) or vertical (false).

#### Hints

- [See 15.2.2.3 Direction and justification](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/text.html#Directionandjustification){:target="_blank"} for details.
- [Relates to Internationalization (i18n)](http://www.w3.org/standards/webdesign/i18n){:target="_blank"}
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

### SFBool [in, out] **leftToRight** TRUE

Whether text direction is left-to-right (true) or right-to-left (false).

#### Hints

- [See 15.2.2.3 Direction and justification](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/text.html#Directionandjustification){:target="_blank"} for details.
- [Relates to Internationalization (i18n)](http://www.w3.org/standards/webdesign/i18n){:target="_blank"}
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

### SFBool [in, out] **topToBottom** TRUE

Whether text direction is top-to-bottom (true) or bottom-to-top (false).

#### Hints

- [See 15.2.2.3 Direction and justification](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/text.html#Directionandjustification){:target="_blank"} for details.
- [Relates to Internationalization (i18n)](http://www.w3.org/standards/webdesign/i18n){:target="_blank"}
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

### MFString [in, out] **justify** "BEGIN" <small>["BEGIN", "END", "FIRST", "MIDDLE", ""]</small>

The *justify* field determines horizontal and vertical alignment of text layout, relative to the origin of the object coordinate system.

#### Hints

- Preferred value is usually *justify*=' "MIDDLE" "MIDDLE" ' for centered justification horizontally and vertically.
- MFString arrays can have multiple values, so "separate each individual string" "by using quote marks".
- [See 15.2.2.3 Direction and justification](https://www.web3d.org/specifications/X3Dv4Draft/ISO-IEC19775-1v4-IS.proof//Part01/components/text.html#Directionandjustification){:target="_blank"} for details.
- (X3D version 4.0 draft) accessType relaxed to inputOutput in order to support animation and user accessibility.

#### Warnings

- Exactly two string values are provided for major and minor axis alignment.
- Do not use illegal values such as LEFT RIGHT TOP BOTTOM or CENTER.

## Advisories

### Hints

- First add a Text node as a parent.
- [Wikipedia](https://en.wikipedia.org/wiki/Font){:target="_blank"}

## See Also

- [X3D Specification of ScreenFontStyle node](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/layout.html#ScreenFontStyle){:target="_blank"}
