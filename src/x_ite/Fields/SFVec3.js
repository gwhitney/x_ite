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

import X3DField               from "../Base/X3DField.js";
import SFVecPrototypeTemplate from "./SFVecPrototypeTemplate.js";
import X3DConstants           from "../Base/X3DConstants.js";
import Vector3                from "../../standard/Math/Numbers/Vector3.js";

function SFVec3Template (TypeName, Type, double)
{
   function SFVec3 (x, y, z)
   {
      switch (arguments .length)
      {
         case 0:
            return X3DField .call (this, new Vector3 (0, 0, 0));

         case 1:
            return X3DField .call (this, arguments [0]);

         case 3:
            return X3DField .call (this, new Vector3 (+x, +y, +z));
      }

      throw new Error ("Invalid arguments.");
   }

   SFVec3 .prototype = Object .assign (Object .create (X3DField .prototype),
      SFVecPrototypeTemplate (TypeName, Type, Vector3, double),
   {
      constructor: SFVec3,
      cross: function (vector)
      {
         return new (this .constructor) (Vector3 .cross (this .getValue (), vector .getValue ()));
      },
   });

   for (const key of Reflect .ownKeys (SFVec3 .prototype))
      Object .defineProperty (SFVec3 .prototype, key, { enumerable: false });

   const x = {
      get: function ()
      {
         return this .getValue () .x;
      },
      set: function (value)
      {
         this .getValue () .x = +value;
         this .addEvent ();
      },
      enumerable: true,
   };

   const y = {
      get: function ()
      {
         return this .getValue () .y;
      },
      set: function (value)
      {
         this .getValue () .y = +value;
         this .addEvent ();
      },
      enumerable: true,
   };

   const z = {
      get: function ()
      {
         return this .getValue () .z;
      },
      set: function (value)
      {
         this .getValue () .z = +value;
         this .addEvent ();
      },
      enumerable: true,
   };

   Object .defineProperty (SFVec3 .prototype, "x", x);
   Object .defineProperty (SFVec3 .prototype, "y", y);
   Object .defineProperty (SFVec3 .prototype, "z", z);

   x .enumerable = false;
   y .enumerable = false;
   z .enumerable = false;

   Object .defineProperty (SFVec3 .prototype, "0", x);
   Object .defineProperty (SFVec3 .prototype, "1", y);
   Object .defineProperty (SFVec3 .prototype, "2", z);

   return SFVec3;
}

const SFVec3 = {
   SFVec3d: SFVec3Template ("SFVec3d", X3DConstants .SFVec3d, true),
   SFVec3f: SFVec3Template ("SFVec3f", X3DConstants .SFVec3f, false),
};

export default SFVec3;
