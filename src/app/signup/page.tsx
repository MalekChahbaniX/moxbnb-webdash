'use client';

import { useState } from 'react';
import { RegisterData } from '@/services/authService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { redirectByRole, getUserFromStorage } from '@/lib/roleRedirect';
import { Loader2, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.5z" fill="#4285F4"/>
      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.6v6.2C6.5 42.6 14.7 48 24 48z" fill="#34A853"/>
      <path d="M10.5 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6v-6.2H2.6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z" fill="#FBBC05"/>
      <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.2 30.5 0 24 0 14.7 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
    </svg>
  );
}

export default function SignupPage() {
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();
  const { register } = useAuth();

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
      await register(formData);
      const user = getUserFromStorage();
      redirectByRole(router, user);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .su-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* ══════════════════════════════
           LEFT PANEL
        ══════════════════════════════ */
        .su-panel {
          display: none;
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .su-panel {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 52px 48px;
          }
        }

        .panel-sky {
          position: absolute; inset: 0;
          background: linear-gradient(165deg,
            #2E1A45 0%, #4A2A6A 28%, #6B3A7A 52%, #8B4A6A 72%, #A05050 100%
          );
        }
        .panel-glow {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 50% 35% at 18% 22%, rgba(232,100,46,0.28) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 78% 70%, rgba(180,70,70,0.2)  0%, transparent 60%),
            radial-gradient(ellipse 55% 25% at 50% 0%,  rgba(255,170,80,0.12) 0%, transparent 55%);
        }
        .panel-stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px);
          background-size: 130px 130px, 90px 90px, 70px 70px;
          background-position: 18px 12px, 55px 38px, 12px 68px;
          opacity: 0.55;
        }
        .panel-moon {
          position: absolute; top: 52px; right: 100px;
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,228,160,0.18);
          border: 1.5px solid rgba(255,228,160,0.35);
          box-shadow: 0 0 40px rgba(255,200,100,0.12);
        }
        .panel-sun {
          position: absolute; top: 44px; left: 72px;
          width: 58px; height: 58px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,160,60,0.45) 0%, rgba(232,80,30,0.18) 50%, transparent 72%);
        }
        .panel-city {
          position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
        }
        .city-svg { width: 100%; height: 100%; }
        .panel-content { position: relative; z-index: 2; }

        .panel-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          border-radius: 20px; padding: 6px 16px;
          font-size: 12px; color: rgba(255,255,255,0.8);
          font-weight: 500; letter-spacing: 0.5px; margin-bottom: 22px;
        }
        .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #E8472E; flex-shrink: 0; }

        .panel-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 34px; font-weight: 600; color: #fff;
          line-height: 1.26; margin-bottom: 14px; letter-spacing: -0.5px;
        }
        .panel-headline em { font-style: italic; color: rgba(255,195,150,0.95); }

        .panel-sub {
          font-size: 14px; color: rgba(255,255,255,0.48);
          line-height: 1.65; max-width: 320px; margin-bottom: 30px;
        }

        .panel-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .panel-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px; padding: 6px 14px;
          font-size: 12px; color: rgba(255,255,255,0.62); font-weight: 500;
        }
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #E8472E; }

        /* ══════════════════════════════
           RIGHT PANEL — form
        ══════════════════════════════ */
        .su-form-side {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          flex: 1; padding: 40px 24px;
          background: #F5F0E8; position: relative;
          overflow-y: auto;
        }
        .su-form-side::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(160,100,60,0.045) 1px, transparent 1px);
          background-size: 26px 26px; pointer-events: none;
        }

        .form-box {
          width: 100%; max-width: 420px;
          position: relative; z-index: 1;
          animation: fadeUp 0.5s ease both;
          padding: 8px 0 32px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .logo-wrap {
          display: flex; justify-content: center;
          margin-bottom: 32px;
          animation: fadeUp 0.4s ease both;
        }

        /* Heading */
        .form-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px; font-weight: 600; color: #1A1614;
          text-align: center; margin-bottom: 5px; letter-spacing: -0.4px;
          animation: fadeUp 0.45s 0.05s ease both;
        }
        .form-sub {
          font-size: 13.5px; color: #9E9188;
          text-align: center; margin-bottom: 26px; line-height: 1.55;
          animation: fadeUp 0.45s 0.1s ease both;
        }

        /* Error */
        .error-alert {
          display: flex; align-items: flex-start; gap: 10px;
          background: #FEF2F2; border: 1px solid #FECACA;
          border-radius: 10px; padding: 12px 14px; margin-bottom: 18px;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
        .error-icon { color: #DC2626; margin-top: 1px; flex-shrink: 0; }
        .error-text { font-size: 13px; color: #DC2626; line-height: 1.5; }

        /* Name row */
        .name-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          margin-bottom: 14px;
          animation: fadeUp 0.45s 0.13s ease both;
        }

        /* Fields */
        .field-group {
          margin-bottom: 14px;
          animation: fadeUp 0.45s ease both;
        }
        .field-group:nth-of-type(2) { animation-delay: 0.17s; }
        .field-group:nth-of-type(3) { animation-delay: 0.21s; }
        .field-group:nth-of-type(4) { animation-delay: 0.25s; }

        .field-label {
          display: block; font-size: 12.5px; font-weight: 600;
          color: #5C504A; margin-bottom: 5px; letter-spacing: 0.1px;
        }
        .field-opt { font-weight: 400; color: #C4BAB2; font-size: 11px; margin-left: 4px; }

        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #C4BAB2;
          pointer-events: none; transition: color 0.2s;
        }
        .field-wrap.focused .field-icon { color: #E8472E; }

        .field-input {
          width: 100%; height: 44px;
          padding: 0 13px 0 40px;
          border: 1.5px solid #EDE8E0; border-radius: 11px;
          background: #fff; font-size: 13.5px; color: #1A1614;
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #C4BAB2; }
        .field-input:focus {
          border-color: #E8472E;
          box-shadow: 0 0 0 3px rgba(232,71,46,0.1);
        }
        .field-input:disabled { opacity: 0.6; cursor: not-allowed; background: #FAF7F3; }

        /* Submit */
        .submit-btn {
          width: 100%; height: 48px;
          background: #E8472E; color: #fff; border: none;
          border-radius: 11px; font-size: 14.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(232,71,46,0.28);
          animation: fadeUp 0.45s 0.28s ease both;
          letter-spacing: 0.1px; margin-bottom: 18px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #C93D27; transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(232,71,46,0.36);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Dividers */
        .divider {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
          animation: fadeUp 0.45s 0.32s ease both;
        }
        .divider-line { flex: 1; height: 1px; background: #EDE8E0; }
        .divider-text { font-size: 11.5px; color: #C4BAB2; font-weight: 500; white-space: nowrap; }

        /* Social buttons */
        .social-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 18px;
          animation: fadeUp 0.45s 0.34s ease both;
        }
        .social-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          height: 42px; border: 1.5px solid #EDE8E0; border-radius: 11px;
          background: #fff; font-size: 13px; font-weight: 500;
          color: #5C504A; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.12s;
        }
        .social-btn:hover:not(:disabled) {
          border-color: #C4BAB2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transform: translateY(-1px);
        }
        .social-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Role pills */
        .role-section {
          animation: fadeUp 0.45s 0.38s ease both;
          margin-bottom: 16px;
        }
        .role-row {
          display: flex; justify-content: center; gap: 10px;
        }
        .role-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px;
          border: 1.5px solid #EDE8E0; border-radius: 22px;
          font-size: 12.5px; font-weight: 500; color: #5C504A;
          text-decoration: none; background: #fff;
          transition: border-color 0.18s, color 0.18s, box-shadow 0.18s;
        }
        .role-pill:hover {
          border-color: #E8472E; color: #E8472E;
          box-shadow: 0 2px 8px rgba(232,71,46,0.1);
        }
        .role-dot-green  { width: 7px; height: 7px; border-radius: 50%; background: #16A34A; flex-shrink: 0; }
        .role-dot-amber  { width: 7px; height: 7px; border-radius: 50%; background: #D97706; flex-shrink: 0; }

        /* Sign in link */
        .signin-row {
          text-align: center; font-size: 13.5px; color: #9E9188;
          animation: fadeUp 0.45s 0.42s ease both;
        }
        .signin-link {
          color: #E8472E; font-weight: 600; text-decoration: none;
          transition: color 0.15s;
        }
        .signin-link:hover { color: #C93D27; }

        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="su-root">

        {/* ── Left decorative panel ── */}
        <div className="su-panel">
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
              <line x1="68"  y1="190" x2="68"  y2="258" stroke="#3B2010" strokeWidth="4.5"/>
              <ellipse cx="68"  cy="182" rx="20" ry="10" fill="#254018" opacity="0.72" transform="rotate(-18 68 182)"/>
              <ellipse cx="68"  cy="187" rx="17" ry="8"  fill="#254018" opacity="0.6"  transform="rotate(22 68 187)"/>
              <ellipse cx="68"  cy="184" rx="22" ry="7"  fill="#254018" opacity="0.5"  transform="rotate(4 68 184)"/>
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
              Rejoignez<br />
              la communauté<br />
              <em>Moxbnb.</em>
            </p>
            <p className="panel-sub">
              Créez votre compte et accédez à des milliers de logements, expériences et services à travers toute la Tunisie.
            </p>
            <div className="panel-pills">
              <span className="panel-pill"><span className="pill-dot" />Voyageurs</span>
              <span className="panel-pill"><span className="pill-dot" />Hôtes</span>
              <span className="panel-pill"><span className="pill-dot" />Prestataires</span>
            </div>
          </div>
        </div>

        {/* ── Right form side ── */}
        <div className="su-form-side">
          <div className="form-box">

            <h1 className="form-heading">{t('auth.signup.title')}</h1>
            <p className="form-sub">{t('auth.signup.description')}</p>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="error-alert" role="alert">
                  <AlertCircle size={15} className="error-icon" />
                  <span className="error-text">{error}</span>
                </div>
              )}

              {/* First + Last name */}
              <div className="name-row">
                <div>
                  <label htmlFor="firstName" className="field-label">{t('auth.signup.firstName')}</label>
                  <div className={`field-wrap ${focusedField === 'firstName' ? 'focused' : ''}`}>
                    <User size={15} className="field-icon" />
                    <input
                      id="firstName" name="firstName" type="text"
                      className="field-input" placeholder="Prénom"
                      value={formData.firstName} onChange={handleChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      required disabled={loading} autoComplete="given-name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="field-label">{t('auth.signup.lastName')}</label>
                  <div className={`field-wrap ${focusedField === 'lastName' ? 'focused' : ''}`}>
                    <User size={15} className="field-icon" />
                    <input
                      id="lastName" name="lastName" type="text"
                      className="field-input" placeholder="Nom"
                      value={formData.lastName} onChange={handleChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      required disabled={loading} autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="field-group">
                <label htmlFor="email" className="field-label">{t('auth.signup.email')}</label>
                <div className={`field-wrap ${focusedField === 'email' ? 'focused' : ''}`}>
                  <Mail size={15} className="field-icon" />
                  <input
                    id="email" name="email" type="email"
                    className="field-input" placeholder="vous@exemple.com"
                    value={formData.email} onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required disabled={loading} autoComplete="email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="field-group">
                <label htmlFor="phone" className="field-label">
                  {t('auth.signup.phone')}
                  <span className="field-opt">({t('auth.signup.optional')})</span>
                </label>
                <div className={`field-wrap ${focusedField === 'phone' ? 'focused' : ''}`}>
                  <Phone size={15} className="field-icon" />
                  <input
                    id="phone" name="phone" type="tel"
                    className="field-input" placeholder="+216 12 345 678"
                    value={formData.phone} onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading} autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group" style={{ marginBottom: 20 }}>
                <label htmlFor="password" className="field-label">{t('auth.signup.password')}</label>
                <div className={`field-wrap ${focusedField === 'password' ? 'focused' : ''}`}>
                  <Lock size={15} className="field-icon" />
                  <input
                    id="password" name="password" type="password"
                    className="field-input" placeholder="Minimum 6 caractères"
                    value={formData.password} onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required minLength={6} disabled={loading} autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><Loader2 size={16} className="spin" />{t('auth.signup.creatingAccount')}</>
                  : t('auth.signup.createAccount')
                }
              </button>

              {/* Social */}
              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">{t('auth.signup.orContinueWith')}</span>
                <span className="divider-line" />
              </div>

              <div className="social-row">
                <button type="button" className="social-btn" disabled={loading}>
                  <GoogleIcon />Google
                </button>
                <button type="button" className="social-btn" disabled={loading}>
                  <FacebookIcon />Facebook
                </button>
              </div>

              {/* Role links */}
              <div className="role-section">
                <div className="divider" style={{ marginBottom: 12 }}>
                  <span className="divider-line" />
                  <span className="divider-text">{t('auth.signup.joinAs')}</span>
                  <span className="divider-line" />
                </div>
                <div className="role-row">
                  <Link href="/signup/host" className="role-pill">
                    <span className="role-dot-green" />{t('auth.signup.becomeHost')}
                  </Link>
                  <Link href="/signup/provider" className="role-pill">
                    <span className="role-dot-amber" />{t('auth.signup.becomeProvider')}
                  </Link>
                </div>
              </div>

              {/* Sign in */}
              <p className="signin-row">
                {t('auth.signup.haveAccount')}{' '}
                <Link href="/login" className="signin-link">{t('auth.signup.signIn')}</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}