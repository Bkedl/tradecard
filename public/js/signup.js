document.getElementById('signupForm').addEventListener('submit', function (event) {
    var dob = new Date(document.getElementById('dob').value);
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var passwordMismatchAlert = document.getElementById('passwordMismatchAlert');
    var ageAlert = document.getElementById('ageAlert');

    if (age < 13) {
        ageAlert.style.display = 'block';
        event.preventDefault();
    } else {
        ageAlert.style.display = 'none';
    }

    if (password !== confirmPassword) {
        passwordMismatchAlert.style.display = 'block';
        event.preventDefault();
    } else {
        passwordMismatchAlert.style.display = 'none';
    }
});

