// Global variables
let allWallpapers = [];
let displayedWallpapers = [];
let currentFilter = 'all';
let currentSearch = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 48;

// Recommendation variables
let allRecommendations = [];
let displayedRecommendations = [];
let recommendationPage = 1;
const RECOMMENDATIONS_PER_PAGE = 12;

// Favorites system
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

// DOM Elements
const wallpapersGrid = document.getElementById('wallpapers-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const filterButtons = document.querySelectorAll('.filter-btn');
const wallpaperCount = document.getElementById('wallpaper-count');
const favoritesCountElements = document.querySelectorAll('.favorites-count');

// Update favorites count
function updateFavoritesCount() {
    favoritesCountElements.forEach(el => {
        if (el) {
            el.textContent = favorites.length;
        }
    });
}

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Update favorites count
    updateFavoritesCount();
    
    // Check which page we're on
    const isDetailPage = document.body.classList.contains('detail-page');
    const isFavoritesPage = document.body.classList.contains('favorites-page');
    
    if (isFavoritesPage) {
        loadFavoritesPage();
    } else if (isDetailPage) {
        loadDetailPage();
    } else {
        await loadWallpapers();
        setupEventListeners();
        addScrollToTopButton();
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
});

// Load wallpapers from JSON
async function loadWallpapers() {
    showLoading();
    try {
        const response = await fetch('data.json');
        allWallpapers = await response.json();
        
        // Update wallpaper count
        if (wallpaperCount) {
            animateCount(wallpaperCount, allWallpapers.length);
        }
        
        filterWallpapers();
    } catch (error) {
        console.error('Error loading wallpapers:', error);
        wallpapersGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Duvar kağıtları yüklenirken bir hata oluştu.</p>';
    }
    hideLoading();
}

// Animate counter
function animateCount(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('tr-TR');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('tr-TR');
        }
    }, 20);
}

// Setup event listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            currentPage = 1;
            filterWallpapers();
        });
    });
    
    // Load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && searchInput) {
            searchInput.value = '';
            handleSearch();
        }
    });
}

// Handle search
function handleSearch() {
    currentSearch = searchInput.value.toLowerCase().trim();
    currentPage = 1;
    filterWallpapers();
}

// Filter wallpapers
function filterWallpapers() {
    let filtered = [...allWallpapers];
    
    // Apply search filter
    if (currentSearch) {
        filtered = filtered.filter(wp => 
            wp.baslik.toLowerCase().includes(currentSearch)
        );
    }
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(wp => {
            const title = wp.baslik.toLowerCase();
            switch (currentFilter) {
                case 'anime':
                    return title.includes('anime') || title.includes('manga') || 
                           title.includes('gon') || title.includes('asuna') ||
                           title.includes('zenitsu') || title.includes('nami') ||
                           title.includes('naruto') || title.includes('bleach') ||
                           title.includes('one piece') || title.includes('dragon ball');
                case 'game':
                    return title.includes('game') || title.includes('gta') ||
                           title.includes('warcraft') || title.includes('zelda') ||
                           title.includes('spiderman') || title.includes('gundam') ||
                           title.includes('assassin') || title.includes('fortnite') ||
                           title.includes('pubg') || title.includes('league');
                case 'nature':
                    return title.includes('nature') || title.includes('forest') ||
                           title.includes('ocean') || title.includes('mountain') ||
                           title.includes('beach') || title.includes('tree') ||
                           title.includes('water') || title.includes('sky');
                case 'cyberpunk':
                    return title.includes('cyber') || title.includes('neon') ||
                           title.includes('digital') || title.includes('future') ||
                           title.includes('tech') || title.includes('pixel') ||
                           title.includes('hologram') || title.includes('matrix');
                case 'fantasy':
                    return title.includes('fantasy') || title.includes('magic') ||
                           title.includes('dragon') || title.includes('knight') ||
                           title.includes('angel') || title.includes('devil') ||
                           title.includes('wizard') || title.includes('elf');
                default:
                    return true;
            }
        });
    }
    
    displayedWallpapers = filtered;
    currentPage = 1;
    renderWallpapers();
}

