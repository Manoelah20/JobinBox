# JobInbox

Gerenciador de oportunidades de emprego, cursos e vagas — construído com Angular 21, Signals e zoneless change detection.

## Stack

- **Framework**: Angular 21 (standalone components, Signals, zoneless)
- **Testing**: Vitest + @analogjs/vite-plugin-angular (129 testes)
- **Styling**: Design system CSS custom properties (sem dependências externas)
- **State**: Signals + Services reativos
- **PWA**: Service Worker + manifest (offline-first)
- **CI/CD**: GitHub Actions (lint, typecheck, testes, build)

## Funcionalidades

- **Oportunidades**: CRUD completo com filtros (status, tipo, busca, ordenação), export JSON/CSV
- **Inbox**: Análise de e-mails, extração automática de dados da vaga, criação de oportunidade
- **Dashboard**: Métricas e estatísticas em tempo real
- **Import**: Importação em lote via JSON/CSV
- **Status badges padronizados**: Nova, Interessante, Em andamento, Acompanhando, Enviado proposta, Entrevista — mesmo formato/tamanho, cores semânticas

## Comandos

```bash
# Desenvolvimento
npm start

# Build produção
npm run build

# Testes
npm run test:run        # unitários (Vitest)
npm run test:coverage   # com cobertura

# Qualidade
npm run lint            # ESLint
npm run typecheck       # TypeScript
npm run format          # Prettier
npm run ci              # pipeline completo
```

## Estrutura

```
src/app/
├── core/
│   └── services/       # OpportunityService, InboxService, RelevanceService, ToastService
├── features/
│   ├── opportunities/  # Lista + CRUD de oportunidades
│   ├── inbox/          # Análise de mensagens
│   ├── dashboard/      # Métricas
│   ├── import/         # Import JSON/CSV
│   └── opportunity-detail/
├── shared/
│   ├── components/     # OpportunityModal, UI compartilhados
│   └── styles/         # design-system.css (tokens + componentes)
└── app.routes.ts       # Rotas lazy-loaded
```

## Deploy

- **Vercel**: Deploy automático no push para `master`
- **Build**: `ng build` → output `dist/jobinbox/browser`
- **PWA**: Service Worker ativa em produção

## Testes

```bash
# 129 testes passando
# Cobertura: services, components, guards, pipes
npm run test:run
```

## Licença

MIT
