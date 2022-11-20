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
 * along with X_ITE.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/

import Fields                        from "../../Fields.js";
import X3DFieldDefinition            from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray          from "../../Base/FieldDefinitionArray.js";
import X3DInterpolatorNode           from "./X3DInterpolatorNode.js";
import CatmullRomSplineInterpolator1 from "../../Browser/Interpolation/CatmullRomSplineInterpolator1.js";
import X3DConstants                  from "../../Base/X3DConstants.js";

function SplineScalarInterpolator (executionContext)
{
   X3DInterpolatorNode .call (this, executionContext);

   this .addType (X3DConstants .SplineScalarInterpolator);

   this .spline = new CatmullRomSplineInterpolator1 ();
}

SplineScalarInterpolator .prototype = Object .assign (Object .create (X3DInterpolatorNode .prototype),
{
   constructor: SplineScalarInterpolator,
   [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
      new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new Fields .SFNode ()),
      new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",      new Fields .SFFloat ()),
      new X3DFieldDefinition (X3DConstants .inputOutput, "closed",            new Fields .SFBool ()),
      new X3DFieldDefinition (X3DConstants .inputOutput, "key",               new Fields .MFFloat ()),
      new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",          new Fields .MFFloat ()),
      new X3DFieldDefinition (X3DConstants .inputOutput, "keyVelocity",       new Fields .MFFloat ()),
      new X3DFieldDefinition (X3DConstants .inputOutput, "normalizeVelocity", new Fields .SFBool ()),
      new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed",     new Fields .SFFloat ()),
   ]),
   getTypeName: function ()
   {
      return "SplineScalarInterpolator";
   },
   getComponentName: function ()
   {
      return "Interpolation";
   },
   getContainerField: function ()
   {
      return "children";
   },
   initialize: function ()
   {
      X3DInterpolatorNode .prototype .initialize .call (this);

      this ._keyValue          .addInterest ("set_keyValue__",          this);
      this ._keyVelocity       .addInterest ("set_keyVelocity__",       this);
      this ._normalizeVelocity .addInterest ("set_normalizeVelocity__", this);
   },
   set_keyValue__: function ()
   {
      const
         key      = this ._key,
         keyValue = this ._keyValue;

      if (keyValue .length < key .length)
         keyValue .resize (key .length, keyValue .length ? keyValue [keyValue .length - 1] : new Fields .SFFloat ());

      this .set_keyVelocity__ ();
   },
   set_keyVelocity__: function ()
   {
      if (this ._keyVelocity .length)
      {
         if (this ._keyVelocity .length < this ._key .length)
            this ._keyVelocity .resize (this ._key .length, new Fields .SFFloat ());
      }

      this .set_normalizeVelocity__ ();
   },
   set_normalizeVelocity__: function ()
   {
      this .spline .generate (this ._closed .getValue (),
                              this ._key,
                              this ._keyValue,
                              this ._keyVelocity,
                              this ._normalizeVelocity .getValue ());
   },
   interpolate: function (index0, index1, weight)
   {
      this ._value_changed = this .spline .interpolate (index0, index1, weight, this ._keyValue);
   },
});

export default SplineScalarInterpolator;
