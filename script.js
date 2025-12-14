<script>
    console.log('⚡ Script carregado!');

    // 1. Função para trocar de seção
    function mostrarSecao(secaoId) {
        var secoes = document.querySelectorAll('.section');
        secoes.forEach(secao => secao.style.display = 'none');
        
        const secaoElement = document.getElementById(secaoId);
        if (secaoElement) {
             secaoElement.style.display = 'block';
        }
        window.scrollTo(0, 0);
    }

    // 2. Função para buscar versículo da API (MUDA APENAS 1X POR DIA)
    function versiculoDoDia() {
        const hoje = new Date().toDateString(); // Data de hoje
        const versiculoSalvo = localStorage.getItem('versiculo');
        const dataSalva = localStorage.getItem('versiculoData');
        
        // Se já tem versículo de hoje, usa ele
        if (versiculoSalvo && dataSalva === hoje) {
            const dados = JSON.parse(versiculoSalvo);
            document.getElementById('versiculo-texto').textContent = '"' + dados.texto + '"';
            document.getElementById('versiculo-ref').textContent = '— ' + dados.referencia;
            console.log('✅ Usando versículo salvo de hoje');
            return;
        }
        
        // Se não, busca um novo da API
        console.log('🔍 Buscando novo versículo da API...');
        
        fetch('https://www.abibliadigital.com.br/api/verses/nvi/random')
            .then(response => {
                if (!response.ok) throw new Error('API falhou');
                return response.json();
            })
            .then(data => {
                const texto = data.text;
                const referencia = data.book.name + ' ' + data.chapter + ':' + data.number;
                
                // Exibe o versículo
                document.getElementById('versiculo-texto').textContent = '"' + texto + '"';
                document.getElementById('versiculo-ref').textContent = '— ' + referencia;
                
                // Salva no localStorage com a data de hoje
                localStorage.setItem('versiculo', JSON.stringify({ texto, referencia }));
                localStorage.setItem('versiculoData', hoje);
                
                console.log('✅ Novo versículo exibido e salvo!');
            })
            .catch(error => {
                console.log('❌ Erro na API, usando fallback...');
                
                // Fallback se API falhar
                document.getElementById('versiculo-texto').textContent = '"Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles."';
                document.getElementById('versiculo-ref').textContent = '— Mateus 18:20';
                
                // Salva o fallback também
                const fallback = {
                    texto: 'Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.',
                    referencia: 'Mateus 18:20'
                };
                localStorage.setItem('versiculo', JSON.stringify(fallback));
                localStorage.setItem('versiculoData', hoje);
            });
    }

    // 3. Funções do Carrossel
    let slideIndex = 0;

    function mudarSlide(n) {
        mostrarSlide(slideIndex += n);
    }

    function slideAtual(n) {
        mostrarSlide(slideIndex = n);
    }

    function mostrarSlide(n) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (n >= slides.length) { slideIndex = 0; }
        if (n < 0) { slideIndex = slides.length - 1; }
        
        slides.forEach(slide => slide.classList.remove('ativo'));
        dots.forEach(dot => dot.classList.remove('ativo'));
        
        slides[slideIndex].classList.add('ativo');
        dots[slideIndex].classList.add('ativo');
    }

    // Mudança automática a cada 5 segundos
    setInterval(() => {
        mudarSlide(1);
    }, 5000);

    // 4. CHAMADA FINAL: Executa tudo ao carregar a página
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Inicializando todas as funcionalidades...');
        
        // Lógica de URL para a mensagem de sucesso do formulário de oração
        const urlParams = new URLSearchParams(window.location.search);
        const oracaoEnviada = urlParams.get('sent') === 'true';
        const secaoOracao = urlParams.get('section') === 'oracao';

        // Inicializa versículo
        versiculoDoDia(); 
        
        // Decide qual seção mostrar ao carregar
        if (oracaoEnviada && secaoOracao) {
            mostrarSecao('oracao');
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                 successMessage.style.display = 'block';
            }
            window.history.replaceState({}, document.title, window.location.pathname + '#oracao');
        } else {
            mostrarSecao('home');
        }
    });
</script>
