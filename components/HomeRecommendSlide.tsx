import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, TouchableOpacity,  } from "react-native";
import styled from "styled-components/native";
import { decimalRound, setCurrentPage, thousandComma } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import userSlice from "../slices/user";



const HomeRecommendSlideWrap = styled.FlatList`
    
`

const HomeRecommendSlideBox = styled.View`
    width:151px;
    height:128px;
    border:1px solid #777777;
    border-radius: 8px;
    padding:28px 12px 0 12px;
    margin-top:24px;
`

const SliderGap = styled.View`
    width:12px;
`

const SlideText1 = styled.Text`
    font-family: 'noto500';
    font-size: 14px;
    line-height:17px;
    color:#000000;
`
const SlideText2 = styled.Text`
    font-family: 'noto700';
    font-size: 16px;
    line-height:19px;
    color:#000000;
    margin-top: 8px;
`
const SlideText2_1 = styled(SlideText2)`
    font-family: 'noto400';
    color:#777777;
`

const SlideText3View = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 24px;

`

const SlideText3 = styled.Text`
    font-family: 'noto500';
    font-size: 14px;
    line-height:17px;
    color:${colors.plusColor};
`
const SlideText3Minus = styled(SlideText3)`
    color:${colors.minusColor};
`



const HomeRecommendSlide = ({dataSet}:any)=>{

    
    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    const goCompanyInfo = (stockCode:string) =>{
        dispatch(userSlice.actions.setCompnayInfoStockCode(stockCode));
        setCurrentPage(dispatch,'CompanyInfo');
        navigation.navigate("CompanyInfo" as never);
    }





const RenderSlideBox = ({item}:any)=>{
    let currentPrice = item.curPrc;
    let yesterdayPrice = item.cloPrc;
    const priceGap =  currentPrice - yesterdayPrice;
    const changeRate = item.flucRate;
    const currentPriceStr = thousandComma(currentPrice);
    const priceGapStr = thousandComma(priceGap);
    const corpName = item?.corpName;

    return(
        <TouchableOpacity onPress={()=>{goCompanyInfo(item.stockCode)}}>
        <HomeRecommendSlideBox>
            <SlideText1 numberOfLines={1}>{corpName}</SlideText1>
            <SlideText2>{currentPriceStr}<SlideText2_1>원</SlideText2_1></SlideText2>
               {priceGap >=0?<SlideText3View>
                    <SlideText3>{priceGapStr}</SlideText3>
                    <SlideText3>+{changeRate}%</SlideText3>
                </SlideText3View>
                :<SlideText3View>
                    <SlideText3Minus>{priceGapStr}</SlideText3Minus>
                    <SlideText3Minus>{changeRate}%</SlideText3Minus>
                </SlideText3View>}
        </HomeRecommendSlideBox>
        </TouchableOpacity>
    )
}


    return (
            <HomeRecommendSlideWrap 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft:16, paddingRight:16}}
                ItemSeparatorComponent={()=><SliderGap/>}
                data ={dataSet}
                renderItem={RenderSlideBox}
                keyExtractor={(item, index) => index.toString()+"pwj"}
            >
            </HomeRecommendSlideWrap>
    )
}


export default HomeRecommendSlide;