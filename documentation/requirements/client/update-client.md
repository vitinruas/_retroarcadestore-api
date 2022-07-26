# Get Client

> ## Success

1. ❌ Receber uma requisição do tipo **PUT** na rota **/api/client/**
2. ❌ Validar se existe algum campo fornecido no corpo da requisição
3. ❌ Validar se e❌iste o campo **email**
4. ❌ Validar se o campo **email** é valido, se fornecido
5. ❌ Atualizar os **dados fornecidos** do Cliente, não alterar os demais
6. ❌ Retornar **204**

> ## Exceptions

1. ❌ Retornar erro **404** se a API não existir
1. ✅ Retornar erro **400** se nenhum campo for fornecido
1. ✅ Retornar erro **500** se houver falha ao validar o campo **email**
1. ✅ Retornar erro **400** se o **email** fornecido é inválido
1. ✅ Retornar erro **500** se houver falha ao atualizar os dados do Cliente
