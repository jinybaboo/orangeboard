import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import {  decimalRound, getDday, thousandComma } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LineEEEEEE, OrangeBtnPress, OrangeBtnTxt, Space } from "../common/commonStyledComp";
import { Platform, Pressable } from "react-native";
import { getPayment_Faq, getPayment_ProductReportAndPort } from "../common/fetchData";

import { initConnection, requestSubscription, getSubscriptions, Sku, finishTransaction, purchaseErrorListener, purchaseUpdatedListener, type ProductPurchase, type PurchaseError, type SubscriptionPurchase, flushFailedPurchasesCachedAsPendingAndroid, getAvailablePurchases,} from 'react-native-iap';
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
    flex-direction: row; justify-content: center; padding-top:5px; align-items: center;
`
const PriceTxt1 = styled.Text`
    font-family: 'noto700';font-size: 24px; line-height:28px; color:#4C4C4C; text-align: center; 
`
const PriceTxt2 = styled.Text`
    font-family: 'noto500';font-size: 15px; line-height:19px; color:#999; text-align: center; 
`
const DiscountTxtBox = styled.View`
    flex-direction: row; align-items: center; justify-content: center; padding-top: 10px;
`
const DiscountTxt1 = styled.Text`
    font-family: 'noto700';font-size: 14px; line-height:18px; color:#FF7900;
`
const DiscountTxt2 = styled.Text`
     font-family: 'noto500';font-size: 14px; line-height:18px; color:#999; padding-left: 5px; text-decoration: line-through;
`
const CheckTxtBox = styled.View`
    flex-direction: row; align-items: center; justify-content: center; margin-bottom: 10px;
`
const CheckTxt = styled.Text`
    font-family: 'noto500';font-size: 14px; line-height:18px; color:#777; 
`
const CheckImg = styled.Image`
    width: 14px; height: 14px; margin-right: 3px;
`
const FaqBox = styled.View`
    width: 100%; height: 60px; border-bottom-width:1px; border-bottom-color: #EEE;
    flex-direction: row; align-items: center; justify-content: space-between; padding:0 5px;
`
const FaqTitle = styled.Text`
     font-family: 'noto500';font-size: 15px; line-height:22px; color:#333;
`
const Arrow = styled.Image`
    width: 20px; height: 20px;
`
const FaqContent = styled.Text`
    font-family: 'noto400';font-size: 15px; line-height:24px; color:#4C4C4C; padding:20px 7px;
