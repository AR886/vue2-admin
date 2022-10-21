<template>
  <a :title="title" style="margin-left: 10px">
    <el-button v-bind="$attrs" v-on="$listener" />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']
}
</script>

<style scoped></style>
