<template>
  <el-tabs class="tabs" tab-position="bottom">
    <el-tab-pane class="page" :label="`第${index}页`" v-for="(page, index) of pages" :key="index">
      <div class="container"></div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { PAGE_ROW, PAGE_COLUMN } from '../helper/consts'
export default {
  name: 'HelloWorld',
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
</style>
