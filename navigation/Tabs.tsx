import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {AntDesign, Ionicons} from '@expo/vector-icons';
import Contents from "../screens/Contents";
import Start from "../screens/Intro";
import Mypage from "../screens/Mypage";
import Creator from "../screens/Creators";
import { Image } from "react-native";
import Home from "../screens/Home";



const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            //탭 네비게이터는 모든 화면에 적용되는 백그라운드를 넣을 수 있다. (모든 화면을 담고있는 컨테이너가 있음)
            sceneContainerStyle={{
                backgroundColor:"#FFFFFF",
            }}

            screenOptions={{
                //페이지 전환시 마다 데이터를 다시 호출함!!!
                //unmountOnBlur:true,
                //키보드 올라올때 네비게이션 같이 올라오게 하는 기능 없앰
                tabBarHideOnKeyboard: true,

                headerShown : false, //헤더 보여줄지 말지
                // headerStyle:{
                //     backgroundColor:"#222222",
                // },
                // headerTitleStyle:{
                //     color:"#ffffff",
                // },

                //하단 탭바 생상 및 스타일
                tabBarStyle:{
                    backgroundColor:"#FFFFFF",
                    position:'absolute',
                },
                tabBarLabelStyle:{
                    fontSize:11,
                    color:'#000000'
                },
                
                
                //하단 탭바 텍스트 위치 및 액티브 시 컬러색상
                tabBarLabelPosition:"below-icon",
                tabBarActiveTintColor:"#000000",
                
                
            }}
        >
            <Tab.Screen 
                name="홈" 
                component={Home} 
                options={{
                    // tabBarLabelStyle:{
                    //     color:'#000',
                    //     backgroundColor:'gray'
                    // },
                    // tabBarBadge:"new",
                    // headerTitleStyle:{
                    //     color:'tomato'
                    // },
                    // headerRight: () => (
                    //     <View>
                    //     <Text>설정</Text>
                    //     </View>
                    // ),
                    tabBarIcon :({focused, color, size}:any) =>{
                        //focus 상태에 따라 아이콘을 바꾸어줄때는 네임만 바꾸어 주면 된다! (아웃라인 있는 아이콘, 없는 아이콘)
                        //return <Ionicons name={focused?"search-outline":"search"} size={size} color={color} />
                        //return <AntDesign name="home" size={size} color={color} />
                        return  focused?<Image source={require('../assets/icons/home_on.png')}/>:<Image source={require('../assets/icons/home_off.png')}/>
                    },
                }}
            />

            <Tab.Screen 
                name="리포트" 
                component={Contents}
                options={{
                    tabBarIcon :({focused, color, size}:any) =>{
                        return  focused?<Image source={require('../assets/icons/contents_on.png')}/>:<Image source={require('../assets/icons/contents_off.png')}/>
                    },
                }}
            />

            <Tab.Screen 
                name="크리에이터" 
                component={Creator}
                options={{
                    tabBarIcon :({focused, color, size}:any) =>{
                        return  focused?<Image source={require('../assets/icons/creator_on.png')}/>:<Image source={require('../assets/icons/creator_off.png')}/>
                    },
                }}
            />
            <Tab.Screen 
                name="내정보" 
                component={Mypage}
                options={{
                    tabBarIcon :({focused, color, size}:any) =>{
                        return  focused?<Image source={require('../assets/icons/my_on.png')}/>:<Image source={require('../assets/icons/my_off.png')}/>
                    },
                }}
            />
            
        </Tab.Navigator>
    )
};

export default Tabs;

