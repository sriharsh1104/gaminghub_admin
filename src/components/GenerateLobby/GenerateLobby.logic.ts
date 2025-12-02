import { useState } from 'react';
import { lobbyApi, type GenerateLobbyRequest } from '@services/api';

export const useGenerateLobbyLogic = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get tomorrow's date as default
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // Form state
  const [formData, setFormData] = useState<GenerateLobbyRequest>({
    dateType: getTomorrowDate(),
    timeSlots: [],
    mode: 'BR',
    subModes: [],
    region: 'Asia',
  });

  const closeModal = () => {
    setError(null);
    setSuccess(null);
    // Reset form
    setFormData({
      dateType: getTomorrowDate(),
      timeSlots: [],
      mode: 'BR',
      subModes: [],
      region: 'Asia',
    });
  };

  const handleTimeSlotAdd = (timeSlot: string) => {
    if (timeSlot.trim() && !formData.timeSlots.includes(timeSlot.trim())) {
      setFormData((prev) => ({
        ...prev,
        timeSlots: [...prev.timeSlots, timeSlot.trim()],
      }));
    }
  };

  const handleTimeSlotRemove = (timeSlot: string) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((ts) => ts !== timeSlot),
    }));
  };

  const handleSubModeToggle = (subMode: string) => {
    setFormData((prev) => {
      const isSelected = prev.subModes.includes(subMode);
      return {
        ...prev,
        subModes: isSelected
          ? prev.subModes.filter((sm) => sm !== subMode)
          : [...prev.subModes, subMode],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.dateType) {
      setError('Please select a date');
      return;
    }

    if (formData.timeSlots.length === 0) {
      setError('Please add at least one time slot');
      return;
    }

    if (formData.subModes.length === 0) {
      setError('Please select at least one sub-mode');
      return;
    }

    if (!formData.mode) {
      setError('Please select a game mode');
      return;
    }

    if (!formData.region) {
      setError('Please select a region');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await lobbyApi.generateLobbies(formData);
      if (response.success) {
        setSuccess(response.message || 'Lobbies generated successfully!');
      } else {
        setError(response.message || 'Failed to generate lobbies');
      }
    } catch (err: any) {
      console.error('Failed to generate lobbies:', err);
      setError(err?.message || 'Failed to generate lobbies. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};

