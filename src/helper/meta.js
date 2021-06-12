/* eslint-disable no-unused-vars */
/**
 * 生成脚本所需配置的meta文件
 */
import fs from 'fs'
import _path from 'path'
import { PAGE_POSITION, PAGE_COLUMN, PAGE_ROW, NAME_REG, GROUP_ID_REG, BOOK_NAME_REG, SORT_ORDER } from './consts'
import { handleSort, getGroupPositon } from './utils'

const EACH_PAGE_SIZE = PAGE_COLUMN * PAGE_ROW

/**
 * groupId换成 A1-2这种
 * @param {string} groupId
 * @returns string
 */
function getCorrectGroupId (groupId) {
  const match = groupId.match(new RegExp(GROUP_ID_REG, 'g'))
  if (match.length > 1) {
    // 需要将第二个替换成-
    return `${match[0]}-${match[1].substr(1)}`
  }
  return groupId
}

/**
 * 获取所有社团
 * @param {string} targetFolderPath
 * @returns {Promise<{
        stallName: string
        path: string
        groupId: string
        groupName: string
      }[]>}
 */
export async function getGroupsFromPath (targetFolderPath = '', sortOrder) {
  if (!targetFolderPath) {
    throw new Error(`${targetFolderPath} 位置不存在`)
  }

  if (!fs.statSync(targetFolderPath).isDirectory()) {
    throw new Error('非文件夹，请检查')
  }

  /**
   * 获取所有社团, 并且根据社团名称排序
   */
  const groups = fs
    .readdirSync(targetFolderPath)
    .filter(item => item !== '.DS_Store')
    .map(group => {
      /**
       * 获取，全名，社团名， 摊位名
       */
      if (!group.match(NAME_REG)) {
        throw new Error(`${_path.join(targetFolderPath, group)} 不是一个社团，可能为文件或者不符合社团命名规范！`)
      }
      const [path, groupId, groupName, stallName] = group.match(NAME_REG)

      return {
        stallName: stallName || groupName, // 没有摊位取社团
        path: _path.join(targetFolderPath, path),
        groupId: getCorrectGroupId(groupId),
        groupName: groupName
      }
    })
    .sort((prev, next) => handleSort(prev, next, sortOrder))

  return groups
}

/**
 * 生成meta
 * @param {string} targetFolderPath
 */
export default async function (targetFolderPath = '') {
  const groups = await getGroupsFromPath(targetFolderPath)

  // 获取每一页
  const pages = []
  groups.forEach(group => {
    const { path, stallName, groupId } = group
    const books = fs.readdirSync(path).map(book => {
      if (!book.match(BOOK_NAME_REG)) {
        throw new Error(`${_path.join(path, book)} 本子名错误或者不符合规范，请检查`)
      }
      const [bookFullName, bookName, type] = book.match(BOOK_NAME_REG)
      return {
        path: _path.join(path, bookFullName),
        name: bookName,
        stallName,
        type,
        groupId
      }
    })

    /**
     * 增加分组
     */
    books.forEach(book => {
      let page = pages[pages.length - 1]
      // 满了或者不存在就推一个
      if (!page || page.length === EACH_PAGE_SIZE) {
        page = []
        pages.push(page)
      }
      page.push(book)
    })
  })

  const pageWithGroups = pages.reduce((groups, pages, index) => {
    const pagePositon = getGroupPositon(index)

    if (pagePositon === PAGE_POSITION.LEFT) {
      groups.push([
        pages
      ])
    } else {
      const lastGroup = groups.pop()
      lastGroup.push(pages)
      groups.push(lastGroup)
    }

    return groups
  }, [])

  return pageWithGroups
}
