/**
 * 格式化图片
 */
const fs = require("fs");
const imgType = require("img-type");
const PATH = "../D2";

const EACH_GROUP_SIZE = 4 * 5;

function delDir(p) {
  // 读取文件夹中所有文件及文件夹
  var list = fs.readdirSync(p);
  list.forEach((v, i) => {
    // 拼接路径
    var url = p + "/" + v;
    // 读取文件信息
    var stats = fs.statSync(url);
    // 判断是文件还是文件夹
    if (stats.isFile()) {
      // 当前为文件，则删除文件
      fs.unlinkSync(url);
    } else {
      // 当前为文件夹，则递归调用自身
      arguments.callee(url);
    }
  });
  // 删除空文件夹
  fs.rmdirSync(p);
}

/**
 * 捕获命名规则
 */
const reg = /\(([A-Z]\d+\-?[A-Z]?\d+)\)\[(.*?)\](.*)/;
const pages = [];

const groups = fs
  .readdirSync(PATH)
  .filter(item => item !== ".DS_Store")
  .map(group => {
    /**
     * 获取，全名，社团名， 摊位名
     */
    const [path, groupId, groupName, stallName] = group.match(reg);
    return {
      stallName: stallName || groupName, // 没有摊位取社团
      path: `${PATH}/${path}`,
      groupId,
      groupName: groupName
    };
  });

groups.forEach(group => {
  const { path, stallName, groupId } = group;
  const books = fs.readdirSync(path).map(book => {
    const [bookFullName, bookName, type] = book.match(/(.*?)\(\d+\).*?\.(.*)/);
    return {
      path: `${path}/${bookFullName}`,
      name: bookName,
      stallName,
      type,
      groupId
    };
  });

  /**
   * 增加分组
   */
  books.forEach(book => {
    let page = pages[pages.length - 1];
    // 满了或者不存在就推一个
    if (!!!page || page.length === EACH_GROUP_SIZE) {
      page = [];
      pages.push(page);
    }
    page.push(book);
  });
});

/**
 * 输出到对应文件夹
 */
if (fs.existsSync("./dist")) delDir("./dist");
fs.mkdirSync("./dist");
pages.forEach((books, index) => {
  const dirName = `./dist/${index + 1}`;
  fs.mkdirSync(dirName);
  const metaInfo = [];
  books.forEach((book, index) => {
    const bookPath = book.path;
    const buffer = fs.readFileSync(bookPath);
    const fileType = imgType.getTypeFromBuffer(buffer);
    const targetPathName = `${dirName}/${index + 1}.${fileType}`;
    const img = fs.openSync(targetPathName, "w");
    fs.writeFileSync(img, buffer);

    /**
     * 输出meta信息
     * 序号，本子名，社团序号，社团名字
     */
    metaInfo.push(
      `${index + 1},${book.name},${book.groupId},${book.stallName}`
    );
  });
  const meta = fs.openSync(`${dirName}/meta.csv`, "w");
  fs.writeFileSync(meta, metaInfo.join("\n"));
});

console.log(
  "整理完成！共",
  pages.map(page => page.length),
  "个"
);
