import React, { useState, useEffect } from 'react';
import { useGenerateLobbyLogic } from './GenerateLobby.logic';
import './GenerateLobby.scss';

interface GenerateLobbyProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateLobby: React.FC<GenerateLobbyProps> = ({ isOpen, onClose }) => {
  const {
    isSubmitting,
    error,
    success,
    formData,
    setFormData,
    handleTimeSlotAdd,
    handleTimeSlotRemove,
    handleSubModeToggle,
    handleSubmit,
    closeModal,
  } = useGenerateLobbyLogic();

  const handleClose = () => {
    closeModal();
    onClose();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
  };

  // Close modal after successful submission
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        closeModal();
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, closeModal, onClose]);

  const [selectedHour, setSelectedHour] = useState('12');
  const [isAM, setIsAM] = useState(true);

  const handleAddTimeSlot = () => {
    const timeSlot = `${selectedHour}:00 ${isAM ? 'AM' : 'PM'}`;
    handleTimeSlotAdd(timeSlot);
  };

  const gameModes = [
    { value: 'BR', label: 'BR (Battle Royale)' },
    { value: 'LW', label: 'LW (Lone Wolf)' },
    { value: 'CS', label: 'CS (Clash Squad)' },
  ];
  const subModes = ['solo', 'duo', 'squad'];
  const regions = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
  const timeHours = ['12', '3', '6', '9'];

  if (!isOpen) return null;

  return (
    <div className="generate-lobby-modal-overlay" onClick={handleClose}>
      <div className="generate-lobby-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="generate-lobby-modal-header">
          <h3 className="generate-lobby-modal-title">Generate Next Day Lobby</h3>
          <button
            className="generate-lobby-modal-close"
            onClick={handleClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="generate-lobby-form" onSubmit={handleFormSubmit}>
          <div className="generate-lobby-modal-body">
            {/* Date Selection */}
            <div className="form-group">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-input form-date-input"
                value={formData.dateType}
                onChange={(e) => setFormData({ ...formData, dateType: e.target.value })}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Slots */}
            <div className="form-group">
              <label className="form-label">Time Slots</label>
              <div className="time-slots-input-group">
                <select
                  className="form-select time-hour-select"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  disabled={isSubmitting}
                >
                  {timeHours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                <div className="am-pm-toggle">
                  <button
                    type="button"
                    className={`am-pm-button ${isAM ? 'active' : ''}`}
                    onClick={() => setIsAM(true)}
                    disabled={isSubmitting}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    className={`am-pm-button ${!isAM ? 'active' : ''}`}
                    onClick={() => setIsAM(false)}
                    disabled={isSubmitting}
                  >
                    PM
                  </button>
                </div>
                <button
                  type="button"
                  className="add-time-slot-button"
                  onClick={handleAddTimeSlot}
                  disabled={isSubmitting}
                >
                  Add
                </button>
              </div>
              {formData.timeSlots.length > 0 && (
                <div className="time-slots-list">
                  {formData.timeSlots.map((slot, index) => (
                    <div key={index} className="time-slot-tag">
                      <span>{slot}</span>
                      <button
                        type="button"
                        className="remove-time-slot-button"
                        onClick={() => handleTimeSlotRemove(slot)}
                        disabled={isSubmitting}
                        aria-label={`Remove ${slot}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Game Mode */}
            <div className="form-group">
              <label className="form-label">Game Mode</label>
              <select
                className="form-select"
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                disabled={isSubmitting}
              >
                {gameModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Modes */}
            <div className="form-group">
              <label className="form-label">Sub Modes</label>
              <div className="sub-modes-checkboxes">
                {subModes.map((subMode) => (
                  <label key={subMode} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.subModes.includes(subMode)}
                      onChange={() => handleSubModeToggle(subMode)}
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-text">{subMode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="form-group">
              <label className="form-label">Region</label>
              <select
                className="form-select"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                disabled={isSubmitting}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="form-message form-error">
                <span className="message-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="form-message form-success">
                <span className="message-icon">✅</span>
                <span>{success}</span>
              </div>
            )}
          </div>

          <div className="generate-lobby-modal-footer">
            <button
              type="button"
              className="form-button form-button-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="form-button form-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating...' : 'Generate Lobbies'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateLobby;

