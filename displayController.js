/**
 * DisplayController - Manages DOM updates for clock display
 */
class DisplayController {
  constructor() {
    this.timeElement = document.getElementById('timeValue');
    this.dateElement = document.getElementById('dateValue');
    this.formatIndicator = document.getElementById('formatIndicator');
    this.currentFormat = '24h';
  }

  /**
   * Update the time display element
   * @param {string} timeString - Formatted time string
   */
  updateTimeDisplay(timeString) {
    if (this.timeElement) {
      this.timeElement.textContent = timeString;
    }
  }

  /**
   * Update the date display element
   * @param {string} dateString - Formatted date string
   */
  updateDateDisplay(dateString) {
    if (this.dateElement) {
      this.dateElement.textContent = dateString;
      this.dateElement.setAttribute('datetime', dateString);
    }
  }

  /**
   * Set the time format and update indicator
   * @param {'12h' | '24h'} format - Time format to use
   */
  setFormat(format) {
    this.currentFormat = format;
    if (this.formatIndicator) {
      this.formatIndicator.textContent = format === '12h' ? '12小時制' : '24小時制';
    }
  }

  /**
   * Get the current format
   * @returns {'12h' | '24h'} Current time format
   */
  getFormat() {
    return this.currentFormat;
  }
}

// Export for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DisplayController;
}
