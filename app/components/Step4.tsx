/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Cropper from 'react-easy-crop';
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

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

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
  
  // Estados para crop
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirmCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setImagePreview(croppedImage);
      setShowCropper(false);
    } catch (error) {
      console.error('Erro ao fazer crop:', error);
      alert('Erro ao processar a imagem.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(`✓ ${selectedFile.name}`);

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageToCrop(result);
        setShowCropper(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFileName('');
    setImagePreview(null);
    setImageToCrop(null);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setFile(null);
    setFileName('');
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
              <label htmlFor="formSetor">Departamento</label>
              <input
                type="text"
                id="formSetor"
                readOnly
                value={formData.setor}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formFoto">Sua Foto <span style={{ color: '#d32f2f' }}>*</span></label>
              {!showCropper && (
                <>
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
                </>
              )}
              
              {showCropper && imageToCrop && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginTop: '10px' }}>
                  <p style={{ marginBottom: '15px', fontWeight: '600' }}>Reposicione sua imagem no quadrado 1080x1080</p>
                  <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <Cropper
                      image={imageToCrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onCropComplete={handleCropComplete}
                      onZoomChange={setZoom}
                      restrictPosition={false}
                    />
                  </div>
                  
                  <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>
                      Zoom: {Math.round(zoom * 100)}%
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleCancelCrop}
                      style={{ flex: 1 }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleConfirmCrop}
                      style={{ flex: 1 }}
                    >
                      Confirmar Foto
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="formHistoria">Estamos celebrando os 50 anos da nossa história, e será muito especial saber de você como se sente fazendo parte dessa trajetória e o que ela representa. <span style={{ color: '#d32f2f' }}>*</span></label>
              <textarea
                id="formHistoria"
                maxLength={1000}
                value={formData.historia}
                onChange={(e) =>
                  setFormData({ ...formData, historia: e.target.value })
                }
              ></textarea>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'right' }}>
                {formData.historia.length}/1000 caracteres ({Math.round((formData.historia.length / 1000) * 100)}%)
              </div>
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
