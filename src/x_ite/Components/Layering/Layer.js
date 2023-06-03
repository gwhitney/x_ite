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
import X3DLayerNode         from "./X3DLayerNode.js";
import Viewpoint            from "../Navigation/Viewpoint.js";
import Group                from "../Grouping/Group.js";
import X3DConstants         from "../../Base/X3DConstants.js";

function Layer (executionContext)
{
   X3DLayerNode .call (this,
                       executionContext,
                       new Viewpoint (executionContext),
                       new Group (executionContext));

   this .addType (X3DConstants .Layer);
}

Layer .prototype = Object .assign (Object .create (X3DLayerNode .prototype),
{
   constructor: Layer,
   getComponentName: function ()
   {
      return "Layering";
   },
   getContainerField: function ()
   {
      return "layers";
   },
   getSpecificationRange: function ()
   {
      return ["3.2", "Infinity"];
   },
   initialize: function ()
   {
      X3DLayerNode .prototype .initialize .call (this);

      this ._addChildren    .addFieldInterest (this .getGroup () ._addChildren);
      this ._removeChildren .addFieldInterest (this .getGroup () ._removeChildren);
      this ._children       .addFieldInterest (this .getGroup () ._children);

      this .getGroup () ._children = this ._children;
      this .getGroup () .setPrivate (true);
      this .getGroup () .setup ();
   },
});

Object .defineProperties (Layer,
{
   typeName:
   {
      value: "Layer",
   },
   componentName:
   {
      value: "Layering",
   },
   containerField:
   {
      value: "layers",
   },
   specificationRange:
   {
      value: Object .freeze (["3.2", "Infinity"]),
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",       new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "pickable",       new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "objectType",     new Fields .MFString ("ALL")),
         new X3DFieldDefinition (X3DConstants .inputOutput, "visible",        new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "viewport",       new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,   "addChildren",    new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,   "removeChildren", new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "children",       new Fields .MFNode ()),
      ]),
   },
});

export default Layer;
