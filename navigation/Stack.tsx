import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, BackHandler, Image, Linking, Platform, Pressable, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";

import { useAppDispatch } from "../store";



// 웹뷰  파트
import Home_W from "../pages/Home_W";
import Login_N from "../pages/Login_N";
import Mypage_W from "../pages/Mypage_W";
import MypageSetting_W from "../pages/MypageSetting_W";
import Report_W from "../pages/Report_W";
import ReportPreview_W from "../pages/ReportPreview_W";
import ReportBuy_W from "../pages/ReportBuy_W";
import ReportContent_W from "../pages/ReportContent_W";
import ReportReply_W from "../pages/ReportReply_W";
import PortrolioIssueTalkList_W from "../pages/PortrolioIssueTalkList_W";
import { PortfolioIssueTalk_N } from "../pages/PortfolioIssueTalk_N";
import Portfolio_W from "../pages/Portfolio_W";
import PortfolioOwner_W from "../pages/PortfolioOwner_W";
import PortfolioContent_W from "../pages/PortfolioContent_W";
import Analysis_W from "../pages/Analysis_W";
import AnalysisCreators_W from "../pages/AnalysisCreator_W";
import AnalysisCreatorInfo_W from "../pages/AnalysisCreatorInfo_W";
import AnalysisRequest_W from "../pages/AnalysisRequest_W";
import AnalysisResult_W from "../pages/AnalysisResult_W";
import AnalysisMyRequestDetail_W from "../pages/AnalysisMyRequestDetail_W";
import AnalysisMyRequest_W from "../pages/AnalysisMyRequest_W";
import AnalysisWriteReview_W from "../pages/AnalysisWriteReview_W";
import AnalysisOnRequestList_W from "../pages/AnalysisOnRequestList_W";
import AnalysisReviewList_W from "../pages/AnalysisReviewList_W";
import AnalysisPublishedList_W from "../pages/AnalysisPublishedList_W";
import Creator_W from "../pages/Creator_W";
import CreatorProfile_W from "../pages/CreatorProfile_W";
import MypageOrangeManage_W from "../pages/MypageOrangeManage_W";
import MypageFavoriteList_W from "../pages/MypageFavoriteList_W";
import MypageSubscriptionManage_W from "../pages/MypageSubscriptionManage_W";
import MypageMyReport_W from "../pages/MypageMyReport_W";
import MypageMyVirtualAccount_W from "../pages/MypageMyVirtualAccount_W";
import MypageAlarm_W from "../pages/MypageAlarm_W";
import MypageMyVaContent_W from "../pages/MypageMyVaContent_W";
import MypageAlertSetting_W from "../pages/MypageAlertSetting_W";
import MypageNotice_W from "../pages/MypageNotice_W";
import MypageNoticeContent_W from "../pages/MypageNoticeContent_W";
import Market_W from "../pages/Market_W";
import ReportList_W from "../pages/ReportList_W";
import PortfolioList_W from "../pages/PortfolioList_W";
import Policy_W from "../pages/Policy_W";
import Join_W from "../pages/Join_W";
import Payment_W from "../pages/Payment_W";
import PaymentSubPort_W from "../pages/PaymentSubPort_W";
import PaymentSubReport_W from "../pages/PaymentSubReport_W";
import PaymentOrangeBuy_W from "../pages/PaymentOrangeBuy_W";
import { Payment_N } from "../pages/Payment_N";
import { PaymentSubPort_N } from "../pages/PaymentSubPort_N";
import { PaymentSubReport_N } from "../pages/PaymentSubReport_N";
import EtcInvite_W from "../pages/EtcInvite_W";
import Intro_W from "../pages/Intro_W";
import IntroUserGuide_W from "../pages/IntroUserGuide_W";
import IntroCreatorGuide_W from "../pages/IntroCreatorGuide_W";
import IntroReport_W from "../pages/IntroReport_W";
import IntroGosu_W from "../pages/IntroGosu_W";
import IntroAnalysis_W from "../pages/IntroAnalysis_W";
import { checkNavigator } from "../common/navigator_w";
import styled from "styled-components/native";
import colors from "../common/commonColors";
import Farm_W from "../pages/Farm_W";
import FarmOwner_W from "../pages/FarmOwner_W";
import Search_W from "../pages/Search_W";
import SearchResult_W from "../pages/SearchResult_W";


