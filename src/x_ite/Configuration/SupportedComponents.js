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

import ComponentInfoArray from "./ComponentInfoArray.js";
import URLs               from "../Browser/Networking/URLs.js";

const SupportedComponents = new ComponentInfoArray ([ ]);

SupportedComponents .addComponent (
{
   title:       "Annotation",
   name:        "Annotation",
   level:       2,
   providerUrl: URLs .getProviderUrl ("Annotation"),
});

SupportedComponents .addComponent (
{
   title:       "Computer-Aided Design (CAD) model geometry",
   name:        "CADGeometry",
   level:       2,
   providerUrl: URLs .getProviderUrl ("CADGeometry"),
});

SupportedComponents .addComponent (
{
   title:       "Core",
   name:        "Core",
   level:       2,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Cube map environmental texturing",
   name:        "CubeMapTexturing",
   level:       3,
   providerUrl: URLs .getProviderUrl ("CubeMapTexturing"),
});

SupportedComponents .addComponent (
{
   title:       "Distributed interactive simulation (DIS)",
   name:        "DIS",
   level:       2,
   providerUrl: URLs .getProviderUrl ("DIS"),
});

SupportedComponents .addComponent (
{
   title:       "Environmental effects",
   name:        "EnvironmentalEffects",
   level:       4,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Environmental sensor",
   name:        "EnvironmentalSensor",
   level:       4,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Event utilities",
   name:        "EventUtilities",
   level:       4,
   providerUrl: URLs .getProviderUrl ("EventUtilities"),
});

SupportedComponents .addComponent (
{
   title:       "Followers",
   name:        "Followers",
   level:       4,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Geometry2D",
   name:        "Geometry2D",
   level:       2,
   providerUrl: URLs .getProviderUrl ("Geometry2D"),
});

SupportedComponents .addComponent (
{
   title:       "Geometry3D",
   name:        "Geometry3D",
   level:       4,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Geospatial",
   name:        "Geospatial",
   level:       2,
   providerUrl: URLs .getProviderUrl ("Geospatial"),
});

SupportedComponents .addComponent (
{
   title:       "Grouping",
   name:        "Grouping",
   level:       3,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Humanoid animation (HAnim)",
   name:        "HAnim",
   level:       3,
   providerUrl: URLs .getProviderUrl ("HAnim"),
});

SupportedComponents .addAlias ("H-Anim", "HAnim");

SupportedComponents .addComponent (
{
   title:       "Interpolation",
   name:        "Interpolation",
   level:       5,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Key device sensor",
   name:        "KeyDeviceSensor",
   level:       2,
   providerUrl: URLs .getProviderUrl ("KeyDeviceSensor"),
});

SupportedComponents .addComponent (
{
   title:       "Layering",
   name:        "Layering",
   level:       1,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Layout",
   name:        "Layout",
   level:       2,
   providerUrl: URLs .getProviderUrl ("Layout"),
});

SupportedComponents .addComponent (
{
   title:       "Lighting",
   name:        "Lighting",
   level:       3,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Navigation",
   name:        "Navigation",
   level:       3,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Networking",
   name:        "Networking",
   level:       4,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Non-uniform Rational B-Spline (NURBS)",
   name:        "NURBS",
   level:       4,
   providerUrl: URLs .getProviderUrl ("NURBS"),
});

SupportedComponents .addComponent (
{
   title:       "Particle systems",
   name:        "ParticleSystems",
   level:       3,
   providerUrl: URLs .getProviderUrl ("ParticleSystems"),
});

SupportedComponents .addComponent (
{
   title:        "Picking sensor",
   name:         "Picking",
   level:        3,
   providerUrl:  URLs .getProviderUrl ("Picking"),
   dependencies: ["RigidBodyPhysics"],
});

SupportedComponents .addComponent (
{
   title:       "Pointing device sensor",
   name:        "PointingDeviceSensor",
   level:       1,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Projective Texture Mapping",
   name:        "ProjectiveTextureMapping",
   level:       2,
   providerUrl: URLs .getProviderUrl ("ProjectiveTextureMapping"),
});

SupportedComponents .addComponent (
{
   title:       "Programmable shaders",
   name:        "Shaders",
   level:       1,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Rendering",
   name:        "Rendering",
   level:       5,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Rigid body physics",
   name:        "RigidBodyPhysics",
   level:       5,
   providerUrl: URLs .getProviderUrl ("RigidBodyPhysics"),
});

SupportedComponents .addComponent (
{
   title:       "Scripting",
   name:        "Scripting",
   level:       1,
   providerUrl: URLs .getProviderUrl ("Scripting"),
});

SupportedComponents .addComponent (
{
   title:       "Shape",
   name:        "Shape",
   level:       5,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Sound",
   name:        "Sound",
   level:       1,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Text",
   name:        "Text",
   level:       1,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Texturing",
   name:        "Texturing",
   level:       3,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:       "Texturing3D",
   name:        "Texturing3D",
   level:       3,
   providerUrl: URLs .getProviderUrl ("Texturing3D"),
});

SupportedComponents .addComponent (
{
   title:       "Time",
   name:        "Time",
   level:       2,
   providerUrl: URLs .getProviderUrl (),
});

SupportedComponents .addComponent (
{
   title:        "Volume rendering",
   name:         "VolumeRendering",
   level:        2,
   providerUrl:  URLs .getProviderUrl ("VolumeRendering"),
   dependencies: ["CADGeometry", "Texturing3D"],
});

SupportedComponents .addComponent (
{
   title:       "X_ITE",
   name:        "X_ITE",
   level:       1,
   providerUrl: URLs .getProviderUrl ("X_ITE"),
});

export default SupportedComponents;
