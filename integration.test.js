/**
 * Integration tests for format switching
 * Requirements: 3.3
 */

// Mock classes for integration testing
class MockTimeManager {
  getCurrentTime() {
    return {
      hours: 14,
      minutes: 30,
      seconds: 45,
      date: new Date(2024, 0, 15)
    };
  }

  format24Hour(time) {
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  }

  format12Hour(time) {
    let hours = time.hours % 12;
    hours = hours === 0 ? 12 : hours;
    const ampm = time.hours >= 12 ? 'PM' : 'AM';
    return `${String(hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')} ${ampm}`;
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

class MockDisplayController {
  constructor() {
    this.timeDisplayValue = '';
    this.dateDisplayValue = '';
    this.currentFormat = '24h';
    this.formatIndicatorValue = '24小時制';
  }

  updateTimeDisplay(timeString) {
    this.timeDisplayValue = timeString;
  }

  updateDateDisplay(dateString) {
    this.dateDisplayValue = dateString;
  }

  setFormat(format) {
    this.currentFormat = format;
    this.formatIndicatorValue = format === '12h' ? '12小時制' : '24小時制';
  }

  getFormat() {
    return this.currentFormat;
  }
}

class ClockEngine {
  constructor(timeManager, displayController) {
    this.timeManager = timeManager;
    this.displayController = displayController;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.tick();
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.isRunning = true;
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  tick() {
    const timeData = this.timeManager.getCurrentTime();
    const format = this.displayController.getFormat();
    const timeString = format === '12h' 
      ? this.timeManager.format12Hour(timeData)
      : this.timeManager.format24Hour(timeData);
    const dateString = this.timeManager.formatDate(timeData.date);
    this.displayController.updateTimeDisplay(timeString);
    this.displayController.updateDateDisplay(dateString);
  }

  toggleFormat() {
    const currentFormat = this.displayController.getFormat();
    const newFormat = currentFormat === '12h' ? '24h' : '12h';
    this.displayController.setFormat(newFormat);
    this.tick();
  }
}

describe('Integration: Format Switching', () => {
  let timeManager;
  let displayController;
  let clockEngine;

  beforeEach(() => {
    timeManager = new MockTimeManager();
    displayController = new MockDisplayController();
    clockEngine = new ClockEngine(timeManager, displayController);
  });

  afterEach(() => {
    if (clockEngine.isRunning) {
      clockEngine.stop();
    }
  });

  /**
   * Test clicking toggle button switches format
   * Requirements: 3.3
   */
  it('should switch format when toggle is triggered', () => {
    // Initial state - 24h
    expect(displayController.getFormat()).toBe('24h');
    
    // Simulate button click
    clockEngine.toggleFormat();
    
    // Should switch to 12h
    expect(displayController.getFormat()).toBe('12h');
    expect(displayController.formatIndicatorValue).toBe('12小時制');
  });

  /**
   * Test display updates immediately after toggle
   * Requirements: 3.3
   */
  it('should update display immediately after format toggle', () => {
    // Set initial display
    clockEngine.tick();
    const initial24hDisplay = displayController.timeDisplayValue;
    expect(initial24hDisplay).toBe('14:30:45');
    
    // Toggle to 12h
    clockEngine.toggleFormat();
    const new12hDisplay = displayController.timeDisplayValue;
    
    // Display should be updated immediately
    expect(new12hDisplay).toBe('02:30:45 PM');
    expect(new12hDisplay).not.toBe(initial24hDisplay);
  });

  /**
   * Test format persists across multiple toggles
   * Requirements: 3.3
   */
  it('should persist format across multiple toggles', () => {
    const formats = [];
    const displays = [];
    
    // Toggle multiple times and record state
    for (let i = 0; i < 5; i++) {
      clockEngine.toggleFormat();
      formats.push(displayController.getFormat());
      displays.push(displayController.timeDisplayValue);
    }
    
    // Formats should alternate
    expect(formats[0]).toBe('12h');
    expect(formats[1]).toBe('24h');
    expect(formats[2]).toBe('12h');
    expect(formats[3]).toBe('24h');
    expect(formats[4]).toBe('12h');
    
    // Displays should match formats
    expect(displays[0]).toContain('PM'); // 12h format
    expect(displays[1]).not.toContain('PM'); // 24h format
    expect(displays[2]).toContain('PM'); // 12h format
  });

  it('should maintain correct time value across format changes', () => {
    clockEngine.tick();
    
    // Toggle to 12h
    clockEngine.toggleFormat();
    const time12h = displayController.timeDisplayValue;
    
    // Toggle back to 24h
    clockEngine.toggleFormat();
    const time24h = displayController.timeDisplayValue;
    
    // Both should represent the same time (14:30:45 / 02:30:45 PM)
    expect(time24h).toBe('14:30:45');
    expect(time12h).toBe('02:30:45 PM');
  });

  it('should update both time and date on format toggle', () => {
    clockEngine.toggleFormat();
    
    // Both time and date should be present
    expect(displayController.timeDisplayValue).not.toBe('');
    expect(displayController.dateDisplayValue).not.toBe('');
    expect(displayController.dateDisplayValue).toBe('2024-01-15');
  });
});
