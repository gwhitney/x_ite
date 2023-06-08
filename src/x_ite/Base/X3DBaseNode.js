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

import X3DEventObject       from "./X3DEventObject.js";
import X3DFieldDefinition   from "./X3DFieldDefinition.js";
import FieldDefinitionArray from "./FieldDefinitionArray.js";
import FieldArray           from "./FieldArray.js";
import Fields               from "../Fields.js";
import X3DConstants         from "./X3DConstants.js";
import HTMLSupport          from "../Parser/HTMLSupport.js";

const
   _executionContext  = Symbol (),
   _type              = Symbol (),
   _fieldDefinitions  = Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions"),
   _predefinedFields  = Symbol (),
   _userDefinedFields = Symbol (),
   _childObjects      = Symbol (),
   _initialized       = Symbol (),
   _live              = Symbol (),
   _set_live__        = Symbol (),
   _private           = Symbol (),
   _cloneCount        = Symbol ();

function X3DBaseNode (executionContext)
{
   if (this [_executionContext])
      return;

   X3DEventObject .call (this, executionContext .getBrowser ());

   this [_executionContext]  = executionContext;
   this [_type]              = [ X3DConstants .X3DBaseNode ];
   this [_fieldDefinitions]  = this .constructor .fieldDefinitions ?? this [_fieldDefinitions];
   this [_predefinedFields]  = new FieldArray ();
   this [_userDefinedFields] = new FieldArray ();
   this [_childObjects]      = [ ];
   this [_live]              = true;
   this [_initialized]       = false;
   this [_cloneCount]        = 0;

   if (this .canUserDefinedFields ())
      this [_fieldDefinitions] = new FieldDefinitionArray (this [_fieldDefinitions]);

   // Create fields.

   this .addChildObjects ("name_changed",       new Fields .SFTime (),
                          "typeName_changed",   new Fields .SFTime (),
                          "cloneCount_changed", new Fields .SFTime ())

   for (const fieldDefinition of this [_fieldDefinitions])
      this .addPredefinedField (fieldDefinition);
}

