/**
 * Personal Chef Automation
 * Entrada esperada: objeto no formato de e.namedValues (Google Forms)
 * Mock disponível na função testeLocal()
 */

const API_KEY = PropertiesService
  .getScriptProperties()
  .getProperty("OPENROUTER_API_KEY");

function onFormSubmit(e) {
  try {
    const respostas = e.namedValues; // <-- JSON REAL DO GOOGLE FORMS
    executarFluxo(respostas);
  } catch (error) {
    Logger.log("Erro: " + error.message);
    MailApp.sendEmail(
      "email@email.com",
      "Erro no Script Personal Chef",
      error.message
    );
  }
}

// Use este método para testar sem enviar o formulário
function testeLocal() {
  const respostasMock = {
    "Nome:": ["Example Client"],
    "Telefone (Whatsapp):": ["+00 90000-0000"],
    "Endereço:": ["Downtown Area – City/State"],
    "Para quais dias da semana você precisa de refeição pronta?": ["Segunda, Terça, Quarta, Quinta, Sexta"],
    "Quais refeições você deseja incluir:": ["Almoço, Jantar"],
    "Quantas pessoas irão comer as refeições?": ["3"],
    "Alguém em sua casa segue alguma dieta?": ["Não"],
    "Quais tipos de pratos você prefere?": ["Prefiro o tradicional"],
    "Algum alimento que não consome?": ["Peixe"],
    "Os consumidores possuem alguma alergia alimentar?": ["Nenhuma"],
    "O que tem na sua cozinha? (Selecione o que possui com um bom funcionamento)": [
      "Fogão, Forno, Geladeira, Freezer, Liquidificador, Panela de pressão"
    ],
    "Você possui panelas, potes, tábuas e etc.? Ou prefere que a profissional leve-os?": [
      "Prefiro que traga os seus"
    ],
    "Sobre os ingredientes, o que funciona melhor?": [
      "Cliente compra de acordo com a lista enviada pelo profissional"
    ],
    "Gosta de experimentar receitas novas ou prefere o tradicional?": [
      "Prefiro o tradicional"
    ]
  };

  executarFluxo(respostasMock);
}

function executarFluxo(respostas) {
  const nomeCliente = respostas["Nome:"]?.[0] || "Cliente";

  const resultado = calcularValor(respostas);
  const cardapioIA = gerarCardapioIA(respostas);
  const pdf = gerarPDF(respostas, resultado, cardapioIA);

  enviarEmailComPDFParaMim(pdf, nomeCliente);
}

function gerarCardapioIA(respostas) {
  const diasSolicitados = respostas["Para quais dias da semana você precisa de refeição pronta?"]?.[0] || "Não informado";
  const refeicoesSolicitadas = respostas["Quais refeições você deseja incluir:"]?.[0] || "Não informado";

  const prompt = `
Atue como um Personal Chef especializado em Batch Cooking. 
Crie um cardápio organizado para os dias: ${diasSolicitados}.

REGRAS DE COMPOSIÇÃO:
- Para cada dia e cada refeição (${refeicoesSolicitadas}), apresente Opção A e Opção B.
- Use a mesma base de proteína para as opções A e B do dia (Otimização de produção).
- Cada opção deve listar: Proteína, Carboidrato, Leguminosa e Legumes.

REGRAS DE FORMATAÇÃO (MUITO IMPORTANTE):
- Não use asteriscos (**) nem cerquilhas (#).
- Use <b>DIA DA SEMANA</b> em letras maiúsculas para abrir cada dia.
- Use <br> ao final de cada linha para que o texto não fique grudado.
- Estruture exatamente assim para cada opção:
  Opção A:<br>
  - Proteína: [item]<br>
  - Carboidrato: [item]<br>
  - Leguminosa: [item]<br>
  - Legumes: [item]<br>

DADOS DO CLIENTE:
- Dieta: ${respostas["Alguém em sua casa segue alguma dieta?"]?.[0]}
- Gosta de: ${respostas["Quais tipos de pratos você prefere?"]?.[0]}
- Restrições: ${respostas["Algum alimento que não consome?"]?.[0]}
`;

  return chamarIA(prompt);
}

