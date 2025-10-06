import createPlaylist from "./utils/playlist.js";
import { 
    initializeEventListeners, 
    initializePlaylistEventListeners, 
    loadSong, 
    updatePlaylistDisplay 
} from "./application/exportfuction.js";
import {
    progress_bar,
    media,
    play_btn,
    song_img,
    lastest,
    forward
} from "./application/htmlelements.js";

const songs = [
        {
            song_name : "Oh Lord",
            artist_name: "Foxy Shazam",
            song_url: "./media/Oh Lord - Foxy Shazam.mp3",
            caratula: "./media/1-2889d68a.png"
        },
        {
            song_name : "Eres Mía",
            artist_name: "Romeo Santos",
            song_url: "./media/Romeo Santos - Eres Mía.mp3",
            caratula: "./media/ab67706c0000da84008711051208af0862d31595.jpg"
        },
        {
            song_name : "Gold",
            artist_name: "Spandau Ballet",
            song_url: "./media/Spandau Ballet- Gold.mp3",
            caratula: "./media/images.jpg"
    
        },
        {
            song_name : "Calle Ocho",
            artist_name: "Pitbull",
            song_url: "./media/I Know You Want Me (Calle Ocho).mp3",
            caratula: "./media/Pitbull_i_know_you_want_me_cover.jpg"
        },
        {
            song_name: "Cuando Calienta El Sol",
            artist_name: "Luis Miguel",
            song_url: "./media/Luis Miguel — Cuando Calienta el Sol [Letra].mp3",
            caratula: "./media/Luismi.jpg"
        },
        {
            song_name: "Que los Cumplas Feliz",
            artist_name: "Cuarteto de Nos",
            song_url: "./media/Que-los-Cumpla-Feliz.mp3",
            caratula:"./media/revista.jpg"
        },
        {
            song_name: "I Gotta Feeling",
            artist_name: "The Black Eyed Peas",
            song_url: "./media/Black Eyed Peas - I Gotta Feeling (Audio).mp3",
            caratula:"./media/gotta.jpg"
        },
        {
            song_name: "Thrift Shop",
            artist_name: "Macklemore & Ryan Lewis",
            song_url: "./media/MACKLEMORE & RYAN LEWIS - THRIFT SHOP FEAT. WANZ (OFFICIAL VIDEO).mp3",
            caratula: "./media/thrift.jpg"

        },
        {
            song_name: "Que no quede huella",
            artist_name: "Bronco",
            song_url: "./media/Bronco - Que No Quede Huella (Cover Audio).mp3",
            caratula: "./media/Bronco.jpg"
        },
    {
        song_name: "Queremos Pastel",
        artist_name: "Molotov",
        song_url:"./media/Queremos Pastel.mp3",
        caratula: "./media/DDD.jpg"
    },
    {
        song_name: "Gracias por tus Bits",
        artist_name: "HiSamHere",
        song_url:"./media/Gracias por tus bits (Original).mp3",
        caratula: "./media/GRACIAS POR TUS BITS.png"

    },
    {
        song_name: "Gangsta's Paradise",
        artist_name: "Coolio",
        song_url:"./media/Gangsta's Paradise.mp3",
        caratula: "./media/gangsta's.jpg"
    },

    ];

const last = [];

const playlist = createPlaylist(songs.length);

let playingNow;

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    console.log('Songs array:', songs);
    console.log('Initial playlist:', playlist);
    
    playingNow = playlist.pop();
    console.log('Playing now:', playingNow);
    
    loadSong(playingNow, songs, media, song_img);
    updatePlaylistDisplay(playlist, songs, playingNow, last, media, play_btn);
    
    // Inicializar event listeners del reproductor (play/pause, progreso, etc.)
    initializeEventListeners(media, progress_bar, play_btn);
    
    // Inicializar event listeners de la playlist (navegación, clicks en items, etc.)
    initializePlaylistEventListeners(media, play_btn, lastest, forward, songs, playlist, last, playingNow);
    
    console.log('App initialized successfully');
})

