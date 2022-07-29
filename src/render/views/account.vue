<script setup>
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
  <draggable :list="accountList" class="space-y-2 py-1" item-key="index" ghost-class="ghost" @start="dragging = true" @end="dragging = false">
    <template #item="{ element, index }">
      <div class="draggable-item">
        <el-input style="width: 150px" v-model="element.name" placeholder="账号" label="账号" v-model.trim="element.name" clearable />
        <el-input style="width: 150px" placeholder="密码" v-model.trim="element.password" clearable />

        <div class="flex">
          <div>打</div>
          <el-input style="width: 55px" v-model.number="element.gameCount" />
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
    <el-icon color="#409eff"><circle-plus :size="25" /></el-icon>
  </div>
</template>

<style lang="scss" scoped>

</style>
