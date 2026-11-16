// 1. White Hamburger Menu Toggle (Works on Desktop & Mobile)
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        const expanded = mobileMenuBtn.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', expanded);
    });
}

// 2. Dark Mode Toggle (Saves theme across all 3 pages)
const themeToggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('kasun-portfolio-theme');

if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '&#9728;';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('kasun-portfolio-theme', 'light');
            themeToggleBtn.innerHTML = '&#9790;';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('kasun-portfolio-theme', 'dark');
            themeToggleBtn.innerHTML = '&#9728;';
        }
    });
}

// 3. Load Portfolio Projects from projects.json + Filter + Modal Popup
const portfolioGrid = document.getElementById('portfolio-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modalOverlay = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');

// Backup data if opened directly without Live Server
const fallbackProjects = [
    {
        id: 1,
        title: "Ceylon Tea Website",
        category: "Web Design",
        client: "Kandy Tea Leaves",
        tools: "HTML, CSS, JavaScript",
        year: "2026",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=700&q=80",
        description: "A simple online shop website made for a Sri Lankan tea company."
    },
    {
        id: 2,
        title: "EasyPay Mobile App",
        category: "App Design",
        client: "Lanka Digital",
        tools: "Figma",
        year: "2026",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=700&q=80",
        description: "A clean mobile app design for sending money and paying bills easily."
    },
    {
        id: 3,
        title: "Hill Country Nature Photos",
        category: "Photography",
        client: "Travel Sri Lanka",
        tools: "DSLR Camera, Lightroom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=80",
        description: "A photo collection of green mountains and waterfalls in Nuwara Eliya."
    },
    {
        id: 4,
        title: "City Bus Tracker App",
        category: "App Design",
        client: "Metro Transport",
        tools: "Figma",
        year: "2026",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80",
        description: "A user-friendly app screen design to check bus times and routes in Colombo."
    },
    {
        id: 5,
        title: "Modern House Website",
        category: "Web Design",
        client: "Colombo Homes",
        tools: "HTML, CSS Grid, JavaScript",
        year: "2025",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80",
        description: "A responsive website showing house designs and building plans."
    },
    {
        id: 6,
        title: "Coffee Shop Photo Shoot",
        category: "Photography",
        client: "Aroma Coffee",
        tools: "Studio Camera, Photo Editing",
        year: "2026",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80",
        description: "Bright and clear food and coffee photos taken for a local cafe menu."
    }
];

let allProjects = [];

function renderProjects(projects) {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <span class="project-cat">${project.category}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <button class="details-btn" data-id="${project.id}">View Details</button>
            </div>
        `;
        portfolioGrid.appendChild(card);
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = parseInt(btn.getAttribute('data-id'));
            const selected = allProjects.find(p => p.id === projectId);
            if (selected && modalOverlay) {
                document.getElementById('modal-img').src = selected.image;
                document.getElementById('modal-category').textContent = selected.category;
                document.getElementById('modal-title').textContent = selected.title;
                document.getElementById('modal-desc').textContent = selected.description;
                document.getElementById('modal-client').textContent = selected.client;
                document.getElementById('modal-tools').textContent = selected.tools;
                document.getElementById('modal-year').textContent = selected.year;
                modalOverlay.classList.add('open');
                modalOverlay.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

if (portfolioGrid) {
    fetch('projects.json')
        .then(res => {
            if (!res.ok) throw new Error('JSON load failed');
            return res.json();
        })
        .then(data => {
            allProjects = data;
            renderProjects(allProjects);
        })
        .catch(() => {
            allProjects = fallbackProjects;
            renderProjects(allProjects);
        });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            if (category === 'all') {
                renderProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p => p.category === category);
                renderProjects(filtered);
            }
        });
    });
}

if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
        modalOverlay.setAttribute('aria-hidden', 'true');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('open');
            modalOverlay.setAttribute('aria-hidden', 'true');
        }
    });
}