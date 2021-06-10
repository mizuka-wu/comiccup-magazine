<template>
  <el-tabs class="tabs" tab-position="bottom">
    <el-tab-pane class="page" :label="`第${index + 1}页`" v-for="(page, index) of pages" :key="index">
      <div class="container">
        <div class="group" v-for="(group, position) of page" :key="position">
          <!-- 具体本子 -->
          <div
            class="book"
            :style="{ width: `${100 / PAGE_COLUMN}%` }"
            v-for="(book, index) of group"
            :key="book.name + index"
          >
            <el-popover placement="top-start" :title="book.groupId" width="400" trigger="hover">
              <el-form>
                <el-form-item label="社团名字">{{ book.stallId }}{{ book.stallName }}</el-form-item>
                <el-form-item label="类型">{{ book.type }}</el-form-item>
                <el-form-item label="原始文件路径">{{ book.path }}</el-form-item>
                <el-form-item label="本子名">{{ book.name }}</el-form-item>
              </el-form>
              <div slot="reference">
                <div>{{ book.groupId }}</div>
                <div>{{ book.name }}</div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { PAGE_ROW, PAGE_COLUMN } from '../helper/consts'
export default {
  name: 'PagePreviewer',
  props: {
    pages: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      PAGE_ROW,
      PAGE_COLUMN
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tabs {
  overflow: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  ::v-deep .el-tabs__content {
    flex: 1;
  }
}
.page {
  height: 100%;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  overflow-y: auto;
}

.group {
  width: 48%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.book {
  border: 1px solid #aaaaaa;
  background: #aaaaaa;
  margin: 4px;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
}
</style>
