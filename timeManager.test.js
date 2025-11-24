import fc from 'fast-check';
import TimeManager from './timeManager.js';

describe('TimeManager', () => {
  let timeManager;

  beforeEach(() => {
    timeManager = new TimeManager();
  });

  /**
   * Feature: web-clock, Property 3: Leading zero formatting
   * Validates: Requirements 2.3
   * 
   * For any time value with single-digit hours, minutes, or seconds,
   * the formatted output should include leading zeros for those components.
   */
  describe('Property 3: Leading zero formatting', () => {
    it('should format single-digit time components with leading zeros in 24-hour format', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            const formatted = timeManager.format24Hour(time);
            
            // Check that all components are 2 digits
            const parts = formatted.split(':');
            expect(parts).toHaveLength(3);
            expect(parts[0]).toHaveLength(2);
            expect(parts[1]).toHaveLength(2);
            expect(parts[2]).toHaveLength(2);
            
            // Verify leading zeros for single-digit values
            if (hours < 10) {
              expect(parts[0]).toMatch(/^0\d$/);
            }
            if (minutes < 10) {
              expect(parts[1]).toMatch(/^0\d$/);
            }
            if (seconds < 10) {
              expect(parts[2]).toMatch(/^0\d$/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should format single-digit time components with leading zeros in 12-hour format', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            const formatted = timeManager.format12Hour(time);
            
            // Extract time part (before AM/PM)
            const timePart = formatted.split(' ')[0];
            const parts = timePart.split(':');
            
            expect(parts).toHaveLength(3);
            expect(parts[0]).toHaveLength(2);
            expect(parts[1]).toHaveLength(2);
            expect(parts[2]).toHaveLength(2);
            
            // Verify leading zeros for single-digit values
            if (minutes < 10) {
              expect(parts[1]).toMatch(/^0\d$/);
            }
            if (seconds < 10) {
              expect(parts[2]).toMatch(/^0\d$/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

  /**
   * Feature: web-clock, Property 4: 12-hour format includes AM/PM
   * Validates: Requirements 3.1
   * 
   * For any time value formatted in 12-hour mode,
   * the output string should contain either "AM" or "PM" indicator.
   */
  describe('Property 4: 12-hour format includes AM/PM', () => {
    it('should include AM or PM indicator for any time', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            const formatted = timeManager.format12Hour(time);
            
            // Must contain either AM or PM
            expect(formatted).toMatch(/\s(AM|PM)$/);
            
            // Verify correct AM/PM based on hours
            if (hours < 12) {
              expect(formatted).toContain('AM');
            } else {
              expect(formatted).toContain('PM');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: web-clock, Property 5: 24-hour format uses valid range
   * Validates: Requirements 3.2
   * 
   * For any time value formatted in 24-hour mode,
   * the hours component should be in the range 0-23.
   */
  describe('Property 5: 24-hour format uses valid range', () => {
    it('should display hours in 0-23 range for 24-hour format', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            const formatted = timeManager.format24Hour(time);
            
            // Extract hours from formatted string
            const hoursStr = formatted.split(':')[0];
            const parsedHours = parseInt(hoursStr, 10);
            
            // Hours should be in valid range
            expect(parsedHours).toBeGreaterThanOrEqual(0);
            expect(parsedHours).toBeLessThanOrEqual(23);
            
            // Should match the input hours
            expect(parsedHours).toBe(hours);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: web-clock, Property 6: Format conversion preserves time
   * Validates: Requirements 3.3
   * 
   * For any time value, converting from 12-hour to 24-hour format and back
   * should preserve the same underlying time (round-trip property).
   */
  describe('Property 6: Format conversion preserves time', () => {
    it('should preserve time value when converting between formats', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            
            // Format in both ways
            const format24 = timeManager.format24Hour(time);
            const format12 = timeManager.format12Hour(time);
            
            // Parse back the 24-hour format
            const [h24, m24, s24] = format24.split(':').map(s => parseInt(s, 10));
            
            // Parse back the 12-hour format
            const [timePart, ampm] = format12.split(' ');
            const [h12, m12, s12] = timePart.split(':').map(s => parseInt(s, 10));
            
            // Convert 12-hour back to 24-hour
            let h12to24 = h12;
            if (ampm === 'AM' && h12 === 12) {
              h12to24 = 0;
            } else if (ampm === 'PM' && h12 !== 12) {
              h12to24 = h12 + 12;
            }
            
            // Both should represent the same time
            expect(h24).toBe(hours);
            expect(m24).toBe(minutes);
            expect(s24).toBe(seconds);
            
            expect(h12to24).toBe(hours);
            expect(m12).toBe(minutes);
            expect(s12).toBe(seconds);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: web-clock, Property 2: Time display contains all components
   * Validates: Requirements 1.3
   * 
   * For any time value, the formatted time display string should contain
   * hours, minutes, and seconds components.
   */
  describe('Property 2: Time display contains all components', () => {
    it('should include hours, minutes, and seconds in 24-hour format', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            const formatted = timeManager.format24Hour(time);
            
            // Should have exactly 3 components separated by colons
            const parts = formatted.split(':');
            expect(parts).toHaveLength(3);
            
            // Each part should be a valid number
            parts.forEach(part => {
              expect(part).toMatch(/^\d{2}$/);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include hours, minutes, and seconds in 12-hour format', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          fc.integer({ min: 0, max: 59 }),
          (hours, minutes, seconds) => {
            const time = { hours, minutes, seconds, date: new Date() };
            const formatted = timeManager.format12Hour(time);
            
            // Extract time part (before AM/PM)
            const timePart = formatted.split(' ')[0];
            const parts = timePart.split(':');
            
            // Should have exactly 3 components separated by colons
            expect(parts).toHaveLength(3);
            
            // Each part should be a valid number
            parts.forEach(part => {
              expect(part).toMatch(/^\d{2}$/);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: web-clock, Property 8: Date display contains all components
   * Validates: Requirements 4.2
   * 
   * For any date value, the formatted date display should contain
   * year, month, and day components.
   */
  describe('Property 8: Date display contains all components', () => {
    it('should include year, month, and day in formatted date', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1970, max: 2100 }),
          fc.integer({ min: 0, max: 11 }),
          fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
          (year, month, day) => {
            const date = new Date(year, month, day);
            const formatted = timeManager.formatDate(date);
            
            // Should match YYYY-MM-DD format
            expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            // Parse components
            const [y, m, d] = formatted.split('-').map(s => parseInt(s, 10));
            
            // Verify components match
            expect(y).toBe(year);
            expect(m).toBe(month + 1); // Month is 0-indexed in Date
            expect(d).toBe(day);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Unit tests for edge cases
   * Requirements: 3.1, 3.2
   */
  describe('Edge case: Midnight (00:00:00)', () => {
    it('should format midnight correctly in 24-hour format', () => {
      const time = { hours: 0, minutes: 0, seconds: 0, date: new Date() };
      const formatted = timeManager.format24Hour(time);
      expect(formatted).toBe('00:00:00');
    });

    it('should format midnight correctly in 12-hour format', () => {
      const time = { hours: 0, minutes: 0, seconds: 0, date: new Date() };
      const formatted = timeManager.format12Hour(time);
      expect(formatted).toBe('12:00:00 AM');
    });
  });

  describe('Edge case: Noon (12:00:00)', () => {
    it('should format noon correctly in 24-hour format', () => {
      const time = { hours: 12, minutes: 0, seconds: 0, date: new Date() };
      const formatted = timeManager.format24Hour(time);
      expect(formatted).toBe('12:00:00');
    });

    it('should format noon correctly in 12-hour format', () => {
      const time = { hours: 12, minutes: 0, seconds: 0, date: new Date() };
      const formatted = timeManager.format12Hour(time);
      expect(formatted).toBe('12:00:00 PM');
    });
  });

  describe('Edge case: Boundary times', () => {
    it('should format 23:59:59 correctly in 24-hour format', () => {
      const time = { hours: 23, minutes: 59, seconds: 59, date: new Date() };
      const formatted = timeManager.format24Hour(time);
      expect(formatted).toBe('23:59:59');
    });

    it('should format 23:59:59 correctly in 12-hour format', () => {
      const time = { hours: 23, minutes: 59, seconds: 59, date: new Date() };
      const formatted = timeManager.format12Hour(time);
      expect(formatted).toBe('11:59:59 PM');
    });

    it('should format 00:00:01 correctly in 24-hour format', () => {
      const time = { hours: 0, minutes: 0, seconds: 1, date: new Date() };
      const formatted = timeManager.format24Hour(time);
      expect(formatted).toBe('00:00:01');
    });

    it('should format 00:00:01 correctly in 12-hour format', () => {
      const time = { hours: 0, minutes: 0, seconds: 1, date: new Date() };
      const formatted = timeManager.format12Hour(time);
      expect(formatted).toBe('12:00:01 AM');
    });
  });
});
