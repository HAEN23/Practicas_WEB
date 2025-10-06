// Event Listeners para el reproductor de música

// Función para inicializar todos los event listeners básicos del reproductor
export function initializeEventListeners(media, progress_bar, play_btn) {
    
    // Event listener para cuando se cargan los metadatos del audio
    media.addEventListener('loadedmetadata', () => {
        progress_bar.max = 100;
        progress_bar.value = 0;
        
        // Asegurar que el botón tenga el icono correcto al cargar
        if(!play_btn.classList.contains("pause")){
            play_btn.innerHTML = "<span>▶</span>";
        }
        
        if(play_btn.classList.contains("pause")){
            media.play();
        }
    });

    // Event listener para actualizar la barra de progreso
    media.ontimeupdate = function updateProgressBar() {
        const progress_value = (this.currentTime / this.duration) * 100;
        progress_bar.value = progress_value;
    }

    // Event listener para la barra de progreso (cuando el usuario la mueve)
    progress_bar.oninput = function() {
        media.currentTime = (this.value/100) * media.duration;
    }

    // Event listener para botón play/pause
    play_btn.addEventListener("click", () => playPause(media, play_btn));
}

// Función para inicializar event listeners de la playlist y navegación
export function initializePlaylistEventListeners(media, play_btn, lastest, forward, songs, playlist, last, playingNowRef) {
    let playingNow = playingNowRef;
    const song_img = document.getElementById("song-img");

    // Event listener para cuando termina una canción (navegar automáticamente)
    media.addEventListener('ended', () => {
        if(playlist.length > 0) {
            last.push(playingNow);
            playingNow = playlist.pop();
            loadSong(playingNow, songs, media, song_img);
            updatePlaylistDisplay(playlist, songs, playingNow, last, media, play_btn);
            // Reproducir automáticamente la siguiente canción
            setTimeout(() => {
                media.play();
                play_btn.classList.remove("play");
                play_btn.classList.add("pause");
                play_btn.innerHTML = "<span>⏸</span>";
            }, 100);
        } else {
            // Si no hay más canciones, pausar y resetear el botón
            play_btn.classList.remove("pause");
            play_btn.classList.add("play");
            play_btn.innerHTML = "<span>▶</span>";
        }
    });

    // Event listener para botón anterior (navegar en playlist)
    lastest.addEventListener('click', function(){
        if(!last.length == 0){
            playlist.push(playingNow);
            playingNow = last.pop();
            loadSong(playingNow, songs, media, song_img);
            updatePlaylistDisplay(playlist, songs, playingNow, last, media, play_btn);
        }
    });

    // Event listener para botón siguiente (navegar en playlist)
    forward.addEventListener('click', function(){
        if(!playlist.length == 0){
            last.push(playingNow);
            playingNow = playlist.pop();
            loadSong(playingNow, songs, media, song_img);
            updatePlaylistDisplay(playlist, songs, playingNow, last, media, play_btn);
        }
    });
}

// Función para reproducir/pausar
export function playPause(media, play_btn){
    if(play_btn.classList.contains("pause")){
        media.pause();
        play_btn.classList.remove("pause");
        play_btn.classList.add("play");
        play_btn.innerHTML = "<span>▶</span>"
    }else{
        media.play();
        play_btn.classList.remove("play");
        play_btn.classList.add("pause");
        play_btn.innerHTML = "<span>⏸</span>";
    }
}

// Función para cargar una canción
export function loadSong(i, songs, media, song_img){
    const title = document.getElementById("title");
    const artist = document.getElementById("artist");

    const now = songs[i];

    media.src = now.song_url;
    title.innerText = now.song_name;
    artist.innerText = now.artist_name;
    song_img.src = now.caratula;
}

// Función para actualizar la visualización de la playlist
export function updatePlaylistDisplay(playlist, songs, playingNow, last, media, play_btn) {
    const playlistContainer = document.querySelector('.playlist');
    if (!playlistContainer) {
        console.error('Playlist container not found!');
        return;
    }
    
    playlistContainer.innerHTML = '';
    const song_img = document.getElementById("song-img");
    
    // Mostrar las próximas canciones en la playlist
    playlist.forEach((songIndex, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        playlistItem.innerHTML = `
            <div>
                <span class="song-name">${songs[songIndex].song_name}</span>
                <div style="font-size: 14px; color: #b3b3b3; margin-top: 5px;">${songs[songIndex].artist_name}</div>
            </div>
        `;
        
        // Agregar evento click para reproducir la canción desde la playlist
        playlistItem.addEventListener('click', () => {
            // Mover la canción actual a "last"
            last.push(playingNow);
            
            // Remover la canción seleccionada de la playlist
            const selectedSongIndex = playlist.splice(index, 1)[0];
            playingNow = selectedSongIndex;
            
            // Cargar y reproducir la canción seleccionada
            loadSong(playingNow, songs, media, song_img);
            
            // Actualizar la playlist después de un pequeño delay
            setTimeout(() => {
                updatePlaylistDisplay(playlist, songs, playingNow, last, media, play_btn);
            }, 10);
            
            // Reproducir automáticamente la nueva canción
            setTimeout(() => {
                media.play();
                play_btn.classList.remove("play");
                play_btn.classList.add("pause");
                play_btn.innerHTML = "<span>⏸</span>";
            }, 100);
        });
        
        playlistContainer.appendChild(playlistItem);
    });
    
    // Si no hay más canciones en la playlist, mostrar mensaje
    if (playlist.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('playlist-item', 'empty');
        emptyMessage.innerHTML = '<span class="song-name">No hay más canciones en la cola</span>';
        playlistContainer.appendChild(emptyMessage);
    }
}
