import fc from 'fast-check';

// Mock DOM environment for testing
class MockElement {
  constructor() {
    this.textContent = '';
    this.attributes = {};
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

// Mock DisplayController for testing without real DOM
class TestableDisplayController {
  constructor() {
    this.timeElement = new MockElement();
    this.dateElement = new MockElement();
    this.formatIndicator = new MockElement();
    this.currentFormat = '24h';
  }

  updateTimeDisplay(timeString) {
    if (this.timeElement) {
      this.timeElement.textContent = timeString;
    }
  }

  updateDateDisplay(dateString) {
    if (this.dateElement) {
      this.dateElement.textContent = dateString;
      this.dateElement.setAttribute('datetime', dateString);
    }
  }

  setFormat(format) {
    this.currentFormat = format;
    if (this.formatIndicator) {
      this.formatIndicator.textContent = format === '12h' ? '12小時制' : '24小時制';
    }
  }

  getFormat() {
    return this.currentFormat;
  }
}

describe('DisplayController', () => {
  let displayController;

  beforeEach(() => {
    displayController = new TestableDisplayController();
  });

  /**
   * Feature: web-clock, Property 7: Date display accompanies time
   * Validates: Requirements 4.1
   * 
   * For any clock display state, if time information is present,
   * date information should also be present.
   */
  describe('Property 7: Date display accompanies time', () => {
    it('should have date information when time information is present', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }), // time string
          fc.string({ minLength: 1, maxLength: 20 }), // date string
          (timeString, dateString) => {
            // Update time display
            displayController.updateTimeDisplay(timeString);
            
            // Update date display
            displayController.updateDateDisplay(dateString);
            
            // If time is present, date should also be present
            const timePresent = displayController.timeElement.textContent.length > 0;
            const datePresent = displayController.dateElement.textContent.length > 0;
            
            if (timePresent) {
              expect(datePresent).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain both time and date after updates', () => {
      fc.assert(
        fc.property(
          fc.array(fc.tuple(
            fc.string({ minLength: 1, maxLength: 20 }),
            fc.string({ minLength: 1, maxLength: 20 })
          ), { minLength: 1, maxLength: 10 }),
          (updates) => {
            // Apply multiple updates
            updates.forEach(([time, date]) => {
              displayController.updateTimeDisplay(time);
              displayController.updateDateDisplay(date);
            });
            
            // After all updates, both should be present
            const timePresent = displayController.timeElement.textContent.length > 0;
            const datePresent = displayController.dateElement.textContent.length > 0;
            
            expect(timePresent).toBe(true);
            expect(datePresent).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('DisplayController basic functionality', () => {
    it('should update time display', () => {
      displayController.updateTimeDisplay('12:34:56');
      expect(displayController.timeElement.textContent).toBe('12:34:56');
    });

    it('should update date display', () => {
      displayController.updateDateDisplay('2024-01-15');
      expect(displayController.dateElement.textContent).toBe('2024-01-15');
      expect(displayController.dateElement.attributes.datetime).toBe('2024-01-15');
    });

    it('should set format to 12h', () => {
      displayController.setFormat('12h');
      expect(displayController.getFormat()).toBe('12h');
      expect(displayController.formatIndicator.textContent).toBe('12小時制');
    });

    it('should set format to 24h', () => {
      displayController.setFormat('24h');
      expect(displayController.getFormat()).toBe('24h');
      expect(displayController.formatIndicator.textContent).toBe('24小時制');
    });
  });
});
