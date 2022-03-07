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
   "jquery",
   "x_ite/Fields",
   "x_ite/Browser/Core/BrowserTimings",
   "x_ite/Browser/Core/BrowserOptions",
   "x_ite/Browser/Core/BrowserProperties",
   "x_ite/Browser/Core/RenderingProperties",
   "x_ite/Browser/Core/Notification",
   "x_ite/Browser/Core/ContextMenu",
   "x_ite/Execution/Scene",
   "x_ite/Parser/Parser",
   "standard/Utility/DataStorage",
   "standard/Math/Numbers/Vector3",
   "locale/gettext",
],
function ($,
          Fields,
          BrowserTimings,
          BrowserOptions,
          BrowserProperties,
          RenderingProperties,
          Notification,
          ContextMenu,
          Scene,
          Parser,
          DataStorage,
          Vector3,
          _)
{
"use strict";

   const WEBGL_LATEST_VERSION = 2;

   const extensions = [
      "ANGLE_instanced_arrays",
      "EXT_blend_minmax",
      "EXT_frag_depth",
      "EXT_shader_texture_lod",
      "EXT_texture_filter_anisotropic",
      "OES_element_index_uint",
      "OES_standard_derivatives",
      "OES_texture_float",
      "OES_texture_float_linear",
      "OES_texture_half_float",
      "OES_texture_half_float_linear",
      "OES_vertex_array_object",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_debug_renderer_info",
      "WEBGL_debug_shaders",
      "WEBGL_depth_texture",
      "WEBGL_draw_buffers",
      "WEBGL_lose_context",

      "EXT_color_buffer_float",
      "EXT_color_buffer_half_float",
      "EXT_disjoint_timer_query",
      "EXT_disjoint_timer_query_webgl2",
      "EXT_sRGB",
      "WEBGL_color_buffer_float",
      "WEBGL_compressed_texture_astc",
      "WEBGL_compressed_texture_atc",
      "WEBGL_compressed_texture_etc",
      "WEBGL_compressed_texture_etc1",
      "WEBGL_compressed_texture_pvrtc",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_compressed_texture_s3tc_srgb",

      "EXT_float_blend",
      "OES_fbo_render_mipmap",
      "WEBGL_get_buffer_sub_data_async",
      "WEBGL_multiview",
      "WEBGL_security_sensitive_resources",
      "WEBGL_shared_resources",

      "EXT_clip_cull_distance",
      "WEBGL_debug",
      "WEBGL_dynamic_texture",
      "WEBGL_subarray_uploads",
      "WEBGL_texture_multisample",
      "WEBGL_texture_source_iframe",
      "WEBGL_video_texture",

      "EXT_texture_storage",
      "OES_depth24",
      "WEBGL_debug_shader_precision",
      "WEBGL_draw_elements_no_range_check",
      "WEBGL_subscribe_uniform",
      "WEBGL_texture_from_depth_video",
   ];

   function getContext (canvas, version, preserveDrawingBuffer)
   {
      const options = { preserveDrawingBuffer: preserveDrawingBuffer };

      let gl = null;

      if (version >= 2 && ! gl)
      {
         gl = canvas .getContext ("webgl2", options);

         if (gl)
            gl .getVersion = function () { return 2; };
      }

      if (version >= 1 && ! gl)
      {
         gl = canvas .getContext ("webgl",              options) ||
              canvas .getContext ("experimental-webgl", options);

         if (gl)
            gl .getVersion = function () { return 1; };
      }

      if (! gl)
         throw new Error ("Couldn't create WebGL context.");

      // Feature detection:

      // If the aliased lineWidth ranges are both 1, gl.lineWidth is probably not possible,
      // thus we disable it completely to prevent webgl errors.

      const aliasedLineWidthRange = gl .getParameter (gl .ALIASED_LINE_WIDTH_RANGE);

      if (aliasedLineWidthRange [0] === 1 && aliasedLineWidthRange [1] === 1)
      {
         gl .lineWidth = Function .prototype;
      }

      // Return context.

      return gl;
   }

   const
      _number              = Symbol (),
      _element             = Symbol (),
      _splashScreen        = Symbol (),
      _surface             = Symbol (),
      _canvas              = Symbol (),
      _context             = Symbol (),
      _extensions          = Symbol (),
      _localStorage        = Symbol (),
      _mobile              = Symbol (),
      _browserTimings      = Symbol (),
      _browserOptions      = Symbol (),
      _browserProperties   = Symbol (),
      _renderingProperties = Symbol (),
      _notification        = Symbol (),
      _contextMenu         = Symbol (),
      _observer            = Symbol (),
      _privateScene        = Symbol (),
      _keydown             = Symbol (),
      _keyup               = Symbol ();

   let browserNumber = 0;

   function X3DCoreContext (element)
   {
      this [_number]  = ++ browserNumber;
      this [_element] = element;

      // Get canvas & context.

      const
          browser      = $("<div></div>") .addClass ("x_ite-private-browser x_ite-private-browser-" + this .getNumber ()) .prependTo (this [_element]),
         splashScreen = $("<div></div>") .addClass ("x_ite-private-splash-screen") .appendTo (browser),
         spinner      = $("<div></div>") .addClass ("x_ite-private-spinner") .appendTo (splashScreen),
         progress     = $("<div></div>") .addClass ("x_ite-private-progress") .appendTo (splashScreen),
         surface      = $("<div></div>") .addClass ("x_ite-private-surface") .appendTo (browser);

      $("<div></div>") .addClass ("x_ite-private-x_ite") .html ("X_ITE<span class='x_ite-private-x3d'>X3D</span>") .appendTo (progress);
      $("<div></div>") .addClass ("x_ite-private-progressbar")  .appendTo (progress) .append ($("<div></div>"));
      $("<div></div>") .addClass ("x_ite-private-spinner-text") .appendTo (progress);

      this [_splashScreen] = splashScreen;
      this [_surface]      = surface;
      this [_canvas]       = $("<canvas></canvas>") .addClass ("x_ite-private-canvas") .prependTo (surface);
      this [_context]      = getContext (this [_canvas] [0], WEBGL_LATEST_VERSION, element .attr ("preserveDrawingBuffer") === "true");
      this [_extensions]   = new Map ();

      const gl = this .getContext ();

      for (const extension of extensions)
      {
         this [_extensions] .set (extension, gl .getExtension (extension));
      }

      this [_localStorage] = new DataStorage (localStorage, "X_ITE.X3DBrowser(" + this [_number] + ").");
      this [_mobile]       = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i .test (navigator .userAgent);

      this [_browserTimings]      = new BrowserTimings      (this .getPrivateScene ());
      this [_browserOptions]      = new BrowserOptions      (this .getPrivateScene ());
      this [_browserProperties]   = new BrowserProperties   (this .getPrivateScene ());
      this [_renderingProperties] = new RenderingProperties (this .getPrivateScene ());
      this [_notification]        = new Notification        (this .getPrivateScene ());
      this [_contextMenu]         = new ContextMenu         (this .getPrivateScene ());

      $(".x_ite-console") .empty ();

      this .addChildObjects ("controlKey",  new Fields .SFBool (),
                             "shiftKey",    new Fields .SFBool (),
                             "altKey",      new Fields .SFBool (),
                             "altGrKey",    new Fields .SFBool ());
   }

   X3DCoreContext .prototype =
   {
      initialize: function ()
      {
         // Setup browser nodes.

         this [_browserTimings]      .setup ();
         this [_browserOptions]      .setup ()
         this [_browserProperties]   .setup ()
         this [_renderingProperties] .setup ();
         this [_notification]        .setup ();
         this [_contextMenu]         .setup ();

         // Observe Element's attributes.

         this [_observer] = new MutationObserver (this .processMutations .bind (this));

         this [_observer] .observe (this [_element] [0], { attributes: true, childList: false, characterData: false, subtree: false });

         // Define src and url property.

         Object .defineProperty (this .getElement () .get (0), "src",
         {
            get: function ()
            {
               return this .getExecutionContext () .getWorldURL ();
            }
            .bind (this),
            set: function (value)
            {
               this .loadURL (new Fields .MFString (value), new Fields .MFString ());
            }
            .bind (this),
            enumerable: true,
            configurable: false,
         });

         Object .defineProperty (this .getElement () .get (0), "url",
         {
            get: function ()
            {
               const worldURL = this .getExecutionContext () .getWorldURL ();

               if (worldURL)
                  return new Fields .MFString (worldURL);
               else
                  return new Fields .MFString ();
            }
            .bind (this),
            set: function (value)
            {
               this .loadURL (value, new Fields .MFString ());
            }
            .bind (this),
            enumerable: true,
            configurable: false,
         });

         // Configure browser event handlers.

         this .setBrowserEventHandler ("onload");
         this .setBrowserEventHandler ("onshutdown");
         this .setBrowserEventHandler ("onerror");

         this .getElement () .bind ("keydown.X3DCoreContext", this [_keydown] .bind (this));
         this .getElement () .bind ("keyup.X3DCoreContext",   this [_keyup]   .bind (this));
      },
      getDebug: function ()
      {
         return this .getBrowserOptions () .getDebug ();
      },
      getNumber: function ()
      {
         return this [_number];
      },
      isStrict: function ()
      {
         return false;
      },
      getElement: function ()
      {
         return this [_element];
      },
      getSurface: function ()
      {
         return this [_surface];
      },
      getSplashScreen: function ()
      {
         return this [_splashScreen];
      },
      getCanvas: function ()
      {
         return this [_canvas];
      },
      getContext: function ()
      {
         return this [_context];
      },
      getExtension: function (name)
      {
         return this [_extensions] .get (name);
      },
      getMobile: function ()
      {
         return this [_mobile];
      },
      getLocalStorage: function ()
      {
         return this [_localStorage];
      },
      getBrowserTimings: function ()
      {
         return this [_browserTimings];
      },
      getBrowserOptions: function ()
      {
         return this [_browserOptions];
      },
      getBrowserProperties: function ()
      {
         return this [_browserProperties];
      },
      getRenderingProperties: function ()
      {
         return this [_renderingProperties];
      },
      getNotification: function ()
      {
         return this [_notification];
      },
      getContextMenu: function ()
      {
         return this [_contextMenu];
      },
      getPrivateScene: function ()
      {
         if (this [_privateScene])
            return this [_privateScene];

         // Scene for default nodes.

         this [_privateScene] = new Scene (this);

         this [_privateScene] .setPrivate (true);
         this [_privateScene] .setLive (true);
         this [_privateScene] .setup ();

         return this [_privateScene];
      },
      processMutations: function (mutations)
      {
         mutations .forEach (function (mutation)
         {
            this .processMutation (mutation);
         },
         this);
      },
      processMutation: function (mutation)
      {
         const element = mutation .target;

         switch (mutation .type)
         {
            case "attributes":
            {
               this .processAttribute (mutation, element);
               break;
            }
         }
      },
      processAttribute: function (mutation, element)
      {
         const attributeName = mutation .attributeName;

         switch (attributeName .toLowerCase ())
         {
            case "onerror":
            {
               this .setBrowserEventHandler ("onerror");
               break;
            }
            case "onload":
            {
               this .setBrowserEventHandler ("onload");
               break;
            }
            case "onshutdown":
            {
               this .setBrowserEventHandler ("onshutdown");
               break;
            }
            case "splashscreen":
            {
               this .getBrowserOptions () .setAttributeSplashScreen ();
               break;
            }
            case "src":
            {
               const urlCharacters = this .getElement () .attr ("src");

               this .load ('"' + urlCharacters + '"');
               break;
            }
            case "url":
            {
               this .load (this .getElement () .attr ("url"));
               break;
            }
         }
      },
      load: function (urlCharacters)
      {
         if (urlCharacters)
         {
            const
               parser    = new Parser (this .getExecutionContext ()),
               url       = new Fields .MFString (),
               parameter = new Fields .MFString ();

            parser .setInput (urlCharacters);
            parser .sfstringValues (url);

            if (url .length)
               this .loadURL (url, parameter);
         }
         else
         {
            if (! this .getLoading ())
               this .getCanvas () .fadeIn (0);
         }
      },
      setBrowserEventHandler: function (name)
      {
         const
            element      = this .getElement () .get (0),
            browserEvent = this .getElement () .attr (name);

         if (browserEvent)
            element [name] = new Function (browserEvent);
         else
            element [name] = Function .prototype;
      },
      callBrowserEventHandler: function (name)
      {
         const
            element             = this .getElement () .get (0),
            browserEventHandler = element [name];

         if (window .jQuery)
            window .jQuery (element) .trigger (name .substr (2));

         else if (browserEventHandler)
            browserEventHandler .call (element);
      },
      getShiftKey: function ()
      {
         return this ._shiftKey .getValue ();
      },
      getControlKey: function ()
      {
         return this ._controlKey .getValue ();
      },
      getAltKey: function ()
      {
         return this ._altKey .getValue ();
      },
      getAltGrKey: function ()
      {
         return this ._altGrKey .getValue ();
      },
      [_keydown]: function (event)
      {
         //console .log (event .keyCode);

         switch (event .keyCode)
         {
            case 16: // Shift
            {
               this ._shiftKey = true;
               break;
            }
            case 17: // Ctrl
            {
               this ._controlKey = true;
               break;
            }
            case 18: // Alt
            {
               this ._altKey = true;
               break;
            }
            case 37: // Left
            case 38: // Up
            case 39: // Right
            case 40: // Down
            {
               // Prevent bug in Firefox that event loop is broken when pressing these keys.
               this .requestAnimationFrame ();
               break;
            }
            case 49: // 1
            {
               if (this .getDebug ())
               {
                  if (this .getControlKey ())
                  {
                     event .preventDefault ();
                     this .setBrowserOption ("Shading", "POINT");
                     this .getNotification () ._string = "Shading: Pointset";
                  }
               }

               break;
            }
            case 50: // 2
            {
               if (this .getDebug ())
               {
                  if (this .getControlKey ())
                  {
                     event .preventDefault ();
                     this .setBrowserOption ("Shading", "WIREFRAME");
                     this .getNotification () ._string = "Shading: Wireframe";
                  }
               }

               break;
            }
            case 51: // 3
            {
               if (this .getDebug ())
               {
                  if (this .getControlKey ())
                  {
                     event .preventDefault ();
                     this .setBrowserOption ("Shading", "FLAT");
                     this .getNotification () ._string = "Shading: Flat";
                  }
               }

               break;
            }
            case 52: // 4
            {
               if (this .getDebug ())
               {
                  if (this .getControlKey ())
                  {
                     event .preventDefault ();
                     this .setBrowserOption ("Shading", "GOURAUD");
                     this .getNotification () ._string = "Shading: Gouraud";
                  }
               }

               break;
            }
            case 53: // 5
            {
               if (this .getDebug ())
               {
                  if (this .getControlKey ())
                  {
                     event .preventDefault ();
                     this .setBrowserOption ("Shading", "PHONG");
                     this .getNotification () ._string = "Shading: Phong";
                  }
               }

               break;
            }
            case 83: // s
            {
               if (this .getDebug ())
               {
                  if (this .getControlKey ())
                  {
                     event .preventDefault ();

                     if (this .isLive () .getValue ())
                        this .endUpdate ();
                     else
                        this .beginUpdate ();

                     this .getNotification () ._string = this .isLive () .getValue () ? "Begin Update" : "End Update";
                  }
               }

               break;
            }
            case 225: // Alt Gr
            {
               this ._altGrKey = true;
               break;
            }
            case 171: // Plus // Firefox
            case 187: // Plus // Opera
            {
               if (this .getControlKey ())
               {
                  event .preventDefault ();
                  this .setBrowserOption ("Timings", !this .getBrowserOption ("Timings"));
               }

               break;
            }
            case 36: // Pos 1
            {
               event .preventDefault ();
               this .firstViewpoint ();
               break;
            }
            case 35: // End
            {
               event .preventDefault ();
               this .lastViewpoint ();
               break;
            }
            case 33: // Page Up
            {
               event .preventDefault ();
               this .previousViewpoint ();
               break;
            }
            case 34: // Page Down
            {
               event .preventDefault ();
               this .nextViewpoint ();
               break;
            }
            case 119: // F8
            {
               if (this .getShiftKey ())
               {
                  event .preventDefault ();

                  const viewpoint = this .getActiveViewpoint ();

                  if (!viewpoint)
                     break;

                  const vp = this .getPrivateScene () .createNode (viewpoint .getTypeName ());

                  switch (viewpoint .getTypeName ())
                  {
                     case "Viewpoint":
                     {
                        vp .position         = viewpoint .getUserPosition ();
                        vp .orientation      = viewpoint .getUserOrientation ();
                        vp .centerOfRotation = viewpoint .getUserCenterOfRotation ();
                        vp .fieldOfView      = viewpoint .getFieldOfView ();
                        break;
                     }
                     case "OrthoViewpoint":
                     {
                        vp .position         = viewpoint .getUserPosition ();
                        vp .orientation      = viewpoint .getUserOrientation ();
                        vp .centerOfRotation = viewpoint .getUserCenterOfRotation ();
                        vp .fieldOfView      = new Fields .MFFloat (viewpoint .getMinimumX (), viewpoint .getMinimumY (), viewpoint .getMaximumX (), viewpoint .getMaximumY ());
                        break;
                     }
                     case "GeoViewpoint":
                     {
                        const
                           geoOrigin = viewpoint ._geoOrigin,
                           geoCoord  = new Vector3 (0, 0, 0);

                        if (geoOrigin .getValue () && geoOrigin .getNodeTypeName () === "GeoOrigin")
                        {
                           const go = this .getPrivateScene () .createNode ("GeoOrigin");

                           vp .geoOrigin = go;
                           go .geoSystem = geoOrigin .geoSystem;
                           go .geoCoords = geoOrigin .geoCoords;
                           go .rotateYUp = geoOrigin .rotateYUp;
                        }

                        vp .geoSystem        = viewpoint ._geoSystem;
                        vp .position         = viewpoint .getGeoCoord (viewpoint .getUserPosition (), geoCoord);
                        vp .orientation      = viewpoint .getUserOrientation ();
                        vp .centerOfRotation = viewpoint .getGeoCoord (viewpoint .getUserCenterOfRotation (), geoCoord);
                        vp .fieldOfView      = viewpoint .getFieldOfView ();
                        break;
                     }
                  }

                  let text;

                  switch (this .getExecutionContext () .getEncoding ())
                  {
                     case "ASCII":
                     case "VRML": text = vp .toVRMLString (); break;
                     case "JSON": text = vp .toVRMLString (); break;
                     default:     text = vp .toXMLString ();  break;
                  }

                  text += "\n";

                  console .log (text);
                  this .copyToClipboard (text);
                  this .getNotification () ._string = _ ("Viewpoint is copied to clipboard.");
               }

               break;
            }
         }
      },
      [_keyup]: function (event)
      {
         //console .log (event .which);

         switch (event .which)
         {
            case 16: // Shift
            {
               this ._shiftKey = false;
               break;
            }
            case 17: // Ctrl
            {
               this ._controlKey = false;
               break;
            }
            case 18: // Alt
            {
               this ._altKey = false;
               break;
            }
            case 37: // Left
            case 38: // Up
            case 39: // Right
            case 40: // Down
            {
               // Prevent bug in Firefox that event loop is broken when pressing these keys.
               this .requestAnimationFrame ();
               break;
            }
            case 225: // Alt Gr
            {
               this ._altGrKey = false;
               break;
            }
         }
      },
      copyToClipboard: function (text)
      {
         // The textarea must be visible to make copy work.
         const $temp = $("<textarea></textarea>");
         this .getElement () .find (".x_ite-private-browser") .prepend ($temp);
         $temp .text (text) .select ();
         document .execCommand ("copy");
         $temp .remove ();
      },
   };

   return X3DCoreContext;
});
