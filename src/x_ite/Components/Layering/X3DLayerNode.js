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

import Fields          from "../../Fields.js";
import X3DNode         from "../Core/X3DNode.js";
import X3DRenderObject from "../../Rendering/X3DRenderObject.js";
import BindableStack   from "../../Execution/BindableStack.js";
import BindableList    from "../../Execution/BindableList.js";
import NavigationInfo  from "../Navigation/NavigationInfo.js";
import Fog             from "../EnvironmentalEffects/Fog.js";
import Background      from "../EnvironmentalEffects/Background.js";
import X3DCast         from "../../Base/X3DCast.js";
import TraverseType    from "../../Rendering/TraverseType.js";
import X3DConstants    from "../../Base/X3DConstants.js";
import Camera          from "../../../standard/Math/Geometry/Camera.js";
import Box3            from "../../../standard/Math/Geometry/Box3.js";
import Matrix4         from "../../../standard/Math/Numbers/Matrix4.js";

function X3DLayerNode (executionContext, defaultViewpoint, groupNode)
{
   X3DNode         .call (this, executionContext);
   X3DRenderObject .call (this, executionContext);

   this .addType (X3DConstants .X3DLayerNode);

   this .addChildObjects (X3DConstants .inputOutput, "hidden",  new Fields .SFBool (),
                          X3DConstants .outputOnly,  "display", new Fields .SFBool (true));

   if (executionContext .getSpecificationVersion () <= 3.3)
      this .addAlias ("isPickable", this ._pickable);

   this .groupNode    = groupNode;
   this .viewportNode = null;

   this .defaultNavigationInfo = new NavigationInfo (executionContext);
   this .defaultViewpoint      = defaultViewpoint;
   this .defaultBackground     = new Background (executionContext);
   this .defaultFog            = new Fog (executionContext);

   this .navigationInfoStack = new BindableStack (executionContext, this .defaultNavigationInfo);
   this .viewpointStack      = new BindableStack (executionContext, this .defaultViewpoint);
   this .backgroundStack     = new BindableStack (executionContext, this .defaultBackground);
   this .fogStack            = new BindableStack (executionContext, this .defaultFog);

   this .navigationInfos = new BindableList (executionContext, this .defaultNavigationInfo);
   this .viewpoints      = new BindableList (executionContext, this .defaultViewpoint);
   this .backgrounds     = new BindableList (executionContext, this .defaultBackground);
   this .fogs            = new BindableList (executionContext, this .defaultFog);

   this .defaultBackground .setHidden (true);
   this .defaultFog        .setHidden (true);
}

