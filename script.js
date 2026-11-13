
/* =================================
   STRIPPED — ORIGINAL ALBUM (2002)
   20 TRACKS
================================= */

const audio = document.getElementById("album-audio");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const songTitle = document.getElementById("song-title");


/* =================================
   LISTA COMPLETA DEL ÁLBUM
================================= */

const tracks = [
    { title: "Stripped Intro", file: "assets/audio/01-stripped-intro.mp3" },
    { title: "Can't Hold Us Down", file: "assets/audio/02-cant-hold-us-down.mp3" },
    { title: "Walk Away", file: "assets/audio/03-walk-away.mp3" },
    { title: "Fighter", file: "assets/audio/04-fighter.mp3" },
    { title: "Primer Amor Interlude", file: "assets/audio/05-primer-amor-interlude.mp3" },
    { title: "Infatuation", file: "assets/audio/06-infatuation.mp3" },
    { title: "Loves Embrace Interlude", file: "assets/audio/07-loves-embrace-interlude.mp3" },
    { title: "Loving Me 4 Me", file: "assets/audio/08-loving-me-4-me.mp3" },
    { title: "Impossible", file: "assets/audio/09-impossible.mp3" },
    { title: "Underappreciated", file: "assets/audio/10-underappreciated.mp3" },
    { title: "Beautiful", file: "assets/audio/11-beautiful.mp3" },
    { title: "Make Over", file: "assets/audio/12-make-over.mp3" },
    { title: "Cruz", file: "assets/audio/13-cruz.mp3" },
    { title: "Soar", file: "assets/audio/14-soar.mp3" },
    { title: "Get Mine, Get Yours", file: "assets/audio/15-get-mine-get-yours.mp3" },
    { title: "Dirrty", file: "assets/audio/16-dirrty.mp3" },
    { title: "Stripped Pt. 2", file: "assets/audio/17-stripped-pt-2.mp3" },
    { title: "The Voice Within", file: "assets/audio/18-the-voice-within.mp3" },
    { title: "I'm OK", file: "assets/audio/19-im-ok.mp3" },
    { title: "Keep On Singin' My Song", file: "assets/audio/20-keep-on-singin-my-song.mp3" }
];

let currentTrack = null;


/* =================================
   SELECCIÓN ALEATORIA
================================= */

function selectRandomTrack() {

    const availableTracks = tracks.filter(
        track => track !== currentTrack
    );

    const randomIndex = Math.floor(
        Math.random() * availableTracks.length
    );

    currentTrack = availableTracks[randomIndex];

    audio.src = currentTrack.file;

    if (songTitle) {
        songTitle.textContent = currentTrack.title;
    }
}


/* =================================
   REPRODUCIR MÚSICA
================================= */

async function playMusic() {

    if (!currentTrack) {
        selectRandomTrack();
    }

    try {

        await audio.play();

        if (songTitle) {
            songTitle.textContent = currentTrack.title;
        }

    } catch (error) {

        if (songTitle) {
            songTitle.textContent =
                currentTrack.title + " · TAP PLAY";
        }

    }
}


/* =================================
   PAUSAR MÚSICA
================================= */

function pauseMusic() {
    audio.pause();
}


/* =================================
   CONTROLES DEL REPRODUCTOR
================================= */

if (playButton) {

    playButton.addEventListener("click", () => {

        if (audio.ended) {
            selectRandomTrack();
        }

        playMusic();

    });

}

if (pauseButton) {
    pauseButton.addEventListener("click", pauseMusic);
}


/* =================================
   AL TERMINAR UNA CANCIÓN
================================= */

audio.addEventListener("ended", () => {

    selectRandomTrack();
    playMusic();

});


/* =================================
   CANCIÓN INICIAL
   SIN REPRODUCCIÓN AUTOMÁTICA
================================= */

selectRandomTrack();


/* =================================
   EXPULSIÓN Y GIRO DEL CD
================================= */

const disc = document.querySelector(".disc");

