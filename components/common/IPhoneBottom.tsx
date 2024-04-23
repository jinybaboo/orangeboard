import styled from "styled-components/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { getIphoneBottomInfo } from "../../common/commonFunc";

const IPhoneBottomView = styled.View`
    width:100%;
    height: 20px;
`

const IPhoneBottom = ()=>{

    const [iosBottom, setIosBottom] = useState(true);
    useEffect(()=>{
        const getDeviceInfo = () =>{
            const result = getIphoneBottomInfo(); //true면 하단공간 필요한 iphone, false면 안드로이드 및 구형아이폰
            setIosBottom(result);
        }
        getDeviceInfo();
    })

    return iosBottom?<IPhoneBottomView />:<View/>
}


export default IPhoneBottom;