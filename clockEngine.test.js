import fc from 'fast-check';

// Mock classes for testing
class MockTimeManager {
  constructor() {
    this.callCount = 0;
    this.currentTime = { hours: 12, minutes: 0, seconds: 0, date: new Date() };
  }

  getCurrentTime() {
    this.callCount++;
    // Simulate time progression
    this.currentTime.seconds++;
    if (this.currentTime.seconds >= 60) {
      this.currentTime.seconds = 0;
      this.currentTime.minutes++;
    }
    return { ...this.currentTime };
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
    return '2024-01-15';
  }
}

class MockDisplayController {
  constructor() {
    this.timeDisplayValue = '';
    this.dateDisplayValue = '';
    this.currentFormat = '24h';
    this.updateCount = 0;
  }

  updateTimeDisplay(timeString) {
    this.timeDisplayValue = timeString;
    this.updateCount++;
  }

  updateDateDisplay(dateString) {
    this.dateDisplayValue = dateString;
  }

  setFormat(format) {
    this.currentFormat = format;
  }

  getFormat() {
    return this.currentFormat;
  }
}

// Import ClockEngine (in real environment)
class ClockEngine {
  constructor(timeManager, displayController) {
    this.timeManager = timeManager;
    this.displayController = displayController;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      return;
    }
    this.tick();
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
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

  getIsRunning() {
    return this.isRunning;
  }
}

describe('ClockEngine', () => {
  let timeManager;
  let displayController;
  let clockEngine;

  beforeEach(() => {
    timeManager = new MockTimeManager();
    displayController = new MockDisplayController();
    clockEngine = new ClockEngine(timeManager, displayController);
  });

  afterEach(() => {
    if (clockEngine.getIsRunning()) {
      clockEngine.stop();
    }
  });

  /**
   * Feature: web-clock, Property 1: Time display updates continuously
   * Validates: Requirements 1.2
   * 
   * For any running clock instance, consecutive time readings taken
   * approximately 1 second apart should show different time values,
   * demonstrating continuous updates.
   */
  describe('Property 1: Time display updates continuously', () => {
    it('should update display multiple times when running', (done) => {
      clockEngine.start();
      
      const initialValue = displayController.timeDisplayValue;
      const initialUpdateCount = displayController.updateCount;
      
      // Wait for multiple updates
      setTimeout(() => {
        clockEngine.stop();
        
        // Display should have been updated multiple times
        expect(displayController.updateCount).toBeGreaterThan(initialUpdateCount);
        
        // Time value should have changed
        expect(displayController.timeDisplayValue).not.toBe(initialValue);
        
        done();
      }, 2500); // Wait 2.5 seconds to see multiple updates
    }, 5000);

    it('should show different time values on consecutive ticks', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 10 }),
          (numTicks) => {
            const values = [];
            
            for (let i = 0; i < numTicks; i++) {
              clockEngine.tick();
              values.push(displayController.timeDisplayValue);
            }
            
            // At least some values should be different (time progresses)
            const uniqueValues = new Set(values);
            expect(uniqueValues.size).toBeGreaterThan(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

  /**
   * Unit tests for clock lifecycle
   * Requirements: 1.1, 1.4, 3.3
   */
  describe('Clock lifecycle', () => {
    it('should start on initialization', () => {
      clockEngine.start();
      expect(clockEngine.getIsRunning()).toBe(true);
    });

    it('should stop and clean up interval', () => {
      clockEngine.start();
      expect(clockEngine.getIsRunning()).toBe(true);
      
      clockEngine.stop();
      expect(clockEngine.getIsRunning()).toBe(false);
      expect(clockEngine.intervalId).toBe(null);
    });

    it('should not start multiple times', () => {
      clockEngine.start();
      const firstIntervalId = clockEngine.intervalId;
      
      clockEngine.start(); // Try to start again
      const secondIntervalId = clockEngine.intervalId;
      
      expect(firstIntervalId).toBe(secondIntervalId);
      
      clockEngine.stop();
    });

    it('should update display immediately on format toggle', () => {
      const initialFormat = displayController.getFormat();
      const initialValue = displayController.timeDisplayValue;
      
      clockEngine.tick(); // Set initial value
      const valueAfterTick = displayController.timeDisplayValue;
      
      clockEngine.toggleFormat();
      const valueAfterToggle = displayController.timeDisplayValue;
      
      // Format should have changed
      expect(displayController.getFormat()).not.toBe(initialFormat);
      
      // Display should have been updated
      expect(valueAfterToggle).not.toBe('');
    });

    it('should toggle between 12h and 24h formats', () => {
      displayController.setFormat('24h');
      expect(displayController.getFormat()).toBe('24h');
      
      clockEngine.toggleFormat();
      expect(displayController.getFormat()).toBe('12h');
      
      clockEngine.toggleFormat();
      expect(displayController.getFormat()).toBe('24h');
    });
  });
});
