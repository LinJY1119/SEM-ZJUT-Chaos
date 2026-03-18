import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Activity, PieChart, ScatterChart as ScatterIcon, RefreshCw, ChevronRight, BookOpen, Network } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// --- Math Helpers ---
function randomNormal(mean = 0, sd = 1) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * sd + mean;
}

function pearsonCorrelation(data: {x: number, y: number}[]) {
  let n = data.length;
  if (n === 0) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumX2 += data[i].x * data[i].x;
    sumY2 += data[i].y * data[i].y;
  }
  let numerator = n * sumXY - sumX * sumY;
  let denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denominator === 0) return 0;
  return numerator / denominator;
}

// --- UI Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/20 backdrop-blur-xl p-8 ${className}`}>
    {children}
  </div>
);

const Slider = ({ label, value, min, max, onChange, colorHex = "#007AFF" }: { label: React.ReactNode, value: number, min: number, max: number, onChange: (v: number) => void, colorHex?: string }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${colorHex} ${percentage}%, #E5E7EB ${percentage}%)`
        }}
      />
    </div>
  );
};

// --- Modules ---
const Module1 = () => {
  const [sysError, setSysError] = useState(0);
  const [randError, setRandError] = useState(10);
  const [holes, setHoles] = useState<{x: number, y: number, id: number}[]>([]);

  const shoot = () => {
    const angle = Math.random() * 2 * Math.PI;
    const newHoles = Array.from({ length: 10 }).map((_, i) => {
      const meanX = 150 + sysError * Math.cos(angle);
      const meanY = 150 - sysError * Math.sin(angle);
      
      return {
        x: randomNormal(meanX, randError),
        y: randomNormal(meanY, randError),
        id: Date.now() + i
      };
    });
    setHoles(newHoles);
  };

  let conclusion = "";
  if (randError < 20 && sysError < 25) conclusion = "高信度，高效度：弹孔集中且正中靶心。";
  else if (randError < 20 && sysError >= 25) conclusion = "高信度，低效度：弹孔集中，但偏离了靶心（系统误差大）。";
  else if (randError >= 20 && sysError < 25) conclusion = "低信度，低效度：弹孔分散，虽然平均位置在靶心附近。";
  else conclusion = "低信度，低效度：弹孔既分散又偏离靶心。";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="flex flex-col items-center justify-center min-h-[400px]">
        <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-sm">
          <circle cx="150" cy="150" r="140" fill="#F5F5F7" stroke="#E5E7EB" strokeWidth="2" />
          <circle cx="150" cy="150" r="105" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
          <circle cx="150" cy="150" r="70" fill="#007AFF" fillOpacity="0.1" stroke="#007AFF" strokeWidth="2" />
          <circle cx="150" cy="150" r="35" fill="#FF3B30" />
          
          <AnimatePresence>
            {holes.map((hole) => (
              <motion.circle
                key={hole.id}
                cx={hole.x}
                cy={hole.y}
                r="4"
                fill="#1C1C1E"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              />
            ))}
          </AnimatePresence>
        </svg>
      </Card>
      
      <Card className="flex flex-col justify-center p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">参数控制</h3>
        <Slider label={<span>瞄准器偏差度 (系统误差 <InlineMath math="\sigma_I" />)</span>} value={sysError} min={0} max={80} onChange={setSysError} colorHex="#FFCC00" />
        <p className="text-xs text-gray-500 mb-2 -mt-4">系统误差标准差，影响效度。值越大，整体偏离靶心越远（测得不准）。</p>
        <Slider label={<span>枪支稳定性 (随机误差 <InlineMath math="\sigma_E" />)</span>} value={randError} min={2} max={50} onChange={setRandError} colorHex="#FF3B30" />
        <p className="text-xs text-gray-500 mb-2 -mt-4">随机误差标准差，影响信度。值越大，弹孔越分散（测得不稳）。</p>
        
        <button 
          onClick={shoot}
          className="mt-2 w-full py-3 bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl font-semibold text-base transition-colors shadow-md active:scale-[0.98]"
        >
          连续射击 10 次
        </button>
        
        {holes.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2">
            <span className="text-sm text-blue-700 font-semibold whitespace-nowrap">测量学结论：</span>
            <span className="text-sm font-medium text-blue-900 text-left">{conclusion}</span>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-1">信度 (<InlineMath math="r_{xx}" />)</p>
            <p className="text-sm text-gray-600 mb-1">真分数变异占总观测变异的比例。反映稳定性。</p>
            <div className="text-sm"><BlockMath math="r_{xx} = 1 - \frac{\sigma_E^2}{\sigma_X^2}" /></div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-1">效度 (<InlineMath math="Val" />)</p>
            <p className="text-sm text-gray-600 mb-1">有效真变异占总观测变异的比例。反映准确性。</p>
            <div className="text-sm"><BlockMath math="Val = \frac{\sigma_V^2}{\sigma_X^2}" /></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Module2 = () => {
  const T = 100;
  const [errorSD, setErrorSD] = useState(5);
  const [scores, setScores] = useState<number[]>([]);

  const measure = (times: number) => {
    const newScores = Array.from({ length: times }).map(() => randomNormal(T, errorSD));
    setScores(prev => [...prev, ...newScores]);
  };

  const reset = () => setScores([]);

  // Dynamic axis based on SD
  const axisSpread = Math.max(15, Math.ceil(errorSD * 3.5)); // At least +/- 15 spread
  const minScore = T - axisSpread;
  const maxScore = T + axisSpread;
  const numBins = 40;
  const binSize = (maxScore - minScore) / numBins;
  const axisRange = maxScore - minScore;
  
  const bins = useMemo(() => {
    const counts = new Array(numBins).fill(0);
    scores.forEach(s => {
      const binIdx = Math.floor((s - minScore) / binSize);
      if (binIdx >= 0 && binIdx < numBins) {
        counts[binIdx]++;
      }
    });
    return counts;
  }, [scores, numBins, minScore, binSize]);

  const maxCount = Math.max(...bins, 10);

  const normalCurvePoints = useMemo(() => {
    if (scores.length === 0 || errorSD === 0) return "";
    const points = [];
    const N = scores.length;
    for (let x = minScore; x <= maxScore; x += axisRange / 100) {
      const exponent = -0.5 * Math.pow((x - T) / errorSD, 2);
      const pdf = (1 / (errorSD * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      const expectedCount = N * binSize * pdf;
      const cx = 50 + ((x - minScore) / axisRange) * 700;
      const cy = 240 - (expectedCount / maxCount) * 160;
      points.push(`${cx},${cy}`);
    }
    return points.join(' ');
  }, [scores.length, errorSD, maxCount, T, minScore, maxScore, binSize, axisRange]);

  const ticks = [
    minScore,
    T - axisSpread / 2,
    T,
    T + axisSpread / 2,
    maxScore
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 flex flex-col items-center justify-center min-h-[400px] overflow-hidden relative">
        <div className="absolute top-6 left-8">
          <p className="text-sm text-gray-500">真分数 (T) = <span className="font-bold text-[#34C759]">100</span></p>
          <p className="text-sm text-gray-500">测量次数 (N) = <span className="font-bold text-gray-900">{scores.length}</span></p>
          {scores.length > 0 && errorSD > 0 && (
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span className="w-4 h-0.5 bg-[#FF9500] inline-block"></span> 理论正态分布曲线
            </p>
          )}
        </div>
        
        <svg width="100%" height="300" viewBox="0 0 800 300" className="mt-10">
          {/* Y-axis label */}
          <text x="50" y="30" textAnchor="middle" fill="#71717A" fontSize="12" className="font-sans">频数</text>
          {/* X-axis label */}
          <text x="765" y="244" fill="#71717A" fontSize="12" className="font-sans">分数 (X)</text>
          
          {/* Y-axis line */}
          <line x1="50" y1="40" x2="50" y2="240" stroke="#E5E7EB" strokeWidth="2" />
          {/* X-axis line */}
          <line x1="50" y1="240" x2="750" y2="240" stroke="#E5E7EB" strokeWidth="2" />
          
          {ticks.map(tick => (
            <g key={tick}>
              <line x1={50 + ((tick - minScore) / axisRange) * 700} y1="240" x2={50 + ((tick - minScore) / axisRange) * 700} y2="245" stroke="#A1A1AA" strokeWidth="2" style={{ transition: 'all 0.3s ease' }} />
              <text x={50 + ((tick - minScore) / axisRange) * 700} y="265" textAnchor="middle" fill="#71717A" fontSize="12" className="font-sans" style={{ transition: 'all 0.3s ease' }}>{Number.isInteger(tick) ? tick : tick.toFixed(1)}</text>
            </g>
          ))}
          
          <line x1={50 + ((T - minScore) / axisRange) * 700} y1="50" x2={50 + ((T - minScore) / axisRange) * 700} y2="240" stroke="#34C759" strokeWidth="2" strokeDasharray="4 4" style={{ transition: 'all 0.3s ease' }} />
          
          {bins.map((count, binIdx) => {
            const cx = 50 + ((binIdx * binSize) / axisRange) * 700;
            const barWidth = (binSize / axisRange) * 700 * 0.8;
            const barHeight = maxCount > 0 ? (count / maxCount) * 160 : 0;
            return (
              <rect
                key={binIdx}
                x={cx + (binSize / axisRange) * 700 * 0.1}
                y={240 - barHeight}
                width={barWidth}
                height={barHeight}
                fill="#007AFF"
                rx="2"
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          })}

          {normalCurvePoints && (
            <polyline
              points={normalCurvePoints}
              fill="none"
              stroke="#FF9500"
              strokeWidth="3"
              style={{ transition: 'all 0.3s ease' }}
            />
          )}
        </svg>
      </Card>
      
      <Card className="flex flex-col justify-center">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">控制面板</h3>
        <Slider label="随机误差方差 (SD)" value={errorSD} min={0} max={30} onChange={setErrorSD} colorHex="#FFCC00" />
        <p className="text-xs text-gray-500 mb-4 -mt-4">公式: X (实得分数) = T (真分数) + E (随机误差)。SD 越大，E 的波动范围越广。</p>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={() => measure(1)} className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors">测量 1 次</button>
          <button onClick={() => measure(10)} className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors">测量 10 次</button>
          <button onClick={() => measure(100)} className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors">测量 100 次</button>
          <button onClick={() => measure(1000)} className="py-3 bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl font-medium transition-colors shadow-sm">测量 1000 次</button>
        </div>
        
        <button onClick={reset} className="mt-4 flex items-center justify-center gap-2 py-3 text-gray-500 hover:text-gray-900 transition-colors">
          <RefreshCw size={16} /> 清空数据
        </button>
      </Card>
    </div>
  );
};

const Module3 = () => {
  const [V, setV] = useState(60);
  const [I, setI] = useState(20);
  const [E, setE] = useState(20);

  const total = V + I + E;
  const reliability = total === 0 ? 0 : (V + I) / total;
  const validity = total === 0 ? 0 : V / total;

  const R = 120;
  const C = 2 * Math.PI * R;
  
  const pctV = total === 0 ? 0 : V / total;
  const pctI = total === 0 ? 0 : I / total;
  const pctE = total === 0 ? 0 : E / total;

  const strokeV = pctV * C;
  const strokeI = pctI * C;
  const strokeE = pctE * C;

  const offsetV = 0;
  const offsetI = -strokeV;
  const offsetE = -strokeV - strokeI;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300" className="transform -rotate-90">
            <circle cx="150" cy="150" r={R} fill="none" stroke="#F5F5F7" strokeWidth="30" />
            
            <motion.circle
              cx="150" cy="150" r={R} fill="none" stroke="#007AFF" strokeWidth="30"
              strokeLinecap="round"
              animate={{ strokeDasharray: `${strokeV} ${C}`, strokeDashoffset: offsetV, opacity: V === 0 ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            <motion.circle
              cx="150" cy="150" r={R} fill="none" stroke="#FFCC00" strokeWidth="30"
              strokeLinecap="round"
              animate={{ strokeDasharray: `${strokeI} ${C}`, strokeDashoffset: offsetI, opacity: I === 0 ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            <motion.circle
              cx="150" cy="150" r={R} fill="none" stroke="#FF3B30" strokeWidth="30"
              strokeLinecap="round"
              animate={{ strokeDasharray: `${strokeE} ${C}`, strokeDashoffset: offsetE, opacity: E === 0 ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-500 font-medium">总变异 (Observed)</p>
            <motion.p className="text-4xl font-bold text-gray-900 tracking-tight">
              {total}
            </motion.p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mt-8 w-full px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">信度 (Reliability)</p>
            <p className="text-5xl font-bold text-gray-900 tracking-tighter">
              {reliability.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">效度 (Validity)</p>
            <p className="text-5xl font-bold text-[#007AFF] tracking-tighter">
              {validity.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="flex flex-col justify-center p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">变异分解 (Variance)</h3>
        <Slider label={<span>有效变异 (<InlineMath math="\sigma_V^2" />) - 测到了想测的</span>} value={V} min={0} max={100} onChange={setV} colorHex="#007AFF" />
        <p className="text-xs text-gray-500 mb-2 -mt-4">真正反映被试特质差异的变异量。</p>
        <Slider label={<span>系统无效变异 (<InlineMath math="\sigma_I^2" />) - 测到了不想测的</span>} value={I} min={0} max={100} onChange={setI} colorHex="#FFCC00" />
        <p className="text-xs text-gray-500 mb-2 -mt-4">由稳定但与测验目的无关的因素引起的变异量。</p>
        <Slider label={<span>随机误差变异 (<InlineMath math="\sigma_E^2" />) - 纯粹的噪音</span>} value={E} min={0} max={100} onChange={setE} colorHex="#FF3B30" />
        <p className="text-xs text-gray-500 mb-2 -mt-4">由随机因素引起的变异量，导致测量结果不稳定。</p>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#007AFF]"></div>
              <span className="text-sm font-semibold text-gray-900">信度 (<InlineMath math="r_{xx}" />)</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">真分数变异占总观测变异的比例。反映一致性。</p>
            <div className="text-sm"><BlockMath math="r_{xx} = \frac{\sigma_V^2 + \sigma_I^2}{\sigma_V^2 + \sigma_I^2 + \sigma_E^2}" /></div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#FFCC00]"></div>
              <span className="text-sm font-semibold text-gray-900">效度 (<InlineMath math="Val" />)</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">有效真变异占总观测变异的比例。反映准确性。</p>
            <div className="text-sm"><BlockMath math="Val = \frac{\sigma_V^2}{\sigma_V^2 + \sigma_I^2 + \sigma_E^2}" /></div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 px-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-[#FF3B30]"></div>
          <span>信度是效度的必要不充分条件 (<InlineMath math="r_{xx} \ge Val" />)。</span>
        </div>
      </Card>
    </div>
  );
};

const Module4 = () => {
  const [errorSD, setErrorSD] = useState(5);
  
  const baseData = useMemo(() => {
    return Array.from({ length: 100 }).map(() => ({
      T: randomNormal(80, 15),
      E1_base: randomNormal(0, 1),
      E2_base: randomNormal(0, 1)
    }));
  }, []);

  const chartData = useMemo(() => {
    return baseData.map(d => ({
      x: d.T + d.E1_base * errorSD,
      y: d.T + d.E2_base * errorSD
    }));
  }, [baseData, errorSD]);

  const r = pearsonCorrelation(chartData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-2 flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="w-full flex justify-between items-end mb-4 px-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">平行测验散点图</h3>
            <p className="text-sm font-medium text-[#007AFF] bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">
              当前模拟：100 个被试在两次平行测验中的得分
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Pearson 相关系数 (r)</p>
            <p className="text-4xl font-bold text-[#007AFF] tracking-tighter">
              {r.toFixed(3)}
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-[400px] aspect-square mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
              <XAxis type="number" dataKey="x" name="测验 1" domain={[20, 140]} tick={{ fill: '#A1A1AA' }} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis type="number" dataKey="y" name="测验 2" domain={[20, 140]} tick={{ fill: '#A1A1AA' }} axisLine={{ stroke: '#E5E7EB' }} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Scatter name="Scores" data={chartData} fill="#007AFF" fillOpacity={0.6} isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="flex flex-col justify-center">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">误差控制</h3>
        <Slider label="测量误差大小 (SD)" value={errorSD} min={0} max={30} onChange={setErrorSD} colorHex="#FF3B30" />
        <p className="text-xs text-gray-500 mb-4 -mt-4">误差 SD 越大，两次测验分数的随机波动越大，相关性越低。</p>
        
        <div className="mt-8 p-5 bg-[#F5F5F7] rounded-2xl">
          <h4 className="font-semibold text-gray-900 mb-2">平行测验信度</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            在经典测量理论中，两次平行测验得分的相关系数 <strong>r</strong> 就等于该测验的信度。
            <br/><br/>
            当误差为 0 时，两次测验得分完全一致，点阵呈 45 度对角线，r = 1.00。误差越大，点阵越分散，信度越低。
          </p>
        </div>
      </Card>
    </div>
  );
};

function CTTPage({ onBack }: { onBack: () => void }) {
  const tabs = [
    { name: "射击模拟", icon: Target },
    { name: "X = T + E", icon: Activity },
    { name: "方差分解", icon: PieChart },
    { name: "平行测验", icon: ScatterIcon }
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans selection:bg-[#007AFF] selection:text-white pb-20 min-w-[1200px]">
      <header className="pt-12 pb-8 px-6 text-center relative w-[1152px] mx-auto">
        <button onClick={onBack} className="absolute left-6 top-12 flex items-center gap-2 text-[#007AFF] hover:text-[#0056b3] font-medium transition-colors">
          <ChevronRight size={20} className="rotate-180" /> 返回主页
        </button>
        <h1 className="text-4xl font-bold tracking-tight mb-3">经典测量理论 (CTT)</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          探索心理测量学的核心概念：真分数、误差、信度与效度。
        </p>
      </header>

      <div className="flex justify-center mb-12 px-4 w-[1152px] mx-auto">
        <div className="flex p-1.5 bg-gray-200/60 backdrop-blur-md rounded-2xl w-max overflow-x-auto shadow-inner">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} className={isActive ? "text-[#007AFF]" : ""} />
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="w-[1152px] mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {activeTab === 0 && <Module1 />}
            {activeTab === 1 && <Module2 />}
            {activeTab === 2 && <Module3 />}
            {activeTab === 3 && <Module4 />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-16 pb-8 text-center text-xs text-gray-400">
        浙江工业大学 心理学系 结构方程模型课程作业 林家宇
      </footer>
    </div>
  );
}

import FAPage from './FAPage';

export default function App() {
  const [route, setRoute] = useState<'home' | 'ctt' | 'fa'>('home');

  if (route === 'ctt') {
    return <CTTPage onBack={() => setRoute('home')} />;
  }

  if (route === 'fa') {
    return <FAPage onBack={() => setRoute('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans selection:bg-[#007AFF] selection:text-white flex flex-col items-center justify-center p-6 min-w-[1200px]">
      <div className="w-[1152px]">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">心理测量学交互演示</h1>
          <p className="text-xl text-gray-500">选择一个模块开始探索</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRoute('ctt')}
            className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/20 text-left flex flex-col h-full group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
              <BookOpen size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3">经典测量理论 (CTT)</h2>
            <p className="text-gray-500 mb-8 flex-grow">通过射击模拟、方差分解等直观交互，深入理解真分数、误差、信度与效度的核心概念。</p>
            <div className="flex items-center text-[#007AFF] font-medium">
              进入模块 <ChevronRight size={20} className="ml-1" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRoute('fa')}
            className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/20 text-left flex flex-col h-full group"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Network size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3">因子分析 (FA)</h2>
            <p className="text-gray-500 mb-8 flex-grow">探索潜在变量与观测变量之间的关系，理解探索性与验证性因子分析的数学原理。</p>
            <div className="flex items-center text-purple-600 font-medium">
              进入模块 <ChevronRight size={20} className="ml-1" />
            </div>
          </motion.button>
        </div>
        
        <footer className="mt-24 text-center text-sm text-gray-400">
          浙江工业大学 心理学系 结构方程模型课程作业 林家宇
        </footer>
      </div>
    </div>
  );
}
