<script setup lang="ts">
import { ElNotification } from 'element-plus'
import draggable from 'vuedraggable'
import type { Config } from 'config'
import { equipSelectOption, HPorMPSelectOption, baseSelectOption } from '@/options'
const { config } = defineProps<{
  config: Config
}>()
const pushAccountItem = () => {
  config.qs.role?.push({ equip: [], hou: [], name: '', skill: '' })
}
const removeAccountItem = (index) => {
  config.qs.role?.splice(index, 1)
}

const handleExceed = ({ status, raw }) => {
  if (status !== 'ready') {
    ElNotification({
      title: '请重试',
      message: '选择文件失败',
      type: 'error',
      duration: 2000
    })
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
          <div class="w-12">对泉水</div>
          <el-switch v-model="element.isSpring" />
        </div>
        <div class="content">
          <div class="w-16">使用技能</div>
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
          <div class="w-16">使用装备</div>
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
  <div class="mt-8 text-sm text-red-500">战法放在背包里第一个 鸡刀放在第二个 雷霆放在第三个(没有可以不放)</div>
  <div class="flex items-center">
    <div class="flex items-center">神器在<span style="color: #5352ed">装备栏</span>的位置 <el-input style="width: 55px" v-model="config.qs.zb_index" /></div>
    <div class="flex items-center">神器在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" v-model="config.qs.sq_index" /></div>
    <div class="flex items-center">鸡刀在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" v-model="config.qs.jd_index" /></div>
    <div class="flex items-center">雷霆在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" v-model="config.qs.lt_index" /></div>
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
  <el-time-picker v-model="config.jobTime" format="HH:mm" :editable="false" placeholder="定时启动" />
  <el-time-picker v-model="config.shutdown" format="HH:mm" :editable="false" placeholder="定时关机" />
</template>

<style lang="scss" scoped>
input[type='file'] {
  display: flex;
}
</style>
