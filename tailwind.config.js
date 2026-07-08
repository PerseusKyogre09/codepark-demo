/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			dark: {
  				bg: '#1a1a1a',
  				surface: '#2d2d2d',
  				border: '#404040',
  				text: '#e0e0e0',
  				'text-secondary': '#a0a0a0'
  			},
  			light: {
  				bg: '#ffffff',
  				surface: '#f5f5f5',
  				border: '#e0e0e0',
  				text: '#1a1a1a',
  				'text-secondary': '#666666'
  			},
  			forest: {
  				bg: '#1a2f1a',
  				surface: '#2d4a2d',
  				border: '#3d5a3d',
  				text: '#e8f5e8',
  				'text-secondary': '#a8c5a8',
  				accent: '#4ade80'
  			},
  			ocean: {
  				bg: '#0f1f2f',
  				surface: '#1a3a4a',
  				border: '#2a4a5a',
  				text: '#e0f0ff',
  				'text-secondary': '#a0c0d0',
  				accent: '#7c3aed'
  			},
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			},
  			brand: 'var(--brand)',
  			'brand-hover': 'var(--brand-hover)',
  			'brand-active': 'var(--brand-active)',
  			'brand-soft': 'var(--brand-soft)',
  			'brand-highlight': 'var(--brand-highlight)',
  			surface: 'var(--surface)',
  			'surface-elevated': 'var(--surface-elevated)',
  			'text-secondary': 'var(--text-secondary)',
  			'text-disabled': 'var(--text-disabled)',
  			success: 'var(--success)',
  			warning: 'var(--warning)',
  			error: 'var(--error)',
  			info: 'var(--info)'
  		},
  		fontFamily: {
  			display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
  			body: ['Inter', 'system-ui', 'sans-serif'],
  			mono: ['Geist Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
  			cascadia: [
  				'Cascadia Code',
  				'monospace'
  			],
  			fira: [
  				'Fira Code',
  				'monospace'
  			],
  			jetbrains: [
  				'JetBrains Mono',
  				'monospace'
  			],
  			consolas: [
  				'Consolas',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
