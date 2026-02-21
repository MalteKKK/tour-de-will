// Push notification client helpers

const VAPID_PUBLIC_KEY =
  "BAToW6RqF89Ly2SPqY7gYjklyzy4Cuvi6HH16ESx0JABWfee1f_FJLWltlDGqWv4R7qrUtb-XaMXTKNdL9DpXTI";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush(player: string): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send subscription to backend
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player, subscription }),
    });

    return true;
  } catch {
    return false;
  }
}

export function canUsePush(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function isPushGranted(): boolean {
  return "Notification" in window && Notification.permission === "granted";
}
