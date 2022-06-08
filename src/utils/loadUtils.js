const { readFileSync } = require('fs')
const { dirname } = require('path')

const THREE = (global.THREE = require('three'))
require('../bin/GLTFLoader')

const DracoLoader = require('../bin/DRACOLoader')
THREE.DRACOLoader.getDecoderModule = () => {}

const gltfLoader = new THREE.GLTFLoader()
gltfLoader.setDRACOLoader(new DracoLoader())

const toArrayBuffer = (buf) => {
  var ab = new ArrayBuffer(buf.length)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buf.length; ++i) view[i] = buf[i]
  return ab
}

const loadGltf = (path) =>
  new Promise((resolve, reject) => {
    const data = readFileSync(path)
    const arrayBuffer = toArrayBuffer(data)

    const fileFolder = dirname(path)

    gltfLoader.parse(
      arrayBuffer,
      fileFolder, // Will look for assets alongside file
      resolve,
      reject
    )
  })

module.exports = { loadGltf }
