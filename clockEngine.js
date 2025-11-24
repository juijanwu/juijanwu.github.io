/**
 * ClockEngine - Coordinates clock updates and manages the update cycle
 */
class ClockEngine {
  /**
   * @param {TimeManager} timeManager - Time management instance
   * @param {DisplayController} displayController - Display management instance
   */
  constructor(timeManager, displayController) {
    this.timeManager = timeManager;
    this.displayController = displayController;
    this.intervalId = null;
    this.isRunning = false;
  }

  /**
   * Start the clock update cycle
   */
  start() {
    if (this.isRunning) {
      return;
    }

    // Initial update
    this.tick();

    // Set up interval for continuous updates
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    this.isRunning = true;
  }

  /**
   * Stop the clock and clean up interval
   */
  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Update the display with current time
   */
  tick() {
    const timeData = this.timeManager.getCurrentTime();
    const format = this.displayController.getFormat();

    // Format time based on current format setting
    const timeString = format === '12h' 
      ? this.timeManager.format12Hour(timeData)
      : this.timeManager.format24Hour(timeData);

    // Format date
    const dateString = this.timeManager.formatDate(timeData.date);

    // Update display
    this.displayController.updateTimeDisplay(timeString);
    this.displayController.updateDateDisplay(dateString);
  }

  /**
   * Toggle between 12-hour and 24-hour format
   */
  toggleFormat() {
    const currentFormat = this.displayController.getFormat();
    const newFormat = currentFormat === '12h' ? '24h' : '12h';
    this.displayController.setFormat(newFormat);
    
    // Immediately update display with new format
    this.tick();
  }

  /**
   * Check if clock is running
   * @returns {boolean} True if clock is running
   */
  getIsRunning() {
    return this.isRunning;
  }
}

// Export for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClockEngine;
}
