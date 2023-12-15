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
const heading = $('header h2');
const audio = $('#audio');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const player = $('.player')
const playBtn = $('.btn-toggle-play');
const progress = $('#progress')
const app = {
    currentIndex: 0,
    isPlaying: false,
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
    render: function () {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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
        $('.playlist').innerHTML = htmls.join('');
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
        }
        //When song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
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
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function () {
        //Defind properties for object
        this.defineProperties();
        //Upload to UI
        this.loadCurrentSong();
        //Listen and handle event
        this.handleEvents();
        //Render playlist
        this.render();
    }
}
app.start();