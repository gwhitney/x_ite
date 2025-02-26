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

import MultiSampleFrameBuffer from "../../Rendering/MultiSampleFrameBuffer.js";
import Vector4                from "../../../standard/Math/Numbers/Vector4.js";

const
   _viewport      = Symbol (),
   _frameBuffer   = Symbol (),
   _resizer       = Symbol (),
   _localObjects  = Symbol (),
   _composeShader = Symbol (),
   _depthShaders  = Symbol ();

function X3DRenderingContext ()
{
   this [_viewport]     = new Vector4 (0, 0, 300, 150);
   this [_frameBuffer]  = new MultiSampleFrameBuffer (this, 300, 150, 4);
   this [_localObjects] = [ ]; // shader objects dumpster
   this [_depthShaders] = new Map ();
}

Object .assign (X3DRenderingContext .prototype,
{
   initialize ()
   {
      // Configure context.

      const gl = this .getContext ();

      gl .enable (gl .SCISSOR_TEST);
      gl .enable (gl .DEPTH_TEST);
      gl .depthFunc (gl .LEQUAL);
      gl .clearDepth (1);

      gl .blendFuncSeparate (gl .SRC_ALPHA, gl .ONE_MINUS_SRC_ALPHA, gl .ONE, gl .ONE_MINUS_SRC_ALPHA);
      gl .blendEquationSeparate (gl .FUNC_ADD, gl .FUNC_ADD);

      // Configure viewport.

      $(document) .on ('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', this .onfullscreen .bind (this));

      //https://github.com/sdecima/javascript-detect-element-resize
      this [_resizer] = new ResizeSensor (this .getSurface (), this .reshape .bind (this));

		this .getSurface () .css ("position", ""); // Reset position, set from ResizeSensor.

      this .reshape ();
   },
   getRenderer ()
   {
      const gl = this .getContext ();

      if (! navigator .userAgent .match (/Firefox/))
      {
         const dbgRenderInfo = gl .getExtension ("WEBGL_debug_renderer_info");

         if (dbgRenderInfo)
            return gl .getParameter (dbgRenderInfo .UNMASKED_RENDERER_WEBGL);
      }

      return gl .getParameter (gl .RENDERER);
   },
   getVendor ()
   {
      const gl = this .getContext ();

      if (! navigator .userAgent .match (/Firefox/))
      {
         const dbgRenderInfo = gl .getExtension ("WEBGL_debug_renderer_info");

         if (dbgRenderInfo)
            return gl .getParameter (dbgRenderInfo .UNMASKED_VENDOR_WEBGL);
      }

      return gl .getParameter (gl .VENDOR);
   },
   getWebGLVersion ()
   {
      const gl = this .getContext ();

      return gl .getParameter (gl .VERSION);
   },
   getMaxSamples ()
   {
      const gl = this .getContext ();

      return gl .getVersion () > 1 ? gl .getParameter (gl .MAX_SAMPLES) : 0;
   },
   getMaxClipPlanes ()
   {
      return 6;
   },
   getDepthSize ()
   {
      const gl = this .getContext ();

      return gl .getParameter (gl .DEPTH_BITS);
   },
   getColorDepth ()
   {
      const gl = this .getContext ();

      return (gl .getParameter (gl .RED_BITS) +
              gl .getParameter (gl .BLUE_BITS) +
              gl .getParameter (gl .GREEN_BITS) +
              gl .getParameter (gl .ALPHA_BITS));
   },
   getViewport ()
   {
      return this [_viewport];
   },
   getLocalObjects ()
   {
      return this [_localObjects];
   },
   getFrameBuffer ()
   {
      return this [_frameBuffer];
   },
   getComposeShader ()
   {
      if (this [_composeShader])
         return this [_composeShader];

      return this [_composeShader] = this .createShader ("ComposeShader", "Compose", "Compose");
   },
   getDepthShader (numClipPlanes, shapeNode, humanoidNode)
   {
      const geometryContext = shapeNode .getGeometryContext ();

      let key = "";

      key += numClipPlanes;
      key += ".";
      key += shapeNode .getShapeKey ();
      key += geometryContext .geometryType;
      key += humanoidNode ? 1 : 0;

      if (geometryContext .geometryType >= 2)
      {
         key += "0.0.0";
      }
      else
      {
         const appearanceNode  = shapeNode .getAppearance ();

         key += appearanceNode .getStyleProperties (geometryContext .geometryType) ? 1 : 0;
         key += ".";
         key += appearanceNode .getTextureBits () .toString (4); // Textures for point and line.
         key += ".";
         key += appearanceNode .getMaterial () .getTextureBits () .toString (4); // Textures for point and line.
      }

      return this [_depthShaders] .get (key) || this .createDepthShader (key, numClipPlanes, shapeNode, humanoidNode);
   },
   createDepthShader (key, numClipPlanes, shapeNode, humanoidNode)
   {
      const
         appearanceNode  = shapeNode .getAppearance (),
         geometryContext = shapeNode .getGeometryContext (),
         options         = [ ];

      if (numClipPlanes)
      {
         options .push ("X3D_CLIP_PLANES");
         options .push ("X3D_NUM_CLIP_PLANES " + numClipPlanes);
      }

      if (shapeNode .getShapeKey () > 0)
         options .push ("X3D_PARTICLE_SYSTEM");

      options .push (`X3D_GEOMETRY_${geometryContext .geometryType}D`);

      if (appearanceNode .getStyleProperties (geometryContext .geometryType))
         options .push ("X3D_STYLE_PROPERTIES");

      if (humanoidNode)
         options .push ("X3D_SKINNING");

      const shaderNode = this .createShader ("DepthShader", "Depth", "Depth", options);

      this [_depthShaders] .set (key, shaderNode);

      return shaderNode;
   },
   reshape ()
   {
      const
         $canvas      = this .getCanvas (),
         contentScale = this .getRenderingProperty ("ContentScale"),
         samples      = this .getRenderingProperty ("Multisampling"),
         oit          = this .getBrowserOption ("OrderIndependentTransparency"),
         width        = $canvas .width () * contentScale,
         height       = $canvas .height () * contentScale,
         canvas       = $canvas [0];

      canvas .width  = width;
      canvas .height = height;

      this [_viewport] [2] = width;
      this [_viewport] [3] = height;

      if (width   !== this [_frameBuffer] .getWidth ()   ||
          height  !== this [_frameBuffer] .getHeight ()  ||
          samples !== this [_frameBuffer] .getSamples () ||
          oit     !== this [_frameBuffer] .getOrderIndependentTransparency ())
      {
         this [_frameBuffer] .dispose ();
         this [_frameBuffer] = new MultiSampleFrameBuffer (this, width, height, samples, oit);
      }

      this .addBrowserEvent ();
   },
   onfullscreen ()
   {
      const element = this .getElement ();

      if (element .fullScreen ())
         element .addClass ("x_ite-fullscreen");
      else
         element .removeClass ("x_ite-fullscreen");
   },
});

export default X3DRenderingContext;
