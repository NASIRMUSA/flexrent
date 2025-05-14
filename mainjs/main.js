   // You'll need to update your JavaScript to handle the new animations
      function showStep(stepId) {
        // Get current active step
        const currentStep = document.querySelector('.modal-step:not(.hidden)');
        const nextStep = document.getElementById(stepId);
        
        if (currentStep) {
          currentStep.classList.add('step-exit');
          setTimeout(() => {
            currentStep.classList.add('hidden');
            currentStep.classList.remove('step-exit');
            
            nextStep.classList.remove('hidden');
            nextStep.classList.add('step-enter');
            
            setTimeout(() => {
              nextStep.classList.remove('step-enter');
              // Scroll to top of the step
              nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 10);
          }, 200);
        } else {
          nextStep.classList.remove('hidden');
          nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      
      function openBookingModal() {
        const modal = document.getElementById('bookingModalOverlay');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        showStep('location');
      }
      
      function closeBookingModal() {
        const modal = document.getElementById('bookingModalOverlay');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Hide all steps
        document.querySelectorAll('.modal-step').forEach(step => {
          step.classList.add('hidden');
        });
      }
      
      // Other existing functions would remain the same
      function selectLocation(location, nextStep) {
        showStep(nextStep);
      }
      
      function selectServiceType(service, price, nextStep) {
        showStep(nextStep);
      }
      
      function selectSpecificService(element, nextStep) {
        // Remove selected class from all options
        document.querySelectorAll('.selectable-item').forEach(item => {
          item.classList.remove('selected');
        });
        // Add selected class to clicked option
        element.classList.add('selected');
        showStep(nextStep);
      }
      
      function selectFrequency(frequency, nextStep) {
        showStep(nextStep);
      }
      
      function selectDateTime(nextStep) {
        showStep(nextStep);
      }
      
      function createAccountAndProceed(nextStep) {
        showStep(nextStep);
      }
      
      function proceedToPayment() {
        // Payment logic here
      }
      
      function goBackToSpecificService() {
        // Logic to determine which service type to go back to
        showStep('selectService');
      }