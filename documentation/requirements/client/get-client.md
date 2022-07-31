# Get Client

> ## Success

1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/client/**
2. ✅ Retorna **200** com a conta do cliente

> ## Exceptions

1. ✅ Retorna erro **404** se a API não existir
1. ✅ Retorna erro **403** se o usuário com o token fornecido não for válido
1. ✅ Retorna erro **500** houver falha ao recuperar a conta do cliente