// 페이지 이동을 위한 네이게이터 생성 및 제작
const NativeStack = createNativeStackNavigator();

const PortPress = styled.Pressable`
    width: 60px; height: 30px; align-items: center; justify-content: center; border-width:1px; border-radius: 8px; border-color: ${colors.orangeBorder};
`
const HeaderTxt = styled.Text`
     font-family: 'noto500'; font-size: 12px; line-height:15px; color: ${colors.orangeBorder}; padding-top: 2px;
`


//네비게이터 스크린의 네임을, 향후 props에서 navigate 함수를 이용하여 페이지 이동시에 사용한다!!!!!
const Stack = () =>{
    const navigation:any = useNavigation();

    useEffect(()=>{
        const androidBackAction = () =>{
            backAction();
            return true;
        }
        //안드로이드 백버튼 누를때 처리
        const backHandler = BackHandler.addEventListener('hardwareBackPress', androidBackAction);
        return () => {backHandler.remove();}
    });

    
    const backAction = ()=>{
        if(navigation.canGoBack()){
            navigation.goBack();

        }else{
            Alert.alert("종료", "앱을 종료 하시겠습니까?", [
                {
                    text: "취소",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "확인", onPress: () => BackHandler.exitApp() }
            ]);
        }
    }

    function goPortDirect(pageName:string){
        checkNavigator(navigation, 'portfolioOwner' , {pageName})
    }


    return (
        <NativeStack.Navigator 
            initialRouteName="Home_W"

            screenOptions={{
                headerTintColor:"#000000",
                headerTitleAlign:"center",
                headerBackTitleVisible:false,
                headerTitleStyle:{
                    fontSize:18,
                    fontFamily:'noto500',
                },
                gestureEnabled: false,  // 이곳에 False 설정시 모든 페이지의 화면에 대해 제스쳐를 금지한다.(IOS 슬라이드로 뒤로가기 포함)
                
                headerLeft:()=>(
                    // <Pressable onPress={()=>{navigation.goBack()}}>
                    <Pressable onPress={backAction} style={{width:50, height:40}}>
                        <Image source={require('../assets/icons_w/backArrow.png')} style={{width:16,height:20,marginTop:10}}/>
                    </Pressable>
                ),

                headerRight:()=>{
                    const naviData = navigation.getCurrentRoute()

                    if(naviData?.name === 'PortrolioIssueTalk_N'){
                        return(
                            <PortPress onPress={()=>{goPortDirect(naviData?.params?.param?.pageName)}}>
                                <HeaderTxt>계좌보기</HeaderTxt>
                            </PortPress>
                        )
                    }else{
                        return <></>
                    }
                }
            }}
        >
        {/* 웹뷰 파트  */}
        <NativeStack.Screen 
            name="Home_W"
            component={Home_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Login_N"
            component={Login_N}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Mypage_W"
            component={Mypage_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageSetting_W"
            component={MypageSetting_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />


        {/* 리포트 */}
        <NativeStack.Screen 
            name="Report_W"
            component={Report_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="ReportList_W"
            component={ReportList_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="ReportPreview_W"
            component={ReportPreview_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="ReportBuy_W"
            component={ReportBuy_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="ReportContent_W"
            component={ReportContent_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="ReportReply_W"
            component={ReportReply_W}
            options={{
                headerShown:false,
                 animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PortrolioIssueTalkList_W"
            component={PortrolioIssueTalkList_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />

        {/* 고수의계좌 */}
        <NativeStack.Screen 
            name="Portfolio_W"
            component={Portfolio_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PortfolioList_W"
            component={PortfolioList_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PortrolioIssueTalk_N"
            component={PortfolioIssueTalk_N}
            options={{
                headerShown:true,
                animation:"slide_from_right",
                headerTitle:'',
                headerShadowVisible:false,
            }}
        />
        <NativeStack.Screen 
            name="PortfolioOwner_W"
            component={PortfolioOwner_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PortfolioContent_W"
            component={PortfolioContent_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />

        {/* 기업분석 */}
         <NativeStack.Screen 
            name="Analysis_W"
            component={Analysis_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisCreators_W"
            component={AnalysisCreators_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisCreatorInfo_W"
            component={AnalysisCreatorInfo_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisRequest_W"
            component={AnalysisRequest_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisResult_W"
            component={AnalysisResult_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisMyRequest_W"
            component={AnalysisMyRequest_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisMyRequestDetail_W"
            component={AnalysisMyRequestDetail_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisWriteReview_W"
            component={AnalysisWriteReview_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisOnRequestList_W"
            component={AnalysisOnRequestList_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisPublishedList_W"
            component={AnalysisPublishedList_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="AnalysisReviewList_W"
            component={AnalysisReviewList_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />


        {/* 크리에이터 */}
        <NativeStack.Screen 
            name="Creator_W"
            component={Creator_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="CreatorProfile_W"
            component={CreatorProfile_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageOrangeManage_W"
            component={MypageOrangeManage_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageFavoriteList_W"
            component={MypageFavoriteList_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageSubscriptionManage_W"
            component={MypageSubscriptionManage_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageMyReport_W"
            component={MypageMyReport_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageMyVirtualAccount_W"
            component={MypageMyVirtualAccount_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageMyVaContent_W"
            component={MypageMyVaContent_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageAlarm_W"
            component={MypageAlarm_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageAlertSetting_W"
            component={MypageAlertSetting_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageNotice_W"
            component={MypageNotice_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="MypageNoticeContent_W"
            component={MypageNoticeContent_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Market_W"
            component={Market_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />


        {/* 결제 파트  */}
        <NativeStack.Screen 
            name="Payment_W"
            component={Payment_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Payment_N"
            component={Payment_N}
            options={{
                headerShown:true,
                headerTitle:'충전 · 구독권',
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PaymentOrangeBuy_W"
            component={PaymentOrangeBuy_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PaymentSubReport_W"
            component={PaymentSubReport_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PaymentSubReport_N"
            component={PaymentSubReport_N}
            options={{
                headerShown:true,
                headerTitle:'리포트 구독',
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PaymentSubPort_W"
            component={PaymentSubPort_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="PaymentSubPort_N"
            component={PaymentSubPort_N}
            options={{
                headerShown:true,
                headerTitle:'고수의계좌 구독',
                animation:"slide_from_right",
            }}
        />


        {/* 기타 파트  */}
        <NativeStack.Screen 
            name="Policy_W"
            component={Policy_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Join_W"
            component={Join_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="EtcInvite_W"
            component={EtcInvite_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Intro_W"
            component={Intro_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="IntroUserGuide_W"
            component={IntroUserGuide_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="IntroCreatorGuide_W"
            component={IntroCreatorGuide_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="IntroReport_W"
            component={IntroReport_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="IntroGosu_W"
            component={IntroGosu_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="IntroAnalysis_W"
            component={IntroAnalysis_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Farm_W"
            component={Farm_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="FarmOwner_W"
            component={FarmOwner_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="Search_W"
            component={Search_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
        <NativeStack.Screen 
            name="SearchResult_W"
            component={SearchResult_W}
            options={{
                headerShown:false,
                animation:"slide_from_right",
            }}
        />
    </NativeStack.Navigator>
        
        
    )
}

export default Stack;