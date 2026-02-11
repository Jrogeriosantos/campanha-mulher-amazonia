'use client';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Termos de Uso</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao participar desta campanha do Dia Internacional da Mulher, você
            concorda com os seguintes termos de uso.
          </p>

          <h3>2. Uso de Dados e Imagens</h3>
          <p>
            As informações, fotos e histórias compartilhadas poderão ser
            utilizadas pela empresa em materiais de divulgação interna, incluindo
            mas não limitado a:
          </p>
          <ul>
            <li>Exposições e painéis comemorativo do Dia da Mulher</li>
            <li>Publicações em murais e canais de comunicação interna</li>
            <li>Materiais impressos e digitais de celebração</li>
          </ul>

          <h3>3. Direitos de Imagem</h3>
          <p>
            Você autoriza o uso de sua imagem e história para fins exclusivamente
            relacionados a esta campanha interna, sem qualquer ônus para a
            empresa.
          </p>

          <h3>4. Autenticidade</h3>
          <p>
            Você declara que as informações e história fornecidas são verdadeiras
            e de sua autoria.
          </p>

          <h3>5. Privacidade</h3>
          <p>
            Seus dados pessoais serão tratados de acordo com a Lei Geral de
            Proteção de Dados (LGPD) e utilizados apenas para os fins desta
            campanha.
          </p>

          <h3>6. Conteúdo Apropriado</h3>
          <p>
            O conteúdo compartilhado deve ser respeitoso e estar de acordo com os
            valores da empresa.
          </p>

          <h3>7. Cancelamento</h3>
          <p>
            Você pode solicitar a remoção de sua participação a qualquer momento
            através do departamento de Recursos Humanos.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onAccept}>
            Aceitar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
