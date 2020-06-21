/* eslint-disable no-undef */
var rowNumber = 8
var colEachRow = 5

var message = 'CP自动填字脚本'
message += ',当前Photoshop版本为： ' + app.version + '\r\r'
message += '即将开始工作...'

var meta = {
  left: [
    {
      order: 1,
      name: '【CP24首发】Fleh and Blood',
      groupId: 'E100',
      stallName: '第五人格～',
      targetPathName: 'dist/group0/left/1.png'
    },
    {
      order: 2,
      name: '【CP24首发】Hardcore',
      groupId: 'E100',
      stallName: '第五人格～',
      targetPathName: 'dist/group0/left/2.jpeg'
    },
    {
      order: 3,
      name: '《困兽犹斗》',
      groupId: 'E101',
      stallName: '拆椅侦探社',
      targetPathName: 'dist/group0/left/3.jpeg'
    },
    {
      order: 4,
      name: '《随缘》第五人格杰园本',
      groupId: 'E101',
      stallName: '拆椅侦探社',
      targetPathName: 'dist/group0/left/4.jpeg'
    },
    {
      order: 5,
      name: '第五人格同人图册',
      groupId: 'E101',
      stallName: '拆椅侦探社',
      targetPathName: 'dist/group0/left/5.jpeg'
    },
    {
      order: 6,
      name: '【CP24首发】杰佣《My Captain》',
      groupId: 'E102',
      stallName: '不吃香菜',
      targetPathName: 'dist/group0/left/6.jpeg'
    },
    {
      order: 7,
      name: '【CP24首发】杰佣《危险关系》',
      groupId: 'E102',
      stallName: '不吃香菜',
      targetPathName: 'dist/group0/left/7.png'
    },
    {
      order: 8,
      name: '【第五人格摄殓】Lie to me',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: 'dist/group0/left/8.png'
    },
    {
      order: 9,
      name: '【第五人格摄殓】白玫瑰',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: 'dist/group0/left/9.png'
    },
    {
      order: 10,
      name: '【第五人格杰佣】彩虹',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: 'dist/group0/left/10.jpeg'
    },
    {
      order: 11,
      name: '【第五人格杰佣】恋人未满',
      groupId: 'E103',
      stallName: '拍照入殓服务基地',
      targetPathName: 'dist/group0/left/11.jpeg'
    },
    {
      order: 12,
      name: '[M·D·O]BY ARSH星垣',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/12.png'
    },
    {
      order: 13,
      name: '[宝百]くすり',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/13.jpeg'
    },
    {
      order: 14,
      name: '《囚鸟+特典》嘉瑞',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/14.jpeg'
    },
    {
      order: 15,
      name: '《星与花》',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/15.jpeg'
    },
    {
      order: 16,
      name: '《杰佣-怦然心动》BY本子记者',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/16.png'
    },
    {
      order: 17,
      name: '《神与宿命论》BY弦上雪 黄占',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/17.png'
    },
    {
      order: 18,
      name: '《黄占-不归林》BY本子记者',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/18.png'
    },
    {
      order: 19,
      name: '可食用型帕罗斯',
      groupId: 'E104',
      stallName: 'LuckyCloud幸云',
      targetPathName: 'dist/group0/left/19.jpeg'
    },
    {
      order: 20,
      name: '遗照组漫本',
      groupId: 'E105',
      stallName: 'Unione',
      targetPathName: 'dist/group0/left/20.jpeg'
    }
  ],
  right: [
    {
      order: 1,
      name: '（寄售） Allegiant《臣道》终宣',
      groupId: 'E105',
      stallName: 'Unione',
      targetPathName: 'dist/group0/right/1.jpeg'
    },
    {
      order: 2,
      name: '歡迎來到召喚師梗谷',
      groupId: 'E106',
      stallName: 'Rio煮飯仔',
      targetPathName: 'dist/group0/right/2.png'
    },
    {
      order: 3,
      name: 'Save you Save me',
      groupId: 'E109',
      stallName: '小浣熊不吃面',
      targetPathName: 'dist/group0/right/3.jpeg'
    },
    {
      order: 4,
      name: '双向暗恋',
      groupId: 'E109',
      stallName: '小浣熊不吃面',
      targetPathName: 'dist/group0/right/4.jpeg'
    },
    {
      order: 5,
      name: '香子大小姐想让我告白',
      groupId: 'E109',
      stallName: '小浣熊不吃面',
      targetPathName: 'dist/group0/right/5.jpeg'
    },
    {
      order: 6,
      name: 'happy birthday',
      groupId: 'E110',
      stallName: '柴雕',
      targetPathName: 'dist/group0/right/6.jpeg'
    },
    {
      order: 7,
      name: '影が見えない昼だから',
      groupId: 'E111',
      stallName: '似晨光',
      targetPathName: 'dist/group0/right/7.jpeg'
    },
    {
      order: 8,
      name: '月が見えない夜だから',
      groupId: 'E111',
      stallName: '似晨光',
      targetPathName: 'dist/group0/right/8.jpeg'
    },
    {
      order: 9,
      name: '新兰综合本',
      groupId: 'E112',
      stallName: '桜花班',
      targetPathName: 'dist/group0/right/9.jpeg'
    },
    {
      order: 10,
      name: '钢穴 x 底特律：成为人类',
      groupId: 'E112',
      stallName: '桜花班',
      targetPathName: 'dist/group0/right/10.jpeg'
    },
    {
      order: 11,
      name: '【降志（透哀）同人本】日界线',
      groupId: 'E113',
      stallName: 'MOONE',
      targetPathName: 'dist/group0/right/11.jpeg'
    },
    {
      order: 12,
      name: '赤安漫本',
      groupId: 'E115',
      stallName: '冷凍佈丁',
      targetPathName: 'dist/group0/right/12.jpeg'
    },
    {
      order: 13,
      name: '赤安漫画本',
      groupId: 'E115',
      stallName: '冷凍佈丁',
      targetPathName: 'dist/group0/right/13.jpeg'
    },
    {
      order: 14,
      name: 'I AM HERE',
      groupId: 'E116',
      stallName: '江户川花火',
      targetPathName: 'dist/group0/right/14.jpeg'
    },
    {
      order: 15,
      name: '【cp23首发】Fahion Week',
      groupId: 'E116',
      stallName: '江户川花火',
      targetPathName: 'dist/group0/right/15.jpeg'
    },
    {
      order: 16,
      name: 'I WANT STAY WITH U',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: 'dist/group0/right/16.jpeg'
    },
    {
      order: 17,
      name: '《LET＇S 换装！》赤安换装小本子',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: 'dist/group0/right/17.png'
    },
    {
      order: 18,
      name: '【闪轨】埃雷波尼亚童话集',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: 'dist/group0/right/18.png'
    },
    {
      order: 19,
      name: '陆奥守吉行主题画册《无限》',
      groupId: 'E117',
      stallName: '安室透心凉',
      targetPathName: 'dist/group0/right/19.jpeg'
    },
    {
      order: 20,
      name: '双星Binary',
      groupId: 'E118',
      stallName: '干了这杯假酒',
      targetPathName: 'dist/group0/right/20.png'
    }
  ]
}

// alert(message)

// 获取容器， 中间/组1
var root = app.activeDocument.layerSets.getByName('中间').layerSets.getByName('组 1')

/**
 * 摊位名复制
 * 也就是最后16个代表摊位的元素(8行，摊位名两个)
 * 危险操作
 */
for (var i = root.artLayers.length - rowNumber * 2; i < root.artLayers.length; i = i + colEachRow) {
  var layer = root.artLayers[i]
  for (var j = 0; j < (colEachRow - 1); j++) {
    var copy = layer.duplicate()
    var offset = 372 * (j + 1)
    copy.translate(new UnitValue(offset + ' pixels'))
  }
}
