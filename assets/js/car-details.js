// Format price to currency string
function formatPrice(price) {
    return `$${price.toLocaleString()}`;
}

// Format date to readable string
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get car ID from URL parameters
function getCarIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Update page content with car details
function updateCarDetails(car) {
    console.log('Updating car details with data:', car);
    
    try {
        // Update title and breadcrumb
        document.title = `${car.title} - AutoVault`;
        const titleElement = document.querySelector('.breadcrumb-area-wrapper .title');
        if (!titleElement) {
            throw new Error('Title element not found');
        }
        titleElement.textContent = car.title;
        console.log('Updated title:', car.title);
        
        // Update feature area
        const features = document.querySelector('.feature-area');
        if (!features) {
            throw new Error('Features element not found');
        }
        features.innerHTML = `
            <li>
                <img src="assets/images/portfolio/feature-icon/10.svg" alt="">
                ${car.mileage}
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/11.svg" alt="">
                ${car.fuelType}
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/12.svg" alt="">
                ${car.transmission}
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/13.svg" alt="">
                ${car.seats} Person
            </li>
        `;
        console.log('Updated features');

        // Update price area
        const priceElement = document.querySelector('.price-area h5');
        const priceMetaElement = document.querySelector('.price-meta');
        if (!priceElement || !priceMetaElement) {
            throw new Error('Price elements not found');
        }
        priceElement.textContent = formatPrice(car.price);
        priceMetaElement.innerHTML = `
            <li><img src="assets/images/portfolio/calender.svg" alt=""> ${formatDate(car.createdAt)}</li>
            <li><img src="assets/images/portfolio/view.svg" alt=""> ${car.status}</li>
            <li><img src="assets/images/portfolio/heart.svg" alt=""> Add to Favorites</li>
        `;
        console.log('Updated price area');

        // Update slider images
        const sliderWrapper = document.querySelector('.swiper-wrapper');
        if (!sliderWrapper) {
            throw new Error('Slider wrapper not found');
        }
        sliderWrapper.innerHTML = car.images.map(image => `
            <div class="swiper-slide">
                <div class="image"><img src="${image}" alt="${car.title}"></div>
            </div>
        `).join('');
        console.log('Updated slider images');

        // Update car description
        const descriptionElement = document.querySelector('.portfolio-details-area p');
        if (!descriptionElement) {
            throw new Error('Description element not found');
        }
        descriptionElement.textContent = car.description;
        console.log('Updated description');

        // Update car features list
        const featuresList = document.querySelector('.feature-list');
        if (featuresList && car.features) {
            featuresList.innerHTML = car.features.map(feature => `
                <li>
                    <i class="fa-regular fa-circle-check"></i> ${feature}
                </li>
            `).join('');
            console.log('Updated features list');
        }

        // Update engine details
        if (car.engineDetails) {
            const engineList = document.querySelector('.feature-list2');
            if (engineList) {
                engineList.innerHTML = `
                    <li>
                        <i class="fa-regular fa-circle-check"></i>
                        <div class="text">
                            <p>Displacement</p>
                            <p>${car.engineDetails.displacement}</p>
                        </div>
                    </li>
                    <li>
                        <i class="fa-regular fa-circle-check"></i>
                        <div class="text">
                            <p>Torque</p>
                            <p>${car.engineDetails.torque}</p>
                        </div>
                    </li>
                    <li>
                        <i class="fa-regular fa-circle-check"></i>
                        <div class="text">
                            <p>Horsepower</p>
                            <p>${car.engineDetails.horsepower}</p>
                        </div>
                    </li>
                    <li>
                        <i class="fa-regular fa-circle-check"></i>
                        <div class="text">
                            <p>Engine Type</p>
                            <p>${car.engineDetails.type}</p>
                        </div>
                    </li>
                `;
                console.log('Updated engine details');
            }
        }

        // Update seller information
        if (car.seller) {
            const contactDiv = document.querySelector('.contact .contact-inner');
            if (contactDiv) {
                contactDiv.innerHTML = `
                    <div class="author-img">
                        <img src="assets/images/portfolio/author.webp" alt="${car.seller.name}">
                    </div>
                    <h5>${car.seller.name}</h5>
                    <p>Car Dealer</p>
                    <div class="contact-button-area">
                        <a href="tel:${car.seller.phone}" class="rts-btn radius-small whatsapp">
                            <img src="assets/images/portfolio/whatsapp.svg" alt=""> ${car.seller.phone}
                        </a>
                        <a href="tel:${car.seller.phone}" class="rts-btn radius-small btn-primary phone">
                            <img src="assets/images/portfolio/phone.svg" alt=""> ${car.seller.phone}
                        </a>
                        <a href="mailto:${car.seller.email}" class="rts-btn radius-small telegram">
                            <img src="assets/images/portfolio/send.svg" alt=""> Send Message
                        </a>
                    </div>
                `;
                console.log('Updated seller information');
            }
        }

        // Update overview section
        const overview = document.querySelector('.overview .feature-list2');
        if (!overview) {
            throw new Error('Overview element not found');
        }
        overview.innerHTML = `
            <li>
                <img src="assets/images/portfolio/feature-icon/09.svg" alt="">
                <div class="text">
                    <p>Car Type</p>
                    <p>${car.make} - ${car.model}</p>
                </div>
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/10.svg" alt="">
                <div class="text">
                    <p>Mileage</p>
                    <p>${car.mileage}</p>
                </div>
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/11.svg" alt="">
                <div class="text">
                    <p>Fuel Type</p>
                    <p>${car.fuelType}</p>
                </div>
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/12.svg" alt="">
                <div class="text">
                    <p>Transmission</p>
                    <p>${car.transmission}</p>
                </div>
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/13.svg" alt="">
                <div class="text">
                    <p>Person</p>
                    <p>${car.seats} Person</p>
                </div>
            </li>
            <li>
                <img src="assets/images/portfolio/feature-icon/14.svg" alt="">
                <div class="text">
                    <p>Year</p>
                    <p>${car.year}</p>
                </div>
            </li>
        `;
        console.log('Updated overview section');
        console.log('All updates completed successfully');
    } catch (error) {
        console.error('Error updating car details:', error);
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = `Error updating car details: ${error.message}`;
            errorMessage.style.display = 'block';
        }
        throw error;
    }
}

// Fetch and display car details
async function loadCarDetails() {
    console.log('Starting loadCarDetails function');
    const carId = getCarIdFromUrl();
    if (!carId) {
        console.error('No car ID provided');
        return;
    }
    console.log('Found car ID:', carId);

    try {
        console.log('Fetching car details for ID:', carId);
        const car = await fetchCarById(carId);
        console.log('Received car data:', car);
        if (!car) {
            throw new Error('No car data received');
        }
        await updateCarDetails(car);
    } catch (error) {
        console.error('Error loading car details:', error);
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Error loading car details. Please try again later.';
            errorMessage.style.display = 'block';
        }
    } finally {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCarDetails);