`
export const Payment_N = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const [portList, setPortList] = useState<any>([]);

    
    const [isLoading, setIsLoading] = useState(true);

    const [portfolioIds, setPortfolioIds] = useState('');
    const [portfolioIdsIos, setPortfolioIdsIos] = useState('');

    const [nativeDataAndroid, setNativeDataAndroid] = useState<any>([]);
    const [nativeDataIos, setNativeDataIos] = useState<any>([]);

    const [isCurrentUser, setIsCurrentUser] = useState<any>(false);

    const [faq, setFaq] = useState<any>(null);
    const [openFaq, setOpenFaq] = useState<any>(null);

    function compareByPrice(a:any, b:any) {
        return a.appPrice - b.appPrice;
    }

    const getData = async () =>{
        const data = await getPayment_ProductReportAndPort();
        
        const portList = data.portfolioProductList;
        portList.sort(compareByPrice);
        setPortList(portList);

        const portfolioIds:any = portList.reduce((returnArr:any, item:any) =>{	
            
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

        const faqs = await getPayment_Faq();
        
        setFaq(faqs)

        setIsLoading(false);
    }
    

    useEffect(()=>{
        getData();
    }, []);


    useEffect(()=>{
        initIAP(); //초기화
    },[isLoading]);



    useEffect(() => {
        const clearStuckTransactions = async () => {
          try {
            const purchases = await getAvailablePurchases();
            console.log('🧾 정리 대상 purchases:');
            for (const p of purchases) {
              await finishTransaction({ purchase: p, isConsumable: false });
              console.log(`✅ 트랜잭션 정리 완료: ${p.productId}`);
            }
            console.log(`✅ 트랜잭션 정리 완료: Finished`);
          } catch (e) {
            console.warn('❌ 트랜잭션 정리 실패:', e);
          }
        };
        os === 'ios' && clearStuckTransactions();
    }, []);


    if(isLoading){
        return null;
    }

    console.log('faq', faq);
    

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


    if(isLoading){return null;}

    const chkTxt = ['운용 보고서 열람', '고수 실시간 계좌 공유', '고수톡 실시간 채팅 서비스 제공', '고수 활동 푸시알림 제공']
    
    return (
        <ScrollView>
            <StatusBar style='dark' />
            <Space height={10} />

            <TopTitle>이용권</TopTitle>
            <TopSubTitle>필요한 구독권을 합리적인 가격으로 이용해 보세요</TopSubTitle>
            
            <Space height={30} />

            {portList.map((item:any, idx:number)=>{
                 let {ProductOptionId, isTrialAvailable, SubscriptionInfo, appProductName, price, regularPrice, productName} = item;
                 const priceStr = thousandComma(price);
                 const regularPriceStr = thousandComma(regularPrice);
                 const discountRateStr = decimalRound((1- price/regularPrice)*100, 0)

                 const freeEndDd = SubscriptionInfo?.freeEndDd;
                 let dDay = freeEndDd===undefined?-1:getDday(freeEndDd);

                 let nativeInfo:any =[];

                 if(os==='android' && nativeDataAndroid.length!=0){
                     nativeInfo = nativeDataAndroid.filter( (item:any)=> {							
                         return item.productId == appProductName;
                     });
 
                     const androidTokenCount = nativeInfo[0]?.subscriptionOfferDetails.length;
                     nativeInfo = nativeInfo[0]?.subscriptionOfferDetails;
                     // console.log(androidTokenCount, nativeInfo)
 
                     if(androidTokenCount<2){
                         isTrialAvailable = false;
                     }
                 }



                return(
                    <Shadow
                        key = {'shadow_'+idx}		
                        startColor="rgba(0,0,0,0.05)"
                        endColor="rgba(255, 255, 255, 0.05)"
                        distance={8}
                        style={{width:'100%', backgroundColor:'#FFFFFF', borderRadius:12, marginBottom:20}}
                        offset={[0,3]}
                    >	
                        <ShadowInner>
                            <PersonImgBox>
                                <PersonImg source={require('../assets/icons_w/person.png')}/>
                               {ProductOptionId !== 'OBPG1' &&
                                <>
                                <PersonImg source={require('../assets/icons_w/person.png')}/>
                                <PersonImg source={require('../assets/icons_w/person.png')}/>
                                </>
                                }
                                {ProductOptionId === 'OBPG5' &&
                                <>
                                <PersonImg source={require('../assets/icons_w/person.png')}/>
                                <PersonImg source={require('../assets/icons_w/person.png')}/>
                                </>
                                }
                            </PersonImgBox>
                            <SubTxt1>{productName}</SubTxt1>

                            {ProductOptionId === 'OBPG1'?
                            <Space height={15}/>
                            :
                            <DiscountTxtBox>
                                <DiscountTxt1>{discountRateStr}%</DiscountTxt1>
                                <DiscountTxt2>{regularPriceStr}원</DiscountTxt2>
                            </DiscountTxtBox>
                            }

                            <PriceBox>
                                <PriceTxt1>{priceStr}원</PriceTxt1>
                                <PriceTxt2> / 월</PriceTxt2>
                            </PriceBox>

                            <Space height={20} />
                            <LineEEEEEE />
                            <Space height={20} />

                            {chkTxt.map((item:any, idx2:number)=>{
                                return(
                                    <CheckTxtBox key={'chk_'+idx2}>
                                        <CheckImg source={require('../assets/icons_w/check_orange.png')}/>
                                        <CheckTxt>{item}</CheckTxt>
                                    </CheckTxtBox>)
                                })
                            }

                                    {ProductOptionId === 'OBPG1'?
                                    <CheckTxtBox>
                                        <CheckImg source={require('../assets/icons_w/check_orange.png')}/>
                                        <CheckTxt>고수 변경횟수 없음</CheckTxt>
                                    </CheckTxtBox>
                                    :
                                    <CheckTxtBox>
                                        <CheckImg source={require('../assets/icons_w/check_orange.png')}/>
                                        <CheckTxt>고수 변경횟수 1회</CheckTxt>
                                    </CheckTxtBox>
                                    }

                            <Space height={10} />
                            <OrangeBtnPress 
                                onPress={()=>{
                                    checkNavigator(navigation, 'paymentSubscription_port' , {data:item, isCurrentUser})
                                }}
                                style={{height:48, lineHeight:48}}
                            >
                                <OrangeBtnTxt>구매하기</OrangeBtnTxt>
                            </OrangeBtnPress>

                            <Space height={10} />
                        </ShadowInner>
                    </Shadow>
                )
            })}


            <Space height={100} />

            <TopTitle>자주 묻는 질문</TopTitle>
            <TopSubTitle>자주 묻는 질문을 모아 정리했어요</TopSubTitle>

            <Space height={24} />

            {faq !== null && faq.map(({title, content}:any, idx:number)=>{
                return(
                    <Pressable 
                        key={'faq_'+idx}
                        onPress={()=>{openFaq === idx ? setOpenFaq(null) : setOpenFaq(idx)}}
                    >
                        <FaqBox>
                            <FaqTitle>Q. {title}</FaqTitle>
                            <Arrow source={idx===openFaq?
                                require(`../assets/icons_w/arrow_up_faq.png`)
                                :
                                require(`../assets/icons_w/arrow_down_faq.png`)
                            }/>
                        </FaqBox>
                        {idx === openFaq && <FaqContent>{content}</FaqContent>}
                    </Pressable>
                )
            })}
            <Space height={100} />
        </ScrollView>
    );
}









