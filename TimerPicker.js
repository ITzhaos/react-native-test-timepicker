/**
 * @className: TimePicker 时间选择器
 * @description: 该控件为固定在屏幕上非弹出的时间选择器，弹出的请使用react-native-picker
 *               该控件在分平台分别创建控件，IOS使用的是PickerIOS的rn官方控件
 *               andriod因为需要与IOS实现相同的效果实现了一个android原生的RCT组件
 * 特别注意: 因为android控件的分割线与NumberPicker固定在一起，所以暂时使用绝对定位的方式在rn层画两个分割线
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, PickerIOS, requireNativeComponent,Platform } from 'react-native';

let RCTTimePickerAndroid = requireNativeComponent('RCTTPTimePickerModule');

function str2d(d: number): string {
    let strTime = d.toString();
    if (strTime.length >= 2) {
        return strTime;
    } else {
        return '0' + strTime;
    }
}

export default class TPTimePicker extends Component {
    constructor(props: TimePickerPropsType) {
        super(props);
        this.state = {
            hour: this.props.selectHour,
            minute: this.props.selectMinute
        }
    }

    shouldComponentUpdate(
        nextProps: TimePickerPropsType,
        nextState: TimePickerStateType,
        nextContext: any,
    ) {
        if (nextProps.selectHour !== this.state.hour
            || nextProps.selectMinute !== this.state.minute) {
            this.state.hour = nextProps.selectHour;
            this.state.minute = nextProps.selectMinute;
            return true;
        }

        if (nextState.hour !== this.state.hour
            || nextState.minute !== this.state.minute) {
            return true;
        }

        return false;
    }

    render() {
        if (Platform.OS === 'android') {
            return this._androidTimePicker();
        } else {
            return this._iOSTimePicker();
        }
    }

    _androidTimePicker() {
        return (
            <RCTTimePickerAndroid
                {...this.props}
                style={[{
                    backgroundColor: 'white'
                }, this.props.style]}
                hour={this.state.hour}
                minute={this.state.minute}
                onTimeChanged={this._onTimeChanged.bind(this)}
            />
        );
    }

    _iOSTimePicker() {
        return (
            <View style={[{
                backgroundColor: 'white',
                flexDirection: 'row'
            }, this.props.style]}>
                <View style={{
                    height: 42,
                    alignSelf: 'center',
                    position: 'absolute',
                    width: '100%',
                    borderTopWidth: 0.6,
                    borderBottomWidth: 0.6,
                    borderColor: 'rgba(0, 0, 0, 0.4)',
                }} />
                <PickerIOS style={{ flex: 1, height: '100%' }}
                    itemStyle={styles.pickerHourItem}
                    selectedValue={this.state.hour}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ hour: itemValue }, () => {
                            this.props.onValueChange(this._currentTime());
                        })
                    }}
                >
                    {this._hours()}
                </PickerIOS>
                <PickerIOS style={{ flex: 1, height: '100%' }}
                    itemStyle={styles.pickerMinuteItem}
                    selectedValue={this.state.minute}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ minute: itemValue }, () => {
                            this.props.onValueChange(this._currentTime());
                        })
                    }}
                >
                    {this._minutes()}
                </PickerIOS>
            </View>
        );
    }

    _hours() {
        let items = [];
        for (let i = 0; i < 24; ++i) {
            // 0~23
            items.push(<PickerIOS.Item label={str2d(i)}
                value={i} key={i} />)
        }

        return items;
    }
    _minutes() {
        let items = [];
        for (let i = 0; i < 60; ++i) {
            items.push(<PickerIOS.Item label={str2d(i)} value={i} key={i} />)
        }
        return items;
    }

    _currentTime = () => {
        return `${str2d(this.state.hour)}:${str2d(this.state.minute)}`;
    }

    _onTimeChanged(event) {
        let nativeEvent = event.nativeEvent;
        if (nativeEvent) {
            this.state.hour = nativeEvent.selectHour;
            this.state.minute = nativeEvent.selectMinute;
            this.props.onValueChange(this._currentTime());
        }
    }
}

const styles = StyleSheet.create({
    pickerHourItem: {
        flex: 1,
        color: 'black',
        fontSize: 20,
        letterSpacing: 0.2,
        textAlign: 'center',
        marginLeft: '60%'
    },
    pickerMinuteItem: {
        flex: 1,
        color: 'black',
        fontSize: 20,
        letterSpacing: 0.2,
        textAlign: 'center',
        marginRight: '60%'
    }
});