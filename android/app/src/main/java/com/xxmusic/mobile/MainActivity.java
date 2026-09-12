package com.xxmusic.mobile;

import android.util.Log;
import android.view.KeyEvent;

import com.reactnativenavigation.NavigationActivity;
import com.reactnativenavigation.react.ReactEventEmitter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.xxmusic.mobile.tvremote.TvRemoteEvent;

public class MainActivity extends NavigationActivity {
  private static final String TAG = "MainActivity";
  private TvRemoteEvent tvRemoteEvent;

  @Override
  public void onResume() {
    super.onResume();
  }

  @Override
  public void onBackPressed() {
    super.onBackPressed();
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
    int keyCode = event.getKeyCode();
    String action = event.getAction() == KeyEvent.ACTION_DOWN ? "down" : "up";

    // Filter DPAD keys and media control keys
    if (isTvRemoteKey(keyCode)) {
      if (tvRemoteEvent == null) {
        tvRemoteEvent = new TvRemoteEvent(getReactNativeHost().getReactInstanceManager()
          .getCurrentReactContext());
      }
      if (tvRemoteEvent != null) {
        tvRemoteEvent.sendKeyEvent(keyCode, action);
      }

      // Handle key down events for navigation
      if (event.getAction() == KeyEvent.ACTION_DOWN) {
        switch (keyCode) {
          case KeyEvent.KEYCODE_BACK:
            return super.dispatchKeyEvent(event);
          case KeyEvent.KEYCODE_DPAD_UP:
          case KeyEvent.KEYCODE_DPAD_DOWN:
          case KeyEvent.KEYCODE_DPAD_LEFT:
          case KeyEvent.KEYCODE_DPAD_RIGHT:
          case KeyEvent.KEYCODE_DPAD_CENTER:
          case KeyEvent.KEYCODE_ENTER:
          case KeyEvent.KEYCODE_MENU:
            // Let JS handle these through the event system
            return true;
          default:
            return super.dispatchKeyEvent(event);
        }
      }
    }

    return super.dispatchKeyEvent(event);
  }

  private boolean isTvRemoteKey(int keyCode) {
    switch (keyCode) {
      case KeyEvent.KEYCODE_DPAD_UP:
      case KeyEvent.KEYCODE_DPAD_DOWN:
      case KeyEvent.KEYCODE_DPAD_LEFT:
      case KeyEvent.KEYCODE_DPAD_RIGHT:
      case KeyEvent.KEYCODE_DPAD_CENTER:
      case KeyEvent.KEYCODE_DPAD_UP_LEFT:
      case KeyEvent.KEYCODE_DPAD_UP_RIGHT:
      case KeyEvent.KEYCODE_DPAD_DOWN_LEFT:
      case KeyEvent.KEYCODE_DPAD_DOWN_RIGHT:
      case KeyEvent.KEYCODE_ENTER:
      case KeyEvent.KEYCODE_BACK:
      case KeyEvent.KEYCODE_MENU:
      case KeyEvent.KEYCODE_VOLUME_UP:
      case KeyEvent.KEYCODE_VOLUME_DOWN:
      case KeyEvent.KEYCODE_POWER:
      case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
      case KeyEvent.KEYCODE_MEDIA_STOP:
      case KeyEvent.KEYCODE_MEDIA_NEXT:
      case KeyEvent.KEYCODE_MEDIA_PREVIOUS:
      case KeyEvent.KEYCODE_MEDIA_REWIND:
      case KeyEvent.KEYCODE_MEDIA_FAST_FORWARD:
      case KeyEvent.KEYCODE_MEDIA_PLAY:
      case KeyEvent.KEYCODE_MEDIA_PAUSE:
      case KeyEvent.KEYCODE_TV_POWER:
      case KeyEvent.KEYCODE_TV_INPUT:
      case KeyEvent.KEYCODE_GUIDE:
      case KeyEvent.KEYCODE_INFO:
      case KeyEvent.KEYCODE_CHANNEL_UP:
      case KeyEvent.KEYCODE_CHANNEL_DOWN:
        return true;
      default:
        return false;
    }
  }
}

