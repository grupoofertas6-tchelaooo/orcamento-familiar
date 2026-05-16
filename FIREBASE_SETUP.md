COMO ATIVAR O FIREBASE
======================

1. Acesse https://console.firebase.google.com
2. Crie um projeto (ou use existente)
3. Ative Authentication > Sign-in method > Email/Senha
4. Ative Cloud Firestore > Criar banco > modo de teste
5. Configurações do projeto > Seus apps > Adicionar app > Web
6. Copie os valores para src/services/firebaseConfig.js

Arquivo para editar:
  src/services/firebaseConfig.js

Exemplo preenchido:
  const firebaseConfig = {
    apiKey: 'AIzaSyB12345Exemplo67890',
    authDomain: 'meu-app.firebaseapp.com',
    projectId: 'meu-app-abc123',
    storageBucket: 'meu-app-abc123.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123def456',
  }

SE NÃO CONFIGURAR:
  O app continua funcionando normalmente com armazenamento LOCAL
  (AsyncStorage). Os dados ficam só no seu celular.
