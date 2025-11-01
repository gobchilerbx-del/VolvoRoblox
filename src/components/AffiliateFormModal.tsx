import { FormEvent, useEffect, useState, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { siteContent } from '@/config/siteContent';

interface AffiliateFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    payload: {
      name: string;
      description: string;
      discordUrl: string;
      robloxUrl: string;
      image: string;
    }
  ) => Promise<{ success: boolean; message?: string }> | { success: boolean; message?: string };
}

type ImageMode = 'url' | 'file';

interface FormState {
  name: string;
  description: string;
  discordUrl: string;
  robloxUrl: string;
  imageUrl: string;
  imageData: string;
  imageFileName: string;
  mode: ImageMode;
}

const initialState: FormState = {
  name: '',
  description: '',
  discordUrl: '',
  robloxUrl: '',
  imageUrl: '',
  imageData: '',
  imageFileName: '',
  mode: 'url'
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export function AffiliateFormModal({ open, onClose, onSubmit }: AffiliateFormModalProps) {
  const copy = siteContent.affiliates;
  const [form, setForm] = useState<FormState>(initialState);
  const [feedback, setFeedback] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  const imagePreview = form.mode === 'url' ? form.imageUrl.trim() : form.imageData;

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setFeedback('');
      setSubmitting(false);
      setDragging(false);
    }
  }, [open]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFeedback('Selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((state) => ({
        ...state,
        imageData: result,
        imageFileName: file.name,
        imageUrl: '',
        mode: 'file'
      }));
      setFeedback('');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    const file = event.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setFeedback('Completa nombre y descripción.');
      return;
    }
    if (!form.discordUrl.trim() || !form.discordUrl.startsWith('http')) {
      setFeedback('Incluye una invitación de Discord válida.');
      return;
    }
    if (!form.robloxUrl.trim() || !form.robloxUrl.startsWith('http')) {
      setFeedback('Incluye un enlace de grupo Roblox válido.');
      return;
    }
    if (!imagePreview) {
      setFeedback('Proporciona el logo del afiliado.');
      return;
    }

    setSubmitting(true);
    const result = await Promise.resolve(
      onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        discordUrl: form.discordUrl.trim(),
        robloxUrl: form.robloxUrl.trim(),
        image: imagePreview
      })
    );
    setSubmitting(false);

    if (!result.success) {
      setFeedback(result.message ?? 'No se pudo registrar el afiliado.');
      return;
    }

    onClose();
    setForm(initialState);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#D9DEE3] bg-panel shadow-[0_28px_64px_rgba(13,17,23,0.12)]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 h-10 w-10 rounded-full border border-ink/10 text-2xl text-ink/60 transition hover:text-ink"
            >
              ×
            </button>
            <form onSubmit={handleSubmit} className="space-y-6 p-10">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-ash">{copy.eyebrow}</p>
                <h3 className="text-2xl font-semibold text-ink">{copy.ownerPanel.modalTitle}</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-ash">
                    {copy.form.nameLabel}
                  </label>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                    className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                    placeholder={copy.form.namePlaceholder}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-ash">
                    {copy.form.discordLabel}
                  </label>
                  <input
                    value={form.discordUrl}
                    onChange={(event) =>
                      setForm((state) => ({ ...state, discordUrl: event.target.value }))
                    }
                    className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                    placeholder={copy.form.discordPlaceholder}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-ash">
                    {copy.form.robloxLabel}
                  </label>
                  <input
                    value={form.robloxUrl}
                    onChange={(event) =>
                      setForm((state) => ({ ...state, robloxUrl: event.target.value }))
                    }
                    className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                    placeholder={copy.form.robloxPlaceholder}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-ash">
                    {copy.form.imageLabel}
                  </label>
                  <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-ash">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((state) => ({
                          ...state,
                          mode: 'url',
                          imageData: state.mode === 'url' ? state.imageData : '',
                          imageFileName: ''
                        }))
                      }
                      className={`rounded-full border px-4 py-2 transition ${
                        form.mode === 'url'
                          ? 'border-navy bg-navy text-white'
                          : 'border-inputBorder text-ink'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((state) => ({
                          ...state,
                          mode: 'file',
                          imageUrl: state.mode === 'file' ? state.imageUrl : ''
                        }))
                      }
                      className={`rounded-full border px-4 py-2 transition ${
                        form.mode === 'file'
                          ? 'border-navy bg-navy text-white'
                          : 'border-inputBorder text-ink'
                      }`}
                    >
                      Archivo
                    </button>
                  </div>
                  {form.mode === 'url' ? (
                    <input
                      value={form.imageUrl}
                      onChange={(event) =>
                        setForm((state) => ({ ...state, imageUrl: event.target.value }))
                      }
                      className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                      placeholder={copy.form.imagePlaceholder}
                    />
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center text-xs text-ash transition ${
                        dragging ? 'border-navy bg-navy/5' : 'border-inputBorder hover:border-navy'
                      }`}
                    >
                      <label
                        htmlFor="affiliate-image-upload"
                        className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-navy"
                      >
                        Arrastra o selecciona un archivo
                      </label>
                      <input
                        id="affiliate-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleFile(event.target.files?.[0])}
                      />
                      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.32em] text-ash">
                        PNG, JPG o WEBP — máx. 2 MB
                      </p>
                      {form.imageFileName && (
                        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.24em] text-ink/70">
                          {form.imageFileName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] text-ash">
                  {copy.form.descriptionLabel}
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((state) => ({ ...state, description: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                  placeholder={copy.form.descriptionPlaceholder}
                />
              </div>

              {imagePreview && (
                <div className="flex items-center gap-4 rounded-2xl border border-[#E1E5EA] bg-[#F4F6F8] p-4">
                  <img
                    src={imagePreview}
                    alt="Previsualización del logo"
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <p className="text-xs uppercase tracking-[0.28em] text-ash">
                    Vista previa del logo
                  </p>
                </div>
              )}

              {feedback && <p className="text-sm text-[#B00020]">{feedback}</p>}

              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                  className="rounded-full bg-navy px-8 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[#084C83] disabled:opacity-60"
                >
                  {submitting ? 'Guardando…' : copy.ownerPanel.submitLabel}
                </motion.button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-inputBorder px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-ink/70 transition hover:border-navy/40 hover:text-ink"
                >
                  {copy.ownerPanel.cancelLabel}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
