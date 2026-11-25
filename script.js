// 1. በፎልደሩ ውስጥ የሚገኙት 28ቱ ፎቶዎች
const photos = [
  "20221212_160515.jpg",
  "20240226_112811.jpg",
  "20240901_180251.jpg",
  "20240901_180437.jpg",
  "IMG_20220506_093128_435.jpg",
  "IMG_20220506_094347_994.jpg",
  "IMG_20230105_081740_318_1.jpg",
  "IMG_20230105_082806_417.jpg",
  "IMG_20230105_083303_741.jpg",
  "IMG_20230118_115044_095.jpg",
  "IMG_20230118_125003_480.jpg",
  "IMG_20230328_101511_991.jpg",
  "IMG_20230328_101932_245.jpg",
  "IMG_20230329_101734_994.jpg",
  "IMG_20230414_152032_202.jpg",
  "IMG_20230506_101927_833.jpg",
  "IMG_20230506_101935_240.jpg",
  "IMG_20230613_213750_959.jpg",
  "IMG_20240112_113651_078.jpg",
  "IMG_20240402_102803_834.jpg",
  "IMG_20240422_183336_778.jpg",
  "IMG20230104162508.jpg",
  "Picsart_24-03-02_19-11-43-948.jpg",
  "Screenshot_20221214-103953_1.jpg",
  "Screenshot_20230717-081722_1.jpg",
  "Snapchat-233779864.jpg",
  "Snapchat-1025624832.jpg",
  "Snapchat-1377818056.jpg"
];

// 2. ሙዚቃ
const songs = ["ካህኑ ሳምራዊ.mp3"];

// 3. Modals እና አዝራሮች
const messageModal = document.getElementById("message-modal");
const galleryModal = document.getElementById("gallery-modal");
const photoGrid = document.getElementById("photo-grid");
const container = document.getElementById("canvas-container");

let currentPhotoIndex = 0;
let updateCenterPhoto = null;

function setPhoto(index) {
  currentPhotoIndex = (index + photos.length) % photos.length;
  if (typeof updateCenterPhoto === "function") {
    updateCenterPhoto(photos[currentPhotoIndex]);
  }
}

// Gallery መሙላት
if (photoGrid) {
  photoGrid.innerHTML = "";
  photos.forEach((fileName, idx) => {
    const img = document.createElement("img");
    img.src = encodeURI(fileName);
    img.alt = ትዝታ ${idx + 1};
    img.onerror = () => {
      img.style.display = "none";
    };
    img.onclick = () => {
      setPhoto(idx);
      if (galleryModal) galleryModal.classList.add("hidden");
    };
    photoGrid.appendChild(img);
  });
}

const btnMessage = document.getElementById("btn-message");
const btnGallery = document.getElementById("btn-gallery");
const btnNextPhoto = document.getElementById("btn-next-photo");

if (btnMessage && messageModal) {
  btnMessage.onclick = () => messageModal.classList.remove("hidden");
}
if (btnGallery && galleryModal) {
  btnGallery.onclick = () => galleryModal.classList.remove("hidden");
}
if (btnNextPhoto) {
  btnNextPhoto.onclick = () => setPhoto(currentPhotoIndex + 1);
}

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.onclick = () => {
    const target = document.getElementById(btn.dataset.close);
    if (target) target.classList.add("hidden");
  };
});

// 4. ሙዚቃ መቆጣጠሪያ
const audio = document.getElementById("bg-audio");
const musicBtn = document.getElementById("btn-music");
let songIdx = 0;
let isPlaying = false;

if (musicBtn && audio) {
  musicBtn.onclick = () => {
    if (!songs.length) {
      musicBtn.textContent = "🎵 ዘፈን አልተጨመረም";
      return;
    }
    if (!isPlaying) {
      audio.src = encodeURI(songs[songIdx]);
      audio.play()
        .then(() => {
          isPlaying = true;
          musicBtn.textContent = "🎵 ሙዚቃ: ክፍት";
        })
        .catch(() => {
          musicBtn.textContent = "🎵 ሙዚቃ ማጫወት አልተቻለም";
        });
    } else {
      audio.pause();
      isPlaying = false;
      musicBtn.textContent = "🎵 ሙዚቃ: ዝግ";
    }
  };

  audio.onended = () => {
    if (!songs.length) return;
    songIdx = (songIdx + 1) % songs.length;
    audio.src = encodeURI(songs[songIdx]);
    audio.play().catch(() => {});
  };
}

