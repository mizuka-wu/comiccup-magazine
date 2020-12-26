const fs = require('fs')
const _path = require('path')
const imgType = require('img-type')
const { PAGE_POSITION, getGroupPositon, delDir, handleSort, NAME_REG, GROUP_ID_REG, BOOK_NAME_REG, EMPTY_PNG } = require('./utils')
const generatePhotoshopScript = require('./photoshop')

const DEFAULT_TARGET_FOLDER = _path.join('.', 'pages')
const EACH_GROUP_SIZE = 4 * 5

function getCorrectGroupId (groupId) {
  const match = groupId.match(new RegExp(GROUP_ID_REG, 'g'))
  if (match.length > 1) {
    // 需要将第二个替换成-
    return `${match[0]}-${match[1].substr(1)}`
  }
  return groupId
}

function writeError (error) {
  fs.writeFileSync(_path.join('.', 'error.log'), error.message || error)
}

async function main (targetFolder = DEFAULT_TARGET_FOLDER) {
  try {
    console.log('正在整理文件，请稍后。。。。')
    if (!fs.existsSync(targetFolder)) {
      throw new Error('文件夹不存在')
    }

    if (!fs.statSync(targetFolder).isDirectory()) {
      throw new Error('非文件夹，请检查')
    }

    const pages = []
    /**
  * 社团
  */
    const groups = fs
      .readdirSync(targetFolder)
      .filter(item => item !== '.DS_Store')
      .map(group => {
      /**
      * 获取，全名，社团名， 摊位名
      */
        if (!group.match()) {
          throw new Error(`${group} 社团名命名错误`)
        }
        const [path, groupId, groupName, stallName] = group.match(NAME_REG)

        return {
          stallName: stallName || groupName, // 没有摊位取社团
          path: `${targetFolder}/${path}`,
          groupId: getCorrectGroupId(groupId),
          groupName: groupName
        }
      })
      .sort(handleSort)

    /**
   * 获取所有书籍
   */
    groups.forEach(group => {
      const { path, stallName, groupId } = group
      const books = fs.readdirSync(path).map(book => {
        if (!book.match(BOOK_NAME_REG)) {
          throw new Error(`${book} 本子名错误，请检查`)
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

    pageGroups.forEach(async (pageGroup, groupIndex) => {
      const dirName = _path.join('dist', `group${groupIndex}`)
      fs.mkdirSync(dirName)
      const metaInfoConfig = {
        [PAGE_POSITION.LEFT]: [],
        [PAGE_POSITION.RIGHT]: []
      }
      pageGroup.forEach((books, index) => {
        const positionName = getGroupPositon(index)
        const pagesDirName = _path.join(dirName, positionName)
        fs.mkdirSync(pagesDirName)
        const metaInfo = []
        books.forEach((book, bookIndex) => {
          const bookPath = book.path
          try {
            fs.readFileSync(bookPath)
          } catch (e) {
            throw new Error(bookPath + '无法正确读取')
          }
          let buffer = fs.readFileSync(bookPath)
          let targetPathName = _path.join(pagesDirName, `${bookIndex + 1}.`)
          if (book.type === 'txt') {
            targetPathName = targetPathName + 'png'
            // 输出空白图片
            buffer = Buffer.from(EMPTY_PNG, 'base64')
          } else {
            const fileType = imgType.getTypeFromBuffer(buffer)
            targetPathName = targetPathName + fileType
          }

          const img = fs.openSync(targetPathName, 'w')
          fs.writeFileSync(img, buffer)

          /**
         * 输出meta信息
         * 序号，本子名，社团序号，社团名字，地址
         */
          metaInfo.push([
            bookIndex + 1, // 序号
            book.name, // 本子名
            book.groupId, // 社团序号
            book.stallName, // 社团名字
            targetPathName, // 具体地址
            positionName // 方向
          ].join(','))

          // 总的
          metaInfoConfig[positionName].push({
            order: bookIndex + 1,
            name: book.name,
            groupId: book.groupId,
            stallName: book.stallName,
            targetPathName: _path.resolve(process.cwd(), targetPathName),
            position: positionName
          })
        })
        const meta = fs.openSync(_path.join(pagesDirName, `${positionName}-meta.csv`), 'w')
        fs.writeFileSync(meta, metaInfo.join('\n'))
      })
      // 生成脚本文件
      // generatePhotoshopScript
      const scriptFile = fs.openSync(_path.join(dirName, 'comiccup.jsx'), 'w')
      fs.writeFileSync(scriptFile, generatePhotoshopScript(metaInfoConfig))
    })

    console.log('整理完成')
  } catch (e) {
    writeError(e)
  }
}

main()
