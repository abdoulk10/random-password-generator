
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("password-form");
    const generatedPasswordField = document.getElementById("generated-password");
    const copyButton = document.getElementById("copy-password");
    const strengthField = document.getElementById("password-strength");
    const compositionChart = document.getElementById("composition-chart");
    const strengthChart = document.getElementById("strength-chart");

    const generatePassword = (length, includeUppercase, includeNumbers, includeSymbols) => {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_+[]{}|;:',.<>?";

        let allChars = lowercaseChars;
        if (includeUppercase) allChars += uppercaseChars;
        if (includeNumbers) allChars += numberChars;
        if (includeSymbols) allChars += symbolChars;

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            password += allChars[randomIndex];
        }

        return password;
    };

    const analyzePassword = (password) => {
        let strength = "Weak";
        if (password.length >= 12) {
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSymbols = /[^a-zA-Z\d]/.test(password);

            if (hasUppercase && hasNumbers && hasSymbols) {
                strength = "Strong";
            } else if ((hasUppercase && hasNumbers) || (hasNumbers && hasSymbols)) {
                strength = "Moderate";
            }
        }
        return strength;
    };

    const updateStrengthField = (strength) => {
        strengthField.textContent = strength;
    };

    const updateCompositionChart = (password) => {
        const counts = {
            lowercase: (password.match(/[a-z]/g) || []).length,
            uppercase: (password.match(/[A-Z]/g) || []).length,
            numbers: (password.match(/\d/g) || []).length,
            symbols: (password.match(/[^a-zA-Z\d]/g) || []).length
        };

        const chart = new Chart(compositionChart, {
            type: 'pie',
            data: {
                labels: ['Lowercase', 'Uppercase', 'Numbers', 'Symbols'],
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    };

    const updateStrengthChart = (strength) => {
        const chart = new Chart(strengthChart, {
            type: 'bar',
            data: {
                labels: ['Strength'],
                datasets: [{
                    label: 'Password Strength',
                    data: [strength === 'Strong' ? 3 : strength === 'Moderate' ? 2 : 1],
                    backgroundColor: strength === 'Strong' ? '#28a745' : strength === 'Moderate' ? '#ffc107' : '#dc3545'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 3,
                        ticks: {
                            stepSize: 1,
                            callback: (value) => {
                                return value === 3 ? 'Strong' : value === 2 ? 'Moderate' : 'Weak';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const length = parseInt(document.getElementById("length").value);
        const includeUppercase = document.getElementById("include-uppercase").checked;
        const includeNumbers = document.getElementById("include-numbers").checked;
        const includeSymbols = document.getElementById("include-symbols").checked;

        const password = generatePassword(length, includeUppercase, includeNumbers, includeSymbols);
        generatedPasswordField.value = password;

        const strength = analyzePassword(password);
        updateStrengthField(strength);

        updateCompositionChart(password);
        updateStrengthChart(strength);
    });

    copyButton.addEventListener("click", () => {
        generatedPasswordField.select();
        document.execCommand("copy");
        alert("Password copied to clipboard!");
    });
});
