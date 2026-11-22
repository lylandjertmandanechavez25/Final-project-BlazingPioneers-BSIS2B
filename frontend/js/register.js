document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');
    const alertBox = document.querySelector('.alert') || document.getElementById('alertBox');

    if (!registerForm) return;

    const API_URL = 'http://localhost:8080';

    function showMessage(message, type) {
        if (alertBox) {
            alertBox.className = `alert alert-${type}`;
            alertBox.textContent = message;
        } else {
            alert(message);
        }
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll('input');
        const userData = {
            buId: inputs[0]?.value.trim(),
            fullName: inputs[1]?.value.trim(),
            email: inputs[2]?.value.trim(),
            contact: inputs[3]?.value.trim(),
            course: inputs[4]?.value.trim(),
            password: inputs[5]?.value
        };
        const confirmPassword = inputs[6]?.value;

        if (userData.password !== confirmPassword) {
            showMessage('Passwords do not match!', 'danger');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Account registered successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1200);
            } else {
                showMessage(data.message || 'Registration failed.', 'danger');
            }
        } catch (err) {
            showMessage('Could not reach the server. Is it running?', 'danger');
        }
    });
});