Object .assign (Object .setPrototypeOf (X3DBaseNode .prototype, X3DEventObject .prototype),
{
   constructor: X3DBaseNode,
   [_fieldDefinitions]: new FieldDefinitionArray ([ ]),
   setName (value)
   {
      X3DEventObject .prototype .setName .call (this, value)

      this ._name_changed = this .getBrowser () .getCurrentTime ();
   },
   getMainScene ()
   {
      let scene = this [_executionContext] .getScene ();

      while (! scene .isMainScene ())
         scene = scene .getScene ();

      return scene;
   },
   getScene ()
   {
      let executionContext = this [_executionContext];

      while (! executionContext .isScene ())
         executionContext = executionContext .getExecutionContext ();

      return executionContext;
   },
   getExecutionContext ()
   {
      return this [_executionContext];
   },
   setExecutionContext (value)
   {
      // Currently only useful for Scene.
      this [_executionContext] = value;
   },
   addType (value)
   {
      this [_type] .push (value);
   },
   getType ()
   {
      return this [_type];
   },
   getInnerNode ()
   {
      return this;
   },
   isLive ()
   {
      ///  Returns the own live state of this node.

      return this [_live];
   },
   setLive (value)
   {
      ///  Sets the own live state of this node.  Setting the live state to false
      ///  temporarily disables this node completely.

      this [_live] = value .valueOf ();

      this [_set_live__] ();
   },
   getLive: (function ()
   {
      function getLive ()
      {
         return this ._live;
      }

      return function ()
      {
         ///  Returns the live event of this node.

         // Change function.

         Object .defineProperty (this, "getLive", { value: getLive });

         // Add isLive event.

         this .addChildObjects ("live", new Fields .SFBool (this .getLiveState ()));

         // Event processing is done manually and immediately, so:
         this ._live .removeParent (this);

         // Connect to execution context.

         if (this .getOuterNode ?.())
            this .getOuterNode () .getLive () .addInterest (_set_live__, this);

         else if (this [_executionContext] !== this)
            this [_executionContext] .getLive () .addInterest (_set_live__, this);

         // Return field.

         return this ._live;
      };
   })(),
   getLiveState ()
   {
      ///  Determines the live state of this node.

      if (this .getOuterNode ?.())
         return this [_live] && this .getOuterNode () .getLive () .getValue ();

      else if (this !== this [_executionContext])
         return this [_live] && this [_executionContext] .getLive () .getValue ();

      return this [_live];
   },
   [_set_live__] ()
   {
      const live = this ._live;

      if (!live)
         return;

      if (this .getLiveState ())
      {
         if (live .getValue ())
            return;

         live .set (true);
         live .processEvent ();
      }
      else
      {
         if (live .getValue ())
         {
            live .set (false);
            live .processEvent ();
         }
      }
   },
   create (executionContext = this [_executionContext])
   {
      return new (this .constructor) (executionContext);
   },
   setup ()
   {
      Object .freeze (this [_type]);

      this [_fieldDefinitions]  .addParent (this);
      this [_predefinedFields]  .addParent (this);
      this [_userDefinedFields] .addParent (this);

      for (const field of this [_childObjects])
         field .setTainted (false);

      for (const field of this [_predefinedFields])
         field .setTainted (false);

      for (const field of this [_userDefinedFields])
         field .setTainted (false);

      this .initialize ();

      this [_initialized] = true;
   },
   initialize ()
   { },
   isInitialized ()
   {
      return this [_initialized];
   },
   copy (executionContext)
   {
      const copy = this .create (executionContext);

      for (const field of this [_predefinedFields])
         copy .getPredefinedFields () .get (field .getName ()) .assign (field);

      if (this .canUserDefinedFields ())
      {
         for (const field of this [_userDefinedFields])
            copy .addUserDefinedField (field .getAccessType (), field .getName (), field .copy ());
      }

      copy .setup ();

      return copy;
   },
   addChildObjects (/* name, field, ... */)
   {
      for (let i = 0, length = arguments .length; i < length; i += 2)
         this .addChildObject (arguments [i], arguments [i + 1]);
   },
   addChildObject (name, field)
   {
      this [_childObjects] .push (field);

      field .setTainted (true);
      field .addParent (this);
      field .setName (name);

      Object .defineProperty (this, "_" + name,
      {
         get () { return field; },
         set (value) { field .setValue (value); },
      });
   },
   getFieldDefinitions ()
   {
      return this [_fieldDefinitions];
   },
   getField (name)
   {
      const field = getFieldFromArray (this [_userDefinedFields], name)
         ?? getFieldFromArray (this [_predefinedFields], name);

      if (field)
         return field;

      throw new Error ("Unknown field '" + name + "' in node class " + this .getTypeName () + ".");
   },
   getFields ()
   {
      return [... this [_predefinedFields], ... this [_userDefinedFields]];
   },
   addPredefinedField ({ accessType, name, value })
   {
      const field = value .copy ();

      field .setTainted (!this [_initialized]);
      field .addParent (this);
      field .setName (name);
      field .setAccessType (accessType);

      this [_predefinedFields] .add (name, field);

      Object .defineProperty (this, "_" + name,
      {
         get () { return field; },
         set (value) { field .setValue (value); },
			configurable: true,
      });

      if (!this .isPrivate ())
         field .addCloneCount (1);
   },
   addAlias (alias, field)
   {
      this [_predefinedFields] .alias (alias, field .getName ());

      if (field .isInitializable ())
         HTMLSupport .addFieldName (alias);
   },
   removePredefinedField (name)
   {
      const field = this [_predefinedFields] .get (name);

      if (!field)
         return;

      field .removeParent (this);

      this [_predefinedFields] .remove (name);

      delete this ["_" + field .getName ()];

      if (!this .isPrivate ())
         field .removeCloneCount (1);
   },
   getPredefinedField (name)
   {
      const field = getFieldFromArray (this [_predefinedFields], name);

      if (field)
         return field;

      throw new Error ("Unknown field '" + name + "' in node class " + this .getTypeName () + ".");
   },
   getPredefinedFields ()
   {
      return this [_predefinedFields];
   },
   canUserDefinedFields ()
   {
      return false;
   },
   addUserDefinedField (accessType, name, field)
   {
      if (!this .canUserDefinedFields ())
         throw new Error ("Couldn't add user-defined field, node does not support this.");

      if (this [_userDefinedFields] .has (name))
         this .removeUserDefinedField (name);

      field .setTainted (!this [_initialized]);
      field .addParent (this);
      field .setName (name);
      field .setAccessType (accessType);

      this [_fieldDefinitions] .remove (name);

      this [_fieldDefinitions]  .add (name, new X3DFieldDefinition (accessType, name, field));
      this [_userDefinedFields] .add (name, field);

      if (!this .isPrivate ())
         field .addCloneCount (1);
   },
   removeUserDefinedField (name)
   {
      const field = this [_userDefinedFields] .get (name);

      if (!field)
         return;

      field .removeParent (this);

      this [_fieldDefinitions]  .remove (name);
      this [_userDefinedFields] .remove (name);

      if (!this .isPrivate ())
         field .removeCloneCount (1);
   },
   getUserDefinedField (name)
   {
      const field = getFieldFromArray (this [_userDefinedFields], name);

      if (field)
         return field;

      throw new Error ("Unknown field '" + name + "' in node class " + this .getTypeName () + ".");
   },
   getUserDefinedFields ()
   {
      return this [_userDefinedFields];
   },
   getChangedFields (extended)
   {
      /* param routes: also return fields with routes */

      const changedFields = [ ];

      if (extended)
      {
         for (const field of this [_userDefinedFields])
            changedFields .push (field);
      }

      for (const field of this [_predefinedFields])
      {
         if (extended)
         {
            if (field .getInputRoutes () .size || field .getOutputRoutes () .size)
            {
               changedFields .push (field);
               continue;
            }
         }

         if (field .getReferences () .size === 0)
         {
            if (!field .isInitializable ())
               continue;

            if (this .isDefaultValue (field))
               continue;
         }

         changedFields .push (field);
      }

      return changedFields;
   },
   isDefaultValue (field)
   {
      const f = this [_userDefinedFields] .get (field .getName ()) ?? this [_predefinedFields] .get (field .getName ());

      if (f === field)
         var fieldDefinition = this [_fieldDefinitions] .get (field .getName ());
      else if (this .constructor .fieldDefinitions)
         var fieldDefinition = this .constructor .fieldDefinitions .get (field .getName ());

      if (fieldDefinition)
      {
         // User-defined fields are their own field definition value.
         if (fieldDefinition .value === field)
            return false;

         return fieldDefinition .value .equals (field);
      }

      return !field .getModificationTime ();
   },
   hasRoutes ()
   {
      ///  Returns true if there are any routes from or to fields of this node, otherwise false.

      for (const field of this [_predefinedFields])
      {
         if (field .getInputRoutes () .size || field .getOutputRoutes () .size)
            return true;
      }

      for (const field of this [_userDefinedFields])
      {
         if (field .getInputRoutes () .size || field .getOutputRoutes () .size)
            return true;
      }

      return false;
   },
   isPrivate ()
   {
      return this [_private];
   },
   setPrivate (value)
   {
      this [_private] = value;

      if (value)
      {
         for (const field of this [_predefinedFields])
            field .removeCloneCount (1);

         for (const field of this [_userDefinedFields])
            field .removeCloneCount (1);
      }
      else
      {
         for (const field of this [_predefinedFields])
            field .addCloneCount (1);

         for (const field of this [_userDefinedFields])
            field .addCloneCount (1);
      }
   },
   getCloneCount ()
   {
      return this [_cloneCount];
   },
   addCloneCount (count)
   {
      if (count === 0)
         return;

      const time = this .getBrowser () .getCurrentTime ();

      this [_cloneCount] += count;

      this [_executionContext] ._sceneGraph_changed = time;
      this ._cloneCount_changed                     = time;
   },
   removeCloneCount (count)
   {
      if (count === 0)
         return;

      const time = this .getBrowser () .getCurrentTime ();

      this [_cloneCount] -= count;

      this [_executionContext] ._sceneGraph_changed = time;
      this ._cloneCount_changed                     = time;
   },
   dispose ()
   {
      this .setLive (false);

      for (const field of this [_childObjects])
         field .dispose ();

      for (const field of this [_predefinedFields])
         field .dispose ();

      for (const field of this [_userDefinedFields])
         field .dispose ();

      X3DEventObject .prototype .dispose .call (this);
   },
});

const getFieldFromArray = (function ()
{
   const
      set_field     = /^set_(.*?)$/,
      field_changed = /^(.*?)_changed$/;

   return function (array, name)
   {
      const field = array .get (name);

      if (field)
         return field;

      const match = name .match (set_field);

      if (match)
      {
         const field = array .get (match [1]);

         if (field ?.getAccessType () === X3DConstants .inputOutput)
            return field;
      }
      else
      {
         const match = name .match (field_changed);

         if (match)
         {
            const field = array .get (match [1]);

            if (field ?.getAccessType () === X3DConstants .inputOutput)
               return field;
         }
      }
   };
})();

for (const key of Reflect .ownKeys (X3DBaseNode .prototype))
   Object .defineProperty (X3DBaseNode .prototype, key, { enumerable: false });

Object .defineProperties (X3DBaseNode .prototype,
{
   name_changed:
   {
      get () { return this ._name_changed; },
      enumerable: false,
   },
   typeName_changed:
   {
      get () { return this ._typeName_changed; },
      enumerable: false,
   },
   cloneCount_changed:
   {
      get () { return this ._cloneCount_changed; },
      enumerable: false,
   },
});

export default X3DBaseNode;
