<script setup>
import draggable from 'vuedraggable'
const props = defineProps({
  qs: {
    type: Object,
    default: () => {}
  }
})
const pushAccountItem = () => {
  props.qs.role?.push({ equip: [], hou: [], name: '', skill: '' })
}
const removeAccountItem = (index) => {
  props.qs.role?.splice(index, 1)
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
</script>

<template>
  <draggable :list="qs.role" item-key="name" class="list-group" ghost-class="ghost" @start="dragging = true" @end="dragging = false">
    <template #item="{ element, index }">
      <div class="draggable-item flex">
        <el-input style="width: 80px" class="no-border" v-model="element.name" />
        <div>对泉水</div>
        <el-switch v-model="element.isSpring" />
        <div>使用技能</div>
        <el-select placeholder="技能" style="width: 80px" class="no-border" v-model="element.skill">
          <el-option v-for="item in ['q', 'w', 'e', 'r']" :key="item" :label="item" :value="item" />
        </el-select>
        <div>猴</div>
        <el-select placeholder="装备" class="no-border" multiple v-model="element.hou">
          <el-option v-for="item in ['鸡刀', '雷霆']" :key="item" :label="item" :value="item" />
        </el-select>
        <div>使用装备</div>
        <el-select placeholder="装备" class="no-border" multiple v-model="element.equip">
          <el-option v-for="item in equipSelectOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-icon @click="removeAccountItem(index)" :size="25" color="#ff4757"><remove /></el-icon>
      </div>
    </template>
  </draggable>
  <div class="draggable-pust" @click="pushAccountItem">
    <el-icon color="#409eff"><circle-plus /></el-icon>
  </div>
  <div style="margin-top: 20px" class="flex">
    <div class="flex">神器在<span style="color: #5352ed">装备栏</span>的位置 <el-input style="width: 55px" class="no-border" v-model="qs.zb_index" /></div>
    <div class="flex">雷霆在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" class="no-border" v-model="qs.lt_index" /></div>
    <div class="flex">鸡刀在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" class="no-border" v-model="qs.jd_index" /></div>
    <div class="flex">神器在<span style="color: #2ed573">背包</span>的位置 <el-input style="width: 55px" class="no-border" v-model="qs.sq_index" /></div>
  </div>
  <div class="flex">
    <el-checkbox v-model="qs.stateDefend" name="type" />

    <div class="flex">
      <el-select style="width: 80px" class="no-border" v-model="qs.hpOrMP" size="large">
        <el-option v-for="item in HPorMPSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div>低于</div>
      <el-input style="width: 55px" class="no-border" v-model="qs.lower" />
      <div>% 使用</div>
      <el-select class="no-border" multiple v-model="qs.equip">
        <el-option v-for="item in equipSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="flex">
      <div>检测间隔</div>
      <el-input style="width: 55px" class="no-border" v-model="qs.interval" />
      <div>秒</div>
    </div>
  </div>
  <div class="flex">
    <div class="flex">
      <div>插眼</div>
      <el-select style="width: 100px" class="no-border" v-model="qs.insertEye" size="large">
        <el-option v-for="item in baseSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="flex">
      <div>点赞</div>
      <el-select style="width: 100px" class="no-border" v-model="qs.clickLike" size="large">
        <el-option v-for="item in baseSelectOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
