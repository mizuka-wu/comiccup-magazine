/* eslint-disable no-unused-vars */
/**
 * 将meta转码并导出
 */
import fs from 'fs'
import _path from 'path'
import imgType from 'img-type'
import { FOLDER_NAME, PAGE_POSITION, EMPTY_PNG, CELL_IMAGE_WIDTH } from './consts'
import { delDir, getGroupPositon, getPageGroupName } from './utils'
import generatePhotoshopScript from './photoshopScript'
import Jimp from 'jimp'

/**
 * 生成文件到指定路径
 * @param {*} pageGroups
 * @param {*} targetDir
 * @param {{ containerName: string, photo: boolean }} [options]
 */
export default async function (pageGroups, targetDir, options = {}) {
  const dir = _path.join(targetDir, FOLDER_NAME)
  if (fs.existsSync(dir)) {
    delDir(dir)
  }
  fs.mkdirSync(dir)

  // 生成导出的文件
  await Promise.all(pageGroups.map(async (pageGroup) => {
    const dirName = _path.join(dir, getPageGroupName(pageGroup))
    fs.mkdirSync(dirName)
    const metaInfoConfig = {
      [PAGE_POSITION.LEFT]: [],
      [PAGE_POSITION.RIGHT]: []
    }
    await Promise.all(pageGroup.map(async (books, index) => {
      const positionName = getGroupPositon(index)
      const pagesDirName = _path.join(dirName, positionName)
      fs.mkdirSync(pagesDirName)
      const metaInfo = []
      await Promise.all(books.map(async (book, bookIndex) => {
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

          // 如果是出图模式，会先生成一张原图 + 导入的图，否则直接copy到目录即可
          if (options.photo) {
            const originImg = fs.openSync(targetPathName.replace(`.${fileType}`, `-origin.${fileType}`), 'w')
            fs.writeFileSync(originImg, buffer)
            // 图片大小调整, 适配宽度
            const jimp = await Jimp.read(buffer)
            jimp.scale(CELL_IMAGE_WIDTH / jimp.getWidth())
            buffer = await jimp.getBufferAsync(Jimp[`MIME_${fileType.toUpperCase()}`])
          }
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

        // 输出回调
        if (options.onProcess) {
          options.onProcess(metaInfo.length)
        }

        // 总的
        metaInfoConfig[positionName].push({
          order: bookIndex + 1,
          name: book.name,
          groupId: book.groupId,
          stallName: book.stallName,
          targetPathName: escape(_path.resolve(process.cwd(), targetPathName)),
          position: positionName
        })
      }))
      const meta = fs.openSync(_path.join(pagesDirName, `${positionName}-meta.csv`), 'w')
      fs.writeFileSync(meta, metaInfo.join('\n'))
    }))
    // 生成脚本文件
    const scriptFile = fs.openSync(_path.join(dirName, 'comiccup.jsx'), 'w')
    const scriptContent = generatePhotoshopScript(metaInfoConfig, {
      photo: options.photo,
      CONTAINER_NAME: options.containerName
    })
    fs.writeFileSync(scriptFile, scriptContent)
  }))
}
