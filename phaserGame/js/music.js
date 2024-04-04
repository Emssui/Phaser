class Music {
    constructor() {
      
    }

    preload() {
        this.load.audio('song', 'assets/audios/song.mp3');
    }

    create() {
        this.music = this.sound.add('song', { loop: true });
        this.music.play();
    }
}

const music = new Music ();
