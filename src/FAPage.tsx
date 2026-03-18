import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Layers, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

// --- UI Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, valueLabel, colorHex = "#6366f1", snapToZero = false }: any) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const zeroPercentage = ((0 - min) / (max - min)) * 100;
  const hasZero = min < 0 && max > 0;

  const handleChange = (e: any) => {
    let val = parseFloat(e.target.value);
    if (snapToZero && Math.abs(val) < 0.08) {
      val = 0;
    }
    onChange(val);
  };

  let backgroundStyle;
  if (min < 0) {
    const start = Math.min(zeroPercentage, percentage);
    const end = Math.max(zeroPercentage, percentage);
    backgroundStyle = `linear-gradient(to right, #E5E7EB ${start}%, ${colorHex} ${start}%, ${colorHex} ${end}%, #E5E7EB ${end}%)`;
  } else {
    backgroundStyle = `linear-gradient(to right, ${colorHex} ${percentage}%, #E5E7EB ${percentage}%)`;
  }

  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold font-mono" style={{ color: colorHex }}>{valueLabel || value}</span>
      </div>
      <div className="relative flex items-center h-6">
        {hasZero && (
          <div 
            className="absolute h-4 w-0.5 bg-gray-400 z-0 rounded-full"
            style={{ left: `${zeroPercentage}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 rounded-full appearance-none outline-none z-10 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-100"
          style={{
            background: backgroundStyle
          }}
        />
      </div>
    </div>
  );
};

// --- Intro Component ---
const FAIntro = ({ onStart }: { onStart: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-center">
    <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-xl border-white/20 shadow-xl max-w-4xl w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">因子分析的通用矩阵模型</h2>
      <p className="text-gray-600 mb-4 leading-normal text-sm md:text-base">
        如果说 CTT 是对单一总分的拆解，那么因子分析就是将所有题目的得分看作一个向量系统，试图用少数几个不可直接观测的“公共因子（潜变量）”来解释大量观测变量之间的相互关系。
      </p>
      <div className="bg-gray-50 rounded-2xl p-4 mb-4 overflow-x-auto border border-gray-100 shadow-inner">
        <div className="text-center text-lg md:text-xl text-gray-900 mb-2">
          <BlockMath math="\mathbf{x} = \boldsymbol{\mu} + \boldsymbol{\Lambda}\mathbf{f} + \boldsymbol{\epsilon}" />
        </div>
        <p className="text-center text-xs md:text-sm text-gray-500 mb-2">假定数据已中心化 (<InlineMath math="\boldsymbol{\mu} = \mathbf{0}" />)，模型简化为：</p>
        <div className="text-center text-xl md:text-2xl text-indigo-700 font-bold">
          <BlockMath math="\mathbf{x} = \boldsymbol{\Lambda}\mathbf{f} + \boldsymbol{\epsilon}" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs md:text-sm text-gray-700 bg-white p-4 rounded-2xl border border-gray-100">
        <div className="flex items-start gap-2">
          <span className="text-indigo-600 font-bold text-base w-6 text-center"><InlineMath math="\mathbf{x}" /></span>
          <span><InlineMath math="p \times 1" /> 的观测变量向量（代表被试在 p 道题目上的得分）。</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-purple-600 font-bold text-base w-6 text-center"><InlineMath math="\boldsymbol{\Lambda}" /></span>
          <span><InlineMath math="p \times m" /> 的因子载荷矩阵 (Factor Loading Matrix)。矩阵中的每个元素代表观测变量在公共因子上的载荷。</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold text-base w-6 text-center"><InlineMath math="\mathbf{f}" /></span>
          <span><InlineMath math="m \times 1" /> 的公共因子向量 (Latent Factors)。代表我们要测量的、不可观测的潜在心理特质。</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-rose-600 font-bold text-base w-6 text-center"><InlineMath math="\boldsymbol{\epsilon}" /></span>
          <span><InlineMath math="p \times 1" /> 的唯一因子 (或测量误差) 向量。包含题目的特殊变异和随机误差。</span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button 
          onClick={onStart} 
          className="px-6 py-2 bg-[#007AFF] text-white rounded-full font-bold shadow-lg hover:bg-[#0056b3] transition-colors flex items-center gap-2 text-base"
        >
          进入探索 <ChevronRight size={18} />
        </button>
      </div>
    </Card>
  </motion.div>
);

// --- Modules ---

// Module 1: Covariance Reproduction
const Module1 = () => {
  const [lambda1, setLambda1] = useState(0.7);
  const [lambda2, setLambda2] = useState(0.7);

  const r = lambda1 * lambda2;
  
  // Distance between X1 and X2 (max distance 300, min 100)
  const distance = 300 - Math.abs(r) * 200;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
      <Card className="p-8 lg:col-span-2 flex flex-col gap-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">潜变量提线木偶</h3>
          <p className="text-sm text-gray-500">
            调整因子载荷 (<InlineMath math="\lambda" />)，观察两个观测变量之间的相关性是如何被潜变量“牵引”出来的。
          </p>
        </div>
        
        <div className="space-y-2">
          <Slider label={<span>题目 1 载荷 (<InlineMath math="\lambda_1" />)</span>} value={lambda1} onChange={setLambda1} min={-1} max={1} step={0.01} valueLabel={lambda1.toFixed(2)} colorHex="#6366f1" snapToZero={true} />
          <Slider label={<span>题目 2 载荷 (<InlineMath math="\lambda_2" />)</span>} value={lambda2} onChange={setLambda2} min={-1} max={1} step={0.01} valueLabel={lambda2.toFixed(2)} colorHex="#6366f1" snapToZero={true} />
        </div>

        <div className="mt-auto bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <p className="text-sm text-indigo-600 font-medium mb-3">协方差再现法则</p>
          <div className="text-lg text-indigo-900">
            <BlockMath math={`Cov(X_1, X_2) = \\lambda_1 \\times \\lambda_2`} />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-4 text-center">
            {lambda1.toFixed(2)} × {lambda2.toFixed(2)} = {r.toFixed(4)}
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:col-span-3 flex items-center justify-center relative min-h-[400px]">
        <div className="relative w-full max-w-lg h-80 flex flex-col items-center">
          {/* Latent Variable */}
          <motion.div 
            className="absolute top-0 w-40 h-24 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-[100%] flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] z-10 border-4 border-white"
            layout
          >
            <span className="text-white font-bold text-2xl tracking-widest">F</span>
          </motion.div>

          {/* Lines */}
          <svg className="absolute top-12 w-full h-64 overflow-visible pointer-events-none">
            <motion.line
              x1="50%" y1="0"
              x2={`calc(50% - ${distance / 2}px)`} y2="100%"
              stroke={lambda1 >= 0 ? "#6366f1" : "#f43f5e"}
              strokeWidth={Math.max(2, Math.abs(lambda1) * 12)}
              strokeOpacity={0.7}
              animate={{ x2: `calc(50% - ${distance / 2}px)` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            <motion.line
              x1="50%" y1="0"
              x2={`calc(50% + ${distance / 2}px)`} y2="100%"
              stroke={lambda2 >= 0 ? "#6366f1" : "#f43f5e"}
              strokeWidth={Math.max(2, Math.abs(lambda2) * 12)}
              strokeOpacity={0.7}
              animate={{ x2: `calc(50% + ${distance / 2}px)` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </svg>

          {/* Observed Variables */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <motion.div 
              className="absolute w-28 h-20 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-md z-10"
              animate={{ x: -distance / 2 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <span className="text-gray-700 font-bold text-xl">X₁</span>
            </motion.div>
            <motion.div 
              className="absolute w-28 h-20 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-md z-10"
              animate={{ x: distance / 2 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <span className="text-gray-700 font-bold text-xl">X₂</span>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Module 2: Variance Decomposition
const Module2 = () => {
  const [lambda, setLambda] = useState(0.7);
  
  const h2 = lambda * lambda;
  const u2 = 1 - h2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
      <Card className="p-8 lg:col-span-2 flex flex-col gap-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">题目的“纯度”透视仪</h3>
          <p className="text-sm text-gray-500">
            观察因子载荷 (<InlineMath math="\lambda" />) 的变化如何非线性地影响题目的共同度 (<InlineMath math="h^2" />) 和唯一性 (<InlineMath math="u^2" />)。
          </p>
        </div>
        
        <div className="space-y-2">
          <Slider label={<span>因子载荷 (<InlineMath math="\lambda" />)</span>} value={lambda} onChange={setLambda} min={0} max={1} step={0.01} valueLabel={lambda.toFixed(2)} colorHex="#10b981" />
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <p className="text-sm text-emerald-700 font-medium mb-2">共同度 (Communality)</p>
            <div className="text-lg text-emerald-900">
              <BlockMath math={`h^2 = \\lambda^2 = ${h2.toFixed(4)}`} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <p className="text-sm text-gray-600 font-medium mb-2">唯一性 (Uniqueness)</p>
            <div className="text-lg text-gray-800">
              <BlockMath math={`u^2 = 1 - \\lambda^2 = ${u2.toFixed(4)}`} />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 lg:col-span-3 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-full max-w-xl">
          <div className="flex justify-between mb-3 px-2">
            <span className="text-base font-bold text-emerald-600">有效变异 (h²)</span>
            <span className="text-base font-bold text-gray-400">误差变异 (u²)</span>
          </div>
          
          {/* Capsule */}
          <div className="h-32 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner border-4 border-white relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center"
              animate={{ width: `${h2 * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {h2 > 0.08 && <span className="text-white font-bold font-mono text-2xl">{Math.round(h2 * 100)}%</span>}
            </motion.div>
            <motion.div 
              className="h-full bg-gray-200 flex items-center justify-center"
              animate={{ width: `${u2 * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {u2 > 0.08 && <span className="text-gray-500 font-bold font-mono text-2xl">{Math.round(u2 * 100)}%</span>}
            </motion.div>
          </div>

          <div className="mt-16 text-center h-24">
            <p className="text-gray-600 text-xl">
              当载荷 <InlineMath math="\lambda" /> = <span className="font-bold text-gray-900">{lambda.toFixed(2)}</span> 时，<br/>
              题目有 <span className="font-bold text-emerald-600">{Math.round(h2 * 100)}%</span> 的变异能被潜变量解释。
            </p>
            <AnimatePresence>
              {lambda < 0.7 && lambda > 0 && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-rose-500 text-base mt-4 font-medium bg-rose-50 inline-block px-6 py-2 rounded-full border border-rose-100"
                >
                  注意：载荷不到 0.7，题目一半以上的变异都是误差！
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Module 3: Factor Rotation (2D & 3D)
const multiplyMatrix = (A: number[][], B: number[][]) => {
  const m = A.length, n = A[0].length, p = B[0].length;
  const C = Array(m).fill(0).map(() => Array(p).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
};

const transpose = (A: number[][]) => A[0].map((_, colIndex) => A.map(row => row[colIndex]));

const getRotX = (deg: number) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [[1, 0, 0], [0, c, -s], [0, s, c]]; };
const getRotY = (deg: number) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]; };
const getRotZ = (deg: number) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; };

const Module3 = () => {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  
  // 2D State
  const [rotationDeg, setRotationDeg] = useState(0);
  
  // 3D State
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  // --- 2D Logic ---
  const originalPoints2D = useMemo(() => [
    { id: 1, x: 0.69, y: 0.40 }, { id: 2, x: 0.60, y: 0.45 }, { id: 3, x: 0.78, y: 0.35 }, { id: 4, x: 0.52, y: 0.48 }, { id: 5, x: 0.85, y: 0.28 },
    { id: 6, x: -0.40, y: 0.69 }, { id: 7, x: -0.45, y: 0.60 }, { id: 8, x: -0.35, y: 0.78 }, { id: 9, x: -0.48, y: 0.52 }, { id: 10, x: -0.28, y: 0.85 },
  ], []);

  const rotationRad = (rotationDeg * Math.PI) / 180;
  const rotatedPoints2D = useMemo(() => {
    return originalPoints2D.map(p => {
      const newX = p.x * Math.cos(rotationRad) + p.y * Math.sin(rotationRad);
      const newY = -p.x * Math.sin(rotationRad) + p.y * Math.cos(rotationRad);
      return { ...p, rx: newX, ry: newY };
    });
  }, [originalPoints2D, rotationRad]);

  // --- 3D Logic ---
  const original3D = useMemo(() => {
    // Target simple structure (3 factors, 9 variables)
    const target3D = [
      [0.85, 0.10, 0.05], [0.80, 0.15, 0.00], [0.75, 0.05, 0.10], // F1
      [0.10, 0.85, 0.05], [0.05, 0.80, 0.15], [0.15, 0.75, 0.05], // F2
      [0.05, 0.10, 0.85], [0.00, 0.15, 0.80], [0.10, 0.05, 0.75], // F3
    ];
    // Secret rotation to scramble them: X=30, Y=-45, Z=15
    const T_secret = multiplyMatrix(multiplyMatrix(getRotZ(15), getRotY(-45)), getRotX(30));
    const T_secret_inv = transpose(T_secret);
    return multiplyMatrix(target3D, T_secret_inv);
  }, []);

  const T_user = useMemo(() => multiplyMatrix(multiplyMatrix(getRotZ(rotZ), getRotY(rotY)), getRotX(rotX)), [rotX, rotY, rotZ]);
  const currentLoadings3D = useMemo(() => multiplyMatrix(original3D, T_user), [original3D, T_user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
      <Card className="p-8 lg:col-span-2 flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">星系旋转寻找真相</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {mode === '2d' ? '旋转坐标轴 (Rotation) 使因子载荷矩阵达到“简单结构”，让每个题目只在一个因子上有高载荷。尝试旋转到 30° 左右。' : '在三维空间中旋转三个因子轴，观察载荷矩阵如何通过空间变换达到清晰的简单结构。尝试：X=30°, Y=-45°, Z=15°。'}
          </p>
        </div>
        
        {mode === '2d' ? (
          <>
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 w-full overflow-hidden">
              <p className="text-sm text-purple-700 font-medium mb-2">正交旋转矩阵</p>
              <div className="text-xs text-purple-900 overflow-x-auto pb-2 w-full">
                <BlockMath math={`\\begin{pmatrix} F_1' \\\\ F_2' \\end{pmatrix} = \\begin{pmatrix} \\cos(${rotationDeg}^\\circ) & \\sin(${rotationDeg}^\\circ) \\\\ -\\sin(${rotationDeg}^\\circ) & \\cos(${rotationDeg}^\\circ) \\end{pmatrix} \\begin{pmatrix} F_1 \\\\ F_2 \\end{pmatrix}`} />
              </div>
            </div>
            <div className="mt-auto overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm flex-grow">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3">题目</th>
                    <th className="px-4 py-3">Factor 1</th>
                    <th className="px-4 py-3">Factor 2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rotatedPoints2D.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-1.5 text-gray-500 font-medium">V{p.id}</td>
                      <td className="px-4 py-1.5">
                        <span className={`px-2 py-0.5 rounded-md transition-colors ${Math.abs(p.rx) > 0.5 ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-400'}`}>
                          {p.rx.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-1.5">
                        <span className={`px-2 py-0.5 rounded-md transition-colors ${Math.abs(p.ry) > 0.5 ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-400'}`}>
                          {p.ry.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="mt-auto overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm flex-grow">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3">题目</th>
                    <th className="px-4 py-3">Factor 1</th>
                    <th className="px-4 py-3">Factor 2</th>
                    <th className="px-4 py-3">Factor 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentLoadings3D.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-1.5 text-gray-500 font-medium">V{idx + 1}</td>
                      <td className="px-4 py-1.5">
                        <span className={`px-2 py-0.5 rounded-md transition-colors ${Math.abs(row[0]) > 0.5 ? 'bg-red-100 text-red-700 font-bold' : 'text-gray-400'}`}>
                          {row[0].toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-1.5">
                        <span className={`px-2 py-0.5 rounded-md transition-colors ${Math.abs(row[1]) > 0.5 ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-400'}`}>
                          {row[1].toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-1.5">
                        <span className={`px-2 py-0.5 rounded-md transition-colors ${Math.abs(row[2]) > 0.5 ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-400'}`}>
                          {row[2].toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Card className="p-0 lg:col-span-3 flex flex-col items-center justify-start min-h-[500px] overflow-hidden bg-white relative border border-gray-200 shadow-sm">
        <div className="w-full p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-20 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-gray-900 font-medium">旋转控制</h4>
            <div className="flex bg-gray-100/80 p-1.5 rounded-xl shadow-inner border border-gray-200/60">
              <button 
                onClick={() => setMode('2d')} 
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 ${mode === '2d' ? 'bg-white shadow-md text-indigo-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
              >
                2D 模式
              </button>
              <button 
                onClick={() => setMode('3d')} 
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 ${mode === '3d' ? 'bg-white shadow-md text-purple-600 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
              >
                3D 模式
              </button>
            </div>
          </div>
          
          {mode === '2d' ? (
            <Slider label={<span className="text-gray-700">旋转角度 (度)</span>} value={rotationDeg} onChange={setRotationDeg} min={0} max={90} step={1} valueLabel={`${rotationDeg}°`} colorHex="#a855f7" />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <Slider label={<span className="text-red-600">X轴旋转</span>} value={rotX} onChange={setRotX} min={-90} max={90} step={1} valueLabel={`${rotX}°`} colorHex="#ef4444" snapToZero={true} />
              <Slider label={<span className="text-green-600">Y轴旋转</span>} value={rotY} onChange={setRotY} min={-90} max={90} step={1} valueLabel={`${rotY}°`} colorHex="#22c55e" snapToZero={true} />
              <Slider label={<span className="text-blue-600">Z轴旋转</span>} value={rotZ} onChange={setRotZ} min={-90} max={90} step={1} valueLabel={`${rotZ}°`} colorHex="#3b82f6" snapToZero={true} />
            </div>
          )}
        </div>

        <div className="flex-grow flex items-center justify-center w-full relative">
        {mode === '2d' ? (
          <div className="relative w-[400px] h-[400px] bg-gray-50 rounded-full border border-gray-200 shadow-inner">
            {/* Base Grid (Centered) */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 -translate-x-1/2" />
            <span className="absolute top-1/2 right-4 -translate-y-6 text-gray-400 font-bold text-sm">F1</span>
            <span className="absolute top-4 left-1/2 translate-x-2 text-gray-400 font-bold text-sm">F2</span>
            
            {/* Rotated Axes */}
            <motion.div 
              className="absolute inset-0 origin-center"
              animate={{ rotate: -rotationDeg }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* X Axis (F1') */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-500 -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
              <span className="absolute top-1/2 right-4 -translate-y-6 text-purple-600 font-bold text-sm">F1'</span>
              
              {/* Y Axis (F2') */}
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-indigo-500 -translate-x-1/2 shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
              <span className="absolute top-4 left-1/2 translate-x-2 text-indigo-600 font-bold text-sm">F2'</span>
            </motion.div>

            {/* Projection Lines */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0">
              {rotatedPoints2D.map((p) => {
                const scale = 160;
                const px = 200 + p.x * scale;
                const py = 200 - p.y * scale;
                const projF1x = 200 + (p.rx * Math.cos(rotationRad)) * scale;
                const projF1y = 200 - (p.rx * Math.sin(rotationRad)) * scale;
                const projF2x = 200 + (-p.ry * Math.sin(rotationRad)) * scale;
                const projF2y = 200 - (p.ry * Math.cos(rotationRad)) * scale;

                return (
                  <g key={`proj-${p.id}`}>
                    <motion.line x1={px} y1={py} animate={{ x2: projF1x, y2: projF1y }} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" transition={{ type: "spring", stiffness: 100, damping: 20 }} />
                    <motion.line x1={px} y1={py} animate={{ x2: projF2x, y2: projF2y }} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" transition={{ type: "spring", stiffness: 100, damping: 20 }} />
                  </g>
                );
              })}
            </svg>

            {/* Points */}
            {originalPoints2D.map((p) => (
              <div
                key={p.id}
                className="absolute w-3 h-3 bg-gray-800 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${200 + p.x * 160}px`, top: `${200 - p.y * 160}px` }}
              >
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 font-bold">V{p.id}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ perspective: '1000px' }} className="w-full h-full flex items-center justify-center">
            <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-15deg) rotateY(25deg)' }} className="relative w-0 h-0">
              {/* Base Axes (Faint) */}
              <div className="absolute w-[400px] h-px bg-gray-300 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-px h-[400px] bg-gray-300 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-[400px] h-px bg-gray-300 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotateY(90deg)' }} />

              {/* Rotated Axes */}
              <motion.div 
                style={{ transformStyle: 'preserve-3d' }} 
                animate={{ rotateX: rotX, rotateY: rotY, rotateZ: rotZ }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="absolute inset-0"
              >
                {/* X' Axis (Red) */}
                <div className="absolute w-[400px] h-[3px] bg-red-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
                <div className="absolute text-red-600 font-bold text-sm" style={{ transform: 'translate3d(210px, -10px, 0)' }}>F1'</div>
                
                {/* Y' Axis (Green) */}
                <div className="absolute w-[3px] h-[400px] bg-green-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                <div className="absolute text-green-600 font-bold text-sm" style={{ transform: 'translate3d(10px, -210px, 0)' }}>F2'</div>
                
                {/* Z' Axis (Blue) */}
                <div className="absolute w-[400px] h-[3px] bg-blue-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.3)]" style={{ transform: 'rotateY(90deg)' }} />
                <div className="absolute text-blue-600 font-bold text-sm" style={{ transform: 'translate3d(10px, -10px, 210px)' }}>F3'</div>
              </motion.div>

              {/* 3D Points */}
              {original3D.map((row, i) => {
                // Determine color based on which factor it *should* load on
                let color = "bg-gray-800";
                if (i < 3) color = "bg-red-500";
                else if (i < 6) color = "bg-green-500";
                else color = "bg-blue-500";

                return (
                  <div 
                    key={i} 
                    className={`absolute w-4 h-4 ${color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] border border-white`}
                    style={{ 
                      transform: `translate3d(${row[0]*180}px, ${-row[1]*180}px, ${row[2]*180}px) translate(-50%, -50%)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Keep label facing camera roughly by reversing the parent's base rotation */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-800 font-bold whitespace-nowrap" style={{ transform: 'rotateY(-25deg) rotateX(15deg)' }}>
                      V{i+1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </Card>
    </div>
  );
};

// Module 4: Cross-loading and CFA
const Module4 = () => {
  const [crossLoading, setCrossLoading] = useState(0);
  
  const isBadFit = crossLoading > 0.4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
      <Card className="p-8 lg:col-span-2 flex flex-col gap-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">建构效度排雷专家</h3>
          <p className="text-sm text-gray-500">
            在验证性因子分析 (CFA) 中，严重的交叉载荷会破坏量表的建构效度。
          </p>
        </div>
        
        <div className="space-y-2">
          <Slider label="题 3 在 F2 上的交叉载荷" value={crossLoading} onChange={setCrossLoading} min={0} max={1} step={0.01} valueLabel={crossLoading.toFixed(2)} colorHex="#f43f5e" />
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <p className="text-sm text-gray-700 font-medium mb-2">CFA 测量方程</p>
          <div className="text-lg text-gray-900 overflow-x-auto">
            <BlockMath math={`X = \\Lambda \\xi + \\delta`} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            当存在交叉载荷时，<InlineMath math="\Lambda" /> 矩阵不再是理想的简单结构（即某些非目标载荷不为 0），这会降低模型的拟合度。
          </p>
        </div>

        <div className="mt-auto">
          <AnimatePresence mode="wait">
            {isBadFit ? (
              <motion.div
                key="bad"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
              >
                <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-rose-800 font-bold text-lg mb-1">模型拟合极差</h4>
                  <p className="text-rose-600 text-sm leading-relaxed">警告：题 3 存在严重交叉载荷，特质指向不清，建议删题或修改模型。</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="good"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-emerald-800 font-bold text-lg mb-1">模型拟合极佳</h4>
                  <p className="text-emerald-600 text-sm leading-relaxed">简单结构清晰，建构效度良好。</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Card className={`p-8 lg:col-span-3 flex items-center justify-center min-h-[500px] transition-colors duration-700 ${isBadFit ? 'bg-rose-50/50' : 'bg-emerald-50/50'}`}>
        <div className="relative w-full max-w-2xl h-96">
          {/* Latent Variables */}
          <div className="absolute top-0 w-full flex justify-around">
            <div className="w-32 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-[100%] flex items-center justify-center shadow-lg z-20 border-4 border-white">
              <span className="text-white font-bold text-lg">F1 (抑郁)</span>
            </div>
            <div className="w-32 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-[100%] flex items-center justify-center shadow-lg z-20 border-4 border-white">
              <span className="text-white font-bold text-lg">F2 (焦虑)</span>
            </div>
          </div>

          {/* SVG Lines */}
          <svg className="absolute top-10 left-0 w-full h-72 overflow-visible z-10">
            {/* F1 to Item 1 */}
            <line x1="25%" y1="0" x2="12.5%" y2="100%" stroke="#6366f1" strokeWidth="4" strokeOpacity="0.7" />
            {/* F1 to Item 2 */}
            <line x1="25%" y1="0" x2="37.5%" y2="100%" stroke="#6366f1" strokeWidth="4" strokeOpacity="0.7" />
            {/* F1 to Item 3 */}
            <line x1="25%" y1="0" x2="62.5%" y2="100%" stroke="#6366f1" strokeWidth="4" strokeOpacity="0.7" />
            
            {/* F2 to Item 4 */}
            <line x1="75%" y1="0" x2="87.5%" y2="100%" stroke="#a855f7" strokeWidth="4" strokeOpacity="0.7" />
            
            {/* Cross-loading F2 to Item 3 */}
            <motion.line 
              x1="75%" y1="0" x2="62.5%" y2="100%" 
              stroke="#f43f5e" 
              strokeWidth={crossLoading * 12} 
              strokeOpacity={crossLoading}
              strokeDasharray={isBadFit ? "none" : "8,8"}
              animate={{
                strokeWidth: crossLoading * 12,
                strokeOpacity: crossLoading > 0.1 ? crossLoading : 0
              }}
            />
          </svg>

          {/* Observed Variables */}
          <div className="absolute bottom-0 w-full flex justify-around px-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={`w-20 h-16 bg-white border-2 ${item === 3 && isBadFit ? 'border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'border-gray-200'} rounded-xl flex items-center justify-center shadow-md z-20 transition-all duration-300`}>
                <span className="text-gray-800 font-bold text-base">题 {item}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Main Page ---
export default function FAPage({ onBack }: { onBack: () => void }) {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: '协方差再现', icon: Activity },
    { id: 1, name: '方差分解', icon: Layers },
    { id: 2, name: '因子旋转', icon: RotateCcw },
    { id: 3, name: '建构效度', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-[#F5F5F7] to-purple-50/50 text-gray-900 font-sans selection:bg-[#007AFF] selection:text-white pb-20 min-w-[1200px]">
      <header className="pt-12 pb-8 px-6 text-center relative w-[1152px] mx-auto">
        <button onClick={onBack} className="absolute left-6 top-12 flex items-center gap-2 text-[#007AFF] hover:text-[#0056b3] font-medium transition-colors">
          <ChevronRight size={20} className="rotate-180" /> 返回主页
        </button>
        <h1 className="text-4xl font-bold tracking-tight mb-3">因子分析 (FA) 探索</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          探索潜在变量与观测变量之间的关系，理解探索性与验证性因子分析的数学原理。
        </p>
      </header>

      <main className="w-[1152px] mx-auto px-6">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <FAIntro onStart={() => setShowIntro(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-center mb-12 px-4">
                <div className="flex p-1.5 bg-gray-200/60 backdrop-blur-md rounded-2xl w-max overflow-x-auto shadow-inner">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeFATabIndicator"
                            className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon size={16} className={isActive ? "text-indigo-600" : ""} />
                          {tab.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
