  // Booking System Module
        const BookingSystem = (function() {
            // Configuration - you can customize these
            const config = {
                services: {
                    'Lite Regular Cleaning': {
                        options: [
                            { name: '1 Bedroom Flat', price: 9136.43, description: 'Lite Regular cleaning. Duration up to 1hr 30mins.' },
                            { name: '2 Bedroom Flat', price: 11286.43, description: 'Lite Regular cleaning. Duration up to 2hrs 30mins.' },
                            { name: '3 Bedroom Flat', price: 16661.43, description: 'Lite Regular cleaning. Duration up to 3hrs 30mins.' },
                            { name: '3 Bedroom Duplex', price: 17736.43, description: 'Lite Regular cleaning. Duration up to 3hrs 30mins.' }
                        ]
                    },
                    'Deep Cleaning': {
                        options: [
                            { name: 'Deep Cleaning Flat', price: 81162.50, description: 'Includes project manager, machinery, chemicals, products, logistics & professionals.' },
                            { name: 'Deep Cleaning Duplex', price: 98792.50, description: 'Includes project manager, machinery, chemicals, products, logistics & professionals.' }
                        ]
                    },
                    'Rugs and Carpet Cleaning': {
                        options: [
                            { name: 'Small rugs', price: 25650, description: '30 sq. ft. Covers washing, sucking out moisture, and drying.' },
                            { name: 'Medium rugs', price: 33750, description: '75 sq. ft. Covers washing, sucking out moisture, and drying.' }
                        ]
                    },
                    'Fumigation': {
                        options: [
                            { name: 'One Bedroom', price: 60750, description: 'Up to One hour' },
                            { name: 'Two Bedroom', price: 67500, description: 'Up to One hour' }
                        ]
                    }
                },
                frequencies: [
                    'One-time Cleaning',
                    'Twice Monthly Cleaning',
                    'Weekly Cleaning'
                ]
            };

            // State management
            let state = {
                location: null,
                service: null,
                bedroom: null,
                price: null,
                frequency: null,
                date: null,
                time: null,
                name: null,
                email: null,
                phone: null,
                address: null,
                hasAccount: false
            };

            let currentScreen = null;
            let history = [];

            // DOM elements
            let container;
            const screens = {};

            // Initialize the booking system
            function init() {
                container = document.getElementById('booking-system-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'booking-system-container';
                    document.body.appendChild(container);
                }
                
                renderAllScreens();
                bindEvents();
            }

            // Render all screens
            function renderAllScreens() {
                container.innerHTML = `
                    <!-- Location Selector -->
                    <div id="location-screen" class="booking-modal">
                        ${renderCloseButton()}
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Select Location</h2>
                        <hr class="border-gray-200 mb-6">
                        <div data-location="Taraba State" class="location-option border-2 border-green-500 rounded-full py-3 px-6 text-gray-800 font-medium cursor-pointer hover:bg-gray-50 transition">Taraba State</div>
                    </div>

                    <!-- Service Selector -->
                    <div id="service-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('location-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Select a Service</h1>
                        <div class="space-y-4">
                            ${Object.keys(config.services).map(service => `
                                <div data-service="${service}" data-next="${service === 'Lite Regular Cleaning' ? 'bedroom-screen' : service.toLowerCase().replace(/ /g, '-') + '-screen'}" 
                                    class="service-option flex items-center bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:shadow-md transition">
                                    <img src="https://placehold.co/50x50" alt="${service}" class="w-12 h-12 rounded-lg mr-4">
                                    <span class="text-gray-800 font-medium">${service}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Bedroom List -->
                    <div id="bedroom-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('service-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Select Bedroom Type</h1>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${config.services['Lite Regular Cleaning'].options.map(option => `
                                <div data-bedroom="${option.name}" data-price="${option.price}" 
                                    class="bedroom-option bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition flex flex-col">
                                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${option.name}</h3>
                                    <p class="text-gray-600 text-sm flex-grow">${option.description}</p>
                                    <p class="text-green-500 font-semibold mt-4">₦${option.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Frequency Selector -->
                    <div id="frequency-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('bedroom-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Choose Service Frequency</h1>
                        <div class="space-y-4">
                            ${config.frequencies.map((frequency, index) => `
                                <div data-frequency="${frequency}" 
                                    class="frequency-option flex items-center bg-white ${index === 0 ? 'border-2 border-green-500' : 'border border-gray-200'} rounded-2xl p-4 cursor-pointer hover:shadow-md transition">
                                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <img src="https://placehold.co/20x20" alt="Frequency Icon">
                                    </div>
                                    <span class="text-gray-800 font-medium">${frequency}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Summary -->
                    <div id="summary-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('frequency-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Summary</h1>
                        <div id="summary-card" class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                            <h3 id="summary-service" class="text-lg font-semibold text-gray-800 mb-2"></h3>
                            <p id="summary-frequency" class="text-gray-600 text-sm mb-2"></p>
                            <p id="summary-total" class="text-gray-800 font-semibold"></p>
                        </div>
                        <button id="next-to-date" class="w-full bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition shadow-md">Next Step</button>
                    </div>

                    <!-- Date & Time Picker -->
                    <div id="datetime-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('summary-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Select Date & Time</h1>
                        <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
                            <div class="flex-1">
                                <label for="date-input" class="block text-sm font-medium text-gray-800 mb-2">Date</label>
                                <input type="date" id="date-input" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                <div id="date-error" class="error-message hidden">Please select a date</div>
                            </div>
                            <div class="flex-1">
                                <label for="time-input" class="block text-sm font-medium text-gray-800 mb-2">Time</label>
                                <input type="time" id="time-input" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                <div id="time-error" class="error-message hidden">Please select a time</div>
                            </div>
                        </div>
                        <button id="next-to-login" class="w-full bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition shadow-md">Next Step</button>
                    </div>

                    <!-- Login -->
                    <div id="login-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('datetime-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Login to Your Account</h1>
                        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div class="space-y-4">
                                <div>
                                    <label for="login-email" class="block text-sm font-medium text-gray-800 mb-2">Email Address</label>
                                    <input type="email" id="login-email" placeholder="Enter email address" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <div id="login-email-error" class="error-message hidden">Please enter a valid email</div>
                                </div>
                                <div>
                                    <label for="login-password" class="block text-sm font-medium text-gray-800 mb-2">Password</label>
                                    <input type="password" id="login-password" placeholder="Enter password" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <div id="login-password-error" class="error-message hidden">Please enter your password</div>
                                </div>
                                <button id="login-btn" class="w-full bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition shadow-md">Login</button>
                            </div>
                            <p class="text-center text-sm text-gray-600 mt-4">
                                Don't have an account? <a href="#" id="to-signup" class="text-green-500 font-medium hover:underline">Create account</a>
                            </p>
                        </div>
                    </div>

                    <!-- Signup -->
                    <div id="signup-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('login-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Create Account</h1>
                        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div class="space-y-4">
                                <div>
                                    <label for="signup-name" class="block text-sm font-medium text-gray-800 mb-2">Full Name</label>
                                    <input type="text" id="signup-name" placeholder="Enter full name" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <div id="signup-name-error" class="error-message hidden">Please enter your full name</div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex-1">
                                        <label for="signup-email" class="block text-sm font-medium text-gray-800 mb-2">Email Address</label>
                                        <input type="email" id="signup-email" placeholder="Enter email address" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                        <div id="signup-email-error" class="error-message hidden">Please enter a valid email</div>
                                    </div>
                                    <div class="flex-1">
                                        <label for="signup-phone" class="block text-sm font-medium text-gray-800 mb-2">Phone Number</label>
                                        <input type="tel" id="signup-phone" placeholder="Enter phone number" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                        <div id="signup-phone-error" class="error-message hidden">Please enter your phone number</div>
                                    </div>
                                </div>
                                <div>
                                    <label for="signup-password" class="block text-sm font-medium text-gray-800 mb-2">Password</label>
                                    <input type="password" id="signup-password" placeholder="Enter password" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <div id="signup-password-error" class="error-message hidden">Please enter a password</div>
                                </div>
                                <div>
                                    <label for="signup-address" class="block text-sm font-medium text-gray-800 mb-2">House Address</label>
                                    <input type="text" id="signup-address" placeholder="No. 2 Mile-six road, Jalingo" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <div id="signup-address-error" class="error-message hidden">Please enter your address</div>
                                </div>
                                <button id="signup-btn" class="w-full bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition shadow-md">Create Account</button>
                            </div>
                        </div>
                    </div>

                    <!-- Verification -->
                    <div id="verify-screen" class="booking-modal">
                        ${renderCloseButton()}
                        ${renderBackButton('signup-screen')}
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Verify Order Details</h1>
                        <div id="verify-card" class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                            <h3 id="verify-service" class="text-lg font-semibold text-gray-800 mb-2"></h3>
                            <p id="verify-frequency" class="text-gray-600 text-sm mb-2"></p>
                            <div class="flex gap-2 mb-4">
                                <span id="verify-date" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium"></span>
                                <span id="verify-time" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium"></span>
                            </div>
                            <p id="verify-name" class="text-gray-600 text-sm mb-2"></p>
                            <p id="verify-email" class="text-gray-600 text-sm mb-2"></p>
                            <p id="verify-total" class="text-gray-800 font-semibold"></p>
                        </div>
                        <button id="proceed-payment" class="w-full bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition shadow-md">Proceed to Payment</button>
                    </div>

                    <!-- Additional Service Screens -->
                    ${Object.entries(config.services).map(([service, data]) => {
                        if (service !== 'Lite Regular Cleaning') {
                            const screenId = service.toLowerCase().replace(/ /g, '-') + '-screen';
                            return `
                                <div id="${screenId}" class="booking-modal">
                                    ${renderCloseButton()}
                                    ${renderBackButton('service-screen')}
                                    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Select ${service}</h1>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        ${data.options.map(option => `
                                            <div data-bedroom="${option.name}" data-price="${option.price}" 
                                                class="bedroom-option bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition flex flex-col">
                                                <h3 class="text-lg font-semibold text-gray-800 mb-2">${option.name}</h3>
                                                <p class="text-gray-600 text-sm flex-grow">${option.description}</p>
                                                <p class="text-green-500 font-semibold mt-4">₦${option.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }
                        return '';
                    }).join('')}
                `;

                // Cache screen elements
                document.querySelectorAll('.booking-modal').forEach(el => {
                    screens[el.id] = el;
                });
            }

            // Helper function to render close button
            function renderCloseButton() {
                return `<button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl">×</button>`;
            }

            // Helper function to render back button
            function renderBackButton(targetScreen) {
                return `
                    <a href="#" data-back-to="${targetScreen}" class="flex items-center text-gray-800 font-medium mb-6 hover:text-green-500 transition">
                        <span class="mr-2 text-xl">←</span> Back
                    </a>
                `;
            }

            // Bind all event listeners
            function bindEvents() {
                // Close buttons
                document.querySelectorAll('.close-modal').forEach(button => {
                    button.addEventListener('click', close);
                });

                // Back buttons
                document.querySelectorAll('[data-back-to]').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        goBackTo(button.dataset.backTo);
                    });
                });

                // Location selection
                document.querySelectorAll('.location-option').forEach(option => {
                    option.addEventListener('click', () => {
                        state.location = option.dataset.location;
                        showScreen('service-screen');
                    });
                });

                // Service selection
                document.querySelectorAll('.service-option').forEach(option => {
                    option.addEventListener('click', () => {
                        state.service = option.dataset.service;
                        showScreen(option.dataset.next);
                    });
                });

                // Bedroom/Option selection
                document.querySelectorAll('.bedroom-option').forEach(option => {
                    option.addEventListener('click', () => {
                        state.bedroom = option.dataset.bedroom;
                        state.price = parseFloat(option.dataset.price);
                        showScreen('frequency-screen');
                    });
                });

                // Frequency selection
                document.querySelectorAll('.frequency-option').forEach(option => {
                    option.addEventListener('click', () => {
                        state.frequency = option.dataset.frequency;
                        updateSummary();
                        showScreen('summary-screen');
                    });
                });

                // Summary to Date & Time
                document.getElementById('next-to-date')?.addEventListener('click', () => {
                    showScreen('datetime-screen');
                });

                // Date & Time validation and next step
                document.getElementById('next-to-login')?.addEventListener('click', () => {
                    const dateInput = document.getElementById('date-input');
                    const timeInput = document.getElementById('time-input');
                    let isValid = true;

                    // Validate date
                    if (!dateInput.value) {
                        dateInput.classList.add('input-error');
                        document.getElementById('date-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        dateInput.classList.remove('input-error');
                        document.getElementById('date-error').classList.add('hidden');
                    }

                    // Validate time
                    if (!timeInput.value) {
                        timeInput.classList.add('input-error');
                        document.getElementById('time-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        timeInput.classList.remove('input-error');
                        document.getElementById('time-error').classList.add('hidden');
                    }

                    if (isValid) {
                        state.date = dateInput.value;
                        state.time = timeInput.value;
                        
                        // Check if user has an account
                        if (state.hasAccount) {
                            showScreen('login-screen');
                        } else {
                            showScreen('signup-screen');
                        }
                    }
                });

                // Login form handling
                document.getElementById('login-btn')?.addEventListener('click', () => {
                    const email = document.getElementById('login-email');
                    const password = document.getElementById('login-password');
                    let isValid = true;

                    // Validate email
                    if (!email.value || !validateEmail(email.value)) {
                        email.classList.add('input-error');
                        document.getElementById('login-email-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        email.classList.remove('input-error');
                        document.getElementById('login-email-error').classList.add('hidden');
                    }

                    // Validate password
                    if (!password.value) {
                        password.classList.add('input-error');
                        document.getElementById('login-password-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        password.classList.remove('input-error');
                        document.getElementById('login-password-error').classList.add('hidden');
                    }

                    if (isValid) {
                        state.email = email.value;
                        state.hasAccount = true;
                        updateVerification();
                        showScreen('verify-screen');
                    }
                });

                // Switch to signup
                document.getElementById('to-signup')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    showScreen('signup-screen');
                });

                // Signup form handling
                document.getElementById('signup-btn')?.addEventListener('click', () => {
                    const name = document.getElementById('signup-name');
                    const email = document.getElementById('signup-email');
                    const phone = document.getElementById('signup-phone');
                    const password = document.getElementById('signup-password');
                    const address = document.getElementById('signup-address');
                    let isValid = true;

                    // Validate name
                    if (!name.value) {
                        name.classList.add('input-error');
                        document.getElementById('signup-name-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        name.classList.remove('input-error');
                        document.getElementById('signup-name-error').classList.add('hidden');
                    }

                    // Validate email
                    if (!email.value || !validateEmail(email.value)) {
                        email.classList.add('input-error');
                        document.getElementById('signup-email-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        email.classList.remove('input-error');
                        document.getElementById('signup-email-error').classList.add('hidden');
                    }

                    // Validate phone
                    if (!phone.value) {
                        phone.classList.add('input-error');
                        document.getElementById('signup-phone-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        phone.classList.remove('input-error');
                        document.getElementById('signup-phone-error').classList.add('hidden');
                    }

                    // Validate password
                    if (!password.value) {
                        password.classList.add('input-error');
                        document.getElementById('signup-password-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        password.classList.remove('input-error');
                        document.getElementById('signup-password-error').classList.add('hidden');
                    }

                    // Validate address
                    if (!address.value) {
                        address.classList.add('input-error');
                        document.getElementById('signup-address-error').classList.remove('hidden');
                        isValid = false;
                    } else {
                        address.classList.remove('input-error');
                        document.getElementById('signup-address-error').classList.add('hidden');
                    }

                    if (isValid) {
                        state.name = name.value;
                        state.email = email.value;
                        state.phone = phone.value;
                        state.address = address.value;
                        state.hasAccount = true;
                        updateVerification();
                        showScreen('verify-screen');
                    }
                });

                // Payment
                document.getElementById('proceed-payment')?.addEventListener('click', () => {
                    alert('Proceeding to payment with: ' + JSON.stringify(state, null, 2));
                    close();
                });
            }

            // Validate email
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }

            // Update summary screen
            function updateSummary() {
                const summaryService = document.getElementById('summary-service');
                const summaryFrequency = document.getElementById('summary-frequency');
                const summaryTotal = document.getElementById('summary-total');

                if (summaryService) summaryService.textContent = `${state.bedroom} - ${state.service}`;
                if (summaryFrequency) summaryFrequency.textContent = `Frequency: ${state.frequency}`;
                if (summaryTotal) summaryTotal.textContent = `Total: ₦${state.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
            }

            // Update verification screen
            function updateVerification() {
                const verifyService = document.getElementById('verify-service');
                const verifyFrequency = document.getElementById('verify-frequency');
                const verifyDate = document.getElementById('verify-date');
                const verifyTime = document.getElementById('verify-time');
                const verifyName = document.getElementById('verify-name');
                const verifyEmail = document.getElementById('verify-email');
                const verifyTotal = document.getElementById('verify-total');

                if (verifyService) verifyService.textContent = `${state.bedroom} - ${state.service}`;
                if (verifyFrequency) verifyFrequency.textContent = `Frequency: ${state.frequency}`;
                if (verifyDate) verifyDate.textContent = `📅 ${state.date ? new Date(state.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not selected'}`;
                if (verifyTime) verifyTime.textContent = `🕘 ${state.time || 'Not selected'}`;
                if (verifyName) verifyName.textContent = `Customer's Name: ${state.name || 'Not provided'}`;
                if (verifyEmail) verifyEmail.textContent = `Email Address: ${state.email || 'Not provided'}`;
                if (verifyTotal) verifyTotal.textContent = `Total Price: ₦${state.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
            }

            // Show a specific screen
            function showScreen(screenId) {
                if (currentScreen) {
                    const current = screens[currentScreen];
                    current.classList.add('animate-slide-out');
                    setTimeout(() => {
                        current.classList.add('hidden');
                        current.classList.remove('animate-slide-out');
                        displayScreen(screenId);
                    }, 300);
                } else {
                    displayScreen(screenId);
                }
                
                // Only add to history if it's not already the current screen
                if (history[history.length - 1] !== screenId) {
                    history.push(screenId);
                }
            }

            // Display a screen (internal use)
            function displayScreen(screenId) {
                Object.values(screens).forEach(screen => {
                    screen.classList.add('hidden');
                });

                const screen = screens[screenId];
                if (screen) {
                    screen.classList.remove('hidden');
                    screen.classList.add('animate-slide-in');
                    currentScreen = screenId;
                }
            }

            // Go back to a specific screen
            function goBackTo(targetScreen) {
                // Find the index of the screen we're coming from
                const fromIndex = history.lastIndexOf(currentScreen);
                
                // Find the index of the screen we want to go back to
                const toIndex = history.lastIndexOf(targetScreen);
                
                if (fromIndex !== -1 && toIndex !== -1 && toIndex < fromIndex) {
                    // Slice the history to remove screens after the target
                    history = history.slice(0, toIndex + 1);
                    showScreen(targetScreen);
                } else {
                    // Fallback to default behavior
                    history.pop();
                    const previousScreen = history[history.length - 1] || 'location-screen';
                    showScreen(previousScreen);
                }
            }

            // Open the booking system
            function open() {
                // Reset state
                state = {
                    location: null,
                    service: null,
                    bedroom: null,
                    price: null,
                    frequency: null,
                    date: null,
                    time: null,
                    name: null,
                    email: null,
                    phone: null,
                    address: null,
                    hasAccount: false
                };
                history = [];
                
                // Initialize if not already done
                if (Object.keys(screens).length === 0) {
                    init();
                }
                
                // Show the first screen
                showScreen('location-screen');
            }

            // Close the booking system
            function close() {
                Object.values(screens).forEach(screen => {
                    screen.classList.add('hidden');
                });
                currentScreen = null;
                history = [];
            }

            // Public API
            return {
                init,
                open,
                close,
                config: () => config // Optional: expose config if you want to modify it
            };
        })();

        // Initialize the booking system when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            BookingSystem.init();
        });
