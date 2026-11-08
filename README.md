# Convite Sandra & Tutti

Convite de casamento digital interativo (mobile-first, estilo livro de páginas / cards) construído em HTML5, CSS3 e JavaScript puros, sem frameworks ou bibliotecas externas.

## Estrutura do Convite
1. **Tela 1 — Envelope:** Abas duplas laterais com a arte original em aquarela e lacre dourado de cera centralizado. Ao clicar no lacre, ele se quebra e as abas deslizam suavemente, revelando o livro interno.
2. **Página 1 — Save the Date:** Molduras florais, título "SAVE the DATE" com o "the" dourado cursivo, data 06.FEVEREIRO.2027, moldura para a foto do casal, citação e nomes.
3. **Página 2 — Convite Oficial:** Monograma "T&S", bênção de Deus e presença dos filhos, nomes completos destacados ("Sandra Maria Santi" & "Jorge de Oliveira (Tutti)"), texto de convite, data e cidade.
4. **Página 3 — Cerimônia e Festa:** Ícone de igreja com alianças, detalhes da Paróquia Nossa Senhora do Bom Parto (17h), detalhes do Restaurante Aguia/Maninho e botões de rota direta no Google Maps com feedback tátil.
5. **Página 4 — Confirmação e Paleta:** Ícone de calendário com coração, caixa destacada com prazo até 10 de Janeiro de 2027, botão com link direto para o WhatsApp, divisória botânica e paleta das madrinhas com 4 tons de fúcsia.
6. **Página 5 — Encerramento:** Ícone dourado de alianças entrelaçadas, título "Esperamos por vocês!", mensagem carinhosa e encerramento com o monograma "T&S" e a data "06 . FEVEREIRO . 2027".

## Navegação Interativa (Livro / Cards)
- **Gestos Touch (Swipe)**: Deslize horizontalmente no celular para avançar ou voltar páginas.
- **Setas Laterais**: Botões discretos de navegação esquerda/direita.
- **Teclado**: Suporte a `ArrowLeft` e `ArrowRight`.
- **Efeito Sonoro (Foley)**: Efeito de virada de folha de papel suave a cada troca de página.
- **Controle de Som**: Botão flutuante no topo direito para ativar ou desativar o áudio.

## Arquivos do Projeto
- `index.html`: Marcação semântica e estruturação do livro e envelope.
- `style.css`: Estilos, tipografia elegante (Playfair Display, Cinzel, Great Vibes, Montserrat), perspectiva 3D e animações.
- `script.js`: Lógica de abertura do envelope, navegação de páginas, touch swipe e áudio.
- `page-turn.wav`: Áudio foley realista de folha de papel virando.
- `image_0.png`: Arte visual de referência.
- `image_base.png`, `flora_top.png`, `flora_bottom.png`: Recortes e texturas florais com fundo transparente.

## Pendências para Finalização dos Noivos
- [ ] Inserir a foto real do casal (substituir o placeholder na Página 1).
- [ ] Preencher os endereços definitivos da paróquia e do restaurante (Página 3).
- [ ] Configurar o número do WhatsApp substituindo `55DDDNUMERO` (Página 4).

## Publicação no GitHub Pages
1. Acesse: **Settings > Pages** no repositório.
2. Em **Source**, selecione `Deploy from a branch`.
3. Escolha a branch `main` e a pasta `/(root)`, depois clique em **Save**.
4. URL final: https://rcdutra96.github.io/convitesandratutti/
