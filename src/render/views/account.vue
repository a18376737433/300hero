<script setup>
import { reactive, ref, defineProps } from 'vue'

import draggable from 'vuedraggable'
const props = defineProps({
  accountList: {
    type: Array,
    default: () => []
  }
})
const dragging = ref(false)
const pushAccountItem = () => {
  props.accountList.push({
    name: '',
    password: '',
    gameCount: 0,
    dieQuit: true,
    randomRole: false,
    todayGameCount: 0
  })
}
const removeAccountItem = (index) => {
  props.accountList.splice(index, 1)
}
</script>

<template>
  <draggable :list="accountList" item-key="name" class="list-group" ghost-class="ghost" @start="dragging = true" @end="dragging = false">
    <template #item="{ element, index }">
      <div class="draggable-item flex">
        <el-input style="width: 150px" placeholder="账号" class="no-border" v-model.trim="element.name" />
        <el-input style="width: 150px" placeholder="密码" class="no-border" v-model.trim="element.password" />
        <div class="flex">
          <div>打</div>
          <el-input style="width: 55px" class="no-border" v-model.number="element.gameCount" />
          <div>场</div>
        </div>
        <div class="flex">
          <el-checkbox v-model="element.dieQuit" name="type">
            <div>死亡退出</div>
          </el-checkbox>
        </div>
        <div class="flex">
          <el-checkbox v-model="element.randomRole" name="type">
            <div>随机角色</div>
          </el-checkbox>
        </div>
        <el-icon @click="removeAccountItem(index)" :size="25" color="#ff4757"><remove /></el-icon>
      </div>
    </template>
  </draggable>
  <div class="draggable-pust" @click="pushAccountItem">
    <el-icon color="#409eff"><circle-plus /></el-icon>
  </div>
</template>

<style lang="scss" scoped>
.handle {
  height: 100%;
  padding: 8px;
  font-size: 20px;
  cursor: move;
}
.highlight {
  opacity: 0.5;
  background-color: red;
}
</style>
