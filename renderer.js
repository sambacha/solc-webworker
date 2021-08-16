module.exports = () => {
  const worker = new Worker(document.currentScript.src) // in practice a "bundle" to inline all required modules
  worker.onmessage = event => console.log('[from worker to renderer] ', event.data)
  worker.postMessage('hello worker')
  // ...
}