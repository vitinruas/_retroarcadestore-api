# Get Client

> ## Success

1. ❌ Receber uma requisição do tipo **PUT** na rota **/api/client/**
2. ✅ Validar se existe algum campo fornecido no corpo da requisição
3. ✅ Validar se contém valores nos campos obrigatórios **name** e **email**, se foram fornecidos
4. ✅ Validar se existe o campo **file** da imagem e renomear para **photo** para corresponder ao protocolo
5. ✅ Validar se existe o campo **email** e validar se corresponde ao protocolo, se fornecido, antes deve ser enviado **password**, se fornecido
6. ✅ Validar se existe o campo **postalCode** e validar se corresponde ao protocolo, se fornecido
7. ✅ Validar se **newPassword** e **newPasswordConfirmation** se correspondem, antes deve ser enviado **password**, se fornecido
8. ✅ Validar se a senha atual fornecida corresponde ao hash
9. ✅ Gerar uma **senha criptografada** se fornecida
10. ✅ Atualizar os **dados fornecidos** do Cliente
11. ✅ Retornar **204**

> ## Exceptions

1. ❌ Retornar erro **404** se a API não existir
1. ✅ Retornar erro **400** se nenhum campo for fornecido
1. ✅ Retornar erro **500** se houver falha ao validar o campo **email**
1. ✅ Retornar erro **400** se o **email** fornecido é inválido
1. ✅ Retornar erro **500** se houver falha ao atualizar os dados do Cliente