// Render wallpapers with skeleton loading
function renderWallpapers() {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const wallpapersToShow = displayedWallpapers.slice(startIndex, endIndex);
    
    if (wallpapersToShow.length === 0) {
        wallpapersGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">Sonuç bulunamadı.</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    wallpapersGrid.innerHTML = '';
    
    wallpapersToShow.forEach((wallpaper, index) => {
        const card = createWallpaperCard(wallpaper, index);
        wallpapersGrid.appendChild(card);
    });
    
    // Show/hide load more button
    if (endIndex >= displayedWallpapers.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create wallpaper card with enhanced features
function createWallpaperCard(wallpaper, index) {
    const card = document.createElement('div');
    card.className = 'wallpaper-card';
    card.style.animationDelay = `${(index % ITEMS_PER_PAGE) * 0.02}s`;
    
    // Check if favorite
    const isFavorite = favorites.includes(wallpaper.sayfa_linki);
    
    // Create thumbnail with video on hover
    const thumbnail = document.createElement('div');
    thumbnail.className = 'wallpaper-thumbnail';
    
    const img = document.createElement('img');
    img.className = 'wallpaper-image';
    // Daha yüksek kalite için resim boyutunu büyüt (364x205 -> 728x410)
    img.src = wallpaper.resim_linki.replace('364x205', '728x410');
    img.alt = wallpaper.baslik;
    img.loading = 'lazy';
    
    // Orijinal video boyutunu kullan (480x270 çalışmıyor)
    const video = document.createElement('video');
    video.className = 'wallpaper-video';
    video.src = wallpaper.video_onizleme;
    video.loop = true;
    video.muted = true;
    video.preload = 'none';
    video.playsInline = true;
    
    thumbnail.appendChild(img);
    thumbnail.appendChild(video);
    
    // Favorite button
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn' + (isFavorite ? ' active' : '');
    favoriteBtn.innerHTML = isFavorite ? '❤️' : '🤍';
    favoriteBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(wallpaper.sayfa_linki, favoriteBtn);
    };
    thumbnail.appendChild(favoriteBtn);
    
    // Hover effect for video - DÜZELTİLDİ
    card.addEventListener('mouseenter', () => {
        video.load(); // Video'yu önceden yükle
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Hata durumunda sessizce devam et
            });
        }
    });
    
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
    
    // Info section
    const info = document.createElement('div');
    info.className = 'wallpaper-info';
    
    const title = document.createElement('h3');
    title.className = 'wallpaper-title';
    title.textContent = wallpaper.baslik;
    
    const actions = document.createElement('div');
    actions.className = 'wallpaper-actions';
    
    // View details button
    const viewBtn = document.createElement('a');
    viewBtn.className = 'action-btn';
    viewBtn.href = `detail.html?id=${encodeURIComponent(wallpaper.sayfa_linki)}`;
    viewBtn.innerHTML = '▶ Detay';
    
    actions.appendChild(viewBtn);
    
    info.appendChild(title);
    info.appendChild(actions);
    
    card.appendChild(thumbnail);
    card.appendChild(info);
    
    // Click on card to go to detail
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('action-btn') && 
            !e.target.classList.contains('favorite-btn')) {
            window.location.href = `detail.html?id=${encodeURIComponent(wallpaper.sayfa_linki)}`;
        }
    });
    
    return card;
}

