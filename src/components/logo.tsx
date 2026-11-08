export function SkLogo({ className = "size-20" }: { className?: string }) {
  return <img src="/sk-logo.png" alt="SK" className={`object-contain ${className}`} />;
}

export function SkLogoClassic({ className = "size-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 280" className={className} role="img" aria-label="SK">
      <path fill="#0c2340" d="M120 4 206 36 120 68 34 36Z" />
      <path fill="#08182c" d="M34 36 120 68v8L34 44Z" />
      <path fill="#1d4e89" d="M206 36 120 68v8l86-32Z" />
      <path d="M162 34c12 3 22 12 26 24" fill="none" stroke="#e2b043" strokeWidth="3" strokeLinecap="round" />
      <circle cx="190" cy="62" r="5.5" fill="#e25822" />
      <path d="M190 68v14" stroke="#e2b043" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M181 84h18" stroke="#e2b043" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="120" cy="142" r="76" fill="#fffdf8" stroke="#e2b043" strokeWidth="7" />
      <circle cx="120" cy="142" r="66" fill="none" stroke="#1a4fad" strokeWidth="3.5" />
      <text x="90" y="164" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="72" fontWeight="700" fill="#1a4fad">
        S
      </text>
      <text x="150" y="164" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="72" fontWeight="700" fill="#e2b043">
        K
      </text>
      <path fill="#14386f" d="M24 214 120 196l96 18v22L120 256 24 236Z" />
      <path fill="#fff8e8" d="M40 214 120 202l80 12v14L120 244 40 228Z" />
      <path fill="#f6e3b0" d="M40 214 120 228l80-14-80-14Z" />
      <path d="M120 202v42" stroke="#d7a441" strokeWidth="3.2" />
    </svg>
  );
}
