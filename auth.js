// Sistema de autenticação do dashboard
class AuthService {
    constructor() {
        this.TOKEN_KEY = 'sb_dashboard_token';
        this.USER_KEY = 'sb_dashboard_user';
    }

    // Credenciais (em produção, isso deve vir de um backend seguro)
    // Por enquanto, usando credenciais hardcoded para demonstração
    static CREDENTIALS = {
        'admin': 'selectblinds2024',
        'analytics': 'analytics@sb',
        'manager': 'manager123'
    };

    async login(username, password) {
        // Simula uma chamada de API com delay
        await this.delay(800);

        // Valida credenciais
        if (AuthService.CREDENTIALS[username] && AuthService.CREDENTIALS[username] === password) {
            const token = this.generateToken(username);
            const user = {
                username: username,
                role: this.getUserRole(username),
                loginTime: new Date().toISOString()
            };

            // Salva no localStorage
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));

            return { success: true, user, token };
        }

        return { success: false, message: 'Usuário ou senha incorretos' };
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

// Inicializa o serviço de autenticação
const authService = new AuthService();

// Manipula o formulário de login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Verifica se já está autenticado
    if (authService.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('.btn-login');

        // Mostra loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Autenticando...</span>';
        errorMessage.style.display = 'none';

        try {
            const result = await authService.login(username, password);

            if (result.success) {
                // Sucesso - redireciona para o dashboard
                submitBtn.innerHTML = '<span>Sucesso! Redirecionando...</span>';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
            } else {
                // Erro de autenticação
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Entrar</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        } catch (error) {
            console.error('Erro no login:', error);
            errorMessage.textContent = 'Erro ao processar login. Tente novamente.';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Entrar</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    });

    // Easter egg - mostra credenciais em modo de desenvolvimento
    let clickCount = 0;
    document.querySelector('.logo').addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            console.log('%c🔐 Credenciais de Desenvolvimento', 'color: #667eea; font-size: 16px; font-weight: bold;');
            console.log('admin / selectblinds2024');
            console.log('analytics / analytics@sb');
            console.log('manager / manager123');
            clickCount = 0;
        }
    });
});
