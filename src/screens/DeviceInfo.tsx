/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component, useCallback, memo} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  NativeModules,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  getManufacturer,
  getManufacturerSync,
  syncUniqueId,
  getUniqueId,
  getUniqueIdSync,
  useBatteryLevel,
  useBatteryLevelIsLow,
  usePowerState,
  useFirstInstallTime,
  useDeviceName,
  useManufacturer,
  useHasSystemFeature,
  useIsEmulator,
  useIsHeadphonesConnected,
  useIsWiredHeadphonesConnected,
  useIsBluetoothHeadphonesConnected,
  useBrightness,
} from 'react-native-device-info';

const FunctionalComponent = () => {
  const batteryLevel = useBatteryLevel();
  const batteryLevelIsLow = useBatteryLevelIsLow();
  const powerState = usePowerState();
  const firstInstallTime = useFirstInstallTime();
  const deviceName = useDeviceName();
  const manufacturer = useManufacturer();
  const hasSystemFeature = useHasSystemFeature('amazon.hardware.fire_tv');
  const isEmulator = useIsEmulator();
  const isHeadphonesConnected = useIsHeadphonesConnected();
  const isWiredHeadphonesConnected = useIsWiredHeadphonesConnected();
  const isBluetoothHeadphonesConnected = useIsBluetoothHeadphonesConnected();
  const brightness = useBrightness();
  const deviceJSON = {
    batteryLevel,
    batteryLevelIsLow,
    powerState,
    firstInstallTime,
    deviceName,
    manufacturer,
    hasSystemFeature,
    isEmulator,
    isHeadphonesConnected,
    isWiredHeadphonesConnected,
    isBluetoothHeadphonesConnected,
    brightness,
  };
  deviceJSON.deviceId = DeviceInfo.getDeviceId();
    deviceJSON.bundleId = DeviceInfo.getBundleId();
    deviceJSON.systemName = DeviceInfo.getSystemName();
    deviceJSON.systemVersion = DeviceInfo.getSystemVersion();
    deviceJSON.version = DeviceInfo.getVersion();
    deviceJSON.readableVersion = DeviceInfo.getReadableVersion();
    deviceJSON.buildNumber = DeviceInfo.getBuildNumber();
    deviceJSON.isTablet = DeviceInfo.isTablet();
    deviceJSON.isLowRamDevice = DeviceInfo.isLowRamDevice();
    deviceJSON.isDisplayZoomed = DeviceInfo.isDisplayZoomed();
    deviceJSON.appName = DeviceInfo.getApplicationName();
    deviceJSON.brand = DeviceInfo.getBrand();
    deviceJSON.model = DeviceInfo.getModel();
    deviceJSON.deviceType = DeviceInfo.getDeviceType();
    deviceJSON.uniqueId = getUniqueIdSync();
    deviceJSON.manufacturer = getManufacturerSync();
    deviceJSON.buildId = DeviceInfo.getBuildIdSync();
    deviceJSON.isCameraPresent = DeviceInfo.isCameraPresentSync();
    deviceJSON.deviceName = DeviceInfo.getDeviceNameSync();
    deviceJSON.usedMemory = DeviceInfo.getUsedMemorySync();
    deviceJSON.instanceId = DeviceInfo.getInstanceIdSync();
    deviceJSON.installReferrer = DeviceInfo.getInstallReferrerSync();
    deviceJSON.installerPackageName = DeviceInfo.getInstallerPackageNameSync();
    deviceJSON.isEmulator = DeviceInfo.isEmulatorSync();
    deviceJSON.fontScale = DeviceInfo.getFontScaleSync();
    deviceJSON.hasNotch = DeviceInfo.hasNotch();
    deviceJSON.hasDynamicIsland = DeviceInfo.hasDynamicIsland();
    deviceJSON.firstInstallTime = DeviceInfo.getFirstInstallTimeSync();
    deviceJSON.lastUpdateTime = DeviceInfo.getLastUpdateTimeSync();
    deviceJSON.startupTime = DeviceInfo.getStartupTimeSync();
    deviceJSON.serialNumber = DeviceInfo.getSerialNumberSync();
    deviceJSON.androidId = DeviceInfo.getAndroidIdSync();
    deviceJSON.IpAddress = DeviceInfo.getIpAddressSync();
    // deviceJSON.MacAddress = DeviceInfo.getMacAddressSync(); // needs android.permission.ACCESS_WIFI_STATE
    deviceJSON.ApiLevel = DeviceInfo.getApiLevelSync();
    deviceJSON.carrier = DeviceInfo.getCarrierSync();
    deviceJSON.totalMemory = DeviceInfo.getTotalMemorySync();
    deviceJSON.maxMemory = DeviceInfo.getMaxMemorySync();
    deviceJSON.totalDiskCapacity = DeviceInfo.getTotalDiskCapacitySync();
    deviceJSON.totalDiskCapacityOld = DeviceInfo.getTotalDiskCapacityOldSync();
    deviceJSON.freeDiskStorage = {
      default: DeviceInfo.getFreeDiskStorageSync(),
      total: DeviceInfo.getFreeDiskStorageSync('total'),
      important: DeviceInfo.getFreeDiskStorageSync('important'),
      opportunistic: DeviceInfo.getFreeDiskStorageSync('opportunistic'),
    };
    deviceJSON.freeDiskStorageOld = DeviceInfo.getFreeDiskStorageOldSync();
    deviceJSON.batteryLevel = DeviceInfo.getBatteryLevelSync();
    deviceJSON.isLandscape = DeviceInfo.isLandscapeSync();
    deviceJSON.isAirplaneMode = DeviceInfo.isAirplaneModeSync();
    deviceJSON.isBatteryCharging = DeviceInfo.isBatteryChargingSync();
    deviceJSON.isPinOrFingerprintSet = DeviceInfo.isPinOrFingerprintSetSync();
    deviceJSON.supportedAbis = DeviceInfo.supportedAbisSync();
    deviceJSON.hasSystemFeature = DeviceInfo.hasSystemFeatureSync(
      'android.software.webview',
    );
    deviceJSON.getSystemAvailableFeatures = DeviceInfo.getSystemAvailableFeaturesSync();
    deviceJSON.powerState = DeviceInfo.getPowerStateSync();
    deviceJSON.isLocationEnabled = DeviceInfo.isLocationEnabledSync();
    deviceJSON.headphones = DeviceInfo.isHeadphonesConnectedSync();
    deviceJSON.headphonesWired = DeviceInfo.isWiredHeadphonesConnectedSync();
    deviceJSON.headphonesBluetooth = DeviceInfo.isBluetoothHeadphonesConnectedSync();
    deviceJSON.getAvailableLocationProviders = DeviceInfo.getAvailableLocationProvidersSync();
    deviceJSON.bootloader = DeviceInfo.getBootloaderSync();
    deviceJSON.device = DeviceInfo.getDeviceSync();
    deviceJSON.display = DeviceInfo.getDisplaySync();
    deviceJSON.fingerprint = DeviceInfo.getFingerprintSync();
    deviceJSON.hardware = DeviceInfo.getHardwareSync();
    deviceJSON.host = DeviceInfo.getHostSync();
    deviceJSON.hostNames = DeviceInfo.getHostNamesSync();
    deviceJSON.product = DeviceInfo.getProductSync();
    deviceJSON.tags = DeviceInfo.getTagsSync();
    deviceJSON.type = DeviceInfo.getTypeSync();
    deviceJSON.baseOS = DeviceInfo.getBaseOsSync();
    deviceJSON.previewSdkInt = DeviceInfo.getPreviewSdkIntSync();
    deviceJSON.securityPatch = DeviceInfo.getSecurityPatchSync();
    deviceJSON.codename = DeviceInfo.getCodenameSync();
    deviceJSON.incremental = DeviceInfo.getIncrementalSync();
    deviceJSON.brightness = DeviceInfo.getBrightnessSync();
    deviceJSON.supported32BitAbis = DeviceInfo.supported32BitAbisSync();
    deviceJSON.supported64BitAbis = DeviceInfo.supported64BitAbisSync();
    deviceJSON.hasGms = DeviceInfo.hasGmsSync(  deviceJSON.manufacturer = getManufacturerSync())
    deviceJSON.buildId = DeviceInfo.getBuildIdSync();
    deviceJSON.isCameraPresent = DeviceInfo.isCameraPresentSync();
    deviceJSON.deviceName = DeviceInfo.getDeviceNameSync();
    deviceJSON.usedMemory = DeviceInfo.getUsedMemorySync();
    deviceJSON.instanceId = DeviceInfo.getInstanceIdSync();
    deviceJSON.installReferrer = DeviceInfo.getInstallReferrerSync();
    deviceJSON.installerPackageName = DeviceInfo.getInstallerPackageNameSync();
    deviceJSON.isEmulator = DeviceInfo.isEmulatorSync();
    deviceJSON.fontScale = DeviceInfo.getFontScaleSync();
    deviceJSON.hasNotch = DeviceInfo.hasNotch();
    deviceJSON.hasDynamicIsland = DeviceInfo.hasDynamicIsland();
    deviceJSON.firstInstallTime = DeviceInfo.getFirstInstallTimeSync();
    deviceJSON.lastUpdateTime = DeviceInfo.getLastUpdateTimeSync();
    deviceJSON.startupTime = DeviceInfo.getStartupTimeSync();
    deviceJSON.serialNumber = DeviceInfo.getSerialNumberSync();
    deviceJSON.androidId = DeviceInfo.getAndroidIdSync();
    deviceJSON.IpAddress = DeviceInfo.getIpAddressSync();
    // deviceJSON.MacAddress = DeviceInfo.getMacAddressSync(); // needs android.permission.ACCESS_WIFI_STATE
    deviceJSON.ApiLevel = DeviceInfo.getApiLevelSync();
    deviceJSON.carrier = DeviceInfo.getCarrierSync();
    deviceJSON.totalMemory = DeviceInfo.getTotalMemorySync();
    deviceJSON.maxMemory = DeviceInfo.getMaxMemorySync();
    deviceJSON.totalDiskCapacity = DeviceInfo.getTotalDiskCapacitySync();
    deviceJSON.totalDiskCapacityOld = DeviceInfo.getTotalDiskCapacityOldSync();
    deviceJSON.freeDiskStorage = {
      default: DeviceInfo.getFreeDiskStorageSync(),
      total: DeviceInfo.getFreeDiskStorageSync('total'),
      important: DeviceInfo.getFreeDiskStorageSync('important'),
      opportunistic: DeviceInfo.getFreeDiskStorageSync('opportunistic'),
    };
    deviceJSON.freeDiskStorageOld = DeviceInfo.getFreeDiskStorageOldSync();
    deviceJSON.batteryLevel = DeviceInfo.getBatteryLevelSync();
    deviceJSON.isLandscape = DeviceInfo.isLandscapeSync();
    deviceJSON.isAirplaneMode = DeviceInfo.isAirplaneModeSync();
    deviceJSON.isBatteryCharging = DeviceInfo.isBatteryChargingSync();
    deviceJSON.isPinOrFingerprintSet = DeviceInfo.isPinOrFingerprintSetSync();
    deviceJSON.supportedAbis = DeviceInfo.supportedAbisSync();
    deviceJSON.hasSystemFeature = DeviceInfo.hasSystemFeatureSync(
      'android.software.webview',
    );
    deviceJSON.getSystemAvailableFeatures = DeviceInfo.getSystemAvailableFeaturesSync();
    deviceJSON.powerState = DeviceInfo.getPowerStateSync();
    deviceJSON.isLocationEnabled = DeviceInfo.isLocationEnabledSync();
    deviceJSON.headphones = DeviceInfo.isHeadphonesConnectedSync();
    deviceJSON.headphonesWired = DeviceInfo.isWiredHeadphonesConnectedSync();
    deviceJSON.headphonesBluetooth = DeviceInfo.isBluetoothHeadphonesConnectedSync();
    deviceJSON.getAvailableLocationProviders = DeviceInfo.getAvailableLocationProvidersSync();
    deviceJSON.bootloader = DeviceInfo.getBootloaderSync();
    deviceJSON.device = DeviceInfo.getDeviceSync();
    deviceJSON.display = DeviceInfo.getDisplaySync();
    deviceJSON.fingerprint = DeviceInfo.getFingerprintSync();
    deviceJSON.hardware = DeviceInfo.getHardwareSync();
    deviceJSON.host = DeviceInfo.getHostSync();
    deviceJSON.hostNames = DeviceInfo.getHostNamesSync();
    deviceJSON.product = DeviceInfo.getProductSync();
    deviceJSON.tags = DeviceInfo.getTagsSync();
    deviceJSON.type = DeviceInfo.getTypeSync();
    deviceJSON.baseOS = DeviceInfo.getBaseOsSync();
    deviceJSON.previewSdkInt = DeviceInfo.getPreviewSdkIntSync();
    deviceJSON.securityPatch = DeviceInfo.getSecurityPatchSync();
    deviceJSON.codename = DeviceInfo.getCodenameSync();
    deviceJSON.incremental = DeviceInfo.getIncrementalSync();
    deviceJSON.brightness = DeviceInfo.getBrightnessSync();
    deviceJSON.supported32BitAbis = DeviceInfo.supported32BitAbisSync();
    deviceJSON.supported64BitAbis = DeviceInfo.supported64BitAbisSync();
    deviceJSON.hasGms = DeviceInfo.hasGmsSync();
    deviceJSON.hasHms = DeviceInfo.hasHmsSync();
    deviceJSON.isMouseConnected = DeviceInfo.isMouseConnectedSync();
    deviceJSON.isKeyboardConnected = DeviceInfo.isKeyboardConnectedSync();
    deviceJSON.getSupportedMediaTypeListSync = DeviceInfo.getSupportedMediaTypeListSync();


    deviceJSON.hasHms = DeviceInfo.hasHmsSync();
    deviceJSON.isMouseConnected = DeviceInfo.isMouseConnectedSync();
    deviceJSON.isKeyboardConnected = DeviceInfo.isKeyboardConnectedSync();
    deviceJSON.getSupportedMediaTypeListSync = DeviceInfo.getSupportedMediaTypeListSync();



  return (
    <ScrollView>
      <Text style={styles.instructions} testID="hooks tab contents">
        {JSON.stringify(deviceJSON, null, '  ')}
      </Text>
    </ScrollView>
  );
};

export default FunctionalComponent;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'left',
    color: 'black',
    margin: 5,
    fontSize:17
  },
  tabBar: {
    flexDirection: 'row',
    borderTopColor: '#333333',
    borderTopWidth: 1,
  },
  tab: {
    height: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#333333',
  },
  boldText: {
    fontWeight: '700',
  },
});