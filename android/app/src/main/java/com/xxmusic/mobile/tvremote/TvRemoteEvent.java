package com.xxmusic.mobile.tvremote;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class TvRemoteEvent {
  public static final String TV_KEY_EVENT = "tv-remote-key";

  private final ReactApplicationContext reactContext;

  TvRemoteEvent(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  public void sendKeyEvent(int keyCode, String action) {
    WritableMap params = Arguments.createMap();
    params.putInt("keyCode", keyCode);
    params.putString("action", action);
    params.putString("keyName", getKeyName(keyCode));
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(TV_KEY_EVENT, params);
  }

  private String getKeyName(int keyCode) {
    switch (keyCode) {
      case 19: return "DPAD_UP";
      case 20: return "DPAD_DOWN";
      case 21: return "DPAD_LEFT";
      case 22: return "DPAD_RIGHT";
      case 23: return "DPAD_CENTER";
      case 66: return "ENTER";
      case 4:  return "BACK";
      case 82: return "MENU";
      case 24: return "VOLUME_UP";
      case 25: return "VOLUME_DOWN";
      case 26: return "POWER";
      case 27: return "CAMERA";
      case 85: return "MEDIA_PLAY_PAUSE";
      case 86: return "MEDIA_STOP";
      case 87: return "MEDIA_NEXT";
      case 88: return "MEDIA_PREVIOUS";
      case 89: return "MEDIA_REWIND";
      case 90: return "MEDIA_FAST_FORWARD";
      case 126: return "MEDIA_PLAY";
      case 127: return "MEDIA_PAUSE";
      default: return "KEY_" + keyCode;
    }
  }
}

