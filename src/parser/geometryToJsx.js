const { sanitizeName } = require('../utils/nameUtils')

const getObjectType = (obj) => {
  console.log(typeof obj)
  let type = obj.type.charAt(0).toLowerCase() + obj.type.slice(1)
  // Turn object3d's into groups, it should be faster according to the threejs docs
  if (type === 'object3D') type = 'group'
  if (type === 'perspectiveCamera') type = 'PerspectiveCamera'
  if (type === 'orthographicCamera') type = 'OrthographicCamera'
  return type
}

const getObjectInfo = (obj, duplicateGeometries) => {
  let type = getObjectType(obj)
  let node = 'nodes' + sanitizeName(obj.name)
  let isInstanced = obj.geometry && (duplicateGeometries?.[obj.geometry.uuid]?.count ?? false)
  console.log({ type, node, isInstanced })
  return { type, node, isInstanced }
}

const getAttributes = (obj, isAnimated, { isInstanced, node, type }) => {
  // Include names when output is uncompressed or morphTargetDictionaries are present
  if (obj.name.length && isAnimated) result += `name="${obj.name}" `

  let result = ''
  let isCamera = type === 'PerspectiveCamera' || type === 'OrthographicCamera'
  // Handle cameras
  if (isCamera) {
    result += `makeDefault={false} `
    if (obj.zoom !== 1) result += `zoom={${rNbr(obj.zoom)}} `
    if (obj.far !== 2000) result += `far={${rNbr(obj.far)}} `
    if (obj.near !== 0.1) result += `near={${rNbr(obj.near)}} `
  }
  if (type === 'PerspectiveCamera') {
    if (obj.fov !== 50) result += `fov={${rNbr(obj.fov)}} `
  }

  if (!instanced) {
    // Shadows
    if (type === 'mesh' && options.shadows) result += `castShadow receiveShadow `

    // Write out geometry first
    if (obj.geometry) {
      result += `geometry={${node}.geometry} `
    }

    // Write out materials
    if (obj.material) {
      if (obj.material.name) result += `material={materials${sanitizeName(obj.material.name)}} `
      else result += `material={${node}.material} `
    }

    if (obj.skeleton) result += `skeleton={${node}.skeleton} `
    if (obj.visible === false) result += `visible={false} `
    if (obj.castShadow === true) result += `castShadow `
    if (obj.receiveShadow === true) result += `receiveShadow `
    if (obj.morphTargetDictionary) result += `morphTargetDictionary={${node}.morphTargetDictionary} `
    if (obj.morphTargetInfluences) result += `morphTargetInfluences={${node}.morphTargetInfluences} `
    if (obj.intensity && rNbr(obj.intensity)) result += `intensity={${rNbr(obj.intensity)}} `
    //if (obj.power && obj.power !== 4 * Math.PI) result += `power={${rNbr(obj.power)}} `
    if (obj.angle && obj.angle !== Math.PI / 3) result += `angle={${rDeg(obj.angle)}} `
    if (obj.penumbra && rNbr(obj.penumbra) !== 0) result += `penumbra={${rNbr(obj.penumbra)}} `
    if (obj.decay && rNbr(obj.decay) !== 1) result += `decay={${rNbr(obj.decay)}} `
    if (obj.distance && rNbr(obj.distance) !== 0) result += `distance={${rNbr(obj.distance)}} `
    if (obj.up && obj.up.isVector3 && !obj.up.equals(new THREE.Vector3(0, 1, 0)))
      result += `up={[${rNbr(obj.up.x)}, ${rNbr(obj.up.y)}, ${rNbr(obj.up.z)},]} `
  }

  if (obj.color && obj.color.getHexString() !== 'ffffff') result += `color="#${obj.color.getHexString()}" `
  if (obj.position && obj.position.isVector3 && rNbr(obj.position.length()))
    result += `position={[${rNbr(obj.position.x)}, ${rNbr(obj.position.y)}, ${rNbr(obj.position.z)},]} `
  if (obj.rotation && obj.rotation.isEuler && rNbr(obj.rotation.toVector3().length()))
    result += `rotation={[${rDeg(obj.rotation.x)}, ${rDeg(obj.rotation.y)}, ${rDeg(obj.rotation.z)},]} `
  if (
    obj.scale &&
    obj.scale.isVector3 &&
    !(rNbr(obj.scale.x) === 1 && rNbr(obj.scale.y) === 1 && rNbr(obj.scale.z) === 1)
  ) {
    const rX = rNbr(obj.scale.x)
    const rY = rNbr(obj.scale.y)
    const rZ = rNbr(obj.scale.z)
    if (rX === rY && rX === rZ) {
      result += `scale={${rX}} `
    } else {
      result += `scale={[${rX}, ${rY}, ${rZ},]} `
    }
  }
  if (options.meta && obj.userData && Object.keys(obj.userData).length)
    result += `userData={${JSON.stringify(obj.userData)}} `

  return result
}