Object .assign (Object .setPrototypeOf (X3DLayerNode .prototype, X3DNode .prototype),
   X3DRenderObject .prototype,
{
   layer0: false,
   initialize ()
   {
      X3DNode         .prototype .initialize .call (this);
      X3DRenderObject .prototype .initialize .call (this);

      this .defaultNavigationInfo .setup ();
      this .defaultViewpoint      .setup ();
      this .defaultBackground     .setup ();
      this .defaultFog            .setup ();

      this .navigationInfoStack .setup ();
      this .viewpointStack      .setup ();
      this .backgroundStack     .setup ();
      this .fogStack            .setup ();

      this .navigationInfos .setup ();
      this .viewpoints      .setup ();
      this .backgrounds     .setup ();
      this .fogs            .setup ();

      this ._hidden   .addInterest ("set_visible_and_hidden__", this);
      this ._visible  .addInterest ("set_visible_and_hidden__", this);
      this ._viewport .addInterest ("set_viewport__",           this);

      this .set_visible_and_hidden__ ();
      this .set_viewport__ ();
   },
   isHidden ()
   {
      return this ._hidden .getValue ();
   },
   setHidden (value)
   {
      if (value === this ._hidden .getValue ())
         return;

      this ._hidden = value;
   },
   getBBox (bbox, shadows)
   {
      return this .groupNode .getBBox (bbox, shadows);
   },
   setLayer0 (value)
   {
      this .layer0 = value;
      this .defaultBackground .setHidden (!value);
   },
   getLayer ()
   {
      return this;
   },
   getGroup ()
   {
      return this .groupNode;
   },
   getViewport ()
   {
      return this .viewportNode;
   },
   getBackground ()
   {
      return this .backgroundStack .top ();
   },
   getFog ()
   {
      return this .fogStack .top ();
   },
   getNavigationInfo ()
   {
      return this .navigationInfoStack .top ();
   },
   getViewpoint ()
   {
      return this .viewpointStack .top ();
   },
   getBackgrounds ()
   {
      return this .backgrounds;
   },
   getFogs ()
   {
      return this .fogs;
   },
   getNavigationInfos ()
   {
      return this .navigationInfos;
   },
   getViewpoints ()
   {
      return this .viewpoints;
   },
   getUserViewpoints ()
   {
      const userViewpoints = [ ];

      for (const viewpointNode of this .viewpoints .get ())
      {
         if (viewpointNode ._description .length)
            userViewpoints .push (viewpointNode);
      }

      return userViewpoints;
   },
   getBackgroundStack ()
   {
      return this .backgroundStack;
   },
   getFogStack ()
   {
      return this .fogStack;
   },
   getNavigationInfoStack ()
   {
      return this .navigationInfoStack;
   },
   getViewpointStack ()
   {
      return this .viewpointStack;
   },
   getCollisionTime ()
   {
      return this .collisionTime;
   },
   viewAll (transitionTime = 1, factor = 1, straighten = false)
   {
      const
         viewpointNode = this .getViewpoint (),
         bbox          = this .getBBox (new Box3 ()) .multRight (viewpointNode .getModelMatrix () .copy () .inverse ());

      viewpointNode .lookAt (this, bbox .center, viewpointNode .getLookAtDistance (bbox), transitionTime, factor, straighten);
   },
   straightenView ()
   {
      this .getViewpoint () .straightenView (this);
   },
   set_visible_and_hidden__ ()
   {
      const value = this ._visible .getValue () && !this ._hidden .getValue ();

      if (value === this ._display .getValue ())
         return;

      this ._display = value;
   },
   set_viewport__ ()
   {
      this .viewportNode = X3DCast (X3DConstants .X3DViewportNode, this ._viewport);

      if (!this .viewportNode)
         this .viewportNode = this .getBrowser () .getDefaultViewport ();
   },
   bindBindables (viewpointName)
   {
      this .traverse (TraverseType .CAMERA, this);

      // Bind first viewpoint in viewpoint list.

      const
         navigationInfoNode = this .navigationInfos .getBound (),
         backgroundNode     = this .backgrounds     .getBound (),
         fogNode            = this .fogs            .getBound (),
         viewpointNode      = this .viewpoints      .getBound (viewpointName);

      this .navigationInfoStack .pushOnTop (navigationInfoNode);
      this .viewpointStack      .pushOnTop (viewpointNode);
      this .backgroundStack     .pushOnTop (backgroundNode);
      this .fogStack            .pushOnTop (fogNode);

      viewpointNode .resetUserOffsets ();

      if (viewpointNode ._viewAll .getValue ())
         viewpointNode .viewAll (this .getBBox (new Box3 ()));
   },
   traverse (type, renderObject = this)
   {
      const viewpointNode = this .getViewpoint ();

      this .getProjectionMatrix ()  .pushMatrix (viewpointNode .getProjectionMatrix (this));
      this .getCameraSpaceMatrix () .pushMatrix (viewpointNode .getCameraSpaceMatrix ());
      this .getViewMatrix ()        .pushMatrix (viewpointNode .getViewMatrix ());

      switch (type)
      {
         case TraverseType .POINTER:
            this .pointer (type, renderObject);
            break;
         case TraverseType .CAMERA:
            this .camera (type, renderObject);
            break;
         case TraverseType .PICKING:
            this .picking (type, renderObject);
            break;
         case TraverseType .COLLISION:
            this .collision (type, renderObject);
            break;
         case TraverseType .SHADOW:
         case TraverseType .DISPLAY:
            this .display (type, renderObject);
            break;
      }

      this .getViewMatrix ()        .pop ();
      this .getCameraSpaceMatrix () .pop ();
      this .getProjectionMatrix ()  .pop ();
   },
   pointer (type, renderObject)
   {
      const
         browser  = this .getBrowser (),
         viewport = this .viewportNode .getRectangle ();

      if (browser .getPointingLayer ())
      {
         if (browser .getPointingLayer () !== this)
            return;
      }
      else
      {
         if (!browser .isPointerInRectangle (viewport))
            return;
      }

      this .setHitRay (this .getProjectionMatrix () .get (), viewport, browser .getPointer ());
      this .getNavigationInfo () .enable (type, renderObject);
      this .getModelViewMatrix () .pushMatrix (this .getViewMatrix () .get ());

      this .viewportNode .push (this);
      renderObject .render (type, this .groupNode .traverse, this .groupNode);
      this .viewportNode .pop (this);

      this .getModelViewMatrix () .pop ();
   },
   camera (type, renderObject)
   {
      if (this ._display .getValue ())
      {
         this .getModelViewMatrix () .pushMatrix (Matrix4 .Identity);

         this .viewportNode .push (this);
         this .groupNode .traverse (type, renderObject);
         this .viewportNode .pop (this);

         this .getModelViewMatrix () .pop ();

         this .navigationInfos .update (this, this .navigationInfoStack);
         this .viewpoints      .update (this, this .viewpointStack);
         this .backgrounds     .update (this, this .backgroundStack);
         this .fogs            .update (this, this .fogStack);

         this .getViewpoint () .update ();
      }
   },
   picking (type, renderObject)
   {
      if (this ._pickable .getValue ())
      {
         this .getModelViewMatrix () .pushMatrix (Matrix4 .Identity);

         this .viewportNode .push (this);
         this .groupNode .traverse (type, renderObject);
         this .viewportNode .pop (this);

         this .getModelViewMatrix () .pop ();
      }
   },
   collision: (() =>
   {
      const projectionMatrix = new Matrix4 ();

      return function (type, renderObject)
      {
         if (this ._display .getValue ())
         {
            const navigationInfo = this .getNavigationInfo ();

            if (navigationInfo ._transitionActive .getValue ())
               return;

            const
               collisionRadius = navigationInfo .getCollisionRadius (),
               avatarHeight    = navigationInfo .getAvatarHeight (),
               size            = Math .max (collisionRadius * 2, avatarHeight * 2);

            Camera .ortho (-size, size, -size, size, -size, size, projectionMatrix);

            this .getProjectionMatrix () .pushMatrix (projectionMatrix);
            this .getModelViewMatrix  () .pushMatrix (this .getViewMatrix () .get ());

            // Render
            this .viewportNode .push (this);
            renderObject .render (type, this .groupNode .traverse, this .groupNode);
            this .viewportNode .pop (this);

            this .getModelViewMatrix  () .pop ();
            this .getProjectionMatrix () .pop ();
         }
      };
   })(),
   display (type, renderObject)
   {
      if (this ._display .getValue ())
      {
         this .getNavigationInfo () .enable (type, renderObject);
         this .getModelViewMatrix () .pushMatrix (this .getViewMatrix () .get ());

         this .viewportNode .push (this);
         renderObject .render (type, this .groupNode .traverse, this .groupNode);
         this .viewportNode .pop (this);

         this .getModelViewMatrix () .pop ();
      }
   },
});

Object .defineProperties (X3DLayerNode,
{
   typeName:
   {
      value: "X3DLayerNode",
      enumerable: true,
   },
   componentName:
   {
      value: "Layering",
      enumerable: true,
   },
});

export default X3DLayerNode;
