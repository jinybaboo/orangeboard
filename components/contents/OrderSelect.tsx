import React from "react";
import styled from "styled-components/native";



const OrderBox = styled.View`
    flex-direction: row;
`
const OrderTxt = styled.Text`
    font-family: 'noto500';
    font-size: 14px;
    line-height:17px;
    color:#000000;
    padding-right:5px;
`
const OrderImg = styled.Image`
    width:12.333px;
    height:11.333px;
    margin-top:1.5px;
`


const OrderSelect = (props:any) =>{
    return (
        <OrderBox>
            <OrderTxt>{props.orderName}</OrderTxt>
            <OrderImg source={require("../../assets/icons/orderImage.png")}/>
        </OrderBox>
    )
}

export default OrderSelect;