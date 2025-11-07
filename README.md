# Controle de Despesas (TypeScript + MongoDB)

## Requisitos
- Node.js (>= 16)
- npm
- MongoDB (local ou Atlas)

## Configuração
1. Clone o repositório.
2. `cd expense-control`
3. `cp .env.example .env` e edite `MONGO_URI` se necessário.
4. `npm install`

## Rodando em desenvolvimento
`npm run dev`

Acesse `http://localhost:3000`

## Build / produção
`npm run build`
`npm run start`

## Endpoints principais
- `GET /api/expenses` — lista todas as despesas
- `POST /api/expenses` — cria despesa `{ description, amount, date? }`
- `PUT /api/expenses/:id` — atualiza despesa
- `DELETE /api/expenses/:id` — exclui despesa
- `GET /api/expenses/total` — retorna `{ total }` com soma de `amount`

## Notas
- `amount` deve ser número >= 0 (validação no backend e frontend).
- `date` é opcional; se omitido, assume data atual.
- `date` aceita `dd/mm/yyyy` ou ISO (yyyy-mm-dd).
