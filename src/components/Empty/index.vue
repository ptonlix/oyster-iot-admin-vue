<template>
  <p class="empty">
    <img src="@/assets/images/baseImg/bd_empty.png" alt="empty">
  </p>
</template>

<script>
export default {
  name: 'AppEmpty',
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">
.empty {
  text-align: center;
  width: 100%;
  padding-top: 100px;
  img {
    width:100%
  }
}
</style>
