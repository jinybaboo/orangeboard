import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Tabs from "./Tabs";
import Stack from "./Stack";


// 페이지 이동을 위한 네이게이터 생성 및 제작
const NativeStack = createNativeStackNavigator();


const RootNav = () => {

    return (
        <NativeStack.Navigator screenOptions={{headerShown:false}} >
            {/* <NativeStack.Screen name = "Tabs" component={Tabs}/> */}
            <NativeStack.Screen name = "Stack" component={Stack} 
                options={{
                    animation:"slide_from_right",
                }}
            />
        </NativeStack.Navigator>
    )
}
export default RootNav;