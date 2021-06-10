<template>
  <el-container id="app">
    <el-main class="main-container">
      <el-steps :active="active" finish-status="success">
        <el-step title="选择文件夹"></el-step>
        <el-step title="生成排序配置"></el-step>
        <el-step title="生成脚本"></el-step>
      </el-steps>
      <!-- 步骤显示 -->
      <div class="main" v-loading="active === 1">
        <!-- 打开文件夹 -->
        <div v-if="active === 0">
          <el-button type="danger">打开任务文件夹</el-button>
          <div style="color: #aaaaaa;margin-top: 8px;">文件夹内应该包含本次任务的 摊位文件夹</div>
        </div>
      </div>
    </el-main>
    <el-aside class="options">
      <h2>脚本配置</h2>
      <el-form size="mini" :model="scriptOptions" label-width="100px" label-position="left">
        <el-form-item label="容器名">
          <el-input v-model="scriptOptions.containerName"></el-input>
        </el-form-item>
        <el-form-item label="自动导入图片">
          <el-checkbox v-model="scriptOptions.photo"></el-checkbox>
        </el-form-item>
      </el-form>
      <el-button :disabled="active !== 3" type="primary">生成脚本</el-button>
    </el-aside>
  </el-container>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      scriptOptions: {
        containerName: '组1',
        photo: true
      },
      active: 0
    }
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.main-container {
  display: flex !important;
  flex-direction: column;
}

.main {
  width: 100%;
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.options {
  width: 100%;
  padding: 8px;
  border-left: 1px solid #eaeaea;
  height: 100%;
  width: 220px !important;
}
</style>