// 5. Fallback ማሳያ (Three.js ካልተጫነ ወይም file:// ላይ ከተከፈተ በቀጥታ እንዲታይ)
function setupFallbackStage() {
  if (!container) return;
  container.innerHTML = "";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.flexDirection = "column";const frameBox = document.createElement("div");
  frameBox.style.width = "min(340px, 78vw)";
  frameBox.style.height = "min(420px, 56vh)";
  frameBox.style.border = "4px solid #fbbf24";
  frameBox.style.borderRadius = "18px";
  frameBox.style.overflow = "hidden";
  frameBox.style.boxShadow = "0 16px 45px rgba(251, 191, 36, 0.25)";
  frameBox.style.background = "#1e293b";
  frameBox.style.cursor = "pointer";
  frameBox.title = "ቀጣይ ፎቶ ለማየት ይንኩ";

  const mainImg = document.createElement("img");
  mainImg.src = encodeURI(photos[0]);
  mainImg.alt = "የጓደኝነት ፎቶ";
  mainImg.style.width = "100%";
  mainImg.style.height = "100%";
  mainImg.style.objectFit = "cover";

  frameBox.onclick = () => setPhoto(currentPhotoIndex + 1);
  frameBox.appendChild(mainImg);
  container.appendChild(frameBox);

  const counterText = document.createElement("div");
  counterText.style.marginTop = "12px";
  counterText.style.color = "#fbbf24";
  counterText.style.fontSize = "0.9rem";
  counterText.textContent = ፎቶ 1 / ${photos.length};
  container.appendChild(counterText);

  updateCenterPhoto = (fileName) => {
    mainImg.src = encodeURI(fileName);
    counterText.textContent = ፎቶ ${currentPhotoIndex + 1} / ${photos.length};
  };
}

// 6. Three.js 3D ለመሞከር፣ ካልተሳካ Fallback መጠቀም
let threeStarted = false;
try {
  if (container && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.03);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xfbbf24, 2, 25);
    goldLight.position.set(4, 5, 5);
    scene.add(goldLight);

    const textureLoader = new THREE.TextureLoader();

    const frameGroup = new THREE.Group();
    scene.add(frameGroup);

    const photoMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      side: THREE.DoubleSide
    });
    const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 4.2), photoMat);
    frameGroup.add(photoMesh);

    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.6,
      roughness: 0.3
    });
    const borderMesh = new THREE.Mesh(new THREE.BoxGeometry(3.65, 4.45, 0.12), borderMat);
    borderMesh.position.z = -0.07;
    frameGroup.add(borderMesh);

    updateCenterPhoto = (fileName) => {
      textureLoader.load(
        encodeURI(fileName),
        (tex) => {
          photoMesh.material.map = tex;
          photoMesh.material.color.setHex(0xffffff);
          photoMesh.material.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    };

    if (photos.length > 0) {
      updateCenterPhoto(photos[0]);
    }

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const radius = 6.2;
    photos.forEach((fileName, idx) => {
      const angle = (idx / photos.length) * Math.PI * 2;
      const cardMat = new THREE.MeshBasicMaterial({
        color: 0x475569,
        side: THREE.DoubleSide
      });
      const card = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.35), cardMat);
      card.position.set(
        Math.cos(angle) * radius,
        Math.sin(idx * 0.7) * 0.55,
        Math.sin(angle) * radius
      );
      card.lookAt(0, 0, 0);
      card.userData = { photoIndex: idx };
      ringGroup.add(card);

      textureLoader.load(
        encodeURI(fileName),
        (tex) => {
          card.material.map = tex;
          card.material.color.setHex(0xffffff);
          card.material.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    });const starCount = 400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 38;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xfde68a, size: 0.08 })
    );
    scene.add(stars);

    let isDragging = false;
    let prevX = 0;
    let dragRotationY = 0;

    renderer.domElement.addEventListener("pointerdown", (e) => {
      isDragging = true;
      prevX = e.clientX;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      dragRotationY += dx * 0.008;
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    renderer.domElement.addEventListener("click", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(ringGroup.children);
      if (hits.length > 0) {
        setPhoto(hits[0].object.userData.photoIndex);
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      ringGroup.rotation.y += 0.003;
      frameGroup.rotation.y = dragRotationY + Math.sin(Date.now() * 0.001) * 0.15;
      stars.rotation.y -= 0.0005;
      renderer.render(scene, camera);
    }
    animate();
    threeStarted = true;

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
} catch (err) {
  threeStarted = false;
}

if (!threeStarted) {
  setupFallbackStage();
}

// ፎቶ በየ 4 ሰከንዱ በራሱ መቀየር
if (photos.length > 1) {
  setInterval(() => {
    setPhoto(currentPhotoIndex + 1);
  }, 4000);
}