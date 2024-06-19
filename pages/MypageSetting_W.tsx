import React, { useCallback, useEffect, useRef } from "react";

import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import { DeviceEventEmitter } from "react-native";



const MypageSetting_W = (props:any) => {
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);

    const webviewUrl = `${BASE_URL}/mypage/setting?isApp=app`;

    const handleOnMessage = async (e:any) => {
        const {type, value} = JSON.parse(e.nativeEvent.data);
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    useEffect(() => {
        return () => {
            DeviceEventEmitter.emit('backFromHomeReload');
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

export default MypageSetting_W;
