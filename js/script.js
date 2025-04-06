const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause");
prevBtn = wrapper.querySelector("#prev");
nextBtn = wrapper.querySelector("#next");
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close"),
musicList = wrapper.querySelector(".music-list");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb) {
    const song = allMusic[indexNumb - 1];
    if (!song) {
        console.error(`No song at index ${indexNumb}`);
        return;
    }
    musicName.innerText = song.name;
    musicArtist.innerText = song.artist;
    musicImg.src = song.img;
    mainAudio.src = song.src;
}

// play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// next music function
function nextMusic() {
    musicIndex++;
    // if musicIndex is greater than array length then musicIndex will be 1 so the first song play.
    if (musicIndex > allMusic.length) musicIndex = 1;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// prev music function
function prevMusic() {
    musicIndex--;
    // if musicIndex is less than 1 then musicIndex will be array length so the last song play.
    if (musicIndex < 1) musicIndex = allMusic.length;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicpause = wrapper.classList.contains("paused");
    // if MusicPaused is true the call pauseMisic else cell playMusic
    isMusicpause ? pauseMusic() : playMusic();
    playingNow();
});

// next button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// prev button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// update progress bar width  according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //  getting current time of song
    const duration = e.target.duration; // getting total duration of song

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { // if sec is less than 10 adding 0
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

    mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { // if sec is less than 10 adding 0
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });  
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
});

// repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // get the innerText of the icon then will change accordingly
    let getText = repeatBtn.innerText;

    // do different changes on different icon click using switch
    switch (getText) {
        case "repeat" :
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// after song ended
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat" :
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            // generating random index between the man range of array length
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randomIndex;
            } while(musicIndex == randomIndex); // this loop run until the next random number won't be the same of current music index
            musicIndex = randomIndex; // passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="audio-${i}" src="${allMusic[i].src}"></audio>
                    <span id="audio-${i}" class="audio-duration">3:16</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTag = ulTag.querySelector(`.audio-${i}`);
    let liAudioDuration = ulTag.querySelector(`#audio-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { // if sec is less than 10 adding 0
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// play song in li click
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}