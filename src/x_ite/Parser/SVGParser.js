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

import X3DParser from "./X3DParser.js";
import Color3    from "../../standard/Math/Numbers/Color3.js";
import Color4    from "../../standard/Math/Numbers/Color4.js";
import Vector2   from "../../standard/Math/Numbers/Vector2.js";
import Vector3   from "../../standard/Math/Numbers/Vector3.js";
import Vector4   from "../../standard/Math/Numbers/Vector4.js";
import Rotation4 from "../../standard/Math/Numbers/Rotation4.js";
import Matrix3   from "../../standard/Math/Numbers/Matrix3.js";
import Matrix4   from "../../standard/Math/Numbers/Matrix4.js";
import Box2      from "../../standard/Math/Geometry/Box2.js"
import Algorithm from "../../standard/Math/Algorithm.js";

/*
 *  Grammar
 */

// Lexical elements
const Grammar =
{
   // General
   whitespaces: /[\x20\n\t\r]+/gy,
   comma: /,/gy,
   openParenthesis: /\(/gy,
   closeParenthesis: /\)/gy,

   // Units
   em: /em/gy,
   ex: /ex/gy,
   px: /px/gy,
   in: /in/gy,
   cm: /cm/gy,
   mm: /mm/gy,
   pt: /pt/gy,
   pc: /pc/gy,
   PercentSign: /%/gy,

   // Values
   int32:  /((?:0[xX][\da-fA-F]+)|(?:[+-]?\d+))/gy,
   double: /([+-]?(?:(?:(?:\d*\.\d+)|(?:\d+(?:\.)?))(?:[eE][+-]?\d+)?))/gy,
   matrix: /matrix/gy,
   translate: /translate/gy,
   rotate: /rotate/gy,
   scale: /scale/gy,
   skewX: /skewX/gy,
   skewY: /skewY/gy,
   color: /([a-zA-Z]+|#[\da-fA-F]+|rgba?\(.*?\))/gy,
   url: /url\("?(.*?)"?\)/gy,
};

function parse (parser)
{
   this .lastIndex = parser .lastIndex;

   parser .result = this .exec (parser .input);

   if (parser .result)
   {
      parser .lastIndex = this .lastIndex;
      return true;
   }

   return false;
}

for (const value of Object .values (Grammar))
   value .parse = parse;

/*
 *  Constants
 */

const
   INCH  = 0.0254,    // One inch in meter.
   POINT = INCH / 72, // One point in meter.
   PIXEL = INCH / 90; // One pixel in meter.

/*
 *  Parser
 */

function SVGParser (scene)
{
   X3DParser .call (this, scene);
}

SVGParser .prototype = Object .assign (Object .create (X3DParser .prototype),
{
   constructor: SVGParser,
   getEncoding: function ()
   {
      return "XML";
   },
   isValid: function ()
   {
      if (!(this .input instanceof XMLDocument))
         return false;

      if ($(this .input) .children ("svg") .length)
         return true;

      if (this .input .nodeName === "svg")
         return true;

      return false;
   },
   getInput: function ()
   {
      return this .input;
   },
   setInput (xmlElement)
   {
      try
      {
         if (typeof xmlElement === "string")
            xmlElement = $.parseXML (xmlElement);

         this .input = xmlElement;
      }
      catch (error)
      {
         this .input = undefined;
      }
   },
   parseIntoScene: function (success, error)
   {
      const scene = this .getExecutionContext ();

      this .rootTransform         = scene .createNode ("Transform");
      this .groupNodes            = [this .rootTransform];
      this .texturePropertiesNode = scene .createNode ("TextureProperties");
      this .styles                = [{
         display: "inline",
         fillType: "COLOR",
         fillColor: Color4 .Black,
         fillURL: "",
         fillOpacity: 1,
         fillRule: "nonzero",
         strokeType: "NONE",
         strokeColor: Color4 .Black,
         strokeURL: "",
         strokeOpacity: 1,
         strokeWidth: 1,
         opacity: 1,
         stopColor: Color4 .Black,
         stopOpacity: 1,
      }];

      this .xmlElement (this .input)
         .then (success)
         .catch (error);
   },
   xmlElement: async function (xmlElement)
   {
      switch (xmlElement .nodeName)
      {
         case "#document":
         {
            const svg = $(xmlElement) .children ("svg");

            for (let i = 0; i < svg .length; ++ i)
               await this .svgElement (svg [i]);

            break;
         }
         case "svg":
         {
            await this .svgElement (xmlElement);
            break;
         }
      }

      return this .getScene ();
   },
   svgElement: async function (xmlElement)
   {
      const
         browser = this .getBrowser (),
         scene   = this .getScene ();

      scene .setEncoding ("SVG");
      scene .setProfile (browser .getProfile ("Interchange"));
      scene .addComponent (browser .getComponent ("Geometry2D", 2));

      await this .loadComponents ();

      // Create background.

      const background = scene .createNode ("Background");

      background .skyColor = [1, 1, 1];

      scene .getRootNodes () .push (background);

      // Create navigation info.

      const navigationInfo = scene .createNode ("NavigationInfo");

      navigationInfo .type = ["PLANE_create3000.github.io", "PLANE", "EXAMINE", "ANY"];

      scene .getRootNodes () .push (navigationInfo);

      // Get attributes of svg element.

      const
         viewBox = this .viewBoxAttribute (xmlElement .getAttribute ("viewBox"), new Vector4 (0, 0, 100, 100)),
         width   = this .lengthAttribute (xmlElement .getAttribute ("width", viewBox [2])),
         height  = this .lengthAttribute (xmlElement .getAttribute ("height", viewBox [3]));

      // Create viewpoint.

      const
         viewpoint = scene .createNode ("OrthoViewpoint",),
         x         =  (viewBox .x + width  / 2) * PIXEL,
         y         = -(viewBox .y + height / 2) * PIXEL;

      viewpoint .position         = new Vector3 (x, y, 10);
      viewpoint .centerOfRotation = new Vector3 (x, y, 0);

      viewpoint .fieldOfView = [
         -width  / 2 * PIXEL,
         -height / 2 * PIXEL,
          width  / 2 * PIXEL,
          height / 2 * PIXEL,
      ];

      scene .getRootNodes () .push (viewpoint);

      // Create view matrix.

      const
         scale       = new Vector3 (width * PIXEL / viewBox [2], -height * PIXEL / viewBox [3], 1),
         translation = new Vector3 (-viewBox .x, viewBox .y, 0) .multVec (scale);

      this .rootTransform .translation = translation;
      this .rootTransform .scale       = scale;

      // Parse elements.

      this .elements (xmlElement);

      // Add root Transform node.

      scene .addNamedNode (scene .getUniqueName ("ViewBox"), this .rootTransform);
      scene .getRootNodes () .push (this .rootTransform);
   },
   elements: function (xmlElement)
   {
      for (const childNode of xmlElement .childNodes)
		   this .element (childNode);
   },
   element: function (xmlElement)
   {
      if (this .used (xmlElement))
			return;

      switch (xmlElement .nodeName)
      {
         case "use":
            return this .useElement (xmlElement);
         case "g":
            return this .gElement (xmlElement);
         case "switch":
            return this .switchElement (xmlElement);
         case "a":
            return this .aElement (xmlElement);
         case "rect":
            return this .rectElement (xmlElement);
         case "circle":
            return this .circleElement (xmlElement);
         case "ellipse":
            return this .ellipseElement (xmlElement);
         case "polygon":
            return this .polygonElement (xmlElement);
         case "text":
            return this .textElement (xmlElement);
         case "image":
            return this .imageElement (xmlElement);
         case "polyline":
            return this .polylineElement (xmlElement);
         case "path":
            return this .pathElement (xmlElement);
      }
   },
   used: function (xmlElement)
   {
      try
      {
         const
            scene = this .getExecutionContext (),
            id    = xmlElement .getAttribute ("id"),
            name  = this .sanitizeName (id),
            node  = scene .getNamedNode (name);

         this .groupNodes .at (-1) .children .push (node);

         return true;
      }
      catch (error)
      {
         return false;
      }
   },
   useElement: function (xmlElement)
   {

   },
   gElement: function (xmlElement)
   {
      // Determine style.

      if (!this .styleAttributes (xmlElement))
         return;

      // Get transform.

      const transformNode = this .createTransform (xmlElement);

      // Get child elements.

      this .groupNodes .push (transformNode);

      this .elements (xmlElement);

      this .styles .pop ();

      // Add node.

      this .groupNodes .pop ();

      if (transformNode .children .length)
         this .groupNodes .at (-1) .children .push (transformNode);
   },
   switchElement: function (xmlElement)
   {

   },
   aElement: function (xmlElement)
   {

   },
   rectElement: function (xmlElement)
   {
      // Determine style.

      if (!this .styleAttributes (xmlElement))
         return;

      // Get transform.

      const
         x      = this .lengthAttribute (xmlElement .getAttribute ("x"), 0),
         y      = this .lengthAttribute (xmlElement .getAttribute ("y"), 0),
         width  = this .lengthAttribute (xmlElement .getAttribute ("width"), 0),
         height = this .lengthAttribute (xmlElement .getAttribute ("height"), 0);

      const
         scene         = this .getExecutionContext (),
         size          = new Vector2 (width, height),
         center        = new Vector2 (x + width / 2, y + height / 2),
         bbox          = new Box2 (size, center),
         transformNode = this .createTransform (xmlElement, center);

      this .groupNodes .push (transformNode);

      // Create nodes.

      if (this .style .fillType !== "NONE")
      {
         const
            shapeNode     = scene .createNode ("Shape"),
            rectangleNode = scene .createNode ("Rectangle2D");

         shapeNode .appearance = this .createFillAppearance (bbox);
         shapeNode .geometry   = rectangleNode;
         rectangleNode .solid  = false;
         rectangleNode .size   = size;

         transformNode .children .push (shapeNode);
      }

      if (this .style .strokeType !== "NONE")
      {
         const
            shapeNode     = scene .createNode ("Shape"),
            polylineNode  = scene .createNode ("Polyline2D"),
            width1_2      = width / 2,
            height1_2     = height / 2;

         shapeNode .appearance = this .createStrokeAppearance ();
         shapeNode .geometry   = polylineNode;

         polylineNode .lineSegments = [ width1_2,  height1_2,
                                       -width1_2,  height1_2,
                                       -width1_2, -height1_2,
                                        width1_2, -height1_2,
                                        width1_2,  height1_2];

         transformNode .children .push (shapeNode);
      }

      this .groupNodes .pop ();
      this .styles     .pop ();

      if (transformNode .children .length)
         this .groupNodes .at (-1) .children .push (transformNode);
   },
   circleElement: function (xmlElement)
   {
      // Determine style.

      if (!this .styleAttributes (xmlElement))
         return;

      // Get transform.

      const
         cx = this .lengthAttribute (xmlElement .getAttribute ("cx"), 0),
         cy = this .lengthAttribute (xmlElement .getAttribute ("cy"), 0),
         r  = this .lengthAttribute (xmlElement .getAttribute ("r"),  0);

      const
         scene         = this .getExecutionContext (),
         bbox          = new Box2 (new Vector2 (r * 2, r * 2), new Vector2 (cx, cy)),
         transformNode = this .createTransform (xmlElement, new Vector2 (cx, cy));

      this .groupNodes .push (transformNode);

      // Create nodes.

      if (this .style .fillType !== "NONE")
      {
         const
            shapeNode = scene .createNode ("Shape"),
            diskNode  = scene .createNode ("Disk2D");

         shapeNode .appearance = this .createFillAppearance (bbox);
         shapeNode .geometry   = diskNode;
         diskNode .solid       = false;
         diskNode .outerRadius = r;

         transformNode .children .push (shapeNode);
      }

      if (this .style .strokeType !== "NONE")
      {
         const
            shapeNode  = scene .createNode ("Shape"),
            circleNode = scene .createNode ("Circle2D");

         shapeNode .appearance = this .createStrokeAppearance ();
         shapeNode .geometry   = circleNode;
         circleNode .radius    = r;

         transformNode .children .push (shapeNode);
      }

      this .groupNodes .pop ();
      this .styles     .pop ();

      if (transformNode .children .length)
         this .groupNodes .at (-1) .children .push (transformNode);
   },
   ellipseElement: function (xmlElement)
   {
      // Determine style.

      if (!this .styleAttributes (xmlElement))
         return;

      // Get transform.

      const
         cx = this .lengthAttribute (xmlElement .getAttribute ("cx"), 0),
         cy = this .lengthAttribute (xmlElement .getAttribute ("cy"), 0),
         rx = this .lengthAttribute (xmlElement .getAttribute ("rx"), 0),
         ry = this .lengthAttribute (xmlElement .getAttribute ("ry"), 0);

      const
         scene         = this .getExecutionContext (),
         rMin          = Math .min (rx, ry),
         bbox          = new Box2 (new Vector2 (rx * 2, ry * 2), new Vector2 (cx, cy)),
         transformNode = this .createTransform (xmlElement, new Vector2 (cx, cy), new Vector2 (rx / rMin, ry / rMin));

      this .groupNodes .push (transformNode);

      // Create nodes.

      if (this .style .fillType !== "NONE")
      {
         const
            shapeNode = scene .createNode ("Shape"),
            diskNode  = scene .createNode ("Disk2D");

         shapeNode .appearance = this .createFillAppearance (bbox);
         shapeNode .geometry   = diskNode;
         diskNode .solid       = false;
         diskNode .outerRadius = rMin;

         transformNode .children .push (shapeNode);
      }

      if (this .style .strokeType !== "NONE")
      {
         const
            shapeNode  = scene .createNode ("Shape"),
            circleNode = scene .createNode ("Circle2D");

         shapeNode .appearance = this .createStrokeAppearance ();
         shapeNode .geometry   = circleNode;
         circleNode .radius    = rMin;

         transformNode .children .push (shapeNode);
      }

      this .groupNodes .pop ();
      this .styles     .pop ();

      if (transformNode .children .length)
         this .groupNodes .at (-1) .children .push (transformNode);
   },
   polygonElement: function (xmlElement)
   {

   },
   textElement: function (xmlElement)
   {

   },
   imageElement: function (xmlElement)
   {

   },
   polylineElement: function (xmlElement)
   {

   },
   pathElement: function (xmlElement)
   {

   },
   idAttribute: function (attribute, node)
   {
      if (attribute === null)
         return;

      const
         scene = this .getExecutionContext (),
         name  = this .sanitizeName (attribute);

      if (name)
		   scene.addNamedNode (scene .getUniqueName (name), node);
   },
   viewBoxAttribute: function (attribute, defaultValue)
   {
      if (attribute === null)
         return defaultValue;

      this .setString (attribute);

      if (this .double ())
      {
         const x = this .value;

         if (this .double ())
         {
            const y = this .value;

            if (this .double ())
            {
               const width = this .value;

               if (this .double ())
               {
                  const height = this .value;

                  return new Vector4 (x, y, width, height);
               }
            }
         }
      }

      return defaultValue;
   },
   lengthAttribute: function (attribute, defaultValue)
   {
      // Returns length in pixel.

      if (attribute === null)
         return defaultValue;

      this .setString (attribute);

      if (this .double ())
      {
         // Parse unit

         if (Grammar .mm .parse (this))
            this .value /= 1000 * PIXEL;

         else if (Grammar .cm .parse (this))
            this .value /= 100 * PIXEL;

         else if (Grammar .in .parse (this))
            this .value *= INCH / PIXEL;

         return this .value;
      }

      return defaultValue;
   },
   transformAttribute: function (attribute)
   {
      const matrix = new Matrix3 ();

      if (attribute === null)
         return matrix;

      this .setString (attribute);

      while (true)
      {
         this .whitespaces ();

         if (Grammar .matrix .parse (this))
         {
            this .whitespaces ();

            if (Grammar .openParenthesis .parse (this))
            {
               this .whitespaces ();

               if (Grammar .double .parse (this))
               {
                  const a = parseFloat (this .result [1]);

                  if (this .commaWhitespaces ())
                  {
                     if (Grammar .double .parse (this))
                     {
                        const b = parseFloat (this .result [1]);

                        if (this .commaWhitespaces ())
                        {
                           if (Grammar .double .parse (this))
                           {
                              const c = parseFloat (this .result [1]);

                              if (this .commaWhitespaces ())
                              {
                                 if (Grammar .double .parse (this))
                                 {
                                    const d = parseFloat (this .result [1]);

                                    if (this .commaWhitespaces ())
                                    {
                                       if (Grammar .double .parse (this))
                                       {
                                          const e = parseFloat (this .result [1]);

                                          if (this .commaWhitespaces ())
                                          {
                                             if (Grammar .double .parse (this))
                                             {
                                                const f = parseFloat (this .result [1]);

                                                this .whitespaces ();

                                                if (Grammar .closeParenthesis .parse (this))
                                                {
                                                   matrix .multLeft (new Matrix3 (a, b, 0,  c, d, 0,  e, f, 1));
                                                   continue;
                                                }
                                             }
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }

            break;
         }
         else if (Grammar .translate .parse (this))
         {
            this .whitespaces ();

            if (Grammar .openParenthesis .parse (this))
            {
               this .whitespaces ();

               if (this .double ())
               {
                  const tx = this .value;

                  if (this .commaWhitespaces ())
                  {
                     if (this .double ())
                     {
                        const ty = this .value;

                        this .whitespaces ();

                        if (Grammar .closeParenthesis .parse (this))
                        {
                           matrix .translate (new Vector2 (tx, ty));
                           continue;
                        }
                     }
                  }
               }
            }

            break;
         }
         else if (Grammar .rotate .parse (this))
         {
            this .whitespaces ();

            if (Grammar .openParenthesis .parse (this))
            {
               this .whitespaces ();

               if (this .double ())
               {
                  const angle = this .value;

                  let commaWithWhitespaces = false;

                  commaWithWhitespaces |= this .whitespaces ();

                  if (Grammar .closeParenthesis .parse (this))
                  {
                     matrix .rotate (Algorithm .radians (angle));
                     continue;
                  }
                  else
                  {
                     commaWithWhitespaces |= Grammar .comma .parse (this);
                     commaWithWhitespaces |= this .whitespaces ();

                     if (commaWithWhitespaces)
                     {
                        if (this .double ())
                        {
                           const cx = this .value;

                           if (this .commaWhitespaces ())
                           {
                              if (this .double ())
                              {
                                 const cy = this .value;

                                 this .whitespaces ();

                                 if (Grammar .closeParenthesis .parse (this))
                                 {
                                    matrix .translate (new Vector2 (cx, cy));
                                    matrix .rotate (Algorithm .radians (angle));
                                    matrix .translate (new Vector2 (-cx, -cy));
                                    continue;
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }

            break;
         }
         else if (Grammar .scale .parse (this))
         {
            this .whitespaces ();

            if (Grammar .openParenthesis .parse (this))
            {
               this .whitespaces ();

               if (this .double ())
               {
                  const sx = this .value;

                  if (this .commaWhitespaces ())
                  {
                     if (this .double ())
                     {
                        const sy = this .value;

                        this .whitespaces ();

                        if (Grammar .closeParenthesis .parse (this))
                        {
                           matrix .scale (new Vector2 (sx, sy));
                           continue;
                        }
                     }
                  }
               }
            }

            break;
         }
         else if (Grammar .skewX .parse (this))
         {
            this .whitespaces ();

            if (Grammar .openParenthesis .parse (this))
            {
               this .whitespaces ();

               if (this .double ())
               {
                  const angle = this .value;

                  this .whitespaces ();

                  if (Grammar .closeParenthesis .parse (this))
                  {
                     matrix .skewX (Algorithm .radians (angle));
                     continue;
                  }
               }
            }

            break;
         }
         else if (Grammar .skewY .parse (this))
         {
            this .whitespaces ();

            if (Grammar .openParenthesis .parse (this))
            {
               this .whitespaces ();

               if (this .double ())
               {
                  const angle = this .value;

                  this .whitespaces ();

                  if (Grammar .closeParenthesis .parse (this))
                  {
                     matrix .skewY (Algorithm .radians (angle));
                     continue;
                  }
               }
            }

            break;
         }

         break;
      }

      return matrix;
   },
   styleAttributes: (function ()
   {
      const Styles = [
         "display",
         "fill",
         "fill-opacity",
         "fill-rule",
         "stroke",
         "stroke-opacity",
         "stroke-width",
         "opacity",
         "stop-color",
         "stop-opacity",
      ];

      return function (xmlElement)
      {
         this .style = Object .assign ({ }, this .styles [0]);

         if (this .style .display === "none")
            return false;

         for (const style of Styles)
         {
            const attribute = xmlElement .getAttribute (style);

            if (attribute === null)
               continue;

            this .setString (attribute);

            switch (style)
            {
               case "display":
                  this .displayStyle (attribute);
                  break;
               case "fill":
                  this .fillStyle (attribute);
                  break;
               case "fill-opacity":
                  this .fillOpacityStyle (attribute);
                  break;
               case "fill-rule":
                  this .fillRuleStyle (attribute);
                  break;
               case "stroke":
                  this .strokeStyle (attribute);
                  break;
               case "stroke-opacity":
                  this .strokeOpacityStyle (attribute);
                  break;
               case "stroke-width":
                  this .strokeWidthStyle (attribute);
                  break;
               case "opacity":
                  this .opacityStyle (attribute);
                  break;
               case "stop-color":
                  this .stopColorStyle (attribute);
                  break;
               case "stop-opacity":
                  this .stopOpacityStyle (attribute);
                  break;
            }
         }

         // Style attribute has higher precedence.

         this .styleAttribute (xmlElement .getAttribute ("style"));

         this .styles .push (this .style);

         return true;
      };
   })(),
   styleAttribute: function (attribute)
   {
      if (attribute === null)
         return;

      const values = attribute .split (";");

      for (const value of values)
      {
         const pair = value .split (":");

         if (pair .length !== 2)
            continue;

         const
            style     = pair [0] .trim (),
            attribute = pair [1] .trim ();

         this .setString (attribute);

         switch (style)
         {
            case "display":
               this .displayStyle (pair [1]);
               break;
            case "fill":
               this .fillStyle (pair [1]);
               break;
            case "fill-opacity":
               this .fillOpacityStyle (attribute);
               break;
            case "fill-rule":
               this .fillRuleStyle (attribute);
               break;
            case "stroke":
               this .strokeStyle (attribute);
               break;
            case "stroke-opacity":
               this .strokeOpacityStyle (attribute);
               break;
            case "stroke-width":
               this .strokeWidthStyle (attribute);
               break;
            case "opacity":
               this .opacityStyle (attribute);
               break;
            case "stop-color":
               this .stopColorStyle (attribute);
               break;
            case "stop-opacity":
               this .stopOpacityStyle (attribute);
               break;
         }
      }
   },
   displayStyle: function (value)
   {
      if (value === null)
         return;

      if (value == "inherit")
      {
         this .style .display = styles .at (-1) .display;
         return;
      }

      style .display = value;
   },
   fillStyle: (function ()
   {
      const color = new Color4 (0, 0, 0, 0);

      return function (value)
      {
         if (this .colorValue (color))
         {
            this .style .fillType  = "COLOR";
            this .style .fillColor = color .copy ();
            return;
         }

         if (this .urlValue ())
         {
            this .style .fillType = "URL";
            this .style .fillURL  = this .result [1] .trim ();
            return;
         }

         if (value == "transparent")
         {
            this .style .fillType = "NONE";
            return;
         }

         if (value == "none")
         {
            this .style .fillType ="NONE";
            return;
         }

         // inherit

         this .style .fillType  = this .styles .at (-1) .fillType;
         this .style .fillColor = this .styles .at (-1) .fillColor;
         this .style .fillURL   = this .styles .at (-1) .fillURL;
      };
   })(),
   fillOpacityStyle: function (value)
   {
      if (this .double ())
      {
         this .style .fillOpacity = Algorithm .clamp (this .value, 0, 1);
         return;
      }

      if (value == "transparent")
      {
         this .style .fillOpacity = 0;
         return;
      }

      // inherit

      this .style .fillOpacity = this .styles .at (-1) .fillOpacity;
   },
   fillRuleStyle: function (value)
   {
      this .style .fillRule = value;
   },
   strokeStyle: (function ()
   {
      const color = new Color4 (0, 0, 0, 0);

      return function (value)
      {
         if (this .colorValue (color))
         {
            this .style .strokeType  = "COLOR";
            this .style .strokeColor = color .copy ();
            return;
         }

         if (this .urlValue ())
         {
            this .style .strokeType = "URL";
            this .style .strokeURL  = this .result [1] .trim ();
            return;
         }

         if (value == "transparent")
         {
            this .style .strokeType = "NONE";
            return;
         }

         if (value == "none")
         {
            this .style .strokeType ="NONE";
            return;
         }

         // inherit

         this .style .strokeType  = this .styles .at (-1) .strokeType;
         this .style .strokeColor = this .styles .at (-1) .strokeColor;
         this .style .strokeURL   = this .styles .at (-1) .strokeURL;
      };
   })(),
   strokeOpacityStyle: function (value)
   {
      if (this .double ())
      {
         this .style .strokeOpacity = Algorithm .clamp (this .value, 0, 1);
         return;
      }

      if (value == "transparent")
      {
         this .style .strokeOpacity = 0;
         return;
      }

      // inherit

      this .style .strokeOpacity = this .styles .at (-1) .strokeOpacity;
   },
   strokeWidthStyle: function (value)
   {
      if (this .double ())
      {
         this .style .strokeWidth = this .value / (1000 * PIXEL);
         return;
      }

      if (value == "none")
      {
         this .style .strokeWidth = 0;
         return;
      }

      // inherit

      this .style .strokeWidth = this .styles .at (-1) .strokeWidth;
   },
   opacityStyle: function (value)
   {
      if (this .double ())
      {
         this .style .opacity = Algorithm .clamp (this .value, 0, 1) * this .styles .at (-1) .opacity;
         return;
      }

      if (value == "transparent")
      {
         this .style .opacity = 0;
         return;
      }
   },
   stopColorStyle: (function ()
   {
      const color = new Color4 (0, 0, 0, 0);

      return function (value)
      {
         if (this .colorValue (color))
         {
            this .style .stopColor = color .copy ();
            return;
         }
      };
   })(),
   stopOpacityStyle: function (value)
   {
      if (this .double ())
      {
         this .style .stopOpacity = Algorithm .clamp (this .value, 0, 1);
         return;
      }

      if (value == "transparent")
      {
         this .style .stopOpacity = 0;
         return;
      }
   },
   setString: function (attribute)
   {
      this .input     = attribute;
      this .lastIndex = 0;
   },
   whitespaces: function ()
   {
      return Grammar .whitespaces .parse (this);
   },
   commaWhitespaces: function ()
   {
      return Grammar .whitespaces .parse (this) ||
             Grammar .comma .parse (this) ||
             Grammar .whitespaces .parse (this);
   },
   double: function ()
   {
      this .whitespaces ();

      if (Grammar .double .parse (this))
      {
         this .value = parseFloat (this .result [1]);

         return true;
      }

      return false;
   },
   colorValue: function (color)
   {
      if (!Grammar .color .parse (this))
         return false;

      color .set (... this .convertColor (this .input));

      return true;
   },
   urlValue: function ()
   {
      return Grammar .url .parse (this);
   },
   createTransform: function (xmlElement, t = Vector2 .Zero, s = Vector2 .One)
   {
      // Determine matrix.

      const
         scene  = this .getExecutionContext (),
         m      = this .transformAttribute (xmlElement .getAttribute ("transform"));

      m .translate (t);
      m .scale (s);

      // Create node.

      const
         transformNode    = scene .createNode ("Transform"),
         matrix           = new Matrix4 (m [0], m [1], 0, 0, m [3], m [4], 0, 0, 0, 0, 1, 0, m [6], m [7], 0, 1),
         translation      = new Vector3 (0, 0, 0),
         rotation         = new Rotation4 (),
         scale            = new Vector3 (1, 1, 1),
         scaleOrientation = new Rotation4 ();

      matrix .get (translation, rotation, scale, scaleOrientation);

      transformNode .translation      = translation;
      transformNode .rotation         = rotation;
      transformNode .scale            = scale;
      transformNode .scaleOrientation = scaleOrientation;

      // Set name.

      this .idAttribute (xmlElement .getAttribute ("id"), transformNode);

      return transformNode;
   },
   createFillAppearance: function (bbox)
   {
      const
         scene          = this .getExecutionContext (),
         appearanceNode = scene .createNode ("Appearance");

      switch (this .style .fillType)
      {
         case "NONE":
         {
            return null;
         }
         case "COLOR":
         {
            const materialNode = scene .createNode ("Material");

            appearanceNode .material   = materialNode;
            materialNode .diffuseColor = new Color3 (... this .style .fillColor);
            materialNode .transparency = 1 - this .style .fillOpacity * this .style .opacity;

            break;
         }
         case "URL":
         {
            // Gradient
            break;
         }
      }

      return appearanceNode;
   },
   createStrokeAppearance: function ()
   {
      const
         scene          = this .getExecutionContext (),
         appearanceNode = scene .createNode ("Appearance"),
         materialNode   = scene .createNode ("Material");

      appearanceNode .material    = materialNode;
      materialNode .emissiveColor = new Color3 (... this .style .strokeColor);
      materialNode .transparency  = 1 - this .style .strokeOpacity * this .style .opacity;

      if (this .style .strokeWidth !== 1)
      {
         const lineProperties = scene .createNode ("LineProperties");

         appearanceNode .lineProperties       = lineProperties;
         lineProperties .linewidthScaleFactor = this .style .strokeWidth;
      }

      return appearanceNode;
   },
});

export default SVGParser;
