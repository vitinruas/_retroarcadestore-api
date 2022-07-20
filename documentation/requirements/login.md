# Login

> ## Success

1. ❌ Recebe uma requisição do tipo **POST** na rota **/api/login**
2. ✅ Valida dados obrigatórios **email**, **password**
3. ✅ Valida que o campo **email** é um e-mail válido
4. ✅ Verifique se existe um usuário com o **email** fornecido
5. ❌ Comparar a senha **criptografada** da conta recuperada com a senha fornecida pelo usuário
6. ❌ Gera um **token** de acesso a partir do ID do usuário
7. ❌ **Atualiza** os dados do usuário com o novo token de acesso gerado
8. ✅ Retorna **200** com o novo token de acesso

> ## Exceptions

1. ❌ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se email, password não forem fornecidos pelo cliente
3. ✅ Retorna erro **400** se o campo email for um e-mail inválido
4. ✅ Retorna erro **401** se as credenciais fornecidas estiverem erradas
5. ❌ Retorna erro **500** se der erro ao comparar a senha fornecida com a senha criptografada
6. ❌ Retorna erro **500** se der erro ao tentar gerar o token de acesso
7. ❌ Retorna erro **500** se der erro ao tentar atualizar o usuário com o novo token de acesso gerado
