import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8009"
    : "http://backend:8009";

const AuditPage = () => {
  const { t } = useTranslation();
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState([]);
  const [logTypes, setLogTypes] = useState([]);

  useEffect(() => {
    fetchLogTypes();
    fetchAuditLogs();
  }, [currentPage, filterDate, filterType]);

  const fetchLogTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/audit_log_types`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const types = await response.json();
        setLogTypes(types);
      }
    } catch (error) {
      console.error(t("Error fetching log types"), error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        page_size: 50,
        date: filterDate,
        type: filterType.join(","),
      });
      const response = await fetch(`${API_URL}/audit_logs?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const { logs, totalPages } = await response.json();
        setAuditLogs(logs);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error(t("Error fetching audit logs"), error);
    }
  };

  const handleTypeChange = (type) => {
  setFilterType((prev) =>
    prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
  );
  setCurrentPage(1); // Повернення на першу сторінку
};


  return (
      <div>
        <h1>{t("Audit Logs")}</h1>
        <div>
          <label>{t("Filter by Date")}</label>
          <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div>
          <label>{t("Filter by Type")}</label>
          {logTypes.map((type) => (
              <div key={type}>
                <label>
                  <input
                      type="checkbox"
                      value={type}
                      checked={filterType.includes(type)}
                      onChange={() => handleTypeChange(type)}
                  />
                  {type}
                </label>
              </div>
          ))}
        </div>
        <table>
          <thead>
          <tr>
            <th>{t("Timestamp")}</th>
            <th>{t("Type")}</th>
            <th>{t("Message")}</th>
          </tr>
          </thead>
          <tbody>
          {auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.event_type}</td>
                <td>{log.event_details}</td>
              </tr>
          ))}
          </tbody>
        </table>
        <div>
          <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
          >
            {t("Previous")}
          </button>
          <span>
          {t("Page")} {currentPage} {t("of")} {totalPages}
        </span>
          <button
              onClick={() =>
                  setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              disabled={currentPage === totalPages}
          >
            {t("Next")}
          </button>
        </div>
      </div>
  );
};

export default AuditPage;