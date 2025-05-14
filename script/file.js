// --- Global State ---
let bookingData = {
    location: null,
    serviceType: null,
    specificService: null,
    price: 0,
    frequency: null,
    date: null,
    time: null,
    userName: null,
    userEmail: null,
    userPhone: null,
    userAddress: null,
    userPassword: null, // Storing password client-side is generally unsafe,
                       // but included as per original form. Be cautious.
    previousStepForFrequency: null // To track where 'Back' from frequency goes
};

const modalOverlay = document.getElementById('bookingModalOverlay');
const allSteps = document.querySelectorAll('.modal-step');
const verificationDetailsDiv = document.getElementById('verificationDetails');

// --- Modal Control ---
function openBookingModal() {
    resetBooking(); // Clear previous data
    modalOverlay.style.display = 'flex';
    showStep('location'); // Start at the first step
}

function closeBookingModal() {
    modalOverlay.style.display = 'none';
    // Optionally reset form data if modal is closed midway
    // resetBooking();
}

function resetBooking() {
     bookingData = {
        location: null, serviceType: null, specificService: null, price: 0,
        frequency: null, date: null, time: null, userName: null, userEmail: null,
        userPhone: null, userAddress: null, userPassword: null, previousStepForFrequency: null
    };
    // Clear any 'selected' classes
    document.querySelectorAll('.selectable-item.selected').forEach(el => el.classList.remove('selected'));
    // Clear form fields (optional, but good practice)
    const form = document.getElementById('createAccountForm');
    if (form) form.reset();
    document.getElementById('booking-date').value = '';
    document.getElementById('booking-time').value = '';
}

// --- Navigation ---
function showStep(stepId) {
    allSteps.forEach(step => {
        step.style.display = (step.id === stepId) ? 'block' : 'none';
    });
    // Add selected class to the current step's trigger if applicable (visual feedback)
    // Example: If coming from 'selectService', highlight the chosen service type
}

// --- Selection Functions ---

function handleSelection(element, nextStepId) {
    // Remove 'selected' from siblings within the same parent container
    const parent = element.parentElement;
    parent.querySelectorAll('.selectable-item.selected').forEach(sib => sib.classList.remove('selected'));
    // Add 'selected' to the clicked element
    element.classList.add('selected');
    // Proceed to the next step
    if (nextStepId) {
        showStep(nextStepId);
    }
}

function selectLocation(locationName, nextStepId) {
    const element = event.currentTarget; // Get the div that was clicked
    bookingData.location = locationName;
    console.log("Location selected:", bookingData.location);
    handleSelection(element, nextStepId);
}

function selectServiceType(serviceTypeName, price, nextStepId) {
    const element = event.currentTarget; // Get the div that was clicked
    bookingData.serviceType = serviceTypeName;
    // Reset specific service if type changes
    bookingData.specificService = null;
    bookingData.price = price; // Base price if applicable, specific service overrides later
    bookingData.previousStepForFrequency = nextStepId; // Store where 'back' from frequency should go
    console.log("Service Type selected:", bookingData.serviceType);
    handleSelection(element, nextStepId);
}

function selectSpecificService(element, nextStepId) {
    // element is the div clicked (passed via 'this')
    bookingData.specificService = element.dataset.serviceName;
    bookingData.price = parseFloat(element.dataset.price) || 0; // Get price from data attribute
    console.log("Specific Service selected:", bookingData.specificService, "Price:", bookingData.price);
    handleSelection(element, nextStepId);
}

function selectFrequency(frequencyName, nextStepId) {
    const element = event.currentTarget; // Get the div that was clicked
    bookingData.frequency = frequencyName;
    console.log("Frequency selected:", bookingData.frequency);
    handleSelection(element, nextStepId);
}

function selectDateTime(nextStepId) {
    const dateInput = document.getElementById('booking-date');
    const timeInput = document.getElementById('booking-time');

    if (!dateInput.value || !timeInput.value) {
        alert("Please select both a date and a time.");
        return; // Prevent moving to next step
    }

    bookingData.date = dateInput.value;
    bookingData.time = timeInput.value;
    console.log("Date/Time selected:", bookingData.date, bookingData.time);
    showStep(nextStepId);
}

function goBackToSpecificService() {
    // Go back to the step stored when the service type was selected
    if (bookingData.previousStepForFrequency) {
        showStep(bookingData.previousStepForFrequency);
    } else {
        showStep('selectService'); // Fallback
    }
}


