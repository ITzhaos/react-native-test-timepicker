package com.tplink.react_native_tp_app_timepicker;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.tplink.react_native_tp_app_timepicker.view.*;

import java.util.Map;

import javax.annotation.Nullable;


/**
 * @className: RCTTimePicker 提供给android的时间选择控件，表现效果和ios相同
 * @description: 移植自云路由的RCTTImePicker控件
 * @author: create at 2021-1-19, by zhaoshi
 */
public class RCTTPTimePickerModule extends SimpleViewManager<TimePicker> {
    public static final String REACT_CLASS = "RCTTPTimePickerModule";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public TimePicker createViewInstance(ThemedReactContext reactContext) {
        TimePicker mPicker = new TimePicker(reactContext);
        mPicker.setIs24HourView(true);
        mPicker.setOnTimeChangedListener(new TPOnTimeChangeListener(mPicker));
        return mPicker;
    }

    @ReactProp(name = "enable", defaultBoolean = true)
    public void setEnable(TimePicker mPicker, final boolean enable) {
        mPicker.setEnabled(enable);
    }

    @ReactProp(name = "hour", defaultInt = 0)
    public void setHour(TimePicker mPicker, final int hour) {
        mPicker.setCurrentHour(hour);
    }

    @ReactProp(name = "minute", defaultInt = 0)
    public void setMinute(TimePicker mPicker, final int minute) {
        mPicker.setCurrentMinute(minute);
    }

    @Nullable
    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        "timeChanged",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onTimeChanged")))
                .build();
    }

    private class TPOnTimeChangeListener implements TimePicker.OnTimeChangedListener {
        private TimePicker mPicker;

        TPOnTimeChangeListener(TimePicker mPicker) {
            this.mPicker = mPicker;
        }

        @Override
        public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
            WritableMap event = Arguments.createMap();
            event.putInt("selectHour", hourOfDay);
            event.putInt("selectMinute", minute);
            ReactContext reactContext = (ReactContext) mPicker.getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    mPicker.getId(),
                    "timeChanged",
                    event
            );
        }
    }
}
