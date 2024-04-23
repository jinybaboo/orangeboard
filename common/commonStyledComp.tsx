import React from "react";
import styled from "styled-components/native";
import colors from "./commonColors";

export const BasicView = styled.View`
    flex:1;
    background-color: #FFFFFF;
`
export const BasicKeyboardAvoidingView = styled.KeyboardAvoidingView`
    flex:1;
    background-color: #FFFFFF;
`

export const BasicScrollView = styled.ScrollView`
    background-color:#FFFFFF;
    margin-bottom: 40px;
`
export const BottomTabView = styled.View`
    background-color:#FFFFFF;
    margin-bottom: 40px;
    flex:1;
`
export const BottomTabScrollView = styled.ScrollView`
    background-color:#FFFFFF;
    margin-bottom: 56px;
`


export const CommonTitle = styled.Text`
    font-family: 'noto500';
    font-size: 20px;
    line-height:23px;
    color:${colors.titleBlack};
`


export const CommonSeeMoreTxt = styled.Text`
    font-family: 'noto500';
    font-size: 16px;
    line-height:19px;
    color:#999999;
`

export const RelativeView = styled.View`
    position:relative;
`

export const TitleUnderline = styled.View`
    width:100%;
    height: 2px;
    background-color: #F2F2F2;
`

export const FavoStarImage = styled.Image`
    width:24px;
    height: 24px;
`

export const Space8Gray = styled.View`
    width:100%;
    height:8px;
    background-color: #F2F2F2;
    border-top-color: #E2E2E2;
    border-top-width: 1px;
    border-bottom-color: #E2E2E2;
    border-bottom-width: 1px;
`

export const Space:any = styled.View` width:100%; height:${(props:any) => props.height}px;`
export const Space12 = styled.View` width:100%; height:12px;`
export const Space16 = styled.View` width:100%; height:12px;`
export const Space20 = styled.View`width:100%; height:20px;`
export const Space24 = styled.View`width:100%; height:24px;`
export const Space28 = styled.View`width:100%; height:28px;`
export const Space40 = styled.View`width:100%; height:40px;`
export const Space50 = styled.View`width:100%; height:50px;`
export const Space100 = styled.View`width:100%; height:100px;`


export const LineDDDDDD = styled.View`width:100%; height:1px; border-top-color: #DDDDDD; border-top-width: 1px;`
export const LineE2E2E2 = styled.View`width:100%; height:1px; border-top-color: #E2E2E2; border-top-width: 1px;`
export const LineEEEEEE = styled.View`width:100%; height:1px; border-top-color: #EEEEEE; border-top-width: 1px;`
export const LineF2F2F2 = styled.View`width:100%; height:1px; border-top-color: #F2F2F2; border-top-width: 1px;`
export const LineF5F5F5 = styled.View`width:100%; height:1px; border-top-color: #F5F5F5; border-top-width: 1px;`
export const LineD9D9D9 = styled.View`width:100%; height:1px; border-top-color: #D9D9D9; border-top-width: 1px;`
export const CompanyInfoTitle = styled.Text`
    font-family: 'noto500';
    font-size: 20px;
    line-height:23px;
    color:#000000;
`

export const SeeMoreBtn = styled.Text`
    width:100%;
    height:52px;
    line-height: 52px;
    text-align: center;
    font-family: 'noto500';
    font-size: 16px;
    color:${colors.orangeBorder};
    border : 1px solid ${colors.orangeBorder};
    border-radius : 8px;
`
export const OrangeBtnPress = styled.Pressable`
    width:100%;
    height:56px;
    background-color:${colors.orangeBorder};
    border-radius : 12px;
    align-items: center; justify-content: center;
`
export const OrangeBtnTxt = styled.Text`
    font-family: 'noto700';
    font-size: 16px;
    line-height: 19px;
    color:#FFFFFF;
`

export const EmptyView = styled.View``;


export const PaddingView = styled.View`
    padding:0 16px;
`;
export const PaddingView22 = styled.View`
    padding:0 22px;
`;

