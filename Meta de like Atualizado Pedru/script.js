const apiKey = 'AIzaSyBogJ7e5sE1t5lmkInx3f_seUiZvZhLfzM';
const channelId = 'UCelt4WcJSUl7kY_EE8h5CvQ'; // Substitua pelo ID do canal
let likeGoal = 500; // Meta inicial de likes
let currentVideoId = null; // Variável para armazenar o ID do vídeo ao vivo

// Setar meta inicial no HTML
document.getElementById('like-goal-text').innerText = likeGoal;

// Função para verificar se o canal está ao vivo e retornar o ID do vídeo
async function isChannelLive() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId; // Retorna o ID da primeira live encontrada
        } else {
            console.log('Nenhuma live encontrada.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao verificar live:', error);
        return null;
    }
}

// Função para buscar a contagem de likes do vídeo
async function getLikeCount(videoId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const likes = parseInt(data.items[0].statistics.likeCount, 10);
            document.getElementById('like-count').innerText = likes; // Atualiza a contagem de likes no HTML

            // Atualiza a barra de progresso com base nos likes
            updateProgressBar(likes);

            // Verifica se a meta de likes foi alcançada
            if (likes >= likeGoal) {
                likeGoal *= 2; // Dobra a meta
                document.getElementById('like-goal-text').innerText = likeGoal; // Atualiza a meta no HTML
                alert(`Meta de likes atingida! Nova meta: ${likeGoal}`); // Alerta ao usuário
            }
        } else {
            console.log('Nenhum dado disponível para o vídeo.');
        }
    } catch (error) {
        console.error('Erro ao buscar contagem de likes:', error);
    }
}

// Função para atualizar a barra de progresso
function updateProgressBar(likes) {
    const progressBar = document.getElementById('progress-bar');
    const progress = Math.min((likes / likeGoal) * 100, 100); // Calcula a porcentagem, limitando a 100%
    progressBar.style.width = progress + '%'; // Atualiza a largura da barra
}

// Função principal que verifica se há uma live e atualiza as curtidas
async function checkAndUpdateLiveStatus() {
    const videoId = await isChannelLive(); // Verifica se o canal está ao vivo

    if (videoId && videoId !== currentVideoId) {
        console.log('O canal está ao vivo! ID da live:', videoId);
        currentVideoId = videoId; // Atualiza o ID do vídeo atual
    }

    // Atualiza as curtidas da live atual
    if (currentVideoId) {
        await getLikeCount(currentVideoId);
    }
}

// Nova função para verificar se está ao vivo ao clicar no botão
function checkLiveStatus() {
    // Chama a função para verificar se o canal está ao vivo
    checkAndUpdateLiveStatus();

    // Oculta o botão após o clique
    const checkLiveBtn = document.getElementById('check-live-btn');
    checkLiveBtn.style.display = 'none';

    // Continua a verificação e atualização dos likes a cada 15 segundos
    setInterval(checkAndUpdateLiveStatus, 15000);
}
