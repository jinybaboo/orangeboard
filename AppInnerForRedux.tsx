import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import * as Font from 'expo-font';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Stack from './navigation/Stack';
import { useAppDispatch } from "./store";
import { setCurrentPage } from './common/commonFunc';
import BottomTab from './components/webviewComp/BottomTab';
import { Animated} from 'react-native';
import PushAlertInner from './assets/component_w/PushAlertInner';


// 페이지 이동을 위한 네이게이터 생성 및 제작
const NativeStack = createNativeStackNavigator();


function AppInnerForRedux(){
    const [isAppReady, setAppReady] = useState(false);
    const animationPositionY = useRef(new Animated.Value(0)).current;

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();

    async function prepare(){
        //'SANJUGotgam': 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2112@1.0/SANJUGotgam.woff', //woff는 ios만 지원, ttf는 둘다 지원
        let customFonts = {
            'noto300': require('./assets/fonts/NotoSansKR_300Light.ttf'),
            'noto400': require('./assets/fonts/NotoSansKR_400Regular.ttf'),
            'noto500': require('./assets/fonts/NotoSansKR_500Medium.ttf'),
            'noto700': require('./assets/fonts/NotoSansKR_700Bold.ttf'),
            'noto900': require('./assets/fonts/NotoSansKR_900Black.ttf'),
        };

        try {
            await Font.loadAsync(customFonts);    
            setAppReady(true);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        //현재 페이지 정보 저장하기 
        setCurrentPage(dispatch, 'Home');
        prepare();

    },[]);


    if(!isAppReady){return null;}
    return (
        <NavigationContainer>
            <Stack /> 
            {/* <BottomTab /> */}
            <PushAlertInner 
                animationPositionY = {animationPositionY}
            />
        </NavigationContainer>
    )
}

export default AppInnerForRedux;

