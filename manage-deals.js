// Manage Deals Page
document.addEventListener('DOMContentLoaded', () => {
    setupDealForm();
    renderCustomDeals();
});

// DOM Elements
const createDealForm = document.getElementById('createDealForm');
const customDealsList = document.getElementById('customDealsList');

// Setup deal creation form
function setupDealForm() {
    if (!createDealForm) return;
    
    createDealForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('dealTitle').value.trim();
        const badge = document.getElementById('dealBadge').value.trim() || 'Limited';
        const description = document.getElementById('dealDescription').value.trim();
        const priceStr = document.getElementById('dealPrice').value;
        const origPriceStr = document.getElementById('dealOriginalPrice').value;
        const expiryDate = document.getElementById('dealExpiry').value;
        const image = document.getElementById('dealImage').value.trim() || 'pics/menu.jpg';
        const terms = document.getElementById('dealTerms').value.trim() || '';

        if (!title || !description || !expiryDate) {
            showMessage('Please fill in title, description and expiry date', 'error');
            return;
        }

        const price = priceStr ? parseInt(priceStr, 10) : null;
        const originalPrice = origPriceStr ? parseInt(origPriceStr, 10) : null;

        const newDeal = {
            id: Date.now(),
            title,
            description,
            price,
            originalPrice,
            image,
            badge,
            expiryDate,
            terms
        };

        const deals = loadCustomDeals();
        deals.push(newDeal);
        saveCustomDeals(deals);
        renderCustomDeals();

        createDealForm.reset();
        showMessage('Deal added successfully! It now appears on the Deals page.', 'success');
    });
}

// Load custom deals from localStorage
function loadCustomDeals() {
    try {
        return JSON.parse(localStorage.getItem('customDeals') || '[]');
    } catch {
        return [];
    }
}

// Save custom deals to localStorage
function saveCustomDeals(deals) {
    localStorage.setItem('customDeals', JSON.stringify(deals));
}

// Render custom deals list
function renderCustomDeals() {
    if (!customDealsList) return;
    
    const deals = loadCustomDeals();
    
    if (deals.length === 0) {
        customDealsList.innerHTML = '<p class="no-deals">No custom deals created yet.</p>';
        return;
    }

    customDealsList.innerHTML = deals.map(deal => `
        <div class="custom-deal-card">
            <div class="deal-card-header">
                <h4>${deal.title}</h4>
                <span class="deal-badge">${deal.badge}</span>
            </div>
            <p class="deal-description">${deal.description}</p>
            <div class="deal-meta">
                ${deal.price ? `<div class="meta-item">Price: P${deal.price}${deal.originalPrice ? ` (was P${deal.originalPrice})` : ''}</div>` : ''}
                <div class="meta-item">Expires: ${formatDate(deal.expiryDate)}</div>
                ${deal.terms ? `<div class="meta-item">Terms: ${deal.terms}</div>` : ''}
            </div>
            <div class="deal-actions">
                <button class="btn btn-danger remove-deal-btn" data-id="${deal.id}">🗑️ Remove Deal</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to remove buttons
    customDealsList.querySelectorAll('.remove-deal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            const deals = loadCustomDeals().filter(d => d.id !== id);
            saveCustomDeals(deals);
            renderCustomDeals();
            showMessage('Deal removed successfully', 'success');
        });
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show message to user
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('dealFormMessage');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `deal-form-message ${type}`;
    
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'deal-form-message';
    }, 4000);
}
