# Bet-Analytix 🏆

Plataforma profesional de seguimiento de apuestas deportivas con métricas precisas, perfiles públicos tipo tipster y análisis avanzado.

## 🚀 Características

- ✅ **Registro y seguimiento de picks** con conexión a eventos reales
- 📊 **Métricas precisas**: ROI, Yield, Win Rate, Drawdown, Equity Curve
- 📈 **Dashboard interactivo** con gráficas y KPIs en tiempo real
- 👤 **Perfiles públicos** tipo tipster con verificación
- 🔔 **Feed cronológico** de picks de la comunidad
- 📱 **Interfaz responsive** con tema oscuro profesional
- 🔐 **Autenticación segura** con NextAuth.js
- 📝 **Sistema de auditoría** para todos los cambios
- 🎨 **Diseño minimalista** negro + verde

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes
- **ORM**: Prisma
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: NextAuth.js
- **Validación**: Zod
- **Gráficas**: Recharts

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd bet-analytix
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui"
```

4. **Inicializar la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar seed de datos (opcional)**
```bash
npx tsx prisma/seed.ts
```

6. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

7. **Abrir en el navegador**
```
http://localhost:3000
```

## 👤 Credenciales de Demo

El script de seed crea un usuario demo:
- **Email**: demo@betanalytix.com
- **Password**: demo123456

## 📁 Estructura del Proyecto

```
bet-analytix/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard y funcionalidades principales
│   │   ├── feed/              # Feed de picks
│   │   ├── profile/           # Perfiles públicos
│   │   └── live/              # Partidos en vivo
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes UI base (shadcn/ui)
│   │   └── layout/           # Layouts (Sidebar, Header)
│   ├── lib/                   # Utilidades y configuración
│   │   ├── auth.ts           # Configuración de NextAuth
│   │   ├── prisma.ts         # Cliente de Prisma
│   │   ├── metrics/          # Cálculos de métricas
│   │   └── validations/      # Esquemas Zod
│   └── types/                 # Definiciones TypeScript
├── prisma/
│   ├── schema.prisma         # Esquema de base de datos
│   └── seed.ts              # Datos de ejemplo
├── public/                   # Archivos estáticos
└── docker-compose.yml        # Configuración Docker (opcional)
```

## 🗄️ Base de Datos

### Schema Principal

- **User**: Usuarios de la plataforma
- **Profile**: Perfiles públicos con métricas
- **Pick**: Apuestas individuales
- **Event**: Eventos deportivos reales
- **Sport/Ligue/Team**: Estructura de deportes
- **Book**: Bookmakers disponibles
- **Follow**: Sistema de seguimiento
- **AuditLog**: Registro de cambios

### Comandos de Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre-migracion

# Sincronizar schema (sin migración)
npx prisma db push

# Ver datos en Prisma Studio
npx prisma studio

# Resetear base de datos (⚠️ elimina datos)
npx prisma migrate reset
```

## 📊 Métricas Implementadas

### Fórmulas de Cálculo

- **Profit por pick**: 
  - WIN: stake × (odds - 1)
  - LOSS: -stake
  - PUSH/VOID: 0
  - CASHOUT: valor personalizado

- **ROI**: (NetUnits / TotalStaked) × 100
- **Win Rate**: (Wins / (Wins + Losses)) × 100
- **Avg Odds**: Promedio de cuotas
- **Drawdown**: Peak-to-trough máximo
- **Streaks**: Racha actual, mejor racha, peor racha

## 🚀 Deployment

### Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar el repositorio
3. Configurar variables de entorno
4. Deploy automático en cada push a main

### Render

1. Crear cuenta en [Render](https://render.com)
2. Crear nuevo Web Service
3. Configurar build command: `npm run build`
4. Configurar start command: `npm start`
5. Agregar variables de entorno

### Railway

Similar a Render, con configuración de PostgreSQL.

## 🔐 Variables de Entorno

```env
# Database
DATABASE_URL="file:./prisma/dev.db"  # SQLite dev
# DATABASE_URL="postgresql://..."   # PostgreSQL prod

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-seguro"

# OAuth (opcional)
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# Sports Data Provider
SPORTS_DATA_PROVIDER="MOCK"
THESPORTSDB_API_KEY="tu-api-key"
```

## 🧪 Testing

```bash
# Tests unitarios (próximamente)
npm test

# Tests E2E (próximamente)
npm run test:e2e
```

## 📝 Notas Técnicas

### Decisiones de Arquitectura

1. **SQLite vs PostgreSQL**: SQLite para desarrollo local (sin servidor), PostgreSQL para producción.
2. **NextAuth.js**: Autenticación flexible con soporte para múltiples providers.
3. **Prisma ORM**: Type-safe database client con migraciones automáticas.
4. **App Router**: Next.js 16 con React Server Components para mejor performance.

### Roadmap

- [ ] Integración con proveedor de datos real (API de deportes)
- [ ] WebSocket para live scores
- [ ] Sistema de notificaciones push
- [ ] Leaderboards globales
- [ ] Exportación de datos (CSV, PDF)
- [ ] Mobile app (React Native)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es propiedad de Bet-Analytix. Todos los derechos reservados.

## 🙋 Soporte

Para preguntas o soporte:
- Email: support@betanalytix.com
- Issues: GitHub Issues

---

**Desarrollado con ❤️ por Bet-Analytix**