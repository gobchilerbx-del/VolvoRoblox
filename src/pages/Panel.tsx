import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { ProductCard } from '@/components/ProductCard';
import { siteContent } from '@/config/siteContent';
import type { Product } from '@/types';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  image: string;
}

const emptyForm: ProductFormState = {
  name: '',
  description: '',
  price: '0',
  image: ''
};

function Panel() {
  const {
    ownerLoggedIn,
    products,
    loginOwner,
    logoutOwner,
    addProduct,
    updateProduct,
    deleteProduct
  } = useMarketplaceStore((state) => ({
    ownerLoggedIn: state.ownerLoggedIn,
    products: state.products,
    loginOwner: state.loginOwner,
    logoutOwner: state.logoutOwner,
    addProduct: state.addProduct,
    updateProduct: state.updateProduct,
    deleteProduct: state.deleteProduct
  }));

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authFeedback, setAuthFeedback] = useState<string>('');
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formFeedback, setFormFeedback] = useState<string>('');
  const panelCopy = siteContent.panel;

  const formatCurrencyValue = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: value < 1 ? 2 : 0,
      maximumFractionDigits: 2
    }).format(value);


  const orderedProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [products]
  );

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setAuthFeedback('Completa usuario y contraseña.');
      return;
    }
    const result = loginOwner(credentials);
    if (!result.success) {
      setAuthFeedback(result.message ?? 'No fue posible acceder.');
    } else {
      setAuthFeedback('');
      setCredentials({ username: '', password: '' });
    }
  };

  const resetForm = (close?: boolean) => {
    setForm(emptyForm);
    setEditing(null);
    if (close) {
      setFormOpen(false);
      setFormFeedback('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setFormFeedback('Completa nombre y descripción.');
      return;
    }
    if (!form.image.trim()) {
      setFormFeedback('Incluye una URL de imagen.');
      return;
    }
    const priceValue = Number.parseFloat(form.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setFormFeedback('Precio inválido.');
      return;
    }

    if (editing) {
      updateProduct(editing.id, {
        name: form.name,
        description: form.description,
        image: form.image,
        price: priceValue
      });
      setFormFeedback('Producto actualizado.');
    } else {
      const created = addProduct({
        name: form.name,
        description: form.description,
        image: form.image,
        price: priceValue
      });
      setFormFeedback(`Producto "${created.name}" añadido.`);
    }

    setTimeout(() => setFormFeedback(''), 2200);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormFeedback('');
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(`¿Eliminar ${product.name}?`);
    if (confirmed) {
      deleteProduct(product.id);
    }
  };

  if (!ownerLoggedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-lg space-y-7 rounded-[24px] border border-[#D9DEE3] bg-panel p-10 shadow-[0_12px_32px_rgba(13,17,23,0.05)]"
        >
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-ash">{panelCopy.loginEyebrow}</p>
            <h2 className="text-3xl font-semibold text-ink">{panelCopy.loginTitle}</h2>
            <p className="text-sm text-ash">{panelCopy.loginDescription}</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-ash">{panelCopy.usernameLabel}</label>
              <input
                value={credentials.username}
                onChange={(event) => setCredentials((state) => ({ ...state, username: event.target.value }))}
                className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                placeholder={panelCopy.usernamePlaceholder}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-ash">{panelCopy.passwordLabel}</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((state) => ({ ...state, password: event.target.value }))}
                className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                placeholder={panelCopy.passwordPlaceholder}
                autoComplete="current-password"
              />
            </div>
          </div>
          {authFeedback && <p className="text-center text-sm text-[#B00020]">{authFeedback}</p>}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full rounded-full bg-navy px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[#084C83]"
          >
            {panelCopy.submitLabel}
          </motion.button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-ash">{panelCopy.dashboardEyebrow}</p>
          <h2 className="text-3xl font-semibold text-ink">{panelCopy.dashboardHeading}</h2>
          <p className="text-sm text-ash">{panelCopy.dashboardDescription}</p>
        </div>
        <button
          type="button"
          onClick={() => logoutOwner()}
          className="self-start rounded-full border border-navy/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-navy transition hover:bg-navy/10"
        >
          {panelCopy.logoutLabel}
        </button>
      </header>

      <div className="rounded-2xl border border-[#D9DEE3] bg-panel p-6 text-sm text-ash">
        {panelCopy.statsLabel}: <span className="font-semibold text-ink">{orderedProducts.length}</span>
      </div>

      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            setFormOpen((value) => !value);
            setFormFeedback('');
            if (editing && formOpen) {
              resetForm();
            }
          }}
          className="rounded-full border border-navy px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-navy transition hover:bg-navy/10"
        >
          {formOpen ? panelCopy.closeFormLabel : panelCopy.addButtonLabel}
        </button>

        <AnimatePresence initial={false}>
          {formOpen && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6 rounded-[24px] border border-[#D9DEE3] bg-panel p-8 shadow-[0_10px_28px_rgba(13,17,23,0.06)]"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-ash">{panelCopy.productNameLabel}</label>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                    className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                    placeholder={panelCopy.productNamePlaceholder}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-ash">{panelCopy.productPriceLabel}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm((state) => ({ ...state, price: event.target.value }))}
                    className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                    placeholder={panelCopy.productPricePlaceholder}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] text-ash">{panelCopy.productDescriptionLabel}</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))}
                  className="min-h-[140px] w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                  placeholder={panelCopy.productDescriptionPlaceholder}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] text-ash">{panelCopy.productImageLabel}</label>
                <input
                  value={form.image}
                  onChange={(event) => setForm((state) => ({ ...state, image: event.target.value }))}
                  className="w-full rounded-xl border border-inputBorder bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-navy"
                  placeholder={panelCopy.productImagePlaceholder}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-navy px-8 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[#084C83]"
                >
                  {editing ? panelCopy.submitUpdateLabel : panelCopy.submitCreateLabel}
                </motion.button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => resetForm(true)}
                    className="rounded-full border border-ink/15 px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-ink/70 hover:border-ink/30 hover:text-ink"
                  >
                    {panelCopy.cancelLabel}
                  </button>
                )}
                {formFeedback && <span className="text-xs text-ash">{formFeedback}</span>}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-ink">{panelCopy.productsTitle}</h3>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {orderedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="panel"
              pricing={{ formattedPrice: `$${formatCurrencyValue(Number(product.price))} MXN` }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {!orderedProducts.length && (
          <div className="rounded-3xl border border-[#D9DEE3] bg-panel p-10 text-center text-ash">
            {panelCopy.emptyState}
          </div>
        )}
      </section>
    </div>
  );
}

export default Panel;
