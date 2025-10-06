//* Logica del reproductor//
import {media} from "../application/htmlelements.js";
export default {
    _pastSongs: [],
    _nextSongs: [],
    _controler: media,
    _progressBar: document.getElementById("progress"),
    initializePlayer(){
        this._progressBar.max = 100;
        this._progressBar.value = 0;
        this.initializeControlMedia(false);
        this._controler.addEventListener('loadedmetadata', this._updateProgressBar.bind(this));
    },
    
    initializeProgressBar: function() {
        this._progressBar.addEventListener('input', () => {
            this._controler.currentTime = (this._progressBar.value/100) * this._controler.duration;
        });
    },
   
    _updateProgressBar: function() {
        const progress_value = (this._controler.currentTime / this._controler.duration) * 100;
        this._progressBar.value = progress_value;
    },
   
   
    initializeControlMedia: function(play){
        this._progressBar.value = 0;
        if (play){
            this._controler.play();
        }
    },

    getNextSong: function(){
        return this._nextSongs.pop();
    },

    getPastSong: function(){
        return this._pastSongs.pop();
    },

    addToPast: function(song){
        this._pastSongs.push(song);
    },
    
    addToNext: function(song){
        this._nextSongs.push(song);
    },
    
    hasNextSong: function(){
        return this._nextSongs.length > 0;
    },
    
    hasPastSong: function(){
        return this._pastSongs.length > 0;
    }
}