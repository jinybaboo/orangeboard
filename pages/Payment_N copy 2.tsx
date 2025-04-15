import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import {  decimalRound, getDday, thousandComma } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import colors from "../common/commonColors";
import { LineEEEEEE, Space } from "../common/commonStyledComp";
import { Alert, Platform, Pressable } from "react-native";
import { getPayment_ProductReportAndPort } from "../common/fetchData";

import { initConnection, requestSubscription, getSubscriptions, Sku, finishTransaction, purchaseErrorListener, purchaseUpdatedListener, type ProductPurchase, type PurchaseError, type SubscriptionPurchase, flushFailedPurchasesCachedAsPendingAndroid,} from 'react-native-iap';
import { checkNavigator } from "../common/navigator_w";

import { Shadow } from 'react-native-shadow-2';

const os = Platform.OS;

const ScrollView = styled.ScrollView`
    flex:1; background-color: #FFFFFF; padding: 22px 20px; 
`

const TopTitle = styled.Text`
    font-family: 'noto700';font-size: 32px; line-height:36px; color:#4C4C4C; text-align: center;
`

const TopSubTitle = styled.Text`
    font-family: 'noto500';font-size: 14px; line-height:18px; color:#777; text-align: center; margin-top: 10px;
`
const ShadowInner = styled.View`
    width: 100%; padding: 25px 25px 20px;
    border-width: 1px; border-color: #EEE; border-radius: 12px;

`
const PersonImgBox = styled.View`
    flex-direction: row; justify-content: center;
`
const PersonImg = styled.Image`
    width: 20px; height: 20px;
`
const SubTxt1 = styled.Text`
    font-family: 'noto500';font-size: 16px; line-height:20px; color:#4C4C4C; text-align: center; margin-top: 8px;
`
const PriceBox = styled.View`
    flex-direction: row; justify-content: center; padding-top: 25px; align-items: center;
`
const PriceTxt1 = styled.Text`
    font-family: 'noto700';font-size: 24px; line-height:28px; color:#4C4C4C; text-align: center; 
`
const PriceTxt2 = styled.Text`
    font-family: 'noto500';font-size: 15px; line-height:19px; color:#999; text-align: center; 
`

export const Payment_N = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    // const [reportList, setReportList] = useState<any>([]);
    const [portList, setPortList] = useState<any>([]);

    const [selectedReport, setSelectedReport] = useState('');
    const [selectedReportData, setSelectedReportData] = useState('');


    const [selectedPort, setSelectedPort] = useState('');
    const [selectedPortData, setSelectedPortData] = useState<any>();

    const [selectedPortAll, setSelectedPortAll] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);

    const [portfolioIds, setPortfolioIds] = useState('');
    const [portfolioIdsIos, setPortfolioIdsIos] = useState('');

    const [nativeDataAndroid, setNativeDataAndroid] = useState<any>([]);
    const [nativeDataIos, setNativeDataIos] = useState<any>([]);

    const [isCurrentUser, setIsCurrentUser] = useState<any>(false);


    function compareByPrice(a:any, b:any) {
        return a.appPrice - b.appPrice;
    }

    const getData = async () =>{
        const data = await getPayment_ProductReportAndPort();
        // setReportList(data.reportProductList);
        // console.log(data);
        
        
        const portList = data.portfolioProductList;
        portList.sort(compareByPrice);
        setPortList(portList);

        const portfolioIds:any = portList.reduce((returnArr:any, item:any) =>{	
            console.log(item.isCurSubscriptionProduct);
            
            item.isCurSubscriptionProduct && setIsCurrentUser(true);

            if( item.appProductName != ''){
                returnArr.push(item.appProductName)
            }							
            return returnArr;							
        },[]);	
        
        setPortfolioIds(portfolioIds);

        const portfolioIdsIos:any = portList.reduce((returnArr:any, item:any) =>{	
            if( item.appProductNameIOS != ''){
                returnArr.push(item.appProductNameIOS)
            }							
            return returnArr;							
        },[]);	
        setPortfolioIdsIos(portfolioIdsIos)


        setIsLoading(false);
    }
    

    useEffect(()=>{
        
        getData();
    }, []);


    useEffect(()=>{
        initIAP(); //초기화
    },[isLoading]);


    if(isLoading){
        return null;
    }

    

    const skus:any = Platform.select({
        ios: portfolioIdsIos,
        android: portfolioIds,
    });

    const getItems = async () => {
        try {
            const items:any = await getSubscriptions({skus});

            if(os==='android'){
                setNativeDataAndroid(items);
            }else{
                setNativeDataIos(items);
            }
            
        } catch(error) {
            console.log('get item error: ', error); 
        }
    }

    async function initIAP() {
        try {
            if(!isLoading){
                getItems();
                const init = await initConnection();
            }
           
        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }


    const checkBuyReport = () =>{
        if(selectedReport==='' || !selectedReport.includes('OBR')){
            Alert.alert('안내','구독할 리포트를 선택해 주세요.');
            return;
        }else{
            checkNavigator(navigation, 'paymentSubscription_report' , {data:selectedReportData})
        }
    }

    const checkBuyPortfolio = () =>{
        if(selectedPort==='' || !selectedPort.includes('OBP')){
            Alert.alert('안내','구독할 이용권을 선택해 주세요.');
            return;
        }else{
            checkNavigator(navigation, 'paymentSubscription_port' , {data:selectedPortData, isCurrentUser})
        }
    }

    const checkBuyPortfolioAll = () =>{
        if(selectedPortAll==='' || !selectedPortAll.includes('OBP')){
            Alert.alert('안내','전체 고수의계좌를 선택해 주세요.');
            return;
        }else{
            checkNavigator(navigation, 'paymentSubscription_port' , {data:selectedPortData})
        }
    }

    if(isLoading){return null;}
    
    return (
        <ScrollView>
            <StatusBar style='dark' />
            <Space height={10} />

            <TopTitle>이용권</TopTitle>
            <TopSubTitle>필요한 구독권을 합리적인 가격으로 이용해 보세요</TopSubTitle>
            
            <Space height={30} />
            <Shadow		
                startColor="rgba(0,0,0,0.05)"
                endColor="rgba(255, 255, 255, 0.05)"
                distance={8}
                style={{width:'100%', backgroundColor:'#FFFFFF', borderRadius:12}}
                offset={[0,3]}
            >	
                <ShadowInner>
                    <PersonImgBox>
                        <PersonImg source={require('../assets/icons_w/person.png')}/>
                        <PersonImg source={require('../assets/icons_w/person.png')}/>
                        <PersonImg source={require('../assets/icons_w/person.png')}/>
                    </PersonImgBox>
                    <SubTxt1>고수 1명 구독</SubTxt1>

                    <PriceBox>
                        <PriceTxt1>30,000원</PriceTxt1>
                        <PriceTxt2> / 월</PriceTxt2>
                    </PriceBox>
                    <Space height={20} />

                    
                </ShadowInner>
            </Shadow>

            <Space height={30} />



        </ScrollView>
    );
}









