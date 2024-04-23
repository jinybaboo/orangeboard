import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import styled from "styled-components/native";

import { useNavigation } from "@react-navigation/native";					
import { useAppDispatch } from "../../store";					
import { setCurrentPage } from "../../common/commonFunc";			

import userSlice from "../../slices/user";


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

const ContentHeaderView = styled.View`
    width:100%;
    height:56px;
    position:relative;
`
const ContentTitleBox = styled.View`
    height: 56px;
    justify-content: center;
    padding-left: 16px;
`

const ContentHeaderTitle = styled.Text`
    font-family: 'noto500';
    padding-top: 7px;
    font-size: 24px;
    line-height:27px;
    color:#000000;
`

const ContentHeaderRightView = styled.View`
    height:56px;
    position:absolute;
    right:0px;
    align-items: center;
    flex-direction: row;
`

const SearchInputBox = styled.View`
    width:140px;
    height:28px;
    background-color: #F2f2f2;
    border-radius: 50px;
    margin-right: 9px;
    padding-left: 14px;
    padding-top: 7px;
`

const SearchInput = styled.TextInput`
    font-family: 'noto500';
    font-size: 12px;
    line-height:16px;
    width:100%;
`
const SearchIcon = styled.Image`
    width:20px;
    height:20px;
    margin-right:16px;
`

const SearchInputBoxAndroid = styled.View`
    width:140px;
    height:28px;
    background-color: #F2f2f2;
    border-radius: 50px;
    margin-right: 9px;
    padding-left: 14px;
    
`
const SearchInputAndroid = styled.TextInput`
    font-family:'noto500';
    font-size:12px;
    width:100%;
    height:32px;
`


const ContentsHeader = (props:any) =>{

    const [searchWord, setSearchWord] = useState('');


    const dispatch = useAppDispatch();					
    const navigation = useNavigation();		
    
    const goContentsSearchResult = async() =>{	
        if(searchWord.length<2){
            Alert.alert( //alert 사용					
                '잠깐!', '검색어는 2자 이상 입력해 주세요.', [ //alert창 문구 작성				
                    {text: '확인', onPress: () => {} }, //alert 버튼 작성			
                ]				
            );			
            return;		
        }

        setCurrentPage(dispatch, 'ContentsSearchResult');				
        navigation.navigate("ContentsSearchResult" as never);				
    }					


    function onSubmit(){
        goContentsSearchResult();
        setSearchWord('')
    }

    function onChangeText(text:string){
        setSearchWord(text);
        dispatch(userSlice.actions.setContentsSearchWord(text));
        //console.log(text)
    }
    return (
            <ContentHeaderView>
                <ContentTitleBox>
                    <ContentHeaderTitle>{props.title}</ContentHeaderTitle>
                </ContentTitleBox>
                <ContentHeaderRightView>
                    {Platform.OS=='ios'?(
                        <SearchInputBox>
                            <SearchInput
                                onSubmitEditing={onSubmit} 
                                onChangeText={onChangeText} 
                                placeholder="콘텐츠&크리에이터" 
                                value={searchWord}
                                placeholderTextColor ="#777777"
                            />
                        </SearchInputBox>
                    ):(
                        <SearchInputBoxAndroid>
                            <SearchInputAndroid
                                onSubmitEditing={onSubmit} 
                                onChangeText={onChangeText} 
                                placeholder="콘텐츠&크리에이터" 
                                value={searchWord}
                                placeholderTextColor ="#777777"
                            />
                        </SearchInputBoxAndroid>
                    )}
                    
                        
                    <SearchIcon source={require('../../assets/icons/searchIconBlack.png')}/>
                </ContentHeaderRightView>
            </ContentHeaderView>
    )   
}

export default ContentsHeader;