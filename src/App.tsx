import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Cpu, 
  Terminal, 
  Layers, 
  Sparkles, 
  FileCode, 
  ShieldCheck, 
  Zap, 
  Activity,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { DevPhoneConfig } from './types/phone';
import { DEFAULT_DEV_PHONE, PRESET_PHONES } from './data/presets';
import { PhoneViewer } from './components/PhoneViewer';
import { HardwareConfigurator } from './components/HardwareConfigurator';
import { SoftwareConfigurator } from './components/SoftwareConfigurator';
import { BlueprintInspector } from './components/BlueprintInspector';
import { CompatibilityAnalyzer } from './components/CompatibilityAnalyzer';
import { exportZipBundle } from './utils/blueprintGenerator';

type ActiveTab = 'mockup' | 'hardware' | 'software' | 'blueprint' | 'audit';

export default function App() {
  const [config, setConfig] = useState<DevPhoneConfig>(DEFAULT_DEV_PHONE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('mockup');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string>('cyber_hacker');

  const handleApplyPreset = (presetId: string) => {
    const found = PRESET_PHONES.find(p => p.id === presetId);
    if (found) {
      setConfig({ ...found.config });
      setActivePresetId(presetId);
    }
  };

  const handleDownloadFullZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await exportZipBundle(config);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.codename}_android17_blueprint_bundle.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col antialiased selection:bg-sky-500/30 selection:text-white">
      {/* ========================================================================= */}
      {/* TOP BAR CONTRACT: Zone 1 (Wordmark) — Zone 2 (Links) — Zone 3 (Action)   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0b0f19]/90 border-b border-slate-800/80 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span>DroidForge 17</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('mockup')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'mockup' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            CAD Mockup
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'hardware' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Hardware Specs
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'software' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Android 17 OS
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'blueprint' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Manifest & Blueprint
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'audit' ? 'text-sky-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Compatibility Audit
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadFullZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export Blueprint (.ZIP)'}</span>
          </button>
        </div>
      </header>

      {/* Hero Sub-Bar: Preset Selector & Clean Unboxed Metadata */}
      <section className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code mb-1">
              <span>Android 17 Developer Phone Studio</span>
              <span aria-hidden="true">·</span>
              <span>Headless Cloud Build Architecture</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Zero Local CLI Bottleneck</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Visual CAD & Build Blueprint Generator
            </h1>
          </div>

          {/* Quick Preset Selector Buttons (Functional Segmented Tab) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800/80 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-mono-code px-2 shrink-0 hidden sm:inline">
              Presets:
            </span>
            {PRESET_PHONES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  activePresetId === preset.id
                    ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Mobile Navigation Tabs (visible below md) */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('mockup')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'mockup' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
            }`}
          >
            CAD Mockup
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'hardware' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
            }`}
          >
            Hardware Specs
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'software' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
            }`}
          >
            Android 17 OS
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'blueprint' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
            }`}
          >
            Manifest & Blueprint
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
            }`}
          >
            Compatibility Audit
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CAD MOCKUP + LIVE SPECIFICATION SPLIT                            */}
        {/* ========================================================================= */}
        {activeTab === 'mockup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Interactive Visual Phone CAD Canvas */}
            <div className="lg:col-span-7">
              <PhoneViewer config={config} onUpdateConfig={setConfig} />
            </div>

            {/* Right 5 cols: Live Configuration Quick Inspector & Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 font-mono-code">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-slate-200">QUICK DESIGN ADJUSTMENTS</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('hardware')}
                    className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
                  >
                    All Specs →
                  </button>
                </div>

                {/* Quick Material Toggle */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Chassis Housing</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'transparent_glass', label: 'Transparent Glass' },
                      { id: 'titanium_grade5', label: 'Grade-5 Titanium' },
                      { id: 'billet_aluminum', label: 'Billet Aluminum' },
                      { id: 'ceramic_matte', label: 'Matte Ceramic' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setConfig({ ...config, material: m.id as any })}
                        className={`p-2 rounded border text-left transition-all ${
                          config.material === m.id
                            ? 'bg-sky-950/40 border-sky-400 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Dev Switch Toggles */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Developer Hardware Switches</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <span className="text-xs text-red-400 font-semibold">Physical Hardware Root Switch</span>
                      <input
                        type="checkbox"
                        checked={config.devFeatures.hardwareRootSwitch}
                        onChange={(e) => setConfig({
                          ...config,
                          devFeatures: { ...config.devFeatures, hardwareRootSwitch: e.target.checked }
                        })}
                        className="rounded border-slate-700 text-sky-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <span className="text-xs text-amber-300 font-semibold">4-Pin UART Pogo Header</span>
                      <input
                        type="checkbox"
                        checked={config.devFeatures.uartPogoPins}
                        onChange={(e) => setConfig({
                          ...config,
                          devFeatures: { ...config.devFeatures, uartPogoPins: e.target.checked }
                        })}
                        className="rounded border-slate-700 text-sky-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <span className="text-xs text-slate-200 font-semibold">Rear E-Ink Status Display</span>
                      <input
                        type="checkbox"
                        checked={config.devFeatures.rearEinkDisplay}
                        onChange={(e) => setConfig({
                          ...config,
                          devFeatures: { ...config.devFeatures, rearEinkDisplay: e.target.checked }
                        })}
                        className="rounded border-slate-700 text-sky-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <span className="text-xs text-sky-300 font-semibold">Dual Independent USB-C</span>
                      <input
                        type="checkbox"
                        checked={config.devFeatures.dualUsbCPorts}
                        onChange={(e) => setConfig({
                          ...config,
                          devFeatures: { ...config.devFeatures, dualUsbCPorts: e.target.checked }
                        })}
                        className="rounded border-slate-700 text-sky-500 focus:ring-0"
                      />
                    </label>
                  </div>
                </div>

                {/* Direct Jump to Manifest Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('blueprint')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold text-xs transition-colors"
                  >
                    <FileCode className="w-4 h-4" />
                    <span>View Manifests & Remote Cloud Builder →</span>
                  </button>
                </div>
              </div>

              {/* Quick Specs Overview Strip */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono-code space-y-2">
                <div className="text-slate-400 font-bold mb-2">TARGET ARCHITECTURE SUMMARY</div>
                <div className="flex justify-between text-slate-300">
                  <span>OS Base:</span>
                  <span className="text-emerald-400 font-semibold">{config.software.osFlavor}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Silicon:</span>
                  <span className="text-sky-300">{config.internals.soc}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Memory:</span>
                  <span>{config.internals.ram} + {config.software.zramSwapGb}GB zRAM</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Battery:</span>
                  <span className="text-amber-400">{config.internals.battery} ({config.internals.fastChargeWatts}W)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DETAILED HARDWARE SPECIFICATION                                   */}
        {/* ========================================================================= */}
        {activeTab === 'hardware' && (
          <div className="max-w-4xl mx-auto">
            <HardwareConfigurator config={config} onChange={setConfig} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANDROID 17 SOFTWARE CONFIGURATION                                 */}
        {/* ========================================================================= */}
        {activeTab === 'software' && (
          <div className="max-w-4xl mx-auto">
            <SoftwareConfigurator config={config} onChange={setConfig} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MANIFEST LIST, CLOUD BUILDER & BLUEPRINT EXPORT                   */}
        {/* ========================================================================= */}
        {activeTab === 'blueprint' && (
          <div>
            <BlueprintInspector config={config} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: COMPATIBILITY & THERMAL / POWER AUDIT                             */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="max-w-4xl mx-auto">
            <CompatibilityAnalyzer config={config} />
          </div>
        )}
      </main>

      {/* Footer (Quiet copyright & site info, no decorative fake telemetry) */}
      <footer className="mt-auto px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-500 font-mono-code">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">DroidForge 17</span>
            <span>·</span>
            <span>Android 17 Hardware & Software Blueprint Studio</span>
            <span>·</span>
            <span>Low-Resource Device Remote Compilation</span>
          </div>
          <div>
            Ready for Fastboot & GitHub Actions CI
          </div>
        </div>
      </footer>
    </div>
  );
}
