const fs = require('fs')
const _path = require('path')
const imgType = require('img-type')
const { PAGE_POSITION, getGroupPositon, delDir, NAME_REG } = require('./utils')

const PATH = './pages'
const EACH_GROUP_SIZE = 4 * 5

const pages = []

/**
 * 社团
 */
const groups = fs
  .readdirSync(PATH)
  .filter(item => item !== '.DS_Store')
  .map(group => {
    /**
     * 获取，全名，社团名， 摊位名
     */
    const [path, groupId, groupName, stallName] = group.match(NAME_REG)
    return {
      stallName: stallName || groupName, // 没有摊位取社团
      path: `${PATH}/${path}`,
      groupId,
      groupName: groupName
    }
  })

/**
 * 获取所有书籍
 */
groups.forEach(group => {
  const { path, stallName, groupId } = group
  const books = fs.readdirSync(path).map(book => {
    const [bookFullName, bookName, type] = book.match(/(.*?)\(\d+\).*?\.(.*)/)
    return {
      path: _path.join(__dirname, path, bookFullName),
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
    if (!page || page.length === EACH_GROUP_SIZE) {
      page = []
      pages.push(page)
    }
    page.push(book)
  })
})

/**
 * 输出到对应文件夹
 */
if (fs.existsSync('./dist')) delDir('./dist')
fs.mkdirSync('./dist')

/**
 * 左右分组后的页面
 */
const pageGroups = pages.reduce((groups, pages, index) => {
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

pageGroups.forEach((pageGroup, groupIndex) => {
  const dirName = _path.join('dist', `group${groupIndex}`)
  fs.mkdirSync(dirName)
  pageGroup.forEach((books, index) => {
    const positionName = getGroupPositon(index)
    const pagesDirName = _path.join(dirName, positionName)
    fs.mkdirSync(pagesDirName)
    const metaInfo = []
    books.forEach((book, bookIndex) => {
      const bookPath = book.path
      const buffer = fs.readFileSync(bookPath)
      const fileType = imgType.getTypeFromBuffer(buffer)
      const targetPathName = _path.join(pagesDirName, `${bookIndex + 1}.${fileType}`)
      const img = fs.openSync(targetPathName, 'w')
      fs.writeFileSync(img, buffer)

      /**
        * 输出meta信息
        * 序号，本子名，社团序号，社团名字
        */
      metaInfo.push(
      `${bookIndex + 1},${book.name},${book.groupId},${book.stallName}`
      )
    })
    const meta = fs.openSync(_path.join(pagesDirName, 'meta.csv'), 'w')
    fs.writeFileSync(meta, metaInfo.join('\n'))
  })
})

console.log('整理完成')
