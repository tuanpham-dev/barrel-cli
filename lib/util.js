const colors = require('colors')
const theme = require('@shopify/themekit').command
const config = require('./configure')
const minimatch = require('minimatch')

const sendToShopify = (action, src, cb) => {
  const file = src.replace(/\/?dist\//, '')

  if (isIgnoredFile(file)) {
    console.log(`Ignoring: ${src}`.blue)
    return cb()
  }

  theme({
    args: [
      action, 
      '--env', process.env.ENV, 
      '--config', config.get('configPath'),
      src
    ],
    logLevel: 'silent'
  }, e => {
    if (e) {
      console.log(`${e}`.red)
    } else {
      console.log(`[${action}] ${src}`.white)
    }

    cb(e)
  })
}

const isIgnoredFile = file => {
  const ignoreFiles = config.get('ignore_files')

  return ignoreFiles.some(pattern => minimatch(file, pattern))
}

module.exports = {
  sendToShopify
}