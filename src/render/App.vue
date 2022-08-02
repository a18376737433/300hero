<script setup>
import account from './views/account.vue'
import spring from './views/spring.vue'
import default_config from '@@/config'

const loaded = () => {
  const appLoading = document.getElementById('apploading')
  if (appLoading) appLoading.style.display = 'none'
}

console.log('window.ipcRenderer :>> ', window.ipcRenderer)
let preConfig = window.ipcRenderer.sendSync('store:get', 'config')
console.log('默认配置', default_config)
console.log('用户配置', preConfig)

const config = reactive(preConfig || default_config)
loaded()

//监听main的快捷键事件
window.ipcRenderer.on('shortcut_key', (e, { key }) => {
  switch (key) {
    case 'f1':
      handleWindow('start')
      break
    case 'f2':
      handleWindow('stop')
      break
    default:
      console.log('未注册的键盘事件')
      break
  }
})

const matchInfo = ref({})

window.ipcRenderer.on('match:update', (e, currentAccoutn) => {
  matchInfo.value = currentAccoutn
})
const handleWindow = (state) => {
  if (state === 'start') {
    console.log(config)
    window.ipcRenderer.send('store:set', {
      key: 'config',
      value: JSON.parse(JSON.stringify(config))
    })
  }
  window.ipcRenderer.send('onWindow', state)
}

const tabActiveName = ref('spring')
</script>

<template>
  <el-config-provider size="large">
    <div class="main px-1 py-2 overflow-auto h-full">
      <h4 class="py-2" v-if="Object.keys(matchInfo).length">
        <span>当前局数:{{ matchInfo.current_count }}</span>
        <span>账号:{{ matchInfo.name }}</span>
      </h4>
      <el-radio-group v-model="config.mode" size="large">
        <el-radio-button label="zc">战场</el-radio-button>
        <el-radio-button label="dds">惇惇兽</el-radio-button>
        <el-radio-button label="sz">神战</el-radio-button>
      </el-radio-group>
      <el-tabs tab-position="left" v-model="tabActiveName">
        <el-tab-pane name="spring">
          <template #label>
            <span class="icon-box">
              <el-icon><place /></el-icon>
              泉水
            </span>
          </template>
          <spring :qs="config.qs" />
        </el-tab-pane>
        <el-tab-pane name="account">
          <template #label>
            <span class="icon-box">
              <el-icon><User /></el-icon>
              账号
            </span>
          </template>
          <account :accounts="config.accounts" />
        </el-tab-pane>
      </el-tabs>

      <div class="fixed p-2 bottom-0 flex justify-end w-screen 2">
        <el-button type="primary" @click="handleWindow('start')">开始(F1)</el-button>
        <el-button type="danger" @click="handleWindow('stop')">停止(F2)</el-button>
        <el-button type="success" @click="handleWindow('test')">Test</el-button>
      </div>
    </div>
  </el-config-provider>
</template>

<style lang="scss" scoped>
.icon-box {
  @apply flex items-center;
  .el-icon {
    @apply mr-1;
  }
}
</style>
