const { readdir, stat } = require('fs/promises')
const { join, extname } = require('path')
const { loadGltf } = require('./utils/loadUtils')
const { parseGltf } = require('./utils/jsxUtils')
const parseScene = require('./parser/parser')
require('jsdom-global')()

const transformGltf = (gltf) => {
  console.log(gltf)
}

const processFolder = async (source, gltfPaths) => {
  const files = await readdir(source)
  for await (const file of files) {
    const filePath = join(source, file)

    const fileStats = await stat(filePath)

    if (fileStats.isDirectory()) {
      await processFolder(filePath, gltfPaths)
      continue
    }

    const extension = extname(filePath)
    if (extension === '.gltf' || extension === '.glb') {
      gltfPaths.push(filePath)
    }
  }
}

const parseInput = async ({ source, static, components, config }) => {
  const gltfPaths = []
  await processFolder(source, gltfPaths)
  for await (const path of gltfPaths) {
    try {
      const gltf = await loadGltf(path)
      //const transformedGltf = transformGltf(gltf);
      const gltfJsx = parseScene(gltf)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = parseInput
