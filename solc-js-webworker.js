// solc-js-webworker.js
const solcjs = require('solc-js')

var lid = 0
var compiler

onmessage = async event => {
  const [lid, from, path, ref, type, body] = event.data

  if (type === 'version') retrun version(from, lid, body)
  if (type === 'compile')  return compile(body)
  // ...
}

function version (from, path, ref, body) {
  compiler = await solcjs(version)
  self.postMessage([lid++, from,  path, ref,  compiler.version])
}

function compile (from, path, ref, body) {
  if (!compiler) compiler = solcjs()
  const output = await solcjs(body)
  self.postMessage([lid++, from,  path, ref,  output])
  // TODO: 1. handle errors
  // TODO: 2. enable multiple round trips to support resolving imports
}