import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import { Alert, AppState, BackHandler, Linking, Platform, View } from "react-native";
import { CaptureProtection } from "react-native-capture-protection";
import Loader from "../assets/component_w/Loader";

import { AppOpenAd, InterstitialAd, RewardedAd, BannerAd, TestIds, useForeground, BannerAdSize, GAMBannerAd } from 'react-native-google-mobile-ads';
import { LineEEEEEE } from "../common/commonStyledComp";
import styled from "styled-components/native";
import { Animated} from 'react-native';
import analytics from '@react-native-firebase/analytics'
import { getAppAdminInfo } from "../common/fetchData";

import Tts from 'react-native-tts';

const os = Platform.OS;

  
const AdView = styled(Animated.createAnimatedComponent(View))`
   position:absolute; bottom:${os==='ios'?30:0}px; background-color: #ffffff;
`
const AdHidePress = styled.Pressable`
    position: absolute; top: -20px; right: 5px; width: 60px; height: 20px; align-items: center; justify-content: center; background-color: #FFF;
    border-width: 2px; border-color: #EEE; border-bottom-width: 0; border-top-left-radius: 8px; border-top-right-radius: 8px;
`
const AdHideImg = styled.Image`
    width: 20px; height: 20px;
   
`


const ReportContent_W = (props:any) => {
    const {pageName, seoTitle, postType} = props.route.params.param;
    const [isLoading, setIsLoading] = useState(true);

    const [isShowAd, setIsShowAd] = useState<any>(false);

    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/report/content?isApp=app&pageName=${pageName}&seoTitle=${seoTitle}&postType=${postType}`;

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
        if (!event.url.includes(BASE_URL) 
                && !event.url.includes('youtube.com') 
                && !event.url.includes('googleads.g') && !event.url.includes('ep2.adtrafficquality') && !event.url.includes('google.com/recaptcha') //구들 애드때문에발생하는 오류 방지
        ) {
                Linking.openURL(event.url);
            return false;
        }
        return true;
    };

    // 백그라운드 실행중 재실행시 오류 방지용 처리 
    // const handleAppStateChange = async (nextAppState:any) => {
    //     if(webViewRef!==null && webViewRef.current!==null){
    //         webViewRef.current.reload();
    //     }
    // };

    // useEffect(()=>{ 
    //     const listener = AppState.addEventListener('change', handleAppStateChange);
    //     return () => {
    //         listener.remove();
    //     };
    // },[]);



    async function getData(){
        let {showReportAd} = await getAppAdminInfo();
        setIsShowAd(showReportAd==1);
    }

    useEffect(()=>{
        getData();

        return () => {
            Tts.stop();
        }
    },[]);



    // 광고 애니메이션
    const animationPositionY:any = useRef(new Animated.Value(0)).current;
  
   useEffect(()=>{
        // if(!isShowAd){
        //     hideAd(); 
        //     setTimeout(hideAd, 500);
        //     setTimeout(hideAd, 1000);
        // }else{
        //     console.log('광고 보이기');
        //     // 리포트 뜨고 광고 보이기
        //     setTimeout(showAd, 100);
        //     setTimeout(showAd, 1500);

        //     // 광고 띄우고 70초 후 자동 숨기기
        //     setTimeout(hideAd, 1000*70);
        // }
        
        analytics().logScreenView({screen_class: `리포트 : ${pageName} - ${seoTitle}`, screen_name: pageName});
        analytics().setUserProperty('current_page', 'ReportContentRead');
        
   },[isShowAd])

   const showAd = () => {
        Animated.timing(animationPositionY, {
            toValue: Platform.OS ==='ios'?-20:0,
            duration:1000,
            useNativeDriver: true,
        }).start();
   }

   const hideAd = () => {
         Animated.timing(animationPositionY, {
            toValue: 3600,
            duration:1000,
            useNativeDriver: true,
        }).start();

        // RN에서 웹뷰로 데이터를 보낼 때 사용하는 함수입니다. 
        const sendData =JSON.stringify({   
            type:"hideAd",
            data:"hideAd",
        });
        webViewRef?.current?.postMessage(sendData);
   }



    let bannerUnitId = Platform.OS === 'ios' ?'ca-app-pub-5230413428612561/3682423894':'ca-app-pub-5230413428612561/7028542464';
    // bannerUnitId = Platform.OS === 'ios' ?'ca-app-pub-5230413428612561/1932671020':'ca-app-pub-5230413428612561/3661348378';
    // bannerUnitId = 'ca-app-pub-3940256099942544/9214589741'; //테스트 아이디
    const bannerRef = useRef<BannerAd>(null);

    useForeground(() => {
        Platform.OS === 'ios' && bannerRef.current?.load();
    });


    const handleAdLoaded = async () => {
        await analytics().logEvent('ad_impression', {
            page_name: `리포트 로딩: ${pageName} - ${seoTitle}`,
            ad_source: `리포트 로딩: ${pageName} - ${seoTitle}`,
            ad_type: 'banner',
        });

        await analytics().logEvent('page_name', {
            ad_source: `리포트 로딩: ${pageName} - ${seoTitle}`,
            ad_type: 'banner',
        });

        await analytics().logEvent('ad_interaction', {
            page: pageName,
            ad_type: 'banner',
            interaction: 'click',
        });
    };

    const handleAdOpened = async () => {
        await analytics().logEvent('ad_impression', {
            page_name: `리포트 오픈: ${pageName} - ${seoTitle}`,
            ad_source: `리포트 오픈: ${pageName} - ${seoTitle}`,
            ad_type: 'banner',
        });

        await analytics().logEvent('page_name', {
            ad_source: `리포트 오픈: ${pageName} - ${seoTitle}`,
            ad_type: 'banner',
        });

        await analytics().logEvent('ad_interaction', {
            page: pageName,
            ad_type: 'banner',
            interaction: 'click',
        });
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

                    allowsInlineMediaPlayback={true} // iOS에서 인라인 재생 가능하도록 설정
                    textZoom={100}
                />
                {isLoading && <Loader />}

                {isShowAd &&
                <>
                <LineEEEEEE />
                <AdView
                    style={[{ transform: [{ translateY: animationPositionY }] }]}
                >
                    <AdHidePress
                        onPress = {hideAd}
                    >
                        <AdHideImg source={require('../assets/icons_w/arrow_down_search.png')}/>
                    </AdHidePress>
                    <BannerAd 
                        ref={bannerRef} 
                        unitId={bannerUnitId} 
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} 
                        onAdLoaded={handleAdLoaded}
                        onAdOpened={handleAdOpened}
                    />
                </AdView>
                </>
                }
            </SafeAreaView>
    );
}

export default ReportContent_W;