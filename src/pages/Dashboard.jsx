import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getReports, getReportHistory } from "../api";
import { getSkills } from "../skillsApi";
import { getWalletTransactions } from "../walletApi";
import { getLevelInfo } from "../data/currentUser";
import useAuth from "../hooks/useAuth";
import EditUsername from "../components/EditUsername";
import { timeAgo } from "../utils/time";

const dashboardTabs = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "activity", label: "Activity", icon: "◷" },
  { id: "skills", label: "Skill Swap", icon: "⇄" },
  { id: "profile", label: "Profile", icon: "◉" },
];

function historyText(item) {
  if (item.status === "restored") return `Light was back in ${item.area}`;
  if (item.status === "verified") return `No light in ${item.area}`;
  return `Unconfirmed report of no light in ${item.area}`;
}

export default function Dashboard() {
  const { profile, session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [skills, setSkills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [history, setHistory] = useState([]);

  const displayName = profile.username;
  const navigate = useNavigate();

  const levelInfo = getLevelInfo(profile.xp);

  useEffect(() => {
    async function loadDashboard() {
      const [reportData, skillData, transactionData, historyData] = await Promise.all([
        getReports(),
        getSkills(),
        getWalletTransactions(profile.id),
        getReportHistory().catch(() => []),
      ]);

      setReports(reportData);
      setSkills(skillData);
      setTransactions(transactionData);
      setHistory(historyData);
    }

    loadDashboard().catch(console.error);
  }, [profile.id]);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  const pendingRewards = transactions
    .filter((transaction) => transaction.status === "pending")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const activeOutages = reports.filter(
    (report) => report.status === "pending",
  ).length;

  const verifiedOutages = reports.filter(
    (report) => report.status === "verified",
  ).length;

  const restoredOutages = reports.filter(
    (report) => report.status === "restored",
  ).length;

  const activities = [
    ...reports.map((report) => ({
      id: `report-${report.id}`,
      title:
        report.status === "verified"
          ? "Outage report verified"
          : report.status === "restored"
            ? "Power restored"
            : "New outage reported",
      description: `${report.confirmations} community confirmations`,
      date: report.created_at,
      type: report.status,
    })),

    ...transactions.map((transaction) => ({
      id: `transaction-${transaction.id}`,
      title: transaction.title,
      description: transaction.description,
      date: transaction.date,
      type: "reward",
      amount: transaction.amount,
      status: transaction.status,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="dashboard-page dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">⚡</div>
          <div>
            <strong>PowerCut</strong>
            <span>Community Hub</span>
          </div>
        </div>

        <p className="dashboard-nav-label">WORKSPACE</p>

        <nav className="dashboard-navigation">
          <Link to="/" className="dashboard-nav-item dashboard-home-link">
            <span className="dashboard-nav-icon">⌂</span>
            Home
          </Link>

          {dashboardTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`dashboard-nav-item ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="dashboard-nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-sidebar-user">
            <div className="dashboard-profile-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{displayName}</strong>
              <span>Level {levelInfo.level} Member</span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-logout-btn"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p>POWER CUT BOUNTIES</p>
            <span>Community dashboard</span>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="dashboard-view">
            <section className="dashboard-welcome">
              <div>
                <p className="dashboard-eyebrow">YOUR COMMUNITY OVERVIEW</p>
                <h1>Welcome back, {displayName}!</h1>
                <p>Here's what's happening in your community today.</p>
              </div>

              <div className="dashboard-level">
                <span>LEVEL {levelInfo.level}</span>
                <strong>{profile.xp} XP</strong>
              </div>
            </section>

            <section className="dashboard-stats">
              <div className="dashboard-stat">
                <span>Active outages</span>
                <strong>{activeOutages}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Verified outages</span>
                <strong>{verifiedOutages}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Restored outages</span>
                <strong>{restoredOutages}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Skills available</span>
                <strong>{skills.length}</strong>
              </div>
            </section>

            <section className="dashboard-overview-grid">
              <div className="dashboard-wallet">
                <div>
                  <p>YOUR XP BALANCE</p>
                  <h2>{profile.xp} XP</h2>
                  <span>{pendingRewards} XP pending rewards</span>
                </div>

                <Link to="/wallet" className="dashboard-action">
                  View wallet →
                </Link>
              </div>

              <section className="dashboard-xp-progress">
                <div className="xp-progress-heading">
                  <div>
                    <p>YOUR LEVEL PROGRESS</p>
                    <h2>Level {levelInfo.level}</h2>
                  </div>

                  <span>{Math.round(levelInfo.progress)}%</span>
                </div>

                <div className="xp-progress-track">
                  <div
                    className="xp-progress-fill"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>

                <div className="xp-progress-footer">
                  <span>{profile.xp} XP earned</span>

                  <span>
                    {levelInfo.level >= 3
                      ? "Maximum level reached!"
                      : `${
                          levelInfo.level === 1 ? 100 : 300
                        } XP required for next level`}
                  </span>
                </div>
              </section>
            </section>

            <section className="dashboard-quick-actions">
              <h2>Quick actions</h2>

              <div className="dashboard-action-grid">
                <Link to="/" className="dashboard-action-card">
                  <strong>View map</strong>
                  <span>Check outages around you</span>
                </Link>

                <button
                  type="button"
                  className="dashboard-action-card"
                  onClick={() => setActiveTab("skills")}
                >
                  <strong>Explore skills</strong>
                  <span>Discover community services</span>
                </button>

                <Link to="/skills/offer" className="dashboard-action-card">
                  <strong>Offer a skill</strong>
                  <span>Share what you can do</span>
                </Link>

                <Link to="/wallet" className="dashboard-action-card">
                  <strong>My wallet</strong>
                  <span>Check your XP and rewards</span>
                </Link>
              </div>
            </section>

            <section className="dashboard-activity dashboard-overview-activity">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Recent activity</h2>
                  <p>Your latest community and reward updates.</p>
                </div>

                <button type="button" onClick={() => setActiveTab("activity")}>
                  View all
                </button>
              </div>

              <ActivityList activities={activities.slice(0, 3)} />
            </section>

            <section className="dashboard-history">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Past outage updates</h2>
                  <p>
                    Reports leave the map after 1 to 2 hours. Here is what happened
                    in the last 2 days, in every area.
                  </p>
                </div>
              </div>

              {history.length === 0 ? (
                <p className="activity-empty">Nothing in the last 2 days.</p>
              ) : (
                <ul className="history-list">
                  {history.map((item) => (
                    <li key={item.id}>
                      <span>{historyText(item)}</span>
                      <small>{timeAgo(item.event_at)}</small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="dashboard-view">
            <section className="dashboard-page-heading">
              <p className="dashboard-eyebrow">YOUR HISTORY</p>
              <h1>Recent activity</h1>
              <p>Keep track of your community contributions and rewards.</p>
            </section>

            <section className="dashboard-activity">
              <div className="dashboard-section-heading">
                <div>
                  <h2>All activity</h2>
                  <p>{activities.length} recorded activities</p>
                </div>
              </div>

              <ActivityList activities={activities} />
            </section>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="dashboard-view">
            <section className="dashboard-page-heading">
              <p className="dashboard-eyebrow">COMMUNITY EXCHANGE</p>
              <h1>Skill Swap</h1>
              <p>Discover skills and services available in your community.</p>
            </section>

            <section className="dashboard-skills">
              <div className="dashboard-section-heading">
                <div>
                  <h2>Available community skills</h2>
                  <p>{skills.length} skills currently available</p>
                </div>

                <Link to="/skills">Explore all →</Link>
              </div>

              <div className="dashboard-skills-grid">
                {skills.slice(0, 6).map((skill) => (
                  <div className="dashboard-skill-card" key={skill.id}>
                    <div className="dashboard-skill-top">
                      <div className="dashboard-skill-avatar">
                        {skill.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>{skill.name}</strong>
                        <span>{skill.category}</span>
                      </div>
                    </div>

                    <div className="dashboard-skill-info">
                      <span>Offers</span>
                      <p>{skill.offers}</p>
                    </div>

                    <div className="dashboard-skill-info">
                      <span>Wants in return</span>
                      <p>{skill.wants}</p>
                    </div>

                    <Link
                      to={`/skills/${skill.id}`}
                      className="dashboard-skill-link"
                    >
                      View skill →
                    </Link>
                  </div>
                ))}
              </div>

              {skills.length === 0 && (
                <p className="activity-empty">
                  No community skills available yet.
                </p>
              )}
            </section>

            <Link to="/skills/offer" className="dashboard-action">
              + Offer a skill
            </Link>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="dashboard-view">
            <section className="dashboard-page-heading">
              <p className="dashboard-eyebrow">ACCOUNT SETTINGS</p>
              <h1>Your profile</h1>
              <p>View your account information and community progress.</p>
            </section>

            <section className="dashboard-profile">
              <div className="dashboard-profile-card">
                <div className="dashboard-profile-header">
                  <div className="dashboard-profile-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{displayName}</h3>
                    <span>Level {levelInfo.level} Member</span>
                  </div>
                </div>

                <div className="dashboard-profile-details">
                  <div>
                    <span>Username</span>
                    <EditUsername />
                  </div>

                  <div>
                    <span>Email address</span>
                    <strong>{session.user.email || "Not provided"}</strong>
                  </div>

                  <div>
                    <span>Phone number</span>
                    <strong>{profile.phone || "Not provided"}</strong>
                  </div>

                  
                  <div>
                    <span>XP earned</span>
                    <strong>{profile.xp} XP</strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-account-actions">
                <div>
                  <strong>Sign out of your account</strong>
                  <span>You can log back in anytime.</span>
                </div>

                <button
                  type="button"
                  className="dashboard-signout-btn"
                  onClick={handleLogout}
                >
                  <span>↗</span>
                  Log out
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function ActivityList({ activities }) {
  if (activities.length === 0) {
    return <p className="activity-empty">No recent activity yet.</p>;
  }

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <div className="activity-item" key={activity.id}>
          <div className={`activity-icon ${activity.type}`}>
            {activity.type === "verified"
              ? "✓"
              : activity.type === "restored"
                ? "↗"
                : activity.type === "pending"
                  ? "!"
                  : activity.type === "reward"
                    ? "XP"
                    : "+"}
          </div>

          <div className="activity-details">
            <strong>{activity.title}</strong>
            <span>{activity.description}</span>
            <small>{new Date(activity.date).toLocaleString()}</small>
          </div>

          {activity.type === "reward" && (
            <span className={`activity-reward ${activity.status}`}>
              +{activity.amount} XP
            </span>
          )}
        </div>
      ))}
    </div>
  );
}