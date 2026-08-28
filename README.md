# JobInbox

Este projeto foi gerado usando o [Angular CLI](https://github.com/angular/angular-cli) versão 21.2.7.

## Servidor de desenvolvimento

Para iniciar um servidor de desenvolvimento local, execute:

```bash
ng serve
```

Uma vez que o servidor estiver rodando, abra o navegador e acesse `http://localhost:4200/`. A aplicação recarregará automaticamente sempre que você modificar qualquer um dos arquivos de origem.

## Geração de código (Code scaffolding)

O Angular CLI inclui ferramentas poderosas de geração de código. Para gerar um novo componente, execute:

```bash
ng generate component nome-do-componente
```

Para uma lista completa de schematics disponíveis (como `components`, `directives`, ou `pipes`), execute:

```bash
ng generate --help
```

## Build (Compilação)

Para compilar o projeto, execute:

```bash
ng build
```

Isso compilará seu projeto e armazenará os artefatos de build no diretório `dist/`. Por padrão, o build de produção otimiza sua aplicação para performance e velocidade.

## Executando testes unitários

Para executar testes unitários com o [Vitest](https://vitest.dev/), use o seguinte comando:

```bash
ng test
```

Para executar testes com cobertura:

```bash
npm run test:coverage
```

## Executando testes end-to-end

Para testes end-to-end (e2e), execute:

```bash
ng e2e
```

O Angular CLI não vem com um framework de testes e2e por padrão. Você pode escolher um que atenda às suas necessidades (ex: Playwright, Cypress).

## Scripts úteis adicionais

```bash
# Verificar formatação (Prettier)
npm run format:check

# Formatar código automaticamente
npm run format

# Verificar lint (ESLint)
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Verificar tipos TypeScript
npm run typecheck

# Pipeline CI completo (format + lint + typecheck + test + build)
npm run ci
```

## Recursos adicionais

Para mais informações sobre o uso do Angular CLI, incluindo referências detalhadas de comandos, visite a página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
