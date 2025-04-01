import { useState } from "react";

function Report({
  id,
  title,
  description,
  category,
  priority,
  location,
  timestamp,
  image,
  resolved,
  toggleReportResolved,
  deleteReport
}) {
  const [showFullImage, setShowFullImage] = useState(false);
  
  const formattedDate = new Date(timestamp).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <li className="report-card">
      <div className="report-header">
        <div className="report-title-group">
          <h3 className="report-title">{title}</h3>
          <span className={`status-badge ${resolved ? 'resolved' : 'pending'}`}>
            {resolved ? 'Resolved' : 'Pending'}
          </span>
        </div>
        <time className="report-timestamp" dateTime={timestamp}>
          {formattedDate}
        </time>
      </div>

      <div className="report-content">
        <div className="report-description">
          <p>{description}</p>
        </div>

        <div className="report-metadata">
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Category</span>
              <span className={`metadata-value category-${category}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </div>
            
            <div className="metadata-item">
              <span className="metadata-label">Priority</span>
              <span className={`metadata-value priority-${priority}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            </div>

            {location && (
              <div className="metadata-item">
                <span className="metadata-label">Location</span>
                <a
                  href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  <span>📍 View on Map</span>
                  <span className="coordinates">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {image && (
          <div className="report-media">
            <div className="report-image-container" onClick={() => setShowFullImage(true)}>
              <img src={image} alt="Report documentation" className="report-image" />
              <div className="image-overlay">
                <span className="zoom-hint">🔍 Click to enlarge</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="report-actions">
        <button
          type="button"
          className={`action-btn ${resolved ? 'warning' : 'success'}`}
          onClick={() => toggleReportResolved(id)}
        >
          <span className="action-icon">{resolved ? '⟲' : '✓'}</span>
          <span>{resolved ? 'Mark as Pending' : 'Mark as Resolved'}</span>
        </button>
        <button
          type="button"
          className="action-btn danger"
          onClick={() => deleteReport(id)}
        >
          <span className="action-icon">🗑</span>
          <span>Delete</span>
        </button>
      </div>

      {showFullImage && (
        <div className="image-modal" onClick={() => setShowFullImage(false)}>
          <div className="modal-content">
            <img src={image} alt="Full size report documentation" />
            <button className="modal-close">×</button>
          </div>
        </div>
      )}
    </li>
  );
}

export default Report;