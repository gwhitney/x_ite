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

import Fields               from "../../Fields.js";
import X3DFieldDefinition   from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray from "../../Base/FieldDefinitionArray.js";
import X3DBaseNode          from "../../Base/X3DBaseNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import PrimitiveQuality     from "./PrimitiveQuality.js";
import Shading              from "./Shading.js";
import TextureQuality       from "./TextureQuality.js";
import Algorithm            from "../../../standard/Math/Algorithm.js";

function BrowserOptions (executionContext)
{
   X3DBaseNode .call (this, executionContext);

   this .addAlias ("AntiAliased", this ._Antialiased);

   const browser = this .getBrowser ();

   this .localStorage     = browser .getLocalStorage () .addNameSpace ("BrowserOptions.");
   this .textureQuality   = TextureQuality .MEDIUM
   this .primitiveQuality = PrimitiveQuality .MEDIUM;
   this .shading          = Shading .GOURAUD;
}

Object .assign (Object .setPrototypeOf (BrowserOptions .prototype, X3DBaseNode .prototype),
{
   initialize ()
   {
      X3DBaseNode .prototype .initialize .call (this);

      this .localStorage .setDefaultValues ({
         Rubberband:        this ._Rubberband        .getValue (),
         PrimitiveQuality:  this ._PrimitiveQuality  .getValue (),
         TextureQuality:    this ._TextureQuality    .getValue (),
         StraightenHorizon: this ._StraightenHorizon .getValue (),
         Timings:           this ._Timings           .getValue (),
      });

      this ._Rubberband                   .addInterest ("set_rubberband__",                   this);
      this ._Antialiased                  .addInterest ("set_antialiased__",                  this);
      this ._PrimitiveQuality             .addInterest ("set_primitiveQuality__",             this);
      this ._TextureQuality               .addInterest ("set_textureQuality__",               this);
      this ._Shading                      .addInterest ("set_shading__",                      this);
      this ._StraightenHorizon            .addInterest ("set_straightenHorizon__",            this);
      this ._AutoUpdate                   .addInterest ("set_autoUpdate__",                   this);
      this ._ContentScale                 .addInterest ("set_contentScale__",                 this);
      this ._LogarithmicDepthBuffer       .addInterest ("set_logarithmicDepthBuffer__",       this);
      this ._Multisampling                .addInterest ("set_multisampling__",                this);
      this ._OrderIndependentTransparency .addInterest ("set_orderIndependentTransparency__", this);
      this ._Timings                      .addInterest ("set_timings__",                      this);

      this .set_antialiased__                  (this ._Antialiased);
      this .set_shading__                      (this ._Shading);
      this .set_contentScale__                 (this ._ContentScale);
      this .set_logarithmicDepthBuffer__       (this ._LogarithmicDepthBuffer);
      this .set_multisampling__                (this ._Multisampling);
      this .set_orderIndependentTransparency__ (this ._OrderIndependentTransparency);

      this .reset ();
   },
   reset: (() =>
   {
      const attributes = new Set ([
         "Antialiased",
         "AutoUpdate",
         "Cache",
         "ContentScale",
         "ContextMenu",
         "Debug",
         "Multisampling",
         "Notifications",
         "OrderIndependentTransparency",
         "SplashScreen",
      ]);

      const mappings = new Map ([
         ["AutoUpdate", "Update"],
      ]);

      const restorable = new Set ([
         "PrimitiveQuality",
         "Rubberband",
         "StraightenHorizon",
         "TextureQuality",
         "Timings",
      ]);

      return function ()
      {
         const
            browser      = this .getBrowser (),
            localStorage = this .localStorage;

         for (const { name, value } of this .getFieldDefinitions ())
         {
            if (attributes .has (name))
            {
               const
                  attribute = $.toLowerCaseFirst (mappings .get (name) ?? name),
                  value     = browser .getElement () .attr (attribute);

               if (value !== undefined)
               {
                  browser .attributeChangedCallback (attribute, null, value);
                  continue;
               }
            }

            if (restorable .has (name))
            {
               const
                  value = localStorage [name],
                  field = this .getField (name);

               if (value !== field .getValue ())
                  field .setValue (value);

               continue;
            }

            const field = this .getField (name);

            if (field .equals (value))
               continue;

            field .assign (value);
         }
      };
   })(),
   getPrimitiveQuality ()
   {
      return this .primitiveQuality;
   },
   getShading ()
   {
      return this .shading;
   },
   getTextureQuality ()
   {
      return this .textureQuality;
   },
   set_rubberband__ (rubberband)
   {
      this .localStorage .Rubberband = rubberband .getValue ();
   },
   set_antialiased__ ()
   {
      this .set_multisampling__ (this ._Multisampling);
   },
   set_primitiveQuality__ (value)
   {
      const
         browser          = this .getBrowser (),
         primitiveQuality = value .getValue () .toUpperCase ();

      this .localStorage .PrimitiveQuality = primitiveQuality;
      this .primitiveQuality               = $.enum (PrimitiveQuality, primitiveQuality, PrimitiveQuality .MEDIUM);

      if (typeof browser .setPrimitiveQuality2D === "function")
         browser .setPrimitiveQuality2D (this .primitiveQuality);

      if (typeof browser .setPrimitiveQuality3D === "function")
         browser .setPrimitiveQuality3D (this .primitiveQuality);
   },
   set_textureQuality__ (value)
   {
      const
         browser        = this .getBrowser (),
         textureQuality = value .getValue () .toUpperCase ();

      this .localStorage .TextureQuality = textureQuality;
      this .textureQuality               = $.enum (TextureQuality, textureQuality, TextureQuality .MEDIUM);

      if (typeof browser .setTextureQuality === "function")
         browser .setTextureQuality (this .textureQuality);
   },
   set_shading__: (() =>
   {
      const strings = {
         [Shading .POINT]:     "POINT",
         [Shading .WIREFRAME]: "WIREFRAME",
         [Shading .FLAT]:      "FLAT",
         [Shading .GOURAUD]:   "GOURAUD",
         [Shading .PHONG]:     "PHONG",
      };

      return function (value)
      {
         const
            browser = this .getBrowser (),
            shading = value .getValue () .toUpperCase () .replace ("POINTSET", "POINT");

         this .shading = $.enum (Shading, shading, Shading .GOURAUD);

         browser .getRenderingProperties () ._Shading = strings [this .shading];
         browser .setShading (this .shading);
      };
   })(),
   set_straightenHorizon__ (straightenHorizon)
   {
      this .localStorage .StraightenHorizon = straightenHorizon .getValue ();

      if (straightenHorizon .getValue ())
         this .getBrowser () .getActiveLayer () ?.straightenView ();
   },
   set_autoUpdate__ (autoUpdate)
   {
      const events = ["resize", "scroll", "load"]
         .map (event => `${event}.${this .getTypeName ()}${this .getId ()}`)
         .join (" ");

      if (autoUpdate .getValue ())
      {
         const
            browser = this .getBrowser (),
            element = browser .getElement ();

         const checkUpdate = () =>
         {
            if (element .isInViewport ())
            {
               if (!browser .isLive ())
                  browser .beginUpdate ();
            }
            else
            {
               if (browser .isLive ())
                  browser .endUpdate ();
            }
         };

         $(window) .on (events, checkUpdate);
         checkUpdate ();
      }
      else
      {
         $(window) .off (events);
      }
   },
   set_contentScale__ (contentScale)
   {
      const browser = this .getBrowser ();

      if (this .removeUpdateContentScale)
         this .removeUpdateContentScale ();

      if (contentScale .getValue () === -1)
         this .updateContentScale ();
      else
         browser .getRenderingProperties () ._ContentScale = Math .max (contentScale .getValue (), 0) || 1;

      browser .reshape ();
   },
   updateContentScale ()
   {
      const
         browser = this .getBrowser (),
         media   = window .matchMedia (`(resolution: ${window .devicePixelRatio}dppx)`),
         update  = this .updateContentScale .bind (this);

      if (this .removeUpdateContentScale)
         this .removeUpdateContentScale ();

      this .removeUpdateContentScale = function () { media .removeEventListener ("change", update) };

      media .addEventListener ("change", update);

      browser .getRenderingProperties () ._ContentScale = window .devicePixelRatio;

      browser .reshape ();
   },
   set_logarithmicDepthBuffer__ (logarithmicDepthBuffer)
   {
      const
         browser = this .getBrowser (),
         gl      = browser .getContext ();

      browser .getRenderingProperties () ._LogarithmicDepthBuffer = logarithmicDepthBuffer .getValue () && gl .HAS_FEATURE_FRAG_DEPTH;
   },
   set_multisampling__ (multisampling)
   {
      const
         browser = this .getBrowser (),
         samples = Algorithm .clamp (multisampling .getValue (), 0, browser .getMaxSamples ());

      browser .getRenderingProperties () ._Multisampling = this ._Antialiased .getValue () ? samples : 0;
      browser .getRenderingProperties () ._Antialiased   = samples > 0;

      browser .reshape ();
   },
   set_orderIndependentTransparency__ ()
   {
      const browser = this .getBrowser ();

      browser .getShaders () .clear ();
      browser .reshape ();
   },
   set_timings__ (timings)
   {
      this .localStorage .Timings = timings .getValue ();
   },
});

Object .defineProperties (BrowserOptions,
{
   typeName:
   {
      value: "BrowserOptions",
      enumerable: true,
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "SplashScreen",                 new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Dashboard",                    new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Rubberband",                   new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "EnableInlineViewpoints",       new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Antialiased",                  new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "TextureQuality",               new Fields .SFString ("MEDIUM")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "PrimitiveQuality",             new Fields .SFString ("MEDIUM")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "QualityWhenMoving",            new Fields .SFString ("SAME")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Shading",                      new Fields .SFString ("GOURAUD")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "MotionBlur",                   new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "AutoUpdate",                   new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Cache",                        new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "ContentScale",                 new Fields .SFDouble (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "ContextMenu",                  new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Debug",                        new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Gravity",                      new Fields .SFDouble (9.80665)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "LoadUrlObjects",               new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "LogarithmicDepthBuffer",       new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Notifications",                new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Multisampling",                new Fields .SFInt32 (4)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "OrderIndependentTransparency", new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "StraightenHorizon",            new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "Timings",                      new Fields .SFBool ()),
      ]),
      enumerable: true,
   },
});

export default BrowserOptions;
