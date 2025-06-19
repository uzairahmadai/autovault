// API Functions for Car Listings
// Mock data for development/demo
const MOCK_DATA = {
    cars: [
        {
            _id: "1",
            title: "Mercedes-Benz E-Class 2023",
            make: "Mercedes-Benz",
            model: "E-Class",
            year: 2023,
            price: 65000,
            mileage: "1,200 Miles",
            fuelType: "Petrol",
            transmission: "Automatic",
            color: "Black",
            images: ["assets/images/portfolio/30.webp"],
            seats: 2,
            status: "Available"
        },
        {
            _id: "2",
            title: "BMW 7 Series 2023",
            make: "BMW",
            model: "7 Series",
            year: 2023,
            price: 95000,
            mileage: "500 Miles",
            fuelType: "Hybrid",
            transmission: "Automatic",
            color: "White",
            images: ["assets/images/portfolio/04.webp"],
            seats: 4,
            status: "Available"
        },
        {
            _id: "3",
            title: "Tesla Model S 2023",
            make: "Tesla",
            model: "Model S",
            year: 2023,
            price: 89900,
            mileage: "0 Miles",
            fuelType: "Electric",
            transmission: "Automatic",
            color: "Red",
            images: ["assets/images/portfolio/05.webp"],
            seats: 5,
            status: "Available"
        },
        {
            _id: "4",
            title: "Toyota RAV4 2023",
            make: "Toyota",
            model: "RAV4",
            year: 2023,
            price: 45000,
            mileage: "100 Miles",
            fuelType: "Plug-in Hybrid",
            transmission: "Automatic",
            color: "Silver",
            images: ["assets/images/portfolio/06.webp"],
            seats: 5,
            status: "Available"
        },
        {
            _id: "5",
            title: "Volkswagen Golf TDI 2023",
            make: "Volkswagen",
            model: "Golf",
            year: 2023,
            price: 35000,
            mileage: "800 Miles",
            fuelType: "Diesel",
            transmission: "Manual",
            color: "Blue",
            images: ["assets/images/portfolio/07.webp"],
            seats: 6,
            status: "Available"
        }
    ]
};

// API Configuration
const USE_MOCK = true; // Using mock data since we don't have MongoDB in the web environment
const API_BASE_URL = 'http://localhost:3001/api';

// Debug flag
const DEBUG = true;

// Debug logger
function debug(message, data = null) {
    if (DEBUG) {
        console.log(`[AutoVault Debug] ${message}`, data || '');
    }
}

// Convert title to URL-friendly slug
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

// Fetch all cars
async function fetchCars(searchQuery = '') {
    debug('Fetching cars with query:', searchQuery);
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    
    try {
        debug('Starting car fetch request');
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';

        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Filter mock data based on search query
            let filteredCars = [...MOCK_DATA.cars];
            if (searchQuery) {
                const params = new URLSearchParams(searchQuery.startsWith('?') ? searchQuery : `?${searchQuery}`);
                
                // Apply filters with case-insensitive comparison and null checks
                if (params.has('search')) {
                    const searchTerm = params.get('search').toLowerCase();
                    filteredCars = filteredCars.filter(car => 
                        (car.title && car.title.toLowerCase().includes(searchTerm)) ||
                        (car.make && car.make.toLowerCase().includes(searchTerm)) ||
                        (car.model && car.model.toLowerCase().includes(searchTerm))
                    );
                }
                
                if (params.has('make')) {
                    const makes = params.get('make').toLowerCase().split(',');
                    filteredCars = filteredCars.filter(car => 
                        car.make && makes.includes(car.make.toLowerCase())
                    );
                }

                if (params.has('model')) {
                    const models = params.get('model').toLowerCase().split(',');
                    filteredCars = filteredCars.filter(car => 
                        car.model && models.includes(car.model.toLowerCase())
                    );
                }
                
                if (params.has('minprice')) {
                    const minPrice = parseInt(params.get('minprice'));
                    filteredCars = filteredCars.filter(car => 
                        car.price && car.price >= minPrice
                    );
                }
                if (params.has('maxprice')) {
                    const maxPrice = parseInt(params.get('maxprice'));
                    filteredCars = filteredCars.filter(car => 
                        car.price && car.price <= maxPrice
                    );
                }

                if (params.has('seats')) {
                    const seats = params.get('seats').split(',').map(Number);
                    filteredCars = filteredCars.filter(car => 
                        car.seats && seats.includes(car.seats)
                    );
                }

                if (params.has('color')) {
                    const colors = params.get('color').toLowerCase().split(',');
                    filteredCars = filteredCars.filter(car => 
                        car.color && colors.includes(car.color.toLowerCase())
                    );
                }

                if (params.has('fuelType')) {
                    const fuelTypes = params.get('fuelType').toLowerCase().split(',');
                    filteredCars = filteredCars.filter(car => 
                        car.fuelType && fuelTypes.includes(car.fuelType.toLowerCase())
                    );
                }
            }
            
            // Calculate filter counts from filtered data
            const filters = {
                makes: countUniqueValues(filteredCars, 'make'),
                models: countUniqueValues(filteredCars, 'model'),
                fuelTypes: countUniqueValues(filteredCars, 'fuelType'),
                colors: countUniqueValues(filteredCars, 'color'),
                seats: countUniqueValues(filteredCars, 'seats')
            };
            
            return { cars: filteredCars, filters };
        }
        
        const url = searchQuery 
            ? `${API_BASE_URL}/cars${searchQuery}`
            : `${API_BASE_URL}/cars`;
        
        debug('Fetching from URL:', url);    
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            debug('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        debug('Successfully fetched cars:', data.cars.length);
        return data;
    } catch (error) {
        debug('Error in fetchCars:', error);
        console.error('Error fetching cars:', error);
        
        let errorMsg = 'Error loading cars. Please try again later.';
        if (error.message.includes('Failed to fetch')) {
            errorMsg = 'Unable to connect to the server. Please check your connection.';
        }
        
        errorMessage.textContent = errorMsg;
        errorMessage.style.display = 'block';
        throw error;
    } finally {
        loadingIndicator.style.display = 'none';
        debug('Fetch request completed');
    }
}

