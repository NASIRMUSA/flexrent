function openModal(){
class BookingManager {
    constructor() {
        this.screens = [
            'location-screen', 'service-screen', 'bedroom-screen', 'frequency-screen',
            'summary-screen', 'datetime-screen', 'login-screen', 'signup-screen',
            'verify-screen', 'deepcleaning-screen', 'rugs-screen', 'fumigation-screen'
        ];
        this.currentScreen = null;
        this.state = {
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
        this.history = [];
        this.init();
    }

    init() {
        // Event listeners for opening modal
        document.getElementById('open-modal').addEventListener('click', () => this.showScreen('location-screen'));

        // Close buttons for all modals
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => this.closeAll());
        });

        // Back buttons
        document.getElementById('back-to-location').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('service-screen', 'location-screen');
        });
        document.getElementById('back-to-service').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('bedroom-screen', 'service-screen');
        });
        document.getElementById('back-to-bedroom').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('frequency-screen', 'bedroom-screen');
        });
        document.getElementById('back-to-frequency').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('summary-screen', 'frequency-screen');
        });
        document.getElementById('back-to-summary').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('datetime-screen', 'summary-screen');
        });
        document.getElementById('back-to-datetime').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('login-screen', 'datetime-screen');
        });
        document.getElementById('back-to-login').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('signup-screen', 'login-screen');
        });
        document.getElementById('back-to-signup').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('verify-screen', 'signup-screen');
        });
        document.getElementById('back-to-service-deep').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('deepcleaning-screen', 'service-screen');
        });
        document.getElementById('back-to-service-rugs').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('rugs-screen', 'service-screen');
        });
        document.getElementById('back-to-service-fumigation').addEventListener('click', (e) => { 
            e.preventDefault(); 
            this.goBackTo('fumigation-screen', 'service-screen');
        });

        // Location selection
        document.querySelectorAll('.location-option').forEach(option => {
            option.addEventListener('click', () => {
                this.state.location = option.dataset.location;
                this.showScreen('service-screen');
            });
        });

        // Service selection
        document.querySelectorAll('.service-option').forEach(option => {
            option.addEventListener('click', () => {
                this.state.service = option.dataset.service;
                this.showScreen(option.dataset.next);
            });
        });

        // Bedroom/Option selection
        document.querySelectorAll('.bedroom-option').forEach(option => {
            option.addEventListener('click', () => {
                this.state.bedroom = option.dataset.bedroom;
                this.state.price = parseFloat(option.dataset.price);
                this.showScreen('frequency-screen');
            });
        });

        // Frequency selection
        document.querySelectorAll('.frequency-option').forEach(option => {
            option.addEventListener('click', () => {
                this.state.frequency = option.dataset.frequency;
                this.updateSummary();
                this.showScreen('summary-screen');
            });
        });

        // Summary to Date & Time
        document.getElementById('next-to-date').addEventListener('click', () => {
            this.showScreen('datetime-screen');
        });

        // Date & Time validation and next step
        document.getElementById('next-to-login').addEventListener('click', () => {
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
                this.state.date = dateInput.value;
                this.state.time = timeInput.value;
                
                // Check if user has an account
                if (this.state.hasAccount) {
                    this.showScreen('login-screen');
                } else {
                    this.showScreen('signup-screen');
                }
            }
        });

        // Login form handling
        document.getElementById('login-btn').addEventListener('click', () => {
            const email = document.getElementById('login-email');
            const password = document.getElementById('login-password');
            let isValid = true;

            // Validate email
            if (!email.value || !this.validateEmail(email.value)) {
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
                this.state.email = email.value;
                this.state.hasAccount = true;
                this.updateVerification();
                this.showScreen('verify-screen');
            }
        });

        // Switch to signup
        document.getElementById('to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('signup-screen');
        });

        // Signup form handling
        document.getElementById('signup-btn').addEventListener('click', () => {
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
            if (!email.value || !this.validateEmail(email.value)) {
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
                this.state.name = name.value;
                this.state.email = email.value;
                this.state.phone = phone.value;
                this.state.address = address.value;
                this.state.hasAccount = true;
                this.updateVerification();
                this.showScreen('verify-screen');
            }
        });

        // Payment
        document.getElementById('proceed-payment').addEventListener('click', () => {
            alert('Proceeding to payment with: ' + JSON.stringify(this.state, null, 2));
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    updateSummary() {
        document.getElementById('summary-service').textContent = `${this.state.bedroom} - ${this.state.service}`;
        document.getElementById('summary-frequency').textContent = `Frequency: ${this.state.frequency}`;
        document.getElementById('summary-total').textContent = `Total: ₦${this.state.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    }

    updateVerification() {
        document.getElementById('verify-service').textContent = `${this.state.bedroom} - ${this.state.service}`;
        document.getElementById('verify-frequency').textContent = `Frequency: ${this.state.frequency}`;
        document.getElementById('verify-date').textContent = `📅 ${this.state.date ? new Date(this.state.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not selected'}`;
        document.getElementById('verify-time').textContent = `🕘 ${this.state.time || 'Not selected'}`;
        document.getElementById('verify-name').textContent = `Customer's Name: ${this.state.name || 'Not provided'}`;
        document.getElementById('verify-email').textContent = `Email Address: ${this.state.email || 'Not provided'}`;
        document.getElementById('verify-total').textContent = `Total Price: ₦${this.state.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    }

    showScreen(screenId) {
        if (this.currentScreen) {
            const current = document.getElementById(this.currentScreen);
            current.classList.add('animate-slide-out');
            setTimeout(() => {
                current.classList.add('hidden');
                current.classList.remove('animate-slide-out');
                this.displayScreen(screenId);
            }, 300);
        } else {
            this.displayScreen(screenId);
        }
        
        // Only add to history if it's not already the current screen
        if (this.history[this.history.length - 1] !== screenId) {
            this.history.push(screenId);
        }
    }

    displayScreen(screenId) {
        this.screens.forEach(id => {
            const element = document.getElementById(id);
            element.classList.toggle('hidden', id !== screenId);
            if (id === screenId) {
                element.classList.add('animate-slide-in');
                this.currentScreen = screenId;
            }
        });
    }

    goBackTo(fromScreen, toScreen) {
        // Find the index of the screen we're coming from
        const fromIndex = this.history.lastIndexOf(fromScreen);
        
        // Find the index of the screen we want to go back to
        const toIndex = this.history.lastIndexOf(toScreen);
        
        if (fromIndex !== -1 && toIndex !== -1 && toIndex < fromIndex) {
            // Slice the history to remove screens after the target
            this.history = this.history.slice(0, toIndex + 1);
            this.showScreen(toScreen);
        } else {
            // Fallback to default behavior
            this.history.pop();
            const previousScreen = this.history[this.history.length - 1] || 'location-screen';
            this.showScreen(previousScreen);
        }
    }

    closeAll() {
        this.screens.forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
        this.currentScreen = null;
        this.history = [];
        this.state = {
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
    }
}

// Initialize the booking manager
const booking = new BookingManager();
}