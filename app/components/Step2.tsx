'use client';

interface Step2Props {
  onPrev: () => void;
  onNext: () => void;
}

export default function Step2({ onPrev, onNext }: Step2Props) {
  return (
    <div style={{ backgroundImage: 'url(/folha.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', margin: '0', padding: '40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="card-header">
          <h1 className="card-title">Como Participar</h1>
          <p className="card-subtitle">Siga estes passos simples</p>
        </div>

        <ul className="instructions-list">
          <li>
            <strong>1. Ciência no termo de uso da imagem</strong>
            {/* Digite sua matrícula de trabalho para começar. Seus dados serão
          carregados automaticamente. */}
          </li>
          <li>
            <strong>2. Envio da foto (evite imagens de trajes de banho (como biquíni) ou de corpo inteiro. Prefira fotos que destaquem o rosto)</strong>
            {/* Envie uma foto sua que represente quem você é. Pode ser uma foto
          atual, do trabalho ou de um momento especial. */}
          </li>
          <li>
            <strong>3. Compartilhe como é a sua experiência, trajetória ou conquistas na empresa</strong>
            {/* Escreva sobre sua trajetória, desafios que superou, conquistas que te
          orgulham. Seja autêntica! */}
          </li>
        </ul>

        <p
          className="description"
          style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--primary)' }}
        >
          &quot;Toda mulher tem uma história poderosa para contar. Esta é a sua vez de
          brilhar!&quot;
        </p>

        <div className="button-group">
          <button className="btn-secondary" onClick={onPrev}>
            ← Voltar
          </button>
          <button className="btn-primary" onClick={onNext}>
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}
