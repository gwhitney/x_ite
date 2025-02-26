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

import X3DField  from "../Base/X3DField.js";
import SFVec3    from "./SFVec3.js";
import SFMatrix3 from "./SFMatrix3.js";
import Rotation4 from "../../standard/Math/Numbers/Rotation4.js";

const
   SFVec3d    = SFVec3 .SFVec3d,
   SFVec3f    = SFVec3 .SFVec3f,
   SFMatrix3d = SFMatrix3 .SFMatrix3d,
   SFMatrix3f = SFMatrix3 .SFMatrix3f;

function SFRotation (x, y, z, angle)
{
   switch (arguments .length)
   {
      case 0:
      {
         X3DField .call (this, new Rotation4 ());
         break;
      }
      case 1:
      {
         if ((arguments [0] instanceof SFMatrix3d) || (arguments [0] instanceof SFMatrix3f))
         {
            X3DField .call (this, new Rotation4 () .setMatrix (arguments [0] .getValue ()));
            break;
         }

         X3DField .call (this, arguments [0]);
         break;
      }
      case 2:
      {
         if ((arguments [1] instanceof SFVec3d) || (arguments [1] instanceof SFVec3f))
         {
            X3DField .call (this, new Rotation4 (arguments [0] .getValue (), arguments [1] .getValue ()));
            break;
         }

         X3DField .call (this, new Rotation4 (arguments [0] .getValue (), +arguments [1]));
         break;
      }
      case 4:
      {
         X3DField .call (this, new Rotation4 (+x, +y, +z, +angle));
         break;
      }
      default:
         throw new Error ("Invalid arguments.");
   }
}

Object .assign (Object .setPrototypeOf (SFRotation .prototype, X3DField .prototype),
{
   *[Symbol .iterator] ()
   {
      yield* this .getValue ();
   },
   copy ()
   {
      return new SFRotation (this .getValue () .copy ());
   },
   equals (rotation)
   {
      return this .getValue () .equals (rotation .getValue ());
   },
   isDefaultValue ()
   {
      return this .getValue () .equals (Rotation4 .Identity);
   },
   set (value)
   {
      this .getValue () .assign (value);
   },
   setAxis (vector)
   {
      this .getValue () .setAxis (vector .getValue ());
      this .addEvent ();
   },
   getAxis ()
   {
      return new SFVec3f (this .getValue () .getAxis ());
   },
   setMatrix (matrix)
   {
      this .getValue () .setMatrix (matrix .getValue ());
      this .addEvent ();
   },
   getMatrix ()
   {
      return new SFMatrix3f (this .getValue () .getMatrix ());
   },
   inverse ()
   {
      return new SFRotation (this .getValue () .copy () .inverse ());
   },
   multiply (rotation)
   {
      return new SFRotation (this .getValue () .copy () .multRight (rotation .getValue ()));
   },
   multVec (vector)
   {
      return new (vector .constructor) (this .getValue () .multVecRot (vector .getValue () .copy ()));
   },
   slerp (rotation, t)
   {
      return new SFRotation (this .getValue () .copy () .slerp (rotation .getValue (), t));
   },
   toStream (generator)
   {
      const { x, y, z, angle } = this .getValue ();

      generator .string += generator .DoubleFormat (x);
      generator .string += generator .Space ();
      generator .string += generator .DoubleFormat (y);
      generator .string += generator .Space ();
      generator .string += generator .DoubleFormat (z);
      generator .string += generator .Space ();
      generator .string += generator .DoubleFormat (generator .ToUnit ("angle", angle));
   },
   toVRMLStream (generator)
   {
      this .toStream (generator);
   },
   toXMLStream (generator)
   {
      this .toStream (generator);
   },
   toJSONStream (generator)
   {
      generator .string += '[';
      generator .string += generator .TidySpace ();

      this .toJSONStreamValue (generator);

      generator .string += generator .TidySpace ();
      generator .string += ']';
   },
   toJSONStreamValue (generator)
   {
      const { x, y, z, angle } = this .getValue ();

      generator .string += generator .JSONNumber (generator .DoubleFormat (x));
      generator .string += ',';
      generator .string += generator .TidySpace ();
      generator .string += generator .JSONNumber (generator .DoubleFormat (y));
      generator .string += ',';
      generator .string += generator .TidySpace ();
      generator .string += generator .JSONNumber (generator .DoubleFormat (z));
      generator .string += ',';
      generator .string += generator .TidySpace ();
      generator .string += generator .JSONNumber (generator .DoubleFormat (generator .ToUnit ("angle", angle)));
   },
});

for (const key of Object .keys (SFRotation .prototype))
   Object .defineProperty (SFRotation .prototype, key, { enumerable: false });

const x = {
   get ()
   {
      return this .getValue () .x;
   },
   set (value)
   {
      this .getValue () .x = +value;
      this .addEvent ();
   },
};

const y = {
   get ()
   {
      return this .getValue () .y;
   },
   set (value)
   {
      this .getValue () .y = +value;
      this .addEvent ();
   },
};

const z = {
   get ()
   {
      return this .getValue () .z;
   },
   set (value)
   {
      this .getValue () .z = +value;
      this .addEvent ();
   },
};

const angle = {
   get ()
   {
      return this .getValue () .angle;
   },
   set (value)
   {
      this .getValue () .angle = +value;
      this .addEvent ();
   },
};

Object .defineProperties (SFRotation .prototype,
{
   0: x,
   1: y,
   2: z,
   3: angle,
   x: Object .assign ({ enumerable: true }, x),
   y: Object .assign ({ enumerable: true }, y),
   z: Object .assign ({ enumerable: true }, z),
   angle: Object .assign ({ enumerable: true }, angle),
});

Object .defineProperties (SFRotation,
{
   typeName:
   {
      value: "SFRotation",
      enumerable: true,
   },
});

export default SFRotation;
