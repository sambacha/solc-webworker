module.exports = () => {
  onmessage = async event => {
    console.log('[from renderer to worker] ', event.data)
  }
  postMessage('hello renderer')
  // ...
}