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


    // 2. Função para buscar versículo da API
    function versiculoDoDia() {
        fetch('https://www.abibliadigital.com.br/api/verses/nvi/random')
            .then(response => {
                if (!response.ok) {
                    throw new Error('API retornou status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const texto = data.text;
                const referencia = data.book.name + ' ' + data.chapter + ':' + data.number;
                
                document.getElementById('versiculo-texto').textContent = '"' + texto + '"';
                document.getElementById('versiculo-ref').textContent = '— ' + referencia;
            })
            .catch(error => {
                console.error('❌ Erro na API:', error);
                
                // Fallback se API falhar
                document.getElementById('versiculo-texto').textContent = '"Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles."';
                document.getElementById('versiculo-ref').textContent = '— Mateus 18:20';
            });
    }

    // 3. Funcionalidade do Carrossel de Fotos
    function carousel() {
        const slidesContainer = document.getElementById('carouselSlides');
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        
        // Se não houver slides, não faz nada.
        if (totalSlides === 0) return; 

        // Função para mover o carrossel
        function goToSlide(index) {
            // Usa o offsetWidth do container para calcular o deslocamento correto.
            const slideWidth = slidesContainer.offsetWidth; 
            
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            
            const offset = -currentIndex * slideWidth;
            slidesContainer.style.transform = `translateX(${offset}px)`;
        }

        // Listener de Botões
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
        
        // Ajuste no redimensionamento (Para recalcular a largura do slide em caso de mudança de tela)
        window.addEventListener('resize', () => {
            goToSlide(currentIndex);
        });
        
        // Tenta avançar automaticamente a cada 5 segundos
        setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
        
        // Inicia o carrossel na posição correta
        goToSlide(0); 
    }


    // 4. CHAMADA FINAL (ÚNICA): Executa tudo ao carregar a página
    window.onload = function() {
        console.log('🚀 Inicializando todas as funcionalidades...');
        
        // Lógica de URL para a mensagem de sucesso do formulário de oração
        const urlParams = new URLSearchParams(window.location.search);
        const oracaoEnviada = urlParams.get('sent') === 'true';
        const secaoOração = urlParams.get('section') === 'oracao';

        // 1. Inicializa funcionalidades (Versículo e Carrossel)
        versiculoDoDia(); 
        carousel(); 
        
        // 2. Decide qual seção mostrar ao carregar
        if (oracaoEnviada && secaoOração) {
            mostrarSecao('oracao');
            // Exibe a mensagem de sucesso
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                 successMessage.style.display = 'block';
            }
            // Limpa o parâmetro da URL
            window.history.replaceState({}, document.title, window.location.pathname + '#oracao');
        } else {
            mostrarSecao('home'); // Se não for pedido de oração, inicia na home
        }
    };
</script>