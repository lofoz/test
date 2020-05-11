importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-analytics.js');

workbox.clientsClaim();
workbox.skipWaiting();

workbox.precaching.precacheAndRoute([{
		"url": "logo/icon-above-font72.png",
		"revision": "71593e9e2fc1f65dd4be0816ed7ffa3a"
	},
	{
		"url": "logo/logo192.png",
		"revision": "10127221394fc9ba163584231f429606"
	},
	{
		"url": "logo/logo512.png",
		"revision": "124bd49edc7a3d4dbbf7d3e63ee329de"
	},
	{
		"url": "logo/logo72.png",
		"revision": "a25317040fb07f57915e06eca09f41f4"
	}
]);

var click_action; // 點擊notifiction要去的網址

// firefox bug：在 firebase 掌控所有 notifiction 前，先註冊一個 notificationclick 事件
// 監聽notifiction點擊事件
self.addEventListener('notificationclick', function(event) {
	var url = click_action;
	event.notification.close();
	event.waitUntil(
		clients.matchAll({
			type: 'window'
		}).then(windowClients => {
			// 如果tab是開著的，就 focus 這個tab
			for (var i = 0; i < windowClients.length; i++) {
				var client = windowClients[i];
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			// 如果沒有，就新增tab
			if (clients.openWindow) {
				return clients.openWindow(click_action);
			}
		})
	);
});

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyCtte_Qa-Z05-RKafjk20soTTOzNTfROsg",
	authDomain: "test-b9dff.firebaseapp.com",
	databaseURL: "https://test-b9dff.firebaseio.com",
	projectId: "test-b9dff",
	storageBucket: "test-b9dff.appspot.com",
	messagingSenderId: "785104352132",
	appId: "1:785104352132:web:ea5fd9719a878e841063d1",
	measurementId: "G-5RGL2VXEP3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	var data = payload.data;
	var title = data.title;
	var options = {
		body: data.body,
		icon: '/logo/logo192.png',
		badge: '/logo/logo192.png'
	};
	click_action = data.click_action;

	return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclose', function(event) {
	console.log('使用者關閉')
});
