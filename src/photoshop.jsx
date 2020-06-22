/* eslint-disable no-undef */
// 相关变量定义
var ROW_NUMBER = 4 // 几行
var COL_EACH_ROW = 5 // 每行几个格子

var CELL_WIDTH_OFFSET = 372 // 每个格子的横向偏移量
var CELL_HEIGHT_OFFSET = 616 // 每个格子的纵向偏移量
var CELL_CROSS_PAGE_OFFSET = 1974 // 跨页偏移量

// 这个凭经验了 需要更好的找中心点方案
var FIRST_CELL_IMAGE_X = 310 // 第一个需要填入的格子的中心点位置X
var FIRST_CELL_IMAGE_Y = 705 // 第一个需要填入的格子的中心点位置Y

var CELL_IMAGE_WIDTH = 328 // 每张图片的宽度
var CELL_IMAGE_HEIGHT = 437 // 每张图片的高度
var IMAGE_FILES_SETS_NAME = '本子封面'
var BODY_NAME = '中间'
var CONTAINER_NAME = '组 1'

// 哨兵
var lastGroupId = null

var message = 'CP自动填字脚本'
message += ',当前Photoshop版本为： ' + app.version + '\r\r'
message += '点击确定后，开始工作，运行非常慢，请耐心等待...'

