/**
 * 1. Render song -> Done
 * 2. Scroll top -> Done
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'MINH_PLAYER';
const heading = $('header h2');
const audio = $('#audio');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const player = $('.player')
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Cho tôi lang thang",
            singer: "Ngọt, Đen Vâu",
            path: "./assets/music/ChoToiLangThangNgotDen.mp3",
            image: "./assets/img/ChoToiLangThang.jpg"
        },
        {
            name: "Đi Về Nhà",
            singer: "Đen x JustaTee ",
            path: "./assets/music/DiVeNhaDenJustaTee.mp3",
            image: "./assets/img/DiVeNha.jpg"
        },
        {
            name: "để tôi ôm em bằng giai điệu này",
            singer: "Kai Đinh",
            path: "./assets/music/DeToiOmEmBangGiaiDieuNay.mp3",
            image: "./assets/img/DeToiOmEmBangGiaiDieuNay.jpg"
        },
        {
            name: "Phố đã lên đền",
            singer: "Masew",
            path: "./assets/music/PhoDaLenDenMasewRemix.mp3",
            image: "./assets/img/PhoDaLenDen.jpg"
        },
        {
            name: "Gác lại âu lo",
            singer: "DaLab",
            path: "./assets/music/GacLaiAuLoDaLABMiuLe.mp3",
            image: "./assets/img/GacLaiAuLo.jpg"
        },
        {
            name: "Có hẹn với thanh xuân",
            singer: "Monstar",
            path: "./assets/music/CoHenVoiThanhXuan.mp3",
            image: "./assets/img/CoHenVoiThanhXuan.jpg"
        },
        {
            name: "Nàng thơ",
            singer: "Hoàng Dũng",
            path: "./assets/music/NangThoHoangDung.mp3",
            image: "./assets/img/NangTho.jpg"
        },
        {
            name: "Răng khôn",
            singer: "Phí Phương Anh",
            path: "./assets/music/RangKhonPhiPhuongAnhRIN9.mp3",
            image: "./assets/img/RangKhonPhiPhuongAnh.jpg"
        },
        {
            name: "Ngày mai em đi",
            singer: "Soobin",
            path: "./assets/music/NgayMaiEmDiTouliverMixTouliver.mp3",
            image: "./assets/img/NgayMaiEmDi.jpg"
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;
        //Handle CD rotate and pause
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        //Handle scroll
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //When song play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //When song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //Handle when click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //When process song is playing
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPresent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPresent;
            }
        }
        //When rewind the song
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        }
        //When next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //When prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //When random song
        randomBtn.onclick = function () {
            if (_this.isRandom) { _this.isRandom = false; }
            else { _this.isRandom = true; }
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Handle repeat song
        repeatBtn.onclick = function () {
            if (_this.isRepeat) { _this.isRepeat = false; }
            else { _this.isRepeat = true; }
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Handle next song when end.
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //Listen click on playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                //Handle click song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Handle click option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        if (this.currentIndex <= 3) {
            setTimeout(() => { $('.song.active').scrollIntoView({ behavior: "smooth", block: "end" }) }, 300)
        } else {
            setTimeout(() => { $('.song.active').scrollIntoView({ behavior: "smooth", block: "nearest" }) }, 300)
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        if (this.config.isRandom !== undefined) {
            this.isRandom = this.config.isRandom;
        }
        if (this.config.isRepeat !== undefined) {
            this.isRepeat = this.config.isRepeat;
        }
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        //Load config to object
        this.loadConfig();
        //Defind properties for object
        this.defineProperties();
        //Upload to UI
        this.loadCurrentSong();
        //Listen and handle event
        this.handleEvents();
        //Render playlist
        this.render();
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }
}
app.start();