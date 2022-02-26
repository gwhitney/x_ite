/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
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
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
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
 * along with X_ITE.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
   "x_ite/Fields",
   "x_ite/Base/X3DFieldDefinition",
   "x_ite/Base/FieldDefinitionArray",
   "x_ite/Components/Text/X3DFontStyleNode",
   "x_ite/Browser/Layout/ScreenText",
   "x_ite/Bits/X3DConstants",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DFontStyleNode,
          ScreenText,
          X3DConstants)
{
"use strict";

   function ScreenFontStyle (executionContext)
   {
      X3DFontStyleNode .call (this, executionContext);

      this .addType (X3DConstants .ScreenFontStyle);
   }

   ScreenFontStyle .prototype = Object .assign (Object .create (X3DFontStyleNode .prototype),
   {
      constructor: ScreenFontStyle,
      [Symbol .for ("X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "language",    new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "family",      new Fields .MFString ("SERIF")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "style",       new Fields .SFString ("PLAIN")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "pointSize",   new Fields .SFFloat (12)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "spacing",     new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "horizontal",  new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "leftToRight", new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "topToBottom", new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "justify",     new Fields .MFString ("BEGIN")),
      ]),
      getTypeName: function ()
      {
         return "ScreenFontStyle";
      },
      getComponentName: function ()
      {
         return "Layout";
      },
      getContainerField: function ()
      {
         return "fontStyle";
      },
      getTextGeometry: function (text)
      {
         return new ScreenText (text, this);
      },
      getScale: function ()
      {
         return this .pointSize_ .getValue () * this .getBrowser () .getPointSize ();
      },
   });

   return ScreenFontStyle;
});
