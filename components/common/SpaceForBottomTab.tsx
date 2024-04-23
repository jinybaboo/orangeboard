import styled from "styled-components/native";
import DeviceInfo, {getModel} from 'react-native-device-info';
import { useState } from "react";
import { Platform, View } from "react-native";

const SpaceForBottomTabView = styled.View`
    width:100%;
    height: 16px;
    background-color: #ffffff;
`

const SpaceForBottomTab = ()=>{
    return Platform.OS=='android'?<SpaceForBottomTabView />:<View/>
}

export default SpaceForBottomTab;