const geometryToJsx = (object, isAnimated, duplicateGeometries) => {
  const { isInstanced, node, type } = getObjectInfo(object, duplicateGeometries)

  // Bail out on lights and bones
  if (type === 'bone') {
    return `<primitive object={${node}} />`
  }

  const childrenJsx =
    object?.children?.map((child) => geometryToJsx(child, isAnimated, duplicateGeometries)).join('') ?? ''

  const jsxName = isInstanced ? `instances.${duplicates.geometries[object.geometry.uuid].name}` : type

  const attributes = getAttributes(object, isAnimated)

  // Prune ...
  if (!options.keepgroups && !isAnimated && (type === 'group' || type === 'scene')) {
    /** Empty or no-property groups
     *
     * <group>
     *   <mesh geometry={nodes.foo} material={materials.bar} />
     */
    if (result === oldResult || obj.children.length === 0) {
      console.log('group removed (empty)')
      obj.__removed = true
      return children
    }

    if (options.aggressive) {
      function equalOrNegated(a, b) {
        return (a.x === b.x || a.x === -b.x) && (a.y === b.y || a.y === -b.y) && (a.z === b.z || a.z === -b.z)
      }

      // More aggressive removal strategies ...
      const first = obj.children[0]
      const firstProps = handleProps(first)
      const regex = /([a-z-A-Z]*)={([a-zA-Z0-9\.\[\]\-\,\ \/]*)}/g
      const keys1 = [...result.matchAll(regex)].map(([, match]) => match)
      const values1 = [...result.matchAll(regex)].map(([, , match]) => match)
      const keys2 = [...firstProps.matchAll(regex)].map(([, match]) => match)

      /** Double negative transforms
       *
       * <group rotation={[-Math.PI / 2, 0, 0]}>
       *   <group rotation={[Math.PI / 2, 0, 0]}>
       *     <mesh geometry={nodes.foo} material={materials.bar} />
       */
      if (obj.children.length === 1 && getType(first) === type && equalOrNegated(obj.rotation, first.rotation)) {
        if (keys1.length === 1 && keys2.length === 1 && keys1[0] === 'rotation' && keys2[0] === 'rotation') {
          console.log('group removed (double negative rotation)')
          obj.__removed = first.__removed = true
          children = ''
          if (first.children) first.children.forEach((child) => (children += print(objects, child)))
          return children
        }
      }

      /** Transform overlap
       *
       * <group position={[10, 0, 0]} scale={2} rotation={[-Math.PI / 2, 0, 0]}>
       *   <mesh geometry={nodes.foo} material={materials.bar} />
       */
      const isChildTransformed = keys2.includes('position') || keys2.includes('rotation') || keys2.includes('scale')
      const hasOtherProps = keys1.some((key) => !['position', 'scale', 'rotation'].includes(key))
      if (obj.children.length === 1 && !isChildTransformed && !hasOtherProps) {
        console.log(`group removed (${keys1.join(' ')} overlap)`)
        children = print(objects, first, keys1.map((key, i) => `${key}={${values1[i]}}`).join(' '))
        obj.__removed = true
        return children
      }

      /** Lack of content
       *
       * <group position={[10, 0, 0]} scale={2} rotation={[-Math.PI / 2, 0, 0]}>
       *   <group position={[10, 0, 0]} scale={2} rotation={[-Math.PI / 2, 0, 0]}>
       *     <group position={[10, 0, 0]} scale={2} rotation={[-Math.PI / 2, 0, 0]} />
       */
      const empty = []
      obj.traverse((o) => {
        console.log('group removed (lack of content)')
        const type = getType(o)
        if (type !== 'group' && type !== 'object3D') empty.push(o)
      })
      if (!empty.length) {
        empty.forEach((o) => (o__removed = true))
        return ''
      }
    }
  }

  // Inject properties
  result += ' ' + inject + ' '

  // Close tag
  result += `${children.length ? '>' : '/>'}\n`

  // Add children and return
  if (children.length) result += children + `</${type}>`
  return result
}

module.exports = { geometryToJsx }
