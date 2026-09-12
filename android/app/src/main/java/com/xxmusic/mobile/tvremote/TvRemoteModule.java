package com.xxmusic.mobile.tvremote;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class TvRemoteModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private static final String TAG = "TvRemoteModule";

  TvRemoteModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "TvRemoteModule";
  }

  @ReactMethod
  public void addListener(String eventName) {
    Log.d(TAG, "addListener: " + eventName);
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    Log.d(TAG, "removeListeners: " + count);
  }
}