function chamarIA(prompt) {
  const apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("OPENROUTER_API_KEY");

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY não configurada");
  }

  const url = "https://openrouter.ai/api/v1/chat/completions";

  const payload = {
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um chef profissional especializado em criação de cardápios semanais personalizados."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + apiKey,
      "HTTP-Referer": "https://script.google.com",
      "X-Title": "Personal Chef Cardápio"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  if (!data.choices || !data.choices.length || !data.choices[0].message?.content) {
    throw new Error("Resposta da IA vazia");
  }

  return data.choices[0].message.content;
}

function calcularValor(respostas) {
  let total = 0;
  const d = { pessoas: 0, refeicoes: 0, complexidade: 0, utensilios: 0, ingredientes: 0, acrescimoDuasRefeicoes: 0, desconto: 0, valorAntesDesconto: 0 };
  
  const respPessoas = respostas["Quantas pessoas irão comer as refeições?"]?.[0] || "1";
  const pessoas = Number(respPessoas.replace(/\D/g, "")) || 1;
  
  const diasRaw = respostas["Para quais dias da semana você precisa de refeição pronta?"]?.[0] || "";
  const numDias = diasRaw.split(",").length || 1;
  
  const refRaw = respostas["Quais refeições você deseja incluir:"]?.[0] || "";
  const qtdRefPerDia = refRaw.split(",").length || 1;

  d.pessoas = pessoas * 40;
  let valorUnit = numDias > 4 ? 15 : 20;
  d.refeicoes = pessoas * numDias * valorUnit * qtdRefPerDia;
  total = d.pessoas + d.refeicoes;

  if (qtdRefPerDia === 2) { d.acrescimoDuasRefeicoes = d.refeicoes * 0.6; total += d.acrescimoDuasRefeicoes; }
  if ((respostas["Gosta de experimentar receitas novas ou prefere o tradicional?"]?.[0] || "").includes("Amo novidades")) { d.complexidade = 30; total += 30; }
  if ((respostas["Você possui panelas, potes, tábuas e etc.? Ou prefere que a profissional leve-os?"]?.[0] || "").includes("Prefiro")) { d.utensilios = 50; total += 50; }
  if ((respostas["Sobre os ingredientes, o que funciona melhor?"]?.[0] || "").includes("compra")) { d.ingredientes = 50; total += 50; }

  d.desconto = numDias >= 7 ? 0.15 : (numDias >= 4 ? 0.10 : 0);
  d.valorAntesDesconto = total;
  total *= (1 - d.desconto);
  
  return { total, detalhamento: d };
}

