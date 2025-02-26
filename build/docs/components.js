const
   fs            = require ("fs"),
   path          = require ("path"),
   child_process = require ("child_process")

const
   components = path .resolve ("./", "src/x_ite/Components"),
   comp       = path .resolve ("./", "docs/_posts/components"),
   nav        = path .resolve ("./", "docs/_data/nav"),
   tabs       = path .resolve ("./", "docs/_tabs");

function createIndex ()
{
   const filenames = child_process .execSync (`find ${components} -mindepth 2 -maxdepth 2 -type f`)
      .toString () .trim () .split (/\s+/) .sort ()

   const index = new Map ();

   for (const filename of filenames)
   {
      const m = filename .match (/([^\/]+)\/([^\/]+)\.js$/)

      if (m [1] === "Annotation")
         continue

      if (m [2] .match (/^X3D/))
         continue

      let nodes = index .get (m [1])

      if (!nodes)
         index .set (m [1], nodes = [ ])

      nodes .push (m [2])
   }

   return index
}

function getSpecificationRange (component, node)
{
   const
      filename = `${components}/${component}/${node}.js`,
      file     = fs .readFileSync (filename) .toString (),
      match    = file .match (/getSpecificationRange.*?(\[.*?\])/s),
      range    = eval (match [1])

   if (range [1] == Infinity)
      return range [0]

   return `${range [0]} - ${range [1]}`
}

function updateNav ()
{
   for (const [component, nodes] of createIndex ())
   {
      let text = ""

      text += `- title: "${component}"\n`
      text += `  children:\n`

      for (const node of nodes .sort ())
      {
         const slug = `${component}/${node}` .toLowerCase () .replace (/_/g, "-")

         text += `    - title: "${node}"\n`
         text += `      url: /components/${slug}\n`
      }

      const yml = path .resolve (nav, `components-${component}.yml`)

      fs .writeFileSync (yml, text)
   }
}

function updateComponents ()
{
   let list = "\n\n"

   for (const [component, nodes] of createIndex ())
   {
      list += `## ${component}\n\n`

      for (const node of nodes .sort ())
      {
         const slug = `${component}/${node}` .toLowerCase () .replace (/_/g, "-")

         list += `- [${node}](${slug})\n`
      }

      list += `\n`
   }

   const md = path .resolve (tabs, `components.md`)

   let text = fs .readFileSync (md) .toString ()

   text = text .replace (/<!-- COMPONENTS BEGIN -->.*?<!-- COMPONENTS END -->/s, `<!-- COMPONENTS BEGIN -->${list}<!-- COMPONENTS END -->`)

   fs .writeFileSync (md, text)
}

// function updateComponents ()
// {
//    let list = "\n\n"

//    for (const [component, nodes] of createIndex ())
//    {
//       list += `## ${component}\n\n`
//       list += `| Node | Version | Status |\n`
//       list += `|------|---------|--------|\n`

//       for (const node of nodes .sort ())
//       {
//          const
//             slug    = `${component}/${node}` .toLowerCase () .replace (/_/g, "-"),
//             version = getSpecificationRange (component, node)

//          list += `| [${node}](${slug}) | ${version} | <span class="green">implemented</span> |\n`
//       }

//       list += `\n`
//    }

//    const md = path .resolve (tabs, `components.md`)

//    let text = fs .readFileSync (md) .toString ()

//    text = text .replace (/<!-- COMPONENTS BEGIN -->.*?<!-- COMPONENTS END -->/s, `<!-- COMPONENTS BEGIN -->${list}<!-- COMPONENTS END -->`)

//    fs .writeFileSync (md, text)
// }

async function addNodeStubs ()
{
   const access = new Map ([
      ["initializeOnly", ""],
      ["inputOutput", "in"],
      ["outputOnly", "out"],
      ["inputOutput", "in, out"],
   ])

   for (const [component, nodes] of createIndex ())
   {
      for (const node of nodes .sort ())
      {
         const
            js = path .resolve (components, `${component}/${node}.js`),
            md = path .resolve (comp, `${component}/${node}.md`)

         if (fs .existsSync (md))
            continue

         const file = fs .readFileSync (js) .toString ()

         let m = file .match (/getContainerField.*?"(.*?)"/s)

         const containerField = m [1]

         m = file .match (/X3DFieldDefinition\s*\(X3DConstants\s*\.(\w+),\s*"(\w+)",\s*new\s*Fields\s*\.(\w+)/sg)

         let fields = ""

         for (const s of m)
         {
            let sm = s .match (/X3DFieldDefinition\s*\(X3DConstants\s*\.(\w+),\s*"(\w+)",\s*new\s*Fields\s*\.(\w+)/s)

            fields += `### ${sm [3]} [${access .get (sm [1])}] **${sm [2]}** <small></small>\n\n`
         }

         let text = `
---
title: ${node}
date: ${new Date() .toISOString () .slice (0, 10)}
nav: components-${component}
categories: [components, ${component}]
tags: [${node}, ${component}]
---
<style>
.post h3 {
   word-spacing: 0.2em;
}
</style>

## Overview

${node} ...

The ${node} node belongs to the **${component}** component and its default container field is *${containerField}.* It is available since X3D version 4.0 or later.

## Hierarchy

\`\`\`
+ X3DNode
\`\`\`

## Fields

${fields}

## External Links

- [X3D Specification of ${node}](https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/${component .toLowerCase ()}.html#${node}){:target="_blank"}
`;

         text = text .trim () .replace (/\n{3,}/g, "\n\n")

         child_process .execSync (`mkdir -p ${path .dirname (md)}`)

         fs .writeFileSync (md, text)
      }
   }
}

updateNav ()
updateComponents ()
addNodeStubs ()
