
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
          width: 50px;
          height: 50px;
          border: 6px solid #ccc;
          border-top-color: #E08625; /* azul */
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
