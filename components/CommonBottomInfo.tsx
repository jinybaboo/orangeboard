import styled from "styled-components/native";


const CommonBottomInfoView = styled.View`
   width:100%;
   background-color: #F6F6F6;
   margin-top: 10px;
   padding:16px 24px;
`

const CommonBottomInfoText1 = styled.Text`
    font-family: 'noto400';
    font-size: 14px;
    line-height:18px;
    color:#777777;
`

const CommonBottomInfoText2 = styled(CommonBottomInfoText1)`
    line-height:20px;
`

const CommonBottomInfo = () =>{

    return (
        <CommonBottomInfoView>
            <CommonBottomInfoText1>데이터 출처</CommonBottomInfoText1>
            <CommonBottomInfoText2>시세 및 기업 재무 정보 : KOSCOM</CommonBottomInfoText2>
            
            <CommonBottomInfoText1 style={{marginTop:22}}>유의 사항</CommonBottomInfoText1>
            <CommonBottomInfoText2>오렌지보드에서 제공하는 종목정보는 신뢰할만한 공급자로부터 데이터를 제공받아 분석, 가공하나 지연, 오류가 발생할 수 있습니다.</CommonBottomInfoText2>

            
        </CommonBottomInfoView>
    );
}
export default CommonBottomInfo;