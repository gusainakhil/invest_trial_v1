// Mobile Investment App - Main JavaScript
class InvestmentApp {
  constructor() {
    this.currentScreen = 'loading-screen';
    this.currentSlide = 0;
    this.selectedPlan = null;
    this.userData = {
      name: 'Akhil',
      email: 'akhil.golu@email.com',
      phone: '+91 98765 43210',
      totalInvestment: 45000,
      activePlans: 3
    };
    
    this.plans = {
      basic: {
        name: 'Basic Plan',
        amount: 10000,
        benefits: [
          '🛒 ₹2,000 grocery vouchers',
          '📱 Free mobile recharge',
          '🎯 6% annual returns',
          '💳 Monthly benefits credit'
        ]
      },
      premium: {
        name: 'Premium Plan',
        amount: 25000,
        benefits: [
          '🛒 ₹5,000 grocery vouchers',
          '🏪 Shopping discounts',
          '🎯 8% annual returns',
          '✈️ Travel insurance',
          '💎 Priority support'
        ]
      },
      gold: {
        name: 'Gold Plan',
        amount: 50000,
        benefits: [
          '🛒 ₹10,000 grocery vouchers',
          '✈️ Travel benefits',
          '🎯 10% annual returns',
          '🏥 Health insurance',
          '🎁 Exclusive rewards',
          '💼 Personal advisor'
        ]
      }
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startApp();
  }

  setupEventListeners() {
    // Onboarding
    document.getElementById('skip-btn').addEventListener('click', () => this.showScreen('auth-screen'));
    document.getElementById('next-btn').addEventListener('click', () => this.nextSlide());
    
    // Slide indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
    });

