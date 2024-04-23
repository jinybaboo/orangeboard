import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import styled from "styled-components/native";
import colors from "../../common/commonColors";
import { changeDataTypeMMDashDD, getMax, getMin, getStockPriceCut, getWindowWidth, thousandComma } from "../../common/commonFunc";

import {LineChart} from "react-native-chart-kit";
import { getFinanceInfoSimple, getStockPriceHistory } from "../../common/commonData";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import { useAppDispatch } from "../../store";
import { useNavigation } from "@react-navigation/native";

const windowWidth = getWindowWidth();
const tpChartWidth = windowWidth - 32;

const OutView = styled.View`

`

const ValueView1 = styled.View`
    padding: 40px 0 0px 16px;
`

const ValueTxt1 = styled.Text`
    font-size:28px;
    line-height: 31px;
    font-family: 'noto500';
    color:#000000;
`

const ValueTxt2 = styled(ValueTxt1)`
    margin-top: 8px;
    font-family: 'noto700';
`
const ValueTxt3 = styled(ValueTxt1)`
    font-family: 'noto500';
    color:#999999;
`
const ValueTxt4 = styled.Text`
    font-size:16px;
    line-height: 19px;
    font-family: 'noto500';
    color:${colors.plusColor};
    padding-top:3px;
`

const ValueTxt4Minus = styled(ValueTxt4)`
    color:${colors.minusColor};
`


const ValueTxt5 = styled.Text`
    font-size:14px;
    line-height: 17px;
    font-family: 'noto400';
    color:#777777;
    padding-top: 16px;
    text-align: right;
    padding-right: 16px;
`
const ChartViewBox = styled.View`
    margin-top:12px ;
    padding-bottom: 40px;
`



const CompanyInfoCurrentPrice = (props:any) =>{
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const {dataSet} = props;
    //console.log(dataSet)

    const [price, setPrice] = useState(dataSet?.currentPrice);
    const [priceGap, setPriceGap] = useState(dataSet?.priceGap);
    const [priceGapStr, setPriceGapStr] = useState(thousandComma(priceGap.toString().replace('-','')));
    const [incRate, setIncRate] = useState(dataSet?.incRate);


   
    const [stockPriceDataSet, setStockPriceDataSet] = useState([]);
    const [isAllDataLoaded, setIsAllDataLoded] = useState(false);
    
    //페이지 이동시 저장한 
    const stockCode = useSelector((state:RootState)=>state.user.compnayInfoStockCode);


    useEffect(()=>{
        async function getAllData(){
            let result:any =  await getStockPriceHistory(stockCode, dispatch, navigation);
            setStockPriceDataSet(result);

            setInterval(intervalAct,30000)

            setIsAllDataLoded(true);
    }
        getAllData()
    }, []);

    async function intervalAct(){
        let result:any =  await getFinanceInfoSimple(stockCode, dispatch, navigation);
        result = result?.data;
        setPrice(thousandComma(result?.curPrc));
        setPriceGap(result?.curPrc - result?.cloPrc);
        setPriceGapStr(thousandComma(result?.curPrc - result?.cloPrc));
        setIncRate(result?.flucRate);
    }


    if(!isAllDataLoaded){return null;}


    let priceArr = stockPriceDataSet.map((item:any)=> item.closePrice);
    let dateArr = stockPriceDataSet.map((item:any)=> changeDataTypeMMDashDD(item.trdDd));
    const currentPrice = dataSet?.currentPrice.replace(",","").replace(",","")*1;
    const currentPriceDate  = changeDataTypeMMDashDD(dataSet?.priceDate);


    if(currentPriceDate!=dateArr[dateArr.length-1]){
        priceArr.push(currentPrice);
        dateArr.push(currentPriceDate);

        priceArr.splice(0,1);
        dateArr.splice(0,1);
    }

    let dateFinalArr:any =[];
    dateArr.forEach((item, idx)=>{
        
        if(idx%3===0){
            dateFinalArr.push(item);
        }else{
            dateFinalArr.push('');
        }
    });

    const minPrice = thousandComma(getMin(priceArr));
    const maxPrice = thousandComma(getMax(priceArr));
    const minMaxGap = (getMax(priceArr) - getMin(priceArr))/4;
    const oneFourthPrice = thousandComma(getStockPriceCut('kospi',getMin(priceArr)+minMaxGap));
    const threeFourthPrice = thousandComma(getStockPriceCut('kospi',getMin(priceArr)+minMaxGap*3));
    
    function* yLabel() {
        yield* [minPrice, oneFourthPrice, threeFourthPrice, maxPrice];
    }
    const yLabelIterator = yLabel();

    return(
        <OutView>
            <ValueView1>
                <ValueTxt1>{dataSet?.companyName}</ValueTxt1> 
                <ValueTxt2>{price}<ValueTxt3>원</ValueTxt3></ValueTxt2>
                {priceGap>=0?
                <ValueTxt4>▲ {priceGapStr}  +{incRate}%</ValueTxt4>
                :<ValueTxt4Minus>▼ {priceGapStr}  {incRate}%</ValueTxt4Minus>
                }
                <ValueTxt5>{dataSet?.priceDate} 기준</ValueTxt5>
            </ValueView1>
            
            <ChartViewBox>
                <LineChart
                    data={{
                    labels: dateFinalArr,
                    datasets: [
                        {
                        data: priceArr
                        },
                        // {
                        //     key: 'dummy-range-padding',
                        //     data: [20000, 22000],
                        //     color: () => 'rgba(225,225,225, 1)',
                        //     withDots: false,
                        //     strokeDashArray: [0, 1000],
                        //   },
                    ],
                    //legend: ["Rainy Days"] // optional
                    }}
                    withInnerLines = {false} //안쪽 라인 없애기
                    withShadow = {true}  //차트아래 색 채우기

                    width={windowWidth} // 
                    height={216}
                    yAxisLabel=""
                    // yAxisSuffix="₩"
                    yAxisInterval={1} // optional, defaults to 1
                    segments = {3} //y축 숫자 갯수
                    formatYLabel={() => yLabelIterator.next().value}  //y축 숫자 커스텀
                    
                    chartConfig={{
                        //useShadowColorFromDataset : true,
                        //backgroundColor: "#FFFFFF",
                        backgroundGradientFrom: "#FFFFFF",
                        backgroundGradientTo: "#FFFFFF",
                        
                        //차트아래 색갈 그라디언트
                        fillShadowGradientFrom:"#0008C1",
                        fillShadowGradientTo:"#FFFFFF",
                        
                        decimalPlaces:0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 8, 193, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "2",
                            strokeWidth: "2",
                            stroke: "rgb(0, 8, 193)"
                        },
                    }}
                    bezier  //선을 둥글게
                    style={{
                        marginVertical: 0,
                        borderRadius: 8,
                    }}
                    
                    
                />
            </ChartViewBox>

           
        </OutView>
    )
}

export default CompanyInfoCurrentPrice;