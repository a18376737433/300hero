<script setup>
const { ipcRenderer } = require('electron')
import { ElMessage } from 'element-plus'
import { onMounted, reactive, toRaw, computed, ref, watch } from 'vue'
const loaded = () => {
  const appLoading = document.getElementById('appLoading')
  if (appLoading) appLoading.style.display = 'none'
}

let preConfig = ipcRenderer.sendSync('store:get', 'config')
const config = reactive(
  preConfig || {
    user: {
      name: '',
      password: ''
    },
    qs: {
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
)

const role = reactive({
  iptVal: '康娜',
  option: [{ name: '康娜' }]
})

watch(
  () => config.qs.role,
  (v) => {
    role.iptVal = v?.map((item) => item.name).toString()
    role.option = v
  },
  {
    immediate: true
  }
)
watch(
  () => role.iptVal,
  () => {
    if (!role.iptVal.length) {
      role.option = []
      return
    }
    role.option = role.iptVal.split(/,|，/).map((e) => {
      let result = role.option?.find((item) => item.name === e)
      if (result) {
        return result
      } else {
        return { name: e }
      }
    })
  }
)
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
  match: {}
})
matchInfo.count = ipcRenderer.sendSync('store:get', 'gameCount') || 0
ipcRenderer.on('match:update', (e, { count, match }) => {
  matchInfo.count = count
  matchInfo.match = match
})
const handleWindow = (state) => {
  if (state === 'start') {
    config.qs.role = role.option
    console.log(config)
    ipcRenderer.send('store:set', {
      key: 'config',
      value: JSON.parse(JSON.stringify(config))
    })
  }
  ipcRenderer.send('onWindow', state)
}
const baseSelectOption = [
  {
    label: '关闭',
    value: 'F'
  },
  {
    label: '开启',
    value: 'T'
  },
  {
    label: '随机',
    value: 'R'
  }
]
const HPorMPSelectOption = [
  {
    label: '血量',
    value: 'HP'
  },
  {
    label: '蓝量',
    value: 'MP'
  }
]
const equipSelectOption = [
  {
    label: '装备栏1',
    value: 1
  },
  {
    label: '装备栏2',
    value: 2
  },
  {
    label: '装备栏3',
    value: 3
  },
  {
    label: '装备栏4',
    value: 4
  },
  {
    label: '装备栏5',
    value: 5
  },
  {
    label: '装备栏6',
    value: 6
  },
  {
    label: '技能D',
    value: 'd'
  },
  {
    label: '技能F',
    value: 'f'
  }
]
</script>

<template>
  <div class="main">
    <h4 class="head">
      <span>当前局数:{{ matchInfo.count }}</span>
      <span v-show="Object.keys(matchInfo.match).length">角色:{{ matchInfo.match?.role || '未知' }}</span>
      <span v-show="Object.keys(matchInfo.match).length">{{ matchInfo.match?.isRed ? '红' : '蓝' }}方</span>
    </h4>
    <el-form>
      <el-form-item>
        <div class="flex">
          <div style="width: 80px">预选角色</div>
          <el-input class="no-border" v-model="role.iptVal" />
        </div>
      </el-form-item>
      <el-form-item v-for="item in role.option">
        <div class="flex">
          <div style="width: 80px">{{ item.name }}&nbsp;&nbsp;</div>
          <div>对泉水&nbsp;</div>
          <el-switch v-model="item.isSpring" />
          <div>&nbsp;使用技能&nbsp;</div>
          <el-select placeholder="技能" style="width: 80px" class="no-border" v-model="item.skill">
            <el-option v-for="item in ['q', 'w', 'e', 'r']" :key="item" :label="item" :value="item" />
          </el-select>
          <div>&nbsp;猴&nbsp;</div>
          <el-select placeholder="装备" class="no-border" multiple v-model="item.hou">
            <el-option v-for="item in ['鸡刀', '雷霆']" :key="item" :label="item" :value="item" />
          </el-select>
          <div>&nbsp;使用装备&nbsp;</div>
          <el-select placeholder="装备" class="no-border" multiple v-model="item.equip">
            <el-option v-for="item in equipSelectOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex">
          <div class="flex">神器在<span style="color: #5352ed">装备栏</span>的位置 <el-input style="width: 55px" class="no-border" v-model="config.qs.zb_index" /></div>
          <div class="flex">雷霆在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" class="no-border" v-model="config.qs.lt_index" /></div>
          <div class="flex">鸡刀在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" class="no-border" v-model="config.qs.jd_index" /></div>
          <div class="flex">神器在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" class="no-border" v-model="config.qs.sq_index" /></div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex">
          <div class="flex">
            <div>打</div>
            <el-input style="width: 55px" class="no-border" v-model="config.qs.gameCount" />
            <div>场</div>
          </div>

          <div class="flex">
            <el-checkbox v-model="config.qs.dieQuit" name="type">
              <div class="flex">死亡退出</div>
            </el-checkbox>
          </div>

          <div class="flex">
            <div>检测间隔</div>
            <el-input style="width: 55px" class="no-border" v-model="config.qs.interval" />
            <div>秒</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex">
          <el-checkbox v-model="config.qs.stateDefend" name="type" />

          <div class="flex">
            <el-select style="width: 80px" class="no-border" v-model="config.qs.hpOrMP" size="large">
              <el-option v-for="item in HPorMPSelectOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div>低于</div>
            <el-input style="width: 55px" class="no-border" v-model="config.qs.lower" />
            <div>% 使用</div>
            <el-select class="no-border" multiple v-model="config.qs.equip">
              <el-option v-for="item in equipSelectOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="flex">
          <div class="flex">
            <div>插眼</div>
            <el-select style="width: 100px" class="no-border" v-model="config.qs.insertEye" size="large">
              <el-option v-for="item in baseSelectOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="flex">
            <div>点赞</div>
            <el-select style="width: 100px" class="no-border" v-model="config.qs.clickLike" size="large">
              <el-option v-for="item in baseSelectOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex">
          <div class="flex">
            <div>掉线重连&nbsp;&nbsp;</div>
            <el-switch v-model="config.qs.reconnect" />
          </div>
          <div class="flex" v-show="config.qs.reconnect">
            <el-input style="width: 150px" placeholder="账号" class="no-border" show-password v-model="config.user.name" />
            <el-input style="width: 150px" placeholder="密码" class="no-border" show-password v-model="config.user.password" />
            <div class="flex">
              <div>随机角色</div>
              <el-switch v-model="config.qs.isRandom" />
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
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
