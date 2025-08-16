<template>
  <!-- Payout 概览（已迁移为独立组件） -->
  <PayoutOverview />

  <!-- 最近60天销售折线图 -->
  <SalesLineChart />

  <!-- 漏斗统计（已迁移为独立组件） -->
  <FunnelAnalytics />

  <!-- 应用销售总计（分页） -->
  <AppSalesSummary />

</template>

<script setup lang="ts">
import FunnelAnalytics from '@/components/dashboard/FunnelAnalytics.vue'
import PayoutOverview from '@/components/dashboard/PayoutOverview.vue'
import AppSalesSummary from '@/components/dashboard/AppSalesSummary.vue'
import SalesLineChart from '@/components/dashboard/SalesLineChart.vue'
</script>

<style scoped>
.account-page {
  padding: 32px;
  background: #fff;
  min-height: 300px;
}

.payout-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.payout-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbf9 100%);
  border: 1px solid #e6f4ee;
  border-radius: 12px;
  padding: 18px 16px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.payout-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.card-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #19b36b;
  background: #e9f7f1;
  border: 1px solid #ccefe0;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 4px 10px;
  margin-bottom: 10px;
}

.card-value {
  font-size: 26px;
  font-weight: 800;
  color: #1b4332;
  line-height: 1.2;
}

.loading-text {
  color: #6c757d;
  font-size: 16px;
  font-weight: 400;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: #721c24;
}

.dashboard-content {
  margin-top: 32px;
}

/* Payout card header */
.payout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.payout-title {
  display: flex;
  flex-direction: column;
}
.payout-title .title {
  font-size: 24px;
  font-weight: 700;
  color: #1b4332;
}
.payout-title .subtitle {
  font-size: 12px;
  color: #6c757d;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin: 16px 0;
}

.app-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e9ecef;
}

.app-info {
  display: flex;
  flex-direction: column;
}

.app-name {
  font-weight: 600;
  color: #212529;
}

.app-sub {
  font-size: 12px;
  color: #6c757d;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

.funnel-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.funnel-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6c757d;
}

.funnel-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.funnel-chart {
  width: 100%;
  height: 360px;
  margin-bottom: 12px;
}

.funnel-step {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.funnel-step .step-title {
  font-size: 12px;
  color: #6c757d;
}

.funnel-step .step-value {
  font-size: 22px;
  font-weight: 700;
  color: #1b4332;
}

.funnel-step .step-rate {
  margin-top: 6px;
  font-size: 12px;
  color: #495057;
}

/* Responsive design */
@media (max-width: 768px) {
  .payout-cards {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .payout-card {
    padding: 16px;
  }

  .card-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .payout-cards {
    grid-template-columns: 1fr;
  }
}
</style>