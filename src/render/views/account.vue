<script setup lang="ts">
import draggable from 'vuedraggable'

const { accounts } = defineProps({
  accounts: {
    type: Array,
    default: () => []
  }
})
const dragging = ref(false)
const pushAccountItem = () => {
  accounts.push({
    name: '',
    password: '',
    counts: 0,
    dieQuit: true,
    randomRole: false,
    current_count: 0
  })
  console.log(accounts);
}
const removeAccountItem = (index: number) => {
  accounts.splice(index, 1)
}
</script>

<template>
  <draggable :list="accounts" class="draggable" item-key="index" ghost-class="ghost" @start="dragging = true" @end="dragging = false">
    <template #item="{ element, index }">
      <div class="item">
        <el-input style="width: 150px" v-model="element.name" placeholder="账号" v-model.trim="element.name" clearable />
        <el-input style="width: 150px" placeholder="密码" v-model.trim="element.password" clearable />

        <div class="content">
          <span>场数</span>

          <span class="text-lime-400 px-4">{{ element.current_count || 0 }}</span
          >/
          <el-input-number style="width: 100px" controls-position="right" v-model.number="element.counts" />
        </div>
        <div class="content">
          <div>死亡退出</div>
          <el-switch v-model="element.dieQuit" />
        </div>
        <div class="content">
          <div>随机角色</div>
          <el-switch v-model="element.randomRole" />
        </div>
        <el-icon class="icon" @click="removeAccountItem(index)" :size="25" color="#ff4757"><remove /></el-icon>
      </div>
    </template>
  </draggable>
  <div class="draggable-pust" @click="pushAccountItem">
    <el-icon color="#409eff"><circle-plus :size="25" /></el-icon>
  </div>
</template>

<style lang="scss" scoped></style>
