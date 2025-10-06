// Elementos HTML del reproductor de música según el index.html actual

// Controles de reproducción
export const progress_bar = document.getElementById("progress");
export const media = document.getElementById("media");
export const play_btn = document.getElementById("play");
export const lastest = document.getElementById("lastest");
export const forward = document.getElementById("forward");

// Elementos de información de la canción
export const song_img = document.getElementById("song-img");
export const title = document.getElementById("title");
export const artist = document.getElementById("artist");

// Contenedores de la playlist
export const playlist_container = document.querySelector('.playlist');
export const playlist_section = document.querySelector('.playlist-section');

// Elementos adicionales que podrían ser útiles
export const app_container = document.querySelector('.app-container');
export const main_content = document.querySelector('.main-content');
export const current_player = document.querySelector('.current-player');

progress_bar.max = 100;
progress_bar.value = 0;
if(!play_btn.classList.contains("pause")){
        play_btn.innerHTML = "<span>▶</span>";
    }