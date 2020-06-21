const fs = require('fs')

const PAGE_POSITION = {
  LEFT: 'left',
  RIGHT: 'right'
}

function getGroupPositon (index) {
  return index % 2 ? 'right' : 'left'
}

function delDir (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      const curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

/**
 * 捕获分组名字的
 */
const NAME_REG = /\(([A-Z]\d+-?[A-Z]?\d+)\)\[(.*?)\](.*)/

module.exports = {
  delDir,
  getGroupPositon,
  PAGE_POSITION,
  NAME_REG
}
