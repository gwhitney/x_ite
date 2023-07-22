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

import Fields                  from "../../Fields.js";
import X3DFieldDefinition      from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray    from "../../Base/FieldDefinitionArray.js";
import X3DChildNode            from "../Core/X3DChildNode.js";
import X3DConstants            from "../../Base/X3DConstants.js";
import TimeSensor              from "../Time/TimeSensor.js";
import PositionInterpolator    from "../Interpolation/PositionInterpolator.js";
import OrientationInterpolator from "../Interpolation/OrientationInterpolator.js";
import Vector3                 from "../../../standard/Math/Numbers/Vector3.js";
import Rotation4               from "../../../standard/Math/Numbers/Rotation4.js";

function HAnimMotion (executionContext)
{
   X3DChildNode .call (this, executionContext);

   this .addType (X3DConstants .HAnimMotion);

   this .timeSensor    = new TimeSensor (this .getExecutionContext ());
   this .interpolators = [ ];
   this .jointNodes    = new Map ();
}

Object .assign (Object .setPrototypeOf (HAnimMotion .prototype, X3DChildNode .prototype),
{
   initialize ()
   {
      X3DChildNode .prototype .initialize .call (this);

      this ._enabled .addFieldInterest (this .timeSensor ._enabled);

      this .timeSensor ._cycleTime   .addFieldInterest (this ._cycleTime);
      this .timeSensor ._elapsedTime .addFieldInterest (this ._elapsedTime);

      // this .timeSensor ._cycleInterval = 10;
      // this .timeSensor ._loop = true;

      this .timeSensor .setup ();

      this ._channels .addInterest ("set_interpolators__", this);
      this ._values   .addInterest ("set_interpolators__", this);

      this .set_interpolators__ ();
   },
   setJoints (jointNodes)
   {
      // Disconnect old joint nodes.

      for (const { positionInterpolator, orientationInterpolator } of this .interpolators)
      {
         if (positionInterpolator)
         {
            for (const field of positionInterpolator ._value_changed .getFieldInterests ())
               positionInterpolator ._value_changed .removeFieldInterest (field);
         }

         if (orientationInterpolator)
         {
            for (const field of orientationInterpolator ._value_changed .getFieldInterests ())
               orientationInterpolator ._value_changed .removeFieldInterest (field);
         }
      }

      // Create joints map.

      this .jointNodes .clear ();

      jointNodes .forEach (jointNode => this .jointNodes .set (jointNode ._name .getValue (), jointNode));

      // Connect joints.

      this .set_joints__ ();
   },
   set_interpolators__ ()
   {
      const timeSensor = this .timeSensor;

      for (const field of timeSensor ._fraction_changed .getFieldInterests ())
         timeSensor ._fraction_changed .removeFieldInterest (field);

      const channels = this ._channels .getValue ()
         .replace (/^[\s,\d]+|[\s,\d]+$/sg, "")
         .split (/[\s,]+\d+[\s,]+/s)
         .map (string => string .split (/[\s,]+/s));

      const
         values        = this ._values,
         frameCount    = values .length / channels .reduce ((v, c) => v + c .length, 0),
         types         = new Map (),
         interpolators = Array .from ({length: channels .length}, () => new Object ());

      this .interpolators = interpolators;

      for (let frame = 0, v = 0; frame < frameCount; ++ frame)
      {
         for (const [j, joint] of channels .entries ())
         {
            types .clear ();

            for (const channel of joint)
               types .set (channel, values [v ++]);

            if (types .has ("Xposition") || types .has ("Yposition") || types .has ("Zposition"))
            {
               const interpolator = interpolators [j] .positionInterpolator
                  ?? this .createPositionInterpolator (interpolators, j);

               const
                  key      = frame / (frameCount - 1),
                  keyValue = new Vector3 (types .get ("Xposition") ?? 0,
                                          types .get ("Yposition") ?? 0,
                                          types .get ("Zposition") ?? 0);

               interpolator ._key      .push (key);
               interpolator ._keyValue .push (keyValue);
            }

            if (types .has ("Xrotation") || types .has ("Yrotation") || types .has ("Zrotation"))
            {
               const interpolator = interpolators [j] .orientationInterpolator
                  ?? this .createOrientationInterpolator (interpolators, j);

               const
                  key      = frame / (frameCount - 1),
                  keyValue = Rotation4 .fromEuler (types .get ("Xrotation") ?? 0,
                                                   types .get ("Yrotation") ?? 0,
                                                   types .get ("Zrotation") ?? 0);

               interpolator ._key      .push (key);
               interpolator ._keyValue .push (keyValue);
            }
         }
      }

      for (const { positionInterpolator, orientationInterpolator } of interpolators)
      {
         positionInterpolator    ?.setup ();
         orientationInterpolator ?.setup ();
      }

      this .set_joints__ ();

      this ._frameCount = frameCount;
   },
   set_joints__ ()
   {
      const
         timeSensor      = this .timeSensor,
         channelsEnabled = this ._channelsEnabled,
         joints          = this ._joints .getValue () .trim () .split (/[\s,]+/),
         jointNodes      = this .jointNodes;

      if (!jointNodes .size)
         return;

      for (const [i, { positionInterpolator, orientationInterpolator }] of this .interpolators .entries ())
      {
         if (i < channelsEnabled .length && !channelsEnabled [i])
            continue;

         if (i >= joints .length)
            continue;

         const jointNode = jointNodes .get (joints [i]);

         if (!jointNode)
            continue;

         if (positionInterpolator)
         {
            timeSensor ._fraction_changed .addFieldInterest (positionInterpolator ._set_fraction);
            positionInterpolator ._value_changed .addFieldInterest (jointNode ._translation);
         }

         if (orientationInterpolator)
         {
            timeSensor ._fraction_changed .addFieldInterest (orientationInterpolator ._set_fraction);
            orientationInterpolator ._value_changed .addFieldInterest (jointNode ._rotation);
         }
      }
   },
   createPositionInterpolator (interpolators, j)
   {
      return interpolators [j] .positionInterpolator = new PositionInterpolator (this .getExecutionContext ());
   },
   createOrientationInterpolator (interpolators, j)
   {
      return interpolators [j] .orientationInterpolator = new OrientationInterpolator (this .getExecutionContext ());
   },
});

Object .defineProperties (HAnimMotion,
{
   typeName:
   {
      value: "HAnimMotion",
      enumerable: true,
   },
   componentName:
   {
      value: "HAnim",
      enumerable: true,
   },
   containerField:
   {
      value: "motions",
      enumerable: true,
   },
   specificationRange:
   {
      value: Object .freeze (["4.0", "Infinity"]),
      enumerable: true,
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "description",     new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",         new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "loa",             new Fields .SFInt32 (-1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "channelsEnabled", new Fields .MFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "channels",        new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "joints",          new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "values",          new Fields .MFFloat ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "startFrame",      new Fields .SFInt32 ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "endFrame",        new Fields .SFInt32 ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "frameIndex",      new Fields .SFInt32 (0)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "frameDuration",   new Fields .SFTime (0.1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "frameIncrement",  new Fields .SFInt32 (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "loop",            new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,   "next",            new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,   "previous",        new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,  "cycleTime",       new Fields .SFTime ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,  "elapsedTime",     new Fields .SFTime ()),
         new X3DFieldDefinition (X3DConstants .outputOnly,  "frameCount",      new Fields .SFInt32 ()),
      ]),
      enumerable: true,
   },
});

export default HAnimMotion;
