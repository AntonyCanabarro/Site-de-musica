// Fundo de estrelas - igual antes 
function criarEstrelas(camada, quantidade) {
  for (let i = 0; i < quantidade; i++) {
    const estrela = document.createElement("div");
    estrela.classList.add("estrela");
    estrela.classList.add(Math.random() > 0.7 ? "grande" : "pequena");
    estrela.style.top = `${Math.random() * 100}vh`;
    estrela.style.left = `${Math.random() * 100}vw`;
    const delayPiscar = (Math.random() * 3).toFixed(2);
    const delayMover = (Math.random() * 6).toFixed(2);
    estrela.style.animationDelay = `${delayPiscar}s, ${delayMover}s`;
    camada.appendChild(estrela);
  }
}

const camada1 = document.getElementById("camada1");
const camada2 = document.getElementById("camada2");
criarEstrelas(camada1, 100);
criarEstrelas(camada2, 80);

// Player
const audioPlayer = document.getElementById("audioPlayer");
const musicaAtual = document.getElementById("musica-atual");

// Playlists
const listaPlaylists = document.getElementById("listaPlaylists");
const botaoCriar = document.getElementById("btnCriarPlaylist");

// array de objetos {nome: string, musicas: array de musicas}
const playlistsCriadas = []; 

// Playlist selecionada atualmente
let playlistSelecionada = null;

// Músicas disponíveis no site
const musicasDisponiveis = [
  { nome: "estilo cachorro", caminho: "audio/11.mp3" },
  { nome: "ela", caminho: "audio/ela.mp3" },
  { nome: "ligando os fatos", caminho: "audio/ligando os fatos.mp3" },
  { nome: "para tudo", caminho: "audio/para tudo.mp3" },
  { nome: "luxo no morro", caminho: "audio/luxo no morro.mp3" },
  { nome: "perdoa por tudo", caminho: "audio/perdoa por tudo.mp3" },
  { nome: "vida chique", caminho: "audio/vida chique.mp3" },
  { nome: "mandraka", caminho: "audio/mandraka.mp3" },
  { nome: "confissoes pt1", caminho: "audio/confissoes pt1.mp3" },
  { nome: "confisoes pt2", caminho: "audio/confissoes pt2.mp3" },
];

// Elementos UI
const barraBusca = document.getElementById("barraBusca");
const resultadosBusca = document.getElementById("resultadosBusca");
const playlistDetalhes = document.getElementById("playlistDetalhes");
const musicasPlaylist = document.getElementById("musicasPlaylist");

// Criar nova playlist
botaoCriar.addEventListener("click", () => {
  const nome = prompt("Nome da nova playlist:");
  if (!nome || nome.trim() === "") {
    alert("Nome inválido.");
    return;
  }
  if (playlistsCriadas.some((p) => p.nome === nome)) {
    alert("Você já criou uma playlist com esse nome.");
    return;
  }

  const novaPlaylist = {
    nome,
    musicas: [],
  };

  playlistsCriadas.push(novaPlaylist);
  atualizarListaPlaylists();
});

// Atualiza lista lateral de playlists
function atualizarListaPlaylists() {
  listaPlaylists.innerHTML = "";
  playlistsCriadas.forEach((playlist, index) => {
    const div = document.createElement("div");
    div.classList.add("playlist");
    div.textContent = playlist.nome;
    div.onclick = () => {
      playlistSelecionada = playlist;
      mostrarDetalhesPlaylist();
      atualizarListaPlaylists(); 
    };
    if (playlistSelecionada && playlistSelecionada.nome === playlist.nome) {
      div.style.backgroundColor = "#3b3b5a";
    }
    listaPlaylists.appendChild(div);
  });
}

// Mostra músicas da playlist selecionada
function mostrarDetalhesPlaylist() {
  if (!playlistSelecionada) {
    playlistDetalhes.querySelector("h2").textContent =
      "Selecione uma playlist";
    musicasPlaylist.innerHTML = "";
    return;
  }
  playlistDetalhes.querySelector("h2").textContent =
    `Playlist: ${playlistSelecionada.nome}`;

  musicasPlaylist.innerHTML = "";
  if (playlistSelecionada.musicas.length === 0) {
    musicasPlaylist.innerHTML = "<li>Esta playlist está vazia.</li>";
    return;
  }

  playlistSelecionada.musicas.forEach((musica, i) => {
    const li = document.createElement("li");
    li.textContent = musica.nome;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "x";
    btnRemover.classList.add("remover");
    btnRemover.title = "Remover música da playlist";

    btnRemover.onclick = (e) => {
      e.stopPropagation();
      playlistSelecionada.musicas.splice(i, 1);
      mostrarDetalhesPlaylist();
    };

    li.appendChild(btnRemover);

    li.onclick = () => {
      audioPlayer.src = musica.caminho;
      audioPlayer.play();
      musicaAtual.textContent = musica.nome;
    };

    musicasPlaylist.appendChild(li);
  });
}

