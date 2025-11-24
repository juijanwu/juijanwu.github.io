/**
 * Application initialization
 * Sets up and starts the clock when the page loads
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  const timeManager = new TimeManager();
  const displayController = new DisplayController();
  const clockEngine = new ClockEngine(timeManager, displayController);

  // Start the clock automatically
  clockEngine.start();

  // Set up format toggle button
  const toggleButton = document.getElementById('formatToggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      clockEngine.toggleFormat();
      
      // Update ARIA attributes
      const currentFormat = displayController.getFormat();
      const isPressed = currentFormat === '12h';
      toggleButton.setAttribute('aria-pressed', isPressed.toString());
      toggleButton.setAttribute('aria-label', 
        `切換時間格式，當前為${currentFormat === '12h' ? '12' : '24'}小時制`
      );
    });

    // Keyboard accessibility - Enter and Space keys
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleButton.click();
      }
    });
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clockEngine.stop();
  });
});
