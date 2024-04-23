import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, TouchableOpacity,  } from "react-native";
import styled from "styled-components/native";
import { decimalRound, setCurrentPage, thousandComma } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import HomeRecommendSlide from "./HomeRecommendSlide";



const HomeRecommentView = styled.View`
    width:100%;
    height: 266px;
    background-color: #FFFFFF;
`

const HomeRecommentViewTxtBox1 = styled.View`
    width:100%;
    height: 46px;
    margin-top: 36px;
    padding:0 16px;
    position: relative;
`

const HomeTitle1 = styled(CommonTitle)`

`

const OrnagePickSeeMoreTouch = styled.TouchableOpacity`
    position: absolute;
    right:16px;
    top:15px;

`

const OrangePickSeeMoreTxt = styled(CommonSeeMoreTxt)``


const HomeTitle1SubTxt = styled.Text`
    font-family: 'noto400';
    font-size: 14px;
    line-height:17px;
    color:#777788;
    position: absolute;
    bottom:0;
    left:16px;
`


const HomeRecommend = ({dataSet}:any)=>{

    
    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    const goRecommendPick = () =>{
        setCurrentPage(dispatch,'RecommendPick');
        navigation.navigate("RecommendPick" as never);
    }




    return (
        <HomeRecommentView>
            <HomeRecommentViewTxtBox1>
                <HomeTitle1>오렌지보드 추천 PICK</HomeTitle1>
                <HomeTitle1SubTxt>오렌지보드 리포트의 관심 기업만 모았어요.</HomeTitle1SubTxt>
                <OrnagePickSeeMoreTouch>
                    <TouchableOpacity onPress={goRecommendPick}><OrangePickSeeMoreTxt>더보기</OrangePickSeeMoreTxt></TouchableOpacity>
                </OrnagePickSeeMoreTouch>
            </HomeRecommentViewTxtBox1>

            <HomeRecommendSlide dataSet ={dataSet}/>
        </HomeRecommentView>
    )
}


export default HomeRecommend;