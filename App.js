
//리덕스용 
import store from './store';
import AppInnerForRedux from './AppInnerForRedux';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { Text, TextInput} from 'react-native';


// 안드로이드 Text 확대 방지 적용
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default function App() {

    return (
        <Provider store={store}>
        <StatusBar style='dark' />
        <AppInnerForRedux />
        </Provider>
    );
}
