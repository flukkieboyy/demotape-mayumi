/* =========================================
   1. CONFIGURATION (ตั้งค่าเพลงที่นี่)
   ========================================= */
const tapeData = {
    A: [
        { title: "01. ฉันก็รู้ดี freestyle (prod. drippxyblue)", src: "music/a1_ฉันก็รู้ดี_freestyle.mp3" },
        { title: "02. ฉันน่าจะบอกเธอไป (prod. jeuxee)", src: "music/a2_ฉันน่าจะบอกเธอไป.mp3" }
    ],
    B: [
        { title: "03. ผ่านมานาน (prod. shxbu)", src: "music/b1_ไม่มีใครดีกว่าเธอเลย" },
        { title: "04. ไม่มีใครดีกว่าเธอเลย (prod. 4lexf)", src: "music/b2_ไม่มีใครดีกว่าเธอเลย" }
    ]
};

/* =========================================
   2. VARIABLES
   ========================================= */
let currentSide = 'A';
let trackIndex = 0;
let isPlaying = false;

// DOM Elements
const audio = document.getElementById('audio-player');
const introScreen = document.getElementById('intro-screen');
const mainStage = document.getElementById('main-stage');
const cassette = document.getElementById('cassette');
const statusText = document.getElementById('status-text');
const playBtn = document.getElementById('play-btn');
const reelsA = document.querySelector('.reels-container.a-side');
const reelsB = document.querySelector('.reels-container.b-side');

/* =========================================
   3. INTRO SEQUENCE
   ========================================= */
window.onload = () => {
    // รอให้ผู้ใช้กดปุ่มเพื่อเข้าสู่หน้าเว็บ
    const enterBtn = document.getElementById('enter-btn');
    
    enterBtn.addEventListener('click', () => {
        // Fade Out Intro
        introScreen.style.opacity = '0';
        
        setTimeout(() => {
            introScreen.style.display = 'none';
            // Fade In Main Stage
            mainStage.classList.add('active');
            
            // เริ่มต้นระบบ
            renderTrackButtons();
        }, 1500); // รอ transition จบ
    });
};

/* =========================================
   4. PLAYER FUNCTIONS
   ========================================= */

// สร้างปุ่ม Track ตามข้อมูลใน tapeData
function renderTrackButtons() {
    const container = document.getElementById('track-list');
    container.innerHTML = '';
    
    const tracks = tapeData[currentSide];
    
    tracks.forEach((track, index) => {
        const btn = document.createElement('button');
        btn.classList.add('track-btn');
        btn.innerText = (index + 1); // เลขแทร็ก 1, 2
        
        // ถ้าเป็นเพลงปัจจุบัน ให้ใส่ class active
        if (index === trackIndex) btn.classList.add('active');
        
        btn.onclick = () => playSpecificTrack(index);
        container.appendChild(btn);
    });
}

function playSpecificTrack(index) {
    trackIndex = index;
    loadAndPlay();
}

function loadAndPlay() {
    const track = tapeData[currentSide][trackIndex];
    
    // ตั้งค่า source เพลง
    audio.src = track.src;
    audio.play();
    
    isPlaying = true;
    updateUI();
}

function togglePlay() {
    // ถ้ายังไม่ได้โหลดเพลง ให้โหลดเพลงแรก
    if (!audio.src) {
        playSpecificTrack(0);
        return;
    }

    if (audio.paused) {
        audio.play();
        isPlaying = true;
    } else {
        audio.pause();
        isPlaying = false;
    }
    updateUI();
}

function flipCassette() {
    // หยุดเพลง
    audio.pause();
    isPlaying = false;
    updateUI();

    // เริ่ม Animation กลับด้าน
    cassette.classList.toggle('flipped');
    statusText.innerText = "FLIPPING TAPE...";
    
    // เปลี่ยนตรรกะด้าน A/B
    currentSide = (currentSide === 'A') ? 'B' : 'A';
    trackIndex = 0; // รีเซ็ตไปเพลงแรก
    audio.src = ""; // ล้าง source เพลงเก่า

    // รอให้ Animation พลิกเสร็จ (0.8s)
    setTimeout(() => {
        statusText.innerText = `SIDE ${currentSide} READY`;
        renderTrackButtons();
    }, 800);
}

function updateUI() {
    const track = tapeData[currentSide][trackIndex];
    
    // 1. Text Status
    if (isPlaying) {
        statusText.innerText = `PLAYING: ${track.title}`;
        playBtn.innerText = "|| PAUSE";
    } else {
        statusText.innerText = audio.src ? "PAUSED" : `SIDE ${currentSide} READY`;
        playBtn.innerText = "▶ PLAY";
    }

    // 2. Reels Animation (หมุนเฉพาะด้านที่ active)
    const activeReels = currentSide === 'A' ? reelsA : reelsB;
    const inactiveReels = currentSide === 'A' ? reelsB : reelsA;
    
    inactiveReels.classList.remove('playing'); // ด้านหลังหยุดเสมอ
    
    if (isPlaying) {
        activeReels.classList.add('playing');
    } else {
        activeReels.classList.remove('playing');
    }

    // 3. Update Buttons Active State
    const buttons = document.querySelectorAll('.track-btn');
    buttons.forEach((btn, idx) => {
        if (idx === trackIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

/* =========================================
   5. EVENTS
   ========================================= */

// เล่นเพลงถัดไปอัตโนมัติเมื่อจบ
audio.addEventListener('ended', () => {
    if (trackIndex < tapeData[currentSide].length - 1) {
        // ถ้ายังมีเพลงถัดไปในหน้านี้
        playSpecificTrack(trackIndex + 1);
    } else {
        // ถ้าหมดหน้าแล้ว
        isPlaying = false;
        updateUI();
        statusText.innerText = "END OF SIDE";
    }
});