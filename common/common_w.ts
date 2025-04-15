import EncryptedStorage from 'react-native-encrypted-storage';

export async function getTokens(){
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    return {accessToken, refreshToken}
}

export async function sendDataToWeb(webViewRef:any, type:string, data:any){
    const sendData =JSON.stringify({type,data});
    webViewRef.current.postMessage(sendData);
}