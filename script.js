document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Preloader --- */
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 800); // Simulated loading time
    }

    /* --- 2. Theme Toggle & Persistence --- */
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('bcult-theme');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('bcult-theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('bcult-theme', 'dark');
            }
        });
    }

    /* --- 3. Page Transitions (Page Flip) --- */
    const transitionOverlay = document.getElementById('page-transition');
    const internalLinks = document.querySelectorAll('[data-link]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            // Prevent redundant reload
            if (window.location.pathname.endsWith(href)) return;

            transitionOverlay.classList.add('page-flip-active');
            setTimeout(() => {
                window.location.href = href;
            }, 400); // Match halfway of CSS animation
        });
    });

    /* --- 4. Mobile Menu --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
        closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }

    /* --- 5. Parallax Effect (Hero) --- */
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && parallaxLayers.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 0.05;
                const xPos = x * speed * 100;
                const yPos = y * speed * 100;
                // Keep rotation if exists
                const style = window.getComputedStyle(layer);
                const matrix = new WebKitCSSMatrix(style.transform);
                // We only translate, assuming rotation is static in CSS or initial transform
                // Simple translation for stability:
                layer.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });
    }

    /* --- 6. Number Counters (Index) --- */
    const counters = document.querySelectorAll('.counter');
    if(counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    let count = 0;
                    const inc = target / 50; // Speed
                    
                    const updateCount = () => {
                        count += inc;
                        if(count < target) {
                            counter.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        });
        counters.forEach(c => observer.observe(c));
    }

    /* --- 7. Project Injection & Modal Logic --- */
    // Data (Fallback if not defined in HTML)
    const projectsData = window.PROJECTS || [
        { id: 101, title: "Classic Fade", category: "grooming", desc: "Timeless clean cut.", tags: ["Hair"] },
        { id: 102, title: "Urban Tech", category: "street", desc: "Utility focused.", tags: ["Style"] },
        { id: 103, title: "Gala Ready", category: "formal", desc: "Black tie excellence.", tags: ["Suit"] }
    ];

    const grid = document.getElementById('projects-container') || document.getElementById('featured-grid');
    
    function renderProjects(data, limit = null) {
        if(!grid) return;
        grid.innerHTML = '';
        const toRender = limit ? data.slice(0, limit) : data;
        
        toRender.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card sketch-border';
            // Accessible keyboard navigation
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.innerHTML = `
                <div class="card-img-placeholder"></div>
                <h3>${p.title}</h3>
                <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
            `;
            // Event listeners for opening modal
            card.addEventListener('click', () => openModal(p));
            card.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') openModal(p);
            });
            grid.appendChild(card);
        });
    }

    // Initial Render
    // If we are on home page (has #featured-grid), only show 3
    if(document.getElementById('featured-grid')) {
        renderProjects(projectsData, 3);
    } else {
        renderProjects(projectsData);
    }

    /* --- 8. Search & Filter (Projects Page) --- */
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');

    function filterProjects() {
        if(!grid) return;
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const cat = filterSelect ? filterSelect.value : 'all';

        const filtered = projectsData.filter(p => {
            const matchesTerm = p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term);
            const matchesCat = cat === 'all' || p.category === cat;
            return matchesTerm && matchesCat;
        });
        renderProjects(filtered);
    }

    if(searchInput) searchInput.addEventListener('input', filterProjects);
    if(filterSelect) filterSelect.addEventListener('change', filterProjects);

    /* --- 9. Modal System --- */
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const closeModalBtns = document.querySelectorAll('[data-close-modal]');

    function openModal(project) {
        if(!modal) return;
        modalTitle.innerText = project.title;
        modalDesc.innerText = project.desc;
        modalTags.innerHTML = project.tags.map(t => `<span style="background:#000; color:#fff; padding:2px 5px; margin-right:5px; font-size:0.8em;">${t}</span>`).join('');
        
        modal.setAttribute('aria-hidden', 'false');
        // Trap focus for accessibility
        const closeBtn = modal.querySelector('.close-modal-btn');
        if(closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if(!modal) return;
        modal.setAttribute('aria-hidden', 'true');
    }

    if(closeModalBtns) {
        closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    /* --- 10. Contact Form Logic (LocalStorage) --- */
    const form = document.getElementById('contact-form');
    const saveDraftBtn = document.getElementById('save-draft');
    const clearDraftBtn = document.getElementById('clear-draft');
    const statusMsg = document.getElementById('form-status');

    if(form) {
        // Load Draft
        const loadDraft = () => {
            const draft = JSON.parse(localStorage.getItem('bcult-draft'));
            if(draft) {
                form.name.value = draft.name || '';
                form.email.value = draft.email || '';
                form.message.value = draft.message || '';
                form.newsletter.checked = draft.newsletter || false;
            }
        };
        loadDraft();

        // Save Draft
        saveDraftBtn.addEventListener('click', () => {
            const data = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
                newsletter: form.newsletter.checked
            };
            localStorage.setItem('bcult-draft', JSON.stringify(data));
            statusMsg.innerText = "Draft Saved to Memory.";
            setTimeout(() => statusMsg.innerText = "", 2000);
        });

        // Clear Draft
        clearDraftBtn.addEventListener('click', () => {
            form.reset();
            localStorage.removeItem('bcult-draft');
            statusMsg.innerText = "Memory Wiped.";
            setTimeout(() => statusMsg.innerText = "", 2000);
        });

        // Submit (Validation + Simulation)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            
            // Simple validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                if(!input.value.trim()) {
                    input.parentElement.classList.add('error');
                    valid = false;
                } else {
                    input.parentElement.classList.remove('error');
                }
                // Email regex check
                if(input.type === 'email' && input.value) {
                    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if(!re.test(input.value)) {
                        input.parentElement.classList.add('error');
                        valid = false;
                    }
                }
            });

            if(valid) {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = "TRANSMITTING...";
                btn.disabled = true;
                
                // Simulate Backend API call
                setTimeout(() => {
                    btn.innerText = "SENT";
                    statusMsg.innerText = "Data transmitted successfully. We will be in touch.";
                    statusMsg.style.color = "green";
                    form.reset();
                    localStorage.removeItem('bcult-draft'); // Clear draft on success
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        statusMsg.innerText = "";
                    }, 3000);
                }, 1500);
            }
        });
    }

    /* --- 11. Back to Top --- */
    const topBtn = document.getElementById('scroll-top');
    if(topBtn) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 300) topBtn.style.display = 'block';
            else topBtn.style.display = 'none';
        });
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});