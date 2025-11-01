export const siteContent = {
  branding: {
    logoUrl: 'https://media.discordapp.net/attachments/1433342942164287643/1433953679291056138/457-4577921_boston-volvo-logo-white-and-black-2-2.png?ex=690690ee&is=69053f6e&hm=10e8cab25e5042c95eb7630fb5dad252acae722d3e3f653ff64aa3651d80e33c&=&format=webp&quality=lossless&width=1276&height=1276',
    title: 'VOLVO MOBILITY SYSTEMS',
    tagline: 'Innovación · Potencia · Precisión'
  },
  hero: {
    eyebrow: 'Volvo Mobility Systems',
    headline: 'Innovamos en movimiento,\nredefinimos la potencia.',
    description:
      'Presentamos el hub digital donde convergen vehículos premium, sistemas inteligentes y assets Roblox listos para producción. ADN Volvo: precisión, rendimiento y diseño minimalista.',
    primaryCta: 'Ver catálogo',
    imageUrl: 'https://media.discordapp.net/attachments/1413741993812562031/1433966992213282976/Logo.png?ex=69069d54&is=69054bd4&hm=0a2a2bea8b5ccc6b8108206278981aa73a6c6b1ac2c9edf1c63815d8ebf666c8&=&format=webp&quality=lossless&width=1996&height=1996',
  },
  catalog: {
    eyebrow: 'Catálogo premium',
    heading: 'Selección exclusiva de vehículos y sistemas digitales',
    description:
      'Cada asset está optimizado para Roblox Studio con scripts depurados, iluminación cuidada y compatibilidad lista para integrar.',
    currencies: [
      { code: 'MXN', label: 'Peso mexicano (MXN)', symbol: '$', perMXN: 1 },
      { code: 'USD', label: 'Dólar estadounidense (USD)', symbol: '$', perMXN: 0.058 },
      { code: 'COP', label: 'Peso colombiano (COP)', symbol: '$', perMXN: 225 },
      { code: 'ARS', label: 'Peso argentino (ARS)', symbol: '$', perMXN: 52 },
      { code: 'CLP', label: 'Peso chileno (CLP)', symbol: '$', perMXN: 45 }
    ]
  },
  affiliates: {
    eyebrow: 'Alianzas estratégicas',
    heading: 'Afiliados oficiales',
    description: 'Colaboraciones, alianzas y estudios asociados a Volvo Mobility Systems.',
    card: {
      discordLabel: 'Comunicaciones',
      robloxLabel: 'Grupo de Roblox',
      visitLabel: 'Visitar'
    },
    icons: {
      discord:
        'https://cdn-icons-png.flaticon.com/512/5968/5968756.png',
      roblox:
        'https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png'
    },
    ownerPanel: {
      addButtonLabel: '+ Agregar Afiliado',
      closeButtonLabel: 'Cancelar',
      modalTitle: 'Registrar nuevo afiliado',
      submitLabel: 'Añadir Afiliado',
      cancelLabel: 'Cancelar'
    },
    form: {
      nameLabel: 'Nombre',
      namePlaceholder: 'Nombre del afiliado',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Describe la alianza en 2-3 líneas',
      discordLabel: 'Comunicaciones',
      discordPlaceholder: 'https://discord.gg/...',
      robloxLabel: 'Grupo de Roblox',
      robloxPlaceholder: 'https://www.roblox.com/groups/...',
      imageLabel: 'Logo del afiliado',
      imagePlaceholder: 'https://...'
    },
    emptyState: 'Aún no hay afiliados publicados.'
  },
  panel: {
    loginEyebrow: 'Acceso a Ventas',
    loginTitle: 'Panel del Owner',
    loginDescription: 'Ingresa con las credenciales oficiales para gestionar el sistema.',
    usernameLabel: 'Usuario',
    usernamePlaceholder: 'Tu usuario',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Tu contraseña',
    submitLabel: 'Acceder',
    dashboardEyebrow: 'Panel del Control  ',
    dashboardHeading: 'Gestiona el catálogo premium',
    dashboardDescription:
      'Añade nuevos lanzamientos, actualiza imágenes y mantén actualizada la selección oficial.',
    statsLabel: 'Productos activos',
    addButtonLabel: '+ Agregar producto',
    closeFormLabel: 'Cerrar formulario',
    productNameLabel: 'Nombre',
    productNamePlaceholder: 'Nombre del producto',
    productPriceLabel: 'Precio (USD)',  
    productPricePlaceholder: '0',
    productDescriptionLabel: 'Descripción',
    productDescriptionPlaceholder: 'Describe el asset y sus características principales',
    productImageLabel: 'Imagen (URL)',
    productImagePlaceholder: 'https://...',
    submitCreateLabel: 'Guardar producto',
    submitUpdateLabel: 'Actualizar producto',
    cancelLabel: 'Cancelar',
    logoutLabel: 'Cerrar sesión',
    productsTitle: 'Productos publicados',
    emptyState: 'Aún no hay productos cargados. Utiliza el botón “Agregar producto”.'
  },
  footer: {
    copy: '© 2025 Volvo Mobility Systems — Innovación. Potencia. Precisión.',
    links: [
      {
        label: 'Discord',
        href: 'https://discord.gg/rM69A8GVnz',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png'
      },
      {
        label: 'Roblox',
        href: '#',
        iconUrl:
          'https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png'
      }
    ]
  },
  notFound: {
    eyebrow: 'Error 404',
    heading: 'Ruta no encontrada',
    description:
      'Parece que esta sección está en construcción. Regresa al inicio para seguir explorando el marketplace.',
    cta: 'Ir al inicio'
  }
} as const;

export type SiteContent = typeof siteContent;