    // Auth forms
    document.querySelectorAll('#signin-form form, #signup-form form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAuth();
      });
    });

    // Forgot password
    document.getElementById('forgot-password-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.showScreen('forgot-password-screen');
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => this.goBack());
    });

    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const screen = item.dataset.screen + '-screen';
        this.showScreen(screen);
        this.setActiveNavItem(item);
      });
    });

    // Dashboard actions
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.showScreen(action + '-screen');
      });
    });

    // Plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', () => {
        const planType = card.dataset.plan;
        this.showPlanDetails(planType);
      });
    });

    // Plan details buy button
    document.getElementById('buy-plan-btn').addEventListener('click', () => {
      this.showScreen('payment-screen');
    });

    // Payment
    document.getElementById('proceed-payment-btn').addEventListener('click', () => {
      this.processPayment();
    });

    // Success/failure actions
    document.getElementById('goto-dashboard-btn').addEventListener('click', () => {
      this.showScreen('dashboard-screen');
    });

    document.getElementById('retry-payment-btn').addEventListener('click', () => {
      this.showScreen('payment-screen');
    });

    document.getElementById('back-to-plans-btn').addEventListener('click', () => {
      this.showScreen('plans-screen');
    });

    // Profile actions
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.logout();
    });

    // FAQ toggle
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
      });
    });

    // Notification button
    document.querySelector('.notification-btn').addEventListener('click', () => {
      this.showScreen('notifications-screen');
    });
  }

  startApp() {
    // Show loading screen first
    setTimeout(() => {
      this.showScreen('splash-screen');
      setTimeout(() => {
        this.showScreen('onboarding-screen');
      }, 2000);
    }, 1500);
  }

  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.currentScreen = screenId;
    }

    // Show/hide bottom nav
    const navScreens = ['dashboard-screen', 'plans-screen', 'history-screen', 'profile-screen', 'settings-screen'];
    const bottomNav = document.getElementById('bottom-nav');
    
    if (navScreens.includes(screenId)) {
      bottomNav.style.display = 'flex';
    } else {
      bottomNav.style.display = 'none';
    }
  }

  nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const nextBtn = document.getElementById('next-btn');

    if (this.currentSlide < slides.length - 1) {
      // Move to next slide
      slides[this.currentSlide].classList.remove('active');
      indicators[this.currentSlide].classList.remove('active');
      
      this.currentSlide++;
      
      slides[this.currentSlide].classList.add('active');
      indicators[this.currentSlide].classList.add('active');

      // Change button text on last slide
      if (this.currentSlide === slides.length - 1) {
        nextBtn.textContent = 'Get Started';
      }
    } else {
      // Go to auth screen
      this.showScreen('auth-screen');
    }
  }

  goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    slides[this.currentSlide].classList.remove('active');
    indicators[this.currentSlide].classList.remove('active');

    this.currentSlide = index;

    slides[this.currentSlide].classList.add('active');
    indicators[this.currentSlide].classList.add('active');

    // Update button text
    const nextBtn = document.getElementById('next-btn');
    if (this.currentSlide === slides.length - 1) {
      nextBtn.textContent = 'Get Started';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(tabBtn => {
      tabBtn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update form visibility
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
  }

  handleAuth() {
    // Simulate authentication
    this.showScreen('dashboard-screen');
    this.setActiveNavItem(document.querySelector('[data-screen="dashboard"]'));
  }

  logout() {
    this.showScreen('auth-screen');
    this.currentSlide = 0;
  }

  goBack() {
    // Simple back navigation logic
    const backMap = {
      'forgot-password-screen': 'auth-screen',
      'plan-details-screen': 'plans-screen',
      'payment-screen': 'plan-details-screen',
      'notifications-screen': 'dashboard-screen'
    };

    const backScreen = backMap[this.currentScreen] || 'dashboard-screen';
    this.showScreen(backScreen);
  }

  setActiveNavItem(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    activeItem.classList.add('active');
  }

  showPlanDetails(planType) {
    this.selectedPlan = planType;
    const plan = this.plans[planType];

    // Update plan details screen
    document.getElementById('plan-title').textContent = plan.name;
    document.getElementById('plan-amount').textContent = `₹${plan.amount.toLocaleString()}`;
    document.getElementById('plan-subtitle').textContent = plan.name;

    // Update benefits list
    const benefitsList = document.getElementById('plan-benefits-list');
    benefitsList.innerHTML = plan.benefits.map(benefit => 
      `<div class="benefit">${benefit}</div>`
    ).join('');

    // Update payment summary
    document.getElementById('payment-plan').textContent = plan.name;
    document.getElementById('payment-amount').textContent = `₹${plan.amount.toLocaleString()}`;
    document.getElementById('payment-total').textContent = `₹${plan.amount.toLocaleString()}`;

    this.showScreen('plan-details-screen');
  }

  processPayment() {
    // Simulate payment processing
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-content';
    loadingEl.innerHTML = '<div class="spinner"></div><p>Processing payment...</p>';
    
    const paymentScreen = document.getElementById('payment-screen');
    const originalContent = paymentScreen.innerHTML;
    
    paymentScreen.innerHTML = '';
    paymentScreen.appendChild(loadingEl);
    paymentScreen.style.display = 'flex';
    paymentScreen.style.alignItems = 'center';
    paymentScreen.style.justifyContent = 'center';

    setTimeout(() => {
      // Restore original content
      paymentScreen.innerHTML = originalContent;
      paymentScreen.style.display = '';
      paymentScreen.style.alignItems = '';
      paymentScreen.style.justifyContent = '';

      // Re-setup event listeners for the payment screen
      this.setupEventListeners();

      // Simulate success/failure
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        this.showPaymentSuccess();
      } else {
        this.showScreen('payment-failed-screen');
      }
    }, 3000);
  }

  showPaymentSuccess() {
    // Generate transaction ID
    const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('transaction-id').textContent = transactionId;
    
    const plan = this.plans[this.selectedPlan];
    document.getElementById('success-plan').textContent = plan.name;
    document.getElementById('success-amount').textContent = `₹${plan.amount.toLocaleString()}`;

    this.showScreen('payment-success-screen');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.investmentApp = new InvestmentApp();
});
