'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const { t } = useLanguage();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (destination) params.append('location', destination);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests && guests !== '2') params.append('guests', guests);
    
    const queryString = params.toString();
    router.push(`/properties${queryString ? '?' + queryString : ''}`);
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">

      {/* ── Skyline illustré de Tunis avec ciel décoratif ── */}
      <div className="absolute inset-0 w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ciel */}
          <rect width="1200" height="600" fill="#87CEEB" />

          {/* ══════════════════════════════════════
              ÉLÉMENTS DU CIEL (remplacent les nuages)
          ══════════════════════════════════════ */}

          {/* Soleil stylisé – côté gauche */}
          <circle cx="120" cy="95" r="38" fill="#FFD166" opacity="0.92"/>
          <line x1="120" y1="40"  x2="120" y2="26"  stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="120" y1="150" x2="120" y2="164" stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="65"  y1="95"  x2="51"  y2="95"  stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="175" y1="95"  x2="189" y2="95"  stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="81"  y1="56"  x2="71"  y2="46"  stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="159" y1="134" x2="169" y2="144" stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="159" y1="56"  x2="169" y2="46"  stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>
          <line x1="81"  y1="134" x2="71"  y2="144" stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" opacity="0.8"/>

          {/* Croissant + étoile tunisiens – centre gauche */}
          <g transform="translate(370,78)">
            <circle cx="0"  cy="0" r="36"  fill="#FFEAA0" opacity="0.95"/>
            <circle cx="15" cy="-12" r="27" fill="#87CEEB"/>
            <polygon
              points="0,-18 3,-8 13,-8 5,-2 8,8 0,2 -8,8 -5,-2 -13,-8 -3,-8"
              fill="#FFEAA0"
              opacity="0.95"
              transform="translate(38,-22) scale(0.75)"
            />
          </g>

          {/* Palmier gauche – entre soleil et croissant */}
          <g transform="translate(240,175)">
            <rect x="-6" y="0" width="12" height="70" rx="5" fill="#6B4A1E"/>
            <rect x="-4" y="10" width="7"  height="45" rx="3" fill="#8B6030" opacity="0.45"/>
            <path d="M0,4 Q-40,-16 -62,-26" fill="none" stroke="#2D7A2D" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M-62,-26 Q-77,-23 -79,-14" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,4 Q40,-18 58,-30" fill="none" stroke="#2D7A2D" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M58,-30 Q72,-26 74,-18" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,4 Q-16,-42 -13,-64" fill="none" stroke="#2D7A2D" strokeWidth="5" strokeLinecap="round"/>
            <path d="M-13,-64 Q-5,-74 6,-71" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,4 Q18,-40 19,-60" fill="none" stroke="#2D7A2D" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M19,-60 Q27,-70 35,-65" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,4 Q-46,-5 -63,-2" fill="none" stroke="#3A9A3A" strokeWidth="4" strokeLinecap="round"/>
            <path d="M0,4 Q44,-3 60,1" fill="none" stroke="#3A9A3A" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* Oiseaux en vol – groupe 1, centre */}
          <g fill="none" stroke="#1a4a6b" strokeLinecap="round" opacity="0.7">
            <path d="M570,52 Q579,44 588,52" strokeWidth="3"/>
            <path d="M595,43 Q604,35 613,43" strokeWidth="3"/>
            <path d="M548,63 Q556,56 564,63" strokeWidth="2.5"/>
            <path d="M618,56 Q626,48 634,56" strokeWidth="2.5"/>
            <path d="M582,72 Q591,64 600,72" strokeWidth="2.5"/>
            <path d="M608,70 Q616,63 624,70" strokeWidth="2"/>
          </g>

          {/* Oiseaux en vol – groupe 2, droite */}
          <g fill="none" stroke="#1a4a6b" strokeLinecap="round" opacity="0.55">
            <path d="M860,38 Q867,31 874,38" strokeWidth="2.5"/>
            <path d="M879,28 Q886,21 893,28" strokeWidth="2.5"/>
            <path d="M846,49 Q852,43 858,49" strokeWidth="2"/>
            <path d="M897,42 Q903,35 909,42" strokeWidth="2"/>
          </g>

          {/* Étoile filante discrète */}
          <line x1="720" y1="28" x2="775" y2="56" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
          <circle cx="720" cy="28" r="2.5" fill="white" opacity="0.75"/>

          {/* Petites étoiles scintillantes */}
          <circle cx="480" cy="32" r="2"   fill="white" opacity="0.5"/>
          <circle cx="740" cy="22" r="1.5" fill="white" opacity="0.45"/>
          <circle cx="950" cy="35" r="2"   fill="white" opacity="0.4"/>
          <circle cx="1080" cy="28" r="1.5" fill="white" opacity="0.5"/>
          <circle cx="300" cy="42" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="1150" cy="55" r="2"  fill="white" opacity="0.35"/>

          {/* Palmier droit */}
          <g transform="translate(1010,160)">
            <rect x="-6" y="0" width="12" height="80" rx="5" fill="#6B4A1E"/>
            <rect x="-4" y="12" width="7"  height="50" rx="3" fill="#8B6030" opacity="0.45"/>
            <path d="M0,5 Q-40,-15 -62,-25" fill="none" stroke="#2D7A2D" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M-62,-25 Q-77,-21 -79,-12" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,5 Q40,-17 57,-29" fill="none" stroke="#2D7A2D" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M57,-29 Q71,-25 73,-17" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,5 Q-16,-44 -12,-66" fill="none" stroke="#2D7A2D" strokeWidth="5" strokeLinecap="round"/>
            <path d="M-12,-66 Q-4,-76 7,-73" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,5 Q18,-42 18,-62" fill="none" stroke="#2D7A2D" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M18,-62 Q26,-72 34,-67" fill="none" stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0,5 Q-46,-4 -63,-1" fill="none" stroke="#3A9A3A" strokeWidth="4" strokeLinecap="round"/>
            <path d="M0,5 Q44,-2 60,2" fill="none" stroke="#3A9A3A" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* ══════════════════════════════════════
              MAISONS & BÂTIMENTS
          ══════════════════════════════════════ */}

          {/* 1 – bleu pâle */}
          <rect x="30"  y="310" width="65"  height="95"  rx="3" fill="#D4E8F0"/>
          <rect x="35"  y="303" width="55"  height="10"  rx="2" fill="#B8D4E8"/>
          <polygon points="30,303 62,278 95,303" fill="#B8D4E8"/>
          <rect x="43"  y="320" width="13"  height="16"  rx="1" fill="#7AAFC8"/>
          <rect x="62"  y="320" width="13"  height="16"  rx="1" fill="#7AAFC8"/>
          <rect x="43"  y="342" width="13"  height="16"  rx="1" fill="#7AAFC8"/>
          <rect x="62"  y="342" width="13"  height="16"  rx="1" fill="#7AAFC8"/>
          <rect x="50"  y="365" width="16"  height="40"  rx="1" fill="#5A9AB5"/>

          {/* 2 – jaune doré */}
          <rect x="100" y="275" width="110" height="130" rx="3" fill="#FFEAA0"/>
          <rect x="105" y="267" width="100" height="12"  rx="2" fill="#FFD97A"/>
          <polygon points="100,267 155,235 210,267" fill="#F5C842"/>
          <rect x="112" y="288" width="18"  height="22"  rx="1" fill="#E8B840"/>
          <rect x="138" y="288" width="18"  height="22"  rx="1" fill="#E8B840"/>
          <rect x="164" y="288" width="18"  height="22"  rx="1" fill="#E8B840"/>
          <rect x="112" y="316" width="18"  height="22"  rx="1" fill="#E8B840"/>
          <rect x="138" y="316" width="18"  height="22"  rx="1" fill="#E8B840"/>
          <rect x="164" y="316" width="18"  height="22"  rx="1" fill="#E8B840"/>
          <rect x="128" y="340" width="44"  height="65"  rx="1" fill="#D4A030"/>

          {/* Minaret */}
          <rect x="215" y="210" width="36"  height="195" rx="2" fill="#2a5f7a"/>
          <ellipse cx="233" cy="210" rx="18" ry="10" fill="#1a6b9a"/>
          <rect x="205" y="270" width="56"  height="8"   rx="1" fill="#1a5570"/>
          <rect x="208" y="325" width="50"  height="8"   rx="1" fill="#1a5570"/>

          {/* 3 – blanc bleuté */}
          <rect x="255" y="285" width="85"  height="120" rx="3" fill="#E0F0FF"/>
          <rect x="259" y="277" width="77"  height="11"  rx="2" fill="#C0DDF5"/>
          <polygon points="255,277 297,250 340,277" fill="#B0CDE8"/>
          <rect x="266" y="298" width="15"  height="18"  rx="1" fill="#7AAFC8"/>
          <rect x="288" y="298" width="15"  height="18"  rx="1" fill="#7AAFC8"/>
          <rect x="310" y="298" width="15"  height="18"  rx="1" fill="#7AAFC8"/>
          <rect x="266" y="322" width="15"  height="18"  rx="1" fill="#7AAFC8"/>
          <rect x="288" y="322" width="15"  height="18"  rx="1" fill="#7AAFC8"/>
          <rect x="310" y="322" width="15"  height="18"  rx="1" fill="#7AAFC8"/>
          <rect x="274" y="343" width="32"  height="62"  rx="1" fill="#5A9AB5"/>

          {/* 4 – pêche */}
          <rect x="345" y="268" width="95"  height="137" rx="3" fill="#FFE8D0"/>
          <rect x="349" y="259" width="87"  height="12"  rx="2" fill="#FFC8A0"/>
          <polygon points="345,259 392,228 440,259" fill="#FFB880"/>
          <rect x="358" y="280" width="17"  height="21"  rx="1" fill="#E8905A"/>
          <rect x="382" y="280" width="17"  height="21"  rx="1" fill="#E8905A"/>
          <rect x="406" y="280" width="17"  height="21"  rx="1" fill="#E8905A"/>
          <rect x="358" y="307" width="17"  height="21"  rx="1" fill="#E8905A"/>
          <rect x="382" y="307" width="17"  height="21"  rx="1" fill="#E8905A"/>
          <rect x="406" y="307" width="17"  height="21"  rx="1" fill="#E8905A"/>
          <rect x="368" y="330" width="38"  height="75"  rx="1" fill="#CC7040"/>

          {/* 5 – lavande */}
          <rect x="445" y="255" width="120" height="150" rx="3" fill="#E8E8FF"/>
          <rect x="449" y="245" width="112" height="13"  rx="2" fill="#C8C8F0"/>
          <polygon points="445,245 505,210 565,245" fill="#B8B8E0"/>
          <rect x="458" y="268" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="484" y="268" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="510" y="268" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="536" y="268" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="458" y="297" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="484" y="297" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="510" y="297" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="536" y="297" width="18"  height="22"  rx="1" fill="#8888C8"/>
          <rect x="474" y="322" width="52"  height="83"  rx="1" fill="#7070B8"/>

          {/* 6 – miel */}
          <rect x="570" y="262" width="105" height="143" rx="3" fill="#FFF0D8"/>
          <rect x="574" y="253" width="97"  height="12"  rx="2" fill="#FFDB9A"/>
          <polygon points="570,253 622,220 675,253" fill="#F5C060"/>
          <rect x="582" y="275" width="18"  height="22"  rx="1" fill="#D8A040"/>
          <rect x="607" y="275" width="18"  height="22"  rx="1" fill="#D8A040"/>
          <rect x="632" y="275" width="18"  height="22"  rx="1" fill="#D8A040"/>
          <rect x="582" y="303" width="18"  height="22"  rx="1" fill="#D8A040"/>
          <rect x="607" y="303" width="18"  height="22"  rx="1" fill="#D8A040"/>
          <rect x="632" y="303" width="18"  height="22"  rx="1" fill="#D8A040"/>
          <rect x="596" y="328" width="40"  height="77"  rx="1" fill="#B88030"/>

          {/* 7 – vert menthe */}
          <rect x="680" y="240" width="130" height="165" rx="3" fill="#E0FFE8"/>
          <rect x="684" y="230" width="122" height="13"  rx="2" fill="#B8F0C8"/>
          <polygon points="680,230 745,195 810,230" fill="#A0E0B0"/>
          <rect x="694" y="255" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="722" y="255" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="750" y="255" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="778" y="255" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="694" y="286" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="722" y="286" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="750" y="286" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="778" y="286" width="20"  height="24"  rx="1" fill="#60B878"/>
          <rect x="712" y="313" width="50"  height="92"  rx="1" fill="#40986A"/>

          {/* 8 – rose corail */}
          <rect x="815" y="270" width="90"  height="135" rx="3" fill="#FFE0E0"/>
          <rect x="819" y="261" width="82"  height="12"  rx="2" fill="#FFBBBB"/>
          <polygon points="815,261 860,232 905,261" fill="#FF9898"/>
          <rect x="826" y="283" width="16"  height="20"  rx="1" fill="#E87070"/>
          <rect x="849" y="283" width="16"  height="20"  rx="1" fill="#E87070"/>
          <rect x="872" y="283" width="16"  height="20"  rx="1" fill="#E87070"/>
          <rect x="826" y="309" width="16"  height="20"  rx="1" fill="#E87070"/>
          <rect x="849" y="309" width="16"  height="20"  rx="1" fill="#E87070"/>
          <rect x="872" y="309" width="16"  height="20"  rx="1" fill="#E87070"/>
          <rect x="836" y="332" width="36"  height="73"  rx="1" fill="#C85050"/>

          {/* 9 – parme */}
          <rect x="910" y="282" width="75"  height="123" rx="3" fill="#F8F0FF"/>
          <rect x="914" y="273" width="67"  height="12"  rx="2" fill="#DDD0F8"/>
          <polygon points="910,273 947,248 985,273" fill="#C8B8F0"/>
          <rect x="919" y="293" width="14"  height="17"  rx="1" fill="#9070D0"/>
          <rect x="939" y="293" width="14"  height="17"  rx="1" fill="#9070D0"/>
          <rect x="959" y="293" width="14"  height="17"  rx="1" fill="#9070D0"/>
          <rect x="919" y="316" width="14"  height="17"  rx="1" fill="#9070D0"/>
          <rect x="939" y="316" width="14"  height="17"  rx="1" fill="#9070D0"/>
          <rect x="959" y="316" width="14"  height="17"  rx="1" fill="#9070D0"/>
          <rect x="928" y="336" width="32"  height="69"  rx="1" fill="#7050B0"/>

          {/* 10 – crème */}
          <rect x="990"  y="290" width="85"  height="115" rx="3" fill="#FFF8E0"/>
          <rect x="994"  y="281" width="77"  height="12"  rx="2" fill="#FFE8A0"/>
          <polygon points="990,281 1032,254 1075,281" fill="#FFD870"/>
          <rect x="1001" y="302" width="15"  height="18"  rx="1" fill="#D8A830"/>
          <rect x="1023" y="302" width="15"  height="18"  rx="1" fill="#D8A830"/>
          <rect x="1045" y="302" width="15"  height="18"  rx="1" fill="#D8A830"/>
          <rect x="1001" y="326" width="15"  height="18"  rx="1" fill="#D8A830"/>
          <rect x="1023" y="326" width="15"  height="18"  rx="1" fill="#D8A830"/>
          <rect x="1045" y="326" width="15"  height="18"  rx="1" fill="#D8A830"/>
          <rect x="1010" y="347" width="30"  height="58"  rx="1" fill="#B88820"/>

          {/* 11 – bleu ciel */}
          <rect x="1080" y="298" width="80"  height="107" rx="3" fill="#E8F8FF"/>
          <rect x="1084" y="289" width="72"  height="12"  rx="2" fill="#C0E8F8"/>
          <polygon points="1080,289 1120,264 1160,289" fill="#A8D8F0"/>
          <rect x="1090" y="309" width="14"  height="17"  rx="1" fill="#5898C0"/>
          <rect x="1111" y="309" width="14"  height="17"  rx="1" fill="#5898C0"/>
          <rect x="1132" y="309" width="14"  height="17"  rx="1" fill="#5898C0"/>
          <rect x="1090" y="332" width="14"  height="17"  rx="1" fill="#5898C0"/>
          <rect x="1111" y="332" width="14"  height="17"  rx="1" fill="#5898C0"/>
          <rect x="1132" y="332" width="14"  height="17"  rx="1" fill="#5898C0"/>
          <rect x="1098" y="352" width="28"  height="53"  rx="1" fill="#3878A0"/>

          {/* 12 – droite */}
          <rect x="1165" y="310" width="55"  height="95"  rx="3" fill="#FFF0D8"/>
          <rect x="1168" y="302" width="49"  height="11"  rx="2" fill="#FFD9A0"/>
          <polygon points="1165,302 1192,280 1220,302" fill="#FFBE70"/>
          <rect x="1173" y="320" width="11"  height="14"  rx="1" fill="#D89040"/>
          <rect x="1191" y="320" width="11"  height="14"  rx="1" fill="#D89040"/>
          <rect x="1173" y="340" width="11"  height="14"  rx="1" fill="#D89040"/>
          <rect x="1191" y="340" width="11"  height="14"  rx="1" fill="#D89040"/>
          <rect x="1179" y="357" width="20"  height="48"  rx="1" fill="#B07020"/>

          {/* ── Mer Méditerranée ── */}
          <rect x="0" y="400" width="1200" height="200" fill="#1565a0" opacity="0.88"/>
          <rect x="0" y="398" width="1200" height="8"   fill="#1878b8" opacity="0.5"/>
          <rect x="0" y="405" width="1200" height="5"   fill="#1a8acc" opacity="0.3"/>
          <rect x="80"   y="440" width="180" height="8" rx="4" fill="rgba(255,255,255,0.07)"/>
          <rect x="350"  y="460" width="250" height="6" rx="3" fill="rgba(255,255,255,0.06)"/>
          <rect x="700"  y="450" width="200" height="7" rx="3" fill="rgba(255,255,255,0.07)"/>
          <rect x="1000" y="470" width="150" height="5" rx="3" fill="rgba(255,255,255,0.05)"/>
        </svg>
      </div>

      {/* ── Overlay rouge à 55 % ── */}
      <div className="absolute inset-0 bg-rose-900/55" />

      {/* Dégradé bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

      {/* ── Contenu ── */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
          Tunisie · Méditerranée · Culture
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow">
          {t('hero.subtitle')}
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="flex items-center border rounded-lg px-3 py-2">
              <MapPin className="h-5 w-5 text-rose-600 mr-2 shrink-0" />
              <Input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-0 focus-visible:ring-0 p-0 h-auto"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <Calendar className="h-5 w-5 text-rose-600 mr-2 shrink-0" />
              <Input
                type="date"
                placeholder={t('common.checkIn')}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border-0 focus-visible:ring-0 p-0 h-auto"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <Calendar className="h-5 w-5 text-rose-600 mr-2 shrink-0" />
              <Input
                type="date"
                placeholder={t('common.checkOut')}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border-0 focus-visible:ring-0 p-0 h-auto"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
                <Users className="h-5 w-5 text-rose-600 mr-2 shrink-0" />
                <Input
                  type="number"
                  placeholder="2"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="border-0 focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-rose-600 hover:bg-rose-700 px-6"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
