// Price range configuration
const MIN_PRICE = 35000;
const MAX_PRICE = 95000;
const PRICE_GAP = 10; // Minimum gap between handles in percentage

// Get DOM elements
const minRange = document.getElementById('minRange');
const maxRange = document.getElementById('maxRange');
const range = document.getElementById('range');
const histogramBars = document.querySelectorAll('.histogram-bar');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');

let isDragging = false;
let currentHandle = null;
let updateTimeout = null;

// Format price with commas and dollar sign
function formatPrice(price) {
    return `$${price.toLocaleString()}`;
}

// Convert percentage to actual price
function percentToPrice(percent) {
    return Math.round((percent / 100) * (MAX_PRICE - MIN_PRICE) + MIN_PRICE);
}

// Update range slider UI and trigger car filtering
function updateRange(triggerFilter = true) {
    const minValue = parseInt(minRange.value);
    const maxValue = parseInt(maxRange.value);

    // Update range highlight position
    range.style.left = `${minValue}%`;
    range.style.right = `${100 - maxValue}%`;

    // Update histogram bars
    histogramBars.forEach((bar, index) => {
        const barPosition = (index / (histogramBars.length - 1)) * 100;
        bar.classList.toggle('active', barPosition >= minValue && barPosition <= maxValue);
    });

    // Calculate actual price values
    const minPriceValue = percentToPrice(minValue);
    const maxPriceValue = percentToPrice(maxValue);

    // Update price labels
    minPrice.textContent = formatPrice(minPriceValue);
    maxPrice.textContent = formatPrice(maxPriceValue);

    if (triggerFilter) {
        // Clear any pending updates
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        // Set a new timeout to update the filter
        updateTimeout = setTimeout(() => {
            // Update URL and trigger car filtering
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('minprice', minPriceValue);
            queryParams.set('maxprice', maxPriceValue);
            
            const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);

            // Fetch cars with new price range
            if (typeof fetchCars === 'function') {
                fetchCars(`?minprice=${minPriceValue}&maxprice=${maxPriceValue}`);
            }
        }, 300); // Debounce time of 300ms
    }
}

// Handle mouse/touch events
function startDragging(e, handle) {
    isDragging = true;
    currentHandle = handle;
    document.addEventListener('mousemove', onDragging);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchmove', onDragging);
    document.addEventListener('touchend', stopDragging);
}

function onDragging(e) {
    if (!isDragging) return;

    const rect = range.getBoundingClientRect();
    const pageX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    let percent = Math.min(100, Math.max(0, 
        ((pageX - rect.left) / rect.width) * 100
    ));

    if (currentHandle === minRange) {
        const maxValue = parseInt(maxRange.value);
        if (maxValue - percent < PRICE_GAP) {
            percent = maxValue - PRICE_GAP;
        }
        minRange.value = percent;
    } else {
        const minValue = parseInt(minRange.value);
        if (percent - minValue < PRICE_GAP) {
            percent = minValue + PRICE_GAP;
        }
        maxRange.value = percent;
    }

    updateRange(false); // Don't trigger filter while dragging
}

function stopDragging() {
    if (isDragging) {
        isDragging = false;
        currentHandle = null;
        document.removeEventListener('mousemove', onDragging);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchmove', onDragging);
        document.removeEventListener('touchend', stopDragging);
        updateRange(true); // Trigger filter when dragging stops
    }
}

// Add event listeners
minRange.addEventListener('mousedown', (e) => startDragging(e, minRange));
maxRange.addEventListener('mousedown', (e) => startDragging(e, maxRange));
minRange.addEventListener('touchstart', (e) => startDragging(e, minRange));
maxRange.addEventListener('touchstart', (e) => startDragging(e, maxRange));

// Also handle input events for keyboard interaction
minRange.addEventListener('input', () => {
    const minValue = parseInt(minRange.value);
    const maxValue = parseInt(maxRange.value);
    if (maxValue - minValue < PRICE_GAP) {
        minRange.value = maxValue - PRICE_GAP;
    }
    updateRange();
});

maxRange.addEventListener('input', () => {
    const minValue = parseInt(minRange.value);
    const maxValue = parseInt(maxRange.value);
    if (maxValue - minValue < PRICE_GAP) {
        maxRange.value = minValue + PRICE_GAP;
    }
    updateRange();
});

// Initialize range slider with URL parameters or default values
function initializeRangeSlider() {
    const params = new URLSearchParams(window.location.search);
    const urlMinPrice = params.get('minprice');
    const urlMaxPrice = params.get('maxprice');

    if (urlMinPrice && urlMaxPrice) {
        const minPercent = ((parseInt(urlMinPrice) - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
        const maxPercent = ((parseInt(urlMaxPrice) - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
        minRange.value = Math.max(0, Math.min(100, minPercent));
        maxRange.value = Math.max(0, Math.min(100, maxPercent));
    } else {
        minRange.value = 0;
        maxRange.value = 100;
    }
    
    updateRange(true);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeRangeSlider);
