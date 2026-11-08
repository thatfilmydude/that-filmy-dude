// Illustrated film set: rig lights, camera on tripod, light stand, director's chair.
export default function FilmSet({ p }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
    <linearGradient id={`${p}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a1a1c"/><stop offset=".55" stopColor="#2a1012"/><stop offset="1" stopColor="#140c0d"/></linearGradient>
    <linearGradient id={`${p}beam`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd98a" stopOpacity=".55"/><stop offset="1" stopColor="#ffd98a" stopOpacity="0"/></linearGradient>
    <linearGradient id={`${p}floor`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1b1c"/><stop offset="1" stopColor="#0d0809"/></linearGradient>
    <linearGradient id={`${p}metal`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6d6360"/><stop offset="1" stopColor="#2c2527"/></linearGradient>
    <radialGradient id={`${p}halo`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff3c9" stopOpacity=".95"/><stop offset=".4" stopColor="#ffd98a" stopOpacity=".35"/><stop offset="1" stopColor="#ffd98a" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1600" height="900" fill={`url(#${p}bg)`}/>
    <rect y="700" width="1600" height="200" fill={`url(#${p}floor)`}/>
    <line x1="0" y1="700" x2="1600" y2="700" stroke="#e8b34c" strokeOpacity=".25" strokeWidth="2"/>
    <line x1="0" y1="64" x2="1600" y2="64" stroke="#6b5650" strokeWidth="10"/>
    <g fill="#2b2224" stroke="#e8b34c" strokeOpacity=".5" strokeWidth="2">
    <path d="M220 64h60l-8 46h-44z"/><path d="M500 64h60l-8 46h-44z"/><path d="M790 64h60l-8 46h-44z"/><path d="M1070 64h60l-8 46h-44z"/><path d="M1340 64h60l-8 46h-44z"/>
    </g>
    <g fill={`url(#${p}beam)`}>
    <path d="M230 110h40l150 590H100z"/><path d="M510 110h40l130 590H380z"/><path d="M800 110h40l120 590H690z"/><path d="M1080 110h40l140 590H950z"/><path d="M1350 110h40l170 590H1190z"/>
    </g>
    <g>
    <circle cx="800" cy="440" r="150" fill={`url(#${p}halo)`}/>
    <rect x="728" y="392" width="144" height="96" rx="8" fill="#fff0c4" stroke="#e8b34c" strokeWidth="4"/>
    <line x1="800" y1="488" x2="800" y2="700" stroke="#4b3d3a" strokeWidth="10"/>
    <line x1="800" y1="640" x2="730" y2="715" stroke="#4b3d3a" strokeWidth="8"/><line x1="800" y1="640" x2="870" y2="715" stroke="#4b3d3a" strokeWidth="8"/>
    </g>
    <g>
    <line x1="350" y1="640" x2="250" y2="800" stroke="#4b3d3a" strokeWidth="12" strokeLinecap="round"/><line x1="350" y1="640" x2="360" y2="815" stroke="#4b3d3a" strokeWidth="12" strokeLinecap="round"/><line x1="350" y1="640" x2="470" y2="800" stroke="#4b3d3a" strokeWidth="12" strokeLinecap="round"/>
    <rect x="310" y="620" width="80" height="26" rx="4" fill="#3a2e2e"/>
    <circle cx="285" cy="470" r="66" fill="#241b1d" stroke="#e8b34c" strokeWidth="4"/><circle cx="285" cy="470" r="14" fill="#e8b34c"/>
    <circle cx="395" cy="450" r="66" fill="#241b1d" stroke="#e8b34c" strokeWidth="4"/><circle cx="395" cy="450" r="14" fill="#e8b34c"/>
    <rect x="240" y="510" width="230" height="120" rx="12" fill={`url(#${p}metal)`}/>
    <rect x="470" y="545" width="90" height="56" rx="6" fill="#1c1517"/><rect x="540" y="535" width="70" height="76" rx="6" fill="#0f0a0b" stroke="#e8b34c" strokeOpacity=".7" strokeWidth="3"/>
    <circle cx="285" cy="570" r="9" fill="#e2241a"/>
    </g>
    <g>
    <line x1="1250" y1="660" x2="1390" y2="790" stroke="#4b3d3a" strokeWidth="10"/><line x1="1390" y1="660" x2="1250" y2="790" stroke="#4b3d3a" strokeWidth="10"/>
    <rect x="1235" y="640" width="170" height="20" rx="4" fill="#3a2e2e"/>
    <line x1="1245" y1="540" x2="1245" y2="790" stroke="#4b3d3a" strokeWidth="10"/><line x1="1395" y1="540" x2="1395" y2="790" stroke="#4b3d3a" strokeWidth="10"/>
    <rect x="1245" y="545" width="150" height="62" fill="#7a1113"/>
    <text x="1320" y="590" textAnchor="middle" fontFamily="Bebas Neue, Impact, sans-serif" fontSize="38" fill="#f6e6b4" letterSpacing="3">DIRECTOR</text>
    <rect x="1225" y="620" width="190" height="10" rx="3" fill="#2b2224"/>
    </g>
    <g fill="none" stroke="#e8b34c" strokeOpacity=".35" strokeWidth="2">
    <circle cx="1050" cy="640" r="46"/><circle cx="1050" cy="640" r="12"/><circle cx="1050" cy="640" r="28" strokeDasharray="6 8"/>
    </g>
    </svg>
  );
}
