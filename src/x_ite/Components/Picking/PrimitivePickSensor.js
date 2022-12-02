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
import X3DPickSensorNode    from "./X3DPickSensorNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import IntersectionType     from "../../Browser/Picking/IntersectionType.js";
import VolumePicker         from "../../Browser/Picking/VolumePicker.js";
import Vector3              from "../../../standard/Math/Numbers/Vector3.js";
import Box3                 from "../../../standard/Math/Geometry/Box3.js";

function PrimitivePickSensor (executionContext)
{
   X3DPickSensorNode .call (this, executionContext);

   this .addType (X3DConstants .PrimitivePickSensor);

   this .pickingGeometryNode = null;
   this .picker              = new VolumePicker ();
}

PrimitivePickSensor .prototype = Object .assign (Object .create (X3DPickSensorNode .prototype),
{
   constructor: PrimitivePickSensor,
   [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
      new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new Fields .SFNode ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",          new Fields .SFBool (true)),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "objectType",       new Fields .MFString ("ALL")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "matchCriterion",   new Fields .SFString ("MATCH_ANY")),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "intersectionType", new Fields .SFString ("BOUNDS")),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "sortOrder",        new Fields .SFString ("CLOSEST")),
      new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",         new Fields .SFBool ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "pickingGeometry",  new Fields .SFNode ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "pickTarget",       new Fields .MFNode ()),
      new X3DFieldDefinition (X3DConstants .outputOnly,     "pickedGeometry",   new Fields .MFNode ()),
   ]),
   getTypeName: function ()
   {
      return "PrimitivePickSensor";
   },
   getComponentName: function ()
   {
      return "Picking";
   },
   getContainerField: function ()
   {
      return "children";
   },
   initialize: function ()
   {
      X3DPickSensorNode .prototype .initialize .call (this);

      this ._pickingGeometry .addInterest ("set_pickingGeometry__", this);

      this .set_pickingGeometry__ ();
   },
   set_pickingGeometry__: function ()
   {
      this .pickingGeometryNode = null;

      try
      {
         var
            node = this ._pickingGeometry .getValue () .getInnerNode (),
            type = node .getType ();

         for (var t = type .length - 1; t >= 0; -- t)
         {
            switch (type [t])
            {
               case X3DConstants .Box:
               case X3DConstants .Cone:
               case X3DConstants .Cylinder:
               case X3DConstants .Sphere:
               {
                  this .pickingGeometryNode = node;
                  break;
               }
               default:
                  continue;
            }
         }
      }
      catch (error)
      { }
   },
   process: (function ()
   {
      var
         pickingBBox   = new Box3 (),
         targetBBox    = new Box3 (),
         pickingCenter = new Vector3 (0, 0, 0),
         targetCenter  = new Vector3 (0, 0, 0);

      return function ()
      {
         if (this .pickingGeometryNode)
         {
            var
               modelMatrices = this .getModelMatrices (),
               targets       = this .getTargets ();

            switch (this .getIntersectionType ())
            {
               case IntersectionType .BOUNDS:
               {
                  // Intersect bboxes.

                  for (var m = 0, mLength = modelMatrices .length; m < mLength; ++ m)
                  {
                     var modelMatrix = modelMatrices [m];

                     pickingBBox .assign (this .pickingGeometryNode .getBBox ()) .multRight (modelMatrix);

                     for (var t = 0, tLength = targets .size; t < tLength; ++ t)
                     {
                        var target = targets [t];

                        targetBBox .assign (target .geometryNode .getBBox ()) .multRight (target .modelMatrix);

                        if (pickingBBox .intersectsBox (targetBBox))
                        {
                           pickingCenter .assign (pickingBBox .center);
                           targetCenter  .assign (targetBBox .center);

                           target .intersected = true;
                           target .distance    = pickingCenter .distance (targetCenter);
                        }
                     }
                  }

                  // Send events.

                  var
                     pickedGeometries = this .getPickedGeometries (),
                     active           = Boolean (pickedGeometries .length);

                  pickedGeometries .remove (0, pickedGeometries .length, null);

                  if (active !== this ._isActive .getValue ())
                     this ._isActive = active;

                  if (! this ._pickedGeometry .equals (pickedGeometries))
                     this ._pickedGeometry = pickedGeometries;

                  break;
               }
               case IntersectionType .GEOMETRY:
               {
                  // Intersect geometry.

                  var picker = this .picker;

                  for (var m = 0, mLength = modelMatrices .length; m < mLength; ++ m)
                  {
                     var
                        modelMatrix  = modelMatrices [m],
                        pickingShape = this .getPickShape (this .pickingGeometryNode);

                     pickingBBox .assign (this .pickingGeometryNode .getBBox ()) .multRight (modelMatrix);

                     picker .setChildShape1 (modelMatrix, pickingShape .getCompoundShape ());

                     for (var t = 0, tLength = targets .size; t < tLength; ++ t)
                     {
                        var
                           target      = targets [t],
                           targetShape = this .getPickShape (target .geometryNode);

                        targetBBox .assign (target .geometryNode .getBBox ()) .multRight (target .modelMatrix);

                        picker .setChildShape2 (target .modelMatrix, targetShape .getCompoundShape ());

                        if (picker .contactTest ())
                        {
                           pickingCenter .assign (pickingBBox .center);
                           targetCenter  .assign (targetBBox .center);

                           target .intersected = true;
                           target .distance    = pickingCenter .distance (targetCenter);
                        }
                     }
                  }

                  // Send events.

                  var
                     pickedGeometries = this .getPickedGeometries (),
                     active           = Boolean (pickedGeometries .length);

                  pickedGeometries .remove (0, pickedGeometries .length, null);

                  if (active !== this ._isActive .getValue ())
                     this ._isActive = active;

                  if (! this ._pickedGeometry .equals (pickedGeometries))
                     this ._pickedGeometry = pickedGeometries;

                  break;
               }
            }
         }

         X3DPickSensorNode .prototype .process .call (this);
      };
   })(),
});

export default PrimitivePickSensor;
