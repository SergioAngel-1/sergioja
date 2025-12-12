// Tailwind preset centralizado para todos los subdominios
// Basado en la paleta y efectos de @main, con soporte de variables CSS para temas
const preset = {
  theme: {
    extend: {
      colors: {
        cyber: {
          red: '#FE0000',
          'blue-cyan': '#00BFFF',
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            900: '#0F0F13',
            800: '#18181C',
            700: '#202024',
            600: '#323238',
            500: '#7C7C8A',
            400: '#A0A0B0',
            300: '#C8C8D0',
            200: '#E0E0E8',
            100: '#F0F0F5',
          },
        },
        background: {
          // Valores via CSS variables para permitir tema por proyecto
          light: 'rgb(var(--bg-light) / <alpha-value>)',
          surface: 'rgb(var(--bg-surface) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          dark: 'rgb(var(--bg-dark) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        rajdhani: ['var(--font-rajdhani)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(254, 0, 0, 0.5), 0 0 40px rgba(254, 0, 0, 0.3)',
        'glow-red-lg': '0 0 30px rgba(254, 0, 0, 0.6), 0 0 60px rgba(254, 0, 0, 0.4)',
        'glow-blue': '0 0 20px rgba(0, 191, 255, 0.5), 0 0 40px rgba(0, 191, 255, 0.3)',
        'glow-blue-lg': '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 191, 255, 0.4)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
        'glow-black': '0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        glitch: 'glitch 1s linear infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #FE0000 0%, #00BFFF 100%)',
        'gradient-grayscale': 'linear-gradient(135deg, #000000 0%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
};

export default preset;
