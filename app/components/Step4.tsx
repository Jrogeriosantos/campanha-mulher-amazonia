/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
// NOTE: uploads are routed through server API to use the service role key

interface UserData {
  nome: string;
  matricula: string;
  setor: string;
}

interface Step4Props {
  onPrev: () => void;
  onNext: () => void;
  userData: UserData | null;
  onOpenTerms: () => void;
}

export default function Step4({
  onPrev,
  onNext,
  userData,
  onOpenTerms,
}: Step4Props) {
  const [formData, setFormData] = useState({
    nome: userData?.nome || '',
    matricula: userData?.matricula || '',
    setor: userData?.setor || '',
    historia: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(`✓ ${selectedFile.name}`);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFileName('');
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.matricula || !formData.setor) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!file) {
      alert('Por favor, selecione uma foto.');
      return;
    }

    if (!formData.historia.trim()) {
      alert('Por favor, escreva sua história.');
      return;
    }

    if (!termsAccepted) {
      alert(
        'Por favor, leia e aceite os termos de uso para continuar.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // converter arquivo para base64
      const toBase64 = (file: File) => new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const fileBase64 = await toBase64(file);
      if (!fileBase64) throw new Error('Falha ao converter arquivo');

      // enviar para o endpoint server-side que usa service role
      const resp = await fetch('/api/submit-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          matricula: formData.matricula,
          setor: formData.setor,
          historia: formData.historia,
          fileName: file.name,
          fileType: file.type,
          fileBase64,
        }),
      });

      // tratar respostas não-JSON (p.ex. páginas de erro HTML)
      const contentType = resp.headers.get('content-type') || '';
      let result: any = null;
      if (contentType.includes('application/json')) {
        result = await resp.json();
      } else {
        const text = await resp.text();
        console.error('Resposta do servidor não-JSON:', text);
        alert('Resposta inesperada do servidor. Veja o console para detalhes.');
        setIsSubmitting(false);
        return;
      }

      if (!resp.ok) {
        console.error('API error:', result);
        alert(result.error || 'Erro ao enviar os dados.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onNext();
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro ao enviar o formulário. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundImage: 'url(/folha.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', margin: '0', padding: '40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <>
          <div className="card-header">
            <h1 className="card-title">Sua História</h1>
            <p className="card-subtitle">Compartilhe sua jornada conosco</p>
          </div>

          <form>
            <div className="form-group">
              <label htmlFor="formMatricula">Matrícula</label>
              <input
                type="text"
                id="formMatricula"
                readOnly
                value={formData.matricula}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formSetor">Setor</label>
              <input
                type="text"
                id="formSetor"
                readOnly
                value={formData.setor}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formFoto">Sua Foto</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="formFoto"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="formFoto" className="file-input-label">
                  📷 Clique para selecionar uma foto
                </label>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '8px', fontStyle: 'italic' }}>
                ⓘ Adicione uma foto sua como profissional
              </p>
              {fileName && <div className="file-name">{fileName}</div>}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview da foto" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={handleRemoveImage}
                  >
                    ✕ Remover
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="formHistoria">Sua História</label>
              <textarea
                id="formHistoria"
                placeholder="Conte sua história... Fale sobre sua trajetória, desafios que superou, conquistas que te orgulham, o que significa ser mulher na Amazônia para você..."
                value={formData.historia}
                onChange={(e) =>
                  setFormData({ ...formData, historia: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '400', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ width: 'auto', cursor: 'pointer' }}
                />
                <span>
                  Eu li e aceito os{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenTerms();
                    }}
                    style={{
                      color: '#0066cc',
                      textDecoration: 'underline',
                      fontWeight: '600',
                    }}
                  >
                    termos de uso
                  </a>
                </span>
              </label>
            </div>
          </form>

          <div className="button-group">
            <button className="btn-secondary" onClick={onPrev} disabled={isSubmitting}>
              ← Voltar
            </button>
            <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? '⏳ Enviando...' : 'Enviar História →'}
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
