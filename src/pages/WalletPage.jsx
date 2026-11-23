import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getWalletTransactions } from "../walletApi";

export default function WalletPage() {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getWalletTransactions(profile.id).then(setTransactions).catch(console.error);
  }, [profile.id]);

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending",
  );

  const creditedXP = transactions
    .filter((transaction) => transaction.status === "credited")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const pendingXP = pendingTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const walletData = {
    balance: profile.xp,
    totalEarned: profile.xp,
    pendingRewards: pendingXP,
    transactions,
  };

  return (
    <main className="wallet-page">
      <header className="wallet-header">
        <div>
          <h2>My Wallet</h2>
          <p>Manage your community rewards.</p>
        </div>
      </header>

      {/* Wallet Balance */}
      <section className="wallet-balance card">
        <p className="wallet-label">Available Balance</p>

        <h1>
          {walletData.balance.toLocaleString()} <span>XP</span>
        </h1>

        <div className="wallet-actions">
          <button className="btn" disabled>
            Receive <small>Coming Soon</small>
          </button>

          <button className="btn wallet-withdraw" disabled>
            Withdraw <small>Coming Soon</small>
          </button>
        </div>
      </section>

      {/* Reward Summary */}
      <section className="wallet-section">
        <h3>Reward Summary</h3>

        <div className="reward-summary">
          <div className="card reward-card">
            <span>Total Earned</span>
            <h3>{walletData.totalEarned} XP</h3>
          </div>

          <div className="card reward-card">
            <span>Pending</span>
            <h3>{walletData.pendingRewards} XP</h3>
          </div>

          <div className="card reward-card">
            <span>Credited</span>
            <h3>{creditedXP} XP</h3>
          </div>
        </div>
      </section>

      {/* Pending Rewards */}
      <section className="wallet-section">
        <div className="section-heading">
          <h3>Pending Rewards</h3>
          <span>{pendingTransactions.length} pending</span>
        </div>

        {pendingTransactions.length > 0 ? (
          <div className="pending-list">
            {pendingTransactions.map((transaction) => (
              <div className="card pending-item" key={transaction.id}>
                <div>
                  <h4>{transaction.title}</h4>
                  <p>{transaction.description}</p>
                </div>

                <strong>+{transaction.amount} XP</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="card empty-wallet">
            No pending rewards at the moment.
          </div>
        )}
      </section>

      {/* Transaction History */}
      <section className="wallet-section">
        <div className="section-heading">
          <h3>Transaction History</h3>
          <span>{walletData.transactions.length} transactions</span>
        </div>

        <div className="transaction-list">
          {[...walletData.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction) => (
              <div className="card transaction-item" key={transaction.id}>
                <div className="transaction-info">
                  <div className="transaction-icon">
                    {transaction.status === "credited" ? "↙" : "◷"}
                  </div>

                  <div>
                    <h4>{transaction.title}</h4>
                    <p>{transaction.description}</p>
                    <small>
                      {new Date(transaction.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </div>
                </div>

                <div className="transaction-details">
                  <strong>+{transaction.amount} XP</strong>
                  <span className={`transaction-status ${transaction.status}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}