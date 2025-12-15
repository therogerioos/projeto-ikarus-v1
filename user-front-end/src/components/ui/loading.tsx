
export function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // transparente branco
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      aria-label="Carregando"
      role="alert"
      aria-busy="true"
    >
      <div className="spinner" />
      <style>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 6px solid #ccc;
          border-top-color: #1d4ed8; /* azul */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
