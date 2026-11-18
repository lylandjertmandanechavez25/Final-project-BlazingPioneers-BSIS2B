document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const alertBox = document.getElementById('alertBox') || document.querySelector('.alert');
    if (!form) return;

    const isRegister = window.location.pathname.includes('register.html');
    const isLogin = window.location.pathname.includes('login.html');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('input');
        const users = JSON.parse(localStorage.getItem('ibulfas_users')) || [];

        if (isRegister) {
            const userData = {
                buId: inputs[0]?.value.trim(),
                fullName: inputs[1]?.value.trim(),
                email: inputs[2]?.value.trim(),
                contact: inputs[3]?.value.trim(),
                course: inputs[4]?.value.trim(),
                password: inputs[5]?.value,
                confirmPassword: inputs[6]?.value,
                role: 'informant'
            };

            if (userData.password !== userData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (users.some(u => u.email === userData.email || u.buId === userData.buId)) {
                alert('An account with this BU ID or Email already exists.');
                return;
            }

            delete userData.confirmPassword;
            users.push(userData);
            localStorage.setItem('ibulfas_users', JSON.stringify(users));

            if (alertBox) {
                alertBox.className = 'alert alert-success';
                alertBox.textContent = 'Account registered successfully! Redirecting to login...';
            }
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
        }

        if (isLogin) {
            const identifier = inputs[0]?.value.trim();
            const password = inputs[1]?.value;
            const matchedUser = users.find(
                u => (u.email === identifier || u.buId === identifier) && u.password === password
            );

            if (!matchedUser) {
                alert('Invalid email/BU ID or password.');
                return;
            }

            localStorage.setItem('ibulfas_current_user', JSON.stringify(matchedUser));
            window.location.href = 'dashboard.html';
        }
    });
});