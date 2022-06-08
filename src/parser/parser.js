const { uniqueName, sanitizeName } = require('../utils/nameUtils')
const { geometryToJsx } = require('./geometryToJsx')

const countDuplicateGeometries = (scene) => {
  const duplicates = scene.reduce((geometries, child) => {
    if (!child.isMesh || !child.geometry) {
      return geometries
    }

    let name = (child.name || 'Part').replace(/[^a-zA-Z]/g, '')
    name = name.charAt(0).toUpperCase() + name.slice(1)

    const duplicateObject = geometries?.[child.geometry.uuid] ?? {
      count: 0,
      name: uniqueName(geometries, name),
      node: 'nodes' + sanitizeName(child.name),
    }

    duplicateObject.count += 1

    return {
      ...geometries,
      [child.geometry.uuid]: duplicateObject,
    }
  }, {})

  return Object.fromEntries(Object.entries(duplicates).filter(([, { count }]) => count > 1))
}

const countDuplicateMaterials = (scene) => {
  const duplicates = scene.reduce((materials, child) => {
    if (!child.isMesh || !child.material) {
      return materials
    }

    return {
      ...materials,
      [child.material.name]: (materials?.[child.material.name] ?? 0) + 1,
    }
  }, {})

  return Object.fromEntries(Object.entries(duplicates).filter(([, count]) => count > 1))
}

const parseScene = ({ animations, scene }) => {
  const allObjects = []
  scene.traverse((child) => allObjects.push(child))

  const duplicateGeometries = countDuplicateGeometries(allObjects)
  const duplicateMaterials = countDuplicateMaterials(allObjects)

  const hasInstances = Object.keys(duplicateGeometries).length > 0 || Object.keys(duplicateMaterials).length > 0
  const isAnimated = animations && animations.length > 0

  const sceneJsx = scene.children.map((child) => geometryToJsx(child, isAnimated, duplicateGeometries))
  console.log(sceneJsx)
}

module.exports = parseScene
