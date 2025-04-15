import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import App from './App';

import notifee, { AndroidImportance, AndroidPriority } from '@notifee/react-native';
import { Platform } from 'react-native';


// 알림 ID를 저장하는 배열
let notificationQueue = [];
const MAX_NOTIFICATIONS = 13;


// 알림 표시 함수
async function displayNotification(remoteMessage) {
    // console.log(remoteMessage.notification);
    // requestNotificationPermission();

    const { notification } = remoteMessage;
    if (!notification) return;

    const notificationId = Date.now().toString(); // 고유 ID 생성

    // Android 알림 채널 설정
    if (Platform.OS === 'android') {
        console.log(Platform.OS, notificationId);

        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

         // 알림 생성
        await notifee.displayNotification({
            id: notificationId,
            title: '***'+notification.title,
            body: '***'+notification.body,
            android: {
                channelId: 'default',
                importance: AndroidImportance.HIGH, // 높은 중요도
            },
        });


        // const currentNotifications = await notifee.getDisplayedNotifications();
        // console.log(currentNotifications);
        

        // 알림 ID를 관리하고 오래된 알림 삭제
        notificationQueue.push(notificationId);
        if (notificationQueue.length > MAX_NOTIFICATIONS) {
            //삭제 발동
            const oldestNotificationId = notificationQueue.shift(); // 가장 오래된 ID 제거
            console.log('삭제 발동', oldestNotificationId);

            await notifee.cancelNotification(oldestNotificationId); // 해당 ID의 알림 삭제
        }
        console.log('알람 발송 끝');
        console.log(notificationQueue);
    }
}


async function requestNotificationPermission() {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus === 0) {
        console.log('Notification permissions not granted.');
        return false;
    }
    return true;
}


// Foreground 및 Background 상태에서 알림 수신 처리
// messaging().onMessage(async (remoteMessage) => {
//     console.log(Platform.OS, 'onMessage');
//     await displayNotification(remoteMessage);
// });

// // 앱 실행 중이 아닐 때 알림 수신 처리
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log(Platform.OS, 'setBackgroundMessageHandler');
//     await displayNotification(remoteMessage);
// });




// 알림 초기화 (앱 시작 시 호출)
async function clearAllNotifications() {
    await notifee.cancelAllNotifications(); // 모든 알림 삭제
    notificationQueue = []; // 큐 초기화
}

// 예: 앱 초기화 시 호출
// clearAllNotifications();


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
