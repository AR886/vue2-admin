<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <Card />
      <Sale />
      <Observe />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from '@/views/dashboard/Card'
import Sale from '@/views/dashboard/Sale'
import Observe from '@/views/dashboard/Observe'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  },
  components: {
    Card,
    Sale,
    Observe
  },
  mounted() {
    this.$store.dispatch('getData')
  }
}
</script>

<style scoped></style>
