import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Shield, ShieldCheck, Swords, Zap } from 'lucide-react';

/* ───────────────────────────────────────────
   Validation rules
   ─────────────────────────────────────────── */
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-~`[\]\\/;'+=\s]/;

const RULES = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    test: (pw) => pw.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: 'lowercase',
    label: 'One lowercase letter',
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    key: 'number',
    label: 'One number',
    test: (pw) => /\d/.test(pw),
  },
  {
    key: 'special',
    label: 'One special character',
    test: (pw) => SPECIAL_CHAR_REGEX.test(pw),
  },
];

/* ───────────────────────────────────────────
   Strength scoring
   ─────────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '', barColor: '', barWidth: '0%' };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (SPECIAL_CHAR_REGEX.test(pw)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'text-red-500', barColor: 'bg-red-500', barWidth: '20%', icon: AlertCircle };
  if (score <= 3) return { score, label: 'Fair', color: 'text-orange-500', barColor: 'bg-orange-500', barWidth: '40%', icon: Shield };
  if (score <= 4) return { score, label: 'Good', color: 'text-yellow-500', barColor: 'bg-yellow-500', barWidth: '65%', icon: ShieldCheck };
  return { score, label: 'Strong', color: 'text-emerald-500', barColor: 'bg-emerald-500', barWidth: '100%', icon: Zap };
};

/* ───────────────────────────────────────────
   Animation variants
   ─────────────────────────────────────────── */
const ruleItemVariants = {
  hidden: { opacity: 0, x: -12, height: 0 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    height: 'auto',
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 12, height: 0, transition: { duration: 0.2 } },
};

const barVariants = {
  initial: { width: 0 },
  animate: (width) => ({
    width,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ───────────────────────────────────────────
   Component
   ─────────────────────────────────────────── */
export default function PasswordStrength({
  password = '',
  confirmPassword = '',
  showRules = true,
  showStrength = true,
  showMatch = true,
  className = '',
}) {
  const results = useMemo(
    () => RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );

  const passedCount = useMemo(() => results.filter((r) => r.passed).length, [results]);

  const strength = useMemo(() => getStrength(password), [password]);

  const matchStatus = useMemo(() => {
    if (!confirmPassword) return { passed: false, visible: false };
    if (password === confirmPassword) return { passed: true, visible: true };
    return { passed: false, visible: true };
  }, [password, confirmPassword]);

  const hasPassword = password.length > 0;
  const StrengthIcon = strength.icon;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* ── Strength meter ── */}
      {showStrength && hasPassword && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1.5"
        >
          {/* Bar track */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-line">
            <motion.div
              variants={barVariants}
              initial="initial"
              animate="animate"
              custom={strength.barWidth}
              className={`absolute inset-y-0 left-0 rounded-full ${strength.barColor}`}
              style={{ width: strength.barWidth }}
            />
          </div>

          {/* Label */}
          <div className="flex items-center gap-1.5">
            <StrengthIcon size={13} className={strength.color} />
            <span className={`text-xs font-semibold ${strength.color}`}>
              {strength.label}
            </span>
            <span className="text-[10px] text-faint">
              {passedCount}/{RULES.length} rules met
            </span>
          </div>
        </motion.div>
      )}

      {/* ── Validation rules ── */}
      {showRules && hasPassword && (
        <motion.ul
          initial="hidden"
          animate="visible"
          className="space-y-1.5"
        >
          <AnimatePresence>
            {results.map((rule, i) => (
              <motion.li
                key={rule.key}
                variants={ruleItemVariants}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-2 text-xs"
              >
                {rule.passed ? (
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                ) : (
                  <XCircle size={14} className="shrink-0 text-red-400" />
                )}
                <span
                  className={
                    rule.passed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted'
                  }
                >
                  {rule.label}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* ── Passwords match indicator ── */}
      {showMatch && matchStatus.visible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs"
        >
          {matchStatus.passed ? (
            <>
              <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Passwords match
              </span>
            </>
          ) : (
            <>
              <XCircle size={14} className="shrink-0 text-red-400" />
              <span className="text-red-500 font-medium">Passwords do not match</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}