// Render pagination controls
function renderPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;

    // Add click event listeners
    pagination.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.closest('.page-link').dataset.page);
            if (newPage && newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
                fetchCars(`?page=${newPage}`).then(cars => renderCars(cars, null, newPage));
            }
        });
    });
}

// Render car listings with pagination
function renderCars(data, container, page = 1, itemsPerPage = 8) {
    debug('Starting to render cars:', { data });
    const carListingsContainer = document.getElementById('car-listings-container');
    const errorMessage = document.getElementById('error-message');
    
    try {
        const cars = data.cars || [];
        if (!cars || cars.length === 0) {
            debug('No cars to display');
            carListingsContainer.innerHTML = `
                <div class="alert alert-info" role="alert">
                    No cars found. Please try adjusting your search criteria.
                </div>
            `;
            return;
        }

        debug('Generating HTML for cars');
        const validCars = cars.filter(car => {
            if (!car.title || !car.images || !car.images.length) {
                debug('Invalid car data:', car);
                return false;
            }
            return true;
        });

        if (validCars.length === 0) {
            debug('No valid cars to display');
            carListingsContainer.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    No valid car data available. Please try again later.
                </div>
            `;
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(validCars.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedCars = validCars.slice(startIndex, startIndex + itemsPerPage);

        // Render pagination controls
        renderPagination(page, totalPages);

        // Update filter counts with the filters from API response
        updateFilterCounts(data.filters);

        const carsHTML = paginatedCars.map(car => `
            <div class="project-wrapper2 list-style mb--30">
                <div class="image-area">
                    <a href="portfolio-details.html?id=${car._id}&title=${slugify(car.title)}">
                        <img src="${car.images[0]}" alt="${car.title}" height="206">
                    </a>
                </div>
                <div class="content-area">
                    <h6 class="title">
                        <a href="portfolio-details.html?id=${car._id}&title=${slugify(car.title)}">${car.make} ${car.model} ${car.year}</a>
                    </h6>
                    <ul class="feature-area">
                        <li>
                            <img src="assets/images/portfolio/feature-icon/01.svg" alt="">
                            ${car.mileage || 'N/A'} Miles
                        </li>
                        <li>
                            <img src="assets/images/portfolio/feature-icon/02.svg" alt="">
                            ${car.fuelType || 'N/A'}
                        </li>
                        <li>
                            <img src="assets/images/portfolio/feature-icon/03.svg" alt="">
                            ${car.transmission || 'N/A'}
                        </li>
                    </ul>
                    <div class="button-area">
                        <p class="cw">$${car.price.toLocaleString()}</p>
                        <a href="portfolio-details.html?id=${car._id}&title=${slugify(car.title)}" class="rts-btn btn-primary radius-small">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');

        debug(`Rendering ${paginatedCars.length} cars (page ${page} of ${totalPages})`);
        carListingsContainer.innerHTML = carsHTML;
    } catch (error) {
        debug('Error rendering cars:', error);
        carListingsContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error displaying cars. Please try refreshing the page.
            </div>
        `;
    }
}

function updateFilterCounts(filters) {
    if (!filters) return;

    // Helper function to update checkbox counts
    const updateCheckboxCounts = (selector, filterData) => {
        if (!filterData) return;
        
        document.querySelectorAll(selector).forEach(checkbox => {
            const value = checkbox.value.toLowerCase();
            const filterItem = filterData.find(item => 
                item.value && item.value.toLowerCase() === value
            );
            const count = filterItem ? filterItem.count : 0;
            
            // Find the checkbox item container
            const checkboxItem = checkbox.closest('.checkbox-item');
            if (checkboxItem) {
                // Get the label text span (inside .checkbox-label)
                const labelSpan = checkboxItem.querySelector('.checkbox-label span');
                if (labelSpan) {
                    labelSpan.textContent = checkbox.value;
                }
                
                // Get the standalone count span (sibling of .checkbox-label)
                const spans = checkboxItem.getElementsByTagName('span');
                const countSpan = Array.from(spans).find(span => 
                    !span.closest('.checkbox-label') && span.parentElement === checkboxItem
                );
                if (countSpan) {
                    countSpan.textContent = `(${count})`;
                }
            }
        });
    };

    // Update fuel type tags
    const fuelTypeTags = document.querySelectorAll('.tag-area ul.fuel-type li a');
    fuelTypeTags.forEach(tag => {
        if (!tag.dataset.value) return;
        
        const fuelType = tag.dataset.value.toLowerCase();
        const filterItem = filters.fuelTypes.find(item => 
            item.value && item.value.toLowerCase() === fuelType
        );
        const count = filterItem ? filterItem.count : 0;
        
        const baseText = tag.dataset.value;
        tag.textContent = `${baseText} (${count})`;
    });

    // Update all filter sections with new counts
    updateCheckboxCounts('.car-make input[type="checkbox"]', filters.makes);
    updateCheckboxCounts('.car-model input[type="checkbox"]', filters.models);
    updateCheckboxCounts('input[name="seats"]', filters.seats);
    updateCheckboxCounts('input[name="color"]', filters.colors);
}

// Helper function to count unique values
function countUniqueValues(items, field) {
    if (!items || !Array.isArray(items)) return [];
    
    const counts = {};
    items.forEach(item => {
        if (item && item[field]) {
            const value = item[field].toString();
            counts[value] = (counts[value] || 0) + 1;
        }
    });
    
    return Object.entries(counts).map(([value, count]) => ({
        value,
        count
    }));
}

// Initialize car listings
function initializeCarListings() {
    const searchForm = document.querySelector('.search-area form');
    const carListingsContainer = document.getElementById('car-listings-container');
    let activeFilters = {};

    // Load initial car listings and initialize filters
    fetchCars()
        .then(data => {
            renderCars(data, carListingsContainer);
            
            // Initialize filter values from mock data if using mock mode
            if (USE_MOCK) {
                const mockFilters = {
                    makes: countUniqueValues(MOCK_DATA.cars, 'make'),
                    models: countUniqueValues(MOCK_DATA.cars, 'model'),
                    fuelTypes: countUniqueValues(MOCK_DATA.cars, 'fuelType'),
                    colors: countUniqueValues(MOCK_DATA.cars, 'color'),
                    seats: countUniqueValues(MOCK_DATA.cars, 'seats')
                };
                updateFilterCounts(mockFilters);
            }
        })
        .catch(error => {
            console.error('Error initializing car listings:', error);
            errorMessage.textContent = 'Error loading cars. Please try again later.';
            errorMessage.style.display = 'block';
        });

    // Initialize all filters
    initializeSearchFilter();
    initializeMakeFilter();
    initializeModelFilter();
    initializePriceRange();
    initializeSeatsFilter();
    initializeColorFilter();
    initializeFuelTypeFilter();

    function applyFilters() {
        let queryParams = [];
        
        // Handle search filter
        if (activeFilters.search) {
            queryParams.push(`search=${encodeURIComponent(activeFilters.search)}`);
        }
        
        // Handle array-based filters (make, model, seats, color, fuelType)
        ['make', 'model', 'seats', 'color', 'fuelType'].forEach(key => {
            if (Array.isArray(activeFilters[key]) && activeFilters[key].length > 0) {
                queryParams.push(`${key}=${encodeURIComponent(activeFilters[key].join(','))}`);
            }
        });

        // Handle price filter
        const urlParams = new URLSearchParams(window.location.search);
        const minPrice = urlParams.get('minprice');
        const maxPrice = urlParams.get('maxprice');
        if (minPrice) queryParams.push(`minprice=${minPrice}`);
        if (maxPrice) queryParams.push(`maxprice=${maxPrice}`);

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        fetchCars(queryString)
            .then(cars => renderCars(cars, carListingsContainer))
            .catch(error => console.error('Error applying filters:', error));
    }

    function initializeSearchFilter() {
        if (searchForm) {
            const searchInput = searchForm.querySelector('input');
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchValue = e.target.value.trim();
                    if (searchValue) {
                        activeFilters.search = searchValue;
                    } else {
                        delete activeFilters.search;
                    }
                    applyFilters();
                }, 500);
            });

            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        }
    }

    function initializeCheckboxFilter(selector, filterKey) {
        const checkboxes = document.querySelectorAll(selector);
        checkboxes.forEach(checkbox => {
            // Set initial label text
            const labelSpan = checkbox.nextElementSibling;
            if (labelSpan) {
                labelSpan.textContent = `${checkbox.value} (0)`;
            }

            // Add change event listener
            checkbox.addEventListener('change', () => {
                const selectedValues = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                
                if (selectedValues.length > 0) {
                    activeFilters[filterKey] = selectedValues;
                } else {
                    delete activeFilters[filterKey];
                }
                applyFilters();
            });
        });
    }

    function initializeMakeFilter() {
        initializeCheckboxFilter('.car-make input[type="checkbox"]', 'make');
    }

    function initializeModelFilter() {
        initializeCheckboxFilter('.car-model input[type="checkbox"]', 'model');
    }

    function initializePriceRange() {
        // Price range is now handled by price-filter.js
        // This function remains for compatibility but doesn't add event listeners
        // as they are now managed in price-filter.js
    }

    function initializeSeatsFilter() {
        initializeCheckboxFilter('.car-seats input[type="checkbox"]', 'seats');
    }

    function initializeColorFilter() {
        initializeCheckboxFilter('.car-color input[type="checkbox"]', 'color');
    }

    function initializeFuelTypeFilter() {
        const fuelTypeLinks = document.querySelectorAll('.tag-area ul.fuel-type li a');
        debug('Initializing fuel type filter with tags:', fuelTypeLinks.length);
        
        fuelTypeLinks.forEach(link => {
            // Remove any existing event listeners
            link.removeEventListener('click', handleFuelTypeClick);
            // Add new event listener
            link.addEventListener('click', handleFuelTypeClick);
            
            // Set initial label text
            const fuelType = link.dataset.value;
            if (fuelType) {
                link.textContent = `${fuelType} (0)`;
            }
        });
    }

    function handleFuelTypeClick(e) {
        e.preventDefault();
        const link = e.currentTarget;  // Use currentTarget instead of target
        const fuelType = link.dataset.value;
        
        debug('Fuel type tag clicked:', fuelType);
        
        // Toggle active class
        link.classList.toggle('active');
        
        // Get all active fuel types
        const activeFuelTypes = Array.from(document.querySelectorAll('.tag-area ul.fuel-type li a.active'))
            .map(activeLink => activeLink.dataset.value);
        
        debug('Active fuel types:', activeFuelTypes);
        
        if (activeFuelTypes.length > 0) {
            activeFilters.fuelType = activeFuelTypes;
        } else {
            delete activeFilters.fuelType;
        }
        
        debug('Active filters after fuel type change:', activeFilters);
        applyFilters();
    }
}

// Fetch car by ID
async function fetchCarById(id) {
    debug('Fetching car details for ID:', id);
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    
    try {
        debug('Starting car details fetch request');
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';

        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const car = MOCK_DATA.cars.find(car => car._id === id);
            if (!car) {
                throw new Error('Car not found');
            }
            return car;
        }
        
        const url = `${API_BASE_URL}/cars/${id}`;
        debug('Fetching from URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const car = await response.json();
        debug('Successfully fetched car details');
        return car;
    } catch (error) {
        debug('Error fetching car details:', error);
        if (errorMessage) {
            errorMessage.textContent = 'Error loading car details. Please try again later.';
            errorMessage.style.display = 'block';
        }
        throw error;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        debug('Car details fetch request completed');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarListings);