if (disc) {

    const EJECT_DELAY = 450;
    const EJECT_DURATION = 1650;

    let discAnimationStarted = false;

    function startDiscSpinning() {

        if (discAnimationStarted) return;

        discAnimationStarted = true;

        disc.classList.remove("ejecting");

        /*
           Fuerza al navegador a reconocer
           el cambio entre las dos animaciones.
        */
        void disc.offsetWidth;

        disc.classList.add("spinning");

    }

    function ejectDisc() {

        if (discAnimationStarted) return;

        disc.classList.remove("spinning");
        disc.classList.add("ejecting");

        /*
           Respaldo por si el navegador móvil
           no dispara animationend.
        */
        setTimeout(
            startDiscSpinning,
            EJECT_DURATION + 150
        );

    }

    window.addEventListener("load", () => {

        setTimeout(ejectDisc, EJECT_DELAY);

    });

    disc.addEventListener("animationend", (event) => {

        if (
            event.animationName === "discEject" ||
            event.animationName === "mobileDiscEject"
        ) {
            startDiscSpinning();
        }

    });

}


/* =================================
   FUNDA 3D — ARRASTRE LIBRE
================================= */

const albumCover = document.getElementById("album-cover");
const coverInner = document.getElementById("cover-inner");

let isDragging = false;

let startX = 0;
let startY = 0;

let startRotationY = 0;
let startRotationX = 0;

let currentRotationY = 0;
let currentRotationX = 0;

let activePointerId = null;


/* =================================
   SENSIBILIDAD DEL MOVIMIENTO
================================= */

const HORIZONTAL_SENSITIVITY = 0.38;
const VERTICAL_SENSITIVITY = 0.18;

const MAX_VERTICAL_TILT = 8;


/* =================================
   APLICAR ROTACIÓN
================================= */

function updateRotation(rotationY, rotationX) {

    currentRotationY = rotationY;

    currentRotationX = Math.max(
        -MAX_VERTICAL_TILT,
        Math.min(MAX_VERTICAL_TILT, rotationX)
    );

    coverInner.style.transform =
        `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

}


/* =================================
   EVITAR ARRASTRE NATIVO DE IMÁGENES
================================= */

if (albumCover) {

    albumCover.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });

}


/* =================================
   INICIAR ARRASTRE
================================= */

if (albumCover && coverInner) {

    albumCover.addEventListener("pointerdown", (event) => {

        if (event.target.closest(".qr-hotspot")) {
            return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        event.preventDefault();

        isDragging = true;
        activePointerId = event.pointerId;

        startX = event.clientX;
        startY = event.clientY;

        startRotationY = currentRotationY;
        startRotationX = currentRotationX;

        albumCover.classList.add("dragging");

        albumCover.setPointerCapture(event.pointerId);

    });


    /* =================================
       MOVIMIENTO DE LA FUNDA
    ================================= */

    albumCover.addEventListener("pointermove", (event) => {

        if (!isDragging) return;

        if (event.pointerId !== activePointerId) return;

        event.preventDefault();

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        const newRotationY =
            startRotationY + deltaX * HORIZONTAL_SENSITIVITY;

        const newRotationX =
            startRotationX - deltaY * VERTICAL_SENSITIVITY;

        updateRotation(newRotationY, newRotationX);

    });


    /* =================================
       SOLTAR Y ACOMODAR LA FUNDA
    ================================= */

    function finishDragging() {

        if (!isDragging) return;

        isDragging = false;

        albumCover.classList.remove("dragging");

        activePointerId = null;

        const nearestFace =
            Math.round(currentRotationY / 180) * 180;

        updateRotation(nearestFace, 0);

    }


    /* =================================
       EVENTOS DEL PUNTERO
    ================================= */

    albumCover.addEventListener("pointerup", finishDragging);

    albumCover.addEventListener("pointercancel", finishDragging);

    albumCover.addEventListener("lostpointercapture", () => {

        if (isDragging) {
            finishDragging();
        }

    });


    /* =================================
       CONTROL CON TECLADO
    ================================= */

    albumCover.addEventListener("keydown", (event) => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            const nearestFace =
                Math.round(currentRotationY / 180) * 180;

            updateRotation(nearestFace + 180, 0);

        }

    });

}
