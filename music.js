const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER_THANH_VO";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  songs: [
    {
      name: "Mong mo",
      singer: " Masew, RedT",
      path: "https://tainhac123.com/download/mong-mo-masew-ft-redt.6Izl6HpAtd9w.html",
      image: "https://avatar-ex-swe.nixcdn.com/song/2021/03/26/0/a/6/c/1616731014799_500.jpg"
    },
    {
      name: "Bạn Tình Ơi",
      singer: "Yuni Boo, Goctoi Mixer",
      path: "https://tainhac123.com/download/ban-tinh-oi-yuni-boo-ft-goctoi-mixer.ZL3N1InExMvS.html",
      image:
      "https://avatar-nct.nixcdn.com/song/2019/11/18/b/0/e/0/1574064395799.jpg"    },
    {
      name: "Ái Nộ",
      singer: "Masew,Khôi Vũ",
      path:
        "https://tainhac123.com/download/ai-no-masew-ft-khoi-vu.AyqiSaUZD9Ey.html",
      image: "https://avatar-nct.nixcdn.com/song/2021/08/30/2/1/a/e/1630316309035.jpg"
    },
    {
      name: "Cô Ấy Không Cần Tôi",
      singer: "Trường Anh,Hào Kiệt",
      path: "https://tainhac123.com/download/co-ay-khong-can-toi-truong-anh-ft-hao-kiet.lEfGXSkVYUkh.html",
      image:
        "https://avatar-nct.nixcdn.com/song/2020/09/09/d/a/0/9/1599634124508.jpg"
    },
    {
        name: "Ái Nộ",
        singer: "Masew,Khôi Vũ",
        path:
          "https://tainhac123.com/download/ai-no-masew-ft-khoi-vu.AyqiSaUZD9Ey.html",
        image: "https://avatar-nct.nixcdn.com/song/2021/08/30/2/1/a/e/1630316309035.jpg"
      },
      {
        name: "Cô Ấy Không Cần Tôi",
        singer: "Trường Anh,Hào Kiệt",
        path: "https://tainhac123.com/download/co-ay-khong-can-toi-truong-anh-ft-hao-kiet.lEfGXSkVYUkh.html",
        image:
          "https://avatar-nct.nixcdn.com/song/2020/09/09/d/a/0/9/1599634124508.jpg"
      }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                    index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
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
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xu ly cd start / stop
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // zoom use scrollY
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Onclick play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // bai hat play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // pause bai hat
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // tien do phat nhac thay doi -- cap nhat time
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Tua bai hat
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Onclick next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // turn of/on random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // repeat song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // phat het bai -> nhay qua bai tiep tuc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // xu li khi click vao song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // khi click vao song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
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
    // get config vao
    this.loadConfig();

    // Dinh nghia thuoc tinh cho object
    this.defineProperties();

    // Listening / handling events (DOM events)
    this.handleEvents();

    // Mac dinh bai hat dau tien khi run
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hien thi trang thai ban dau cua button repeat vs random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  }
};

app.start();
