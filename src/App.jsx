// App.jsx
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Report from "./components/Report";
import ReportForm from "./components/ReportForm";
import FilterButton from "./components/FilterButton";
import SyncService from "./services/syncService";
import "./App.css";

const FILTER_MAP = {
  All: () => true,
  Pending: (report) => !report.resolved,
  Resolved: (report) => report.resolved,
  Urgent: (report) => report.priority === "high",
};

function App() {
  const [reports, setReports] = useState(() => SyncService.getReports());
  const [filter, setFilter] = useState("All");
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [userSettings, setUserSettings] = useState(() =>
    SyncService.getUserSettings()
  );

  // Sync reports with localStorage whenever they change
  useEffect(() => {
    SyncService.saveReports(reports);
  }, [reports]);

  // Sync user settings with localStorage whenever they change
  useEffect(() => {
    SyncService.saveUserSettings(userSettings);
  }, [userSettings]);

  // Initialize sync service and handle online/offline status
  useEffect(() => {
    SyncService.init();

    const handleOnline = () => {
      setOnlineStatus(true);
      SyncService.processSyncQueue();
    };
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function addReport(reportData) {
    const newReport = {
      id: `report-${nanoid()}`,
      timestamp: new Date().toISOString(),
      ...reportData,
      resolved: false,
    };

    setReports((prev) => [...prev, newReport]);

    await SyncService.queueReport(newReport);
  }

  function toggleReportResolved(id) {
    setReports((prev) =>
      prev.map((report) => {
        if (id === report.id) {
          return { ...report, resolved: !report.resolved };
        }
        return report;
      })
    );
  }

  function updateReport(id, updatedFields) {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, ...updatedFields } : report
      ) 
    );
  }

  function deleteReport(id) {
    setReports((prev) => prev.filter((report) => id !== report.id));
  }

  function updateUserSettings(newSettings) {
    setUserSettings((prev) => ({ ...prev, ...newSettings }));
  }

  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const reportList = reports
  .filter(FILTER_MAP[filter])
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  .map((report) => (
    <Report
      key={report.id}
      {...report}
      toggleReportResolved={toggleReportResolved}
      deleteReport={deleteReport}
      updateReport={updateReport} 
    />
  ));

  return (
    <div className="siteSpotter stack-large">
      <header className="app-header">
        <h1>SiteSpotter</h1>
        <div
          className={`connection-status ${onlineStatus ? "online" : "offline"}`}
        >
          {onlineStatus ? "Online" : "Offline"}
        </div>
      </header>

      <main>
        <ReportForm
          addReport={addReport}
          defaultSettings={userSettings}
          updateSettings={updateUserSettings}
        />

        <div className="filters btn-group stack-exception">{filterList}</div>

        <section className="reports-section">
          <h2 id="list-heading">Site Reports ({reportList.length})</h2>
          <ul
            role="list"
            className="report-list stack-large stack-exception"
            aria-labelledby="list-heading"
          >
            {reportList.length > 0 ? (
              reportList
            ) : (
              <li className="no-reports">
                No reports found. Create a new report to get started.
              </li>
            )}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} SiteSpotter. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
