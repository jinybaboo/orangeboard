import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import colors from "../../common/commonColors";
import { changeDataTypeDot, decimalRound, getToday, getWindowWidth, setCurrentPage } from "../../common/commonFunc";
import { CompanyInfoTitle, LineE2E2E2, SeeMoreBtn } from "../../common/commonStyledComp";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store";


const windowWidth = getWindowWidth();
const boxWidth = windowWidth -32;
const reportLeftWidth = boxWidth - 96;

const ReportView = styled.View`
  padding:40px 16px 32px 16px;
`

// const ReportContentBox = styled.View`
//     width:${boxWidth}px;
//     height: 72px;
//     margin-bottom: 28px;
//     flex-direction: row;
// `

const ReportContentBox = styled.View`
    width:${boxWidth}px;
    flex-direction: row;
    padding-top: 16px;
    padding-bottom: 16px;
`

const ReportContentLeft = styled.View`
    width:${reportLeftWidth}px;
`
const ReportContentTitle = styled.Text`
    font-family: 'noto400';
    font-size: 16px;
    line-height:23px;
    color:#000000;
    padding-right:10px;
`
const ReportContentDate = styled.Text`
    font-family: 'noto400';
    font-size: 14px;
    line-height:17px;
    color:#999999;
    margin-top: 4px;
`

const ReportThumbImg = styled.Image`
    width:96px;
    height:72px;
    
`

// 프리미엄 추가
const PremiumBox = styled.View`
    width:100%;
    height:20px;
    margin-top: 16px;
    flex-direction: row;
`
const PremiumImage = styled.Image`
    width:53px;
    height:20px;
    margin-right:8px;
`
const RateBox = styled.View`
    border:1px solid #FF3333;   
    padding:2px 4px 0;
    height:20px;
    border-radius:2px;

`
const RateTxt = styled.Text`
    font-family: 'noto700';
    font-size: 12px;
    line-height:15.5px;
    color:#FF3333;
`
const RateBoxFinal = styled(RateBox)`
    background-color:#FF3333;
`
const RateTxtFinal = styled(RateTxt)`
    color:#FFFFFF;
`



const CompanyInfoReport = (props:any) =>{
    const [isYear, setIsYear] = useState(true);

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const goReportInfoMore = (stockCode:string) =>{
        dispatch(userSlice.actions.setReportStockCode(stockCode));
        setCurrentPage(dispatch,'ReportInfoMore');
        navigation.navigate("ReportInfoMore" as never);
    }

    const goReportContent = (id:number) =>{
        dispatch(userSlice.actions.setReportId(id));
        setCurrentPage(dispatch,'ReportContent');
        navigation.navigate("ReportContent" as never);
    }
   
    const {dataSet} = props;
    //console.log(dataSet);
    const stockCode = dataSet[0]?.Corp?.stockCode;
    //console.log('stockCode',stockCode)
    
    return(
        <ReportView>
            <CompanyInfoTitle style={{marginBottom:24}}>리포트</CompanyInfoTitle>
            {
                dataSet.map((item:any, idx:number)=>{
                    const thumbnail = item.thumbnail;
                    const date = changeDataTypeDot(item.createdAt)

                    const defaultThumb = '../../assets/images/defaultThumb.png';

                    const isPremium = item.premium;
                    let rateOfReturn = item.rateOfReturn==null?item.rateOfReturn:decimalRound(item.rateOfReturn, 1);
                    
                    let isPremiumBoxExist = false;
                    if(isPremium || rateOfReturn!=null){isPremiumBoxExist=true;}
            
                    const endTime = item.endTime==null?0:item.endTime.replace('/','');
                    const today = getToday().substring(0,7).replace('-','');
                    const isReportFinish = endTime>=today?false:true;
            



                    return(
                        <Pressable  key={idx} onPress={()=>{goReportContent(item.id)}}>
                        {idx!=0&&<LineE2E2E2 />}
                        <ReportContentBox>
                            <ReportContentLeft>
                                <ReportContentTitle numberOfLines={2}>{item.title}</ReportContentTitle>
                                <ReportContentDate>{date}</ReportContentDate>

                                {isPremiumBoxExist && 
                                <PremiumBox>
                                    {isPremium && <PremiumImage source={require('../../assets/icons/premium.png')}/>}

                                    {rateOfReturn==null?'':
                                    isReportFinish?
                                    <RateBoxFinal style={rateOfReturn<0&&{borderColor:'#0066FF', backgroundColor:'#0066FF'}}>
                                        <RateTxtFinal>최종수익률 {rateOfReturn}%</RateTxtFinal>
                                    </RateBoxFinal>
                                    :
                                    <RateBox style={rateOfReturn<0&&{borderColor:'#0066FF'}}>
                                        <RateTxt style={rateOfReturn<0&&{color:'#0066FF'}}>수익률 {rateOfReturn}%</RateTxt>
                                    </RateBox>
                                    }
                                </PremiumBox>
                                }
                            </ReportContentLeft>
                            {
                            thumbnail==null?<ReportThumbImg source={require(defaultThumb)} ></ReportThumbImg>
                            :<ReportThumbImg source={{uri : thumbnail}} ></ReportThumbImg>
                            }
                        </ReportContentBox>
                        </Pressable>
                    )
                })    
            }
            <LineE2E2E2 />

            <TouchableOpacity style={{marginTop:32}} onPress={()=>{goReportInfoMore(stockCode)}}>
                <SeeMoreBtn>더보기</SeeMoreBtn>
            </TouchableOpacity>
        </ReportView>
    )
}

export default CompanyInfoReport