// Buscar música e mostrar resultados com botão de adicionar na playlist
barraBusca.addEventListener("input", () => {
  const termo = barraBusca.value.toLowerCase();
  resultadosBusca.innerHTML = "";

  if (termo === "") return;

  const resultados = musicasDisponiveis.filter((m) =>
    m.nome.toLowerCase().includes(termo)
  );

  resultados.forEach((musica) => {
    const li = document.createElement("li");
    li.textContent = musica.nome;

    // Botão adicionar só se playlist selecionada
    if (playlistSelecionada) {
      const btnAdicionar = document.createElement("button");
      btnAdicionar.textContent = "+";
      btnAdicionar.classList.add("adicionar");
      btnAdicionar.title = "Adicionar música na playlist";

      btnAdicionar.onclick = (e) => {
        e.stopPropagation();

        // Verifica se já existe na playlist para não repetir
        const existe = playlistSelecionada.musicas.some(
          (m) => m.nome === musica.nome
        );
        if (existe) {
          alert("Música já existe na playlist!");
          return;
        }

        playlistSelecionada.musicas.push(musica);
        mostrarDetalhesPlaylist();
      };

      li.appendChild(btnAdicionar);
    }

    li.onclick = () => {
      audioPlayer.src = musica.caminho;
      audioPlayer.play();
      musicaAtual.textContent = musica.nome;
      resultadosBusca.innerHTML = "";
      barraBusca.value = musica.nome;
    };

    resultadosBusca.appendChild(li);
  });
});

// Inicializa a interface
atualizarListaPlaylists();
mostrarDetalhesPlaylist();
audioPlayer.addEventListener("ended", () => {
  if (!playlistSelecionada) return;

  const musicas = playlistSelecionada.musicas;
  if (musicas.length === 0) return;

  const srcAtual = decodeURIComponent(audioPlayer.src.split("/").pop());
  const indiceAtual = musicas.findIndex(m => m.caminho.endsWith(srcAtual));

  if (indiceAtual === -1) return;

  const proximoIndice = (indiceAtual + 1) % musicas.length;
  const proxMusica = musicas[proximoIndice];

  audioPlayer.src = proxMusica.caminho;
  audioPlayer.play();
  musicaAtual.textContent = proxMusica.nome;
});

const barraProgresso = document.getElementById("barraProgresso");
const tempoAtualSpan = document.getElementById("tempoAtual");
const tempoTotalSpan = document.getElementById("tempoTotal");

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min}:${seg < 10 ? "0" + seg : seg}`;
}

// Atualiza tempo e barra durante a música
audioPlayer.addEventListener("timeupdate", () => {
  const porcentagem = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  barraProgresso.value = porcentagem || 0;
  tempoAtualSpan.textContent = formatarTempo(audioPlayer.currentTime);
  tempoTotalSpan.textContent = formatarTempo(audioPlayer.duration || 0);

  // Atualiza o fundo da barra com o rastro branco
  barraProgresso.style.background = `linear-gradient(to right, white ${porcentagem}%, #444 ${porcentagem}%)`;
});


// Permite que o usuário altere o tempo da música e botoes de play
barraProgresso.addEventListener("input", () => {
  const novoTempo = (barraProgresso.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = novoTempo;
});
const btnPlayPause = document.getElementById("btnPlayPause");
const iconePlayPause = btnPlayPause.querySelector("i");

btnPlayPause.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    iconePlayPause.className = "bi bi-pause-circle-fill";
  } else {
    audioPlayer.pause();
    iconePlayPause.className = "bi bi-play-circle-fill";
  }
});
barraBusca.addEventListener("focus", () => {
  barraBusca.value = "";
  resultadosBusca.innerHTML = "";
});
 const barraBusca2 = document.getElementById("barraBusca");
    const resultadosBusca2 = document.getElementById("resultadosBusca");

    barraBusca.addEventListener("focus", () => {
      barraBusca.value = "";
      resultadosBusca.innerHTML = "";
    });
    