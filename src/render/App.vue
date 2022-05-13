<script setup>
const { ipcRenderer } = require('electron')
import { ElMessage } from 'element-plus'
import { onMounted, reactive, toRaw, computed, ref, watch } from 'vue'
import account from './views/account.vue'
import spring from './views/spring.vue'

const loaded = () => {
  const appLoading = document.getElementById('appLoading')
  if (appLoading) appLoading.style.display = 'none'
}
let preConfig = ipcRenderer.sendSync('store:get', 'config')
console.log(preConfig)
const defaultConfig = {
  accountList: [],
  mode: 'zc',
  qs: {
    role: [{ equip: [1, 'f'], hou: ['鸡刀', '雷霆'], name: '康娜', skill: 'r' }],

    //随机英雄
    isRandom: false,
    //游戏局数
    gameCount: 50,
    //检测间隔/s
    interval: 1,
    //插眼&点赞
    clickLike: 'R',
    insertEye: 'R',
    //死亡退出&死亡计数
    dieQuit: true,
    dieQuitCount: 1,
    //掉线重连
    reconnect: false,
    //血量&蓝量保护&使用的装备
    stateDefend: true,
    hpOrMP: 'MP',
    lower: 60,
    equip: [1, 2],
    //猴戏装备位置
    zb_index: 2,
    sq_index: 19,
    lt_index: 14,
    jd_index: 13
  }
}
const config = reactive(preConfig || defaultConfig)
loaded()

//监听main的快捷键事件
ipcRenderer.on('shortcut_key', (e, { key }) => {
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

matchInfo.count = ipcRenderer.sendSync('store:get', 'gameCount') || 0
ipcRenderer.on('match:update', (e, { count, match, account }) => {
  matchInfo.count = count
  matchInfo.match = match
  matchInfo.account = account
})
const handleWindow = (state) => {
  if (state === 'start') {
    console.log(config)
    ipcRenderer.send('store:set', {
      key: 'config',
      value: JSON.parse(JSON.stringify(config))
    })
  }
  ipcRenderer.send('onWindow', state)
}

const tabActiveName = ref('spring')
</script>

<template>
  <div class="main">
    <h4 class="head">
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

    <div class="foot">
      <el-button type="primary" @click="handleWindow('start')">开始(F1)</el-button>
      <el-button type="danger" @click="handleWindow('stop')">停止(F2)</el-button>
      <el-button type="success" @click="handleWindow('test')">Test</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  padding: 5px 10px;
  overflow: scroll;
  height: 100vh;
  :deep(.el-form-item) {
    margin-bottom: 5px;
  }
  .icon-box {
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 5px;
    }
  }
}
.head {
  padding: 10px 0;
  span {
    margin-right: 10px;
  }
}
.foot {
  position: fixed;
  padding: 10px 0;
  bottom: 0;
  width: 90%;
  display: flex;
  justify-content: flex-end;
}
</style>
