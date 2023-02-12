export function clearServiceWorker() {
  try {
    navigator.serviceWorker?.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  } catch (e) {
    console.error(e);
  }
}
