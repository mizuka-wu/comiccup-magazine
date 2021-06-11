<template>
  <el-tabs
    class="tabs"
    tab-position="bottom"
  >
    <el-tab-pane
      :key="index"
      :label="getPageGroupName(pageGroup)"
      class="page-group"
      v-for="(pageGroup, index) of pageGroups"
    >
      <div class="container">
        <div
          :key="position"
          class="page"
          v-for="(page, position) of pageGroup"
        >
          <!-- 具体本子 -->
          <div
            :key="book.name + index"
            :style="{ width: `${100 / PAGE_COLUMN}%` }"
            class="book"
            v-for="(book, index) of page"
          >
            <el-popover
              :title="book.groupId"
              placement="top-start"
              trigger="hover"
              width="400"
            >
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
import { getPageGroupName } from '../helper/utils'
export default {
  name: 'PagePreviewer',
  props: {
    pageGroups: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      PAGE_ROW,
      PAGE_COLUMN
    }
  },
  methods: {
    getPageGroupName
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
.page-group {
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

.page {
  width: 48%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.book {
  border: 1px solid #aaaaaa;
  background: #aaaaaa;
  margin: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
}
</style>
