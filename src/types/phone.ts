export type ChassisMaterial = 
  | 'transparent_glass' 
  | 'titanium_grade5' 
  | 'billet_aluminum' 
  | 'ceramic_matte' 
  | 'cyber_polycarbonate' 
  | 'ballistic_kevlar';

export type PhoneColor = {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  frameHex: string;
};

export type DisplaySize = '5.9' | '6.36' | '6.78' | '7.2';
export type DisplayTech = 'ltpo_amoled' | 'microled' | 'dual_layer_eink' | 'retro_flat_oled';
export type FrontCameraCut = 'under_display' | 'center_punch' | 'dev_sensor_bar' | 'compact_pill';
export type CameraLayout = 'pixel_visor' | 'hex_matrix' | 'triple_monolith' | 'minimal_flush' | 'asymmetric_dev';
export type PrimarySensor = '50mp_1inch' | '200mp_hp2' | '108mp_monochrome';
export type DevSensor = 'flir_thermal' | 'tof_lidar' | 'microscope_macro' | 'spectral_meter' | 'none';

export type SocType = 
  | 'riscv_opencore12' 
  | 'tensor_g6_dev' 
  | 'snapdragon_8_elite_dev' 
  | 'dimensity_9400_open' 
  | 'lattice_fpga_hybrid';

export type RamOption = '16GB' | '24GB' | '32GB';
export type StorageOption = '512GB' | '1TB' | '2TB';
export type BatteryOption = '5500mAh' | '6400mAh' | '7200mAh';
export type CoolingType = 'dual_vapor_chamber' | 'graphene_liquid_metal' | 'piezo_micro_jet';

export type OsFlavor = 
  | 'aosp_17_vanilla' 
  | 'lineage_24_dev' 
  | 'graphene_dev_hardened' 
  | 'cinnamon_devdroid' 
  | 'postmarket_dualboot';

export type KernelVersion = '6.12-lts' | '6.18-experimental';
export type RootSolution = 'kernelsu_next' | 'apatch_kernel' | 'built_in_adb_root' | 'disabled';
export type SELinuxMode = 'dev_permissive' | 'enforcing_with_toggle' | 'strict_enforcing';

export interface DevHardwareSwitches {
  hardwareRootSwitch: boolean;
  cameraMicKillSwitch: boolean;
  uartPogoPins: boolean;
  bootloaderEmergencyDial: boolean;
  dualUsbCPorts: boolean;
  headphoneJackDac: boolean;
  microSdSlot: boolean;
  removableBatteryLatch: boolean;
  rearEinkDisplay: boolean;
  programmableActionKey: string; // e.g. 'logcat_toggle' | 'adb_wifi' | 'terminal_summon' | 'camera_shutter'
}

export interface DevPhoneConfig {
  projectName: string;
  codename: string;
  modelNumber: string;
  deviceArchitect: string;
  
  // Hardware
  dimensions: {
    heightMm: number;
    widthMm: number;
    thicknessMm: number;
    weightGrams: number;
  };
  material: ChassisMaterial;
  color: PhoneColor;
  display: {
    size: DisplaySize;
    tech: DisplayTech;
    refreshRateHz: number;
    resolution: string;
    cameraCut: FrontCameraCut;
    bezelMm: number;
  };
  cameras: {
    layout: CameraLayout;
    primary: PrimarySensor;
    hasTelephoto5x: boolean;
    hasUltrawide120: boolean;
    devSensor: DevSensor;
    ringLight: boolean;
  };
  internals: {
    soc: SocType;
    ram: RamOption;
    storage: StorageOption;
    battery: BatteryOption;
    cooling: CoolingType;
    fastChargeWatts: number;
    wirelessQi2: boolean;
  };
  devFeatures: DevHardwareSwitches;

  // Software Android 17
  software: {
    osFlavor: OsFlavor;
    kernel: KernelVersion;
    trebleVersion: string;
    rootSolution: RootSolution;
    selinux: SELinuxMode;
    wirelessAdbDefaultPort: number;
    avfVirtualization: boolean; // Android Virtualization Framework (Debian microdroid)
    desktopMode4k: boolean;
    zramSwapGb: number;
    logcatBufferMb: number;
  };
}
