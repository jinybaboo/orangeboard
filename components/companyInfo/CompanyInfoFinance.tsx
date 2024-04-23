import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import colors from "../../common/commonColors";
import { getWindowWidth, setCurrentPage } from "../../common/commonFunc";
import { CompanyInfoTitle, SeeMoreBtn } from "../../common/commonStyledComp";
import { useAppDispatch } from "../../store";
import CompanyInfoFinanceInfoInner from "./CompanyInfoFinanceInfoInner";


const windowWidth = getWindowWidth();
const boxWidth = windowWidth -32;
const financeContentWidth = (boxWidth /2) -4;

const FinanceInfoView = styled.View`
  padding:40px 16px 32px 16px;
`

const YearQtrBtnBox = styled.View`
    flex-direction: row;
    margin-top: 18px;
    justify-content: flex-end;
`

const YearQtrBtnTxt = styled.Text`
    font-family: 'noto700';
    font-size: 16px;
    line-height:19px;
    color:#000000;
`
const YearQtrBtnTxtBox = styled.View`
    position:relative;
`

const YearQtrBtnInderline = styled.View`
    width:30px;
    height:5px;
    background-color: #FF7900;
    position:absolute;
    bottom:2px;
`

const FinanceContentWrap = styled.View`
    width:${boxWidth}px;
    margin-top: 20px;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`

const FinanceContentBox = styled.View`
    width:${financeContentWidth}px;
    height: 112px;
    background-color: #F6F6F6;
    border-radius: 4px;
    margin-bottom: 8px;
    padding:28px 0 0 20px;
`

const FinanceContentTxt1 = styled.Text`
    font-family: 'noto500';
    font-size: 16px;
    line-height:19px;
    color:#777777;
`

const FinanceContentTxt2 = styled.Text`
    font-family: 'noto700';
    font-size: 20px;
    line-height:23px;
    color:#000000;
    margin-top: 7px;
`

const FinanceBottomTxt1 = styled.Text`
    font-family: 'noto400';
    font-size: 12px;
    line-height:15px;
    color:#777777;
    margin-top: 17px;
`


const CompanyInfoFinanceInfo = (props:any) =>{
    const [isYear, setIsYear] = useState(true);

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const {dataSet} = props;
    

    const goFinanceInfoMore = () =>{
        setCurrentPage(dispatch,'FinanceInfoMore');
        navigation.navigate("FinanceInfoMore" as never);
    }
   
  

    return(
        <FinanceInfoView>
            <CompanyInfoTitle>재무 정보</CompanyInfoTitle>
            <CompanyInfoFinanceInfoInner dataSet={dataSet}/>

            <TouchableOpacity style={{marginTop:44}} onPress={goFinanceInfoMore}>
                <SeeMoreBtn>더보기</SeeMoreBtn>
            </TouchableOpacity>
        </FinanceInfoView>
    )
}

export default CompanyInfoFinanceInfo;