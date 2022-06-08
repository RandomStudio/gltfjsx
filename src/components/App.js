'use strict'
const React = require('react')
const { useEffect } = require('react')
const importJsx = require('import-jsx')
const gltfjsx = require('../gltfjsx')
const ErrorBoundary = importJsx('./ErrorBoundary')

const ConsoleOutput = (props) => {
  useEffect(() => {
    async function run() {
      try {
        await gltfjsx(props)
      } catch (error) {
        throw error
      }
    }
    run()
  }, [])

  return null
}

module.exports = (props) => (
  <ErrorBoundary>
    <ConsoleOutput {...props} />
  </ErrorBoundary>
)
