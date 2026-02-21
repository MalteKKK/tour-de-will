// Tour de Will – Service Worker for Push Notifications

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Tour de Will";
  const options = {
    body: data.body || "Es gibt Neuigkeiten!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: data.url || "/countdown" },
    vibrate: [100, 50, 100],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/countdown";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes("/countdown") && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
