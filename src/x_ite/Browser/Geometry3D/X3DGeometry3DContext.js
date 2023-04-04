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

import BoxOptions        from "./BoxOptions.js";
import ConeOptions       from "./ConeOptions.js";
import CylinderOptions   from "./CylinderOptions.js";
import QuadSphereOptions from "./QuadSphereOptions.js";
import PrimitiveQuality  from "../Core/PrimitiveQuality.js";

function X3DGeometry3DContext () { }

X3DGeometry3DContext .prototype =
{
   initialize: function ()
   {
      this .setPrimitiveQuality3D (this .getBrowserOptions () .getPrimitiveQuality ());
   },
   getBoxOptions: function ()
   {
      return getOptionNode .call (this, "getBoxOptions", BoxOptions);
   },
   getConeOptions: function ()
   {
      return getOptionNode .call (this, "getConeOptions", ConeOptions);
   },
   getCylinderOptions: function ()
   {
      return getOptionNode .call (this, "getCylinderOptions", CylinderOptions);
   },
   getSphereOptions: function ()
   {
      return getOptionNode .call (this, "getSphereOptions", QuadSphereOptions);
   },
   setPrimitiveQuality3D: function (primitiveQuality)
   {
      const
         cone     = this .getConeOptions (),
         cylinder = this .getCylinderOptions (),
         sphere   = this .getSphereOptions ();

      switch (primitiveQuality)
      {
         case PrimitiveQuality .LOW:
         {
            cone     ._xDimension = 16;
            cylinder ._xDimension = 16;
            sphere   ._xDimension = 20;
            sphere   ._yDimension = 9;
            break;
         }
         case PrimitiveQuality .MEDIUM:
         {
            cone     ._xDimension = 20;
            cylinder ._xDimension = 20;
            sphere   ._xDimension = 32;
            sphere   ._yDimension = 15;
            break;
         }
         case PrimitiveQuality .HIGH:
         {
            cone     ._xDimension = 32;
            cylinder ._xDimension = 32;
            sphere   ._xDimension = 64;
            sphere   ._yDimension = 31;
            break;
         }
      }
   },
};

function getOptionNode (key, OptionNode)
{
   const optionNode = new OptionNode (this .getPrivateScene ());

   optionNode .setup ();

   this [key] = function () { return optionNode; };

   Object .defineProperty (this, key, { enumerable: false });

   return optionNode;
}

export default X3DGeometry3DContext;
