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

import NodeTypeArray from "./NodeTypeArray.js";
import X3DConstants  from "../Base/X3DConstants.js";
import HTMLSupport   from "../Parser/HTMLSupport.js";

const _fieldDefinitions = Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions");

const
   nodeTypes         = new NodeTypeArray (),
   abstractNodeTypes = new NodeTypeArray ();

let nodeType = X3DConstants .X3DBaseNode;

const SupportedNodes =
{
   addNodeType: function (typeName, Type)
   {
      X3DConstants [typeName] = ++ nodeType; // Start with 1, as X3DBaseNode is 0.

      nodeTypes .add (typeName, Type);

      HTMLSupport .addNodeTypeName (typeName);

      // HTML Support

      for (const { name, accessType } of Type .prototype [_fieldDefinitions])
      {
         if (accessType & X3DConstants .initializeOnly)
            HTMLSupport .addFieldName (name)
      }
   },
   getNodeType: function (typeName)
   {
      return nodeTypes .get (typeName);
   },
   getNodeTypes ()
   {
      return nodeTypes;
   },
   addAbstractNodeType: function (typeName, Type)
   {
      X3DConstants [typeName] = ++ nodeType;

      abstractNodeTypes .add (typeName, Type);
   },
   getAbstractNodeType: function (typeName)
   {
      return abstractNodeTypes .get (typeName);
   },
   getAbstractNodeTypes ()
   {
      return abstractNodeTypes;
   },
};

export default SupportedNodes;
