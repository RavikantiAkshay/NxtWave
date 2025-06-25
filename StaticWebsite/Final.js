const iframeSources = [
      "CodingPractices/1.html",
      "CodingPractices/2.html",
      "CodingPractices/3.html",
      "CodingPractices/4.html",
      "CodingPractices/5_1.html",
      "CodingPractices/5_2.html",
      "CodingPractices/6_1.html",
      "CodingPractices/6_2.html",
      "CodingPractices/7_1.html",
      "CodingPractices/7_2.html",
      "CodingPractices/8.html",
      "CodingPractices/9_1.html",
      "CodingPractices/9_2.html",
      "CodingPractices/10_1.html",
      "CodingPractices/10_2.html",
      "CodingPractices/11.html",
      "CodingPractices/12.html",
      "CodingPractices/13.html",
      "CodingAssignments/1_1.html",
      "CodingAssignments/1_2.html",
      "CodingAssignments/2.html",
      "CodingAssignments/3.html",
      "CodingAssignments/4.html"
    ];

    let current = 0;
    const carousel = document.getElementById("carousel");
    const toggleBtn = document.getElementById("toggleBtn");

    // Create particles
    function createParticles() {
      const particlesContainer = document.getElementById('particles');
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
      }
    }

    let carouselItems = [];
    let isTransitioning = false;

    function initializeCarousel() {
      carousel.innerHTML = "";
      carouselItems = [];
      const len = iframeSources.length;
      
      for (let i = 0; i < len; i++) {
        const item = document.createElement("div");
        item.classList.add("carousel-item");
        item.dataset.index = i;
        
        const iframe = document.createElement("iframe");
        iframe.src = iframeSources[i];
        item.appendChild(iframe);
        carousel.appendChild(item);
        carouselItems.push(item);
      }
      
      updateCarouselPositions();
    }

    function updateCarouselPositions() {
      const len = iframeSources.length;
      
      carouselItems.forEach((item, i) => {
        const offset = ((i - current + len) % len);
        let x = 0;
        let z = 0;
        let scale = 1;
        let rotY = 0;
        let filter = "blur(5px) brightness(0.3)";
        let zIndex = 0;

        if (offset === 0) {
          // Center item - keep original dimensions
          x = 0;
          z = 0;
          scale = 1;
          rotY = 0;
          filter = "blur(0px) brightness(1)";
          zIndex = 10;
        } else if (offset === 1 || offset === len - 1) {
          const d = offset === 1 ? 1 : -1;
          x = d * 450; // Reduced from circular positioning
          z = -150;
          scale = 0.75;
          rotY = -d * 25;
          filter = "blur(2px) brightness(0.7)";
          zIndex = 5;
        } else if (offset === 2 || offset === len - 2) {
          const d = offset === 2 ? 1 : -1;
          x = d * 650; // More constrained
          z = -300;
          scale = 0.6;
          rotY = -d * 40;
          filter = "blur(3px) brightness(0.5)";
          zIndex = 3;
        } else if (offset === 3 || offset === len - 3) {
          const d = offset === 3 ? 1 : -1;
          x = d * 800; // Keep within reasonable bounds
          z = -450;
          scale = 0.45;
          rotY = -d * 55;
          filter = "blur(4px) brightness(0.3)";
          zIndex = 1;
        } else {
          // Hide items that are too far
          x = offset > len/2 ? -1200 : 1200;
          z = -600;
          scale = 0.3;
          rotY = offset > len/2 ? 60 : -60;
          filter = "blur(5px) brightness(0.1)";
          zIndex = 0;
        }

        item.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale}) rotateY(${rotY}deg)`;
        item.style.zIndex = zIndex;
        item.style.filter = filter;
      });
    }

    function renderCarousel() {
      if (carouselItems.length === 0) {
        initializeCarousel();
      } else {
        updateCarouselPositions();
      }
    }

    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      current = (current - 1 + iframeSources.length) % iframeSources.length;
      renderCarousel();
      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    }

    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      current = (current + 1) % iframeSources.length;
      renderCarousel();
      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    }

    function toggleView() {
      const wrapper = document.getElementById("carousel-wrapper");
      const full = document.getElementById("full-view");
      const showingCarousel = !wrapper.classList.contains("hidden-view");
      
      if (showingCarousel) {
        // Switching to grid view
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          wrapper.classList.add("hidden-view");
          full.classList.remove("hidden-view");
          toggleBtn.innerHTML = '<span>← Back</span>';
          
          // Reset animations for grid items
          const boxes = full.querySelectorAll('.iframe-box');
          boxes.forEach((box, index) => {
            box.style.opacity = '0';
            box.style.transform = 'translateY(30px)';
            setTimeout(() => {
              box.style.opacity = '1';
              box.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }, 300);
      } else {
        // Switching to carousel view
        full.style.opacity = '0';
        
        setTimeout(() => {
          full.classList.add("hidden-view");
          wrapper.classList.remove("hidden-view");
          wrapper.style.opacity = '1';
          wrapper.style.transform = 'scale(1)';
          toggleBtn.innerHTML = '<span>View All</span>';
        }, 300);
      }
    }

    // Auto-rotate carousel
    let autoRotate = setInterval(nextSlide, 4000);

    // Pause auto-rotate on hover
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoRotate);
    });

    carousel.addEventListener('mouseleave', () => {
      autoRotate = setInterval(nextSlide, 4000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') {
        const wrapper = document.getElementById("carousel-wrapper");
        if (wrapper.classList.contains("hidden-view")) {
          toggleView();
        }
      }
    });

    // Touch support for mobile
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    });

    // Initialize
    createParticles();
    initializeCarousel();