// Immediate service worker cleanup script
// This runs before the React app loads to ensure SW is disabled ASAP

(function() {
  'use strict';
  
  const DEBUG = true;
  const log = DEBUG ? console.log.bind(console, '[SW Cleanup]') : () => {};
  
  // Check if we should disable service workers
  const shouldDisable = true; // Set to false to re-enable service workers
  
  if (!shouldDisable) {
    log('Service worker cleanup disabled');
    return;
  }
  
  if ('serviceWorker' in navigator) {
    // Prevent any new registrations
    const originalRegister = navigator.serviceWorker.register;
    navigator.serviceWorker.register = function() {
      log('Blocked service worker registration attempt');
      return Promise.reject(new Error('Service worker registration is disabled'));
    };
    
    // Unregister existing service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      log('Found', registrations.length, 'service worker(s)');
      
      registrations.forEach(function(registration) {
        registration.unregister().then(function(success) {
          log('Unregistered SW:', registration.scope, '- Success:', success);
        });
      });
    }).catch(function(error) {
      console.error('[SW Cleanup] Error getting registrations:', error);
    });
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        log('Found', cacheNames.length, 'cache(s)');
        
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName).then(function() {
              log('Deleted cache:', cacheName);
            });
          })
        );
      }).catch(function(error) {
        console.error('[SW Cleanup] Error clearing caches:', error);
      });
    }
  }
})();