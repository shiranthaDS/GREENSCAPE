import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboardf = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    pendingCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/minor-transactions");
      setTransactions(res.data);
      calculateSummary(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = (txData) => {
    // Calculate financial summary from transaction data
    const summary = txData.reduce((acc, tx) => {
      // Extract the number from the amount (handling both string and number types)
      let amount;
      if (typeof tx.amount === 'string') {
        // Remove "Rs. " prefix if present and convert to number
        amount = parseFloat(tx.amount.replace(/Rs\.\s*/i, '').trim());
      } else if (typeof tx.amount === 'number') {
        amount = tx.amount;
      } else {
        amount = 0;
      }

      if (tx.type === "Income") {
        acc.totalIncome += amount;
      } else if (tx.type === "Expense") {
        acc.totalExpense += amount;
      }
      
      return acc;
    }, {
      totalIncome: 0,
      totalExpense: 0,
      pendingCount: 0
    });

    // Calculate net balance
    summary.netBalance = summary.totalIncome - summary.totalExpense;
    
    // Count pending items (this is a placeholder - you may need to adjust based on your data structure)
    summary.pendingCount = txData.filter(tx => tx.status === "Pending").length;
    
    setSummary(summary);
  };

  // Get the 5 most recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (err) {
      return dateString;
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      // If it already has currency symbol, return as is
      if (amount.includes('Rs.')) return amount;
      return `Rs. ${parseFloat(amount).toFixed(2)}`;
    }
    return `Rs. ${amount.toFixed(2)}`;
  };

  return (
    <div className="finance-dashboard">
      <h1>Financial Overview</h1>
      
      {error && (
        <div className="error-alert">
          {error}
          <button onClick={() => setError("")} className="close-btn">×</button>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Loading financial data...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card revenue">
              <h3>Total Income</h3>
              <p>{formatCurrency(summary.totalIncome)}</p>
            </div>
            
            <div className="stat-card expenses">
              <h3>Total Expenses</h3>
              <p>{formatCurrency(summary.totalExpense)}</p>
            </div>
            
            <div className="stat-card profit">
              <h3>Net Balance</h3>
              <p className={summary.netBalance >= 0 ? 'positive' : 'negative'}>
                {formatCurrency(summary.netBalance)}
              </p>
            </div>
            
            <div className="stat-card invoices">
              <h3>Pending Items</h3>
              <p>{summary.pendingCount}</p>
            </div>
          </div>
          
          <div className="recent-transactions">
            <h2>Recent Transactions</h2>
            {recentTransactions.length === 0 ? (
              <p className="no-data">No recent transactions found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Payer/Payee</th>
                    <th>Method</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(tx => (
                    <tr key={tx._id}>
                      <td>{formatDate(tx.date)}</td>
                      <td>{tx.description}</td>
                      <td>{tx.payer_payee}</td>
                      <td>{tx.method}</td>
                      <td>{tx.type}</td>
                      <td className={tx.type === 'Income' ? 'income' : 'expense'}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .finance-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .finance-dashboard h1 {
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }

        .error-alert {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #721c24;
        }

        .loading, .no-data {
          text-align: center;
          padding: 20px;
          font-size: 1.1rem;
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card h3 {
          color: #7f8c8d;
          margin-top: 0;
          font-size: 1.1rem;
        }

        .stat-card p {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 10px 0 0;
        }

        .stat-card.revenue {
          border-top: 4px solid #2ecc71;
        }

        .stat-card.expenses {
          border-top: 4px solid #e74c3c;
        }

        .stat-card.profit {
          border-top: 4px solid #3498db;
        }

        .stat-card.invoices {
          border-top: 4px solid #f39c12;
        }

        .positive {
          color: #2ecc71;
        }

        .negative {
          color: #e74c3c;
        }

        .recent-transactions {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .recent-transactions h2 {
          color: #2c3e50;
          margin-top: 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #ecf0f1;
        }

        .recent-transactions table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .recent-transactions th, 
        .recent-transactions td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
        }

        .recent-transactions th {
          background-color: #f8f9fa;
          color: #7f8c8d;
          font-weight: 600;
        }

        .recent-transactions tr:hover {
          background-color: #f8f9fa;
        }

        .income {
          color: #2ecc71;
          font-weight: 600;
        }

        .expense {
          color: #e74c3c;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .recent-transactions table {
            font-size: 0.85rem;
          }
          
          .recent-transactions th,
          .recent-transactions td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboardf;