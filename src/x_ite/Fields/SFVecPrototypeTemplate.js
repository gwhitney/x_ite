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

import X3DField from "../Base/X3DField.js";

function SFVecPrototypeTemplate (Constructor, TypeName, Vector, double)
{
   const _formatter = double ? "DoubleFormat" : "FloatFormat";

   Object .defineProperties (Constructor,
   {
      typeName:
      {
         value: TypeName,
         enumerable: true,
      },
   });

   return Object .assign (Object .setPrototypeOf (Constructor .prototype, X3DField .prototype),
   {
      *[Symbol .iterator] ()
      {
         yield* this .getValue ();
      },
      copy ()
      {
         return new (this .constructor) (this .getValue () .copy ());
      },
      equals (vector)
      {
         return this .getValue () .equals (vector .getValue ());
      },
      isDefaultValue ()
      {
         return this .getValue () .equals (Vector .Zero);
      },
      set (value)
      {
         this .getValue () .assign (value);
      },
      abs ()
      {
         return new (this .constructor) (this .getValue () .copy () .abs ());
      },
      add (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .add (vector .getValue ()));
      },
      distance (vector)
      {
         return this .getValue () .distance (vector .getValue ());
      },
      divide (value)
      {
         return new (this .constructor) (this .getValue () .copy () .divide (value));
      },
      divVec (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .divVec (vector .getValue ()));
      },
      dot (vector)
      {
         return this .getValue () .dot (vector .getValue ());
      },
      inverse ()
      {
         return new (this .constructor) (this .getValue () .copy () .inverse ());
      },
      length ()
      {
         return this .getValue () .magnitude ();
      },
      lerp (destination, t)
      {
         return new (this .constructor) (this .getValue () .copy () .lerp (destination, t));
      },
      max (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .max (vector .getValue ()));
      },
      min (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .min (vector .getValue ()));
      },
      multiply (value)
      {
         return new (this .constructor) (this .getValue () .copy () .multiply (value));
      },
      multVec (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .multVec (vector .getValue ()));
      },
      negate ()
      {
         return new (this .constructor) (this .getValue () .copy () .negate ());
      },
      normalize (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .normalize ());
      },
      subtract (vector)
      {
         return new (this .constructor) (this .getValue () .copy () .subtract (vector .getValue ()));
      },
      toStream (generator)
      {
         const
            value    = this .getValue (),
            last     = value .length - 1,
            category = generator .Unit (this .getUnit ());

         for (let i = 0; i < last; ++ i)
         {
            generator .string += generator [_formatter] (generator .ToUnit (category, value [i]));
            generator .string += generator .Space ();
         }

         generator .string += generator [_formatter] (generator .ToUnit (category, value [last]));
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
         const
            value    = this .getValue (),
            last     = value .length - 1,
            category = generator .Unit (this .getUnit ());

         for (let i = 0; i < last; ++ i)
         {
            generator .string += generator .JSONNumber (generator [_formatter] (generator .ToUnit (category, value [i])));
            generator .string += ',';
            generator .string += generator .TidySpace ();
         }

         generator .string += generator .JSONNumber (generator [_formatter] (generator .ToUnit (category, value [last])));
      },
   });
}

export default SFVecPrototypeTemplate;
