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

import Vector2 from "../../../standard/Math/Numbers/Vector2.js";
import Vector3 from "../../../standard/Math/Numbers/Vector3.js";
import Vector4 from "../../../standard/Math/Numbers/Vector4.js";

const NURBS = {
   getTessellation (tessellation, dimension)
   {
      if (tessellation > 0)
         return tessellation + 1;

      if (tessellation < 0)
         return -tessellation * dimension + 1;

      return 2 * dimension + 1;
   },
   getClosed2D (order, knot, weight, controlPoint)
   {
      const
         dimension   = controlPoint .length,
         haveWeights = weight .length === dimension;

      // Check if first and last weights are unitary.

      if (haveWeights)
      {
         if (weight [0] !== weight [dimension - 1])
            return false;
      }

      // Check if first and last point are coincident.

      if (! controlPoint [0] .equals (controlPoint [dimension - 1]))
         return false;

      // Check if knots are periodic.

      if (! this .isPeriodic (order, dimension, knot))
         return false;

      return true;
   },
   getClosed: (() =>
   {
      const
         firstPoint = new Vector3 (0, 0, 0),
         lastPoint  = new Vector3 (0, 0, 0);

      return function (order, knot, weight, controlPointNode)
      {
         const
            dimension   = controlPointNode .getSize (),
            haveWeights = weight .length === dimension;

         // Check if first and last weights are unitary.

         if (haveWeights)
         {
            if (weight [0] !== weight [dimension - 1])
               return false;
         }

         // Check if first and last point are coincident.

         if (! controlPointNode .get1Point (0, firstPoint) .equals (controlPointNode .get1Point (dimension - 1, lastPoint)))
            return false;

         // Check if knots are periodic.

         if (! this .isPeriodic (order, dimension, knot))
            return false;

         return true;
      };
   })(),
   getUClosed: (() =>
   {
      const
         firstPoint = new Vector3 (0, 0, 0),
         lastPoint  = new Vector3 (0, 0, 0);

      return function (uOrder, uDimension, vDimension, uKnot, weight, controlPointNode)
      {
         const haveWeights = weight .length === controlPointNode .getSize ();

         for (let v = 0, length = vDimension; v < length; ++ v)
         {
            const
               first = v * uDimension,
               last  = v * uDimension + uDimension - 1;

            // Check if first and last weights are unitary.

            if (haveWeights)
            {
               if (weight [first] !== weight [last])
                  return false;
            }

            // Check if first and last point are coincident.

            if (! controlPointNode .get1Point (first, firstPoint) .equals (controlPointNode .get1Point (last, lastPoint)))
               return false;
         }

         // Check if knots are periodic.

         if (! this .isPeriodic (uOrder, uDimension, uKnot))
            return false;

         return true;
      };
   })(),
   getVClosed: (() =>
   {
      const
         firstPoint = new Vector3 (0, 0, 0),
         lastPoint  = new Vector3 (0, 0, 0);

      return function (vOrder, uDimension, vDimension, vKnot, weight, controlPointNode)
      {
         const haveWeights = weight .length === controlPointNode .getSize ();

         for (let u = 0, size = uDimension; u < size; ++ u)
         {
            const
               first = u,
               last  = (vDimension - 1) * uDimension + u;

            // Check if first and last weights are unitary.

            if (haveWeights)
            {
               if (weight [first] !== weight [last])
                  return false;
            }

            // Check if first and last point are coincident.

            if (! controlPointNode .get1Point (first, firstPoint) .equals (controlPointNode .get1Point (last, lastPoint)))
               return false;
         }

         // Check if knots are periodic.

         if (! this .isPeriodic (vOrder, vDimension, vKnot))
            return false;

         return true;
      };
   })(),
   isPeriodic (order, dimension, knot)
   {
      // Check if knots are periodic.

      if (knot .length === dimension + order)
      {
         {
            let count = 1;

            for (let i = 1, size = order; i < size; ++ i)
            {
               count += knot [i] === knot [0];
            }

            if (count === order)
               return false;
         }

         {
            let count = 1;

            for (let i = knot .length - order, size = knot .length - 1; i < size; ++ i)
            {
               count += knot [i] === knot [size];
            }

            if (count === order)
               return false;
         }
      }

      return true;
   },
   getKnots (result, closed, order, dimension, knot)
   {
      const knots = result || [ ];

      for (let i = 0, length = knot .length; i < length; ++ i)
         knots [i] = knot [i];

      knots .length = knot .length;

      // check the knot-vectors. If they are not according to standard
      // default uniform knot vectors will be generated.

      let generateUniform = true;

      if (knots .length === dimension + order)
      {
         generateUniform = false;

         let consecutiveKnots = 0;

         for (let i = 1, length = knots .length; i < length; ++ i)
         {
            if (knots [i] == knots [i - 1])
               ++ consecutiveKnots;
            else
               consecutiveKnots = 0;

            if (consecutiveKnots > order - 1)
               generateUniform = true;

            if (knots [i - 1] > knots [i])
               generateUniform = true;
         }
      }

      if (generateUniform)
      {
         for (let i = 0, length = dimension + order; i < length; ++ i)
            knots [i] = i / (length - 1);
      }

      if (closed)
      {
         for (let i = 1, length = order - 1; i < length; ++ i)
            knots .push (knots .at (-1) + (knots [i] - knots [i - 1]));
      }

      return knots;
   },
   getWeights (result, dimension, weight)
   {
      if (weight .length !== dimension)
         return undefined;

      const weights = result || [ ];

      for (let i = 0; i < dimension; ++ i)
      {
         weights [i] = weight [i];
      }

      weights .length = dimension;

      return weights;
   },
   getUVWeights (result, uDimension, vDimension, weight)
   {
      const dimension = uDimension * vDimension;

      if (weight .length !== dimension)
         return undefined;

      const weights = result || [ ];

      for (let u = 0, i = 0; u < uDimension; ++ u)
      {
         for (let v = 0; v < vDimension; ++ v, ++ i)
         {
            weights [i] = weight [i];
         }
      }

      weights .length = dimension;

      return weights;
   },
   getControlPoints2D (result, closed, order, weights, controlPoint)
   {
      const
         controlPoints     = result || [ ],
         controlPointArray = controlPoint .getValue (),
         dimension         = controlPoint .length,
         haveWeights       = !! weights,
         Vector            = haveWeights ? Vector3 : Vector2;

      if (controlPoints .haveWeights !== haveWeights)
      {
         controlPoints .haveWeights = haveWeights;
         controlPoints .length      = 0;
      }

      for (let i = 0; i < dimension; ++ i)
      {
         const
            i2 = i * 2,
            p  = controlPoints [i] || new Vector (0, 0, 0);

         controlPoints [i] = p .set (controlPointArray [i2 + 0], controlPointArray [i2 + 1], haveWeights ? weights [i] : 0);
      }

      controlPoints .length = dimension;

      if (closed)
      {
         for (let i = 1, size = order - 1; i < size; ++ i)
            controlPoints .push (controlPoints [i]);
      }

      return controlPoints;
   },
   getControlPoints (result, closed, order, weights, controlPointNode)
   {
      const
         controlPoints = result || [ ],
         dimension     = controlPointNode .getSize (),
         haveWeights   = !! weights,
         Vector        = haveWeights ? Vector4 : Vector3;

      if (controlPoints .haveWeights !== haveWeights)
      {
         controlPoints .haveWeights = haveWeights;
         controlPoints .length      = 0;
      }

      for (let i = 0; i < dimension; ++ i)
      {
         const cp = controlPoints [i] = controlPointNode .get1Point (i, controlPoints [i] || new Vector (0, 0, 0, 0));

         if (haveWeights)
            cp .w = weights [i];
      }

      controlPoints .length = dimension;

      if (closed)
      {
         for (let i = 1, size = order - 1; i < size; ++ i)
            controlPoints .push (controlPoints [i]);
      }

      return controlPoints;
   },
   getUVControlPoints (result, uClosed, vClosed, uOrder, vOrder, uDimension, vDimension, weights, controlPointNode)
   {
      const
         controlPoints = result || [ ],
         haveWeights   = !! weights,
         Vector        = haveWeights ? Vector4 : Vector3;

      if (controlPoints .haveWeights !== haveWeights)
      {
         controlPoints .haveWeights = haveWeights;
         controlPoints .length      = 0;
      }

      for (let u = 0; u < uDimension; ++ u)
      {
         let cp = controlPoints [u];

         if (! cp)
            cp = controlPoints [u] = [ ];

         for (let v = 0; v < vDimension; ++ v)
         {
            const index = v * uDimension + u;

            cp [v] = controlPointNode .get1Point (index, cp [v] || new Vector (0, 0, 0, 0));

            if (haveWeights)
               cp [v] .w = weights [index];
         }

         cp .length = vDimension;

         if (vClosed)
         {
            for (let i = 1, length = vOrder - 1; i < length; ++ i)
               cp .push (cp [i]);
         }
      }

      controlPoints .length = uDimension;

      if (uClosed)
      {
         for (let i = 1, length = uOrder - 1; i < length; ++ i)
            controlPoints .push (controlPoints [i]);
      }

      return controlPoints;
   },
   getTexControlPoints (result, uClosed, vClosed, uOrder, vOrder, uDimension, vDimension, controlPointNode)
   {
      const controlPoints = result || [ ];

      for (let u = 0; u < uDimension; ++ u)
      {
         let cp = controlPoints [u];

         if (! cp)
            cp = controlPoints [u] = [ ];

         for (let v = 0; v < vDimension; ++ v)
         {
            const index = v * uDimension + u;

            cp [v] = controlPointNode .get1Point (index, cp [v] || new Vector4 (0, 0, 0, 0));
         }

         cp .length = vDimension;

         if (vClosed)
         {
            for (let i = 1, length = vOrder - 1; i < length; ++ i)
               cp .push (cp [i]);
         }
      }

      controlPoints .length = uDimension;

      if (uClosed)
      {
         for (let i = 1, length = uOrder - 1; i < length; ++ i)
            controlPoints .push (controlPoints [i]);
      }

      return controlPoints;
   },
};

export default NURBS;
