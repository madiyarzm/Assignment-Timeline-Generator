// Minimal helper to use tokens in components without a CSS framework.
// Styles based on style-guide.json at project root
export const c = {
  page: {
    style: {
      background: '#FAFAFB',
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '24px'
    }
  },
  card: {
    style: {
      maxWidth: '420px',
      width: '100%',
      background: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      padding: '24px'
    }
  },
  h1: {
    style: {
      fontSize: '32px',
      fontWeight: 600,
      color: '#1F2937',
      lineHeight: '1.35'
    }
  },
  muted: {
    style: {
      fontSize: '14px',
      color: '#6B7280'
    }
  },
  input: {
    style: {
      height: '44px',
      padding: '0 12px',
      fontSize: '16px',
      background: '#FFFFFF',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      width: '100%',
      boxSizing: 'border-box'
    },
    focusStyle: {
      outline: '2px solid #EEF5FF',
      borderColor: '#569FFF'
    }
  },
  buttonPrimary: {
    style: {
      height: '44px',
      padding: '0 16px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '12px',
      background: '#106DE6',
      color: '#FFFFFF',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      fontWeight: 500,
      width: '100%'
    },
    hoverBg: '#0A56B8'
  }
} as const;

