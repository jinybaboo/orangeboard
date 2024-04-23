import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { BasicKeyboardAvoidingView, LineF5F5F5, PaddingView22, Space } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import { Alert, Keyboard, Platform, TouchableOpacity, View } from "react-native";
import colors from "../common/commonColors";
import { getWindowWidth } from "../common/commonFunc";
import { goLogin, goPortContent } from "../common/commonNav";
import { changeDataTypeDot } from "../common/commonFunc";
import { useSelector } from "react-redux";

const os = Platform.OS;

const windowWidth = getWindowWidth();


const PortFlatList = styled.FlatList`
    
`

const PortListPress = styled.Pressable`
    width:100%; padding-top: 12px; padding-bottom: 12px; 
`
const BadgeBox_Close = styled.View`
    width:40px; height:20px; background-color: ${colors.orangeBorder}; border-radius: 13px; justify-content: center; align-items: center;
`
const BadgeBox_Issue = styled(BadgeBox_Close)`
    background-color:#FFF; border-width: 1px; border-color: #F6A300;
`
const BadgeBox_Change = styled(BadgeBox_Close)`
    background-color:#FFF; border-width: 1px; border-color: #808080;
`
const BadgeTxt_Close = styled.Text`
    font-family: 'noto400'; font-size: 12px; line-height:15px; color:#FFFFFF; margin-top: 1px;
`
const BadgeTxt_Change = styled(BadgeTxt_Close)`
    color:#808080; 
`
const BadgeTxt_Issue = styled(BadgeTxt_Close)`
    color:#F6A300; 
`
const TitleView = styled.View`
    flex-direction: row; margin-top: 9px;
`
const LockImage = styled.Image`
    width:9px; height:12px; margin-top: 1.6px; margin-right: 7px;
`
const TitleTxt = styled.Text`
    width:${windowWidth-44 - 9 - 7}px ;font-family: 'noto400'; font-size: 15px; line-height:18px; color:#000000; 
`
const BtmTxtView = styled.View`
    flex-direction: row; margin-top: 8px;
`
const BomTxt1 = styled.Text`
    font-family: 'noto400'; font-size: 12px; line-height:15px; color:#AAAAAA;
`


export const PortList = ({data:listArr}:any)=>{
    const dispatch = useAppDispatch();	
    const navigation:any = useNavigation();	
    
    const isLogin = useSelector((state:any)=>state.user.isLogin);
    let isLock = true;
    let isLockMsg:any = "";
    const [keyboardHeight, setKeyboardHeight] = useState(450);	// 디폴트 키보드 높이 설정

    // 키보드 활성화 될때 조절				
    useEffect(()=>{				
        Keyboard.addListener('keyboardDidShow', (event:any) => {		
            console.log('show')	
            setKeyboardHeight(event.endCoordinates.height+100);	
        });		
        
        Keyboard.addListener('keyboardDidHide', (event:any) => {			
            console.log('hide');	
        });	
    },[])		
    

    const renderPortBox = ({item:data, index}:any) => {	
        let {displayName, title, portfolioType, publishedAt, PortfolioId, pageName, isSubscribeChannel, commentCount}:any = data;
        
        const date = changeDataTypeDot(publishedAt);

        let badge ="";
        if(portfolioType=='issue'){
            badge="이슈";
        }else if(portfolioType=='change'){
            badge="변경";
        }else if(portfolioType=='closing'){
            badge="마감"
        }
        
        if(isSubscribeChannel){
            isLock = false;
        }
        if(!isLogin){
            isLockMsg = "로그인 후 이용 가능합니다";
            portfolioType='notLogin';
        }else if(!isSubscribeChannel){
            isLockMsg = "정기 구독 신청 후 이용 가능합니다.";
        }
         

        return (
            <View key={index+'plistBox'}>
                <PortListPress 
                    onPress={()=>{
                        portfolioType!='realtime' && isLock?Alert.alert('',isLockMsg,  [{text: '확인', onPress: () => {
                            if(!isLogin){
                                goLogin(navigation, dispatch);
                            }
                        }}])
                        :
                        goPortContent(navigation, dispatch, PortfolioId, pageName);
                    }}
                >
                    {portfolioType==='issue' && 
                    <BadgeBox_Issue>
                        <BadgeTxt_Issue>{badge}</BadgeTxt_Issue>
                    </BadgeBox_Issue>
                    }

                    {portfolioType==='change' && 
                    <BadgeBox_Change>
                        <BadgeTxt_Change>{badge}</BadgeTxt_Change>
                    </BadgeBox_Change>
                    }

                    {portfolioType==='closing' && 
                    <BadgeBox_Close>
                        <BadgeTxt_Close>{badge}</BadgeTxt_Close>
                    </BadgeBox_Close>
                    }



                    {/* {portfolioType=='change' && <BadgeBox_Change> <BadgeTxt>{badge}</BadgeTxt></BadgeBox_Change>}
                    {portfolioType=='closing' && <BadgeBox_Close> <BadgeTxt>{badge}</BadgeTxt></BadgeBox_Close>} */}

                    <TitleView>
                        {portfolioType!='realtime' && isLock && <LockImage source={require('../assets/icons/lock_small.jpg')}/>}
                        <TitleTxt 
                            style={portfolioType == 'realtime' && {color:colors.orangeBorder}}
                            numberOfLines={1}>{title} 
                            {commentCount >0 && <TitleTxt style={{color:colors.orangeBorder}}> [{commentCount}]</TitleTxt>}
                        </TitleTxt>
                    </TitleView>
                    <BtmTxtView>
                        <BomTxt1>{displayName} {date}</BomTxt1>
                    </BtmTxtView>
                </PortListPress>
                <LineF5F5F5 />
            </View>
        )    
    };		


    return (
        <PortFlatList 
            data = {listArr}
            renderItem={renderPortBox}
            keyExtractor={(item:any, index:number) => index.toString()+""}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.8}
            initialNumToRender={10} // 처음 10개의 아이템을 렌더링
            maxToRenderPerBatch={5} // 한 번에 최대 5개씩 렌더링
            ListFooterComponent = {()=>(
                <Space height={50}/>
            )}
        />

    )

}



