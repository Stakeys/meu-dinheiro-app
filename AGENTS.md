# Expo SDK 54

Este projeto usa Expo SDK 54 (rebaixado do 57 para compatibilidade com o Expo Go da App Store).
Consulte a documentação versionada em https://docs.expo.dev/versions/v54.0.0/ antes de escrever código.

## Contexto do projeto

App de finanças pessoais "MeuDinheiro" — mobile-first, dados 100% locais (expo-sqlite), sem backend.

- **Rotas**: expo-router file-based em `app/` (tabs + stack "Mais" + modal de transação)
- **Dados**: `db/` (schema com migrations versionadas, repositórios por entidade) + stores zustand em `store/`
- **Temas**: 3 skins trocáveis (Clarity, Pulse, Story) em `theme/tokens/`, consumidos via `useTheme()`
- **Componentes**: `components/` — todos consomem tokens do tema, nunca cores fixas

## Comandos

- Type-check: `npx tsc --noEmit`
- Servidor: `npx expo start` (testar via Expo Go no aparelho)
- Node local em `~/node/bin` (adicionar ao PATH)
