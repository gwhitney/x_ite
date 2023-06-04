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

import Fields           from "../../Fields.js";
import X3DSensorNode    from "../Core/X3DSensorNode.js";
import TraverseType     from "../../Rendering/TraverseType.js";
import X3DConstants     from "../../Base/X3DConstants.js";
import MatchCriterion   from "../../Browser/Picking/MatchCriterion.js";
import IntersectionType from "../../Browser/Picking/IntersectionType.js";
import SortOrder        from "../../Browser/Picking/SortOrder.js";
import Matrix4          from "../../../standard/Math/Numbers/Matrix4.js";
import QuickSort        from "../../../standard/Math/Algorithms/QuickSort.js";
import ObjectCache      from "../../../standard/Utility/ObjectCache.js";

var ModelMatrixCache = ObjectCache (Matrix4);

function compareDistance (lhs, rhs) { return lhs .distance < rhs .distance; }

function X3DPickSensorNode (executionContext)
{
   X3DSensorNode .call (this, executionContext);

   this .addType (X3DConstants .X3DPickSensorNode);

   this .objectType          = new Set ();
   this .intersectionType    = IntersectionType .BOUNDS;
   this .sortOrder           = SortOrder .CLOSEST;
   this .pickTargetNodes     = new Set ();
   this .modelMatrices       = [ ];
   this .targets             = [ ];
   this .targets .size       = 0;
   this .pickedTargets       = [ ];
   this .pickedTargetsSorter = new QuickSort (this .pickedTargets, compareDistance);
   this .pickedGeometries    = new Fields .MFNode (); // Must be unique for each X3DPickSensorNode.
}

