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
          <el-button @click="openDir" type="danger">打开任务文件夹</el-button>
          <div style="color: #aaaaaa;margin-top: 8px;">文件夹内应该包含本次任务的 摊位文件夹</div>
        </div>
        <PagePreview :pageGroups="pageGroups" v-if="active === 2" />
      </div>
    </el-main>
    <el-aside class="options">
      <h2>脚本配置</h2>
      <el-form :model="scriptOptions" label-position="left" label-width="100px" size="mini">
        <el-form-item label="容器名">
          <el-input v-model="scriptOptions.containerName"></el-input>
        </el-form-item>
        <el-form-item label="自动导入图片">
          <el-checkbox v-model="scriptOptions.photo"></el-checkbox>
        </el-form-item>
      </el-form>
      <el-button :disabled="active !== 2" @click="saveDir" size="mini" type="primary">生成脚本</el-button>
      <el-popconfirm @confirm="restart" title="当前编辑状态将丢失，继续？">
        <el-button
          :disabled="active === 0"
          size="mini"
          slot="reference"
          style="margin-left: 4px"
          type="danger"
        >重新选择</el-button>
      </el-popconfirm>
    </el-aside>
  </el-container>
</template>

<script>
import { ipcRenderer, shell } from 'electron'
import getDayTaskMeta from './helper/meta'
import outputDayTask from './helper/generate'
import PagePreview from './components/PagePreview.vue'

export default {
  name: 'App',
  components: {
    PagePreview
  },
  data () {
    return {
      scriptOptions: {
        containerName: '组1',
        photo: true
      },
      active: 0, // 0 未开始，1进行中，2预览可生成
      pageGroups: []
    }
  },
  methods: {
    /**
     * 打开文件夹
     */
    async openDir () {
      const targetFolderPath = ipcRenderer.sendSync('openDir')
      if (targetFolderPath) {
        this.pageGroups = []
        try {
          this.active++
          const result = await getDayTaskMeta(targetFolderPath)
          this.pageGroups = result
          this.active++
        } catch (e) {
          console.error(e)
          this.$message.error(e.message || e)
          this.restart()
        }
      }
    },
    /**
     * 保存到文件夹
     */
    async saveDir () {
      const targetFolderPath = ipcRenderer.sendSync('saveDir')
      if (!targetFolderPath) {
        return 0
      }
      const loading = this.$loading({
        lock: true,
        text: '生成中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const processNotify = this.$notify({
          title: '导出进度',
          message: '已经完成',
          position: 'bottom-right',
          duration: 0
        })
        const outputPath = await outputDayTask(
          this.pageGroups,
          targetFolderPath,
          {
            ...this.scriptOptions,
            onProcess: function (completed) {
              processNotify.message = completed
            }
          }
        )
        processNotify.close()
        loading.close()
        // 提示
        this.$notify({
          title: '成功',
          message: '请打开PSD文件，脚本并选择对应文件夹下的jsx文件运行，请勿移动导出的文件夹',
          type: 'success'
        })

        // 回到重新选择页面
        // this.restart()

        // 是否打开文件夹
        this.$confirm('是否打开生成文件夹', '生成成功', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        })
          .then(() => {
            // 打开导出的文件夹
            shell.openPath(outputPath)
          })
          .catch(e => null)
      } catch (e) {
        loading.close()
        this.$message.error(e.message || e)
        console.error(e)
      }
    },
    restart () {
      this.pageGroups = []
      this.active = 0
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
  overflow: hidden;
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
