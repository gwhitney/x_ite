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

import Fields                      from "../../Fields.js";
import X3DFieldDefinition          from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray        from "../../Base/FieldDefinitionArray.js";
import X3DNurbsSurfaceGeometryNode from "./X3DNurbsSurfaceGeometryNode.js";
import X3DConstants                from "../../Base/X3DConstants.js";
import X3DCast                     from "../../Base/X3DCast.js";

function NurbsTrimmedSurface (executionContext)
{
   X3DNurbsSurfaceGeometryNode .call (this, executionContext);

   this .addType (X3DConstants .NurbsTrimmedSurface);

   this .trimmingContourNodes = [ ];
}

Object .assign (Object .setPrototypeOf (NurbsTrimmedSurface .prototype, X3DNurbsSurfaceGeometryNode .prototype),
{
   initialize ()
   {
      X3DNurbsSurfaceGeometryNode .prototype .initialize .call (this);

      this ._addTrimmingContour    .addInterest ("set_addTrimmingContour__",    this);
      this ._removeTrimmingContour .addInterest ("set_removeTrimmingContour__", this);
      this ._trimmingContour       .addInterest ("set_trimmingContour__",       this);

      this .set_trimmingContour__ ();
   },
   set_addTrimmingContour__ ()
   {
      this ._addTrimmingContour .setTainted (true);
      this ._addTrimmingContour .assign (filter (this ._addTrimmingContour, this ._trimmingContour), this ._addTrimmingContour .length);

      for (const trimmingContour of this ._addTrimmingContour)
         this ._trimmingContour .push (trimmingContour);

      this ._addTrimmingContour .length = 0;
      this ._addTrimmingContour .setTainted (false);
   },
   set_removeTrimmingContour__ ()
   {
      this ._removeTrimmingContour .setTainted (true);
      this ._trimmingContour .assign (filter (this ._trimmingContour, this ._removeTrimmingContour));

      this ._removeTrimmingContour .length = 0;
      this ._removeTrimmingContour .setTainted (false);
   },
   set_trimmingContour__ ()
   {
      const trimmingContourNodes = this .trimmingContourNodes;

      trimmingContourNodes .length = 0;

      for (const node of this ._trimmingContour)
      {
         const trimmingContourNode = X3DCast (X3DConstants .Contour2D, node);

         if (trimmingContourNode)
            trimmingContourNodes .push (trimmingContourNode);
      }
   },
   getTrimmingContours ()
   {
      const
         trimmingContourNodes = this .trimmingContourNodes,
         trimmingContours     = [ ];

      for (const trimmingContourNode of trimmingContourNodes)
         trimmingContourNode .addTrimmingContour (trimmingContours);

      return trimmingContours;
   },
});

function filter (array, remove)
{
   const set = new Set (remove);

   return array .filter (value => !set .has (value));
}

Object .defineProperties (NurbsTrimmedSurface,
{
   typeName:
   {
      value: "NurbsTrimmedSurface",
      enumerable: true,
   },
   componentName:
   {
      value: "NURBS",
      enumerable: true,
   },
   containerField:
   {
      value: "geometry",
      enumerable: true,
   },
   specificationRange:
   {
      value: Object .freeze (["3.0", "Infinity"]),
      enumerable: true,
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",              new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "uTessellation",         new Fields .SFInt32 ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "vTessellation",         new Fields .SFInt32 ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",                 new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "uClosed",               new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "vClosed",               new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "uOrder",                new Fields .SFInt32 (3)),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "vOrder",                new Fields .SFInt32 (3)),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "uDimension",            new Fields .SFInt32 ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "vDimension",            new Fields .SFInt32 ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "uKnot",                 new Fields .MFDouble ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "vKnot",                 new Fields .MFDouble ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",                new Fields .MFDouble ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",              new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint",          new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,      "addTrimmingContour",    new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,      "removeTrimmingContour", new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "trimmingContour",       new Fields .MFNode ()),
      ]),
      enumerable: true,
   },
});

export default NurbsTrimmedSurface;
