document.addEventListener("DOMContentLoaded", () => {
    // กำหนดรหัสผ่านเข้าเว็บ
    const SECRET_PASSWORD = "mayumi";

    // กำหนดไฟล์เพลง หน้าละ 2 เพลง (ใส่ชื่อไฟล์ของคุณลงไปแทนที่ได้เลย)
    const TRACKS = {
        A: ['a1_ฉันก็รู้ดี_freestyle.mp3', 'a2_ฉันน่าจะบอกเธอไป.mp3'],
        B: ['b1_ไม่มีใครดีกว่าเธอเลย.mp3', 'b2_ไม่มีใครดีกว่าเธอเลย.mp3']
    };
    
    const audioPlayer = new Audio();
    let currentSide = 'A';
    let currentTrackIndex = 0; // 0 = เพลงแรก, 1 = เพลงที่สอง
    let isPlaying = false;

    // Elements
    const introScreen = document.getElementById('intro-screen');
    const loadingSection = document.getElementById('loading-section');
    const progressFill = document.getElementById('progress-fill');
    const passwordSection = document.getElementById('password-section');
    const passcodeInput = document.getElementById('passcode-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const appContainer = document.getElementById('app-container');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const flipBtn = document.getElementById('flip-btn');
    const notificationBox = document.getElementById('notification-box');
    const spools = document.querySelectorAll('.spool');
    const currentSideText = document.getElementById('current-side');
    const timeDisplay = document.getElementById('time-display');

    // 1. ระบบ Loading จำลองตอนเปิดเว็บ
    setTimeout(() => {
        progressFill.style.width = '100%';
        setTimeout(() => {
            loadingSection.classList.add('hidden');
            passwordSection.classList.remove('hidden');
        }, 2000); // รอหลอดโหลดเต็ม 2 วิ
    }, 500);

    // 2. ตรวจสอบรหัสผ่าน
    submitBtn.addEventListener('click', checkPassword);
    passcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    function checkPassword() {
        if (passcodeInput.value.toLowerCase() === SECRET_PASSWORD) {
            errorMsg.classList.add('hidden');
            introScreen.style.opacity = '0';
            setTimeout(() => {
                introScreen.classList.add('hidden');
                appContainer.classList.remove('hidden');
                loadAndPlayTrack('A', 0); // เริ่มเล่น Side A เพลงที่ 1
            }, 1000);
        } else {
            errorMsg.classList.remove('hidden');
            passcodeInput.value = '';
        }
    }

    // 3. ฟังก์ชันโหลดและเล่นเพลง
    function loadAndPlayTrack(side, trackIndex) {
        currentSide = side;
        currentTrackIndex = trackIndex;
        
        // แสดงผลหน้าเว็บ (เช่น SIDE A - TRK 1)
        currentSideText.textContent = `SIDE ${side} - TRK ${trackIndex + 1}`;
        
        audioPlayer.src = TRACKS[side][trackIndex];
        audioPlayer.play();
        updateUIState(true);
    }

    // 4. ควบคุม Play / Pause
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            updateUIState(true);
        } else {
            audioPlayer.pause();
            updateUIState(false);
        }
    });

    function updateUIState(playing) {
        isPlaying = playing;
        playPauseBtn.textContent = playing ? 'PAUSE' : 'PLAY';
        spools.forEach(spool => {
            playing ? spool.classList.add('spin') : spool.classList.remove('spin');
        });
    }

    // 5. ติดตามเวลาเพลง (เพื่ออัปเดตตัวเลขเวลาบนจอ)
    audioPlayer.addEventListener('timeupdate', () => {
        const currentMins = Math.floor(audioPlayer.currentTime / 60);
        const currentSecs = Math.floor(audioPlayer.currentTime % 60);
        timeDisplay.textContent = `${currentMins.toString().padStart(2, '0')}:${currentSecs.toString().padStart(2, '0')}`;
    });

    // 6. จัดการเมื่อเพลงเล่นจบ (Auto-play เพลงถัดไป หรือแจ้งเตือนเปลี่ยนหน้า)
    audioPlayer.addEventListener('ended', () => {
        currentTrackIndex++; // เลื่อนไปเพลงถัดไป
        
        // ถ้ายังมีเพลงเหลือในหน้านั้นๆ (เช่น จบเพลง 1 ไปเพลง 2)
        if (currentTrackIndex < TRACKS[currentSide].length) {
            loadAndPlayTrack(currentSide, currentTrackIndex);
        } else {
            // ถ้าเล่นครบทุกเพลงในหน้านั้นแล้ว
            updateUIState(false);
            if (currentSide === 'A') {
                notificationBox.classList.remove('hidden'); // เตือนให้กลับหน้า
            } else {
                currentSideText.textContent = "TAPE ENDED"; // จบเทป (Side B ครบแล้ว)
            }
        }
    });

    // 7. เมื่อกดปุ่ม Flip to Side B
    flipBtn.addEventListener('click', () => {
        notificationBox.classList.add('hidden');
        loadAndPlayTrack('B', 0); // เริ่มเล่น Side B เพลงที่ 1
    });
	
		// ปิดคลิกขวา
	document.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});

	// ปิดปุ่ม DevTools ต่างๆ
	document.addEventListener("keydown", function(e) {

    // F12
    if (e.key === "F12") {
        e.preventDefault();
        window.location.href = "https://google.com"; // เด้งไปหน้าอื่น
    }

    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        window.location.href = "https://google.com";
    }

    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        window.location.href = "https://google.com";
    }

    // Ctrl+U (ดู source)
    if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        window.location.href = "https://google.com";
    }
});
});