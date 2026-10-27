import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  RotateCw, 
  Cpu, 
  Radio, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  Camera, 
  Wifi, 
  Battery, 
  Terminal,
  Maximize2,
  Lock,
  Unlock,
  Sparkles,
  Info
} from 'lucide-react';
import { DevPhoneConfig } from '../types/phone';
import { SOC_DESCRIPTIONS } from '../data/presets';

interface PhoneViewerProps {
  config: DevPhoneConfig;
  onUpdateConfig: (newConfig: DevPhoneConfig) => void;
}

type ViewAngle = 'front' | 'rear' | 'side' | 'internal';

export const PhoneViewer: React.FC<PhoneViewerProps> = ({ config, onUpdateConfig }) => {
  const [currentView, setCurrentView] = useState<ViewAngle>('rear');
  const [showCalipers, setShowCalipers] = useState<boolean>(true);
  const [activeInspector, setActiveInspector] = useState<string | null>(null);
  const [einkContent, setEinkContent] = useState<'git' | 'ip' | 'hardware' | 'quote'>('git');
  const [isHwRootEnabled, setIsHwRootEnabled] = useState<boolean>(true);

  const soc = SOC_DESCRIPTIONS[config.internals.soc];
  const accent = config.color.hex;
  const frame = config.color.frameHex;

  return (
    <div className="flex flex-col h-full bg-slate-950/70 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Viewer Control Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setCurrentView('front')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              currentView === 'front'
                ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Front (Display)
          </button>
          <button
            onClick={() => setCurrentView('rear')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              currentView === 'rear'
                ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rear (Chassis)
          </button>
          <button
            onClick={() => setCurrentView('side')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              currentView === 'side'
                ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side (Dev Switches)
          </button>
          <button
            onClick={() => setCurrentView('internal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              currentView === 'internal'
                ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Internal (PCB & SoC)
          </button>
        </div>

        {/* View Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCalipers(!showCalipers)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              showCalipers 
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/40' 
                : 'text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {showCalipers ? 'Hide Calipers' : 'Show Calipers'}
          </button>

          <span className="text-xs text-slate-500 font-mono-code tabular-nums hidden sm:inline">
            {config.dimensions.heightMm} × {config.dimensions.widthMm} × {config.dimensions.thicknessMm} mm
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center p-6 min-h-[460px] overflow-hidden bg-radial from-slate-900/60 to-slate-950">
        {/* Subtle CAD Background Grid Lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* ========================================================================= */}
        {/* VIEW 1: FRONT DISPLAY VIEW */}
        {/* ========================================================================= */}
        {currentView === 'front' && (
          <div className="relative flex items-center justify-center transition-all duration-300">
            {/* Calipers Left (Height) */}
            {showCalipers && (
              <div className="absolute -left-14 top-0 bottom-0 flex flex-col items-center justify-between text-[11px] font-mono-code text-sky-400 pointer-events-none">
                <div className="w-3 border-t border-sky-500/50" />
                <span className="-rotate-90 whitespace-nowrap bg-slate-950/80 px-1 border border-sky-500/30 rounded">
                  {config.dimensions.heightMm} mm
                </span>
                <div className="w-3 border-b border-sky-500/50" />
                <div className="absolute top-0 bottom-0 w-[1px] bg-sky-500/30 -z-10" />
              </div>
            )}

            {/* Calipers Top (Width) */}
            {showCalipers && (
              <div className="absolute -top-10 left-0 right-0 flex items-center justify-between text-[11px] font-mono-code text-sky-400 pointer-events-none">
                <div className="h-3 border-l border-sky-500/50" />
                <span className="bg-slate-950/80 px-1 border border-sky-500/30 rounded">
                  {config.dimensions.widthMm} mm
                </span>
                <div className="h-3 border-r border-sky-500/50" />
                <div className="absolute left-0 right-0 h-[1px] bg-sky-500/30 -z-10" />
              </div>
            )}

            {/* Phone Frame */}
            <div
              className="relative rounded-[36px] p-2 shadow-2xl transition-all duration-300"
              style={{
                width: `${Math.round(config.dimensions.widthMm * 3.7)}px`,
                height: `${Math.round(config.dimensions.heightMm * 3.6)}px`,
                backgroundColor: frame,
                border: `3px solid ${accent}`,
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px ${accent}25`,
              }}
            >
              {/* Screen Bezel & Display */}
              <div className="relative w-full h-full bg-slate-950 rounded-[28px] overflow-hidden border border-slate-800 flex flex-col justify-between">
                {/* Wallpaper Glow */}
                <div 
                  className="absolute inset-0 opacity-40 bg-gradient-to-br from-indigo-900 via-slate-950 to-amber-950 pointer-events-none"
                />

                {/* Status Bar */}
                <div className="relative z-10 flex items-center justify-between px-5 pt-3 text-[11px] font-mono-code text-slate-300">
                  <span className="font-semibold text-slate-200">12:47</span>
                  
                  {/* Front Camera Cutout */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2">
                    {config.display.cameraCut === 'center_punch' && (
                      <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700 ring-2 ring-slate-900/80" />
                    )}
                    {config.display.cameraCut === 'compact_pill' && (
                      <div className="w-8 h-3.5 rounded-full bg-black border border-slate-700 flex items-center justify-around px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-900/60" />
                      </div>
                    )}
                    {config.display.cameraCut === 'under_display' && (
                      <div className="w-3 h-3 rounded-full border border-dashed border-sky-400/40 opacity-30 animate-pulse" title="Under-Display Camera" />
                    )}
                    {config.display.cameraCut === 'dev_sensor_bar' && (
                      <div className="w-20 h-2 bg-slate-900 rounded-b-md border-b border-x border-slate-800" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Wifi className="w-3 h-3 text-sky-400" />
                    <span className="text-[10px] text-emerald-400 font-semibold">ADB</span>
                    <Battery className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>

                {/* Android 17 Cinnamon Dev HUD Screen */}
                <div className="relative z-10 px-4 py-2 flex-1 flex flex-col justify-center">
                  <div className="text-center my-auto">
                    <div className="text-4xl font-extralight tracking-tight text-white mb-0 font-sans">
                      12:47
                    </div>
                    <div className="text-xs text-sky-400 font-mono-code mb-4">
                      TUE, OCT 27 · DEV KERNEL {config.software.kernel}
                    </div>

                    {/* Developer Terminal Quick Card */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-left text-xs font-mono-code shadow-lg backdrop-blur-sm">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Terminal className="w-3 h-3" />
                          <span>{config.software.osFlavor}</span>
                        </span>
                        <span className="text-sky-400 font-mono">PORT 5555</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="text-slate-300">
                          <span className="text-slate-500">$ </span>uname -r
                        </div>
                        <div className="text-emerald-400 text-[10px]">
                          6.12.0-droidforge-gki3+ (clang-18)
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">$ </span>whoami
                        </div>
                        <div className="text-amber-400 text-[10px]">
                          root ({config.software.rootSolution})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Gesture Bar & Fast Switcher */}
                <div className="relative z-10 pb-2 flex flex-col items-center">
                  <div className="flex items-center gap-3 px-3 py-1 bg-slate-900/70 rounded-full border border-slate-800/60 mb-2 text-[10px] font-mono-code text-slate-400">
                    <span>{config.display.refreshRateHz}Hz LTPO</span>
                    <span>·</span>
                    <span>{config.display.tech.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="w-28 h-1 bg-slate-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: REAR CHASSIS VIEW */}
        {/* ========================================================================= */}
        {currentView === 'rear' && (
          <div className="relative flex items-center justify-center transition-all duration-300">
            {/* Calipers Left */}
            {showCalipers && (
              <div className="absolute -left-14 top-0 bottom-0 flex flex-col items-center justify-between text-[11px] font-mono-code text-sky-400 pointer-events-none">
                <div className="w-3 border-t border-sky-500/50" />
                <span className="-rotate-90 whitespace-nowrap bg-slate-950/80 px-1 border border-sky-500/30 rounded">
                  {config.dimensions.heightMm} mm
                </span>
                <div className="w-3 border-b border-sky-500/50" />
                <div className="absolute top-0 bottom-0 w-[1px] bg-sky-500/30 -z-10" />
              </div>
            )}

            {/* Rear Phone Body */}
            <div
              className="relative rounded-[36px] p-1.5 shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                width: `${Math.round(config.dimensions.widthMm * 3.7)}px`,
                height: `${Math.round(config.dimensions.heightMm * 3.6)}px`,
                backgroundColor: frame,
                border: `3px solid ${accent}`,
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px ${accent}25`,
              }}
            >
              {/* Back Plate Surface */}
              <div 
                className="relative w-full h-full rounded-[30px] overflow-hidden flex flex-col justify-between p-3"
                style={{
                  backgroundColor: config.material === 'transparent_glass' ? '#090d16' : config.color.hex,
                }}
              >
                {/* Transparent Glass internals exposure */}
                {config.material === 'transparent_glass' && (
                  <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <img
                      src="/src/assets/images/pcb_circuit_texture_1793101672788.jpg"
                      alt="Internal PCB circuit traces"
                      className="w-full h-full object-cover mix-blend-screen"
                    />
                  </div>
                )}

                {/* Titanium / Ceramic texture overlay */}
                {config.material === 'titanium_grade5' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/40 via-slate-600/10 to-slate-400/20 pointer-events-none" />
                )}
                {config.material === 'ballistic_kevlar' && (
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 4px)`,
                    }}
                  />
                )}

                {/* ================= CAMERA BUMP MODULE ================= */}
                <div className="relative z-10 pt-1">
                  {config.cameras.layout === 'pixel_visor' && (
                    <div 
                      className="w-full h-16 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-xl flex items-center justify-between px-5 cursor-pointer hover:border-sky-400/80 transition-colors"
                      onClick={() => setActiveInspector('camera')}
                      title="Click to inspect Camera Array"
                    >
                      {/* Primary Sensor */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-950 to-sky-700 border border-sky-400/40 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-200" />
                          </div>
                        </div>

                        {/* Ultra Wide */}
                        {config.cameras.hasUltrawide120 && (
                          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-600" />
                          </div>
                        )}

                        {/* Telephoto */}
                        {config.cameras.hasTelephoto5x && (
                          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                            <div className="w-3.5 h-3.5 bg-slate-950 border border-slate-600" />
                          </div>
                        )}
                      </div>

                      {/* Dev Sensor (FLIR/LiDAR) & Ring Light */}
                      <div className="flex items-center gap-2">
                        {config.cameras.devSensor !== 'none' && (
                          <div 
                            className="px-2 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-[9px] font-mono-code text-amber-300 font-bold"
                            title={`Dev Sensor: ${config.cameras.devSensor}`}
                          >
                            {config.cameras.devSensor === 'flir_thermal' && 'FLIR IR'}
                            {config.cameras.devSensor === 'tof_lidar' && 'LiDAR 3D'}
                            {config.cameras.devSensor === 'microscope_macro' && 'MICROSCOPE'}
                            {config.cameras.devSensor === 'spectral_meter' && 'SPECTRAL'}
                          </div>
                        )}
                        {config.cameras.ringLight && (
                          <div className="w-6 h-6 rounded-full border-2 border-amber-200/90 bg-amber-100/30 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                        )}
                      </div>
                    </div>
                  )}

                  {config.cameras.layout !== 'pixel_visor' && (
                    <div 
                      className="w-36 h-28 rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-xl p-3 flex flex-col justify-between cursor-pointer hover:border-sky-400/80 transition-colors"
                      onClick={() => setActiveInspector('camera')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-sky-900" />
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-slate-950" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-slate-950" />
                        </div>
                        {config.cameras.devSensor !== 'none' && (
                          <span className="text-[8px] font-mono-code text-amber-400 bg-amber-500/20 px-1 rounded">
                            {config.cameras.devSensor.slice(0, 4).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= SECONDARY REAR E-INK DISPLAY ================= */}
                {config.devFeatures.rearEinkDisplay && (
                  <div 
                    className="relative z-10 my-auto p-2.5 bg-slate-100/95 text-slate-900 rounded-lg border border-slate-300 shadow-md font-mono-code cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => {
                      const modes: ('git' | 'ip' | 'hardware' | 'quote')[] = ['git', 'ip', 'hardware', 'quote'];
                      const next = modes[(modes.indexOf(einkContent) + 1) % modes.length];
                      setEinkContent(next);
                    }}
                    title="Click to toggle E-Ink display mode"
                  >
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-300 text-[9px] font-bold text-slate-700">
                      <span>E-INK STATUS PANEL</span>
                      <span className="text-[8px] text-slate-500">TAP TO CYCLE</span>
                    </div>

                    {einkContent === 'git' && (
                      <div className="text-[10px] space-y-0.5">
                        <div className="font-semibold text-slate-800">git: commit 7f309a</div>
                        <div className="text-[9px] text-slate-600 truncate">feat: android-17 treble hal v10</div>
                        <div className="text-[9px] text-slate-500">2 min ago by {config.deviceArchitect}</div>
                      </div>
                    )}
                    {einkContent === 'ip' && (
                      <div className="text-[10px] space-y-0.5">
                        <div className="font-semibold text-emerald-800">ADB: 192.168.1.104:5555</div>
                        <div className="text-[9px] text-slate-600">USB4 DP: 3840x2160@60Hz</div>
                        <div className="text-[9px] text-slate-600">SELinux: {config.software.selinux}</div>
                      </div>
                    )}
                    {einkContent === 'hardware' && (
                      <div className="text-[10px] space-y-0.5">
                        <div className="font-semibold text-slate-900">BATT: 94% · 31°C · 18W TDP</div>
                        <div className="text-[9px] text-slate-600">RAM: 9.4GB / {config.internals.ram}</div>
                        <div className="text-[9px] text-slate-600">zRAM Swap: {config.software.zramSwapGb}GB NVMe</div>
                      </div>
                    )}
                    {einkContent === 'quote' && (
                      <div className="text-[9px] italic text-slate-700">
                        "Designed for low-power developers to build without CLI limitations."
                      </div>
                    )}
                  </div>
                )}

                {/* Wireless Qi2 Copper Coil Ring (Visible on transparent or subtle) */}
                {config.internals.wirelessQi2 && (
                  <div className="relative z-10 mx-auto w-24 h-24 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-500/60" />
                    </div>
                  </div>
                )}

                {/* Laser Engraved Branding & Model Details */}
                <div className="relative z-10 text-center pb-2 font-mono-code">
                  <div className="text-xs font-bold text-slate-300 tracking-wider">
                    {config.projectName.toUpperCase()}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    MODEL: {config.modelNumber} · ANDROID 17
                  </div>
                  <div className="text-[8px] text-slate-500">
                    AOSP ARCHITECTURE: {config.internals.soc === 'riscv_opencore12' ? 'RISC-V 64' : 'ARM64'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SIDE RAIL & DEV SWITCHES VIEW */}
        {/* ========================================================================= */}
        {currentView === 'side' && (
          <div className="relative flex items-center justify-center gap-12 transition-all duration-300">
            {/* Left Rail (Switches & Pogo Pins) */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono-code text-slate-400 mb-2 font-semibold">LEFT RAIL</span>
              <div 
                className="relative rounded-xl border-2 flex flex-col justify-between py-6 px-3 shadow-xl"
                style={{
                  width: '56px',
                  height: `${Math.round(config.dimensions.heightMm * 2.8)}px`,
                  backgroundColor: frame,
                  borderColor: accent,
                }}
              >
                {/* Volume Rockers */}
                <div className="space-y-2">
                  <div className="w-2.5 h-12 bg-slate-700 rounded-sm mx-auto shadow-sm" title="Volume Up/Down" />
                </div>

                {/* Hardware Root Switch */}
                {config.devFeatures.hardwareRootSwitch && (
                  <div 
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => setIsHwRootEnabled(!isHwRootEnabled)}
                    title="Physical Hardware Root Switch (Click to toggle)"
                  >
                    <div className="text-[8px] font-mono-code text-red-400 font-bold mb-1">HW ROOT</div>
                    <div className="w-5 h-10 bg-slate-900 border border-red-500/60 rounded p-0.5 flex flex-col justify-between">
                      <div 
                        className={`w-3.5 h-4 rounded transition-all ${
                          isHwRootEnabled ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-slate-700 translate-y-4'
                        }`} 
                      />
                    </div>
                    <span className="text-[8px] font-mono-code text-slate-400 mt-1">
                      {isHwRootEnabled ? 'ROOT ON' : 'LOCKED'}
                    </span>
                  </div>
                )}

                {/* 4-Pin UART / JTAG Debug Pogo Header */}
                {config.devFeatures.uartPogoPins && (
                  <div 
                    className="flex flex-col items-center p-1 bg-slate-900/90 rounded border border-amber-500/50 cursor-pointer hover:border-amber-400"
                    onClick={() => setActiveInspector('uart')}
                    title="Click to inspect UART pinout"
                  >
                    <div className="text-[7px] font-mono-code text-amber-400 font-bold mb-1">UART 3.3V</div>
                    <div className="space-y-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)]" title="Pin 1: TXD" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)]" title="Pin 2: RXD" />
                      <div className="w-2 h-2 rounded-full bg-slate-400" title="Pin 3: GND" />
                      <div className="w-2 h-2 rounded-full bg-red-400" title="Pin 4: 3.3V VCC" />
                    </div>
                  </div>
                )}

                {/* Camera / Mic Physical Kill Switch */}
                {config.devFeatures.cameraMicKillSwitch && (
                  <div className="flex flex-col items-center">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                    <span className="text-[7px] font-mono-code text-emerald-400 font-semibold">KILL SW</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Rail (Power, Aux USB-C, Action Key) */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono-code text-slate-400 mb-2 font-semibold">RIGHT RAIL</span>
              <div 
                className="relative rounded-xl border-2 flex flex-col justify-between py-6 px-3 shadow-xl"
                style={{
                  width: '56px',
                  height: `${Math.round(config.dimensions.heightMm * 2.8)}px`,
                  backgroundColor: frame,
                  borderColor: accent,
                }}
              >
                {/* Programmable Action Key (PTT/Logcat) */}
                <div className="flex flex-col items-center">
                  <div className="text-[8px] font-mono-code text-purple-400 font-bold mb-1">PTT/ACT</div>
                  <div className="w-3 h-8 bg-purple-600 rounded-sm shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                </div>

                {/* Power Key with Integrated Fingerprint */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-10 bg-slate-600 rounded-sm border border-slate-500" />
                  <span className="text-[8px] font-mono-code text-slate-400 mt-1">POWER</span>
                </div>

                {/* Secondary Side USB-C OTG Debug Port */}
                {config.devFeatures.dualUsbCPorts && (
                  <div 
                    className="flex flex-col items-center p-1 bg-slate-900 rounded border border-sky-500/50 cursor-pointer"
                    onClick={() => setActiveInspector('ports')}
                  >
                    <div className="w-2.5 h-6 bg-slate-950 border border-sky-400 rounded-sm" />
                    <span className="text-[7px] font-mono-code text-sky-400 font-bold mt-1">AUX USB-C</span>
                  </div>
                )}

                {/* MicroSD & Dual SIM Tray */}
                {config.devFeatures.microSdSlot && (
                  <div className="flex flex-col items-center">
                    <div className="w-1 h-1 rounded-full bg-slate-400 mb-0.5" />
                    <span className="text-[7px] font-mono-code text-slate-500">TF/SIM</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: INTERNAL EXPLODED ARCHITECTURE & PCB */}
        {/* ========================================================================= */}
        {currentView === 'internal' && (
          <div className="relative flex items-center justify-center p-4 transition-all duration-300">
            <div className="max-w-md w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl backdrop-blur-md font-mono-code">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-sm text-slate-200">EXPLODED HARDWARE ARCHITECTURE</span>
                </div>
                <span className="text-xs text-amber-400">{config.internals.cooling.replace(/_/g, ' ')}</span>
              </div>

              {/* Silicon Die Macro Image Card */}
              <div className="relative rounded-xl overflow-hidden border border-slate-700/80 mb-4 h-44 bg-slate-950 flex items-center justify-center">
                <img
                  src="/src/assets/images/dev_processor_die_1793101672154.jpg"
                  alt="Custom Dev SoC Silicon Die"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3">
                  <div>
                    <div className="text-xs font-bold text-sky-300">{soc.name}</div>
                    <div className="text-[10px] text-slate-400">{soc.nodes} · {soc.trebleStatus}</div>
                  </div>
                </div>
              </div>

              {/* Hardware Stack Breakdown Grid */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">RAM:</span>
                  <span className="font-semibold text-slate-200">{config.internals.ram} LPDDR5X @ 9600 MT/s</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Storage + zRAM:</span>
                  <span className="font-semibold text-slate-200">{config.internals.storage} UFS 4.1 + {config.software.zramSwapGb}GB Swap</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Battery Cell:</span>
                  <span className="font-semibold text-emerald-400">
                    {config.internals.battery} ({config.internals.fastChargeWatts}W GaN + Qi2 50W)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Cooling System:</span>
                  <span className="font-semibold text-sky-400">{config.internals.cooling.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotspot Inspector Modal Popup */}
        {activeInspector && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-sky-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 font-mono-code text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-bold text-sky-400">
                {activeInspector === 'uart' && '4-PIN UART / JTAG DEBUG INTERFACE'}
                {activeInspector === 'camera' && 'CAMERA MATRIX & DEV SENSOR'}
                {activeInspector === 'ports' && 'DUAL INDEPENDENT USB-C CONTROLLERS'}
              </span>
              <button 
                onClick={() => setActiveInspector(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 text-[10px]"
              >
                Close
              </button>
            </div>
            {activeInspector === 'uart' && (
              <div className="text-slate-300 space-y-1 text-[11px]">
                <p>Pin 1: <strong className="text-amber-400">TXD</strong> (SoC UART0 Kernel Logcat Console @ 115200 8-N-1)</p>
                <p>Pin 2: <strong className="text-amber-400">RXD</strong> (Interactive Root Shell stdin)</p>
                <p>Pin 3: <strong className="text-slate-400">GND</strong> (System Ground)</p>
                <p>Pin 4: <strong className="text-red-400">VCC</strong> (3.3V Logic Level Reference)</p>
              </div>
            )}
            {activeInspector === 'camera' && (
              <div className="text-slate-300 space-y-1 text-[11px]">
                <p>Primary: <strong>{config.cameras.primary}</strong> (Direct MIPI CSI-2 4-lane link to SoC ISP)</p>
                <p>Dev Sensor: <strong className="text-amber-400">{config.cameras.devSensor}</strong></p>
                <p>Hardware Kill Switch Status: <span className="text-emerald-400 font-semibold">{config.devFeatures.cameraMicKillSwitch ? 'Physical power rail isolation enabled' : 'Disabled'}</span></p>
              </div>
            )}
            {activeInspector === 'ports' && (
              <div className="text-slate-300 space-y-1 text-[11px]">
                <p><strong>Port A (Bottom):</strong> USB4 40Gbps + DisplayPort 1.4a (Direct 4K Desktop Mode)</p>
                <p><strong>Port B (Side):</strong> USB 3.2 10Gbps OTG (Connect ADB without interfering with external display)</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar: Live Spec Summary Strip */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-semibold">{config.projectName}</span>
          <span>·</span>
          <span>{config.modelNumber}</span>
          <span>·</span>
          <span className="text-emerald-400">{config.software.osFlavor}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-sky-400">
            {config.internals.ram} RAM / {config.internals.storage}
          </span>
          <span>·</span>
          <span className="text-[11px] text-amber-400">{config.internals.battery}</span>
        </div>
      </div>
    </div>
  );
};
