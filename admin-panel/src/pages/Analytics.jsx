import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import { IoCashOutline, IoReceiptOutline, IoRestaurantOutline, IoTrendingUpOutline } from 'react-icons/io5';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, chartRes, categoryRes, peakRes] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getRevenueChart(),
          analyticsAPI.getCategoryBreakdown(),
          analyticsAPI.getPeakHours()
        ]);
        
        setOverview(overviewRes.data);
        setRevenueChart(chartRes.data);
        setCategoryBreakdown(categoryRes.data);
        setPeakHours(peakRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="analytics-loading">Loading analytics data...</div>;
  }

  // Find max values for scaling charts
  const maxRevenue = Math.max(...revenueChart.map(d => d.revenue), 1);
  const totalCategoryRevenue = categoryBreakdown.reduce((sum, cat) => sum + cat.revenue, 0);
  const maxPeakCount = Math.max(...peakHours.map(h => h.count), 1);

  const categoryColors = {
    'Beverages': '#3b82f6', // blue
    'Snacks': '#f59e0b',    // orange
    'Mains': '#22c55e',     // green
    'Desserts': '#ec4899'   // pink
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
      </div>

      {/* Section 1: Overview Cards */}
      {overview && (
        <div className="stats-grid">
          <StatsCard title="Total Revenue" value={`₹${overview.totalRevenue}`} icon={IoCashOutline} color="#d4af37" />
          <StatsCard title="Total Orders" value={overview.totalOrders} icon={IoReceiptOutline} color="#8b5cf6" />
          <StatsCard title="Menu Items" value={overview.menuItems} icon={IoRestaurantOutline} color="#f59e0b" />
          <StatsCard title="Avg Order Value" value={`₹${overview.avgOrderValue}`} icon={IoTrendingUpOutline} color="#22c55e" />
        </div>
      )}

      <div className="analytics-grid">
        {/* Section 2: Revenue Chart */}
        <div className="analytics-card col-span-2">
          <h2>Revenue (Last 7 Days)</h2>
          <div className="bar-chart-container">
            <div className="bar-chart">
              {revenueChart.map((day, idx) => {
                const heightPercentage = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="bar-wrapper">
                    <div className="bar-value">₹{day.revenue}</div>
                    <div className="bar" style={{ height: `${Math.max(heightPercentage, 2)}%` }}></div>
                    <div className="bar-label">{day.day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Category Breakdown */}
        <div className="analytics-card">
          <h2>Category Breakdown</h2>
          <div className="category-breakdown">
            {categoryBreakdown.map((cat, idx) => {
              const percentage = totalCategoryRevenue > 0 ? ((cat.revenue / totalCategoryRevenue) * 100).toFixed(1) : 0;
              const color = categoryColors[cat._id] || '#8b5cf6';
              return (
                <div key={idx} className="category-row">
                  <div className="category-info">
                    <span className="category-dot" style={{ backgroundColor: color }}></span>
                    <span className="category-name">{cat._id}</span>
                    <span className="category-percentage">{percentage}%</span>
                  </div>
                  <div className="category-progress-bg">
                    <div className="category-progress-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                  </div>
                  <div className="category-stats">
                    <span>{cat.orderCount} items</span>
                    <span>₹{cat.revenue}</span>
                  </div>
                </div>
              );
            })}
            {categoryBreakdown.length === 0 && <p className="text-muted">No sales data available yet.</p>}
          </div>
        </div>

        {/* Section 4: Peak Hours Heatmap */}
        <div className="analytics-card col-span-full">
          <h2>Peak Ordering Hours</h2>
          <div className="heatmap-container">
            {peakHours.map((hour, idx) => {
              // Calculate opacity based on max orders (minimum opacity 0.1 so empty cells are visible)
              const intensity = hour.count > 0 ? Math.max(0.2, (hour.count / maxPeakCount)) : 0.05;
              return (
                <div key={idx} className="heatmap-cell-wrapper">
                  <div 
                    className="heatmap-cell" 
                    style={{ backgroundColor: `rgba(212, 175, 55, ${intensity})` }}
                    title={`${hour.count} orders at ${hour.label}`}
                  >
                    <span className="heatmap-count">{hour.count > 0 ? hour.count : ''}</span>
                  </div>
                  <div className="heatmap-label">{idx % 3 === 0 ? hour.label : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
