<template>
  <!-- Payout 概览 -->
  <PayoutOverview />

  <!-- 最近60天销售折线图 -->
  <SalesLineChart />

  <!-- 漏斗统计 -->
  <FunnelAnalytics />

  <!-- 设备型号统计 -->
  <DeviceOrderSummary />

  <!-- 应用销售总计（分页） -->
  <AppSalesSummary />

</template>

<script setup lang="ts">
import FunnelAnalytics from '@/components/dashboard/FunnelAnalytics.vue'
import PayoutOverview from '@/components/dashboard/PayoutOverview.vue'
import AppSalesSummary from '@/components/dashboard/AppSalesSummary.vue'
import SalesLineChart from '@/components/dashboard/SalesLineChart.vue'
import DeviceOrderSummary from '@/components/dashboard/DeviceOrderSummary.vue'
</script>

<style scoped>
.account-page {
  padding: 32px;
  background: var(--color-surface);
  min-height: 300px;
}

.payout-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.payout-card {
  background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-canvas-top) 100%);
  border: 1px solid var(--color-line);
  border-radius: 12px;
  padding: 18px 16px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.payout-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-brand);
  background: var(--color-brand-soft);
  border: 1px solid var(--color-line);
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 4px 10px;
  margin-bottom: 10px;
}

.card-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-brand-strong);
  line-height: 1.2;
}

.loading-text {
  color: var(--color-muted);
  font-size: 16px;
  font-weight: 400;
}

.error-message {
  background: var(--color-danger-soft);
  border: 1px solid var(--color-danger-soft);
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: var(--color-danger);
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
  color: var(--color-brand-strong);
}
.payout-title .subtitle {
  font-size: 12px;
  color: var(--color-muted);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
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
  border: 1px solid var(--color-line);
}

.app-info {
  display: flex;
  flex-direction: column;
}

.app-name {
  font-weight: 600;
  color: var(--color-ink);
}

.app-sub {
  font-size: 12px;
  color: var(--color-muted);
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
  color: var(--color-muted);
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
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.funnel-step .step-title {
  font-size: 12px;
  color: var(--color-muted);
}

.funnel-step .step-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-brand-strong);
}

.funnel-step .step-rate {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-muted);
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
