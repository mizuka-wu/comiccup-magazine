const fs = require('fs')

const SORT_ORDER = [
  // 26字母
  ...Object.keys(Array.from(new Array(26))).map(key => String.fromCharCode(+key + 65)),
  'Ω',
  ...['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬']]

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
const NAME_REG = /\(([Ω\u4e00-\u9fa5A-Z]\d+-?[Ω\u4e00-\u9fa5A-Z]?\d+)\)\[(.*?)\](.*)/
const GROUP_ID_REG = /([Ω\u4e00-\u9fa5A-Z])(\d*)/

/**
 * 名字和类型
 */
const BOOK_NAME_REG = /(.*?)\(\d+\).*?\.(.*)/

/**
 * 空白图片
 */
const EMPTY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4////fwAJ+wP9CNHoHgAAAABJRU5ErkJggg=='

/**
 * sort规则
 */

const handleSort = function (prev, next) {
  const prevReg = prev.groupId.match(GROUP_ID_REG)
  const nextReg = next.groupId.match(GROUP_ID_REG)
  if (prevReg && nextReg) {
    // eslint-disable-next-line
    const [_prev, prevAreaId, prevAreaOrder] = prevReg
    // eslint-disable-next-line
    const [_next, nextAreaId, nextAreaOrder] = nextReg
    // 不同区域
    if (prevAreaId !== nextAreaId) {
      return SORT_ORDER.indexOf(prevAreaId) - SORT_ORDER.indexOf(nextAreaId)
    } else {
      // 同区域
      return (+prevAreaOrder) - (+nextAreaOrder)
    }
  } else {
    return 0
  }
}

module.exports = {
  delDir,
  getGroupPositon,
  handleSort,
  PAGE_POSITION,
  NAME_REG,
  BOOK_NAME_REG,
  EMPTY_PNG,
  GROUP_ID_REG
}
