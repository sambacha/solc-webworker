// solc-js-worker-proxy.js
const worker_solcjs = new Worker('bundle_solc-js-webworker.js')
worker_solcjs.onmessage = handler

const from = '/', sent = [], received = {}
var lid = 1

module.exports = solcjs_worker_proxy

async function solcjs_worker_proxy (version) {
  return new Promise((resolve, reject) => {
    const message = [lid++, from, /*path*/'/', /*ref*/0/*(initialize new conversation)*/, /*type*/'init'/*(create new compiler)*/, /*body*/version || 'latest']
    sent.push([message, [resolve, reject])
    worker_solcjs.postMessage(message)
  })
}

function handler ({ data: message }) {
  const [lid_, from_, path_, ref_, type_, body_] = message
  try {
    const [[_lid, _from, _path, _ref, _type, _body], executor ] = msglog[ref_]
    if ((ref_ !== _lid) || (path_ !== _from)) throw new Error('@TODO: error in received `data`')
    ;(received[from_] || (received[from_] = [])).push(message)
    if (_type === 'init') return init([type_, body_], executor)
    if (_type === 'compile') return compile([type_, body_], executor)
    if (_type === 'help') return _help([type_, body_])
    // @TODO: handle more type's
  } catch (e) {
    console.error(e) // @TODO: handle communication initiated by worker or unexpected message from worker
  }
}

function init ([type, body], [resolve, reject]) {
  if (type === 'error') return reject(body)
  if (type === 'ok') {
    const path = `/compiler/${body}` // e.g. "/compiler/1"
    async function compile (sourcecode) {
      return new Promise((resolve, reject) => {
        const message = [lid++, from, path, 0, 'compile', sourcecode]
        sent.push([message, [resolve, reject])
        worker_solcjs.postMessage(message)
      })
    }
    return resolve(compile)
  }
  reject(`@TODO: handle unknown response type '${type}'`)
}
function compile (type, body, [resolve, reject]) {
  if (type === 'error') return reject(body)
  if (type === 'ok') return resolve(body)
  reject(`@TODO: handle unknown response type '${type}'`)
}
function _help ([type, body]) {
  if (type === 'ok') return console.log(body)
  // e.g. { '/': { types: ['help', 'init'] } }
  // or e.g. { '/': { types: ['help', 'init'] }, '/compiler/1': { types: ['compile', 'versions', 'version2url'] } }
  if (type === 'error') {}
  throw new Error(`@TODO: handle unknown response type '${type}'`)
}