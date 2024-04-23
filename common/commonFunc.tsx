import { useAppDispatch } from "../store";
import userSlice from "../slices/user";
import { Dimensions, Platform } from "react-native";
import { getModel } from "react-native-device-info";
import moment from "moment-timezone";
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
//리듀서 사용 세팅
//const dispatch = useAppDispatch();

export function setCurrentPage(dispatch:any, page:string){
    dispatch(userSlice.actions.setCurrentPage(page))
    dispatch(userSlice.actions.setPageStack(page))
}

export function setCurrentPageForAndroidBackBtn(dispatch:any, page:string, btnName:string){
    dispatch(userSlice.actions.setCurrentPage(page))
    dispatch(userSlice.actions.setPageStack(btnName))
}


export function thousandComma(num:any){
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function decimalRound(num:number, round:number){ 
    if(round==0){return Math.round(num);}
    else if(round==1){return Math.round(num * 10) / 10;}
    else if(round==2){return Math.round(num * 100) / 100;}
    else if(round==3){return Math.round(num * 1000) / 1000;}
    else if(round==4){return Math.round(num * 10000) / 10000;}
    else if(round==5){return Math.round(num * 100000) / 100000;}
    else{return -1}
}


export function  getAdjustedHeight(currentWidth:number, currentHeight:number, windowWidth:number){
    return currentHeight*windowWidth/currentWidth;
}

export function changeDataTypeDot(date:string){
    return date?.replace("-",'.')?.replace("-",'.')?.substring(0,10);
}

export function changeDataTypKorean(date:string){
    return date?.replace("-",'년 ')?.replace("-",'월 ')?.substring(0,12)+'일';
}
export function changeDataTypeMMDashDD(date:string){
    return date?.replace("-",'/')?.replace("-",'/').replace(".",'/')?.replace(".",'/').substring(5,10);
}

export function changeDateTypeWithSeconds(date:string){
    const year = date?.substring(2,4)+'.';
    const monthDate = date.replace("-",'.')?.replace("-",'.')?.substring(5,10);
    const hourSec =date.substring(11,19);
    return year+monthDate+' '+hourSec;
}

export function addNineHourToUtcTime(date:string){
    let returnDate = new Date(date);
    returnDate.setHours(returnDate.getHours()+9);
    return returnDate.toISOString();
}

export function getDayOfWeek(dateString:string) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const dayOfWeek = daysOfWeek[dayIndex];
    return dayOfWeek;
}

export function getToday(){
    // const today = new Date();
    const today = new Date(new Date().getTime() + 540*60*1000); 
    const year = today.getFullYear();
    
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}

export function getTodayStr(){
    // const today = new Date();
    const today = new Date(new Date().getTime()); 
    const year = today.getFullYear();
    
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}

export function getTodayForMainTop3(){
    const today = new Date(new Date().getTime());  
    const year:any = today.getFullYear()+"";
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    let hour:any = today.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }

    let minute:any = today.getMinutes();
    minute = Math.floor(minute/10)*10;
    if (minute < 10) {
        minute = '0' + minute;
    }
    return year.substring(2,4) + '.' + month + '.' + day +" "+ hour+"시" + minute+"분 기준";
}

export function getDday(targetDate:string) {
    const today = moment().tz('Asia/Seoul');
    const target = moment(targetDate).tz('Asia/Seoul');
    const diffDays = target.diff(today, 'days');
    return diffDays;
}


export function getHowManyDaysBefore(date:any){
    const isKst = date.includes('T');
    // 시간에 T가 포함되어 있으면 9시간 안더해줌!
    const dateMoment = isKst? moment(date) : moment(date).add(9, 'h'); //표준시간 + 9시간
    const now = moment().add(9, 'h')  //표준시간 + 9시간
    const timeGap = now.diff(dateMoment, "milliseconds"); // 47436292714
    // console.log(timeGap)

    
    const minuteGap = decimalRound(timeGap / (1000*60),0) ;  
    const hourGap = decimalRound(timeGap / (1000*60*60),0) ;  
    const dateGap = decimalRound(timeGap / (1000*60*60*24),0) ;
    let returnVal = '';
    if(minuteGap==0){returnVal='지금'}
    else if(minuteGap<60){returnVal=`${minuteGap}분전`}
    else if(hourGap<24){returnVal=`${hourGap}시간전`}
    else if(dateGap<31){returnVal=`${dateGap}일전`}
    else if(dateGap<=365){
        returnVal= decimalRound(dateGap/30,0)+'개월전'
    }else{
        returnVal= decimalRound(dateGap/30/12,0)+'년전'
    }
    return returnVal;
}

