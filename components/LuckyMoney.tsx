import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, Gift } from 'lucide-react';

/* ================= CONFIG ================= */

const OPEN_TIME = new Date('2026-11-17T00:00:00+07:00').getTime();

const STORAGE_RESULT = 'lucky_result_v2';
const STORAGE_STATS = 'lucky_stats_v2';
const STORAGE_FINGERPRINT = 'lucky_fp_v2';

const ENVELOPE_COUNT = 6;

type RewardType = 'money' | 'payback';

type Reward = {
  type: RewardType;
  amount?: number;
  message: string;
};

/* ================= HELPERS ================= */

const now = () => Date.now();

const getFingerprint = () => {
  let fp = localStorage.getItem(STORAGE_FINGERPRINT);
  if (!fp) {
    fp =
      navigator.userAgent +
      screen.width +
      screen.height +
      Intl.DateTimeFormat().resolvedOptions().timeZone +
      Math.random().toString(36).slice(2);
    localStorage.setItem(STORAGE_FINGERPRINT, fp);
  }
  return fp;
};

/* ================= CONFETTI ================= */

const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -20, opacity: 1, rotate: 0 }}
        animate={{
          y: 900,
          x: (Math.random() - 0.5) * 400,
          rotate: 720,
          opacity: 0,
        }}
        transition={{
          duration: Math.random() * 2 + 2,
          repeat: Infinity,
          repeatDelay: Math.random() * 3,
        }}
        className="absolute w-2 h-2 rounded-sm"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#fbbf24', '#ef4444', '#fde68a'][i % 3],
        }}
      />
    ))}
  </div>
);

/* ================= MAIN ================= */

const LuckyMoney: React.FC = () => {
  const [locked, setLocked] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [result, setResult] = useState<Reward | null>(null);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(true);
  const [stats, setStats] = useState({ total: 0, payback: 0 });

  const audioRef = useRef<HTMLAudioElement>(null);

  /* ===== Countdown ===== */
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = OPEN_TIME - now();
      if (diff <= 0) {
        setLocked(false);
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / 1000 / 3600);
        const m = Math.floor((diff / 1000 % 3600) / 60);
        const s = Math.floor(diff / 1000 % 60);
        setCountdown(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ===== Load saved ===== */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_RESULT);
    const statRaw = localStorage.getItem(STORAGE_STATS);

    if (saved) {
      const parsed = JSON.parse(saved);
      setResult(parsed.reward);
      setOpenedIndex(parsed.index);
    }

    if (statRaw) {
      setStats(JSON.parse(statRaw));
    }
  }, []);

  /* ===== Music control ===== */
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  /* ===== Reward Logic ===== */
  const generateReward = (): Reward => {
    const raw = localStorage.getItem(STORAGE_STATS);
    const current = raw ? JSON.parse(raw) : { total: 0, payback: 0 };

    const nextTotal = current.total + 1;
    const paybackLimit = Math.floor(nextTotal / 5); // 2 / 10

    let reward: Reward;

    if (current.payback < paybackLimit) {
      reward = {
        type: 'payback',
        message: '🎁 Lộc này xin gửi lại cho chủ nhà nhé ❤️',
      };
      current.payback++;
    } else {
      const moneyPool = [10000, 20000, 50000, 68000, 100000];
      reward = {
        type: 'money',
        amount: moneyPool[Math.floor(Math.random() * moneyPool.length)],
        message: '🧧 Lộc đầu năm – chúc bạn phát tài!',
      };
    }

    current.total++;
    localStorage.setItem(STORAGE_STATS, JSON.stringify(current));
    setStats(current);

    return reward;
  };

  /* ===== Open ===== */
  const openEnvelope = (idx: number) => {
    if (locked || result) return;

    const reward = generateReward();
    setOpenedIndex(idx);
    setResult(reward);

    localStorage.setItem(
      STORAGE_RESULT,
      JSON.stringify({ index: idx, reward, fp: getFingerprint() })
    );
  };

  /* ================= UI ================= */

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-amber-900 text-amber-100 flex items-center justify-center p-6 overflow-hidden">
      {result && <Confetti />}

      <audio
        ref={audioRef}
        src="https://docs.google.com/uc?export=download&id=1C8Q0zK2bC0"
        loop
      />

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-sm">
            <Sparkles size={16} /> Lì xì online
          </div>
          <h1 className="text-3xl font-bold">Mở bao lì xì đầu năm</h1>
        </div>

        {/* LOCKED */}
        {locked && <LockedScreen countdown={countdown} />}

        {/* UNLOCKED */}
        {!locked && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: ENVELOPE_COUNT }).map((_, idx) => (
                <motion.button
                  key={idx}
                  disabled={!!result}
                  whileHover={!result ? { y: -6 } : {}}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEnvelope(idx)}
                  className={`h-36 rounded-2xl border flex flex-col items-center justify-center shadow-lg
                    ${
                      openedIndex === idx
                        ? 'bg-amber-500/30 border-amber-300'
                        : 'bg-red-700 border-amber-500/40'
                    }`}
                >
                  <Gift size={32} />
                  <span className="mt-2">Phong bao {idx + 1}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-black/40 border border-amber-400/40 rounded-2xl p-6 text-center space-y-3"
                >
                  <p className="text-xl">{result.message}</p>

                  {result.type === 'money' && (
                    <p className="text-3xl font-bold text-amber-300">
                      {result.amount?.toLocaleString('vi-VN')} đ
                    </p>
                  )}

                  {result.type === 'payback' && (
                    <p className="text-sm text-amber-200">
                      💌 Mệnh giá tùy tâm – lì xì lại cho chủ nhà nhé
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/30 p-4 rounded-xl">
                👥 Tổng người chơi: <b>{stats.total}</b>
              </div>
              <div className="bg-black/30 p-4 rounded-xl">
                🔄 Trúng “lì xì lại”: <b>{stats.payback}</b>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <button onClick={() => setMusicOn(!musicOn)}>
            {musicOn ? <Volume2 /> : <VolumeX />}
          </button>
        </div>
      </div>
    </section>
  );
};

/* ================= LOCKED ================= */

const LockedScreen: React.FC<{ countdown: string }> = ({ countdown }) => (
  <div className="min-h-[520px] flex items-center justify-center">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-b from-red-900/80 to-amber-900/70
                 border border-amber-400/40 rounded-3xl p-10
                 text-center max-w-lg w-full shadow-2xl"
    >
      <motion.div
        animate={{ rotate: [0, -4, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="text-6xl mb-6"
      >
        🧧
      </motion.div>

      <h2 className="text-3xl font-bold mb-3">
        Bao lì xì đang ngủ đông 😴
      </h2>

      <p className="text-amber-200 mb-6">
        Mở sớm là xui nguyên năm đó nha 🤭
      </p>

      <div className="bg-black/30 border border-amber-400/30 rounded-2xl py-4">
        <p className="text-sm mb-1">Đếm ngược</p>
        <p className="text-3xl font-mono font-bold text-amber-300">
          {countdown}
        </p>
      </div>

      <p className="mt-4 text-xs italic">
        ⏰ {new Date(OPEN_TIME).toLocaleString('vi-VN')}
      </p>
    </motion.div>
  </div>
);

export default LuckyMoney;
