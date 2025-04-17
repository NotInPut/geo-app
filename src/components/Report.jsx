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
  deleteReport,
  updateReport, 
}) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editedTitle, setEditedTitle] = useState(title); 
  const [editedDescription, setEditedDescription] = useState(description); 
  const [editedCategory, setEditedCategory] = useState(category); 
  const [editedPriority, setEditedPriority] = useState(priority); 

  const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSave = () => {
    updateReport(id, {
      title: editedTitle,
      description: editedDescription,
      category: editedCategory,
      priority: editedPriority
    });
    setIsEditing(false); 
  };

  return (
    <li className="report-card">
      <div className="report-header">
        <div className="report-title-group">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input input__lg"
            />
          ) : (
            <h3 className="report-title">{title}</h3>
          )}
          <span className={`status-badge ${resolved ? "resolved" : "pending"}`}>
            {resolved ? "Resolved" : "Pending"}
          </span>
        </div>
        <time className="report-timestamp" dateTime={timestamp}>
          {formattedDate}
        </time>
      </div>

      <div className="report-content">
        <div className="report-description">
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="input input__lg textarea"
              rows="4"
            />
          ) : (
            <p>{description}</p>
          )}
        </div>

        <div className="report-metadata">
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Category</span>
              {isEditing ? (
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="input input__lg select"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="hazard">Hazard</option>
                  <option value="vandalism">Vandalism</option>
                </select>
              ) : (
                <span className={`metadata-value category-${category}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              )}
            </div>

            <div className="metadata-item">
              <span className="metadata-label">Priority</span>
              {isEditing ? (
                <select
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                  className="input input__lg select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              ) : (
                <span className={`metadata-value priority-${priority}`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
              )}
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
            <div
              className="report-image-container"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={image}
                alt="Report documentation"
                className="report-image"
              />
              <div className="image-overlay">
                <span className="zoom-hint">🔍 Click to enlarge</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="report-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="action-btn success"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="action-btn warning"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="action-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className={`action-btn ${resolved ? "warning" : "success"}`}
              onClick={() => toggleReportResolved(id)}
            >
              <span className="action-icon">{resolved ? "⟲" : "✓"}</span>
              <span>{resolved ? "Mark as Pending" : "Mark as Resolved"}</span>
            </button>
            <button
              type="button"
              className="action-btn danger"
              onClick={() => deleteReport(id)}
            >
              <span className="action-icon">🗑</span>
              <span>Delete</span>
            </button>
          </>
        )}
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