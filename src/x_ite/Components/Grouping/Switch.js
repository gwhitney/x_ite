/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
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
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
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


define ([
	"x_ite/Fields",
	"x_ite/Basic/X3DFieldDefinition",
	"x_ite/Basic/FieldDefinitionArray",
	"x_ite/Components/Grouping/X3DGroupingNode",
	"x_ite/Bits/TraverseType",
	"x_ite/Bits/X3DCast",
	"x_ite/Bits/X3DConstants",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode,
          TraverseType,
          X3DCast,
          X3DConstants)
{
"use strict";

	function Switch (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .Switch);

		if (executionContext .getSpecificationVersion () == "2.0")
			this .addAlias ("choice", this .children_);

		this .childNode     = null;
		this .visibleNode   = null;
		this .boundedObject = null;
	}

	Switch .prototype = Object .assign (Object .create (X3DGroupingNode .prototype),
	{
		constructor: Switch,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "whichChoice",    new Fields .SFInt32 (-1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "visible",        new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "bboxDisplay",    new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "Switch";
		},
		getComponentName: function ()
		{
			return "Grouping";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DGroupingNode .prototype .initialize .call (this);

			this .whichChoice_ .addInterest ("set_child__", this);
			this .children_    .addInterest ("set_child__", this);

			this .set_child__ ();
		},
		getSubBBox: function (bbox, shadow)
		{
			if (this .bboxSize_ .getValue () .equals (this .getDefaultBBoxSize ()))
			{
				const boundedObject = X3DCast (X3DConstants .X3DBoundedObject, this .visibleNode);

				if (boundedObject)
					return boundedObject .getBBox (bbox, shadow);

				return bbox .set ();
			}

			return bbox .set (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
		},
		clear: function () { },
		add: function () { },
		remove: function () { },
		set_child__: function ()
		{
			if (this .childNode)
			{
				this .childNode .isCameraObject_   .removeInterest ("set_cameraObject__",     this);
				this .childNode .isPickableObject_ .removeInterest ("set_transformSensors__", this);
			}

			if (X3DCast (X3DConstants .X3DBoundedObject, this .childNode))
			{
				this .childNode .visible_     .removeInterest ("set_visible__",     this);
				this .childNode .bboxDisplay_ .removeInterest ("set_bboxDisplay__", this);
			}

			const whichChoice = this .whichChoice_ .getValue ();

			if (whichChoice >= 0 && whichChoice < this .children_ .length)
			{
				this .childNode = X3DCast (X3DConstants .X3DChildNode, this .children_ [whichChoice]);

				if (this .childNode)
				{
					this .childNode .isCameraObject_   .addInterest ("set_cameraObject__",     this);
					this .childNode .isPickableObject_ .addInterest ("set_transformSensors__", this);

					if (X3DCast (X3DConstants .X3DBoundedObject, this .childNode))
					{
						this .childNode .visible_     .addInterest ("set_visible__",     this);
						this .childNode .bboxDisplay_ .addInterest ("set_bboxDisplay__", this);
					}

					delete this .traverse;
				}
			}
			else
			{
				this .childNode = null;

				this .traverse = Function .prototype;
			}

			this .set_transformSensors__ ();
			this .set_visible__ ();
			this .set_bboxDisplay__ ();
		},
		set_cameraObject__: function ()
		{
			if (this .childNode && this .childNode .getCameraObject ())
			{
				if (X3DCast (X3DConstants .X3DBoundedObject, this .childNode))
				{
					this .setCameraObject (this .childNode .visible_ .getValue ());
				}
				else
				{
					this .setCameraObject (true);
				}
			}
			else
			{
				this .setCameraObject (false);
			}
		},
		set_transformSensors__: function ()
		{
			this .setPickableObject (Boolean (this .getTransformSensors () .size || this .childNode && this .childNode .getPickableObject ()));
		},
		set_visible__: function ()
		{
			if (X3DCast (X3DConstants .X3DBoundedObject, this .childNode))
			{
				this .visibleNode = this .childNode .visible_ .getValue () ? this .childNode : null;
			}
			else
			{
				this .visibleNode = this .childNode;
			}

			this .set_cameraObject__ ();
		},
		set_bboxDisplay__: function ()
		{
			if (X3DCast (X3DConstants .X3DBoundedObject, this .childNode))
			{
				this .boundedObject = this .childNode .bboxDisplay_ .getValue () ? this .childNode : null;
			}
			else
			{
				this .boundedObject = null;
			}
		},
		traverse: function (type, renderObject)
		{
			switch (type)
			{
				case TraverseType .POINTER:
				case TraverseType .CAMERA:
				case TraverseType .SHADOW:
				{
					const visibleNode = this .visibleNode;

					if (visibleNode)
						visibleNode .traverse (type, renderObject);

					return;
				}
				case TraverseType .PICKING:
				{
					if (this .getTransformSensors () .size)
					{
						const modelMatrix = renderObject .getModelViewMatrix () .get ();

						this .getTransformSensors () .forEach (function (transformSensorNode)
						{
							transformSensorNode .collect (modelMatrix);
						});
					}

					const childNode = this .childNode;

					if (childNode)
					{
						const
							browser          = renderObject .getBrowser (),
							pickingHierarchy = browser .getPickingHierarchy ();

						pickingHierarchy .push (this);

						childNode .traverse (type, renderObject);

						pickingHierarchy .pop ();
					}

					return;
				}
				case TraverseType .COLLISION:
				{
					const childNode = this .childNode;

					if (childNode)
						childNode .traverse (type, renderObject);

					return;
				}
				case TraverseType .DISPLAY:
				{
					const visibleNode = this .visibleNode;

					if (visibleNode)
						visibleNode .traverse (type, renderObject);

					const boundedObject = this .boundedObject;

					if (boundedObject)
						boundedObject .displayBBox (type, renderObject);

					return;
				}
			}
		},
	});

	return Switch;
});
