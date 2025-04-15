import React, { useCallback, useEffect, useRef } from "react";

import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import { DeviceEventEmitter } from "react-native";



const MypageCoupon_W = (props:any) => {
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);

    const webviewUrl = `${BASE_URL}/mypage/coupon?isApp=app`;

    const handleOnMessage = async (e:any) => {
        const {type, value} = JSON.parse(e.nativeEvent.data);
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    // 이 페이지에서 홈화면 돌아가면 홈화면 데이터 및 피드 리프레시 되도록 설정
    useEffect(() => {
        return () => {
            // DeviceEventEmitter.emit('backFromHomeReload');
        }
    }, []);

    return (
        <SafeAreaView style={safeAreaView}>
            <WebView 
                ref={webViewRef}
                source={{uri: webviewUrl}}
                onMessage={handleOnMessage}
                textZoom={100}
            />
        </SafeAreaView>

    );
};

export default MypageCoupon_W;
