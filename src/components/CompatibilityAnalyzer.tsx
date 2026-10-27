import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Battery, 
  Flame, 
  Zap, 
  Clock, 
  Cpu, 
  HardDrive, 
  ShieldCheck 
} from 'lucide-react';
import { DevPhoneConfig } from '../types/phone';
import { SOC_DESCRIPTIONS } from '../data/presets';

interface CompatibilityAnalyzerProps {
  config: DevPhoneConfig;
}

export const CompatibilityAnalyzer: React.FC<CompatibilityAnalyzerProps> = ({ config }) => {
  const soc = SOC_DESCRIPTIONS[config.internals.soc];

  // Calculations
  const batteryMah = parseInt(config.internals.battery);
  const ramGb = parseInt(config.internals.ram);
  
  // Power budget estimate
  let baseWatts = 3.5;
  if (config.display.size === '7.2') baseWatts += 1.8;
  if (config.display.refreshRateHz >= 144) baseWatts += 0.8;
  if (config.software.desktopMode4k) baseWatts += 1.5;
  if (config.cameras.devSensor === 'flir_thermal') baseWatts += 1.2;

  const heavyDevHours = (batteryMah / 1000 * 3.85 / (baseWatts * 2.2)).toFixed(1);
  const standbyHours = (batteryMah / 1000 * 3.85 / 0.12).toFixed(0);

  // Thermal capacity
  const maxCoolingTdp = config.internals.cooling === 'piezo_micro_jet' ? 24 :
                        config.internals.cooling === 'dual_vapor_chamber' ? 18 : 14;

  const estimatedSocTdp = config.internals.soc === 'snapdragon_8_elite_dev' ? 16 :
                          config.internals.soc === 'riscv_opencore12' ? 14 : 12;

  const thermalHeadroom = maxCoolingTdp - estimatedSocTdp;

  // Validation Checks
  const checks = [
    {
      title: 'AOSP Treble & Android 17 HAL Architecture',
      passed: true,
      detail: `Targeting GKI 3.0 on ${config.software.kernel} with full AIDL hardware interfaces.`,
    },
    {
      title: 'Low-Power Host Offload Feasibility',
      passed: true,
      detail: 'Complete GitHub Actions CI workflow provided; offloads ~350GB disk & 64GB RAM requirements from local machine.',
    },
    {
      title: 'Physical Root Switch & SELinux Policy',
      passed: config.devFeatures.hardwareRootSwitch ? config.software.selinux !== 'strict_enforcing' : true,
      detail: config.devFeatures.hardwareRootSwitch && config.software.selinux === 'strict_enforcing'
        ? 'Warning: Hardware Root Switch enabled but SELinux is set to Strict Enforcing without dynamic reload hook.'
        : 'Hardware switch correctly triggers PMIC GPIO to toggle kernel commandline parameters.',
    },
    {
      title: 'Memory & Desktop Mode Window Manager',
      passed: ramGb >= 16,
      detail: ramGb >= 24 
        ? `${ramGb}GB LPDDR5X + ${config.software.zramSwapGb}GB zRAM easily powers simultaneous 4K Desktop Mode and Debian KVM.`
        : '16GB RAM is adequate, but 24GB+ is recommended if running heavy AVF Linux containers.',
    },
    {
      title: 'Thermal Dissipation vs Peak Silicon Load',
      passed: thermalHeadroom >= 0,
      detail: `${config.internals.cooling.replace(/_/g, ' ')} dissipates ${maxCoolingTdp}W continuous (SoC peak: ${estimatedSocTdp}W). Headroom: +${thermalHeadroom}W.`,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-code">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Dev Battery Life</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {heavyDevHours} <span className="text-xs font-normal text-slate-400">hours</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Continuous ADB compile & trace</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Thermal Headroom</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            +{thermalHeadroom} <span className="text-xs font-normal text-slate-400">Watts</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Zero thermal throttling threshold</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Fast Charge Time</span>
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {config.internals.fastChargeWatts >= 120 ? '19' : '38'} <span className="text-xs font-normal text-slate-400">min</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{config.internals.fastChargeWatts}W GaN USB-PD EPR</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Host Disk Saved</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            ~350 <span className="text-xs font-normal text-slate-400">GB</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Offloaded to remote cloud runner</div>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-300 font-mono-code">
          <span>HARDWARE & SOFTWARE COMPATIBILITY AUDIT</span>
          <span className="text-emerald-400">STATUS: READY TO EXPORT</span>
        </div>

        <div className="space-y-2.5">
          {checks.map((chk, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
            >
              {chk.passed ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className={`font-semibold ${chk.passed ? 'text-slate-200' : 'text-amber-300'}`}>
                  {chk.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {chk.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
