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
import X3DTexture2DNode     from "./X3DTexture2DNode.js";
import X3DUrlObject         from "../Networking/X3DUrlObject.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import Algorithm            from "../../../standard/Math/Algorithm.js";
import DEBUG                from "../../DEBUG.js";

function ImageTexture (executionContext)
{
   X3DTexture2DNode .call (this, executionContext);
   X3DUrlObject     .call (this, executionContext);

   this .addType (X3DConstants .ImageTexture);

   this .image    = $("<img></img>");
   this .urlStack = new Fields .MFString ();
}

ImageTexture .prototype = Object .assign (Object .create (X3DTexture2DNode .prototype),
   X3DUrlObject .prototype,
{
   constructor: ImageTexture,
   [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
      new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",             new Fields .SFNode ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "description",          new Fields .SFString ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "load",                 new Fields .SFBool (true)),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "url",                  new Fields .MFString ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "autoRefresh",          new Fields .SFTime ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "autoRefreshTimeLimit", new Fields .SFTime (3600)),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "flipVertically",       new Fields .SFBool ()),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",              new Fields .SFBool (true)),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",              new Fields .SFBool (true)),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties",    new Fields .SFNode ()),
   ]),
   getTypeName: function ()
   {
      return "ImageTexture";
   },
   getComponentName: function ()
   {
      return "Texturing";
   },
   getContainerField: function ()
   {
      return "texture";
   },
   initialize: function ()
   {
      X3DTexture2DNode .prototype .initialize .call (this);
      X3DUrlObject     .prototype .initialize .call (this);

      this ._flipVertically .addInterest ("set_url__", this);

      this .image .on ("load",        this .setImage .bind (this));
      this .image .on ("abort error", this .setError .bind (this));
      this .image .prop ("crossOrigin", "Anonymous");

      this .requestImmediateLoad ();
   },
   getElement: function ()
   {
      return this .image [0];
   },
   unLoadNow: function ()
   {
      this .clearTexture ();
   },
   loadNow: function ()
   {
      this .urlStack .setValue (this ._url);
      this .loadNext ();
   },
   loadNext: function ()
   {
      if (this .urlStack .length === 0)
      {
         this .clearTexture ();
         this .setLoadState (X3DConstants .FAILED_STATE);
         return;
      }

      // Get URL.

      this .URL = new URL (this .urlStack .shift (), this .getExecutionContext () .getWorldURL ());

      if (this .URL .protocol !== "data:")
      {
         if (!this .getCache ())
            this .URL .searchParams .set ("_", Date .now ());
      }

      this .image .attr ("src", this .URL .href);
   },
   setError: function (event)
   {
      if (this .URL .protocol !== "data:")
         console .warn ("Error loading image:", decodeURI (this .URL .href), event .type);

      this .loadNext ();
   },
   setImage: async function ()
   {
      if (DEBUG)
      {
         if (this .URL .protocol !== "data:")
            console .info ("Done loading image:", decodeURI (this .URL .href));
      }

      try
      {
         const
            gl    = this .getBrowser () .getContext (),
            image = this .image [0];

         // https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
         // createImageBitmap

         if (true || gl .getVersion () === 1 && !(Algorithm .isPowerOfTwo (image .width) && Algorithm .isPowerOfTwo (image .height)))
         {
            const
               canvas = document .createElement ("canvas"),
               cx     = canvas .getContext ("2d", { willReadFrequently: true }),
               width  = Algorithm .nextPowerOfTwo (image .width),
               height = Algorithm .nextPowerOfTwo (image .height);

            // Flip Y and scale image to next power of two if needed.

            canvas .width  = width;
            canvas .height = height;

            cx .clearRect (0, 0, width, height);
            cx .save ();

            if (!this ._flipVertically .getValue ())
            {
               cx .translate (0, height);
               cx .scale (1, -1);
            }

            cx .drawImage (image, 0, 0, image .width, image .height, 0, 0, width, height);
            cx .restore ();

            // Determine image alpha.

            const
               data        = cx .getImageData (0, 0, width, height, { premultipliedAlpha: false }) .data,
               transparent = this .isImageTransparent (data);

            // Upload image to GPU.

            this .setTexture (width, height, transparent, data, false);
            this .setLoadState (X3DConstants .COMPLETE_STATE);
         }
         else
         {
            const
               data        = await this .getImageData (image),
               transparent = this .isImageTransparent (data),
               width       = image .width,
               height      = image .height;

            // Flip Y if needed.

            if (!this ._flipVertically .getValue ())
               this .flipImage (data, width, height, 4);

            // Upload image to GPU.

            this .setTexture (width, height, transparent, data, false);
            this .setLoadState (X3DConstants .COMPLETE_STATE);
         }
      }
      catch (error)
      {
         // Catch security error from cross origin requests.
         this .setError ({ type: error .message });
      }
   },
   getImageData: async function (image)
   {
      const
         gl          = this .getBrowser () .getContext (),
         framebuffer = gl .createFramebuffer (),
         texture     = gl .createTexture (),
         data        = new Uint8Array (image .width * image .height * 4);

      gl .bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
      gl .bindTexture (gl.TEXTURE_2D, texture);
      gl .framebufferTexture2D (gl.FRAMEBUFFER, gl .COLOR_ATTACHMENT0, gl .TEXTURE_2D, texture, 0);
      gl .texImage2D (gl .TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      await gl .readPixelsAsync (0, 0, image .width, image .height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl .deleteFramebuffer (framebuffer);
      gl .deleteTexture (texture);

      return data;
   },
   isImageTransparent: function (data)
   {
      for (let i = 3, length = data .length; i < length; i += 4)
      {
         if (data [i] !== 255)
            return true;
      }

      return false;
   },
   flipImage (data, width, height, components)
   {
      const
         height1_2   = height >> 1,
         bytesPerRow = width * components,
         tmp         = new Uint8Array (bytesPerRow);

      for (let y = 0; y < height1_2; ++ y)
      {
         const
            top    = y * bytesPerRow,
            bottom = (height - y - 1) * bytesPerRow;

         tmp .set (data .subarray (top, top + bytesPerRow));
         data .copyWithin (top, bottom, bottom + bytesPerRow);
         data .set (tmp, bottom);
      }

      return data;
   },
   dispose: function ()
   {
      X3DUrlObject     .prototype .dispose .call (this);
      X3DTexture2DNode .prototype .dispose .call (this);
   },
});

export default ImageTexture;
