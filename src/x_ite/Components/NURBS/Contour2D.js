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
import X3DNode              from "../Core/X3DNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import X3DCast              from "../../Base/X3DCast.js";

function Contour2D (executionContext)
{
   X3DNode .call (this, executionContext);

   this .addType (X3DConstants .Contour2D);

   this .childNodes = [ ];
}

Contour2D .prototype = Object .assign (Object .create (X3DNode .prototype),
{
   constructor: Contour2D,
   getContainerField: function ()
   {
      return "trimmingContour";
   },
   getSpecificationRange: function ()
   {
      return ["3.0", "Infinity"];
   },
   initialize: function ()
   {
      X3DNode .prototype .initialize .call (this);

      this ._addChildren    .addInterest ("set_addChildren__",    this);
      this ._removeChildren .addInterest ("set_removeChildren__", this);
      this ._children       .addInterest ("set_children__",       this);

      this .set_children__ ();
   },
   set_addChildren__: function ()
   {
      this ._addChildren .setTainted (true);
      this ._addChildren .assign (filter (this ._addChildren, this ._children));

      for (const child of this ._addChildren)
         this ._children .push (child);

      this ._addChildren .length = 0;
      this ._addChildren .setTainted (false);
   },
   set_removeChildren__: function ()
   {
      this ._removeChildren .setTainted (true);
      this ._children .assign (filter (this ._children, this ._removeChildren));

      this ._removeChildren .length = 0;
      this ._removeChildren .setTainted (false);
   },
   set_children__: function ()
   {
      const childNodes = this .childNodes;

      childNodes .length = 0;

      for (const node of this ._children)
      {
         const childNode = X3DCast (X3DConstants .NurbsCurve2D, node);

         if (childNode)
         {
            childNodes .push (childNode);
            continue;
         }
         else
         {
            const childNode = X3DCast (X3DConstants .ContourPolyline2D, node);

            if (childNode)
            {
               childNodes .push (childNode);
               continue;
            }
         }
      }
   },
   addTrimmingContour: function (trimmingContours)
   {
      for (const childNode of this .childNodes)
         trimmingContours .push (childNode .tessellate (2));
   }
});

function filter (array, remove)
{
   const set = new Set (remove);

   return array .filter (value => !set .has (value));
}

Object .defineProperties (Contour2D,
{
   typeName:
   {
      value: "Contour2D",
   },
   componentName:
   {
      value: "NURBS",
   },
   containerField:
   {
      value: "trimmingContour",
   },
   specificationRange:
   {
      value: Object .freeze (["3.0", "Infinity"]),
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",       new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,   "addChildren",    new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,   "removeChildren", new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "children",       new Fields .MFNode ()),
      ]),
   },
});

export default Contour2D;
