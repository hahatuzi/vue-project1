<template>
  <div class="dashboard-container">
    <el-card class="admin-card" shadow="hover">
      <s-profile :info="adminInfo" v-if="adminInfo" />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SProfile from '@/components/SProfile'

export default {
  name: 'Dashboard',
  components: {
    SProfile
  },
  computed: {
    ...mapGetters(['adminInfo'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    height: calc(100vh - 96px);
    background: #f5f5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
::v-deep .admin-card {
  width: 280px;
  height: 295px;
  .el-card__body {
    padding: 6px;
    .card-content {
      background: #fff;
      box-shadow: none;
    }
  }
}
</style>
