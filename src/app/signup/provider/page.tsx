'use client';

import { useState } from 'react';
import { RegisterData } from '@/services/authService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, User, Mail, Phone, Lock, Briefcase, Star, Award, FileText, AlertCircle, Check } from 'lucide-react';

export default function ProviderSignupPage() {
  const [formData, setFormData] = useState<RegisterData & {
    serviceTypes: string[];
    companyName: string;
    specialization: string;
    experience: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    serviceTypes: [],
    companyName: '',
    specialization: '',
    experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleServiceTypeToggle = (serviceType: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter(t => t !== serviceType)
        : [...prev.serviceTypes, serviceType]
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation des champs spécifiques
    if (formData.serviceTypes.length === 0) {
      setError('Veuillez sélectionner au moins un type de service');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'PROVIDER',
        serviceTypes: formData.serviceTypes,
        companyName: formData.companyName,
        specialization: formData.specialization,
        experience: formData.experience
      };
      console.log('Payload envoyé:', payload);
      
      await register(payload);
      router.push('/provider/dashboard');
      router.refresh();
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

        .ps-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* ══════════════════════════════
           LEFT PANEL
        ══════════════════════════════ */
        .ps-panel {
          display: none;
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .ps-panel {
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
        .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #D97706; flex-shrink: 0; }

        .panel-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 34px; font-weight: 600; color: #fff;
          line-height: 1.26; margin-bottom: 14px; letter-spacing: -0.5px;
        }
        .panel-headline em { font-style: italic; color: rgba(255,220,140,0.95); }

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
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #D97706; }

        /* ══════════════════════════════
           RIGHT PANEL — form
        ══════════════════════════════ */
        .ps-form-side {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          flex: 1; padding: 40px 24px;
          background: #F5F0E8; position: relative;
          overflow-y: auto;
        }
        .ps-form-side::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(160,100,60,0.045) 1px, transparent 1px);
          background-size: 26px 26px; pointer-events: none;
        }

        .form-box {
          width: 100%; max-width: 460px;
          position: relative; z-index: 1;
          animation: fadeUp 0.5s ease both;
          padding: 8px 0 32px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Back link */
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #9E9188; text-decoration: none;
          margin-bottom: 20px; font-weight: 500;
          transition: color 0.15s;
          animation: fadeUp 0.4s ease both;
        }
        .back-link:hover { color: #D97706; }

        /* Heading */
        .form-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px; font-weight: 600; color: #1A1614;
          margin-bottom: 4px; letter-spacing: -0.4px;
          animation: fadeUp 0.45s 0.05s ease both;
        }
        .form-sub {
          font-size: 13.5px; color: #9E9188;
          margin-bottom: 24px; line-height: 1.55;
          animation: fadeUp 0.45s 0.1s ease both;
        }

        /* Section titles */
        .section-title {
          font-size: 11px; font-weight: 700; color: #C4BAB2;
          text-transform: uppercase; letter-spacing: 1.2px;
          margin-bottom: 14px; margin-top: 4px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-title::after {
          content: ''; flex: 1; height: 1px; background: #EDE8E0;
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
        .field-wrap.focused .field-icon { color: #D97706; }
        .field-wrap.textarea-wrap .field-icon { top: 14px; transform: none; }

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
          border-color: #D97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
        }
        .field-input:disabled { opacity: 0.6; cursor: not-allowed; background: #FAF7F3; }

        /* Select */
        .field-select {
          width: 100%; height: 44px;
          padding: 0 36px 0 40px;
          border: 1.5px solid #EDE8E0; border-radius: 11px;
          background: #fff; font-size: 13.5px; color: #1A1614;
          font-family: 'DM Sans', sans-serif; outline: none;
          appearance: none; cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-select:focus {
          border-color: #D97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
        }
        .field-select:disabled { opacity: 0.6; cursor: not-allowed; background: #FAF7F3; }
        .select-arrow {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%); color: #C4BAB2;
          pointer-events: none;
        }

        /* Multi-select checkboxes */
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 8px;
        }
        @media (max-width: 480px) {
          .checkbox-grid {
            grid-template-columns: 1fr;
          }
        }
        .checkbox-option {
          position: relative;
        }
        .checkbox-option input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border: 1.5px solid #EDE8E0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          color: #5C504A;
        }
        .checkbox-label:hover {
          border-color: #D97706;
          background: #FEF7EE;
        }
        .checkbox-option input[type="checkbox"]:checked + .checkbox-label {
          border-color: #D97706;
          background: #FEF7EE;
        }
        .checkbox-icon {
          width: 18px;
          height: 18px;
          border: 2px solid #C4BAB2;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .checkbox-option input[type="checkbox"]:checked + .checkbox-label .checkbox-icon {
          background: #D97706;
          border-color: #D97706;
        }
        .checkbox-option input[type="checkbox"]:disabled + .checkbox-label {
          opacity: 0.6;
          cursor: not-allowed;
          background: #FAF7F3;
        }

        /* Textarea */
        .field-textarea {
          width: 100%;
          padding: 12px 13px 12px 40px;
          border: 1.5px solid #EDE8E0; border-radius: 11px;
          background: #fff; font-size: 13.5px; color: #1A1614;
          font-family: 'DM Sans', sans-serif; outline: none;
          resize: vertical; min-height: 96px;
          transition: border-color 0.2s, box-shadow 0.2s;
          line-height: 1.6;
        }
        .field-textarea::placeholder { color: #C4BAB2; }
        .field-textarea:focus {
          border-color: #D97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
        }
        .field-textarea:disabled { opacity: 0.6; cursor: not-allowed; background: #FAF7F3; }

        /* Submit */
        .submit-btn {
          width: 100%; height: 48px;
          background: #D97706; color: #fff; border: none;
          border-radius: 11px; font-size: 14.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(217,119,6,0.28);
          animation: fadeUp 0.45s 0.28s ease both;
          letter-spacing: 0.1px; margin-bottom: 16px; margin-top: 6px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #B45309; transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(217,119,6,0.36);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Footer note */
        .footer-note {
          text-align: center; font-size: 13.5px; color: #9E9188;
          animation: fadeUp 0.45s 0.32s ease both;
        }
        .footer-link {
          color: #D97706; font-weight: 600; text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #B45309; }

        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ps-root">

        {/* ── Left decorative panel ── */}
        <div className="ps-panel">
          <div className="panel-sky" />
          <div className="panel-glow" />
          <div className="panel-stars" />
          <div className="panel-moon" />
          <div className="panel-sun" />

          <div className="panel-city">
            <svg className="city-svg" viewBox="0 0 700 300" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="260" width="700" height="40" fill="#2E1A45" opacity="0.9"/>
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
              <rect x="0"   y="205" width="68"  height="65"  rx="3" fill="#C07868" opacity="0.72"/>
              <rect x="10"  y="220" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="30"  y="220" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="50"  y="220" width="12"  height="16"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="78"  y="188" width="82"  height="82"  rx="3" fill="#CC7A58" opacity="0.74"/>
              <rect x="93"  y="205" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="116" y="205" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <rect x="139" y="205" width="14"  height="18"  rx="1" fill="#231534" opacity="0.5"/>
              <path d="M116 270 Q116 254 128 254 Q140 254 140 270" fill="#231534" opacity="0.5"/>
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
              Prestataires · Services · Expertise
            </div>
            <p className="panel-headline">
              Proposez<br />
              vos services,<br />
              <em>développez-vous.</em>
            </p>
            <p className="panel-sub">
              Rejoignez notre réseau de prestataires professionnels et connectez-vous à des milliers de clients en Tunisie.
            </p>
            <div className="panel-pills">
              <span className="panel-pill"><span className="pill-dot" />Chef privé</span>
              <span className="panel-pill"><span className="pill-dot" />Massage</span>
              <span className="panel-pill"><span className="pill-dot" />Coaching</span>
              <span className="panel-pill"><span className="pill-dot" />Photo</span>
            </div>
          </div>
        </div>

        {/* ── Right form side ── */}
        <div className="ps-form-side">
          <div className="form-box">

            <Link href="/signup" className="back-link">
              <ArrowLeft size={14} />
              {t('provider.signup.backToSignup')}
            </Link>

            <h1 className="form-heading">{t('provider.signup.title')}</h1>
            <p className="form-sub">{t('provider.signup.description')}</p>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="error-alert" role="alert">
                  <AlertCircle size={15} className="error-icon" />
                  <span className="error-text">{error}</span>
                </div>
              )}

              {/* Personal Info */}
              <div className="section-title">{t('provider.signup.personalInfo')}</div>

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

              {/* Service Info */}
              <div className="section-title">{t('provider.signup.serviceInfo')}</div>

              <div className="field-group">
                <label className="field-label">{t('provider.signup.serviceType')}</label>
                <div className="checkbox-grid">
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="privateChef"
                      value="privateChef"
                      checked={formData.serviceTypes.includes('privateChef')}
                      onChange={() => handleServiceTypeToggle('privateChef')}
                      disabled={loading}
                    />
                    <label htmlFor="privateChef" className="checkbox-label">
                      <span className="checkbox-icon">
                        {formData.serviceTypes.includes('privateChef') && <Check size={12} color="white" />}
                      </span>
                      {t('services.privateChef')}
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="massage"
                      value="massage"
                      checked={formData.serviceTypes.includes('massage')}
                      onChange={() => handleServiceTypeToggle('massage')}
                      disabled={loading}
                    />
                    <label htmlFor="massage" className="checkbox-label">
                      <span className="checkbox-icon">
                        {formData.serviceTypes.includes('massage') && <Check size={12} color="white" />}
                      </span>
                      {t('services.massage')}
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="sportsCoach"
                      value="sportsCoach"
                      checked={formData.serviceTypes.includes('sportsCoach')}
                      onChange={() => handleServiceTypeToggle('sportsCoach')}
                      disabled={loading}
                    />
                    <label htmlFor="sportsCoach" className="checkbox-label">
                      <span className="checkbox-icon">
                        {formData.serviceTypes.includes('sportsCoach') && <Check size={12} color="white" />}
                      </span>
                      {t('services.sportsCoach')}
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="photography"
                      value="photography"
                      checked={formData.serviceTypes.includes('photography')}
                      onChange={() => handleServiceTypeToggle('photography')}
                      disabled={loading}
                    />
                    <label htmlFor="photography" className="checkbox-label">
                      <span className="checkbox-icon">
                        {formData.serviceTypes.includes('photography') && <Check size={12} color="white" />}
                      </span>
                      {t('services.photography')}
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="hairdressing"
                      value="hairdressing"
                      checked={formData.serviceTypes.includes('hairdressing')}
                      onChange={() => handleServiceTypeToggle('hairdressing')}
                      disabled={loading}
                    />
                    <label htmlFor="hairdressing" className="checkbox-label">
                      <span className="checkbox-icon">
                        {formData.serviceTypes.includes('hairdressing') && <Check size={12} color="white" />}
                      </span>
                      {t('services.hairdressing')}
                    </label>
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="catering"
                      value="catering"
                      checked={formData.serviceTypes.includes('catering')}
                      onChange={() => handleServiceTypeToggle('catering')}
                      disabled={loading}
                    />
                    <label htmlFor="catering" className="checkbox-label">
                      <span className="checkbox-icon">
                        {formData.serviceTypes.includes('catering') && <Check size={12} color="white" />}
                      </span>
                      {t('services.catering')}
                    </label>
                  </div>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="companyName" className="field-label">{t('provider.signup.companyName')}</label>
                <div className={`field-wrap ${focusedField === 'companyName' ? 'focused' : ''}`}>
                  <Award size={15} className="field-icon" />
                  <input
                    id="companyName" name="companyName" type="text"
                    className="field-input" placeholder="Votre entreprise ou nom commercial"
                    value={formData.companyName} onChange={handleChange}
                    onFocus={() => setFocusedField('companyName')}
                    onBlur={() => setFocusedField(null)}
                    required disabled={loading}
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="specialization" className="field-label">{t('provider.signup.specialization')}</label>
                <div className={`field-wrap ${focusedField === 'specialization' ? 'focused' : ''}`}>
                  <Star size={15} className="field-icon" />
                  <input
                    id="specialization" name="specialization" type="text"
                    className="field-input" placeholder="Vos spécialisations…"
                    value={formData.specialization} onChange={handleChange}
                    onFocus={() => setFocusedField('specialization')}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="field-group" style={{ marginBottom: 6 }}>
                <label htmlFor="experience" className="field-label">{t('provider.signup.experience')}</label>
                <div className={`field-wrap textarea-wrap ${focusedField === 'experience' ? 'focused' : ''}`}>
                  <FileText size={15} className="field-icon" />
                  <textarea
                    id="experience" name="experience"
                    className="field-textarea"
                    placeholder="Parlez-nous de votre expérience et de vos qualifications…"
                    value={formData.experience} onChange={handleChange}
                    onFocus={() => setFocusedField('experience')}
                    onBlur={() => setFocusedField(null)}
                    rows={3} disabled={loading}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><Loader2 size={16} className="spin" />{t('provider.signup.creating')}</>
                  : t('provider.signup.createProviderAccount')
                }
              </button>

              <p className="footer-note">
                {t('provider.signup.changeRole')}{' '}
                <Link href="/signup" className="footer-link">
                  {t('provider.signup.backToSignup')}
                </Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}