## OmniStack - NLW 10 - Copa

### Data: 31/10/2022 a 07/11/2022

### RocketSeat

#### Educator: Diego Fernandes / Rodrigo Gonçalves

#### Developer: Josuel A. Lopes

#### Inicio projeto

#### Instalando e configurando TypeScript - SERVER

> npm init -y

#### Backend

/_npm i typescript @types/node ts-node-dev -D_/

> npm i typescript -D
> npx tsc --init
> npm i tsx -D

- Monitorar log da aplicação
  > npm i fasttify -D

> npm i prisma -D
> npm i @prisma/client

- Criando o banco SQlite

  > npx prisma init --datasource-provider SQLite

- Criando a migration

  > npx prisma migrate dev

- Acessando Tables via interface web

  > npx prisma studio

- Mermaid (Gerar grafico e diagramas )

  > npm i prisma-erd-generator @mermaid-js/mermaid-cli -D
  > npx prisma generate

  ==============================================================================
  Resolução problema - Generate

  Passo a passo de como fiz isso:

  1. Apenas abri o WSL e executei: sudo apt update && sudo apt -y upgrade && sudo apt -y autoremove
  2. Após o passo anterior finalizar, rodei wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  3. Depois, foi a vez de rodar sudo apt -y install ./google-chrome-stable_current_amd64.deb
  4. O passo 3 me retornou um erro, que resolvi rodando sudo apt autoremove e depois rodei novamente o comando do passo 3
  5. # Por fim só verifiquei se tinha instalado normalmente com o comando google-chrome --version

  ==============================================================================

- CORS

  > @fastify/cors

- Criando as tabelas e relacionamentos, populando as tabelas

  > npx prisma db seed

- Validações

  > npm i zod

- Create unique ID

  > npm i short-unique-id

- Autenticação JWT
  > npm i @fastify/jwt

#### Criando projeto WEB

> nvm use 16.17.0
> npx create-next-app@latest --use-npm

- Styles com Tailwind CSS

  > npm i tailwindcss postcss autoprefixer -D
  > npx tailwindcss init -p

- Requisições com AXIOS
  > npm i axios

#### Criando projeto MOBILE

> npx create-expo-app mobile
> npx expo start
> ou
> npx expo start --android

- https://nativebase.io/

  > npm i native-base
  > npm i native-base --force
  > npx expo install react-native-svg@12.1.1
  > expo install react-native-safe-area-context@3.3.2
  > npx expo install expo-font @expo-google-fonts/roboto

  > npm i react-native-svg-transformer
  > npm i phosphor-react-native

- Autenticação GOOGLE

  > npx expo install expo-auth-session expo-random
  > npx expo install expo-web-browser

  -- Add no app.json

  ```
  "scheme": "nome do app",
  ```

- Navegação de paginas

  > npm i @react-navigation/native
  > npx expo install react-native-screens react-native-safe-area-context
  > npm i @react-navigation/bottom-tabs

- Conectando ao backend

  > npm i axios

- Buscar o nome do País pelo ISOCode Ex(BR, USA)

  > npm i country-list
  > npm i --save-dev @types/country-list

- Exibir Imagem do País pelo ISOCode

  > npm i react-native-country-flag

- Format Date

  > npm i dayjs

- Variaveis de ambiente
  > npm i dotenv babel-plugin-inline-dotenv

-- Add no arquivo
--- ./babel.config.js

```
 plugins: ['inline-dotenv']
```

- limpar cache do Reac Native - Mobile (Smartphone ou Simulador)
  > npx expo start --clear

================================== END =========================================
