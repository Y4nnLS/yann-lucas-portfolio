# Plano de Implementação

## Fase 1 — Inspeção e configuração

- Confirmar o estado do repositório e preservar o `README.md`.
- Criar a estrutura inicial de monorepo com `frontend`, `backend`, `docs`, `scripts` e workflow.
- Configurar variáveis de ambiente, Docker Compose, convenções e documentação base.

## Fase 2 — Banco e back-end

- Implementar configuração do FastAPI, modelos SQLAlchemy, migração inicial, seed idempotente e criação idempotente do administrador.
- Criar autenticação por cookies HttpOnly com access token curto e refresh token.
- Expor endpoints públicos e administrativos, uploads locais seguros e integração com GitHub com cache e fallback.
- Escrever testes críticos do back-end.

## Fase 3 — Front-end público

- Configurar Next.js com App Router, Tailwind CSS, TypeScript estrito e consumo da API.
- Implementar layout global, componentes reutilizáveis, home pública, listagem de projetos, estudo de caso, currículo, contato, privacidade, sitemap e robots.
- Cobrir estados de loading, erro e vazio e adicionar testes de componentes essenciais.

## Fase 4 — Painel administrativo

- Implementar login, proteção de rotas, dashboard e páginas de CRUD principais.
- Criar formulários com React Hook Form e Zod para projetos, tecnologias, experiências, repositórios e configurações.
- Permitir upload de imagens e currículo e conectar o painel às rotas administrativas do FastAPI.

## Fase 5 — Validação final

- Executar migrações, seed, lint, typecheck, testes e build.
- Ajustar responsividade, acessibilidade e documentação final.
- Registrar no resumo final apenas os problemas que permanecerem sem solução.

