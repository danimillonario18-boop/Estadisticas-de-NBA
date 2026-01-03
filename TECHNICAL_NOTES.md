# Notas Técnicas - Bet-Analytix

## Decisiones de Arquitectura

### 1. Base de Datos
**Decisión**: SQLite para desarrollo, PostgreSQL para producción

**Razón**:
- SQLite no requiere servidor separado, ideal para desarrollo local
- PostgreSQL es más robusto para producción con múltiples usuarios
- Prisma ORM permite cambiar entre ambos fácilmente
- SQLite almacena en archivo `prisma/dev.db` localmente

**Implementación**:
```env
# .env (desarrollo)
DATABASE_URL="file:./prisma/dev.db"

# .env (producción)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### 2. Framework Frontend
**Decisión**: Next.js 16 con App Router

**Razón**:
- Server Components para mejor performance
- API Routes integradas para backend
- Built-in routing y optimización
- Excelente SEO con Server Rendering
- File-based routing simple y potente

### 3. Autenticación
**Decisión**: NextAuth.js v4

**Razón**:
- Soporte para múltiples providers (credentials, OAuth)
- Session management automático
- Type-safe con TypeScript
- Fácil integración con Prisma
- Soporte para JWT y database sessions

**Configuración**:
- Credentials provider (email/password)
- Preparado para Google OAuth
- Session strategy: JWT
- Password hashing: bcryptjs (cost factor: 12)

### 4. ORM
**Decisión**: Prisma ORM v5

**Razón**:
- Type-safe database client
- Migraciones automáticas
- Prisma Studio para visualizar datos
- Excelente DX con TypeScript
- Soporta SQLite y PostgreSQL

**Schema Highlights**:
- Relaciones bien definidas entre todos los modelos
- Índices para queries frecuentes (userId, status, settledAt)
- Sistema de auditoría completo
- Campos JSON como String para compatibilidad SQLite

### 5. Validación
**Decisión**: Zod

**Razón**:
- Runtime validation type-safe
- Se integra perfectamente con TypeScript
- Mensajes de error personalizables
- Easy parsing y type inference

**Uso**:
- Schema de validación para picks
- Validación de inputs de formularios
- Type inference automática con `z.infer`

### 6. UI Components
**Decisión**: shadcn/ui + Tailwind CSS

**Razón**:
- Componentes copiados al proyecto (full control)
- Diseño consistente y profesional
- Fácil personalización
- Accesibilidad por defecto
- Iconos Lucide React integrados

**Tema**:
- Background: #070A0F
- Cards: #0F1623
- Text: #E6EAF2
- Accent: #00E676 (verde)
- Responsive: mobile-first

### 7. Estado Global
**Decisión**: TanStack Query (React Query) + Zustand

**Razón**:
- React Query: caching, refetching, optimistic updates
- Zustand: estado global simple y ligero
- Perfecta combinación para aplicaciones complejas

### 8. Cálculo de Métricas
**Implementación**: Funciones puras en `src/lib/metrics/calculations.ts`

**Fórmulas Clave**:
```typescript
// Profit por pick
WON: stake * (odds - 1)
LOST: -stake
PUSH/VOID: 0
CASHOUT: valor personalizado

// ROI
(NetUnits / TotalStaked) * 100

// Win Rate
(Wins / (Wins + Losses)) * 100

// Drawdown
Max(Peak - Cumulative)
```

## Estructura de Código

### API Routes
```
/api/
├── auth/
│   ├── register/     # Registro de usuarios
│   ├── onboarding/   # Configuración inicial
│   └── [...nextauth]/# NextAuth.js handlers
├── picks/
│   ├── route.ts      # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts  # GET, PATCH, DELETE
│       └── settle/   # POST (settle pick)
└── metrics/
    └── route.ts      # GET (user metrics)
```

### Componentes
```
/components/
├── ui/               # shadcn/ui components (reusables)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── ...
└── layout/           # Layout components
    ├── sidebar.tsx
    ├── header.tsx
    └── app-layout.tsx
```

## Manejo de Errores

### API Response Format
```typescript
// Success
{
  pick: { ... },
  metrics: { ... }
}

// Error
{
  error: "Error message",
  details: [...]  // Para errores de validación
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 404: Not found
- 500: Internal Server Error

## Seguridad

### Implementada
- Password hashing con bcryptjs (cost 12)
- NextAuth.js session management
- Validación server-side con Zod
- CSRF protection (NextAuth)
- Rate limiting (pendiente)

### Pendiente
- Rate limiting en endpoints sensibles
- Input sanitization adicional
- Helmet headers
- CORS configuration

## Performance

### Optimizaciones
- Server Components (Next.js 16)
- Índices de base de datos
- Pagination en listas
- React Query caching (pendiente)
- Image optimization (pendiente)

### Queries Costosas
- Métricas con muchos picks: considerar caching
- Leaderboards globales: Redis cache recomendado

## Testing Strategy

### Planificado
- Unit tests para cálculos de métricas (15+ casos)
- E2E tests para flows críticos (login, create pick)
- Integration tests para API endpoints

### Herramientas
- Jest: unit tests
- Playwright: E2E tests
- Testing Library: component tests

## Deployment

### Recomendado: Vercel
- Automatic deployments desde Git
- Edge functions
- Built-in preview deployments
- Easy environment variables

### Alternativas
- Render: Web service + PostgreSQL
- Railway: Similar a Render
- Railway + Docker Compose

## Consideraciones de Escala

### Cuándo migrar a PostgreSQL
- Más de 100 usuarios concurrentes
- Queries complejas frecuentes
- Necesidad de transactions avanzadas
- Requerimientos de alta disponibilidad

### Caching Strategy
- Métricas calculadas: Redis con TTL 5min
- Leaderboards: Redis con TTL 10min
- Session data: Redis (si fuera necesario)

## Roadmap Técnico

### Corto Plazo
- [ ] Tests unitarios de métricas
- [ ] Rate limiting
- [ ] Error logging (Sentry)
- [ ] Analytics (Plausible)

### Medio Plazo
- [ ] Redis caching
- [ ] WebSocket para live updates
- [ ] Background jobs (BullMQ)
- [ ] Email service

### Largo Plazo
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Mobile API
- [ ] CDN para assets estáticos

## Problemas Conocidos y Soluciones

### 1. Prisma JSON en SQLite
**Problema**: SQLite no soporta tipo JSON nativo

**Solución**: Usar String y parsear/stringify JSON
```typescript
// Al guardar
data: { score: JSON.stringify({ home: 27, away: 24 }) }

// Al leer
const score = JSON.parse(event.score)
```

### 2. Next.js Lock File
**Problema**: Lock file deja de responder si crash

**Solución**: Kill process y eliminar `.next` directory
```bash
pkill -f "next dev"
rm -rf .next
npm run dev
```

### 3. Prisma Client Generation
**Problema**: Cliente no se genera después de schema change

**Solución**: Siempre ejecutar `npx prisma generate`

## Recursos

### Documentación
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod](https://zod.dev)

### Tutoriales
- [Next.js App Router](https://nextjs.org/learn)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [React Query](https://tanstack.com/query/latest)

## Contacto

Para preguntas técnicas:
- Issues en GitHub
- Email: tech@betanalytix.com