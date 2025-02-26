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

import X3DChildNode     from "../Core/X3DChildNode.js";
import X3DBoundedObject from "./X3DBoundedObject.js";
import TraverseType     from "../../Rendering/TraverseType.js";
import X3DConstants     from "../../Base/X3DConstants.js";
import X3DCast          from "../../Base/X3DCast.js";

function X3DGroupingNode (executionContext)
{
   X3DChildNode     .call (this, executionContext);
   X3DBoundedObject .call (this, executionContext);

   this .addType (X3DConstants .X3DGroupingNode);

   this .allowedTypes              = new Set ();
   this .clipPlaneNodes            = [ ];
   this .localFogNodes             = [ ];
   this .lightNodes                = [ ];
   this .textureProjectorNodes     = [ ];
   this .pointingDeviceSensorNodes = [ ];
   this .maybeCameraObjects        = [ ];
   this .cameraObjects             = [ ];
   this .maybePickableSensorNodes  = [ ];
   this .pickableSensorNodes       = [ ];
   this .pickableObjects           = [ ];
   this .childNodes                = [ ];
   this .displayNodes              = [ ];
   this .visibleNodes              = [ ];
   this .boundedObjects            = [ ];
   this .sensors                   = [ ];
}

Object .assign (Object .setPrototypeOf (X3DGroupingNode .prototype, X3DChildNode .prototype),
   X3DBoundedObject .prototype,
{
   initialize ()
   {
      X3DChildNode     .prototype .initialize .call (this);
      X3DBoundedObject .prototype .initialize .call (this);

      this ._transformSensors_changed .addInterest ("set_transformSensors__", this);

      this ._addChildren    .addInterest ("set_addChildren__",    this);
      this ._removeChildren .addInterest ("set_removeChildren__", this);
      this ._children       .addInterest ("set_children__",       this);

      this .set_children__ ();
   },
   getBBox (bbox, shadows)
   {
      return this .getSubBBox (bbox, shadows);
   },
   getSubBBox (bbox, shadows)
   {
      if (this ._bboxSize .getValue () .equals (this .getDefaultBBoxSize ()))
         return X3DBoundedObject .prototype .getBBox .call (this, this .visibleNodes, bbox, shadows);

      return bbox .set (this ._bboxSize .getValue (), this ._bboxCenter .getValue ());
   },
   setAllowedTypes (/* type, ... */)
   {
      const allowedTypes = this .allowedTypes;

      allowedTypes .clear ();

      for (const type of arguments)
         allowedTypes .add (type);
   },
   set_addChildren__ ()
   {
      if (this ._addChildren .length === 0)
         return;

      this ._addChildren .setTainted (true);
      this ._addChildren .assign (filter (this ._addChildren, this ._children));

      if (!this ._children .isTainted ())
      {
         this ._children .removeInterest ("set_children__", this);
         this ._children .addInterest ("connectChildren", this);
      }

      this ._children .splice (this ._children .length, 0, ... this ._addChildren);
      this .add (this ._addChildren);

      this ._addChildren .length = 0;
      this ._addChildren .setTainted (false);
   },
   set_removeChildren__ ()
   {
      if (this ._removeChildren .length === 0)
         return;

      this ._removeChildren .setTainted (true);

      if (this ._children .length > 0)
      {
         if (!this ._children .isTainted ())
         {
            this ._children .removeInterest ("set_children__", this);
            this ._children .addInterest ("connectChildren", this);
         }

         this ._children .assign (filter (this ._children, this ._removeChildren));
         this .remove (this ._removeChildren);
      }

      this ._removeChildren .length = 0;
      this ._removeChildren .setTainted (false);
   },
   set_children__ ()
   {
      this .clear ();
      this .add (this ._children);
   },
   connectChildren ()
   {
      this ._children .removeInterest ("connectChildren", this);
      this ._children .addInterest ("set_children__", this);
   },
   clear ()
   {
      for (const maybePickableSensorNode of this .maybePickableSensorNodes)
         maybePickableSensorNode ._isPickableObject .removeInterest ("set_pickableObjects__", this);

      for (const childNode of this .childNodes)
      {
         childNode ._isCameraObject   .removeInterest ("set_cameraObjects__",   this);
         childNode ._isPickableObject .removeInterest ("set_pickableObjects__", this);

         if (X3DCast (X3DConstants .X3DBoundedObject, childNode))
         {
            childNode ._display     .removeInterest ("set_displays_",     this);
            childNode ._bboxDisplay .removeInterest ("set_bboxDisplays__", this);
         }
      }

      this .clipPlaneNodes            .length = 0;
      this .localFogNodes             .length = 0;
      this .lightNodes                .length = 0;
      this .textureProjectorNodes     .length = 0;
      this .pointingDeviceSensorNodes .length = 0;
      this .maybeCameraObjects        .length = 0;
      this .maybePickableSensorNodes  .length = 0;
      this .childNodes                .length = 0;
   },
   add (children)
   {
      for (const child of children)
      {
         const childNode = X3DCast (X3DConstants .X3DChildNode, child);

         if (!childNode)
            continue;

         const type = childNode .getType ();

         for (let t = type .length - 1; t >= 0; -- t)
         {
            // if (this .allowedTypes .size)
            // {
            //    if (!childNode .getType () .some (Set .prototype .has, this .allowedTypes))
            //       continue;
            // }

            switch (type [t])
            {
               case X3DConstants .X3DPointingDeviceSensorNode:
               {
                  this .pointingDeviceSensorNodes .push (childNode);
                  break;
               }
               case X3DConstants .ClipPlane:
               {
                  this .clipPlaneNodes .push (childNode);
                  break;
               }
               case X3DConstants .LocalFog:
               {
                  this .localFogNodes .push (childNode);
                  break;
               }
               case X3DConstants .X3DTextureProjectorNode:
               {
                  this .textureProjectorNodes .push (childNode);
                  break;
               }
               case X3DConstants .X3DLightNode:
               {
                  this .lightNodes .push (childNode);
                  break;
               }
               case X3DConstants .X3DBindableNode:
               {
                  this .maybeCameraObjects .push (childNode);
                  break;
               }
               case X3DConstants .TransformSensor:
               case X3DConstants .X3DPickSensorNode:
               {
                  childNode ._isPickableObject .addInterest ("set_pickableObjects__", this);

                  this .maybePickableSensorNodes .push (childNode);
                  break;
               }
               case X3DConstants .Sound:
               case X3DConstants .SpatialSound:
               case X3DConstants .X3DBackgroundNode:
               case X3DConstants .X3DChildNode:
               {
                  childNode ._isCameraObject   .addInterest ("set_cameraObjects__",   this);
                  childNode ._isPickableObject .addInterest ("set_pickableObjects__", this);

                  if (X3DCast (X3DConstants .X3DBoundedObject, childNode))
                  {
                     childNode ._display     .addInterest ("set_displays_",     this);
                     childNode ._bboxDisplay .addInterest ("set_bboxDisplays__", this);
                  }

                  this .maybeCameraObjects .push (childNode);
                  this .childNodes .push (childNode);
                  break;
               }
               case X3DConstants .BooleanFilter:
               case X3DConstants .BooleanToggle:
               case X3DConstants .HAnimMotion:
               case X3DConstants .NurbsOrientationInterpolator:
               case X3DConstants .NurbsPositionInterpolator:
               case X3DConstants .NurbsSurfaceInterpolator:
               case X3DConstants .TimeSensor:
               case X3DConstants .X3DFollowerNode:
               case X3DConstants .X3DInfoNode:
               case X3DConstants .X3DInterpolatorNode:
               case X3DConstants .X3DKeyDeviceSensorNode:
               case X3DConstants .X3DLayoutNode:
               case X3DConstants .X3DScriptNode:
               case X3DConstants .X3DSequencerNode:
               case X3DConstants .X3DSoundNode:
               case X3DConstants .X3DTriggerNode:
                  break;
               default:
                  continue;
            }

            break;
         }

         if (childNode .getMustDisplay ())
         {
            if (!this .childNodes .includes (childNode))
               this .childNodes .push (childNode);
         }
      }

      this .set_pickableObjects__ ()
      this .set_displayNodes__ ()
      this .set_displays_ ()
      this .set_bboxDisplays__ ();
   },
   remove (children)
   {
      for (const child of children)
      {
         const childNode = X3DCast (X3DConstants .X3DChildNode, child);

         if (!childNode)
            continue;

         if (childNode .getMustDisplay ())
         {
            const index = this .childNodes .indexOf (childNode);

            if (index >= 0)
               this .childNodes .splice (index, 1);
         }

         const type = childNode .getType ();

         for (let t = type .length - 1; t >= 0; -- t)
         {
            switch (type [t])
            {
               case X3DConstants .X3DPointingDeviceSensorNode:
               {
                  const index = this .pointingDeviceSensorNodes .indexOf (childNode);

                  if (index >= 0)
                     this .pointingDeviceSensorNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .ClipPlane:
               {
                  const index = this .clipPlaneNodes .indexOf (childNode);

                  if (index >= 0)
                     this .clipPlaneNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .LocalFog:
               {
                  const index = this .localFogNodes .indexOf (childNode);

                  if (index >= 0)
                     this .localFogNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .X3DTextureProjectorNode:
               {
                  const index = this .textureProjectorNodes .indexOf (childNode);

                  if (index >= 0)
                     this .textureProjectorNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .X3DLightNode:
               {
                  const index = this .lightNodes .indexOf (childNode);

                  if (index >= 0)
                     this .lightNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .X3DBindableNode:
               {
                  const index = this .maybeCameraObjects .indexOf (childNode);

                  if (index >= 0)
                     this .maybeCameraObjects .splice (index, 1);

                  break;
               }
               case X3DConstants .TransformSensor:
               case X3DConstants .X3DPickSensorNode:
               {
                  childNode ._isPickableObject .removeInterest ("set_pickableObjects__", this);

                  const index = this .maybePickableSensorNodes .indexOf (childNode);

                  if (index >= 0)
                     this .maybePickableSensorNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .Sound:
               case X3DConstants .SpatialSound:
               case X3DConstants .X3DBackgroundNode:
               case X3DConstants .X3DChildNode:
               {
                  childNode ._isCameraObject   .removeInterest ("set_cameraObjects__",   this);
                  childNode ._isPickableObject .removeInterest ("set_pickableObjects__", this);

                  if (X3DCast (X3DConstants .X3DBoundedObject, childNode))
                  {
                     childNode ._display     .removeInterest ("set_displays_",     this);
                     childNode ._bboxDisplay .removeInterest ("set_bboxDisplays__", this);
                  }

                  var index = this .maybeCameraObjects .indexOf (childNode);

                  if (index >= 0)
                     this .maybeCameraObjects .splice (index, 1);

                  var index = this .childNodes .indexOf (childNode);

                  if (index >= 0)
                     this .childNodes .splice (index, 1);

                  break;
               }
               case X3DConstants .BooleanFilter:
               case X3DConstants .BooleanToggle:
               case X3DConstants .HAnimMotion:
               case X3DConstants .NurbsOrientationInterpolator:
               case X3DConstants .NurbsPositionInterpolator:
               case X3DConstants .NurbsSurfaceInterpolator:
               case X3DConstants .TimeSensor:
               case X3DConstants .X3DFollowerNode:
               case X3DConstants .X3DInfoNode:
               case X3DConstants .X3DInterpolatorNode:
               case X3DConstants .X3DKeyDeviceSensorNode:
               case X3DConstants .X3DLayoutNode:
               case X3DConstants .X3DScriptNode:
               case X3DConstants .X3DSequencerNode:
               case X3DConstants .X3DSoundNode:
               case X3DConstants .X3DTriggerNode:
                  break;
               default:
                  continue;
            }

            break;
         }
      }

      this .set_displayNodes__ ();
      this .set_displays_ ();
      this .set_bboxDisplays__ ();
   },
   set_cameraObjects__ ()
   {
      const cameraObjects = this .cameraObjects;

      cameraObjects .length = 0;

      for (const childNode of this .maybeCameraObjects)
      {
         if (!childNode .isCameraObject ())
            continue;

         if (X3DCast (X3DConstants .X3DBoundedObject, childNode))
         {
            if (childNode ._display .getValue ())
               cameraObjects .push (childNode);
         }
         else
         {
            cameraObjects .push (childNode);
         }
      }

      this .setCameraObject (!!(cameraObjects .length));
   },
   set_pickableObjects__ ()
   {
      const
         pickableSensorNodes = this .pickableSensorNodes,
         pickableObjects     = this .pickableObjects;

      pickableSensorNodes .length = 0;
      pickableObjects     .length = 0;

      for (const sensorNode of this .maybePickableSensorNodes)
      {
         if (sensorNode .isPickableObject ())
            pickableSensorNodes .push (sensorNode);
      }

      for (const childNode of this .visibleNodes)
      {
         if (childNode .isPickableObject ())
            pickableObjects .push (childNode);
      }

      this .set_transformSensors__ ()
   },
   set_transformSensors__ ()
   {
      this .setPickableObject (!!(this .getTransformSensors () .size || this .pickableSensorNodes .length || this .pickableObjects .length));
   },
   set_displayNodes__ ()
   {
      const displayNodes = this .displayNodes;

      displayNodes .length = 0;

      for (const node of this .clipPlaneNodes)
         displayNodes .push (node);

      for (const node of this .localFogNodes)
         displayNodes .push (node);

      for (const node of this .lightNodes)
         displayNodes .push (node);

      for (const node of this .textureProjectorNodes)
         displayNodes .push (node);
   },
   set_displays_ ()
   {
      const visibleNodes = this .visibleNodes;

      visibleNodes .length = 0;

      for (const childNode of this .childNodes)
      {
         if (X3DCast (X3DConstants .X3DBoundedObject, childNode))
         {
            if (childNode ._display .getValue ())
               visibleNodes .push (childNode);
         }
         else
         {
            visibleNodes .push (childNode);
         }
      }

      this .set_cameraObjects__ ();
      this .set_pickableObjects__ ();
   },
   set_bboxDisplays__ ()
   {
      const boundedObjects = this .boundedObjects;

      boundedObjects .length = 0;

      for (const childNode of this .childNodes)
      {
         if (X3DCast (X3DConstants .X3DBoundedObject, childNode))
         {
            if (childNode ._bboxDisplay .getValue ())
            {
               boundedObjects .push (childNode);
            }
         }
      }
   },
   traverse (type, renderObject)
   {
      switch (type)
      {
         case TraverseType .POINTER:
         {
            const
               pointingDeviceSensorNodes = this .pointingDeviceSensorNodes,
               clipPlaneNodes            = this .clipPlaneNodes,
               sensors                   = this .sensors;

            sensors .length = 0;

            if (pointingDeviceSensorNodes .length)
            {
               for (const pointingDeviceSensorNode of pointingDeviceSensorNodes)
                  pointingDeviceSensorNode .push (renderObject, sensors);

               if (sensors .length)
                  renderObject .getSensors () .push (sensors);
            }

            for (const clipPlaneNode of clipPlaneNodes)
               clipPlaneNode .push (renderObject);

            for (const visibleNode of this .visibleNodes)
               visibleNode .traverse (type, renderObject);

            for (const clipPlaneNode of clipPlaneNodes)
               clipPlaneNode .pop (renderObject);

            if (sensors .length)
               renderObject .getSensors () .pop ();

            return;
         }
         case TraverseType .CAMERA:
         {
            for (const cameraObject of this .cameraObjects)
               cameraObject .traverse (type, renderObject);

            return;
         }
         case TraverseType .PICKING:
         {
            if (this .getTransformSensors () .size)
            {
               const modelMatrix = renderObject .getModelViewMatrix () .get ();

               for (const transformSensorNode of this .getTransformSensors ())
                  transformSensorNode .collect (modelMatrix);
            }

            for (const pickableSensorNode of this .pickableSensorNodes)
               pickableSensorNode .traverse (type, renderObject);

            const
               browser          = this .getBrowser (),
               pickingHierarchy = browser .getPickingHierarchy ();

            pickingHierarchy .push (this);

            if (browser .getPickable () .at (-1))
            {
               for (const visibleNode of this .visibleNodes)
                  visibleNode .traverse (type, renderObject);
            }
            else
            {
               for (const pickableObject of this .pickableObjects)
                  pickableObject .traverse (type, renderObject);
            }

            pickingHierarchy .pop ();
            return;
         }
         case TraverseType .COLLISION:
         {
            const clipPlaneNodes = this .clipPlaneNodes;

            for (const clipPlaneNode of clipPlaneNodes)
               clipPlaneNode .push (renderObject);

            for (const visibleNode of this .visibleNodes)
               visibleNode .traverse (type, renderObject);

            for (const clipPlaneNode of clipPlaneNodes)
               clipPlaneNode .pop (renderObject);

            return;
         }
         case TraverseType .SHADOW:
         {
            // Nodes that are not visible do not cast shadows.

            const clipPlaneNodes = this .clipPlaneNodes;

            for (const clipPlaneNode of clipPlaneNodes)
               clipPlaneNode .push (renderObject);

            for (const visibleNode of this .visibleNodes)
               visibleNode .traverse (type, renderObject);

            for (const clipPlaneNode of clipPlaneNodes)
               clipPlaneNode .push (renderObject);

            return;
         }
         case TraverseType .DISPLAY:
         {
            const displayNodes = this .displayNodes;

            for (const displayNode of displayNodes)
               displayNode .push (renderObject, this);

            for (const visibleNode of this .visibleNodes)
               visibleNode .traverse (type, renderObject);

            for (const boundedObject of this .boundedObjects)
               boundedObject .displayBBox (type, renderObject);

            for (const displayNode of displayNodes)
               displayNode .pop (renderObject);

            return;
         }
      }
   },
   dispose ()
   {
      X3DBoundedObject .prototype .dispose .call (this);
      X3DChildNode     .prototype .dispose .call (this);
   },
});

function filter (array, remove)
{
   const set = new Set (remove);

   return array .filter (value => !set .has (value));
}

Object .defineProperties (X3DGroupingNode,
{
   typeName:
   {
      value: "X3DGroupingNode",
      enumerable: true,
   },
   componentName:
   {
      value: "Grouping",
      enumerable: true,
   },
});

export default X3DGroupingNode;