export function getWindowWidth(){
    return Dimensions.get('window').width;
}

export function getWindowHeight(){
    return Dimensions.get('window').height;
}
export function  getDevidedPrice(price:number){
    let returnVal;
    if(price>=1000000000000 || price<=-1000000000000){
        returnVal = decimalRound(price/1000000000000, 1)+"조";
    }else{
        returnVal = decimalRound(price/100000000, 0);
        returnVal = thousandComma(returnVal)+"억";
    }
    return returnVal;
}

export function getAverage(arr:any) {
    let result = 0;
    for (let i = 0; i <arr.length; i++) {
        result += arr[i]*1;
    }
    return result / arr.length
}

export function getMax(arr:any){
	return Math.max.apply(null, arr);
}

export function getMin(arr:any){
	return Math.min.apply(null, arr)
}


export function getMedian(arr:any){
	let tempArr = arr;
	
	tempArr.sort();
	let center:number = parseInt((arr.length / 2)+''); // 요소 개수의 절반값 구하기
	
	if (arr.length % 2 == 1) { // 요소 개수가 홀수면
	    return arr[center]*1; // 홀수 개수인 배열에서는 중간 요소를 그대로 반환
	}else{
	    return (arr[center-1]*1 + arr[center]*1) / 2.0; // 짝수 개 요소는, 중간 두 수의 평균 반환
	}
}

export function getSum(arr:any) {
    let result = 0;
    for (let i = 0; i <arr.length; i++) {
        result += arr[i]*1;
    }
    return result;
}


export function getRandomId(){
	var timeId = "timeId"+Date.now()*1;
	var random4Digit = Math.floor(Math.random() * 1001);
	return timeId+random4Digit;
}




export function getStockPriceCut(isKospi:string, price:number){
	//console.log(isKospi, price);
	let returnVal:number =0;
	
	if(price<1000){returnVal =  decimalRound(price, 0);}
	else if(price>=1000 && price<5000){ returnVal = Math.round(price/5)*5; }
	else if(price>=5000 && price<10000){ returnVal = Math.round(price/10)*10; }
	else if(price>=10000 && price<50000){ returnVal = Math.round(price/50)*50; }
	else if(price>=50000 && price<100000){ returnVal = Math.round(price/100)*100; }
	else if(price>=100000 && price<500000){ 
		if(isKospi=='kospi'){returnVal = Math.round(price/500)*500; }
		else{returnVal = Math.round(price/100)*100; }
	}
	else if(price>=500000 ){ 
		if(isKospi=='kospi'){returnVal = Math.round(price/1000)*1000; }
		else{returnVal = Math.round(price/100)*100; }
	}
	
	if(price < 0){returnVal=0;}
	return returnVal;
}




export function addRandomColorToJsonArr(arr:any){
    const backColorArr = ['#000E8E','#FD841F','#3E6D9C','#001253','#5F9DF7','#008E4A','#DDDDDD','#E14D2A','#00FFA3','#E4C1FF'];
    const fontColorArr = ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#000000','#FFFFFF','#000000','#000000'];

    let returnData = arr.map((item:any, idx:number)=>{
        const usingIdx = idx%10;
        item.color = backColorArr[usingIdx];
        item.textColor = fontColorArr[usingIdx];
        item.id = item.stockCode;
        return item;
    }) ;
    return returnData;
}

export function getIphoneBottomInfo(){ 
    let result = true;
    let model = getModel().substring(0,8);
    //i폰 4,5,6,7,8 (plus 포함)은 하단 안전공간 필요없으므로 안드로이드와 같은처리
    if(model=='iPhone 4' || model=='iPhone 5' || model=='iPhone 6' || model=='iPhone 7'|| model=='iPhone 8'){result=false;}
    //i폰 제외한 모든 폰은 하단 안전공간 없애기
    if(model.substring(0,6)!='iPhone'){result=false;}
    return result;  //true면 하단공간 필요한 iphone, false면 안드로이드 및 구형아이폰
}

