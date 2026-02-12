'use client';

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  return (
    <div style={{ backgroundImage: 'url(/folha.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', margin: '0', padding: '0px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="card-banner" style={{ marginBottom: '18px' }}>
          <img src="/banner.png" alt="Banner" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} />
        </div>
        <div style={{ padding: '20px', paddingTop: 0, marginTop: -50 }}>
          <div className="card-header">
            <h1 className="card-title" style={{ marginTop: '30px' }}>Bem-vinda a nossa campanha especial em celebração ao Dia Internacional <br /> das Mulheres!</h1>
          </div>

          <p className="description" style={{ padding: '20px', textAlign: 'center', marginTop: -40 }}>
            Em homenagem a este dia,
            convidamos você, colaboradora Honda, a enviar uma foto que represente a sua identidade,
            para compor uma exposição coletiva, que valorizará cada trajetória e mostrará a
            diversidade que nos une.
          </p>

          <span className="text-center w-full block font-bold">Período de envio: 12 a 20 de fevereiro</span>

          <div className="button-group">
            <button className="btn-primary" onClick={onNext}>
              Começar →
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <img src="/mulheres.png" alt="Mulheres" style={{ width: 700, height: 'auto', display: 'block', marginBottom: 14 }} />
        </div>
      </div>
    </div>
  );
}
