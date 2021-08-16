const worker = require('./worker')
const renderer = require('./renderer')

if (location.pathname === '/' || location.pathname === '/index.html') renderer()
else if (location.pathname === '/bundle.js') worker() // that's actually how it works in web workers :-)
else console.error('unexpected pathname', location.pathname)