var meta = {
  left: [
    {
      order: 1,
      name: '【CP24首发】Fleh and Blood',
      groupId: 'E100',
      stallName: '第五人格～',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/1.png',
      position: 'left'
    },
    {
      order: 2,
      name: '【CP24首发】Hardcore',
      groupId: 'E100',
      stallName: '第五人格～',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/2.jpeg',
      position: 'left'
    },
    {
      order: 3,
      name: '《困兽犹斗》',
      groupId: 'E101',
      stallName: '拆椅侦探社',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/3.jpeg',
      position: 'left'
    },
    {
      order: 4,
      name: '《随缘》第五人格杰园本',
      groupId: 'E101',
      stallName: '拆椅侦探社',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/4.jpeg',
      position: 'left'
    },
    {
      order: 5,
      name: '第五人格同人图册',
      groupId: 'E101',
      stallName: '拆椅侦探社',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/5.jpeg',
      position: 'left'
    },
    {
      order: 6,
      name: '【CP24首发】杰佣《My Captain》',
      groupId: 'E102',
      stallName: '不吃香菜',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/6.jpeg',
      position: 'left'
    },
    {
      order: 7,
      name: '【CP24首发】杰佣《危险关系》',
      groupId: 'E102',
      stallName: '不吃香菜',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/7.png',
      position: 'left'
    },
    {
      order: 8,
      name: '【第五人格摄殓】Lie to me',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/8.png',
      position: 'left'
    },
    {
      order: 9,
      name: '【第五人格摄殓】白玫瑰',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/9.png',
      position: 'left'
    },
    {
      order: 10,
      name: '【第五人格杰佣】彩虹',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/10.jpeg',
      position: 'left'
    },
    {
      order: 11,
      name: '【第五人格杰佣】恋人未满',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/11.jpeg',
      position: 'left'
    },
    {
      order: 12,
      name: '[M·D·O]BY ARSH星垣',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/12.png',
      position: 'left'
    },
    {
      order: 13,
      name: '[宝百]くすり',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/13.jpeg',
      position: 'left'
    },
    {
      order: 14,
      name: '《囚鸟+特典》嘉瑞',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/14.jpeg',
      position: 'left'
    },
    {
      order: 15,
      name: '《星与花》',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/15.jpeg',
      position: 'left'
    },
    {
      order: 16,
      name: '《杰佣-怦然心动》BY本子记者',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/16.png',
      position: 'left'
    },
    {
      order: 17,
      name: '《神与宿命论》BY弦上雪 黄占',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/17.png',
      position: 'left'
    },
    {
      order: 18,
      name: '《黄占-不归林》BY本子记者',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/18.png',
      position: 'left'
    },
    {
      order: 19,
      name: '可食用型帕罗斯',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/19.jpeg',
      position: 'left'
    },
    {
      order: 20,
      name: '遗照组漫本',
      groupId: 'E105',
      stallName: 'Unione',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/left/20.jpeg',
      position: 'left'
    }
  ],
  right: [
    {
      order: 1,
      name: '（寄售） Allegiant《臣道》终宣',
      groupId: 'E105',
      stallName: 'Unione',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/1.jpeg',
      position: 'right'
    },
    {
      order: 2,
      name: '歡迎來到召喚師梗谷',
      groupId: 'E106',
      stallName: 'Rio煮飯仔',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/2.png',
      position: 'right'
    },
    {
      order: 3,
      name: 'Save you Save me',
      groupId: 'E109',
      stallName: '小浣熊不吃面',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/3.jpeg',
      position: 'right'
    },
    {
      order: 4,
      name: '双向暗恋',
      groupId: 'E109',
      stallName: '小浣熊不吃面',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/4.jpeg',
      position: 'right'
    },
    {
      order: 5,
      name: '香子大小姐想让我告白',
      groupId: 'E109',
      stallName: '小浣熊不吃面',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/5.jpeg',
      position: 'right'
    },
    {
      order: 6,
      name: 'happy birthday',
      groupId: 'E110',
      stallName: '柴雕',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/6.jpeg',
      position: 'right'
    },
    {
      order: 7,
      name: '影が見えない昼だから',
      groupId: 'E111',
      stallName: '似晨光',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/7.jpeg',
      position: 'right'
    },
    {
      order: 8,
      name: '月が見えない夜だから',
      groupId: 'E111',
      stallName: '似晨光',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/8.jpeg',
      position: 'right'
    },
    {
      order: 9,
      name: '新兰综合本',
      groupId: 'E112',
      stallName: '桜花班',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/9.jpeg',
      position: 'right'
    },
    {
      order: 10,
      name: '钢穴 x 底特律：成为人类',
      groupId: 'E112',
      stallName: '桜花班',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/10.jpeg',
      position: 'right'
    },
    {
      order: 11,
      name: '【降志（透哀）同人本】日界线',
      groupId: 'E113',
      stallName: 'MOONE',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/11.jpeg',
      position: 'right'
    },
    {
      order: 12,
      name: '赤安漫本',
      groupId: 'E115',
      stallName: '冷凍佈丁',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/12.jpeg',
      position: 'right'
    },
    {
      order: 13,
      name: '赤安漫画本',
      groupId: 'E115',
      stallName: '冷凍佈丁',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/13.jpeg',
      position: 'right'
    },
    {
      order: 14,
      name: 'I AM HERE',
      groupId: 'E116',
      stallName: '江户川花火',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/14.jpeg',
      position: 'right'
    },
    {
      order: 15,
      name: '【cp23首发】Fahion Week',
      groupId: 'E116',
      stallName: '江户川花火',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/15.jpeg',
      position: 'right'
    },
    {
      order: 16,
      name: 'I WANT STAY WITH U',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/16.jpeg',
      position: 'right'
    },
    {
      order: 17,
      name: '《LET＇S 换装！》赤安换装小本子',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/17.png',
      position: 'right'
    },
    {
      order: 18,
      name: '【闪轨】埃雷波尼亚童话集',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/18.png',
      position: 'right'
    },
    {
      order: 19,
      name: '陆奥守吉行主题画册《无限》',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/19.jpeg',
      position: 'right'
    },
    {
      order: 20,
      name: '双星Binary',
      groupId: 'E118',
      stallName: '干了这杯假酒',
      targetPathName: '/Users/mizuka/Projects/comiccup/dist/group0/right/20.png',
      position: 'right'
    }
  ]
}

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
  var imageArtVertical = imageArtHorizontal.duplicate()
  imageArtHorizontal.name = imageIndex + 1 + '横'
  imageArtVertical.name = imageIndex + 1 + '竖'
  var bounds = imageArtHorizontal.bounds
  // 获取图片大小，计算调整比例
  var imageWidth = Number(bounds[2].toString().replace(' px', '')) - Number(bounds[0].toString().replace(' px', ''))
  var imageHeight = Number(bounds[3].toString().replace(' px', '')) - Number(bounds[1].toString().replace(' px', ''))
  var widthScale = CELL_IMAGE_WIDTH / imageWidth * 100
  var heightScale = CELL_IMAGE_HEIGHT / imageHeight * 100
  // 最终放到的位置的中心点

  var targetX =
    FIRST_CELL_IMAGE_X +
    Math.floor(imageIndex / (ROW_NUMBER * COL_EACH_ROW)) * CELL_CROSS_PAGE_OFFSET + // 跨页面偏移
    (imageIndex % COL_EACH_ROW) * CELL_WIDTH_OFFSET // 格子偏移

  var targetY =
    FIRST_CELL_IMAGE_Y +
    Math.floor((imageIndex % (COL_EACH_ROW * ROW_NUMBER)) / COL_EACH_ROW) * CELL_HEIGHT_OFFSET // 和一页总数进行取余，然后判断跨行多少次

  // 改变大小然后放到对应格子
  var positionedImageSets = [imageArtHorizontal, imageArtVertical]
  var imageScale = [imageArtHorizontal.resize(widthScale, widthScale), imageArtVertical.resize(heightScale, heightScale)]
  for (var positionedImageIndex = 0; positionedImageIndex < positionedImageSets.length; positionedImageIndex++) {
    var scale = imageScale[positionedImageIndex]
    var positionedImage = positionedImageSets[positionedImageIndex]
    positionedImage.resize(scale, scale) // 改大小
    var positionedImageBounds = positionedImage.bounds
    // 获取中心点，x + width/2， y + height / 2
    var centerX = (Number(positionedImageBounds[2].toString().replace(' px', '')) - Number(positionedImageBounds[0].toString().replace(' px', ''))) / 2 + Number(positionedImageBounds[0].toString().replace(' px', ''))
    var centerY = (Number(positionedImageBounds[3].toString().replace(' px', '')) - Number(positionedImageBounds[1].toString().replace(' px', ''))) / 2 + Number(positionedImageBounds[1].toString().replace(' px', ''))
    positionedImage.translate(
      new UnitValue((targetX - centerX) + ' pixels'),
      new UnitValue((targetY - centerY) + ' pixels')
    )
  }
}
