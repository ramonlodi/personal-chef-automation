# 🧑‍🍳 Personal Chef Automation – Orçamento & Cardápio Inteligente


## Versão em Português 🇧🇷

Automação completa desenvolvida em **Google Apps Script** (JavaScript) que transforma respostas do Google Forms em um orçamento profissional em PDF. O sistema conta com um motor de cálculo de regras de negócio e integração com IA para geração de cardápios personalizados.

> Projeto focado em automação de processos, regras de negócio e integração com APIs externas, utilizando JavaScript em ambiente serverless.

### 🖼️ Preview do Resultado
Você pode visualizar um exemplo do orçamento gerado na pasta de documentação:
👉 **[Ver Exemplo de PDF (docs/example_quote.pdf)](docs/example_quote.pdf)**

### 📌 Workflow do Sistema
O fluxo opera de forma 100% serverless e automática:
1.  **Entrada:** Cliente envia o formulário do Google.
2.  **Processamento:** O gatilho `onFormSubmit` valida os dados e aplica as regras de precificação.
3.  **Inteligência Artificial:** A API do OpenRouter (GPT-4o-mini) gera um cardápio otimizado para *Batch Cooking*.
4.  **Documentação:** Um PDF estilizado em HTML/CSS é gerado dinamicamente.
5.  **Entrega:** O PDF é enviado por e-mail para a administração.

### 🚀 Funcionalidades
* **Motor de Cálculo Dinâmico:** Precificação baseada em volume, complexidade e logística.
* **Integração com IA:** Uso de LLMs via OpenRouter para criação de menus inteligentes.
* **Gestão de PDF:** Geração de documentos profissionais via código.
* **Segurança:** Gestão de credenciais via `PropertiesService`.

### 🧠 Regras de Negócio Implementadas
| Item | Regra |
| :--- | :--- |
| **Taxa Base** | R$ 40,00 por pessoa |
| **Mão de Obra** | R$ 15,00 a R$ 20,00 por marmita |
| **Turno Dobrado** | +60% sobre a mão de obra |
| **Descontos** | Até 15% para pacotes semanais completos |

### 🛠️ Configuração
1.  **Variáveis de Ambiente:** No Apps Script, vá em *Configurações do Projeto* e adicione a propriedade `OPENROUTER_API_KEY`.
2.  **Gatilhos:** Adicione um gatilho para a função `onFormSubmit` com o evento "Ao enviar formulário".

### 🎯 Objetivo do Projeto
Este projeto demonstra a viabilidade de automações robustas utilizando ferramentas do ecossistema Google integradas a modelos de linguagem (LLMs). Ele resolve o problema de tempo de resposta e padronização em serviços de Personal Chef, unindo lógica de negócio e engenharia de prompt.

---

## Version in English 🇺🇸

Full automation developed in **Google Apps Script** (JavaScript) that transforms Google Forms responses into a professional PDF quote. The system features a business logic pricing engine and AI integration for personalized menu generation.

> A project focused on process automation, business rules, and external API integration using JavaScript in a serverless environment.

### 🖼️ Result Preview
You can view an example of the generated quote in the documentation folder:
👉 **[View Example PDF (docs/example_quote.pdf)](docs/example_quote.pdf)**

### 📌 System Workflow
The process is 100% serverless and automatic:
1.  **Input:** Client submits the Google Form.
2.  **Processing:** The `onFormSubmit` trigger validates data and applies pricing rules.
3.  **Artificial Intelligence:** OpenRouter API (GPT-4o-mini) generates a menu optimized for *Batch Cooking*.
4.  **Documentation:** A stylized HTML/CSS PDF is dynamically generated.
5.  **Delivery:** The PDF is emailed to the administration.

### 🚀 Features
* **Dynamic Calculation Engine:** Pricing based on volume, complexity, and logistics.
* **AI Integration:** Use of LLMs via OpenRouter for smart menu creation.
* **PDF Management:** Professional document generation via code.
* **Security:** Credential management via `PropertiesService`.

### 🧠 Implemented Business Rules
| Item | Rule |
| :--- | :--- |
| **Base Fee** | R$ 40.00 per person |
| **Labor** | R$ 15.00 to R$ 20.00 per meal |
| **Double Shift** | +60% on labor cost |
| **Discounts** | Up to 15% for full weekly packages |

### 🛠️ Setup
1.  **Environment Variables:** In the Apps Script editor, go to *Project Settings* and add the `OPENROUTER_API_KEY` property.
2.  **Triggers:** Add a trigger for the `onFormSubmit` function with the "On form submit" event.

### 🎯 Project Objective
This project demonstrates the feasibility of robust automations using Google ecosystem tools integrated with Large Language Models (LLMs). It addresses response time and standardization needs in Personal Chef services by combining business logic and prompt engineering.

---
Developed by **Ramon Lodi de Sousa** 🧑‍🍳
