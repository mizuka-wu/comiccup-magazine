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
          <div>
            <h3>当前排序顺序</h3>
            <draggable class="order" v-model="groupOrder">
              <transition-group>
                <el-tag v-for="groupId of groupOrder" :key="groupId">
                  <div>{{ groupId }}</div>
                  <div
                    @click="deleteGroupOrder(groupId)"
                    style="position: absolute;color: #000; right: 0;top:0;line-height:initial;height: 0;cursor: pointer;"
                  >x</div>
                </el-tag>
              </transition-group>
              <el-button slot="footer" @click="addGroupId" icon="el-icon-plus" size="small" />
            </draggable>
          </div>
        </div>
        <PagePreview
          @preview="book => previewBook = book"
          :pageGroups="pageGroups"
          v-if="active === 2"
        />
      </div>
    </el-main>
    <el-aside class="options">
      <h2>脚本配置</h2>
      <el-form :model="scriptOptions" label-position="left" label-width="100px" size="mini">
        <el-form-item label="容器名">
          <el-input v-model="scriptOptions.containerName"></el-input>
          <span style="color: #cccccc">
            在psd模版内的分组名
            <el-button type="text" @click="getContainerName">智能识别</el-button>
          </span>
        </el-form-item>
        <el-form-item label="自动导入图片">
          <el-checkbox v-model="scriptOptions.photo"></el-checkbox>
        </el-form-item>
      </el-form>
      <div>
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
      </div>
      <div class="preview">
        <el-form v-if="previewBook" size="mini">
          <el-form-item label="社团名字">{{ previewBook.stallId }}{{ previewBook.stallName }}</el-form-item>
          <el-form-item label="类型">{{ previewBook.type }}</el-form-item>
          <el-form-item label="本子名">{{ previewBook.name }}</el-form-item>
          <el-form-item label="原始文件路径">{{ previewBook.path }}</el-form-item>
        </el-form>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ipcRenderer, shell } from 'electron'
import getDayTaskMeta from './helper/meta'
import outputDayTask from './helper/generate'
import PagePreview from './components/PagePreview.vue'
import Store from 'electron-store'
import { SORT_ORDER } from './helper/consts'
import Draggable from 'vuedraggable'

const store = new Store({
  schema: {
    groupOrder: {
      type: 'array'
    }
  },
  defaults: {
    groupOrder: SORT_ORDER
  }
})

export default {
  name: 'App',
  components: {
    Draggable,
    PagePreview
  },
  data () {
    return {
      scriptOptions: {
        containerName: '组1',
        photo: true
      },
      previewBook: null,
      active: 0, // 0 未开始，1进行中，2预览可生成
      pageGroups: [],
      groupOrder: store.get('groupOrder')
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
          const result = await getDayTaskMeta(targetFolderPath, this.sortOrder)
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
    saveDir () {
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
      const processNotify = this.$notify({
        title: '导出进度',
        message: '正在准备导出。。。',
        position: 'bottom-right',
        duration: 0
      })
      setTimeout(async () => {
        try {
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

          // 回到重新选择页面
          this.restart()
        } catch (e) {
          loading.close()
          this.$message.error(e.message || e)
          console.error(e)
        }
      }, 500)
    },
    restart () {
      this.previewBook = null
      this.pageGroups = []
      this.active = 0
    },
    async addGroupId () {
      this.$prompt('请输入区域名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\D/,
        inputErrorMessage: '请输入正确的区域名，目前仅支持单个且非数字'
      }).then(({ value }) => {
        if (this.groupOrder.includes(value)) {
          this.$message.error('重复输入！')
        } else {
          this.groupOrder.push(value)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    deleteGroupOrder (groupId) {
      const index = this.groupOrder.indexOf(groupId)
      this.groupOrder.splice(index, 1)
    },
    getContainerName () {
      const containerName = ipcRenderer.sendSync('getContainerName')
      if (containerName) {
        this.scriptOptions.containerName = containerName
      }
    }
  },
  watch: {
    groupOrder (groupOrder) {
      store.set('groupOrder', groupOrder)
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
  display: flex;
  flex-direction: column;
}

.preview {
  height: auto;
  flex: 1;
  overflow: auto;
  padding-top: 4px;
  box-sizing: border-box;
}

.order {
  .el-tag {
    margin: 4px;
    cursor: move;
    position: relative;
  }
}
</style>
