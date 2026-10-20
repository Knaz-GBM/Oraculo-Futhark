
# Futhark V7 — Plano de testes do oráculo

## Testes automatizados

Executar na raiz do projeto:

```bash
node tests/oracle.test.cjs
```

Resultado esperado:

`OK: todos os testes do oráculo passaram.`

## Testes manuais

- [ ] A página abre sem erro.
- [ ] Os links da navegação continuam funcionando.
- [ ] A tiragem Foco exibe uma runa.
- [ ] A tiragem Saga exibe Origem, Provação e Caminho.
- [ ] A tiragem Jornada exibe cinco posições corretas.
- [ ] Uma tiragem não apresenta runas repetidas.
- [ ] As orientações normal e invertida mostram a interpretação correspondente.
- [ ] O tema digitado aparece corretamente, inclusive com caracteres como <, >, & e aspas.
- [ ] O botão Limpar remove o resultado, apaga a pergunta e restaura a tiragem Saga.
- [ ] O link de cada runa abre a ficha correspondente.
- [ ] Os botões podem ser utilizados pelo teclado.
- [ ] A interface permanece utilizável em telas pequenas.
- [ ] Não aparecem erros no Console do navegador.

## Critério de aceite

Não publicar como versão validada enquanto houver falha nos testes
automatizados ou nos fluxos principais dos testes manuais.