export function deleteArray(arr:string[], delValue:string){
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == delValue)  {
          arr.splice(i, 1);
          i--;
        }
      }
    return arr;
}


export function getIsLockReport(readAvailableTime:any){
    let isLock = true; 
    if(readAvailableTime==null){
        isLock = true;
    }else{
        const today = new Date(new Date().getTime() + 540*60*1000); 
        const readLimit = new Date(readAvailableTime);
        isLock = readLimit > today; 
    }
    return isLock;
}

export function isSlideAvailable(startTime:any, endTime:any){
    const todayStr:any = moment(new Date()).add(9, 'h');
    const today = new Date(todayStr)
    return today >= new Date(startTime) && today <= new Date(endTime);
}

export function getWeekOfMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 월의 첫째 날의 요일(0: 일요일, 1: 월요일, ..., 6: 토요일)
    const currentDate = date.getDate();
    const offset = (currentDate + firstDayOfWeek - 1) / 7; // 현재 날짜를 월 첫째 주의 몇 번째 요일로 계산
  
    // 올림 처리하여 몇 번째 주인지 계산
    return Math.ceil(offset);
}
  

export function replaceAllStr(inputString:string, search:string, replacement:string) {
    return inputString.split(search).join(replacement);
}

export function changeChatDate(dateString:string) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth는 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()]; // 요일을 가져옵니다.

    // 월과 일이 한 자리 숫자인 경우 두 자리로 변환합니다.
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const formattedDate = `${year}년 ${formattedMonth}월 ${formattedDay}일 ${dayOfWeek}요일`;
    return formattedDate;
}

export function convertToAMPM(dateTimeString:string) {
    const koreanTime = moment(dateTimeString).subtract(9, 'h').tz('Asia/Seoul').format('A HH:mm').replace('AM', '오전').replace('PM', '오후');; // A는 오전/오후를 표시하는 기호
    return koreanTime;
}

export const fileDownload = async (BASE_URL:string, filePath:string, fileName:string) =>{

    try {
        const { config, fs } = RNFetchBlob;
        const { DownloadDir, DocumentDir } = fs.dirs;

        const fileUrl = BASE_URL+filePath;
        // const downloadDest = Platform.OS === 'ios' ? `${RNFS.DocumentDirectoryPath}/${fileName}` : `${RNFS.ExternalDirectoryPath}/${fileName}`
        const downloadDest = Platform.OS ==='ios'?`${DocumentDir}/${fileName}`:`${DownloadDir}/${fileName}`
        console.log(downloadDest);
        const exist = await RNFS.exists(downloadDest);
        console.log(exist);
        
        if (exist) {
            await RNFS.unlink(downloadDest);
        }


        const options = {
            fromUrl: fileUrl,
            toFile: downloadDest,
            background: true,
            discretionary: true,
        };
    
        const download = RNFS.downloadFile(options);
    
        download.promise.then(res => {
            // 파일 다운로드 완료 후 처리할 작업
            console.log('파일 다운로드 성공', res);
        }).catch(err => {
            console.error('파일 다운로드 실패', err);
        });

    } catch (error) {
        
    }
}

export const fileDown = async (BASE_URL:string, fileUrl:string, fileName:string) =>{
    const { config, fs } = RNFetchBlob;
    const { DownloadDir, DocumentDir } = fs.dirs;
    let downUrl = BASE_URL+fileUrl;

    const filePath = Platform.OS==='ios'?`${DocumentDir}/${fileName}`:`${DownloadDir}/${fileName}`

    try {
        const res:any = await RNFetchBlob.config({
            fileCache: true,
            path: filePath,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: fileName,
                path: filePath,
            },
        }).fetch('GET', downUrl);
    
        // iOS에서 파일 저장
        if (Platform.OS === 'ios') {
          fs.writeFile(filePath, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(filePath);
        }
        console.log('파일이 다운로드되었습니다.', res.path() );
    } catch (error) {
        console.error('파일 다운로드 중 오류 발생:', error);
    }

}