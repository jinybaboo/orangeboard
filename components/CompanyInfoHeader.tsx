import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Platform, Pressable } from "react-native";
import styled from "styled-components/native";
import { setCurrentPage } from "../common/commonFunc";
import { useAppDispatch } from "../store";


const ModalHeaderView = styled.View`
    width:100%;
    background-color: #FFFFFF;
`
const MobileHeaderInner = styled.View`
    width:100%;
    height: 56px;
    border-radius: 10px;
    padding-left:16px;
`

const BackArrowImg = styled.Image`
    width: 16px;
    height: 20px;
    position: absolute;
    top: 20px;
    left: 20px;
`;

const AndroidHeadSpace = styled.View`
    width:100%;
    height:30px;
`

const IosHeadSpace = styled.View`
    width:100%;
    height:40px;
`

const InnerText1 = styled.Text`
    font-family: 'noto400';	
    font-size: 16px;	
    line-height:56px;	
    color:#000000;
`

const InnerText2 = styled(InnerText1)`
    font-family: 'noto700';	
`

const PressableX = styled.Pressable`
    width:100px;
    height: 56px;
    position:absolute;
    left:0;
`

const CompanyInfoHeader = ({companyName}:any)=>{
    const os = Platform.OS;
    // const height = os == 'android'? 86 : 56;
    // const headMargin = os == 'android'? 20 : 0;


    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    //헤더 X버튼 누를때
    const backAction = () => {
        setCurrentPage(dispatch, "Back");
        navigation.goBack();
    };


    return (
        <ModalHeaderView>
            {os=='android'?<AndroidHeadSpace />:<IosHeadSpace />}
            <MobileHeaderInner>
                <BackArrowImg source={require("../assets/icons/backArrow.png")} />
                {/* <InnerText1>"<InnerText2>{companyName}</InnerText2>"와 관련된 리포트</InnerText1> */}
                <PressableX onPress={backAction}></PressableX>
            </MobileHeaderInner>
        </ModalHeaderView>
    )
}


export default CompanyInfoHeader;