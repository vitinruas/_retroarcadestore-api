# Get Client

> ## Success

1. ❌ Receber uma requisição do tipo **PUT** na rota **/api/client/**
2. ✅ Validar se existe algum campo fornecido no corpo da requisição
3. ✅ Validar se existe o campo **file** da imagem e convertê-lo para **photo**
4. ✅ Validar se existe o campo **email** e validar se corresponde ao protocolo, se fornecido
5. ❌ Validar se existe o campo **postalCode** e validar se corresponde ao protocolo, se fornecido
6. ❌ Gerar uma **senha criptografada** se fornecida
7. ❌ Atualizar os **dados fornecidos** do Cliente
8. ✅ Retornar **204**

> ## Exceptions

1. ❌ Retornar erro **404** se a API não existir
1. ✅ Retornar erro **400** se nenhum campo for fornecido
1. ✅ Retornar erro **500** se houver falha ao validar o campo **email**
1. ✅ Retornar erro **400** se o **email** fornecido é inválido
1. ✅ Retornar erro **500** se houver falha ao atualizar os dados do Cliente
