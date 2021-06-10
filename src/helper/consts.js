export const SORT_ORDER = [
  // 26字母
  ...Object.keys(Array.from(new Array(26))).map(key => String.fromCharCode(+key + 65)),
  'Ω',
  ...['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬']]

export const PAGE_POSITION = {
  LEFT: 'left',
  RIGHT: 'right'
}

export const CELL_IMAGE_WIDTH = 328 // 每张图片的宽度
export const CELL_IMAGE_HEIGHT = 437 // 每张图片的高度

/**
 * 社团号 全名，社团名， 摊位名
 */
export const NAME_REG = /\(([Ω\u4e00-\u9fa5A-Z]\d+-?[Ω\u4e00-\u9fa5A-Z]?\d+)\)\[(.*?)\](.*)/
export const GROUP_ID_REG = /([Ω\u4e00-\u9fa5A-Z])(\d*)/

/**
 * 名字和类型
 */
export const BOOK_NAME_REG = /(.*?)\(\d+\).*?\.(.*)/

/**
 * 空白图片
 */
export const EMPTY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4////fwAJ+wP9CNHoHgAAAABJRU5ErkJggg=='
