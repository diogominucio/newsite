// Login page handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    // Check if authService is available
    if (typeof authService === 'undefined') {
        console.error('AuthService not loaded');
        return;
    }

    // Check if already authenticated (only once, without redirect loop)
    if (authService.isAuthenticated() && !sessionStorage.getItem('login_check_done')) {
        sessionStorage.setItem('login_check_done', 'true');
        window.location.replace('dashboard-bloomberg.html');
        return;
    }
    sessionStorage.removeItem('login_check_done');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('.btn-login');

        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Authenticating...</span>';
        errorMessage.style.display = 'none';

        try {
            const result = await authService.login(username, password);

            if (result.success) {
                // Success - redirect to dashboard
                submitBtn.innerHTML = '<span>Success! Redirecting...</span>';
                setTimeout(() => {
                    window.location.replace('dashboard-bloomberg.html');
                }, 500);
            } else {
                // Authentication error
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Sign In</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Error processing login. Please try again.';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Sign In</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    });

    // Easter egg - show credentials in development mode
    let clickCount = 0;
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                console.log('%c🔐 Development Credentials', 'color: #667eea; font-size: 16px; font-weight: bold;');
                console.log('admin / selectblinds2024');
                console.log('analytics / analytics@sb');
                console.log('manager / manager123');
                clickCount = 0;
            }
        });
    }
});
