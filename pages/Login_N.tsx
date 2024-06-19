import React, { useEffect, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { Alert, Animated, DeviceEventEmitter, Platform, Pressable, TouchableOpacity, View } from "react-native";
import { checkNavigator} from "../common/navigator_w";

import {login,loginWithKakaoAccount,logout,getProfile as getKakaoProfile,unlink,} from "@react-native-seoul/kakao-login";
import { getWebTokenWithAppleToken, getWebTokenWithGoogleToken, getWebTokenWithKakao, getWebTokenWithNaverToken, insertAgreementAndPrivacy, insertOrUpdateFcmToken } from "../common/fetchData";
import EncryptedStorage from 'react-native-encrypted-storage';
import NaverLogin, {NaverLoginResponse, GetProfileResponse} from '@react-native-seoul/naver-login';
import auth from '@react-native-firebase/auth';
import {GoogleSignin, GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { v4 as uuid } from 'uuid';
import { getWindowWidth } from "../common/commonFunc";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { LineE2E2E2 } from "../common/commonStyledComp";
import colors from "../common/commonColors";
import messaging from '@react-native-firebase/messaging';
import { getModel } from "react-native-device-info";
import ModalHeader from "../components/webviewComp/ModalHeader";



const windowWidth = getWindowWidth();
const os = Platform.OS;

const LoginView = styled.View` 
    flex: 1; align-items: center; position: relative; background-color: #FFFFFF;
`
const Space = styled.View``


///// 신규 로그인 디자인
const LoginText = styled.Text`
    font-family: "noto400"; font-size: 14px; line-height: 20px; color: #000000; text-align: center; margin-top: 96px;
`;

const LogoImg = styled.Image`
    width: 232.3px; height: 33px; margin-top:6px;   
`;

const LogoBtnBoxView = styled.View`
    position:absolute; bottom:0; padding-bottom:50px; 
`
const LogoBtnBox = styled.View`
  width:${windowWidth - 32}px; height:46px; background-color:#FEE500; margin-top:12px; border-radius:12px; justify-content:center; align-items:center;
  flex-direction: row;
`
const SnsLogoImg = styled.Image`
  width:18.33px; height:18px;
`
const SnsLoginTxt = styled.Text`
  font-family: "noto500"; font-size: 13px; line-height: 16px; color: #000000; padding-top: 2.5px; margin-left: 8px;
`

// 약관동의 부분
const BlackOpacityView = styled.View`
  width:100%; height:100%; background-color: rgba(0,0,0,0.5); position: absolute;
`
const AgreementViewAnimated = styled(Animated.createAnimatedComponent(View))`
  width:100%; height:590px; background-color: #FFFFFF; border-top-left-radius:12px; border-top-right-radius: 12px;
  position: absolute; bottom:0; padding:34px 16px 40px;
`
const AgreementTxt1 = styled.Text`
  font-family: "noto700"; font-size: 20px; line-height: 23px; color: #000000; 
`
const AgreementTxt2 = styled.Text`
  font-family: "noto400"; font-size: 14px; line-height: 20px; color: #999999; margin-top: 4px;
`
const CheckBoxView = styled.View`
  flex-direction:row;
`
const CheckBoxImg = styled.Image`
  width:20px; height:20px;
`
const CheckBoxTxt = styled.Text`
  font-family: "noto400"; font-size: 15px; line-height: 20px; color: #000000; margin-left: 12px;
`
const CheckBoxTxtBold = styled(CheckBoxTxt)`
  font-family: "noto700"; font-size: 16px;
`
const SeeMoreTxtPress = styled.Pressable`
 width:50px; height:20px; position: absolute; right:0px; align-items: flex-end;
`
const SeeMoreTxt = styled(CheckBoxTxt)`
  font-size: 13px; color:#999999; 
`
const CheckBoxTxt2 = styled.Text`
  font-family: "noto400"; font-size: 13px; line-height: 16px; color: #999999; margin-left: 32px; margin-top: 6px;
`
const CheckBoxTxt3 = styled.Text`
  font-family: "noto400"; font-size: 12px; line-height: 15px; color: #999999; margin-left: 32px; margin-top: 6px;
`
const FinishPress = styled.Pressable`
  width:${windowWidth-32}px; height:50px; border-radius:8px; background-color:#DEDEDE; justify-content: center; align-items: center ;
  position: absolute; bottom:40px; left:16px;
`
const FinishTxt = styled.Text`
  font-family: "noto500"; font-size: 16px; line-height: 50px; color: #FFFFFF;
`
const TempTextPress = styled.Pressable`
  width:${windowWidth-32}px; padding-bottom: 10px;
`
const TempTxt = styled.Text`
  font-family: "noto400"; font-size: 12px; line-height: 18px; color: #999999; padding:0; text-align: center;
  padding:0 10px; 
`
const TempTxtLine = styled(TempTxt)`
  text-decoration: underline;
`


const Login_N = (props:any) => {
    
    const [isAgreeViewShow, setIsAgreeViewShow] = useState(false);
    const [isAllAgree, setIsAllAgree] = useState(false);
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [check4, setCheck4] = useState(false);
    const [check5, setCheck5] = useState(false);
    const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(false);

    const navigation:any = useNavigation();
    const animationPositionY = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        Animated.timing(animationPositionY, {
            toValue: 600,
            duration:600,
            useNativeDriver: true,
        }).start();
    },[])

    setTimeout(()=>{
        Animated.timing(animationPositionY, {
            toValue: 0,
            duration:600,
            useNativeDriver: true,
        }).start();
    },1000)
  
    function toggleAgreeAll(){
        setIsAllAgree(!isAllAgree);
        setCheck1(!isAllAgree);
        setCheck2(!isAllAgree);
        setCheck3(!isAllAgree);
        setCheck4(!isAllAgree);
        setCheck5(!isAllAgree);
    }

    function toggleOneCheck(num:number){
        if(num==1){ if(check1){setIsAllAgree(false)} setCheck1(!check1)}
        if(num==2){ if(check2){setIsAllAgree(false)} setCheck2(!check2)}
        if(num==3){ if(check3){setIsAllAgree(false)} setCheck3(!check3)}
        if(num==4){ if(check4){setIsAllAgree(false); setCheck5(false)}; setCheck4(!check4)}
        if(num==5){ if(check5){setIsAllAgree(false)}; if(!check5){setCheck4(true)};  setCheck5(!check5)}
    }
    
    const signInWithKakao = async () => {
        try {
            const token:any = await login(); //카카오로 부터 토큰 얻어오기
            const kakaoAccessToken:string = token.accessToken;
            const {accessToken, refreshToken, status}:any = await getWebTokenWithKakao(kakaoAccessToken);
            processLogin(accessToken, refreshToken, status);
        } catch (err) {
            console.error("login err", err);
        }
    };

    // 네이버 로그인
    const signInWithNaver = async () => {
        const consumerKey = 'VUPcGwO5m6hguqUTpi1v';
        const consumerSecret = 'oMA3lTaEpw';
        const appName = '오렌지보드';
        const serviceUrlScheme = Platform.OS ==='android'?'com.orangeboard' : 'naverloginfinal';
        try {
            const {failureResponse, successResponse} = await NaverLogin.login({
                appName,
                consumerKey,
                consumerSecret,
                serviceUrlScheme,
            });
        if(failureResponse!=undefined){return;}
            const naverAccessToken:any = successResponse?.accessToken;
            const {accessToken, refreshToken, status}:any = await getWebTokenWithNaverToken(naverAccessToken);
            processLogin(accessToken, refreshToken, status);
        } catch (err) {
            console.error("login err", err);
        }
    };


    /// 구글 로그인
    useEffect(()=>{
        googleSigninConfigure();
    },[]);

    const googleSigninConfigure = () => {
        GoogleSignin.configure({
            webClientId:'814764827491-rlfe03ev6efmsiaq968llth9bikn6102.apps.googleusercontent.com',
        })
    }

    const onGoogleButtonPress = async () => {
        const { idToken } = await GoogleSignin.signIn();
        const {accessToken:googleAccessToken}:any = await GoogleSignin.getTokens();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const {accessToken, refreshToken, status}:any = await getWebTokenWithGoogleToken(googleAccessToken);
        processLogin(accessToken, refreshToken, status);
        return auth().signInWithCredential(googleCredential);
    }

    // 애플 로그인
    let user:any = null;
    async function fetchAndUpdateCredentialState(updateCredentialStateForUser:any) {
        if (user === null) {
            updateCredentialStateForUser('N/A');
        } else {
            const credentialState = await appleAuth.getCredentialStateForUser(user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
                updateCredentialStateForUser('AUTHORIZED');
            } else {
                updateCredentialStateForUser(credentialState);
            }
        }
    }

    async function onAppleButtonPress(updateCredentialStateForUser:any) {
        // start a login request
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });
        
            //console.log('appleAuthRequestResponse', appleAuthRequestResponse);

            const {
                user: newUser,
                email,
                nonce,
                identityToken,
                realUserStatus,
            } = appleAuthRequestResponse;

            const fullName:any = appleAuthRequestResponse.fullName;
            const firstName:any = fullName.givenName;
            const lastName:any = fullName.familyName;

            const {accessToken, refreshToken, status}:any = await getWebTokenWithAppleToken(identityToken);
            processLogin(accessToken, refreshToken, status);
        
            user = newUser;
        
            fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
                updateCredentialStateForUser(error.code),
            );
            if (identityToken) {
                //console.log(nonce, identityToken);
            } else {
                //console.log('no token - failed sign-in?');
            }
        
            if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                //console.log("I'm a real person!");
            }
            console.warn(`Apple Authentication Completed, ${user}, ${email}`);
        } catch (error:any) {
            if (error.code === appleAuth.Error.CANCELED) {
                console.warn('User canceled Apple Sign in.');
            } else {
                console.error(error);
            }
        }
    }
    
    const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
    useEffect(() => {
        if (!appleAuth.isSupported) return;

        fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
            updateCredentialStateForUser(error.code),
        );
    }, []);

    useEffect(() => {
    if (!appleAuth.isSupported) return;
        return appleAuth.onCredentialRevoked(async () => {
            console.warn('Credential Revoked');
            fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
            updateCredentialStateForUser(error.code),
            );
        });
    }, []);



    async function onAppleButtonPressAtAndroid() {
        // Generate secure, random values for state and nonce
        const rawNonce = uuid();
        const state = uuid();
        
        // Configure the request
        appleAuthAndroid.configure({
            // The Service ID you registered with Apple
            clientId: 'org.name.orangeboard.service',
            redirectUri: 'https://orangeboard.kr/',
            responseType: appleAuthAndroid.ResponseType.ALL,
            scope: appleAuthAndroid.Scope.ALL,
            nonce: rawNonce,
            state,
        });
        
        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn();
        //console.log('response', response);
        
        const email:any = response.user?.email;
        const firstName:any = response.user?.name?.firstName;
        const lastName:any = response.user?.name?.lastName;
        const identityToken:any= response.id_token;
        //console.log('email, firstName, lastName', email, firstName, lastName);
        
        const {accessToken, refreshToken, status}:any = await getWebTokenWithAppleToken(identityToken);
        processLogin(accessToken, refreshToken, status);
    }



    async function processLogin(accessToken:string, refreshToken:string, status:string){
        if(accessToken=='303'){ //기존 가입 되어 있음!
            let OAuthType;
            if(refreshToken=='Kakao'){OAuthType='카카오'}
            else if(refreshToken=='Google'){OAuthType='구글'}
            else if(refreshToken=='Apple'){OAuthType='애플'}
            else if(refreshToken=='Naver'){OAuthType='네이버'}
            const txt = `동일한 이메일이 ${OAuthType}로 이미 가입 되어 있습니다. ${OAuthType}로 로그인 해 주세요.`;

            Alert.alert( //alert 사용										
                '안내!', txt, [ 					
                {text: '확인', onPress: () => {
                    checkNavigator(navigation, 'login', 'noParam');
                }}]									
            );							
        }else if(accessToken=='fail'){
            Alert.alert( //alert 사용										
                '이런!', '로그인에 실패 하였습니다. 다시 시도해 주세요.', [ 					
                {text: '확인', onPress: () => {} }, 				
            ]);		
        }else{
            if(status=='200'){  //로그인 처리
                finishLogin(accessToken, refreshToken);
    
            }else if(status=='201'){ //신규회원 : 가입동의 얻기
                setIsAgreeViewShow(true);
            }
        }
    }


    async function sendAgreementResult(){
        const deviceInfo = getModel();
        const fcmToken = await messaging().getToken();
        
        if(!check1 || !check2){
          Alert.alert( //alert 사용										
              '잠깐!', '필수 약관에 동의해 주세요.', [ //alert창 문구 작성									
              {text: '확인', onPress: () => {} }, //alert 버튼 작성								
            ]									
          );	
          return;
        }
    
        // DB 저장하기 처리 필요.
        const {accessToken:accessTokenFinal, refreshToken:refreshTokenFinal, status}:any = await insertAgreementAndPrivacy(check3, check4, check5, deviceInfo, fcmToken);
        processLogin(accessTokenFinal, refreshTokenFinal, status);
      }
    



    async function finishLogin(accessToken:string, refreshToken:string){
        const fcmToken = await messaging().getToken();
        let deviceInfo = getModel();
        await insertOrUpdateFcmToken(fcmToken, deviceInfo, accessToken);
        
        console.log('로그인 성공');
        await EncryptedStorage.setItem('accessToken',accessToken);
        await EncryptedStorage.setItem('refreshToken',refreshToken);
        setTimeout(()=>{
            checkNavigator(navigation, 'home' , {isReload:'n'});
        },10)
    }


    useEffect(() => {
        return () => {
            DeviceEventEmitter.emit('backFromHomeReload');
        }
    }, []);


    return (
        <LoginView>
            <ModalHeader />
            <StatusBar style="dark" />

            <LoginText>주식투자의 새로운 기준</LoginText>
            <LogoImg source={require('../assets/icons_w/orangeLogoLogin.png')} />


            
            <LogoBtnBoxView>
                <TempTextPress>
                <Pressable onPress={()=>{checkNavigator(navigation, 'authPolicy', {type:'agreement'})}}><TempTxt>로그인을 누르는 것으로 계정 연동에 대한 <TempTxtLine>이용약관</TempTxtLine>과</TempTxt></Pressable>
                <Pressable onPress={()=>{checkNavigator(navigation, 'authPolicy', {type:'privacy'});}}><TempTxt><TempTxtLine>개인정보 처리방침</TempTxtLine>에 동의하고 서비스를 이용합니다. </TempTxt></Pressable>
                </TempTextPress>

                <TouchableOpacity onPress={onGoogleButtonPress}>
                <LogoBtnBox style={{backgroundColor:'#FFFFFF', borderColor:'#E2E2E2', borderWidth:1}}>
                    <SnsLogoImg source={require('../assets/icons_w/google.png')}/>
                    <SnsLoginTxt>Google 계정으로 시작하기</SnsLoginTxt>
                </LogoBtnBox>
                </TouchableOpacity>

                <TouchableOpacity onPress={signInWithKakao}>
                <LogoBtnBox>
                    <SnsLogoImg source={require('../assets/icons_w/kakao.png')}/>
                    <SnsLoginTxt>카카오톡으로 시작하기</SnsLoginTxt>
                </LogoBtnBox>
                </TouchableOpacity>
                
                <TouchableOpacity onPress = {signInWithNaver} >
                <LogoBtnBox style={{backgroundColor:'#2DB400'}}>
                    <SnsLogoImg source={require('../assets/icons_w/naver.png')} style={{width:18}}/>
                    <SnsLoginTxt style={{color:'#FFFFFF'}}>네이버로 시작하기</SnsLoginTxt>
                </LogoBtnBox>
                </TouchableOpacity>
                
                {os=='ios'?
                <TouchableOpacity onPress={onAppleButtonPress} >
                <LogoBtnBox style={{backgroundColor:'#000000'}}>
                    <SnsLogoImg source={require('../assets/icons_w/apple.png')} style={{width:18}}/>
                    <SnsLoginTxt style={{color:'#FFFFFF'}}>Apple로 시작하기</SnsLoginTxt>
                </LogoBtnBox>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={onAppleButtonPressAtAndroid} >
                <LogoBtnBox style={{backgroundColor:'#000000'}}>
                    <SnsLogoImg source={require('../assets/icons_w/apple.png')} style={{width:18}}/>
                    <SnsLoginTxt style={{color:'#FFFFFF'}}>Apple로 시작하기</SnsLoginTxt>
                </LogoBtnBox>
                </TouchableOpacity>
                }

            </LogoBtnBoxView>
                
            {isAgreeViewShow&&
            <BlackOpacityView>
                <AgreementViewAnimated
                style={[{ transform: [{ translateY: animationPositionY }] }]}
                >
                <AgreementTxt1>약관에 동의해주세요</AgreementTxt1>
                <AgreementTxt2>여러분의 개인정보와 서비스 이용 권리{`\n`}잘 지켜드릴게요</AgreementTxt2>
                <Space style={{height:38}}/>
                <Pressable onPress={toggleAgreeAll}>
                    <CheckBoxView>
                        <CheckBoxImg source={isAllAgree?require('../assets/icons_w/orderChkActive.png'):require('../assets/icons_w/orderChk.png')} /> 
                    <CheckBoxTxtBold>모두동의</CheckBoxTxtBold>
                    </CheckBoxView>
                </Pressable>
                <CheckBoxTxt2>서비스 이용을 위해 아래 약관에 모두 동의합니다.</CheckBoxTxt2>
                
                <Space style={{height:24}}/>
                <LineE2E2E2 />
                <Space style={{height:24}}/>

                <CheckBoxView>
                    <Pressable onPress={()=>{toggleOneCheck(1)}}>
                    <CheckBoxImg source={check1?require('../assets/icons_w/orderChkActive.png'):require('../assets/icons_w/orderChk.png')} /> 
                    </Pressable>
                    <CheckBoxTxt>(필수) 개인정보 수집 및 이용 동의</CheckBoxTxt>
                    <SeeMoreTxtPress onPress={()=>{checkNavigator(navigation, 'authPolicy', {type:'privacy'})}}>
                    <SeeMoreTxt>보기</SeeMoreTxt>
                    </SeeMoreTxtPress>
                </CheckBoxView>
                <Space style={{height:16}}/>

                <CheckBoxView>
                    <Pressable onPress={()=>{toggleOneCheck(2)}}>
                    <CheckBoxImg source={check2?require('../assets/icons_w/orderChkActive.png'):require('../assets/icons_w/orderChk.png')} /> 
                    </Pressable>
                    <CheckBoxTxt>(필수) 서비스 이용 동의</CheckBoxTxt>
                    <SeeMoreTxtPress onPress={()=>{checkNavigator(navigation, 'authPolicy', {type:'service'})}}>
                    <SeeMoreTxt>보기</SeeMoreTxt>
                    </SeeMoreTxtPress>
                </CheckBoxView>
                <Space style={{height:16}}/>

                <CheckBoxView>
                    <Pressable onPress={()=>{toggleOneCheck(3)}}>
                    <CheckBoxImg source={check3?require('../assets/icons_w/orderChkActive.png'):require('../assets/icons_w/orderChk.png')} /> 
                    </Pressable>
                    <CheckBoxTxt>(선택) 광고성 정보 수신 동의</CheckBoxTxt>
                    <SeeMoreTxtPress onPress={()=>{checkNavigator(navigation, 'authPolicy', {type:'advertise'})}}>
                    <SeeMoreTxt>보기</SeeMoreTxt>
                    </SeeMoreTxtPress>
                </CheckBoxView>
                <Space style={{height:16}}/>


                <CheckBoxView>
                    <Pressable onPress={()=>{toggleOneCheck(4)}}>
                    <CheckBoxImg source={check4?require('../assets/icons_w/orderChkActive.png'):require('../assets/icons_w/orderChk.png')} /> 
                    </Pressable>
                    <CheckBoxTxt>(선택) 앱 PUSH 수신 동의</CheckBoxTxt>
                </CheckBoxView>
                <CheckBoxTxt3>(데일리 리포트/구독/서비스 및 혜택)</CheckBoxTxt3>
                <Space style={{height:16}}/>

                <CheckBoxView>
                    <Pressable onPress={()=>{toggleOneCheck(5)}}>
                    <CheckBoxImg source={check5?require('../assets/icons_w/orderChkActive.png'):require('../assets/icons_w/orderChk.png')} /> 
                    </Pressable>
                    <CheckBoxTxt>(선택) 야간 PUSH 수신동의</CheckBoxTxt>
                </CheckBoxView>
                <CheckBoxTxt3>21:00 ~ 08:00 사이의 알림</CheckBoxTxt3>
                

                <FinishPress 
                    style = {check1&& check2&& {backgroundColor:colors.orangeBorder}}
                    disabled = {isSendBtnDisabled}
                    onPress={sendAgreementResult}
                >
                    <FinishTxt>가입완료</FinishTxt>
                </FinishPress>
                </AgreementViewAnimated>

            </BlackOpacityView>}

        </LoginView>

    );
};

export default Login_N;
