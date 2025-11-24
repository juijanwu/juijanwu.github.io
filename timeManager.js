/**
 * TimeManager - Handles time retrieval and formatting
 */
class TimeManager {
  /**
   * Get current time data
   * @returns {TimeData} Object containing hours, minutes, seconds, and date
   */
  getCurrentTime() {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      date: now
    };
  }

  /**
   * Format time in 24-hour notation
   * @param {TimeData} time - Time data object
   * @returns {string} Formatted time string (HH:MM:SS)
   */
  format24Hour(time) {
    const hours = String(time.hours).padStart(2, '0');
    const minutes = String(time.minutes).padStart(2, '0');
    const seconds = String(time.seconds).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Format time in 12-hour notation with AM/PM
   * @param {TimeData} time - Time data object
   * @returns {string} Formatted time string (HH:MM:SS AM/PM)
   */
  format12Hour(time) {
    let hours = time.hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
    
    const hoursStr = String(hours).padStart(2, '0');
    const minutes = String(time.minutes).padStart(2, '0');
    const seconds = String(time.seconds).padStart(2, '0');
    
    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  }

  /**
   * Format date with year, month, and day
   * @param {Date} date - Date object
   * @returns {string} Formatted date string (YYYY-MM-DD)
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Export for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimeManager;
}
