<template>
  <el-tabs class="tabs" tab-position="bottom">
    <el-tab-pane
      :key="index"
      :label="getPageGroupName(pageGroup)"
      class="page-group"
      v-for="(pageGroup, index) of pageGroups"
    >
      <div class="container">
        <div :key="position" class="page" v-for="(page, position) of pageGroup">
          <!-- 具体本子 -->
          <div
            @mouseleave="$emit('preview')"
            @mouseover="$emit('preview', book)"
            :key="book.name + index"
            :style="{
              width: `${100 / PAGE_COLUMN}%`,
              height: '80px',
            }"
            class="book"
            v-for="(book, index) of page"
          >
            <div class="info">
              <div>{{ book.groupId }}</div>
              <div>{{ book.name }}</div>
            </div>
            <img :src="`local-resource://${encodeURIComponent(book.path)}`" class="background" />
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
  position: relative;

  .info {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    padding: 4px;
    box-sizing: border-box;
    font-size: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    white-space: break-spaces;
    * {
      text-shadow: 0px 0px 3px #fff;
      font-weight: 600;
    }
  }
  .background {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
}
</style>
