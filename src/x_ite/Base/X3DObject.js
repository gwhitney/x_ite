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

import Generator    from "../InputOutput/Generator.js";
import MapUtilities from "../../standard/Utility/MapUtilities.js";
import DEVELOPMENT  from "../DEVELOPMENT.js";

const
   _name      = Symbol (),
   _interests = Symbol (),
   _values    = Symbol (),
   _userData  = Symbol ();

function X3DObject () { }

Object .assign (X3DObject .prototype,
{
   [_name]: "",
   [_interests]: new Map (),
   [_values]: [ ],
   [_userData]: new Map (),
   getId ()
   {
      return X3DObject .getId (this);
   },
   getTypeName ()
   {
      return this .constructor .typeName;
   },
   setName (value)
   {
      this [_name] = value;
   },
   getName ()
   {
      return this [_name];
   },
   getDisplayName ()
   {
      return this [_name];
   },
   hasInterest (callbackName, object)
   {
      return this [_interests] .has (X3DObject .getInterestId (callbackName, object));
   },
   addInterest (callbackName, object, ... args)
   {
      if (this [_interests] === X3DObject .prototype [_interests])
      {
         this [_interests] = new Map ();
         this [_values]    = [ ];
      }

      const
         interestId = X3DObject .getInterestId (callbackName, object),
         callback   = object [callbackName];

      this [_interests] .set (interestId, callback .bind (object, ... args, this));
   },
   removeInterest (callbackName, object)
   {
      this [_interests] .delete (X3DObject .getInterestId (callbackName, object));
   },
   getInterests ()
   {
      return this [_interests];
   },
   processInterests ()
   {
      if (this [_interests] .size)
      {
         for (const interest of MapUtilities .values (this [_values], this [_interests]))
            interest ();
      }
   },
   getUserData (key)
   {
      return this [_userData] .get (key)
         ?? this [_userData] .map ?.get (key);
   },
   setUserData (key, value)
   {
      try
      {
         if (this [_userData] === X3DObject .prototype [_userData])
            this [_userData] = new WeakMap ();

         this [_userData] .set (key, value);
      }
      catch
      {
         if (!this [_userData] .map)
            this [_userData] .map = new Map ();

         this [_userData] .map .set (key, value);
      }
   },
   removeUserData (key)
   {
      if (this [_userData] .delete (key))
         return;

      this [_userData] .map ?.delete (key);
   },
   toString (options = Object .prototype)
   {
      const generator = new Generator (options);

      if (options .scene)
         generator .PushExecutionContext (options .scene);

      this .toStream (generator);

      return generator .string;
   },
   toVRMLString (options = Object .prototype)
   {
      const generator = new Generator (options);

      if (options .scene)
         generator .PushExecutionContext (options .scene);

      this .toVRMLStream (generator);

      return generator .string;
   },
   toXMLString (options = Object .prototype)
   {
      const generator = new Generator (options);

      if (options .scene)
         generator .PushExecutionContext (options .scene);

      this .toXMLStream (generator);

      return generator .string;
   },
   toJSONString (options = Object .prototype)
   {
      const generator = new Generator (options);

      if (options .scene)
         generator .PushExecutionContext (options .scene);

      this .toJSONStream (generator);

      return generator .string;
   },
   toStream (generator)
   {
      generator .string = Object .prototype .toString .call (this);
   },
   dispose ()
   {
      this [_interests] .clear ();
      this [_userData] .map ?.clear ();
   },
});

for (const key of Object .keys (X3DObject .prototype))
   Object .defineProperty (X3DObject .prototype, key, { enumerable: false });

Object .defineProperties (X3DObject .prototype,
{
   [Symbol .toStringTag]:
   {
      get () { return this .getTypeName (); },
   },
});

Object .assign (X3DObject,
{
   getId: DEVELOPMENT ? (() =>
   {
      const
         map      = new WeakMap (),
         cache    = [ ],
         registry = new FinalizationRegistry (id => cache .push (id));

      let counter = BigInt (0);

      return function (object)
      {
         const id = map .get (object);

         if (id !== undefined)
         {
            return id;
         }
         else
         {
            const id = cache .pop () ?? ++ counter;

            map .set (object, id);
            registry .register (object, id);

            return id;
         }
      };
   })() : (() =>
   {
      const map = new WeakMap ();

      let counter = 0;

      return function (object)
      {
         const id = map .get (object);

         if (id !== undefined)
            return id;

         map .set (object, ++ counter);

         return counter;
      };
   })(),
   getInterestId (callbackName, object)
   {
      return `${this .getId (object)}.${this .getId (object [callbackName])}`;
   },
});

export default X3DObject;
