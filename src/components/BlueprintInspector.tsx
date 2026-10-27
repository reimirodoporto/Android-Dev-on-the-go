import React, { useState } from 'react';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  CloudRain, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Play,
  CheckCircle,
  FileText,
  Workflow,
  Sparkles,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { DevPhoneConfig } from '../types/phone';
import { 
  getAllBlueprintFiles, 
  exportZipBundle, 
  GeneratedBlueprintFile 
} from '../utils/blueprintGenerator';

interface BlueprintInspectorProps {
  config: DevPhoneConfig;
}

export const BlueprintInspector: React.FC<BlueprintInspectorProps> = ({ config }) => {
  const files = getAllBlueprintFiles(config);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [simulatedCiRunning, setSimulatedCiRunning] = useState<boolean>(false);
  const [simulatedStep, setSimulatedStep] = useState<number>(0);

  const activeFile = files[selectedFileIndex] || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Extract last segment of filename
    const name = activeFile.filename.split('/').pop() || 'blueprint-file.txt';
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullZip = async () => {
    try {
      setIsExportingZip(true);
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
      console.error('Failed to create zip:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const startCiSimulation = () => {
    setSimulatedCiRunning(true);
    setSimulatedStep(1);
    const timer1 = setTimeout(() => setSimulatedStep(2), 1200);
    const timer2 = setTimeout(() => setSimulatedStep(3), 2600);
    const timer3 = setTimeout(() => setSimulatedStep(4), 4200);
    const timer4 = setTimeout(() => {
      setSimulatedStep(5);
      setTimeout(() => setSimulatedCiRunning(false), 3000);
    }, 5800);
  };

  const filteredFiles = activeCategory === 'all' 
    ? files 
    : files.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* 1. Low-Power Device Problem & Solution Callout Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-base">
                Low-Power Host Blueprint Architecture
              </span>
              <span className="text-xs font-mono-code bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">
                Zero Local CLI Strain
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Full Android 17 (AOSP) compilation demands <strong>64GB+ RAM, 16 CPU cores, and ~350GB storage</strong>. On low-power hardware (Chromebooks, Raspberry Pi, netbooks, or mobile phones), local compilation causes instant kernel panics or out-of-memory lockups. This studio generates <strong>automated cloud CI workflows</strong> that execute the heavy compilation in the cloud and produce <strong>ready-to-flash fastboot binaries</strong> requiring only seconds to flash from your weak host.
            </p>
          </div>

          {/* Primary Action: Download All as ZIP */}
          <button
            onClick={handleDownloadFullZip}
            disabled={isExportingZip}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingZip ? 'Compressing Blueprint...' : 'Download Blueprint (.ZIP)'}</span>
          </button>
        </div>

        {/* 3-Step Low-Power Workflow Chain */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono-code">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-sky-400 font-bold mb-0.5">01. Export Blueprint</div>
            <div className="text-[11px] text-slate-400">
              Download the manifest and `.github/workflows/build-devphone17.yml`
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-amber-400 font-bold mb-0.5">02. Cloud Build Trigger</div>
            <div className="text-[11px] text-slate-400">
              GitHub Actions cloud runner compiles Android 17 and publishes flashable fastboot zip
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-emerald-400 font-bold mb-0.5">03. 90-Second Flash</div>
            <div className="text-[11px] text-slate-400">
              Plug device into your low-power laptop and run `bash flash-blueprint.sh`
            </div>
          </div>
        </div>
      </div>

      {/* 2. File Category Tabs & File Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: File Tree Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 font-mono-code">BLUEPRINT ARTIFACTS</span>
            <span className="text-xs text-slate-500 font-mono-code tabular-nums">{files.length} files</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
            {[
              { id: 'all', label: 'All' },
              { id: 'workflow', label: 'Cloud CI' },
              { id: 'manifest', label: 'Manifest' },
              { id: 'device_tree', label: 'Device Tree' },
              { id: 'flasher', label: 'Flash Scripts' },
              { id: 'spec', label: 'Specs' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const originalIndex = files.findIndex(f => f.filename === file.filename);
              const isSelected = selectedFileIndex === originalIndex;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFileIndex(originalIndex)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500/70 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span className="font-mono-code text-xs font-semibold truncate text-slate-200">
                      {file.filename}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {file.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Cloud CI Runner Simulator Button */}
          <div className="pt-2">
            <button
              onClick={startCiSimulation}
              disabled={simulatedCiRunning}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono-code text-xs transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{simulatedCiRunning ? 'Simulating Cloud Build...' : 'Test Cloud Build Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Code & Spec Content Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          {/* File Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="truncate font-mono-code text-xs font-semibold text-slate-200">
                {activeFile.filename}
              </div>
              <span className="text-[10px] font-mono-code bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">
                {activeFile.language}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy contents"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono-code">
            {activeFile.description}
          </div>

          {/* Code Viewer Body */}
          <div className="relative flex-1 p-4 overflow-x-auto max-h-[520px] font-mono-code text-xs text-slate-300 leading-relaxed bg-slate-950 selection:bg-sky-900 selection:text-white">
            <pre className="whitespace-pre">{activeFile.content}</pre>
          </div>
        </div>
      </div>

      {/* 3. Simulated Cloud CI Pipeline Terminal (Shows low-power user how painless it is) */}
      {simulatedCiRunning && (
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/50 shadow-2xl font-mono-code text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-amber-400 font-bold">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>GITHUB ACTIONS REMOTE CLOUD RUNNER: {config.projectName.toUpperCase()}</span>
            </div>
            <span className="text-[10px] text-slate-500">HOST: ubuntu-24.04 (64GB RAM / 16 vCPU)</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              {simulatedStep >= 1 ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-spin" />}
              <span>Step 1: Freeing runner disk space and initializing shallow repo sync (android-17.0.0_r1)...</span>
            </div>
            {simulatedStep >= 2 && (
              <div className="flex items-center gap-2">
                {simulatedStep >= 2 ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-spin" />}
                <span>Step 2: Injecting device tree for <strong className="text-amber-400">{config.codename}</strong> & BoardConfig.mk...</span>
              </div>
            )}
            {simulatedStep >= 3 && (
              <div className="flex items-center gap-2">
                {simulatedStep >= 3 ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-spin" />}
                <span>Step 3: Compiling Linux {config.software.kernel} GKI 3.0 kernel and Treble HALs...</span>
              </div>
            )}
            {simulatedStep >= 4 && (
              <div className="flex items-center gap-2">
                {simulatedStep >= 4 ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-spin" />}
                <span>Step 4: Assembling Dynamic Super Partition ({config.software.osFlavor}) & generating SHA256SUMS...</span>
              </div>
            )}
            {simulatedStep >= 5 && (
              <div className="p-3 mt-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                <strong>SUCCESS!</strong> ROM build completed on cloud runner. Artifacts published to GitHub Release:
                <div className="mt-1 font-mono text-[11px] text-slate-300">
                  - {config.codename}-fastboot-images.zip (2.1 GB)<br />
                  - boot.img (64 MB)<br />
                  - super.img (1.8 GB)<br />
                  - SHA256SUMS.txt<br />
                </div>
                <div className="mt-2 text-slate-400 text-[10px]">
                  Now plug your phone into your low-power host and run `flash-blueprint.sh` to flash in 90 seconds!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
