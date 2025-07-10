const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionField = document.getElementById('questionField');
const askButton = document.getElementById('askButton');
const form = document.getElementById('form');
const aiResponse = document.getElementById('aiResponse');


const markdownHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

const askAi = async (question, game, apiKey) => {
    const model = 'gemini-2.5-flash';
    const baseURl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const pergunta = `
    ## Especialidade
    Você é um especialista em jogos, com foco ${game}. Você tem amplo conhecimento sobre estratégias, builds, dicas e tudo relacionado a esses jogos.
    ## Tarefa
    Sua tarefa é responder perguntas sobre ${game}, fornecendo informações precisas e úteis. Você deve ser capaz de explicar conceitos, sugerir estratégias e oferecer dicas valiosas para jogadores de todos os níveis.
    ## Regras
    - Se você não souber a resposta, responda "Desculpe, não sei a resposta para essa pergunta.".
    - Se a pergunta não for sobre ${game}, responda "Desculpe, essa pergunta não é sobre ${game}.".
    - Considere a data atual ${new Date().toLocaleDateString('pt-BR')} e o horário atual ${new Date().toLocaleTimeString('pt-BR')} para fornecer respostas atualizadas.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para fornecer informações precisas e relevantes.

    ## Resposta
    Economize a resposta, fornecendo apenas as informações necessárias para responder à pergunta. Use uma linguagem clara e objetiva, evitando jargões técnicos desnecessários. Se necessário, forneça exemplos práticos para ilustrar suas respostas. Responda em markdown, utilizando títulos, listas e formatação adequada para facilitar a leitura.
    Não inclua informações irrelevantes ou desnecessárias. Foque na pergunta feita e forneça uma resposta direta e útil.
    ## Exemplo de resposta 
    # Melhor build para ADC
    ## Runas
    - **Precisão**: Conquistador
    - **Secundária**: Feitiçaria
    ## Itens
    - **Botas**: Berserker's Greaves
    - **Item principal**: Galeforce
    - **Item situacional**: Infinity Edge, Bloodthirster, Guardian Angel
    ## Dicas
    - Farmar bem no início do jogo para acumular ouro.
    - Posicionar-se corretamente em lutas de equipe para maximizar o dano.
    - Utilizar habilidades de controle de grupo para ajudar a equipe.
    Pergunta: ${question}
    `
    const contents = [{
        role: 'user',
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // chamar API
    const response = await fetch(baseURl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            contents,
            tools
        })
    }) 

    const data = await response.json();

     if (!response.ok) { // Check if the response was successful
        console.error('API Error:', data);
        throw new Error(`API request failed with status ${response.status}: ${data.error.message || 'Unknown error'}`);
    }

    return data.candidates[0].content.parts[0].text;
}

const sendForm = async (event) => {
   event.preventDefault()
   const apiKey = apiKeyInput.value;
   const game = gameSelect.value;
   const question = questionField.value;

   console.log('API Key:', apiKey);
   console.log('Game:', game);  
   console.log('Question:', question);

   if(apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos.');    
    return;
   }

   askButton.disabled = true;
   askButton.textContent = 'Enviando...';
   askButton.classList.add('loading');

   try {
    const text = await askAi(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownHTML(text)
    aiResponse.classList.remove('hidden');
    // Perguntar para a IA
   } catch (error) {
    console.log('Erro ao enviar a pergunta:', error);
   }finally {
    askButton.disabled = false;
    askButton.textContent = 'Perguntar';    
    askButton.classList.remove('loading');
   }
}

form.addEventListener("submit", sendForm)