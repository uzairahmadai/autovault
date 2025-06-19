// Wait for jQuery and jQuery UI to be loaded
window.addEventListener('load', function() {
    if (typeof jQuery === 'undefined' || typeof jQuery.ui === 'undefined') {
        console.error('[Price Range] jQuery or jQuery UI not loaded');
        return;
    }

    $(document).ready(function() {
        console.log('[Price Range] Initializing price range slider');
        
        const $minPrice = $('#minPrice');
        const $maxPrice = $('#maxPrice');
        const $slider = $('#price-range-slider');
        const $histogramBars = $('.histogram-bar');
        
        if (!$minPrice.length || !$maxPrice.length || !$slider.length) {
            console.error('[Price Range] Required elements not found');
            return;
        }

        console.log('[Price Range] All required elements found');

        const MIN_PRICE = 50000;
        const MAX_PRICE = 100000;
        let priceUpdateTimeout;

        function formatPrice(value) {
            return '$' + value.toLocaleString();
        }

        function updatePriceLabels(minValue, maxValue) {
            $minPrice.text(formatPrice(minValue));
            $maxPrice.text(formatPrice(maxValue));
        }

        function updateHistogram(minValue, maxValue) {
            $histogramBars.each(function(index) {
                const barValue = MIN_PRICE + (index / ($histogramBars.length - 1)) * (MAX_PRICE - MIN_PRICE);
                $(this).toggleClass('active', barValue >= minValue && barValue <= maxValue);
            });
        }

        function filterCars(minValue, maxValue) {
            clearTimeout(priceUpdateTimeout);
            priceUpdateTimeout = setTimeout(() => {
                const $carListingContainer = $('#car-listings-container');
                const $loadingIndicator = $('#loading-indicator');
                const $errorMessage = $('#error-message');
                
                if ($carListingContainer.length) {
                    $loadingIndicator.show();
                    $errorMessage.hide();
                    
                    console.log('[Price Range] Fetching cars with price range:', { minValue, maxValue });
                    fetchCars(`?minPrice=${minValue}&maxPrice=${maxValue}`)
                        .then(cars => {
                            renderCars(cars, $carListingContainer[0]);
                            $loadingIndicator.hide();
                        })
                        .catch(error => {
                            console.error('[Price Range] Error filtering cars:', error);
                            $errorMessage.text('Error filtering cars. Please try again.').show();
                            $loadingIndicator.hide();
                        });
                }
            }, 500);
        }

        // Initialize jQuery UI Range Slider
        try {
            $slider.slider({
                range: true,
                min: MIN_PRICE,
                max: MAX_PRICE,
                step: 1000,
                values: [60000, 90000],
                create: function(event, ui) {
                    // Initialize with default values
                    updatePriceLabels(60000, 90000);
                    updateHistogram(60000, 90000);
                },
                slide: function(event, ui) {
                    updatePriceLabels(ui.values[0], ui.values[1]);
                    updateHistogram(ui.values[0], ui.values[1]);
                },
                change: function(event, ui) {
                    filterCars(ui.values[0], ui.values[1]);
                }
            });

            // Add custom classes for styling
            $slider.find('.ui-slider-handle').addClass('custom-handle');
            $slider.find('.ui-slider-range').addClass('custom-range');

        } catch (error) {
            console.error('[Price Range] Error initializing slider:', error);
        }
    });
});
