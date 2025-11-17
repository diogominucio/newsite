// Authentication Service for SelectBlinds Dashboard
class AuthService {
    constructor() {
        this.TOKEN_KEY = 'sb_dashboard_token';
        this.USER_KEY = 'sb_dashboard_user';
    }

    // Demo credentials (in production, use secure backend authentication)
    static CREDENTIALS = {
        'admin': 'selectblinds2024',
        'analytics': 'analytics@sb',
        'manager': 'manager123'
    };

    async login(username, password) {
        // Simulate API call
        await this.delay(800);

        // Validate credentials
        if (AuthService.CREDENTIALS[username] && AuthService.CREDENTIALS[username] === password) {
            const token = this.generateToken(username);
            const user = {
                username: username,
                role: this.getUserRole(username),
                loginTime: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));

            return { success: true, user, token };
        }

        return { success: false, message: 'Invalid username or password' };
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const user = localStorage.getItem(this.USER_KEY);
        return !!(token && user);
    }

    getUser() {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getUserRole(username) {
        const roles = {
            'admin': 'Administrator',
            'analytics': 'Analytics Manager',
            'manager': 'Store Manager'
        };
        return roles[username] || 'User';
    }

    generateToken(username) {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2);
        return btoa(`${username}:${timestamp}:${random}`);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize authentication service globally
window.authService = new AuthService();
