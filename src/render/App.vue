<script setup>
//const { ipcRenderer } = require('electron')

import { ElMessage } from 'element-plus'
import account from './views/account.vue'
import spring from './views/spring.vue'
import default_config from '@@/config'
const loaded = () => {
  const appLoading = document.getElementById('apploading')
  if (appLoading) appLoading.style.display = 'none'
}
console.log('window.ipcRenderer :>> ', window.ipcRenderer);
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

const matchInfo = reactive({
  count: 0,
  account: {},
  match: {}
})

matchInfo.count = window.ipcRenderer.sendSync('store:get', 'gameCount') || 0
window.ipcRenderer.on('match:update', (e, { count, match, account }) => {
  matchInfo.count = count
  matchInfo.match = match
  matchInfo.account = account
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
  <div class="main px-1 py-2 overflow-auto h-full">
    <h4 class="py-2">
      <span v-if="matchInfo.count">当前局数:{{ matchInfo.count }}</span>
      <span v-if="matchInfo.account?.name">账号:{{ matchInfo.account?.name }}</span>
      <span v-show="Object.keys(matchInfo.match).length">角色:{{ matchInfo.match?.role || '未知' }}</span>
      <span v-show="Object.keys(matchInfo.match).length">{{ matchInfo.match?.isRed ? '红' : '蓝' }}方</span>
    </h4>
    <el-radio-group v-model="config.mode" size="large">
      <el-radio-button label="zc">战场</el-radio-button>
      <el-radio-button label="dds">惇惇兽</el-radio-button>
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
        <account :accountList="config.accountList" />
      </el-tab-pane>
    </el-tabs>

    <div class="fixed p-2 bottom-0 flex justify-end w-screen 2">
      <el-button type="primary" @click="handleWindow('start')">开始(F1)</el-button>
      <el-button type="danger" @click="handleWindow('stop')">停止(F2)</el-button>
      <el-button type="success" @click="handleWindow('test')">Test</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon-box {
  @apply flex items-center;
  .el-icon {
    @apply mr-1;
  }
}
</style>
