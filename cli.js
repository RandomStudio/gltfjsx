#!/usr/bin/env node
'use strict'
const React = require('react')
const importJsx = require('import-jsx')
const { render } = require('ink')
const meow = require('meow')

const App = importJsx('./src/components/App')

const cli = meow(
  `
	Usage
	  $ npx gltfjsx [Model.js] [options]

	Options
    --types, -t         Add Typescript definitions
    --jsx               Use .jsx instead of .js (default: false)
    --outputFolder -o   Output folder (default: '.')
    --keepnames, -k     Keep original names
    --keepgroups, -K    Keep (empty) groups
    --meta, -m          Include metadata (as userData)
    --shadows, s        Let meshes cast and receive shadows
    --printwidth, w     Prettier printWidth (default: 120)
    --precision, -p     Number of fractional digits (default: 2)
    --draco, -d         Draco binary path
    --root, -r          Sets directory from which .gltf file is served
    --instance, -i      Instance re-occuring geometry
    --instanceall, -I   Instance every geometry (for cheaper re-use)
    --transform, -T     Transform the asset for the web (draco, prune, resize)
    --aggressive, -a    Aggressively prune the graph (empty groups, transform overlap) 
    --debug, -D         Debug output
`,
  {
    flags: {
      source: { type: 'string', default: 'models' },
      static: { type: 'string', default: 'public' },
      components: { type: 'string', default: 'src' },
    },
  }
)

const source = cli.input?.[0] ?? cli.flags.source

const config = {
  aggressive: true,
  instance: true,
  precision: 2,
  shadows: true,
}

if (!source) {
  console.log(cli.help)
} else {
  render(React.createElement(App, { ...cli.flags, config }))
}
