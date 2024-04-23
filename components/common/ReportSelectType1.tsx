import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { changeDataTypeDot, decimalRound, getToday, getWindowWidth, setCurrentPage } from "../../common/commonFunc";
import { LineE2E2E2 } from "../../common/commonStyledComp";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store";
import { RootState } from "../../store/reducer";

const windowWidth = getWindowWidth();
const boxWidth = windowWidth -32;
const reportLeftWidth = boxWidth - 96;

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



const ReportSelectType1 = ({dataSet}:any)=>{

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    //현재 리포트페이지 버전 가져오기
    const goReportContent = (id:number) =>{
        dispatch(userSlice.actions.setReportId(id));
        setCurrentPage(dispatch, 'ReportContent');
        navigation.navigate("ReportContent" as never);
    }

    


    const date = changeDataTypeDot(dataSet.createdAt);
    const thumbnail = dataSet.thumbnail;
    const defaultThumb = '../../assets/images/defaultThumb.png';

    let isPremium = dataSet.premium;
    let rateOfReturn = dataSet.rateOfReturn==null?dataSet.rateOfReturn:decimalRound(dataSet.rateOfReturn, 1);
    
    let isPremiumBoxExist = false;
    if(isPremium || rateOfReturn!=null){isPremiumBoxExist=true;}
    
    const endTime = dataSet.endTime==null?0:dataSet.endTime.replace('/','');
    const today = getToday().substring(0,7).replace('-','');
    const isReportFinish = endTime>=today?false:true;

    return (
    <Pressable onPress={()=>{goReportContent(dataSet.id)}}>
        <ReportContentBox>
            <ReportContentLeft>
                <ReportContentTitle>{dataSet.title}</ReportContentTitle>
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
               thumbnail==null?<ReportThumbImg source={require(defaultThumb)}></ReportThumbImg>
               : <ReportThumbImg source={{uri:thumbnail}}></ReportThumbImg>
            }
            
        </ReportContentBox>
        <LineE2E2E2 />
    </Pressable>
    )
}

export default ReportSelectType1;