import { useState } from "react";
import CameraUI from "./CameraUI";

function ReportForm({ addReport }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "maintenance",
    priority: "medium",
    location: null,
    image: null,
  });

  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCameraCapture = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    setShowCamera(false);
  };

  async function getCurrentLocation() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const location = await getCurrentLocation();
      await addReport({
        ...formData,
        location,
        timestamp: new Date().toISOString(),
      });

      setFormData({
        title: "",
        description: "",
        category: "maintenance",
        priority: "medium",
        location: null,
        image: null,
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: "Failed to submit report. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-header">
          <h2 className="form-title">New Report</h2>
          <p className="form-subtitle">
            Submit a new site observation or issue
          </p>
        </div>

        <div className="form-section">
          <label htmlFor="report-title" className="form-label">
            Report Title
          </label>
          <input
            type="text"
            id="report-title"
            className="input input__lg"
            name="title"
            placeholder="Enter a descriptive title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-section">
          <label htmlFor="report-description" className="form-label">
            Description
          </label>
          <textarea
            id="report-description"
            className="input input__lg textarea"
            name="description"
            placeholder="Provide detailed information about the observation"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows="4"
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="report-category" className="form-label">
              Category
            </label>
            <select
              id="report-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="input input__lg select"
            >
              <option value="maintenance">Maintenance</option>
              <option value="wildlife">Wildlife</option>
              <option value="hazard">Hazard</option>
              <option value="vandalism">Vandalism</option>
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="report-priority" className="form-label">
              Priority Level
            </label>
            <select
              id="report-priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="input input__lg select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Photo Documentation</label>
          <button
            type="button"
            className="btn btn__secondary camera-btn"
            onClick={() => setShowCamera(true)}
          >
            <span className="camera-icon">📷</span>
            Take Photo
          </button>
          {formData.image && (
            <div className="photo-preview">
              <img src={formData.image} alt="Report documentation" />
              <button
                type="button"
                className="btn btn__danger remove-photo"
                onClick={() => setFormData({ ...formData, image: null })}
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        <div className="form-footer">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}
          <button
            type="submit"
            className="btn btn__primary btn__lg submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-spinner"></span>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </form>

      {showCamera && (
        <CameraUI
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
export default ReportForm;
