import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { decimalRound, getWindowWidth } from "../../common/commonFunc";



const windowWidth = getWindowWidth();
const boxWidth = windowWidth -32;
const financeContentWidth = (boxWidth /2) -4;


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
    font-family: 'noto400';
    font-size: 16px;
    line-height:19px;
    color:#777777;
`

const FinanceContentTxt2 = styled.Text`
    font-family: 'noto700';
    font-size: 18px;
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



const CompanyInfoFinanceInfoInner= (props:any) =>{
    const [isYear, setIsYear] = useState(true);
    
    const {quarter, year} = props?.dataSet?.ifrs;
    const [usingData, setUsingData] = useState(year);

    useEffect(()=>{
        if(isYear){
            setUsingData(year);
      }else{
            setUsingData(quarter);
        }
    },[isYear])

    const operIncomeMargin = decimalRound(usingData?.operIncomeMargin, 1);
    const gpA = decimalRound(usingData?.gpA, 1);
    const roe = decimalRound(usingData?.roe, 1);
    const roa = decimalRound(usingData?.roa, 1);
    const roic = decimalRound(usingData?.roic, 1);
    const assTurnOver = decimalRound(usingData?.assTurnOver, 1);
    const curRatio = decimalRound(usingData?.curRatio, 1);
    const liaRatio = decimalRound(usingData?.liaRatio, 1);
    const date = usingData?.date.replace("-",".").substr(0,7);

    return(
        <View>
            <YearQtrBtnBox>
              <TouchableOpacity onPress={()=>{setIsYear(true)}}>
              <YearQtrBtnTxtBox>
                  {isYear && <YearQtrBtnInderline/>}
                  <YearQtrBtnTxt style={isYear?{color:"#000000"}:{color:"#999999"}}>연간</YearQtrBtnTxt>
              </YearQtrBtnTxtBox>
              </TouchableOpacity>

              <YearQtrBtnTxt> · </YearQtrBtnTxt>

              <TouchableOpacity onPress={()=>{setIsYear(false)}}>
              <YearQtrBtnTxtBox>
                  {!isYear && <YearQtrBtnInderline/>}
                  <YearQtrBtnTxt style={!isYear?{color:"#000000"}:{color:"#999999"}}>분기</YearQtrBtnTxt>
              </YearQtrBtnTxtBox>
              </TouchableOpacity>
          </YearQtrBtnBox>

          <FinanceContentWrap>
                <FinanceContentBox>
                    <FinanceContentTxt1>영업이익률</FinanceContentTxt1>
                    <FinanceContentTxt2>{operIncomeMargin}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>GP/A</FinanceContentTxt1>
                    <FinanceContentTxt2>{gpA}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>ROE</FinanceContentTxt1>
                    <FinanceContentTxt2>{roe}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>ROA</FinanceContentTxt1>
                    <FinanceContentTxt2>{roa}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>ROIC</FinanceContentTxt1>
                    <FinanceContentTxt2>{roic}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>자산회전률</FinanceContentTxt1>
                    <FinanceContentTxt2>{assTurnOver}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>부채비율</FinanceContentTxt1>
                    <FinanceContentTxt2>{liaRatio}%</FinanceContentTxt2>
                </FinanceContentBox>
                <FinanceContentBox>
                    <FinanceContentTxt1>유동비율</FinanceContentTxt1>
                    <FinanceContentTxt2>{curRatio}%</FinanceContentTxt2>
                </FinanceContentBox>
            </FinanceContentWrap>


            <FinanceBottomTxt1>재무정보는 {date} 기준 수치 입니다.</FinanceBottomTxt1>

        </View>
    )
}

export default CompanyInfoFinanceInfoInner;