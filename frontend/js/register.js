document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');
    const alertBox = document.querySelector('.alert') || document.getElementById('alertBox');

    if (!registerForm) return;

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll('input');
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

        const users = JSON.parse(localStorage.getItem('ibulfas_users')) || [];

        const exists = users.some(u => u.email === userData.email || u.buId === userData.buId);
        if (exists) {
            alert('An account with this BU ID or Email already exists.');
            return;
        }

        delete userData.confirmPassword;
        users.push(userData);
        localStorage.setItem('ibulfas_users', JSON.stringify(users));

        if (alertBox) {
            alertBox.className = 'alert alert-success';
            alertBox.textContent = 'Account registered successfully! Redirecting to login...';
        } else {
            alert('Account registered successfully!');
        }

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
    });
});