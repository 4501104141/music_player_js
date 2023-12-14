/**
 * 1. Render song
 * 2. Scroll top
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
const app = {
    songs: [
        {
            name: "Cho tôi lang thang",
            singer: "Ngọt, Đen Vâu",
            path: "./assets/music/Cho-Toi-Lang-Thang-Ngot-Den.mp3",
            image: "./assets/img/ChoToiLangThang.jpg"
        },
        {
            name: "Đi Về Nhà",
            singer: "Đen x JustaTee ",
            path: "./assets/music/Di-Ve-Nha-Den-JustaTee.mp3",
            image: "./assets/img/DiVeNha.jpg"
        }
    ],
}