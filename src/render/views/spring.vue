<script setup lang="ts">
import draggable from 'vuedraggable'
const { config } = defineProps(['config'])
const pushAccountItem = () => {
  config.qs.role?.push({ equip: [], hou: [], name: '', skill: '' })
}
const removeAccountItem = (index) => {
  config.qs.role?.splice(index, 1)
}
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
const handleExceed = ({ status, raw }) => {
  if (status !== 'ready') {
    console.log('选择文件失败')
    return
  }
  config.path = raw.path
}
</script>

<template>
  <draggable :list="config.qs.role" item-key="index" class="draggable" ghost-class="ghost">
    <template #item="{ element, index }">
      <div class="item">
        <el-input class="w-28" v-model="element.name" />
        <div class="content">
          <div>对泉水</div>
          <el-switch v-model="element.isSpring" />
        </div>
        <div class="content">
          <div>使用技能</div>
          <el-select placeholder="技能" style="width: 80px" v-model="element.skill">
            <el-option v-for="item in ['q', 'w', 'e', 'r']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="content">
          <div>猴</div>
          <el-select placeholder="装备" multiple v-model="element.hou">
            <el-option v-for="item in ['鸡刀', '雷霆']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="content">
          <div>使用装备</div>
          <el-select placeholder="装备" multiple v-model="element.equip">
            <el-option v-for="item in equipSelectOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-icon class="icon" @click="removeAccountItem(index)" :size="25" color="#ff4757"><remove /></el-icon>
      </div>
    </template>
  </draggable>
  <div class="draggable-pust" @click="pushAccountItem">
    <el-icon color="#409eff"><circle-plus /></el-icon>
  </div>
  <div style="margin-top: 20px" class="flex items-center">
    <div class="flex items-center">神器在<span style="color: #5352ed">装备栏</span>的位置 <el-input style="width: 55px" v-model="config.qs.zb_index" /></div>
    <div class="flex items-center">雷霆在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" v-model="config.qs.lt_index" /></div>
    <div class="flex items-center">鸡刀在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" v-model="config.qs.jd_index" /></div>
    <div class="flex items-center">神器在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" v-model="config.qs.sq_index" /></div>
  </div>
  <div class="flex items-center">
    <el-checkbox v-model="config.qs.stateDefend" name="type" />

    <div class="flex items-center">
      <el-select style="width: 80px" v-model="config.qs.hpOrMP">
        <el-option v-for="item in HPorMPSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div>低于</div>
      <el-input style="width: 55px" v-model="config.qs.lower" />
      <div>% 使用</div>
      <el-select multiple v-model="config.qs.equip">
        <el-option v-for="item in equipSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="flex items-center">
      <div>检测间隔</div>
      <el-input style="width: 55px" v-model="config.qs.interval" />
      <div>秒</div>
    </div>
  </div>
  <div class="flex items-center">
    <div class="flex items-center">
      <div>插眼</div>
      <el-select style="width: 100px" v-model="config.qs.insertEye">
        <el-option v-for="item in baseSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="flex items-center">
      <div>点赞</div>
      <el-select style="width: 100px" v-model="config.qs.clickLike">
        <el-option v-for="item in baseSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
  <el-upload accept=".exe" :show-file-list="false" :limit="1" :auto-upload="false" :on-change="handleExceed">
    <el-button plain>{{ config.path || '选择启动路径' }}</el-button>
  </el-upload>
</template>

<style lang="scss" scoped>
input[type='file'] {
  display: flex;
}
</style>
