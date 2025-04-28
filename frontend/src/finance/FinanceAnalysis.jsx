import { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000/api/transactions";

const FinanceAnalysis = () => {
  const [transactions, setTransactions] = useState([]);
  const [timeRange, setTimeRange] = useState("monthly"); // 'monthly' or 'yearly'
  const [isLoading, setIsLoading] = useState(true);

  // Format currency with Sri Lankan Rupee symbol
  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Month names for display
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Process data for the line chart
  const processLineChartData = () => {
    if (!transactions.length) return { labels: [], datasets: [] };

    const groupedData = {};
    const allPeriods = new Set();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let period;
      
      if (timeRange === "monthly") {
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        period = date.getFullYear().toString();
      }

      allPeriods.add(period);

      if (!groupedData[period]) {
        groupedData[period] = { income: 0, expense: 0 };
      }

      if (transaction.type === "Income") {
        groupedData[period].income += parseFloat(transaction.amount);
      } else {
        groupedData[period].expense += parseFloat(transaction.amount);
      }
    });

    const sortedPeriods = Array.from(allPeriods).sort();
    const incomeData = sortedPeriods.map(period => groupedData[period]?.income || 0);
    const expenseData = sortedPeriods.map(period => groupedData[period]?.expense || 0);

    return {
      labels: sortedPeriods,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Expense',
          data: expenseData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
          fill: false
        }
      ]
    };
  };

  // Process data for the bar chart (monthly breakdown)
  const processBarChartData = () => {
    if (!transactions.length) return { labels: [], datasets: [] };

    const currentYear = new Date().getFullYear();
    const monthlyData = Array(12).fill().map(() => ({ income: 0, expense: 0 }));

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const amount = parseFloat(transaction.amount);
        
        if (transaction.type === "Income") {
          monthlyData[month].income += amount;
        } else {
          monthlyData[month].expense += amount;
        }
      }
    });

    // Calculate net profit/loss for each month
    const netData = monthlyData.map(month => month.income - month.expense);

    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(month => month.income),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
        {
          label: 'Expense',
          data: monthlyData.map(month => month.expense),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        {
          label: 'Net Profit/Loss',
          data: netData,
          backgroundColor: netData.map(value => 
            value >= 0 ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 159, 64, 0.7)'
          ),
          borderColor: netData.map(value => 
            value >= 0 ? 'rgb(54, 162, 235)' : 'rgb(255, 159, 64)'
          ),
          borderWidth: 1,
          type: 'bar'
        }
      ]
    };
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!transactions.length) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    let netProfit = 0;
    let highestIncome = 0;
    let highestExpense = 0;

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === "Income") {
        totalIncome += amount;
        if (amount > highestIncome) highestIncome = amount;
      } else {
        totalExpense += amount;
        if (amount > highestExpense) highestExpense = amount;
      }
    });

    netProfit = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netProfit,
      highestIncome,
      highestExpense
    };
  };

  const lineChartData = processLineChartData();
  const barChartData = processBarChartData();
  const summary = calculateSummary();

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: timeRange === "monthly" 
          ? 'Monthly Income vs. Expenses' 
          : 'Yearly Income vs. Expenses',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: Rs. ${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rs. ' + value;
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Year Monthly Breakdown',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: Rs. ${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rs. ' + value;
          }
        }
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Financial Analysis</h2>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading data...</div>
      ) : transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ddd', borderRadius: '5px' }}>
          No transactions available for analysis.
        </div>
      ) : (
        <>
          {/* Time Range Selector */}
          <div style={{ 
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px'
          }}>
            <button
              onClick={() => setTimeRange("monthly")}
              style={{
                padding: '8px 16px',
                backgroundColor: timeRange === "monthly" ? '#4CAF50' : '#e7e7e7',
                color: timeRange === "monthly" ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: timeRange === "monthly" ? 'bold' : 'normal'
              }}
            >
              Monthly View
            </button>
            <button
              onClick={() => setTimeRange("yearly")}
              style={{
                padding: '8px 16px',
                backgroundColor: timeRange === "yearly" ? '#4CAF50' : '#e7e7e7',
                color: timeRange === "yearly" ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: timeRange === "yearly" ? 'bold' : 'normal'
              }}
            >
              Yearly View
            </button>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: '#2e7d32' }}>Total Income</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
            
            <div style={{
              padding: '20px',
              backgroundColor: '#ffebee',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: '#c62828' }}>Total Expenses</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
            
            <div style={{
              padding: '20px',
              backgroundColor: summary.netProfit >= 0 ? '#e8f5e9' : '#ffebee',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: summary.netProfit >= 0 ? '#2e7d32' : '#c62828' }}>
                Net {summary.netProfit >= 0 ? 'Profit' : 'Loss'}
              </h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(Math.abs(summary.netProfit))}
              </p>
            </div>
          </div>

          {/* Line Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <Line options={lineChartOptions} data={lineChartData} />
          </div>

          {/* Bar Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <Bar options={barChartOptions} data={barChartData} />
          </div>

          {/* Additional Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: '#1565c0' }}>Highest Single Income</h3>
              <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {formatCurrency(summary.highestIncome)}
              </p>
            </div>
            
            <div style={{
              padding: '20px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: '#e65100' }}>Highest Single Expense</h3>
              <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {formatCurrency(summary.highestExpense)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceAnalysis;