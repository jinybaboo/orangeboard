import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import { Linking } from "react-native";
import { CaptureProtection } from "react-native-capture-protection";
import Loader from "../assets/component_w/Loader";

const ReportContent_W = (props:any) => {
    const {pageName, seoTitle} = props.route.params.param;
    const [isLoading, setIsLoading] = useState(true);

    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/report/content?isApp=app&pageName=${pageName}&seoTitle=${seoTitle}`;




    function handleLoadEnd(){
        setIsLoading(false);
    }


    useEffect(()=>{
        //캡쳐 방지
        CaptureProtection.preventScreenRecord();
        CaptureProtection.preventScreenshot();
    },[])

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    // 웹뷰에서 a태그 링크시 새창으로 열리게 처리 1
    const onNavigationStateChange = (navState:any) => {
        webViewRef.canGoBack = navState.canGoBack;
        if (!navState.url.includes(BASE_URL)) {
            // 새 탭 열기
            Linking.openURL(navState.url);
            return false;
        }
    };


    // 웹뷰에서 a태그 링크시 새창으로 열리게 처리 2
    // 이 함수를 작동시키지 않으면 stopLoading() 문제로 인해 안드로이드에서 소스페이지의 다른 링크를 탭할 수 없습니다. 그래서 stopLoading를 방지하기 위해 아래 함수를 실행합니다.
    const onShouldStartLoadWithRequest = (event:any) => {
        if (!event.url.includes(BASE_URL) && !event.url.includes('youtube.com')) {
                Linking.openURL(event.url);
            return false;
        }
        return true;
    };

    
    return (
            <SafeAreaView style={safeAreaView}>
                <WebView 
                    ref={webViewRef}
                    source={{uri: webviewUrl}}
                    onMessage={handleOnMessage}
                    onLoadEnd={handleLoadEnd}
                    // 웹뷰 로딩이 시작되거나 끝나면 호출하는 함수 navState로 url 감지
                    onNavigationStateChange={onNavigationStateChange}
                    // 처음 호출한 URL에서 다시 Redirect하는 경우에, 사용하면 navState url 감지
                    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}

                    textZoom={100}
                />
                {isLoading && <Loader />}
            </SafeAreaView>
    );
}

export default ReportContent_W;