function gerarPDF(respostas, resultado, cardapioIA) {
  const d = resultado.detalhamento;
  const getR = (p) => respostas[p]?.[0] || "Não informado";
    const pessoas = Number(
    (respostas["Quantas pessoas irão comer as refeições?"]?.[0] || "1").replace(/\D/g, "")
  ) || 1;

  const refeicoesPorDia =
    (respostas["Quais refeições você deseja incluir:"]?.[0] || "").split(",").length || 1;

  const marmitasPorDia = pessoas * refeicoesPorDia;
    const diasTexto = getR("Para quais dias da semana você precisa de refeição pronta?");
  const qtdDias = diasTexto !== "Não informado"
    ? diasTexto.split(",").length
    : 0;

  let html = `
  <style>
    body { font-family: sans-serif; color: #333; }
    .header { border-bottom: 2px solid #333; text-align: center; margin-bottom: 20px; }
    h2 { background: #f2f2f2; padding: 5px; font-size: 14px; text-transform: uppercase; border-left: 5px solid #333; margin-top: 15px; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #eee; padding: 8px; font-size: 11px; }
    .total-final { background: #333; color: white; font-weight: bold; font-size: 13px; }
    .page-break { page-break-before: always; }
  </style>

  <div class="header"><h1>Ficha de Trabalho - Personal Chef</h1></div>

  <h2>👤 Informações do Cliente</h2>
  <table>
    <tr><td><b>Nome:</b> ${getR("Nome:")}</td><td><b>WhatsApp:</b> ${getR("Telefone (Whatsapp):")}</td></tr>
    <tr><td colspan="2"><b>Endereço:</b> ${getR("Endereço:")}</td></tr>
  </table>

  <h2>🍳 Planejamento Logístico</h2>
  <table>
    <tr><td><b>Dias de Refeição:</b></td><td>${diasTexto} (${qtdDias} dia${qtdDias > 1 ? "s" : ""})</td></tr>
    <tr><td><b>Pessoas / Marmitas por dia:</b></td><td>${pessoas} pessoa(s) • ${marmitasPorDia} marmita(s) por dia</td></tr>
    <tr><td><b>Dieta / Restrições:</b></td><td>${getR("Alguém em sua casa segue alguma dieta?")}</td></tr>
    <tr><td><b>Não Consome:</b></td><td>${getR("Algum alimento que não consome?")}</td></tr>
    <tr><td><b>Alergias Alimentares:</b></td><td>${getR("Os consumidores possuem alguma alergia alimentar?")}</td></tr>
    <tr><td><b>Infraestrutura:</b></td><td>${getR("O que tem na sua cozinha? (Selecione o que possui com um bom funcionamento)")}</td></tr>
    <tr><td><b>Utensílios:</b></td><td>${getR("Você possui panelas, potes, tábuas e etc.? Ou prefere que a profissional leve-os?")}</td></tr>
    <tr><td><b>Ingredientes:</b></td><td>${getR("Sobre os ingredientes, o que funciona melhor?")}</td></tr>
  </table>

  <h2>💰 Proposta Financeira</h2>
  <table>
    <thead><tr style="background:#eee"><th>Descrição do Serviço</th><th align="right">Valor</th></tr></thead>
    <tbody>
      <tr><td>Taxa Base (por pessoa)</td><td align="right">R$ ${d.pessoas.toFixed(2)}</td></tr>
      <tr><td>Preparo das Refeições (Mão de obra)</td><td align="right">R$ ${d.refeicoes.toFixed(2)}</td></tr>
      ${d.acrescimoDuasRefeicoes > 0 ? `<tr><td>Adicional: Turno Dobrado (Almoço + Jantar)</td><td align="right">R$ ${d.acrescimoDuasRefeicoes.toFixed(2)}</td></tr>` : ""}
      ${d.complexidade > 0 ? `<tr><td>Adicional: Menu Degustação/Novidades</td><td align="right">R$ ${d.complexidade.toFixed(2)}</td></tr>` : ""}
      ${d.utensilios > 0 ? `<tr><td>Taxa Logística: Utensílios da Profissional</td><td align="right">R$ ${d.utensilios.toFixed(2)}</td></tr>` : ""}
      ${d.ingredientes > 0 ? `<tr><td>Taxa Logística: Serviço de Compras</td><td align="right">R$ ${d.ingredientes.toFixed(2)}</td></tr>` : ""}
      ${d.desconto > 0 ? `<tr style="color:green"><td>Desconto Fidelidade Aplidado</td><td align="right">- R$ ${(d.valorAntesDesconto * d.desconto).toFixed(2)}</td></tr>` : ""}
      <tr class="total-final"><td>VALOR TOTAL DO ORÇAMENTO</td><td align="right">R$ ${resultado.total.toFixed(2)}</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>
  <div class="header"><h1>Cardápio Semanal Sugerido por IA</h1></div>
  <div style="font-size: 12px; line-height: 1.5;">${cardapioIA}</div>
  `;

  return Utilities.newBlob(html, "text/html", "proposta.html")
    .getAs("application/pdf")
    .setName(`Ficha_Trabalho_${getR("Nome:")}.pdf`);
}

function enviarEmailComPDFParaMim(pdf, nomeCliente) {
  MailApp.sendEmail({
    to: "email@email.com",
    subject: `📋 NOVA SOLICITAÇÃO: ${nomeCliente}`,
    body: "Olá Chef! Uma nova resposta de formulário chegou. O PDF em anexo contém o orçamento detalhado, a logística da cozinha e a sugestão de cardápio da IA.",
    attachments: [pdf]
  });
}
