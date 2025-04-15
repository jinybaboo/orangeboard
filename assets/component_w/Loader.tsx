import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { getWindowHeight, getWindowWidth } from "../../common/commonFunc";

const windowWidth = getWindowWidth();
const windowHeight = getWindowHeight();

const Wrapper = styled.View`
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    position: absolute;
    width: ${windowWidth}px;
    height: ${windowHeight}px;
`


const Loader = ()=>(
    <Wrapper>
        <ActivityIndicator size="small" color="#FF7900"/>
    </Wrapper>
)

export default Loader;