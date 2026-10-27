import React from 'react';
import { 
  Cpu, 
  Layers, 
  Smartphone, 
  Sliders, 
  Shield, 
  Radio, 
  Terminal, 
  Sparkles,
  Zap,
  Camera,
  Eye,
  Activity,
  HardDrive
} from 'lucide-react';
import { 
  DevPhoneConfig, 
  ChassisMaterial, 
  DisplaySize, 
  DisplayTech, 
  FrontCameraCut, 
  CameraLayout, 
  PrimarySensor, 
  DevSensor,
  SocType,
  RamOption,
  StorageOption,
  BatteryOption,
  CoolingType
} from '../types/phone';
import { PHONE_COLORS, SOC_DESCRIPTIONS } from '../data/presets';

interface HardwareConfiguratorProps {
  config: DevPhoneConfig;
  onChange: (updated: DevPhoneConfig) => void;
}

export const HardwareConfigurator: React.FC<HardwareConfiguratorProps> = ({ config, onChange }) => {
  const update = (patch: Partial<DevPhoneConfig>) => {
    onChange({ ...config, ...patch });
  };

  const updateDisplay = (patch: Partial<DevPhoneConfig['display']>) => {
    onChange({
      ...config,
      display: { ...config.display, ...patch }
    });
  };

  const updateCameras = (patch: Partial<DevPhoneConfig['cameras']>) => {
    onChange({
      ...config,
      cameras: { ...config.cameras, ...patch }
    });
  };

  const updateInternals = (patch: Partial<DevPhoneConfig['internals']>) => {
    onChange({
      ...config,
      internals: { ...config.internals, ...patch }
    });
  };

  const updateDevFeatures = (patch: Partial<DevPhoneConfig['devFeatures']>) => {
    onChange({
      ...config,
      devFeatures: { ...config.devFeatures, ...patch }
    });
  };

  return (
    <div className="space-y-6 text-sm text-slate-200">
      {/* 1. Identity & Device Info */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>PROJECT IDENTITY & CODENAME</span>
          </div>
          <span className="text-slate-500 font-mono-code">AOSP TARGET</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={config.projectName}
              onChange={(e) => update({ projectName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Board Codename</label>
            <input
              type="text"
              value={config.codename}
              onChange={(e) => update({ codename: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono-code focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Model Number</label>
            <input
              type="text"
              value={config.modelNumber}
              onChange={(e) => update({ modelNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono-code focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </section>

      {/* 2. Chassis Material & Palette */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>CHASSIS MATERIAL & FINISH</span>
          </div>
          <span className="text-slate-500 font-mono-code">STRUCTURAL HOUSING</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Material Composition</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'transparent_glass', label: 'Transparent Glass (Cyberpunk)', sub: 'Exposed internal PCB & coil' },
                { id: 'titanium_grade5', label: 'Grade-5 Titanium', sub: 'High strength-to-weight' },
                { id: 'billet_aluminum', label: 'CNC Milled Aluminum', sub: 'High thermal conductivity' },
                { id: 'ceramic_matte', label: 'Micro-Textured Ceramic', sub: 'Scratch-proof & RF transparent' },
                { id: 'cyber_polycarbonate', label: 'Industrial Polycarbonate', sub: 'Retro translucent hacker shell' },
                { id: 'ballistic_kevlar', label: 'Ballistic Kevlar Weave', sub: 'Tactile grip & drop resistant' },
              ].map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => update({ material: mat.id as ChassisMaterial })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    config.material === mat.id
                      ? 'border-sky-500 bg-sky-950/30 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">{mat.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{mat.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Colorway Palette</label>
            <div className="flex flex-wrap items-center gap-2">
              {PHONE_COLORS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => update({ color: col })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    config.color.id === col.id
                      ? 'border-sky-400 bg-slate-800 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-inner"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Silicon & Computation */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>CORE SYSTEM-ON-CHIP & PERFORMANCE</span>
          </div>
          <span className="text-slate-500 font-mono-code">SILICON ARCHITECTURE</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Processor Platform (SoC)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {(Object.keys(SOC_DESCRIPTIONS) as SocType[]).map((socKey) => {
                const s = SOC_DESCRIPTIONS[socKey];
                const isSelected = config.internals.soc === socKey;
                return (
                  <button
                    key={socKey}
                    type="button"
                    onClick={() => updateInternals({ soc: socKey })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-950/40 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-sky-300">{s.name}</span>
                      <span className="text-[10px] font-mono-code text-slate-400">{s.nodes}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{s.cores}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono-code text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>NPU: {s.npu}</span>
                      <span className="text-emerald-400">{s.trebleStatus}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">RAM Capacity</label>
              <select
                value={config.internals.ram}
                onChange={(e) => updateInternals({ ram: e.target.value as RamOption })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
              >
                <option value="16GB">16GB LPDDR5X (Quad-Channel)</option>
                <option value="24GB">24GB LPDDR5X (9600 MT/s)</option>
                <option value="32GB">32GB LPDDR5X (Extreme Dev Multitask)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Internal UFS Storage</label>
              <select
                value={config.internals.storage}
                onChange={(e) => updateInternals({ storage: e.target.value as StorageOption })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
              >
                <option value="512GB">512GB UFS 4.1</option>
                <option value="1TB">1TB UFS 4.1 Dual-Lane</option>
                <option value="2TB">2TB UFS 4.1 Enterprise Tier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Thermal Cooling</label>
              <select
                value={config.internals.cooling}
                onChange={(e) => updateInternals({ cooling: e.target.value as CoolingType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="dual_vapor_chamber">3D Dual Vapor Chamber</option>
                <option value="graphene_liquid_metal">Graphene + Liquid Metal TIM</option>
                <option value="piezo_micro_jet">Active Micro-Piezo Jet Fan</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Display Subsystem */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <span>DISPLAY & FRONT CAMERA CUTOUT</span>
          </div>
          <span className="text-slate-500 font-mono-code">DSI TIMINGS & PANEL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Diagonal Size</label>
            <select
              value={config.display.size}
              onChange={(e) => {
                const s = e.target.value as DisplaySize;
                let h = 158.0;
                let w = 73.0;
                if (s === '5.9') { h = 146.5; w = 68.2; }
                if (s === '6.36') { h = 152.8; w = 71.5; }
                if (s === '6.78') { h = 162.4; w = 75.8; }
                if (s === '7.2') { h = 174.2; w = 84.1; }
                updateDisplay({ size: s });
                update({ dimensions: { ...config.dimensions, heightMm: h, widthMm: w } });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value="5.9">5.9" Compact Pocket Dev</option>
              <option value="6.36">6.36" Ergonomic Standard</option>
              <option value="6.78">6.78" Pro Terminal Canvas</option>
              <option value="7.2">7.2" Phablet Workstation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Panel Technology</label>
            <select
              value={config.display.tech}
              onChange={(e) => updateDisplay({ tech: e.target.value as DisplayTech })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ltpo_amoled">LTPO AMOLED 1-165Hz</option>
              <option value="microled">MicroLED Ultra-Bright</option>
              <option value="dual_layer_eink">Dual-Layer Reflective E-Ink</option>
              <option value="retro_flat_oled">Flat Matte OLED 120Hz</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Refresh Rate</label>
            <select
              value={config.display.refreshRateHz}
              onChange={(e) => updateDisplay({ refreshRateHz: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value={90}>90 Hz (Power Saver)</option>
              <option value={120}>120 Hz Dynamic LTPO</option>
              <option value={144}>144 Hz Esports Grade</option>
              <option value={165}>165 Hz Max Fluidity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Front Camera Cutout</label>
            <select
              value={config.display.cameraCut}
              onChange={(e) => updateDisplay({ cameraCut: e.target.value as FrontCameraCut })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="under_display">Under-Display Invisible</option>
              <option value="center_punch">Minimal Center Dot</option>
              <option value="compact_pill">Compact Pill</option>
              <option value="dev_sensor_bar">Full Top Sensor Bar</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. Camera System & Dev Sensors */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-400" />
            <span>CAMERA MODULE & SPECIALIZED DEV SENSORS</span>
          </div>
          <span className="text-slate-500 font-mono-code">MIPI CSI-2 LANES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Chassis Camera Layout</label>
            <select
              value={config.cameras.layout}
              onChange={(e) => updateCameras({ layout: e.target.value as CameraLayout })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="pixel_visor">Full-Width Horizon Visor</option>
              <option value="hex_matrix">Hex Matrix Island</option>
              <option value="triple_monolith">Triple Monolith</option>
              <option value="minimal_flush">Flush Zero-Bump Lenses</option>
              <option value="asymmetric_dev">Asymmetric Dev Sensor Bar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Primary Sensor</label>
            <select
              value={config.cameras.primary}
              onChange={(e) => updateCameras({ primary: e.target.value as PrimarySensor })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value="50mp_1inch">50MP 1.0" Sony LYT-900</option>
              <option value="200mp_hp2">200MP Samsung ISOCELL HP2</option>
              <option value="108mp_monochrome">108MP Monochrome Dev Sensor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Specialized Dev Sensor</label>
            <select
              value={config.cameras.devSensor}
              onChange={(e) => updateCameras({ devSensor: e.target.value as DevSensor })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value="flir_thermal">FLIR Lepton 3.5 Thermal IR</option>
              <option value="tof_lidar">ToF 3D LiDAR Spatial Scanner</option>
              <option value="microscope_macro">Microscope Macro w/ Ring LED</option>
              <option value="spectral_meter">UV & Color Spectrometer</option>
              <option value="none">Standard Optics Only</option>
            </select>
          </div>
        </div>
      </section>

      {/* 6. Developer Hardware Switches & Interfaces (The Real Dev Dream Phone Features!) */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>PHYSICAL DEV CONTROLS & EXPANSION BUSES</span>
          </div>
          <span className="text-slate-500 font-mono-code">HARDWARE GATES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Hardware Root Switch */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.hardwareRootSwitch}
              onChange={(e) => updateDevFeatures({ hardwareRootSwitch: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-red-400">Physical Hardware Root Switch</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Two-position slider physically gates SELinux & root permissions in PMIC.
              </div>
            </div>
          </label>

          {/* Dual USB-C Ports */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.dualUsbCPorts}
              onChange={(e) => updateDevFeatures({ dualUsbCPorts: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-sky-300">Dual Independent USB-C Ports</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Bottom USB4 40Gbps DP-Alt + Side USB-C for live ADB without dongles.
              </div>
            </div>
          </label>

          {/* 4-Pin UART Pogo Pins */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.uartPogoPins}
              onChange={(e) => updateDevFeatures({ uartPogoPins: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-amber-300">UART 4-Pin Pogo Debug Interface</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Direct TX/RX kernel serial console @ 115200 baud 3.3V TTL.
              </div>
            </div>
          </label>

          {/* Rear E-Ink Display */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.rearEinkDisplay}
              onChange={(e) => updateDevFeatures({ rearEinkDisplay: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Secondary Rear E-Ink Status Ticker</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                2.1" ultra-low-power screen for live Git commits, ADB IP & battery info.
              </div>
            </div>
          </label>

          {/* Camera & Mic Kill Switch */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.cameraMicKillSwitch}
              onChange={(e) => updateDevFeatures({ cameraMicKillSwitch: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-emerald-400">Camera / Mic Hardware Kill Switch</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Physical LDO rail power cut for zero-trust privacy.
              </div>
            </div>
          </label>

          {/* 3.5mm DAC */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.headphoneJackDac}
              onChange={(e) => updateDevFeatures({ headphoneJackDac: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">3.5mm Hi-Res Audio Jack (ESS DAC)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                32-bit/384kHz audiophile DAC & low-latency oscilloscope line in.
              </div>
            </div>
          </label>

          {/* MicroSD Slot */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.microSdSlot}
              onChange={(e) => updateDevFeatures({ microSdSlot: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">MicroSD Express Tray (2TB)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Hot-swappable storage for rootfs images & large raw dataset dumps.
              </div>
            </div>
          </label>

          {/* Removable Battery Latch */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.removableBatteryLatch}
              onChange={(e) => updateDevFeatures({ removableBatteryLatch: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-amber-400">Quick-Swap Battery Latch</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Toolless replacement mechanism with 60-second hot-swap bridge supercap.
              </div>
            </div>
          </label>

          {/* Emergency Bootloader Dial */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.devFeatures.bootloaderEmergencyDial}
              onChange={(e) => updateDevFeatures({ bootloaderEmergencyDial: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-purple-400">Emergency EDL / Fastboot Dial</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Hardware test-point switch that unbricks hard-bricked devices.
              </div>
            </div>
          </label>
        </div>
      </section>
    </div>
  );
};
