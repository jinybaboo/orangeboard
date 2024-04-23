import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, Pressable, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import { setCurrentPage, thousandComma } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import userSlice from "../slices/user";
const windowWidth = Dimensions.get('window').width;



const HomePopularItemBox =styled.View`
    width:100%;
    height: 38px;
    flex-direction: row;
    justify-content: space-between;
`

const HomePooularItemInnerView1 = styled.View`
    width:50%;
    height: 100%;
    flex-direction: row;
`

const HomePooularItemInnerView1_1 = styled.View`
    width:36px;
    height:36px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
`
const HomePooularItemTxt1 = styled.Text`
    font-family: 'noto500';
    font-size: 14px;
    line-height:17px;
`

const HomePooularItemInnerView1_2 = styled.View`
    justify-content: center;
    margin-left: 8px;
`

const HomePooularItemTxt2 = styled.Text`
    font-family: 'noto500';
    font-size: 16px;
    line-height:19px;
    color:#000000;
`
const HomePooularItemTxt3 = styled.Text`
    font-family: 'noto500';
    font-size: 12px;
    line-height:15px;
    color:#777777;
`

const HomePooularItemInnerView2 = styled.View`
    width:50%;
    height: 100%;
    justify-content: center;
    align-items: flex-end;
`

const HomePooularItemTxt4 = styled.Text`
    font-family: 'noto400';
    font-size: 16px;
    line-height:19px;
    color:#000000;
`

const HomePooularItemTxt5 = styled.Text`
    font-family: 'noto400';
    font-size: 14px;
    line-height:17px;
    color:${colors.plusColor};
`

const HomePooularItemTxt5Minus = styled.Text`
    color:${colors.minusColor};
`

const HomePopularItemBoxGap =styled.View`
    width:100%;
    height: 32px;
`




const CompanyShow1 = (props:any)=>{
    const item = props.name;
    const priceStr =  thousandComma(item.curPrc);

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    const goCompanyInfo = (stockCode:string) =>{
        dispatch(userSlice.actions.setCompnayInfoStockCode(stockCode));
        setCurrentPage(dispatch,'CompanyInfo');
        navigation.navigate("CompanyInfo" as never);
    }

    return (
            <Pressable key={item.stockCode+''} onPress={()=>{goCompanyInfo(item.stockCode)}}>
            <HomePopularItemBox key={item.stockCode+''}>
                <HomePooularItemInnerView1>
                    <HomePooularItemInnerView1_1 style={{backgroundColor:item?.color}}>
                        <HomePooularItemTxt1 style={{color:item?.textColor}}>{item?.corpName.substring(0,2)}</HomePooularItemTxt1>
                    </HomePooularItemInnerView1_1>
                    <HomePooularItemInnerView1_2>
                        <HomePooularItemTxt2>{item?.corpName}</HomePooularItemTxt2>
                        <HomePooularItemTxt3>{item?.stockCode}</HomePooularItemTxt3>
                    </HomePooularItemInnerView1_2>

                </HomePooularItemInnerView1>

                <HomePooularItemInnerView2>
                    <HomePooularItemTxt4>{priceStr}원</HomePooularItemTxt4>
                    {
                    item?.flucRate>=0?<HomePooularItemTxt5>+{item?.flucRate}%</HomePooularItemTxt5>
                    :<HomePooularItemTxt5Minus>{item?.flucRate}%</HomePooularItemTxt5Minus>
                    }
                    
                </HomePooularItemInnerView2>
            </HomePopularItemBox>
            <HomePopularItemBoxGap/>
            </Pressable>
            
    );
}


export default CompanyShow1;

