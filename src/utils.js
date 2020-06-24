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
 * 社团号 全名，社团名， 摊位名
 */
const NAME_REG = /\(([A-Z]\d+-?[A-Z]?\d+)\)\[(.*?)\](.*)/

/**
 * 名字和类型
 */
const BOOK_NAME_REG = /(.*?)\(\d+\).*?\.(.*)/

module.exports = {
  delDir,
  getGroupPositon,
  PAGE_POSITION,
  NAME_REG,
  BOOK_NAME_REG
}
