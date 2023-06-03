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
import X3DFieldDefinition   from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray from "../../Base/FieldDefinitionArray.js";
import X3DTexture3DNode     from "./X3DTexture3DNode.js";
import X3DUrlObject         from "../Networking/X3DUrlObject.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import NRRDParser           from "../../Browser/Texturing3D/NRRDParser.js";
import DICOMParser          from "../../Browser/Texturing3D/DICOMParser.js";
import FileLoader           from "../../InputOutput/FileLoader.js";

function ImageTexture3D (executionContext)
{
   X3DTexture3DNode .call (this, executionContext);
   X3DUrlObject     .call (this, executionContext);

   this .addType (X3DConstants .ImageTexture3D);
}

ImageTexture3D .prototype = Object .assign (Object .create (X3DTexture3DNode .prototype),
   X3DUrlObject .prototype,
{
   constructor: ImageTexture3D,
   initialize: function ()
   {
      X3DTexture3DNode .prototype .initialize .call (this);
      X3DUrlObject     .prototype .initialize .call (this);

      this .requestImmediateLoad () .catch (Function .prototype);
   },
   getInternalType: function (components)
   {
      const gl = this .getBrowser () .getContext ();

      switch (components)
      {
         case 1:
            return gl .LUMINANCE;
         case 2:
            return gl .LUMINANCE_ALPHA;
         case 3:
            return gl .RGB;
         case 4:
            return gl .RGBA;
      }
   },
   unloadData: function ()
   {
      this .clearTexture ();
   },
   loadData: function ()
   {
      new FileLoader (this) .loadDocument (this ._url,
      function (data)
      {
         if (data === null)
         {
            // No URL could be loaded.
            this .setLoadState (X3DConstants .FAILED_STATE);
            this .clearTexture ();
         }
         else if (data instanceof ArrayBuffer)
         {
            const nrrd = new NRRDParser () .parse (data);

            if (nrrd .nrrd)
            {
               const internalType = this .getInternalType (nrrd .components);

               this .setTexture (nrrd .width, nrrd .height, nrrd .depth, false, internalType, nrrd .data);
               this .setLoadState (X3DConstants .COMPLETE_STATE);
               return;
            }

            const dicom = new DICOMParser () .parse (data);

            if (dicom .dicom)
            {
               const internalType = this .getInternalType (dicom .components);

               this .setTexture (dicom .width, dicom .height, dicom .depth, false, internalType, dicom .data);
               this .setLoadState (X3DConstants .COMPLETE_STATE);
               return;
            }

            throw new Error ("ImageTexture3D: no appropriate file type handler found.");
         }
      }
      .bind (this));
   },
   dispose: function ()
   {
      X3DUrlObject     .prototype .dispose .call (this);
      X3DTexture3DNode .prototype .dispose .call (this);
   },
});

Object .defineProperties (ImageTexture3D,
{
   typeName:
   {
      value: "ImageTexture3D",
      enumerate: true,
   },
   componentName:
   {
      value: "Texturing3D",
      enumerate: true,
   },
   containerField:
   {
      value: "texture",
      enumerate: true,
   },
   specificationRange:
   {
      value: Object .freeze (["3.1", "Infinity"]),
      enumerate: true,
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",             new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "description",          new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "load",                 new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "url",                  new Fields .MFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "autoRefresh",          new Fields .SFTime ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "autoRefreshTimeLimit", new Fields .SFTime (3600)),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",              new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",              new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatR",              new Fields .SFBool ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties",    new Fields .SFNode ()),
      ]),
      enumerate: true,
   },
});

export default ImageTexture3D;
