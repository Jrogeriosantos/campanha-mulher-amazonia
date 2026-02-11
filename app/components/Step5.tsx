'use client';

import { QRCodeSVG } from "qrcode.react";

interface Step5Props {
  onClose: () => void;
}

export default function Step5({ onClose }: Step5Props) {
  const handleShare = () => {
    const shareData = {
      title: 'Campanha Internacional do Dia da Mulher',
      text: 'Participe da nossa campanha especial celebrando a força e empoderamento feminino!',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share(shareData).catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard
          .writeText(shareData.url)
          .then(() => {
            alert(
              'Link copiado para a área de transferência! 📋\n\nCompartilhe com suas colegas: ' +
              shareData.url
            );
          })
          .catch(() => {
            alert('Compartilhe este link:\n' + shareData.url);
          });
      } else {
        alert('Compartilhe este link:\n' + shareData.url);
      }
    }
  };

  return (
    <div style={{ backgroundImage: 'url(/folha.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', margin: '0', padding: '40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="thank-you">
          <div className="thank-you-icon">✨</div>

          <h2>Muito Obrigada!</h2>

          <p>
            Sua fotografia e relato foram recebidos com carinho.
            É uma honra contar com sua participação em nossa exposição
            comemorativa.
          </p>

          <p className="description" style={{ textAlign: 'center' }}>
            Fique atenta aos próximos passos. Em breve compartilharemos
            mais informações sobre a programação.
          </p>

          <p
            style={{
              color: 'var(--accent)',
              fontWeight: '600',
              fontSize: '20px',
              marginTop: '30px',
            }}
          >
            🌺 Parabéns pelo seu dia! 🌺
          </p>

          <div className="qr-section">
            <h3>Compartilhe esta campanha</h3>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '30px auto' }}>
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : 'https://campanha.local'}
                size={250}
                bgColor="#ffffff"
                fgColor="#004E25"
                level="H"
              />
            </div>
          </div>

          <div className="button-group">
            <button className="btn-secondary" onClick={handleShare}>
              📤 Compartilhar
            </button>
            <button className="btn-primary" onClick={onClose}>
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
