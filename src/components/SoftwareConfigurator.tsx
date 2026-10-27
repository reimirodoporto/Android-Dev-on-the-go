import React from 'react';
import { 
  Terminal, 
  Shield, 
  GitBranch, 
  Server, 
  Cpu, 
  Monitor, 
  Wifi, 
  Layers, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { 
  DevPhoneConfig, 
  OsFlavor, 
  KernelVersion, 
  RootSolution, 
  SELinuxMode 
} from '../types/phone';

interface SoftwareConfiguratorProps {
  config: DevPhoneConfig;
  onChange: (updated: DevPhoneConfig) => void;
}

export const SoftwareConfigurator: React.FC<SoftwareConfiguratorProps> = ({ config, onChange }) => {
  const updateSoftware = (patch: Partial<DevPhoneConfig['software']>) => {
    onChange({
      ...config,
      software: { ...config.software, ...patch }
    });
  };

  return (
    <div className="space-y-6 text-sm text-slate-200">
      {/* 1. Android 17 OS Distribution */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>ANDROID 17 BASE OS BRANCH & DISTRIBUTION</span>
          </div>
          <span className="text-emerald-400 font-mono-code">AOSP v17.0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 'cinnamon_devdroid',
              name: 'CinnamonOS DevDroid 17',
              badge: 'Recommended for Developers',
              desc: 'Embedded Debian microdroid container via AVF, native wireless ADB daemon, built-in scrcpy & rootfs',
            },
            {
              id: 'aosp_17_vanilla',
              name: 'Pure AOSP 17 (Cinnamon Roll)',
              badge: 'Ultra-Lean Bloat-Free',
              desc: 'Minimal upstream Android 17 image (<2.4GB super partition), zero telemetry, stock Material 3',
            },
            {
              id: 'graphene_dev_hardened',
              name: 'GrapheneOS Dev Security Edition',
              badge: 'Hardened Sandbox',
              desc: 'Hardened memory allocator, audited SELinux profiles, network isolation permissions per app',
            },
            {
              id: 'lineage_24_dev',
              name: 'LineageOS 24 Developer Tree',
              badge: 'Custom ROM Community',
              desc: 'Extensive device overlay support, live display calibration, built-in root trust manager',
            },
            {
              id: 'postmarket_dualboot',
              name: 'Dual-Boot AOSP 17 + Alpine Linux',
              badge: 'Dual Boot Partition',
              desc: 'Boots both Android 17 and pure mainline Linux with Phosh / Sway on secondary partition',
            },
          ].map((item) => {
            const isSelected = config.software.osFlavor === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateSoftware({ osFlavor: item.id as OsFlavor })}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-emerald-300">{item.name}</span>
                  <span className="text-[10px] font-mono-code text-slate-400">{item.badge}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Linux Kernel & Root Strategy */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>LINUX KERNEL & PRIVILEGE ELEVATION</span>
          </div>
          <span className="text-slate-500 font-mono-code">GKI 3.0</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">GKI Linux Kernel Tree</label>
            <select
              value={config.software.kernel}
              onChange={(e) => updateSoftware({ kernel: e.target.value as KernelVersion })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value="6.12-lts">Linux 6.12 LTS (Stable GKI)</option>
              <option value="6.18-experimental">Linux 6.18 Experimental (Next-Gen)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Full Generic Kernel Image compliance</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Root Architecture</label>
            <select
              value={config.software.rootSolution}
              onChange={(e) => updateSoftware({ rootSolution: e.target.value as RootSolution })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value="kernelsu_next">KernelSU Next (Kernel-Level Hook)</option>
              <option value="apatch_kernel">APatch (KPManager Patchset)</option>
              <option value="built_in_adb_root">Built-in ADB Root (su binary)</option>
              <option value="disabled">Disabled (Strict Production Enforcing)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Compatible with physical HW switch</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">SELinux Policy</label>
            <select
              value={config.software.selinux}
              onChange={(e) => updateSoftware({ selinux: e.target.value as SELinuxMode })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value="enforcing_with_toggle">Enforcing with Live Toggle</option>
              <option value="dev_permissive">Dev-Permissive (Unrestricted)</option>
              <option value="strict_enforcing">Strict Enforcing (CTS Compliant)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Dynamic sepolicy loading</span>
          </div>
        </div>
      </section>

      {/* 3. Developer Virtualization, Desktop Mode & Memory Buffers */}
      <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-purple-400" />
            <span>DESKTOP MODE, VIRTUALIZATION & HIGH-SPEED SWAP</span>
          </div>
          <span className="text-slate-500 font-mono-code">SUBSYSTEM CONTROLS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* AVF Debian Virtualization */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.software.avfVirtualization}
              onChange={(e) => updateSoftware({ avfVirtualization: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-purple-300">Android Virtualization (AVF) Debian Microdroid</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Runs full Debian Linux inside KVM hardware hypervisor alongside Android 17.
              </div>
            </div>
          </label>

          {/* Desktop Mode 4K */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/70 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={config.software.desktopMode4k}
              onChange={(e) => updateSoftware({ desktopMode4k: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <div>
              <div className="text-xs font-semibold text-sky-300">Native 4K Multi-Window Desktop Mode</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Outputs freeform desktop window manager when connected to external monitors via USB4.
              </div>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Wireless ADB Default Port</label>
            <input
              type="number"
              value={config.software.wirelessAdbDefaultPort}
              onChange={(e) => updateSoftware({ wirelessAdbDefaultPort: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono-code focus:outline-none focus:border-sky-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Auto-pairs with local Wi-Fi subnet</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">zRAM Swap Buffer</label>
            <select
              value={config.software.zramSwapGb}
              onChange={(e) => updateSoftware({ zramSwapGb: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value={8}>8 GB NVMe-backed swap</option>
              <option value={16}>16 GB (Recommended for AOSP dev)</option>
              <option value={32}>32 GB Heavy compilation swap</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Logcat Ringbuffer Size</label>
            <select
              value={config.software.logcatBufferMb}
              onChange={(e) => updateSoftware({ logcatBufferMb: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-code"
            >
              <option value={16}>16 MB (Standard)</option>
              <option value={64}>64 MB (Deep trace analysis)</option>
              <option value={128}>128 MB (Kernel panic capture)</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};
