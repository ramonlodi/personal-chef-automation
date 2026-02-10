# 🧑‍🍳 Personal Chef Automation – Orçamento & Cardápio Inteligente

Automação completa desenvolvida em **Google Apps Script** (JavaScript) que transforma respostas do Google Forms em um orçamento profissional em PDF. 
O sistema conta com um motor de cálculo de regras de negócio e integração com IA para geração de cardápios personalizados.

> Projeto focado em automação de processos, regras de negócio e integração com APIs externas, utilizando JavaScript em ambiente serverless.

### 🧩 Tecnologias Utilizadas
- Google Apps Script (JavaScript)
- Google Forms
- OpenRouter API (LLMs)
- HTML/CSS para geração de PDF
  
### 📌 Workflow do Sistema
O fluxo opera de forma 100% serverless e automática:
1.  **Entrada:** Cliente envia o formulário do Google.
2.  **Processamento:** O gatilho `onFormSubmit` valida os dados e aplica as regras de precificação.
3.  **Inteligência Artificial:** A API do OpenRouter gera um cardápio otimizado para *Batch Cooking*.
4.  **Documentação:** Um PDF estilizado em HTML/CSS é gerado dinamicamente.
5.  **Entrega:** O PDF é enviado por e-mail para a administração.

### 🚀 Funcionalidades
* **Motor de Cálculo Dinâmico:** Precificação baseada em volume, complexidade e logística.
* **Integração com IA:** Uso de LLMs via OpenRouter para criação de menus inteligentes.
* **Gestão de PDF:** Geração de documentos profissionais via código.
* **Segurança:** Gestão de credenciais via `PropertiesService`.

### 🛠️ Configuração
1.  **Variáveis de Ambiente:** No Apps Script, vá em *Configurações do Projeto* e adicione a propriedade `OPENROUTER_API_KEY`, configure uma API key.
2. **Gatilhos**: Para execução em produção, adicione um gatilho para a função `onFormSubmit` com o evento "Ao enviar formulário".
                 Para testes manuais, a função `testeLocal` pode ser executada diretamente pelo editor do Apps Script, sem necessidade de envio do formulário.

### 🎯 Objetivo do Projeto
Este projeto demonstra a viabilidade de automações robustas utilizando ferramentas do ecossistema Google integradas a modelos de linguagem (LLMs). Ele resolve o problema de tempo de resposta e padronização em serviços de Personal Chef, unindo lógica de negócio e engenharia de prompt.

### 🖼️ Preview do Resultado
Você pode visualizar um exemplo do orçamento gerado na pasta de documentação:
👉 **[Ver Exemplo de PDF (docs/example_quote.pdf)](docs/Ficha_Trabalho_Example_Client.pdf)**

--- 

💻 Desenvolvido por **Ramon Lodi de Sousa** 
