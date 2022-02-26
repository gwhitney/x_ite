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
   "x_ite/Components/PointingDeviceSensor/X3DTouchSensorNode",
   "x_ite/Components/Geospatial/X3DGeospatialObject",
   "x_ite/Bits/X3DConstants",
   "standard/Math/Numbers/Vector3",
   "standard/Math/Numbers/Matrix4",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTouchSensorNode,
          X3DGeospatialObject,
          X3DConstants,
          Vector3,
          Matrix4)
{
"use strict";

   var
      invModelViewMatrix = new Matrix4 (),
      geoCoords          = new Vector3 (0, 0, 0);

   function GeoTouchSensor (executionContext)
   {
      X3DTouchSensorNode  .call (this, executionContext);
      X3DGeospatialObject .call (this, executionContext);

      this .addType (X3DConstants .GeoTouchSensor);

      this .hitPoint_changed_ .setUnit ("length");
   }

   GeoTouchSensor .prototype = Object .assign (Object .create (X3DTouchSensorNode .prototype),
      X3DGeospatialObject .prototype,
   {
      constructor: GeoTouchSensor,
      [Symbol .for ("X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",            new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "description",         new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",           new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",           new Fields .MFString ("GD", "WE")),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",             new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "hitTexCoord_changed", new Fields .SFVec2f ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "hitNormal_changed",   new Fields .SFVec3f ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "hitPoint_changed",    new Fields .SFVec3f ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "hitGeoCoord_changed", new Fields .SFVec3d ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "isOver",              new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",            new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,     "touchTime",           new Fields .SFTime ()),
      ]),
      getTypeName: function ()
      {
         return "GeoTouchSensor";
      },
      getComponentName: function ()
      {
         return "Geospatial";
      },
      getContainerField: function ()
      {
         return "children";
      },
      initialize: function ()
      {
         X3DTouchSensorNode  .prototype .initialize .call (this);
         X3DGeospatialObject .prototype .initialize .call (this);
      },
      set_over__: function (over, hit, modelViewMatrix, projectionMatrix, viewport)
      {
         try
         {
            X3DTouchSensorNode .prototype .set_over__ .call (this, over, hit, modelViewMatrix, projectionMatrix, viewport);

            if (this .isOver_ .getValue ())
            {
               var intersection = hit .intersection;

               invModelViewMatrix .assign (modelViewMatrix) .inverse ();

               this .hitTexCoord_changed_ = intersection .texCoord;
               this .hitNormal_changed_   = modelViewMatrix .multMatrixDir (intersection .normal .copy ()) .normalize ();
               this .hitPoint_changed_    = invModelViewMatrix .multVecMatrix (intersection .point .copy ());
               this .hitGeoCoord_changed_ = this .getGeoCoord (this .hitPoint_changed_ .getValue (), geoCoords);
            }
         }
         catch (error)
         {
            console .log (error);
         }
      },
   });

   return GeoTouchSensor;
});