// --- Account Creation & Summary ---
function createAccountAndProceed(nextStepId) {
    // Get form data
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('signup-email');
    const phoneInput = document.getElementById('phone');
    // const passwordInput = document.getElementById('signup-password');
    const addressInput = document.getElementById('address');

    // Basic validation (HTML5 'required' helps, but JS validation is good too)
    if (!nameInput.value || !emailInput.value || !phoneInput.value || !addressInput.value) {
        alert("Please fill in all account details.");
        return;
    }

    bookingData.userName = nameInput.value;
    bookingData.userEmail = emailInput.value;
    bookingData.userPhone = phoneInput.value;
    // bookingData.userPassword = passwordInput.value; // Again, be careful storing passwords
    bookingData.userAddress = addressInput.value;

    console.log("Account Data captured:", bookingData.userName, bookingData.userEmail, bookingData.userPhone);

    // Populate the verification step
    populateVerificationDetails();

    // Show verification step
    showStep(nextStepId);
}

function populateVerificationDetails() {
    document.getElementById('verify-service').textContent = `${bookingData.specificService || bookingData.serviceType || 'N/A'}`;
    document.getElementById('verify-frequency').textContent = `Frequency: ${bookingData.frequency || 'N/A'}`;
    document.getElementById('verify-date').textContent = bookingData.date ? formatDate(bookingData.date) : 'N/A';
    document.getElementById('verify-time').textContent = bookingData.time ? formatTime(bookingData.time) : 'N/A';
    document.getElementById('verify-location').textContent = bookingData.location || 'N/A';
    document.getElementById('verify-name').textContent = bookingData.userName || 'N/A';
    document.getElementById('verify-email').textContent = bookingData.userEmail || 'N/A';
    document.getElementById('verify-phone').textContent = bookingData.userPhone || 'N/A';
    document.getElementById('verify-address').textContent = bookingData.userAddress || 'N/A';
    document.getElementById('verify-price').textContent = `₦${bookingData.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
}


// --- Final Action: Send to WhatsApp ---
function proceedToPayment() {
    const whatsappNumber = "+2348100353337"; // Make sure the number is correct

    // Ensure all necessary data is present
    if (!bookingData.serviceType || !bookingData.userName || !bookingData.userPhone || !bookingData.date || !bookingData.time) {
         alert("Some booking details are missing. Please go back and complete the steps.");
         // Optionally, navigate back to a relevant step
         // showStep('location');
         return;
    }

    // Construct the message
    let message = `*New Cleaning Service Booking Request*\n\n`;
    message += `*Service:* ${bookingData.specificService || bookingData.serviceType}\n`;
    if (bookingData.location) message += `*Location:* ${bookingData.location}\n`;
    if (bookingData.frequency) message += `*Frequency:* ${bookingData.frequency}\n`;
    if (bookingData.date) message += `*Date:* ${formatDate(bookingData.date)}\n`;
    if (bookingData.time) message += `*Time:* ${formatTime(bookingData.time)}\n`;
    message += `*Price Estimate:* ₦${bookingData.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
    message += `*Customer Details:*\n`;
    message += `*Name:* ${bookingData.userName}\n`;
    if (bookingData.userEmail) message += `*Email:* ${bookingData.userEmail}\n`;
    message += `*Phone:* ${bookingData.userPhone}\n`;
    if (bookingData.userAddress) message += `*Address:* ${bookingData.userAddress}\n`;
    message += `\n_Please confirm availability and payment details._`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create the WhatsApp link
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    console.log("Generated WhatsApp URL:", whatsappUrl);
    console.log("Message Content:\n", message); // Log the raw message for debugging

    // Redirect the user to WhatsApp
    window.open(whatsappUrl, '_blank'); // Open in new tab is safer

    // Optional: Close the modal after sending
    // closeBookingModal();
    // Optional: Show a success message on the page
    // alert("Your booking request has been prepared for WhatsApp!");
}


// --- Utility Functions ---
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
     if (!timeString) return 'N/A';
     // Basic time formatting, might need adjustment based on input format
     let [hours, minutes] = timeString.split(':');
     hours = parseInt(hours, 10);
     const ampm = hours >= 12 ? 'PM' : 'AM';
     hours = hours % 12;
     hours = hours ? hours : 12; // the hour '0' should be '12'
     minutes = minutes.padStart(2, '0');
     return `${hours}:${minutes} ${ampm}`;
}

// --- Initial Setup ---
// Ensure the first step is hidden initially by JS too, matching CSS
document.addEventListener('DOMContentLoaded', () => {
    allSteps.forEach(step => step.style.display = 'none');
     // Add event listeners if you prefer them over onclick attributes
     // e.g., document.getElementById('someButton').addEventListener('click', someFunction);
});