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

import X3DObject   from "./X3DObject.js";
import DEVELOPMENT from "../DEVELOPMENT.js";

const
   _modificationTime = Symbol (),
   _tainted          = Symbol (),
   _parents          = Symbol (),
   _registry         = Symbol ();

function X3DChildObject ()
{
   X3DObject .call (this);
}

if (DEVELOPMENT)
{
   Object .assign (Object .setPrototypeOf (X3DChildObject .prototype, X3DObject .prototype),
   {
      [_modificationTime]: 0,
      [_tainted]: false,
      [_parents]: new Map (),
      [_registry]: new FinalizationRegistry (Function .prototype),
      isInitializable ()
      {
         return true;
      },
      isInput ()
      {
         return false;
      },
      isOutput ()
      {
         return false;
      },
      setModificationTime (value)
      {
         this [_modificationTime] = value;
      },
      getModificationTime ()
      {
         return this [_modificationTime];
      },
      setTainted (value)
      {
         this [_tainted] = value;
      },
      isTainted ()
      {
         return this [_tainted];
      },
      addEvent ()
      {
         this .setModificationTime (Date .now ());

         for (const parent of this [_parents] .values ())
            parent .deref () ?.addEvent (this);
      },
      addEventObject (field, event)
      {
         this .setModificationTime (Date .now ());

         for (const parent of this [_parents] .values ())
            parent .deref () ?.addEventObject (this, event);
      },
      processEvent ()
      {
         this .setTainted (false);
         this .processInterests ();
      },
      collectCloneCount ()
      {
         let cloneCount = 0;

         for (const weakRef of this [_parents] .values ())
            cloneCount += weakRef .deref () ?.collectCloneCount ();

         return cloneCount;
      },
      addParent (parent)
      {
         if (this [_parents] === X3DChildObject .prototype [_parents])
         {
            this [_parents]  = new Map ();
            this [_registry] = new FinalizationRegistry (id =>
            {
               this [_parents] .delete (id);
               this .parentsChanged ();
            });
         }

         this [_parents] .set (parent .getId (), new WeakRef (parent));
         this [_registry] .register (parent, parent .getId (), parent);

         this .parentsChanged ();
      },
      removeParent (parent)
      {
         this [_parents] .delete (parent .getId ());
         this [_registry] .unregister (parent);

         this .parentsChanged ();
      },
      getParents ()
      {
         const parents = new Set ();

         for (const weakRef of this [_parents] .values ())
            parents .add (weakRef .deref ())

         parents .delete (undefined);

         return parents;
      },
      parentsChanged () { },
      dispose ()
      {
         this [_parents] .clear ();

         X3DObject .prototype .dispose .call (this);
      },
   });
}
else
{
   Object .assign (Object .setPrototypeOf (X3DChildObject .prototype, X3DObject .prototype),
   {
      [_modificationTime]: 0,
      [_tainted]: false,
      [_parents]: new Set (),
      isInitializable ()
      {
         return true;
      },
      isInput ()
      {
         return false;
      },
      isOutput ()
      {
         return false;
      },
      setModificationTime (value)
      {
         this [_modificationTime] = value;
      },
      getModificationTime ()
      {
         return this [_modificationTime];
      },
      setTainted (value)
      {
         this [_tainted] = value;
      },
      isTainted ()
      {
         return this [_tainted];
      },
      addEvent ()
      {
         this .setModificationTime (Date .now ());

         for (const parent of this [_parents])
            parent .addEvent (this);
      },
      addEventObject (field, event)
      {
         this .setModificationTime (Date .now ());

         for (const parent of this [_parents])
            parent .addEventObject (this, event);
      },
      processEvent ()
      {
         this .setTainted (false);
         this .processInterests ();
      },
      collectCloneCount ()
      {
         let cloneCount = 0;

         for (const parent of this [_parents])
            cloneCount += parent .collectCloneCount ();

         return cloneCount;
      },
      addParent (parent)
      {
         if (this [_parents] === X3DChildObject .prototype [_parents])
            this [_parents] = new Set ();

         this [_parents] .add (parent);

         this .parentsChanged ();
      },
      removeParent (parent)
      {
         this [_parents] .delete (parent);

         this .parentsChanged ();
      },
      getParents ()
      {
         return this [_parents];
      },
      parentsChanged () { },
      dispose ()
      {
         this [_parents] .clear ();

         X3DObject .prototype .dispose .call (this);
      },
   });
}

for (const key of Object .keys (X3DChildObject .prototype))
   Object .defineProperty (X3DChildObject .prototype, key, { enumerable: false });

export default X3DChildObject;
