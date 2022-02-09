import { CELL_IMAGE_HEIGHT, CELL_IMAGE_WIDTH, BODY_NAME } from './consts'
export default function (meta, options = {}) {
  if (typeof meta === 'object') {
    meta = JSON.stringify(meta, null, 2)
  }
  const {
    CONTAINER_NAME = '组1',
    photo = true,
    CELL_WIDTH_OFFSET = 372,
    CELL_HEIGHT_OFFSET = 616,
    CELL_CROSS_PAGE_OFFSET = 1974,
    FIRST_CELL_IMAGE_X = -1735,
    FIRST_CELL_IMAGE_Y = -805
  } = options
  return `/* eslint-disable no-undef */
// 相关变量定义
var ROW_NUMBER = 4 // 几行
var COL_EACH_ROW = 5 // 每行几个格子
var CELL_WIDTH_OFFSET = ${CELL_WIDTH_OFFSET} // 每个格子的横向偏移量
var CELL_HEIGHT_OFFSET = ${CELL_HEIGHT_OFFSET} // 每个格子的纵向偏移量
var CELL_CROSS_PAGE_OFFSET = ${CELL_CROSS_PAGE_OFFSET} // 跨页偏移量
// 这个凭经验了 需要更好的找中心点方案
var FIRST_CELL_IMAGE_X = ${FIRST_CELL_IMAGE_X} // 第一个需要填入的格子的中心点位置X 310
var FIRST_CELL_IMAGE_Y = ${FIRST_CELL_IMAGE_Y} // 第一个需要填入的格子的中心点位置Y 705
var CELL_IMAGE_WIDTH = ${CELL_IMAGE_WIDTH} // 每张图片的宽度
var CELL_IMAGE_HEIGHT = ${CELL_IMAGE_HEIGHT} // 每张图片的高度
var IMAGE_FILES_SETS_NAME = '本子封面'
var BODY_NAME = '${BODY_NAME}'
var CONTAINER_NAME = '${CONTAINER_NAME}'
// 哨兵
var lastGroupId = null
var message = 'CP自动填字脚本'
var meta = ${meta}
alert(message)
// 获取容器， 中间/组1
var root = app.activeDocument.layerSets.getByName(BODY_NAME).layerSets.getByName(CONTAINER_NAME)
/**
 * 摊位名复制
 * 也就是最后16个代表摊位的元素(4行，左右两边，摊位id + 名 两个textarea)
 * 危险操作，因为有循环时候增加数据的操作，操控不好会死循环
 */
for (var i = root.artLayers.length - ROW_NUMBER * 2 * 2; i < root.artLayers.length; i = i + COL_EACH_ROW) {
  var layer = root.artLayers[i]
  // 每行已经有一个默认的了，所以-1
  for (var j = 0; j < (COL_EACH_ROW - 1); j++) {
    var copy = layer.duplicate()
    // 从后往前，位置保证一致
    var offset = CELL_WIDTH_OFFSET * (COL_EACH_ROW - 1 - j)
    copy.translate(new UnitValue(offset + ' pixels'))
  }
}
/**
 * 左边填本子名字和社团名字
 */
var left = meta.left
for (var leftIndex = 0; leftIndex < left.length; leftIndex++) {
  var artIndex = left.length - leftIndex - 1
  var leftBook = left[leftIndex]
  // 改为本子名
  root.artLayers[artIndex].textItem.contents = leftBook.name
  // 改对应的社团名 因为摊位名称不是成组复制的，需要通过取余数来判断偏移(x2因为空了一行)
  var leftBookGroupIdIndex = root.artLayers.length - 1 - (leftIndex % COL_EACH_ROW) - Math.floor(leftIndex / COL_EACH_ROW) * COL_EACH_ROW * 2
  var leftBookStallNameIndex = leftBookGroupIdIndex - COL_EACH_ROW
  root.artLayers[leftBookGroupIdIndex].textItem.contents = leftBook.groupId
  root.artLayers[leftBookStallNameIndex].textItem.contents = leftBook.stallName
  // 同一个社团则隐藏名字
  if (lastGroupId === leftBook.groupId) {
    root.artLayers[leftBookGroupIdIndex].visible = false
    root.artLayers[leftBookStallNameIndex].visible = false
  }
  // 哨兵赋值
  lastGroupId = leftBook.groupId
}
/**
 * 右边填本子名字和社团名字
 */
var right = meta.right
for (var rightIndex = 0; rightIndex < right.length; rightIndex++) {
  var rightBook = right[rightIndex]
  // 本子名字填充
  var layerSetsIndex = ROW_NUMBER - Math.floor(rightIndex / COL_EACH_ROW) - 1 // 获取分组位子, 倒序
  var artLayerIndex = COL_EACH_ROW - (rightIndex % COL_EACH_ROW) - 1
  var layerSet = root.layerSets[layerSetsIndex]
  layerSet.artLayers[artLayerIndex].textItem.contents = rightBook.name
  // 改对应的社团名 因为摊位名称不是成组复制的，需要通过取余数来判断偏移(x2因为空了一行), 顺便减去left所占用的格子（20 * 2）
  var rightBookGroupIdIndex = (root.artLayers.length - ROW_NUMBER * COL_EACH_ROW * 2) - 1 - (rightIndex % COL_EACH_ROW) - Math.floor(rightIndex / COL_EACH_ROW) * COL_EACH_ROW * 2
  var rightBookStallNameIndex = rightBookGroupIdIndex - COL_EACH_ROW
  root.artLayers[rightBookGroupIdIndex].textItem.contents = rightBook.groupId
  root.artLayers[rightBookStallNameIndex].textItem.contents = rightBook.stallName
  // 同一个社团则隐藏名字
  if (lastGroupId === rightBook.groupId) {
    root.artLayers[rightBookGroupIdIndex].visible = false
    root.artLayers[rightBookStallNameIndex].visible = false
  }
  // 哨兵赋值
  lastGroupId = rightBook.groupId
}
${photo ? `
/**
 * 图片填充
 */
var imageFiles = [].concat(meta.left).concat(meta.right)
// 新建存储文件夹，放到边框下方防止遮挡边框
var imageFilesSets = app.activeDocument.layerSets.add()
imageFilesSets.name = IMAGE_FILES_SETS_NAME
imageFilesSets.move(app.activeDocument.layerSets.getByName(BODY_NAME), ElementPlacement.PLACEAFTER)
for (var imageIndex = 0; imageIndex < imageFiles.length; imageIndex++) {
  var imageFile = imageFiles[imageIndex]
  var filePath = imageFile.targetPathName
  var imageDocument = app.open(File(filePath))
  // 拷贝进壁纸内部
  var imageArt = imageDocument.artLayers[0]
  imageArt.copy()
  imageDocument.close()
  var imageArtHorizontal = app.activeDocument.paste() // 横向版本的
  imageArtHorizontal.move(imageFilesSets, ElementPlacement.INSIDE)
  imageArtHorizontal.name = imageIndex + 1 + '横'
  // 最终放到的位置的中心点
  var targetX =
    FIRST_CELL_IMAGE_X +
    Math.floor(imageIndex / (ROW_NUMBER * COL_EACH_ROW)) * CELL_CROSS_PAGE_OFFSET + // 跨页面偏移
    (imageIndex % COL_EACH_ROW) * CELL_WIDTH_OFFSET // 格子偏移
  var targetY =
    FIRST_CELL_IMAGE_Y +
    Math.floor((imageIndex % (COL_EACH_ROW * ROW_NUMBER)) / COL_EACH_ROW) * CELL_HEIGHT_OFFSET // 和一页总数进行取余，然后判断跨行多少次
  imageArtHorizontal.translate(
    new UnitValue((targetX) + ' pixels'),
    new UnitValue((targetY) + ' pixels')
  )
}
` : ''}
`
}
