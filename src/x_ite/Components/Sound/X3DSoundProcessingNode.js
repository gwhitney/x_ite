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

import Fields               from "../../Fields.js";
import X3DChildNode         from "../Core/X3DChildNode.js";
import X3DTimeDependentNode from "../Time/X3DTimeDependentNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import X3DCast              from "../../Base/X3DCast.js";

function X3DSoundProcessingNode (executionContext)
{
   X3DChildNode         .call (this, executionContext);
   X3DTimeDependentNode .call (this, executionContext);

   this .addType (X3DConstants .X3DSoundProcessingNode);

   this .addChildObjects (X3DConstants .inputOutput, "loop",   new Fields .SFBool (true),
                          X3DConstants .inputOutput, "active", new Fields .SFBool ());

   const audioContext = this .getBrowser () .getAudioContext ();

   this .childNodes = [ ];
   this .gainNode   = new GainNode (audioContext);
}

Object .assign (Object .setPrototypeOf (X3DSoundProcessingNode .prototype, X3DChildNode .prototype),
   X3DTimeDependentNode .prototype,
{
   initialize ()
   {
      X3DChildNode         .prototype .initialize .call (this);
      X3DTimeDependentNode .prototype .initialize .call (this);

      this ._active                .addInterest ("set_gain__",                  this);
      this ._gain                  .addInterest ("set_gain__",                  this);
      this ._channelCount          .addInterest ("set_channelCount__",          this);
      this ._channelCountMode      .addInterest ("set_channelCountMode__",      this);
      this ._channelInterpretation .addInterest ("set_channelInterpretation__", this);
      this ._children              .addInterest ("set_children__",              this);
      this ._active                .addInterest ("set_active__",                this);

      this .set_gain__ ();
      this .set_channelCount__ ();
      this .set_channelCountMode__ ();
      this .set_channelInterpretation__ ();
      this .set_children__ ();
   },
   getAudioSource ()
   {
      return this .gainNode;
   },
   getSoundProcessor ()
   {
      return this .gainNode;
   },
   set_gain__ ()
   {
      this .gainNode .gain .value = this ._active .getValue () ? this ._gain .getValue () : 1;
   },
   set_channelCount__ ()
   {
      this .getSoundProcessor () .channelCount = Math .max (this ._channelCount .getValue (), 1);
   },
   set_channelCountMode__: (function ()
   {
      const channelCountModes = new Set (["max", "clamped-max", "explicit"]);

      return function ()
      {
         const channelCountMode = this ._channelCountMode .getValue () .toLowerCase () .replaceAll ("_", "-");

         this .getSoundProcessor () .channelCountMode = channelCountModes .has (channelCountMode) ? channelCountMode : "max";
      };
   })(),
   set_channelInterpretation__: (function ()
   {
      const channelInterpretations = new Set (["speakers", "discrete"]);

      return function ()
      {
         const channelInterpretation = this ._channelInterpretation .getValue () .toLowerCase ();

         this .getSoundProcessor () .channelInterpretation = channelInterpretations .has (channelInterpretation) ? channelInterpretation : "speakers";
      };
   })(),
   set_children__ ()
   {
      this .set_disconnect__ ();

      this .childNodes .length = 0;

      for (const child of this ._children)
      {
         const childNode = X3DCast (X3DConstants .X3DChildNode, child);

         if (!childNode)
            continue;

         const type = childNode .getType ();

         for (let t = type .length - 1; t >= 0; -- t)
         {
            switch (type [t])
            {
               case X3DConstants .X3DSoundChannelNode:
               case X3DConstants .X3DSoundProcessingNode:
               case X3DConstants .X3DSoundSourceNode:
                  this .childNodes .push (childNode);
                  break;
               default:
                  continue;
            }

            break;
         }
      }

      this .set_active__ ();
   },
   set_disconnect__ ()
   {
      for (const childNode of this .childNodes)
         $.try (() => childNode .getAudioSource () .disconnect (this .gainNode));

      for (const childNode of this .childNodes)
         $.try (() => childNode .getAudioSource () .disconnect (this .getSoundProcessor ()));
   },
   set_active__ ()
   {
      this .set_disconnect__ ();

      if (this ._active .getValue ())
      {
         for (const childNode of this .childNodes)
            $.try (() => childNode .getAudioSource () .connect (this .getSoundProcessor ()), true);
      }
      else
      {
         for (const childNode of this .childNodes)
            $.try (() => childNode .getAudioSource () .connect (this .gainNode), true);
      }
   },
   set_start ()
   {
      if (!this ._active .getValue ())
         this ._active = true;
   },
   set_pause ()
   {
      if (this ._active .getValue ())
         this ._active = false;
   },
   set_resume ()
   {
      if (!this ._active .getValue ())
         this ._active = true;
   },
   set_stop ()
   {
      if (this ._active .getValue ())
         this ._active = false;
   },
   set_time ()
   {
      this ._elapsedTime = this .getElapsedTime ();
   },
   dispose ()
   {
      X3DTimeDependentNode .prototype .dispose .call (this);
      X3DChildNode         .prototype .dispose .call (this);
   },
});

Object .defineProperties (X3DSoundProcessingNode,
{
   typeName:
   {
      value: "X3DSoundProcessingNode",
      enumerable: true,
   },
   componentName:
   {
      value: "Sound",
      enumerable: true,
   },
});

export default X3DSoundProcessingNode;
