'use client';

import { useState } from 'react';
import { authService, LoginCredentials } from '@/services/authService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { redirectByRole, getUserFromStorage } from '@/lib/roleRedirect';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      const user = getUserFromStorage();
      redirectByRole(router, user);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* ══════════════════════════════
           LEFT PANEL
        ══════════════════════════════ */
        .login-panel {
          display: none;
          position: relative;
          flex: 1.15;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .login-panel {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 52px 48px;
          }
        }

        /* Hero sky — matches site gradient */
        .panel-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(165deg,
            #2E1A45 0%,
            #4A2A6A 28%,
            #6B3A7A 52%,
            #8B4A6A 72%,
            #A05050 100%
          );
        }

        /* Atmospheric glows */
        .panel-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 35% at 18% 22%, rgba(232,100,46,0.28) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 78% 70%, rgba(180,70,70,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 55% 25% at 50% 0%, rgba(255,170,80,0.12) 0%, transparent 55%);
        }

        /* Stars */
        .panel-stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px);
          background-size: 130px 130px, 90px 90px, 70px 70px, 50px 50px;
          background-position: 18px 12px, 55px 38px, 12px 68px, 80px 20px;
          opacity: 0.55;
        }

        /* Celestial bodies */
        .panel-moon {
          position: absolute;
          top: 52px;
          right: 100px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,228,160,0.18);
          border: 1.5px solid rgba(255,228,160,0.35);
          box-shadow: 0 0 40px rgba(255,200,100,0.12);
        }
        .panel-sun {
          position: absolute;
          top: 44px;
          left: 72px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,160,60,0.45) 0%, rgba(232,80,30,0.18) 50%, transparent 72%);
        }

        /* Cityscape fills bottom 50% */
        .panel-city {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
        }
        .city-svg { width: 100%; height: 100%; }

        /* Content sits above city */
        .panel-content { position: relative; z-index: 2; }

        .panel-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-bottom: 22px;
        }
        .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #E8472E; flex-shrink: 0; }

        .panel-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 36px;
          font-weight: 600;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 14px;
          letter-spacing: -0.6px;
        }
        .panel-headline em {
          font-style: italic;
          color: rgba(255,195,150,0.95);
        }

        .panel-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.48);
          line-height: 1.65;
          max-width: 320px;
          margin-bottom: 30px;
        }

        .panel-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .panel-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.62);
          font-weight: 500;
        }
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #E8472E; }

        /* ══════════════════════════════
           RIGHT PANEL — form
        ══════════════════════════════ */
        .login-form-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          padding: 48px 24px;
          background: #F5F0E8;
          position: relative;
        }
        .login-form-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(160,100,60,0.045) 1px, transparent 1px);
          background-size: 26px 26px;
          pointer-events: none;
        }

        .form-box {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 38px;
          animation: fadeUp 0.4s ease both;
        }

        /* Heading */
        .form-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 27px;
          font-weight: 600;
          color: #1A1614;
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: -0.4px;
          animation: fadeUp 0.45s 0.05s ease both;
        }
        .form-sub {
          font-size: 14px;
          color: #9E9188;
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.55;
          animation: fadeUp 0.45s 0.1s ease both;
        }

        /* Error */
        .error-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 20px;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
        .error-icon { color: #DC2626; margin-top: 1px; flex-shrink: 0; }
        .error-text { font-size: 13px; color: #DC2626; line-height: 1.5; }

        /* Fields */
        .field-group { margin-bottom: 16px; animation: fadeUp 0.45s ease both; }
        .field-group:nth-of-type(1) { animation-delay: 0.14s; }
        .field-group:nth-of-type(2) { animation-delay: 0.2s; }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #5C504A;
          margin-bottom: 6px;
          letter-spacing: 0.1px;
        }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #C4BAB2;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-wrap.focused .field-icon { color: #E8472E; }

        .field-input {
          width: 100%;
          height: 48px;
          padding: 0 14px 0 42px;
          border: 1.5px solid #EDE8E0;
          border-radius: 12px;
          background: #fff;
          font-size: 14px;
          color: #1A1614;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #C4BAB2; }
        .field-input:focus {
          border-color: #E8472E;
          box-shadow: 0 0 0 3px rgba(232,71,46,0.1);
        }
        .field-input:disabled { opacity: 0.6; cursor: not-allowed; background: #FAF7F3; }

        /* Forgot */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -8px;
          margin-bottom: 24px;
        }
        .forgot-link {
          font-size: 12px;
          color: #9E9188;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .forgot-link:hover { color: #E8472E; }

        /* Submit */
        .submit-btn {
          width: 100%;
          height: 50px;
          background: #E8472E;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(232,71,46,0.28);
          animation: fadeUp 0.45s 0.26s ease both;
          letter-spacing: 0.1px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #C93D27;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(232,71,46,0.36);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 20px;
          animation: fadeUp 0.45s 0.32s ease both;
        }
        .divider-line { flex: 1; height: 1px; background: #EDE8E0; }
        .divider-text { font-size: 12px; color: #C4BAB2; font-weight: 500; white-space: nowrap; }

        /* Sign up */
        .signup-row {
          text-align: center;
          font-size: 14px;
          color: #9E9188;
          animation: fadeUp 0.45s 0.36s ease both;
        }
        .signup-link {
          color: #E8472E;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .signup-link:hover { color: #C93D27; }

        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-root">

        {/* ── Left decorative panel ── */}
        <div className="login-panel">
          <div className="panel-sky" />
          <div className="panel-glow" />
          <div className="panel-stars" />
          <div className="panel-moon" />
          <div className="panel-sun" />

          {/* Tunisian cityscape */}
          <div className="panel-city">
            <svg className="city-svg" viewBox="0 0 700 300" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="260" width="700" height="40" fill="#2E1A45" opacity="0.9"/>
              {/* Back row */}
              <rect x="0"   y="185" width="55"  height="90"  rx="2" fill="#6B3A7A" opacity="0.45"/>
              <rect x="60"  y="162" width="45"  height="113" rx="2" fill="#8B4A6A" opacity="0.4"/>
              <rect x="112" y="175" width="60"  height="100" rx="2" fill="#7B4A7A" opacity="0.42"/>
              <rect x="180" y="148" width="52"  height="127" rx="2" fill="#6B3A6A" opacity="0.45"/>
              <rect x="240" y="168" width="42"  height="107" rx="2" fill="#8B4A5A" opacity="0.4"/>
              <rect x="292" y="150" width="68"  height="125" rx="2" fill="#6B3A5A" opacity="0.44"/>
              <rect x="370" y="172" width="52"  height="103" rx="2" fill="#7B4A6A" opacity="0.4"/>
              <rect x="432" y="155" width="58"  height="120" rx="2" fill="#8B4A5A" opacity="0.42"/>
              <rect x="500" y="163" width="48"  height="112" rx="2" fill="#7B3A6A" opacity="0.42"/>
              <rect x="558" y="148" width="62"  height="127" rx="2" fill="#7B4A6A" opacity="0.42"/>
              <rect x="630" y="178" width="70"  height="97"  rx="2" fill="#8B4A5A" opacity="0.4"/>
              {/* Front buildings */}
              <rect x="0"   y="205" width="68"  height="65"  rx="3" fill="#C07868" opacity="0.72"/>
              <rect x="10"  y="220" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="30"  y="220" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="50"  y="220" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>

              <rect x="78"  y="188" width="82"  height="82"  rx="3" fill="#CC7A58" opacity="0.74"/>
              <rect x="93"  y="205" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="116" y="205" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="139" y="205" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <path d="M116 270 Q116 254 128 254 Q140 254 140 270" fill="#231534" opacity="0.5"/>

              {/* Minaret */}
              <rect x="176" y="148" width="24"  height="122" rx="2" fill="#985858" opacity="0.72"/>
              <rect x="170" y="146" width="36"  height="9"   rx="1" fill="#AA6868" opacity="0.7"/>
              <rect x="173" y="132" width="30"  height="18"  rx="2" fill="#A06060" opacity="0.7"/>
              <rect x="178" y="120" width="20"  height="16"  rx="2" fill="#B07070" opacity="0.7"/>
              <line x1="188" y1="95" x2="188" y2="120" stroke="#C08080" strokeWidth="2.5" opacity="0.6"/>
              <circle cx="188" cy="93" r="3" fill="#CC8888" opacity="0.7"/>

              <rect x="210" y="198" width="66"  height="72"  rx="3" fill="#C07060" opacity="0.72"/>
              <rect x="225" y="214" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="248" y="214" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>

              <rect x="286" y="178" width="88"  height="92"  rx="3" fill="#CC7C58" opacity="0.73"/>
              <rect x="302" y="196" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="326" y="196" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="350" y="196" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <path d="M326 270 Q326 252 338 252 Q350 252 350 270" fill="#231534" opacity="0.5"/>

              <rect x="385" y="202" width="60"  height="68"  rx="3" fill="#C07868" opacity="0.7"/>
              <rect x="400" y="218" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="424" y="218" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>

              <rect x="456" y="183" width="76"  height="87"  rx="3" fill="#B86060" opacity="0.72"/>
              <rect x="472" y="200" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="498" y="200" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>

              <rect x="545" y="194" width="70"  height="76"  rx="3" fill="#C07060" opacity="0.72"/>
              <rect x="560" y="210" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="584" y="210" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>

              <rect x="628" y="208" width="72"  height="62"  rx="3" fill="#CC7858" opacity="0.7"/>

              {/* Palm trees */}
              <line x1="68" y1="190" x2="68" y2="258" stroke="#3B2010" strokeWidth="4.5"/>
              <ellipse cx="68" cy="182" rx="20" ry="10" fill="#254018" opacity="0.72" transform="rotate(-18 68 182)"/>
              <ellipse cx="68" cy="187" rx="17" ry="8"  fill="#254018" opacity="0.6"  transform="rotate(22 68 187)"/>
              <ellipse cx="68" cy="184" rx="22" ry="7"  fill="#254018" opacity="0.5"  transform="rotate(4 68 184)"/>

              <line x1="608" y1="174" x2="608" y2="250" stroke="#3B2010" strokeWidth="4.5"/>
              <ellipse cx="608" cy="165" rx="22" ry="11" fill="#254018" opacity="0.72" transform="rotate(12 608 165)"/>
              <ellipse cx="608" cy="170" rx="18" ry="8"  fill="#254018" opacity="0.6"  transform="rotate(-22 608 170)"/>
              <ellipse cx="608" cy="167" rx="24" ry="7"  fill="#254018" opacity="0.5"  transform="rotate(-4 608 167)"/>
            </svg>
          </div>

          <div className="panel-content">
            <div className="panel-tag">
              <span className="tag-dot" />
              Tunisie · Méditerranée · Culture
            </div>
            <p className="panel-headline">
              Trouvez votre<br />
              prochain <em>séjour</em><br />
              en Tunisie.
            </p>
            <p className="panel-sub">
              Logements, expériences et services uniques — pour voyageurs, familles et étudiants.
            </p>
            <div className="panel-pills">
              <span className="panel-pill"><span className="pill-dot" />Logements vérifiés</span>
              <span className="panel-pill"><span className="pill-dot" />Expériences locales</span>
              <span className="panel-pill"><span className="pill-dot" />Services sur mesure</span>
            </div>
          </div>
        </div>

        {/* ── Right form side ── */}
        <div className="login-form-side">
          <div className="form-box">

            {/* Logo */}
            {/* <div className="logo-wrap">
              <Image
                src="/logo.svg"
                alt="Moxbnb"
                width={160}
                height={100}
                priority
              />
            </div> */}

            <h1 className="form-heading">{t('auth.login.title')}</h1>
            <p className="form-sub">{t('auth.login.description')}</p>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="error-alert" role="alert">
                  <AlertCircle size={16} className="error-icon" />
                  <span className="error-text">{error}</span>
                </div>
              )}

              <div className="field-group">
                <label htmlFor="email" className="field-label">{t('auth.login.email')}</label>
                <div className={`field-wrap ${focusedField === 'email' ? 'focused' : ''}`}>
                  <Mail size={16} className="field-icon" />
                  <input
                    id="email" name="email" type="email"
                    className="field-input"
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required disabled={loading} autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="password" className="field-label">{t('auth.login.password')}</label>
                <div className={`field-wrap ${focusedField === 'password' ? 'focused' : ''}`}>
                  <Lock size={16} className="field-icon" />
                  <input
                    id="password" name="password" type="password"
                    className="field-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required disabled={loading} autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="forgot-row">
                <Link href="/forgot-password" className="forgot-link">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><Loader2 size={16} className="spin" />{t('auth.login.signingIn')}</>
                  : t('auth.login.signIn')
                }
              </button>

              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">Nouveau sur Moxbnb ?</span>
                <span className="divider-line" />
              </div>

              <p className="signup-row">
                {t('auth.login.noAccount')}{' '}
                <Link href="/signup" className="signup-link">{t('auth.login.signUp')}</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}