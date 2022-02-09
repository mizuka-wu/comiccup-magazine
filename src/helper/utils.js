import fs from 'fs'
import { GROUP_ID_REG, SORT_ORDER } from './consts'

export function getGroupPositon (index) {
  return index % 2 ? 'right' : 'left'
}

/**
 * 删除某个文件夹
 * @param {string} path
 */
export function delDir (path) {
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
 * 获取一个页分组的名字
 */
export function getPageGroupName (pageGroup) {
  const [leftPage = [], rightPage = []] = pageGroup
  const firstBook = leftPage[0]
  const lastBook = rightPage.length ? rightPage[rightPage.length - 1] : leftPage[leftPage.length - 1]

  return `${firstBook.groupId.split('-')[0]}-${lastBook.groupId.replace(/\d?-/, '')}(${leftPage.length + rightPage.length}本)`
}

/**
 * sort规则
 */
export function handleSort (prev, next, sortOrder = SORT_ORDER) {
  const prevReg = prev.groupId.match(GROUP_ID_REG)
  const nextReg = next.groupId.match(GROUP_ID_REG)
  if (prevReg && nextReg) {
    // eslint-disable-next-line
      const [_prev, prevAreaId, prevAreaOrder] = prevReg
    // eslint-disable-next-line
      const [_next, nextAreaId, nextAreaOrder] = nextReg
    // 不同区域
    if (prevAreaId !== nextAreaId) {
      return sortOrder.indexOf(prevAreaId) - sortOrder.indexOf(nextAreaId)
    } else {
      // 同区域
      return (+prevAreaOrder) - (+nextAreaOrder)
    }
  } else {
    return 0
  }
}
