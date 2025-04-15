import React, { useCallback, useEffect, useRef } from "react";

import { useState } from "react";
import WebView from "react-native-webview";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";

import { AppOpenAd, InterstitialAd, RewardedAd, BannerAd, TestIds, useForeground, BannerAdSize, GAMBannerAd } from 'react-native-google-mobile-ads';


const ReportList_W = (props:any) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/report/list?isApp=app`;
    // const webviewUrl = `https://webview-api-for-ads-test.glitch.me/`;
    // const webviewUrl = 'https://orangeboard.co.kr/@postman/test/%EB%B8%8C%EB%9E%9C%EB%93%9C%EC%97%91%EC%8A%A4%EC%BD%94%ED%8D%BC%EB%A0%88%EC%9D%B4%EC%85%98-%EB%A3%B0%EB%A3%A8%EB%A0%88%EB%AA%AC%EC%9D%B4-%EC%8B%9C%EC%9E%A5%EC%9D%84-%EB%9A%AB%EA%B3%A0-%EC%A0%9D%EC%8B%9C%EB%AF%B9%EC%8A%A4%EA%B0%80-%EB%93%A4%EC%96%B4%EA%B0%84%EB%8B%A42';

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }

     // 구글 애즈 광고 클릭시 ios 새창 열리도록 처리 1
    const onNavigationStateChange = (navState:any) => {
        webViewRef.canGoBack = navState.canGoBack;
        if (!navState.url.includes(BASE_URL)

            && !navState.url.includes('orangeboard') 
            && !navState.url.includes('webview-api') 
            && !navState.url.includes('check') 
            && !navState.url.includes('google') 

        ) {
            Linking.openURL(navState.url); // 새 탭 열기
            return false;
        }
    };

    // 웹뷰에서 a태그 링크시 새창으로 열리게 처리 2
    // 이 함수를 작동시키지 않으면 stopLoading() 문제로 인해 안드로이드에서 소스페이지의 다른 링크를 탭할 수 없습니다. 그래서 stopLoading를 방지하기 위해 아래 함수를 실행합니다.
    const onShouldStartLoadWithRequest = (event:any) => {
        if (!event.url.includes(BASE_URL)

                && !event.url.includes('orangeboard') 
                && !event.url.includes('webview-api') 
                && !event.url.includes('check') 
                && !event.url.includes('google') 

                && !event.url.includes('youtube.com') 
                && !event.url.includes('googleads.g') && !event.url.includes('ep2.adtrafficquality') && !event.url.includes('google.com/recaptcha') //구들 애드때문에발생하는 오류 방지
        ){
                Linking.openURL(event.url);
            return false;
        }
        return true;
    };

    // App Open
    AppOpenAd.createForAdRequest(TestIds.APP_OPEN);

    // Interstitial
    InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

    // Rewarded
    RewardedAd.createForAdRequest(TestIds.REWARDED);

    const bannerRef = useRef<BannerAd>(null);
    useForeground(() => {
        Platform.OS === 'ios' && bannerRef.current?.load();
    });

    const adUnitId = Platform.OS === 'ios' ? 'ca-app-pub-5230413428612561~5119327329' : 'ca-app-pub-5230413428612561~3068152123';

    const bannerUnitId = Platform.OS === 'ios' ?'ca-app-pub-5230413428612561/3682423894':'ca-app-pub-5230413428612561/7028542464';
    
    return (
        <SafeAreaView style={safeAreaView}>
            <WebView 
                originWhitelist={['*']}
                ref={webViewRef}
                source={{uri: webviewUrl}}
                onMessage={handleOnMessage}
                onLoadEnd={handleLoadEnd}
                textZoom={100}

                //구글애즈용 설정
                androidLayerType='software'
                allowsInlineMediaPlayback={true} // iOS에서 인라인 재생 가능하도록 설정
                sharedCookiesEnabled={true} // ios 서드파트쿠키허용
                useWebKit={true} // ios 서드파트쿠키허용
                javaScriptEnabled={true}
                domStorageEnabled={true}

                // 웹뷰 로딩이 시작되거나 끝나면 호출하는 함수 navState로 url 감지
                onNavigationStateChange={onNavigationStateChange}
                // 처음 호출한 URL에서 다시 Redirect하는 경우에, 사용하면 navState url 감지
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}

            />
            {isLoading && <Loader />}
        </SafeAreaView>
    );
}

export default ReportList_W;