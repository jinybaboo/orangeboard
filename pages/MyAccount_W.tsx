import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";
import { DeviceEventEmitter } from "react-native";

const MyAccount_W = (props:any) => {
    const type = props?.route?.params?.param?.type;
    const param = type == undefined ? '':`&type=${type}`

    const [isLoading, setIsLoading] = useState(true);
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/myAccount?isApp=app${param}`;



    // 이 페이지에서 돌아가면 마이어카운트 리프레시 되도록 설정
    useEffect(() => {
        return () => {
            DeviceEventEmitter.emit('reloadMyAccount');
        }
    }, []);

    useEffect(() => {
        DeviceEventEmitter.addListener('reloadMyAccount', () => {
            if(webViewRef!==null && webViewRef.current!==null){
                webViewRef.current.reload();
            }
        });
    }, [webViewRef]);

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }
    
    return (
        <SafeAreaView style={safeAreaView}>
            <WebView 
                ref={webViewRef}
                source={{uri: webviewUrl}}
                onMessage={handleOnMessage}
                onLoadEnd={handleLoadEnd}
                textZoom={100}
            />
            {isLoading && <Loader />}
        </SafeAreaView>
    );
}

export default MyAccount_W;