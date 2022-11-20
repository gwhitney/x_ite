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

import Fields               from "../../Fields.js";
import X3DFieldDefinition   from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray from "../../Base/FieldDefinitionArray.js";
import X3DGeometryNode      from "../Rendering/X3DGeometryNode.js";
import X3DLineGeometryNode  from "../Rendering/X3DLineGeometryNode.js";
import X3DPointGeometryNode from "../Rendering/X3DPointGeometryNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";

function Disk2D (executionContext)
{
   X3DLineGeometryNode .call (this, executionContext);

   this .addType (X3DConstants .Disk2D);

   this ._innerRadius .setUnit ("length");
   this ._outerRadius .setUnit ("length");
}

Disk2D .prototype = Object .assign (Object .create (X3DGeometryNode .prototype),
{
   constructor: Disk2D,
   [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
      new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "innerRadius", new Fields .SFFloat ()),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "outerRadius", new Fields .SFFloat (1)),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new Fields .SFBool ()),
   ]),
   getTypeName: function ()
   {
      return "Disk2D";
   },
   getComponentName: function ()
   {
      return "Geometry2D";
   },
   getContainerField: function ()
   {
      return "geometry";
   },
   initialize: function ()
   {
      X3DGeometryNode .prototype .initialize .call (this);
   },
   set_live__: function ()
   {
      X3DGeometryNode .prototype .set_live__ .call (this);

      if (this .isLive () .getValue ())
         this .getBrowser () .getDisk2DOptions () .addInterest ("requestRebuild", this);
      else
         this .getBrowser () .getDisk2DOptions () .removeInterest ("requestRebuild", this);
   },
   build: function ()
   {
      const
         browser     = this .getBrowser (),
         gl          = browser .getContext (),
         options     = browser .getDisk2DOptions (),
         innerRadius = Math .min (Math .abs (this ._innerRadius .getValue ()), Math .abs (this ._outerRadius .getValue ())),
         outerRadius = Math .max (Math .abs (this ._innerRadius .getValue ()), Math .abs (this ._outerRadius .getValue ()));

      if (innerRadius === outerRadius)
      {
         const vertexArray = this .getVertices ();

         // Point

         if (outerRadius === 0)
         {
            vertexArray .push (0, 0, 0, 1);

            this .getMin () .set (0, 0, 0);
            this .getMax () .set (0, 0, 0);

            this .setGeometryType (0);
            this .setPrimitiveMode (gl .POINTS);
            this .setTransparent (true);
            this .setBase (X3DPointGeometryNode);
            return;
         }

         // Circle

         if (outerRadius === 1)
         {
            this .setVertices (options .getCircleVertices ());
         }
         else
         {
            const defaultVertices = options .getCircleVertices () .getValue ();

            for (let i = 0, length = defaultVertices .length; i < length; i += 4)
               vertexArray .push (defaultVertices [i] * outerRadius, defaultVertices [i + 1] * outerRadius, 0, 1);
         }

         this .getMin () .set (-outerRadius, -outerRadius, 0);
         this .getMax () .set ( outerRadius,  outerRadius, 0);

         this .setGeometryType (1);
         this .setPrimitiveMode (gl .LINES);
         this .setTransparent (false);
         this .setBase (X3DLineGeometryNode);
         return;
      }

      if (innerRadius === 0)
      {
         // Disk

         this .getMultiTexCoords () .push (options .getDiskTexCoords ());
         this .setNormals (options .getDiskNormals ());

         if (outerRadius === 1)
         {
            this .setVertices (options .getDiskVertices ());
         }
         else
         {
            const
               defaultVertices = options .getDiskVertices () .getValue (),
               vertexArray     = this .getVertices ();

            for (let i = 0, length = defaultVertices .length; i < length; i += 4)
               vertexArray .push (defaultVertices [i] * outerRadius, defaultVertices [i + 1] * outerRadius, 0, 1);
         }

         this .getMin () .set (-outerRadius, -outerRadius, 0);
         this .getMax () .set ( outerRadius,  outerRadius, 0);

         this .setGeometryType (2);
         this .setPrimitiveMode (gl .TRIANGLES);
         this .setTransparent (false);
         this .setSolid (this ._solid .getValue ());
         this .setBase (X3DGeometryNode);
         return;
      }

      // Disk with hole

      const
         scale            = innerRadius / outerRadius,
         offset           = (1 - scale) / 2,
         defaultTexCoords = options .getDiskTexCoords () .getValue (),
         defaultVertices  = options .getDiskVertices () .getValue (),
         texCoordArray    = this .getTexCoords (),
         normalArray      = this .getNormals (),
         vertexArray      = this .getVertices ();

      this .getMultiTexCoords () .push (texCoordArray);

      for (let i = 0, length = defaultVertices .length; i < length; i += 12)
      {
         texCoordArray .push (defaultTexCoords [i + 4] * scale + offset, defaultTexCoords [i + 5] * scale + offset, 0, 1,
                              defaultTexCoords [i + 4], defaultTexCoords [i + 5], 0, 1,
                              defaultTexCoords [i + 8], defaultTexCoords [i + 9], 0, 1,

                              defaultTexCoords [i + 4] * scale + offset, defaultTexCoords [i + 5] * scale + offset, 0, 1,
                              defaultTexCoords [i + 8], defaultTexCoords [i + 9], 0, 1,
                              defaultTexCoords [i + 8] * scale + offset, defaultTexCoords [i + 9] * scale + offset, 0, 1);

         normalArray .push (0, 0, 1,  0, 0, 1,  0, 0, 1,
                            0, 0, 1,  0, 0, 1,  0, 0, 1);

         vertexArray .push (defaultVertices [i + 4] * innerRadius, defaultVertices [i + 5] * innerRadius, 0, 1,
                            defaultVertices [i + 4] * outerRadius, defaultVertices [i + 5] * outerRadius, 0, 1,
                            defaultVertices [i + 8] * outerRadius, defaultVertices [i + 9] * outerRadius, 0, 1,

                            defaultVertices [i + 4] * innerRadius, defaultVertices [i + 5] * innerRadius, 0, 1,
                            defaultVertices [i + 8] * outerRadius, defaultVertices [i + 9] * outerRadius, 0, 1,
                            defaultVertices [i + 8] * innerRadius, defaultVertices [i + 9] * innerRadius, 0, 1);
      }

      this .getMin () .set (-outerRadius, -outerRadius, 0);
      this .getMax () .set ( outerRadius,  outerRadius, 0);

      this .setGeometryType (2);
      this .setPrimitiveMode (gl .TRIANGLES);
      this .setTransparent (false);
      this .setSolid (this ._solid .getValue ());
      this .setBase (X3DGeometryNode);
   },
   setBase: function (base)
   {
      this .intersectsLine   = base .prototype .intersectsLine;
      this .intersectsBox    = base .prototype .intersectsBox;
      this .display          = base .prototype .display;
      this .displayParticles = base .prototype .displayParticles;
   },
   updateRenderFunctions: function ()
   { },
});

export default Disk2D;
