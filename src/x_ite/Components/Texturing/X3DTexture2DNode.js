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

import X3DSingleTextureNode from "./X3DSingleTextureNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";

const defaultData = new Uint8Array ([ 255, 255, 255, 255 ]);

function X3DTexture2DNode (executionContext)
{
   X3DSingleTextureNode .call (this, executionContext);

   this .addType (X3DConstants .X3DTexture2DNode);

   const gl = this .getBrowser () .getContext ();

   this .target = gl .TEXTURE_2D;
   this .width  = 0;
   this .height = 0;
}

Object .assign (Object .setPrototypeOf (X3DTexture2DNode .prototype, X3DSingleTextureNode .prototype),
{
   initialize ()
   {
      X3DSingleTextureNode .prototype .initialize .call (this);

      this ._repeatS .addInterest ("updateTextureParameters", this);
      this ._repeatT .addInterest ("updateTextureParameters", this);

      const gl = this .getBrowser () .getContext ();

      gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
      gl .texImage2D  (gl .TEXTURE_2D, 0, gl .RGBA, 1, 1, 0, gl .RGBA, gl .UNSIGNED_BYTE, defaultData);
   },
   getTarget ()
   {
      return this .target;
   },
   getTextureType ()
   {
      return 2;
   },
   getTextureTypeString ()
   {
      return "2D";
   },
   getWidth ()
   {
      return this .width;
   },
   getHeight ()
   {
      return this .height;
   },
   clearTexture ()
   {
      this .setTexture (1, 1, false, defaultData, false);
   },
   setTexture (width, height, transparent, data, flipY)
   {
      this .width  = width;
      this .height = height;

      const gl = this .getBrowser () .getContext ();

      gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
      gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, flipY);
      //gl .pixelStorei (gl .UNPACK_COLORSPACE_CONVERSION_WEBGL, colorspace ? gl .BROWSER_DEFAULT_WEBGL : gl .NONE);
      gl .texImage2D  (gl .TEXTURE_2D, 0, gl .RGBA, width, height, 0, gl .RGBA, gl .UNSIGNED_BYTE, data);
      gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, false);
      //gl .pixelStorei (gl .UNPACK_COLORSPACE_CONVERSION_WEBGL, gl .BROWSER_DEFAULT_WEBGL);

      this .setTransparent (transparent);
      this .updateTextureParameters ();
      this .addNodeEvent ();
   },
   updateTexture (data, flipY)
   {
      const gl = this .getBrowser () .getContext ();

      gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
      gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, flipY);
      gl .texSubImage2D (gl .TEXTURE_2D, 0, 0, 0, gl .RGBA, gl .UNSIGNED_BYTE, data);
      gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, false);

      if (this .texturePropertiesNode ._generateMipMaps .getValue ())
         gl .generateMipmap (gl .TEXTURE_2D);

      this .addNodeEvent ();
   },
   updateTextureParameters ()
   {
      X3DSingleTextureNode .prototype .updateTextureParameters .call (this,
                                                                      this .target,
                                                                      this ._textureProperties .getValue (),
                                                                      this .texturePropertiesNode,
                                                                      this .width,
                                                                      this .height,
                                                                      this ._repeatS .getValue (),
                                                                      this ._repeatT .getValue (),
                                                                      false);
   },
   setShaderUniforms (gl, shaderObject, renderObject, channel = shaderObject .x3d_Texture [0])
   {
      const textureUnit = this .getBrowser () .getTexture2DUnit ();

      gl .activeTexture (gl .TEXTURE0 + textureUnit);
      gl .bindTexture (gl .TEXTURE_2D, this .getTexture ());
      gl .uniform1i (channel .texture2D, textureUnit);
   },
});

Object .defineProperties (X3DTexture2DNode,
{
   typeName:
   {
      value: "X3DTexture2DNode",
      enumerable: true,
   },
   componentName:
   {
      value: "Texturing",
      enumerable: true,
   },
});

export default X3DTexture2DNode;
