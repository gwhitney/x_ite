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

function SFMatrixPrototypeTemplate (Constructor, TypeName, Matrix, SFVec, double)
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
      equals (matrix)
      {
         return this .getValue () .equals (matrix .getValue ());
      },
      isDefaultValue ()
      {
         return this .getValue () .equals (Matrix .Identity);
      },
      set (value)
      {
         this .getValue () .assign (value);
      },
      setTransform (translation, rotation, scale, scaleOrientation, center)
      {
         translation      = translation      ? translation      .getValue () : null;
         rotation         = rotation         ? rotation         .getValue () : null;
         scale            = scale            ? scale            .getValue () : null;
         scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : null;
         center           = center           ? center           .getValue () : null;

         this .getValue () .set (translation, rotation, scale, scaleOrientation, center);
      },
      getTransform (translation, rotation, scale, scaleOrientation, center)
      {
         translation      = translation      ? translation      .getValue () : null;
         rotation         = rotation         ? rotation         .getValue () : null;
         scale            = scale            ? scale            .getValue () : null;
         scaleOrientation = scaleOrientation ? scaleOrientation .getValue () : null;
         center           = center           ? center           .getValue () : null;

         this .getValue () .get (translation, rotation, scale, scaleOrientation, center);
      },
      determinant ()
      {
         return this .getValue () .determinant ();
      },
      transpose ()
      {
         return new (this .constructor) (this .getValue () .copy () .transpose ());
      },
      inverse ()
      {
         return new (this .constructor) (this .getValue () .copy () .inverse ());
      },
      multLeft (matrix)
      {
         return new (this .constructor) (this .getValue () .copy () .multLeft (matrix .getValue ()));
      },
      multRight (matrix)
      {
         return new (this .constructor) (this .getValue () .copy () .multRight (matrix .getValue ()));
      },
      multVecMatrix (vector)
      {
         return new SFVec (this .getValue () .multVecMatrix (vector .getValue () .copy ()));
      },
      multMatrixVec (vector)
      {
         return new SFVec (this .getValue () .multMatrixVec (vector .getValue () .copy ()));
      },
      multDirMatrix (vector)
      {
         return new SFVec (this .getValue () .multDirMatrix (vector .getValue () .copy ()));
      },
      multMatrixDir (vector)
      {
         return new SFVec (this .getValue () .multMatrixDir (vector .getValue () .copy ()));
      },
      toStream (generator)
      {
         const
            value = this .getValue (),
            last  = value .length - 1;

         for (let i = 0; i < last; ++ i)
         {
            generator .string += generator [_formatter] (value [i]);
            generator .string += generator .Space ();
         }

         generator .string += generator [_formatter] (value [last]);
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
            value = this .getValue (),
            last  = value .length - 1;

         for (let i = 0; i < last; ++ i)
         {
            generator .string += generator .JSONNumber (generator [_formatter] (value [i]));
            generator .string += ',';
            generator .string += generator .TidySpace ();
         }

         generator .string += generator .JSONNumber (generator [_formatter] (value [last]));
      },
   });
}

export default SFMatrixPrototypeTemplate;
