/*******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011 - 2022.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2011 - 2022, Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the X_ITE Project.
 *
 * X_ITE is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * X_ITE is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with X_ITE.  If not, see <https://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/

import TextAlignment from "./TextAlignment.js";
import Box2          from "../../../standard/Math/Geometry/Box2.js";
import Box3          from "../../../standard/Math/Geometry/Box3.js";
import Vector2       from "../../../standard/Math/Numbers/Vector2.js";
import Vector3       from "../../../standard/Math/Numbers/Vector3.js";

var
   bbox        = new Box2 (),
   lineBBox    = new Box2 (),
   min         = new Vector2 (0, 0),
   max         = new Vector2 (0, 0),
   glyphMin    = new Vector2 (0, 0),
   glyphMax    = new Vector2 (0, 0),
   min3        = new Vector3 (0, 0, 0),
   max3        = new Vector3 (0, 0, 0),
   size        = new Vector2 (0, 0),
   center      = new Vector2 (0, 0),
   size1_2     = new Vector2 (0, 0),
   translation = new Vector2 (0, 0),
   lineBound   = new Vector2 (0, 0),
   origin      = new Vector3 (0, 0, 0),
   vector      = new Vector2 (0, 0),
   box2        = new Box2 (),
   zero2       = new Vector2 (0, 0),
   zero3       = new Vector3 (0, 0, 0);

function X3DTextGeometry (text, fontStyle)
{
   this .browser        = text .getBrowser ();
   this .text           = text;
   this .fontStyle      = fontStyle;
   this .glyphs         = [ ];
   this .minorAlignment = new Vector2 (0, 0);
   this .translations   = [ ];
   this .charSpacings   = [ ];
   this .bearing        = new Vector2 (0, 0);
   this .yPad           = [ ];
   this .bbox           = new Box3 ();
}

Object .assign (X3DTextGeometry .prototype,
{
   getBrowser ()
   {
      return this .browser;
   },
   getText ()
   {
      return this .text;
   },
   getFontStyle ()
   {
      return this .fontStyle;
   },
   getGlyphs ()
   {
      return this .glyphs;
   },
   getMinorAlignment ()
   {
      return this .minorAlignment;
   },
   getTranslations ()
   {
      return this .translations;
   },
   getCharSpacings ()
   {
      return this .charSpacings;
   },
   getBearing ()
   {
      return this .bearing;
   },
   getBBox ()
   {
      return this .bbox;
   },
   update ()
   {
      var
         text      = this .text,
         fontStyle = this .fontStyle,
         numLines  = text ._string .length;

      text ._lineBounds .length = numLines;
      this .glyphs      .length = 0;

      if (numLines === 0 || ! fontStyle .getFont ())
      {
         text ._origin     .setValue (zero3);
         text ._textBounds .setValue (zero2);

         this .bbox .set ();
         return;
      }

      if (fontStyle ._horizontal .getValue ())
      {
         this .resizeArray (this .translations, numLines);
         this .resizeArray (this .charSpacings, numLines);

         this .horizontal (text, fontStyle);
      }
      else
      {
         var
            string   = text ._string,
            numChars = 0;

         for (var i = 0, length = string .length; i < length; ++ i)
            numChars += string [i] .length;

         this .resizeArray (this .translations, numChars);
         this .resizeArray (this .charSpacings, numChars);

         this .vertical (text, fontStyle);
      }
   },
   resizeArray (array, size)
   {
      // Resize array in grow only fashion.

      for (var i = array .length; i < size; ++ i)
         array .push (new Vector2 (0, 0));

      array .length = size;
   },
   horizontal (text, fontStyle)
   {
      var
         font        = fontStyle .getFont (),
         string      = text ._string,
         numLines    = string .length,
         maxExtent   = Math .max (0, text ._maxExtent .getValue ()),
         topToBottom = fontStyle ._topToBottom .getValue (),
         scale       = fontStyle .getScale (),
         spacing     = fontStyle ._spacing .getValue ();

      bbox .set ();

      // Calculate bboxes.

      var
         first = topToBottom ? 0 : numLines - 1,
         last  = topToBottom ? numLines : -1,
         step  = topToBottom ? 1 : -1;

      for (var l = first, ll = 0; l !== last; l += step, ++ ll)
      {
         var line = string [l];

         // Get line extents.

         var glyphs = this .getHorizontalLineExtents (fontStyle, line, min, max, ll);

         size .assign (max) .subtract (min);

         // Calculate charSpacing and lineBounds.

         var
            charSpacing = 0,
            length      = text .getLength (l);

         lineBound .set (size .x * scale, ll == 0 ? max .y - font .descender / font .unitsPerEm * scale : spacing);

         if (maxExtent)
         {
            if (length)
               length = Math .min (maxExtent, length);

            else
               length = Math .min (maxExtent, size .x * scale);
         }

         if (length)
         {
            charSpacing  = (length - lineBound .x) / (glyphs .length - 1);
            lineBound .x = length;
            size .x      = length / scale;
         }

         this .charSpacings [ll] = charSpacing;
         text ._lineBounds [l]   = lineBound;

         // Calculate line translation.

         switch (fontStyle .getMajorAlignment ())
         {
            case TextAlignment .BEGIN:
            case TextAlignment .FIRST:
               this .translations [ll] .set (0, -ll * spacing);
               break;
            case TextAlignment .MIDDLE:
               this .translations [ll] .set (-min .x - size .x / 2, -ll * spacing);
               break;
            case TextAlignment .END:
               this .translations [ll] .set (-min .x - size .x, -ll * spacing);
               break;
         }

         this .translations [ll] .multiply (scale);

         // Calculate center.

         center .assign (min) .add (size1_2 .assign (size) .divide (2));

         // Add bbox.

         bbox .add (box2 .set (size .multiply (scale), center .multiply (scale) .add (this .translations [ll])));
      }

      //console .log ("size", bbox .size, "center", bbox .center);

      // Get text extents.

      bbox .getExtents (min, max);

      size .assign (max) .subtract (min);

      // Calculate text position

      text ._textBounds = size;
      this .bearing .set (0, -max .y);

      switch (fontStyle .getMinorAlignment ())
      {
         case TextAlignment .BEGIN:
            this .minorAlignment .assign (this .bearing);
            break;
         case TextAlignment .FIRST:
            this .minorAlignment .set (0, 0);
            break;
         case TextAlignment .MIDDLE:
            this .minorAlignment .set (0, size .y / 2 - max .y);
            break;
         case TextAlignment .END:
            this .minorAlignment .set (0, (numLines - 1) * spacing * scale);
            break;
      }

      // Translate bbox by minorAlignment.

      min .add (this .minorAlignment);
      max .add (this .minorAlignment);

      // The value of the origin field represents the upper left corner of the textBounds.

      text ._origin .setValue (origin .set (min .x, max .y, 0));

      this .bbox .setExtents (min3 .set (min .x, min .y, 0),
                              max3 .set (max .x, max .y, 0));
   },
   vertical (text, fontStyle)
   {
      var
         font             = fontStyle .getFont (),
         string           = text ._string,
         numLines         = string .length,
         maxExtent        = Math .max (0, text ._maxExtent .getValue ()),
         leftToRight      = fontStyle ._leftToRight .getValue (),
         topToBottom      = fontStyle ._topToBottom .getValue (),
         scale            = fontStyle .getScale (),
         spacing          = fontStyle ._spacing .getValue (),
         yPad             = this .yPad,
         primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality ();

      bbox .set ();

      // Calculate bboxes.

      var
         firstL = leftToRight ? 0 : numLines - 1,
         lastL  = leftToRight ? numLines : -1,
         stepL  = leftToRight ? 1 : -1,
         t      = 0; // Translation index

      for (var l = firstL; l !== lastL; l += stepL)
      {
         var glyphs = this .stringToGlyphs (font, string [l], true, l);

         var
            t0       = t,
            numChars = glyphs .length;

         // Calculate line bbox

         lineBBox .set ();

         var
            firstG = topToBottom ? 0 : numChars - 1,
            lastG  = topToBottom ? numChars : -1,
            stepG  = topToBottom ? 1 : -1;

         for (var g = firstG; g !== lastG; g += stepG, ++ t)
         {
            var glyph = glyphs [g];

            // Get glyph extents.

            this .getGlyphExtents (font, glyph, primitiveQuality, min, max);

            size .assign (max) .subtract (min);

            // Calculate glyph translation

            var glyphNumber = topToBottom ? g : numChars - g - 1;

            this .translations [t] .set ((spacing - size .x - min .x) / 2, -glyphNumber);

            // Calculate center.

            center .assign (min) .add (size1_2 .assign (size) .divide (2)) .add (this .translations [t]);

            // Add bbox.

            lineBBox .add (box2 .set (size, center));
         }

         // Get line extents.

         lineBBox .getExtents (min, max);

         size .assign (max) .subtract (min);

         // Calculate charSpacing and lineBounds.

         var
            lineNumber  = leftToRight ? l : numLines - l - 1,
            padding     = (spacing - size .x) / 2,
            charSpacing = 0,
            length      = text .getLength (l);

         lineBound .set (l === 0 ? spacing - padding: spacing, numChars ? size .y : 0) .multiply (scale);

         if (maxExtent)
         {
            if (length)
               length = Math .min (maxExtent, length);

            else
               length = Math .min (maxExtent, size .y * scale);
         }

         if (length)
         {
            charSpacing  = (length - lineBound .y) / (glyphs .length - 1) / scale;
            lineBound .y = length;
            size .y      = length / scale;
            min .y       = max .y  - size .y;
         }

         text ._lineBounds [l] = lineBound;

         // Calculate line translation.

         switch (fontStyle .getMajorAlignment ())
         {
            case TextAlignment .BEGIN:
            case TextAlignment .FIRST:
               translation .set (lineNumber * spacing, -1);
               break;
            case TextAlignment .MIDDLE:
               translation .set (lineNumber * spacing, (size .y / 2 - max .y));
               break;
            case TextAlignment .END:
            {
               // This is needed to make maxExtend and charSpacing work.
               if (numChars)
                  this .getGlyphExtents (font, glyphs [topToBottom ? numChars - 1 : 0], primitiveQuality, glyphMin .assign (Vector2 .Zero), vector);

               translation .set (lineNumber * spacing, (size .y - max .y + glyphMin .y));
               break;
            }
         }

         // Calculate glyph translation

         var space = 0;

         for (var tt = t0; tt < t; ++ tt)
         {
            this .translations [tt] .add (translation);

            this .translations [tt] .y -= space;

            this .translations [tt] .multiply (scale);

            space += charSpacing;
         }

         // Calculate ypad to extend line bounds.

         switch (fontStyle .getMajorAlignment ())
         {
            case TextAlignment .BEGIN:
            case TextAlignment .FIRST:
               yPad [l] = max .y + translation .y;
               break;
            case TextAlignment .MIDDLE:
               yPad [l] = 0;
               break;
            case TextAlignment .END:
               yPad [l] = min .y + translation .y;
               break;
         }

         // Calculate center.

         center .assign (min) .add (size1_2 .assign (size) .divide (2));

         // Add bbox.

         bbox .add (box2 .set (size .multiply (scale), center .add (translation) .multiply (scale)));
      }

      // Get text extents.

      bbox .getExtents (min, max);

      size .assign (max) .subtract (min);

      // Extend lineBounds.

      switch (fontStyle .getMajorAlignment ())
      {
         case TextAlignment .BEGIN:
         case TextAlignment .FIRST:
         {
            var lineBounds = text ._lineBounds;

            for (var i = 0, length = lineBounds .length; i < length; ++ i)
               lineBounds [i] .y += max .y - yPad [i] * scale;

            break;
         }
         case TextAlignment .MIDDLE:
            break;
         case TextAlignment .END:
         {
            var lineBounds = text ._lineBounds;

            for (var i = 0, length = lineBounds .length; i < length; ++ i)
               lineBounds [i] .y += yPad [i] * scale - min .y;

            break;
         }
      }

      // Calculate text position

      text ._textBounds = size;

      switch (fontStyle .getMajorAlignment ())
      {
         case TextAlignment .BEGIN:
         case TextAlignment .FIRST:
            this .bearing .set (-min .x, max .y);
            break;
         case TextAlignment .MIDDLE:
            this .bearing .set (-min .x, 0);
            break;
         case TextAlignment .END:
            this .bearing .set (-min .x, min .y);
            break;
      }

      switch (fontStyle .getMinorAlignment ())
      {
         case TextAlignment .BEGIN:
         case TextAlignment .FIRST:
            this .minorAlignment .set (-min .x, 0);
            break;
         case TextAlignment .MIDDLE:
            this .minorAlignment .set (-min .x - size .x / 2, 0);
            break;
         case TextAlignment .END:
            this .minorAlignment .set (-min .x - size .x, 0);
            break;
      }

      // Translate bbox by minorAlignment.

      min .add (this .minorAlignment);
      max .add (this .minorAlignment);

      // The value of the origin field represents the upper left corner of the textBounds.

      text ._origin .setValue (origin .set (min .x, max .y, 0));

      this .bbox .setExtents (min3 .set (min .x, min .y, 0),
                              max3 .set (max .x, max .y, 0));
   },
   stringToGlyphs (font, line, normal, lineNumber)
   {
      var glypes = this .glyphs [lineNumber];

      if (! glypes)
         glypes = this .glyphs [lineNumber] = [ ];

      glypes .length = line .length;

      var
         first = normal ? 0 : line .length - 1,
         last  = normal ? line .length : -1,
         step  = normal ? 1 : -1;

      for (var c = first, g = 0; c !== last; c += step, ++ g)
         glypes [g] = font .charToGlyph (line [c]);

      return glypes;
   },
   getHorizontalLineExtents (fontStyle, line, min, max, lineNumber)
   {
      var
         font             = fontStyle .getFont (),
         normal           = fontStyle ._horizontal .getValue () ? fontStyle ._leftToRight .getValue () : fontStyle ._topToBottom .getValue (),
         glyphs           = this .stringToGlyphs (font, line, normal, lineNumber),
         primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality (),
         xMin             = 0,
         xMax             = 0,
         yMin             = Number .POSITIVE_INFINITY,
         yMax             = Number .NEGATIVE_INFINITY;

      for (var g = 0, length = glyphs .length; g < length; ++ g)
      {
         var
            glyph   = glyphs [g],
            kerning = g + 1 < length ? font .getKerningValue (glyph, glyphs [g + 1]) : 0;

         this .getGlyphExtents (font, glyph, primitiveQuality, glyphMin, glyphMax);

         xMax += glyph .advanceWidth + kerning;
         yMin  = Math .min (yMin, glyphMin .y);
         yMax  = Math .max (yMax, glyphMax .y);
      }

      if (glyphs .length)
      {
         this .getGlyphExtents (font, glyphs [0], primitiveQuality, glyphMin, glyphMax);

         xMin  = glyphMin .x;
      }
      else
      {
         yMin = 0;
         yMax = 0;
      }

      min .set (xMin, yMin);
      max .set (xMax / font .unitsPerEm, yMax);

      switch (fontStyle .getMajorAlignment ())
      {
         case TextAlignment .BEGIN:
         case TextAlignment .FIRST:
            min .x = 0;
            break;
      }

      return glyphs;
   },
   traverse (type, renderObject)
   { },
});

export default X3DTextGeometry;
