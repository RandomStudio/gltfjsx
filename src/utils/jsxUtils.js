const parseScene = require('../parser/parser')

const createImportsJsx = (hasAnimations, hasInstances) => {
  return `
        import React, { useRef ${hasInstances ? ', useMemo' : ''} } from 'react';
        import { useGLTF, ${hasInstances ? 'Merged, ' : ''} ${
    scene.includes('PerspectiveCamera') ? 'PerspectiveCamera,' : ''
  }
        ${scene.includes('OrthographicCamera') ? 'OrthographicCamera,' : ''}
        ${hasAnimations ? 'useAnimations' : ''} } from '@react-three/drei'
    `
}

const createAnimationsJsx = (animations) => {
  if (animations.length === 0) {
    return
  }

  return 'const { actions } = useAnimations(animations, group)'
}

const createHooksJsx = (hasAnimations, url) => {
  return `const { nodes, materials${hasAnimations ? ', animations' : ''} } = useGLTF('${url}')`
}

const parseGltf = (gltf, config) => {
  const { animations } = gltf
  const scene = parseScene(gltf, config)
  console.log(scene)

  const hasAnimations = animations.length > 0
  const hasInstances = true

  const importsJsx = createImportsJsx(hasAnimations, hasInstances)
  const animationsJsx = createAnimationsJsx(animations)

  return [importsJsx, animationsJsx].join('\n')
}

module.exports = { parseGltf }