// Toggle favorite
function toggleFavorite(wallpaperId, btn) {
    const index = favorites.indexOf(wallpaperId);
    if (index > -1) {
        favorites.splice(index, 1);
        btn.innerHTML = '🤍';
        btn.classList.remove('active');
    } else {
        favorites.push(wallpaperId);
        btn.innerHTML = '❤️';
        btn.classList.add('active');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

// Load more wallpapers
function loadMore() {
    currentPage++;
    renderWallpapers();
    
    // Smooth scroll to new content
    setTimeout(() => {
        const firstNewCard = wallpapersGrid.children[(currentPage - 1) * ITEMS_PER_PAGE];
        if (firstNewCard) {
            firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
}

// Scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

// Detail page functionality
async function loadDetailPage() {
    showLoading();
    
    // Get wallpaper ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const wallpaperId = urlParams.get('id');
    
    if (!wallpaperId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch('data.json');
        allWallpapers = await response.json();
        
        // Find the wallpaper
        const wallpaper = allWallpapers.find(wp => wp.sayfa_linki === wallpaperId);
        
        if (!wallpaper) {
            window.location.href = 'index.html';
            return;
        }
        
        // Display wallpaper details
        displayWallpaperDetails(wallpaper);
        
        // Add to recently viewed
        addToRecentlyViewed(wallpaperId);
        
        // Load recommendations
        loadRecommendations(wallpaper);
        
        // Setup navigation
        setupDetailNavigation(wallpaper);
        
        // Setup recommendation load more
        setupRecommendationLoadMore();
        
    } catch (error) {
        console.error('Error loading wallpaper details:', error);
    }
    
    hideLoading();
}

// Add to recently viewed
function addToRecentlyViewed(wallpaperId) {
    recentlyViewed = recentlyViewed.filter(id => id !== wallpaperId);
    recentlyViewed.unshift(wallpaperId);
    recentlyViewed = recentlyViewed.slice(0, 20);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Display wallpaper details
function displayWallpaperDetails(wallpaper) {
    // Set title
    document.getElementById('detail-title').textContent = wallpaper.baslik;
    document.title = `${wallpaper.baslik} - Yc Wallpaper`;
    
    // Set video
    const video = document.getElementById('detail-video');
    video.src = wallpaper.video_onizleme;
    
    // Set download links
    const download4k = document.getElementById('download-4k');
    const downloadHd = document.getElementById('download-hd');
    
    if (wallpaper.indirme_linkleri.hasOwnProperty('4k_indir')) {
        download4k.href = wallpaper.indirme_linkleri['4k_indir'];
        download4k.style.display = 'flex';
    } else {
        download4k.style.display = 'none';
    }
    
    if (wallpaper.indirme_linkleri.hd_indir) {
        downloadHd.href = wallpaper.indirme_linkleri.hd_indir;
        downloadHd.style.display = 'flex';
    } else {
        downloadHd.style.display = 'none';
    }
    
    // Setup favorite button
    const detailFavoriteBtn = document.getElementById('detail-favorite-btn');
    if (detailFavoriteBtn) {
        const isFavorite = favorites.includes(wallpaper.sayfa_linki);
        detailFavoriteBtn.innerHTML = isFavorite ? '❤️' : '🤍';
        if (isFavorite) {
            detailFavoriteBtn.classList.add('active');
        }
        
        detailFavoriteBtn.addEventListener('click', () => {
            toggleFavorite(wallpaper.sayfa_linki, detailFavoriteBtn);
        });
    }
}

// Setup detail page navigation
function setupDetailNavigation(currentWallpaper) {
    const currentIndex = allWallpapers.findIndex(wp => wp.sayfa_linki === currentWallpaper.sayfa_linki);
    
    // Create navigation buttons
    const navContainer = document.createElement('div');
    navContainer.className = 'detail-navigation';
    
    if (currentIndex > 0) {
        const prevBtn = document.createElement('a');
        prevBtn.className = 'nav-btn prev-btn';
        prevBtn.href = `detail.html?id=${encodeURIComponent(allWallpapers[currentIndex - 1].sayfa_linki)}`;
        prevBtn.innerHTML = '← Önceki';
        navContainer.appendChild(prevBtn);
    }
    
    if (currentIndex < allWallpapers.length - 1) {
        const nextBtn = document.createElement('a');
        nextBtn.className = 'nav-btn next-btn';
        nextBtn.href = `detail.html?id=${encodeURIComponent(allWallpapers[currentIndex + 1].sayfa_linki)}`;
        nextBtn.innerHTML = 'Sonraki →';
        navContainer.appendChild(nextBtn);
    }
    
    // Add to page
    const detailInfo = document.querySelector('.detail-info');
    if (detailInfo && navContainer.children.length > 0) {
        detailInfo.appendChild(navContainer);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            window.location.href = `detail.html?id=${encodeURIComponent(allWallpapers[currentIndex - 1].sayfa_linki)}`;
        } else if (e.key === 'ArrowRight' && currentIndex < allWallpapers.length - 1) {
            window.location.href = `detail.html?id=${encodeURIComponent(allWallpapers[currentIndex + 1].sayfa_linki)}`;
        }
    });
}

// Load recommendations
function loadRecommendations(currentWallpaper) {
    const recommendedGrid = document.getElementById('recommended-grid');
    
    // Get words from current title
    const currentWords = currentWallpaper.baslik.toLowerCase()
        .split(/[\s\-:]+/)
        .filter(word => word.length > 3);
    
    // Find similar wallpapers
    const recommendations = allWallpapers
        .filter(wp => wp.sayfa_linki !== currentWallpaper.sayfa_linki)
        .map(wp => {
            const wpWords = wp.baslik.toLowerCase().split(/[\s\-:]+/);
            const matchCount = currentWords.filter(word => 
                wpWords.some(wpWord => wpWord.includes(word) || word.includes(wpWord))
            ).length;
            return { wallpaper: wp, score: matchCount };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.wallpaper);
    
    // If not enough similar, add random ones
    if (recommendations.length < 24) {
        const remaining = 24 - recommendations.length;
        const random = allWallpapers
            .filter(wp => 
                wp.sayfa_linki !== currentWallpaper.sayfa_linki &&
                !recommendations.includes(wp)
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, remaining);
        
        recommendations.push(...random);
    }
    
    allRecommendations = recommendations;
    recommendationPage = 1;
    renderRecommendations();
}

// Render recommendations
function renderRecommendations() {
    const recommendedGrid = document.getElementById('recommended-grid');
    const loadMoreRecBtn = document.getElementById('load-more-recommended-btn');
    
    const startIndex = 0;
    const endIndex = recommendationPage * RECOMMENDATIONS_PER_PAGE;
    const recsToShow = allRecommendations.slice(startIndex, endIndex);
    
    recommendedGrid.innerHTML = '';
    recsToShow.forEach((wp, index) => {
        const card = createWallpaperCard(wp, index);
        recommendedGrid.appendChild(card);
    });
    
    // Show/hide load more button
    if (endIndex >= allRecommendations.length) {
        loadMoreRecBtn.style.display = 'none';
    } else {
        loadMoreRecBtn.style.display = 'block';
    }
}

// Setup recommendation load more
function setupRecommendationLoadMore() {
    const loadMoreRecBtn = document.getElementById('load-more-recommended-btn');
    if (loadMoreRecBtn) {
        loadMoreRecBtn.addEventListener('click', () => {
            recommendationPage++;
            renderRecommendations();
            
            setTimeout(() => {
                const firstNewCard = document.getElementById('recommended-grid')
                    .children[(recommendationPage - 1) * RECOMMENDATIONS_PER_PAGE];
                if (firstNewCard) {
                    firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Favorites page functionality
async function loadFavoritesPage() {
    showLoading();
    
    try {
        const response = await fetch('data.json');
        allWallpapers = await response.json();
        
        const favoritesGrid = document.getElementById('favorites-grid');
        const emptyFavorites = document.getElementById('empty-favorites');
        const clearBtn = document.getElementById('clear-favorites-btn');
        
        if (favorites.length === 0) {
            favoritesGrid.style.display = 'none';
            emptyFavorites.style.display = 'block';
            if (clearBtn) clearBtn.style.display = 'none';
        } else {
            favoritesGrid.style.display = 'grid';
            emptyFavorites.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'block';
            
            // Load favorite wallpapers
            const favoriteWallpapers = allWallpapers.filter(wp => 
                favorites.includes(wp.sayfa_linki)
            );
            
            favoritesGrid.innerHTML = '';
            favoriteWallpapers.forEach((wp, index) => {
                const card = createWallpaperCard(wp, index);
                favoritesGrid.appendChild(card);
            });
        }
        
        // Setup clear button
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Tüm beğenilen duvar kağıtlarını silmek istediğinizden emin misiniz?')) {
                    favorites = [];
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    updateFavoritesCount();
                    loadFavoritesPage();
                }
            });
        }
        
        // Add scroll to top
        addScrollToTopButton();
        
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
    
    hideLoading();
}