X3DPickSensorNode .prototype = Object .assign (Object .create (X3DSensorNode .prototype),
{
   constructor: X3DPickSensorNode,
   initialize: function ()
   {
      this .getLive () .addInterest ("set_live__", this);

      this ._enabled          .addInterest ("set_live__",             this);
      this ._objectType       .addInterest ("set_objectType__",       this);
      this ._matchCriterion   .addInterest ("set_matchCriterion__",   this);
      this ._intersectionType .addInterest ("set_intersectionType__", this);
      this ._sortOrder        .addInterest ("set_sortOrder__",        this);
      this ._pickTarget       .addInterest ("set_pickTarget__",       this);

      this .set_objectType__ ();
      this .set_matchCriterion__ ();
      this .set_intersectionType__ ();
      this .set_sortOrder__ ();
      this .set_pickTarget__ ();
   },
   getObjectType: function ()
   {
      return this .objectType;
   },
   getMatchCriterion: function ()
   {
      return this .matchCriterion;
   },
   getIntersectionType: function ()
   {
      return this .intersectionType;
   },
   getSortOrder: function ()
   {
      return this .sortOrder;
   },
   getModelMatrices: function ()
   {
      return this .modelMatrices;
   },
   getTargets: function ()
   {
      return this .targets;
   },
   getPickShape: (function ()
   {
      const pickShapes = new WeakMap ();

      return function (geometryNode)
      {
         const pickShape = pickShapes .get (geometryNode);

         if (pickShape !== undefined)
            return pickShape;

         const
            browser             = this .getBrowser (),
            shapeNode           = browser .getPrivateScene () .createNode ("Shape",           false),
            collidableShapeNode = browser .getPrivateScene () .createNode ("CollidableShape", false);

         shapeNode .setPrivate (true);
         collidableShapeNode .setPrivate (true);
         collidableShapeNode .setConvex (true);

         shapeNode ._geometry        = geometryNode;
         collidableShapeNode ._shape = shapeNode;

         shapeNode           .setup ();
         collidableShapeNode .setup ();

         pickShapes .set (geometryNode, collidableShapeNode);

         return collidableShapeNode;
      };
   })(),
   getPickedGeometries: (function ()
   {
      return function ()
      {
         var
            targets          = this .targets,
            numTargets       = targets .size,
            pickedTargets    = this .pickedTargets,
            pickedGeometries = this .pickedGeometries;

         // Filter intersecting targets.

         pickedTargets .length = 0;

         for (var i = 0; i < numTargets; ++ i)
         {
            var target = targets [i];

            if (target .intersected)
               pickedTargets .push (target);
         }

         // No pickedTargets, return.

         if (pickedTargets .length === 0)
         {
            pickedGeometries .length = 0;

            return pickedGeometries;
         }

         // Return sorted pickedTargets.

         switch (this .sortOrder)
         {
            case SortOrder .ANY:
            {
               pickedTargets .length    = 1;
               pickedGeometries [0]     = this .getPickedGeometry (pickedTargets [0]);
               pickedGeometries .length = 1;
               break;
            }
            case SortOrder .CLOSEST:
            {
               this .pickedTargetsSorter .sort (0, pickedTargets .length);

               pickedTargets .length    = 1;
               pickedGeometries [0]     = this .getPickedGeometry (pickedTargets [0]);
               pickedGeometries .length = 1;
               break;
            }
            case SortOrder .ALL:
            {
               for (var i = 0, length = pickedTargets .length; i < length; ++ i)
                  pickedGeometries [i] = this .getPickedGeometry (pickedTargets [i]);

               pickedGeometries .length = length;
               break;
            }
            case SortOrder .ALL_SORTED:
            {
               this .pickedTargetsSorter .sort (0, pickedTargets .length);

               for (var i = 0, length = pickedTargets .length; i < length; ++ i)
                  pickedGeometries [i] = this .getPickedGeometry (pickedTargets [i]);

               pickedGeometries .length = length;
               break;
            }
         }

         return pickedGeometries;
      };
   })(),
   getPickedGeometry: function (target)
   {
      var
         executionContext = this .getExecutionContext (),
         geometryNode     = target .geometryNode;

      if (geometryNode .getExecutionContext () === executionContext)
         return geometryNode;

      var instance = geometryNode .getExecutionContext ();

      if (instance .getType () .includes (X3DConstants .X3DPrototypeInstance) && instance .getExecutionContext () === executionContext)
         return instance;

      var pickingHierarchy = target .pickingHierarchy;

      for (var i = pickingHierarchy .length - 1; i >= 0; -- i)
      {
         var node = pickingHierarchy [i];

         if (node .getExecutionContext () === executionContext)
            return node;

         var instance = node .getExecutionContext ();

         if (instance .getType () .includes (X3DConstants .X3DPrototypeInstance) && instance .getExecutionContext () === executionContext)
            return instance;
      }

      return null;
   },
   getPickedTargets: function ()
   {
      return this .pickedTargets;
   },
   set_live__: function ()
   {
      if (this .getLive () .getValue () && this ._enabled .getValue () && ! this .objectType .has ("NONE"))
      {
         this .getBrowser () .addPickSensor (this);
         this .setPickableObject (true);
      }
      else
      {
         this .getBrowser () .removePickSensor (this);
         this .setPickableObject (false);
      }
   },
   set_objectType__: function ()
   {
      this .objectType .clear ();

      for (var i = 0, length = this ._objectType .length; i < length; ++ i)
      {
         this .objectType .add (this ._objectType [i]);
      }

      this .set_live__ ();
   },
   set_matchCriterion__: (function ()
   {
      var matchCriterions = new Map ([
         ["MATCH_ANY",      MatchCriterion .MATCH_ANY],
         ["MATCH_EVERY",    MatchCriterion .MATCH_EVERY],
         ["MATCH_ONLY_ONE", MatchCriterion .MATCH_ONLY_ONE],
      ]);

      return function ()
      {
         this .matchCriterion = matchCriterions .get (this ._matchCriterion .getValue ());

         if (this .matchCriterion === undefined)
            this .matchCriterion = MatchCriterionType .MATCH_ANY;
      };
   })(),
   set_intersectionType__: (function ()
   {
      var intersectionTypes = new Map ([
         ["BOUNDS",   IntersectionType .BOUNDS],
         ["GEOMETRY", IntersectionType .GEOMETRY],
      ]);

      return function ()
      {
         this .intersectionType = intersectionTypes .get (this ._intersectionType .getValue ());

         if (this .intersectionType === undefined)
            this .intersectionType = IntersectionType .BOUNDS;
      };
   })(),
   set_sortOrder__: (function ()
   {
      var sortOrders = new Map ([
         ["ANY",        SortOrder .ANY],
         ["CLOSEST",    SortOrder .CLOSEST],
         ["ALL",        SortOrder .ALL],
         ["ALL_SORTED", SortOrder .ALL_SORTED],
      ]);

      return function ()
      {
         this .sortOrder = sortOrders .get (this ._sortOrder .getValue ());

         if (this .sortOrder === undefined)
            this .sortOrder = SortOrder .CLOSEST;
      };
   })(),
   set_pickTarget__: function ()
   {
      this .pickTargetNodes .clear ();

      for (var i = 0, length = this ._pickTarget .length; i < length; ++ i)
      {
         try
         {
            var
               node = this ._pickTarget [i] .getValue () .getInnerNode (),
               type = node .getType ();

            for (var t = type .length - 1; t >= 0; -- t)
            {
               switch (type [t])
               {
                  case X3DConstants .Inline:
                  case X3DConstants .Shape:
                  case X3DConstants .X3DGroupingNode:
                  {
                     this .pickTargetNodes .add (node);
                     break;
                  }
                  default:
                     continue;
               }
            }
         }
         catch (error)
         { }
      }
   },
   traverse: function (type, renderObject)
   {
      // X3DPickSensorNode nodes are sorted out and only traversed during PICKING, except if is child of a LOD or Switch node.

      if (type !== TraverseType .PICKING)
         return;

      if (this .isPickableObject ())
         this .modelMatrices .push (ModelMatrixCache .pop () .assign (renderObject .getModelViewMatrix () .get ()));
   },
   collect: function (geometryNode, modelMatrix, pickingHierarchy)
   {
      var pickTargetNodes = this .pickTargetNodes;

      var haveTarget = pickingHierarchy .some (function (node)
      {
         return pickTargetNodes .has (node);
      });

      if (haveTarget)
      {
         var targets = this .targets;

         if (targets .size < targets .length)
         {
            var target = targets [targets .size];
         }
         else
         {
            var target = { modelMatrix: new Matrix4 (), pickingHierarchy: [ ], pickedPoint: [ ], intersections: [ ] };

            targets .push (target);
         }

         ++ targets .size;

         target .intersected           = false;
         target .geometryNode          = geometryNode;
         target .pickedPoint .length   = 0;
         target .intersections .length = 0;
         target .modelMatrix .assign (modelMatrix);

         var destPickingHierarchy = target .pickingHierarchy;

         for (var i = 0, length = pickingHierarchy .length; i < length; ++ i)
            destPickingHierarchy [i] = pickingHierarchy [i];

         destPickingHierarchy .length = length;
      }
   },
   process: function ()
   {
      var modelMatrices = this .modelMatrices;

      for (var m = 0, mLength = modelMatrices .length; m < mLength; ++ m)
         ModelMatrixCache .push (modelMatrices [m]);

      this .modelMatrices .length = 0;
      this .targets .size         = 0;
   },
});

Object .defineProperties (X3DPickSensorNode,
{
   typeName:
   {
      value: "X3DPickSensorNode",
      enumerate: true,
   },
   componentName:
   {
      value: "Picking",
      enumerate: true,
   },
});

export default X3DPickSensorNode;
