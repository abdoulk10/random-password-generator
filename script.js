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


let commonPasswords = [];

fetch('common-passwords.txt')
    .then(response => response.text())
    .then(data => {
        commonPasswords = data.split('\n');
    });

// Generate Dummy Passwords for Analysis
const passwords = [
    "P@ssw0rd", "123456", "Qwerty!", "StrongPass!2023", "Weak123",
    "Unique$Pass", "Letmein@", "Monkey#99", "Admin$2021", "Complex@9876"
];

// Descriptive Method: Summarize Characteristics
function summarizePasswords() {
    const avgLength = (
        passwords.reduce((sum, pwd) => sum + pwd.length, 0) / passwords.length
    ).toFixed(2);
    const specialCharUsage = (
        passwords.filter(pwd => /[^a-zA-Z0-9]/.test(pwd)).length / passwords.length
    ) * 100;

    document.getElementById('avgLength').textContent = avgLength;
    document.getElementById('specialCharUsage').textContent = `${specialCharUsage.toFixed(2)}%`;
}

// Nondescriptive Method: Predict Strength
function predictStrength(password) {
    return password.length >= 8 && /[^a-zA-Z0-9]/.test(password) ? "Strong" : "Weak";
}

// Decision Support Functionality: Provide Suggestions
function suggestImprovements(password) {
    let suggestions = [];
    if (password.length < 8) {
        suggestions.push("Increase the password length to at least 8 characters.");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        suggestions.push("Include at least one special character.");
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        suggestions.push("Use a mix of uppercase and lowercase letters.");
    }
    if (!/\d/.test(password)) {
        suggestions.push("Add at least one numeric digit.");
    }
    if (commonPasswords.includes(password)) {
        suggestions.push("Avoid using common passwords.");
    }
    return suggestions.length > 0 ? suggestions : ["Your password is strong!"];
}

// Visualizations
function renderCharts() {
    // Length Distribution
    new Chart(document.getElementById('lengthDistributionChart'), {
        type: 'bar',
        data: {
            labels: passwords,
            datasets: [{ data: passwords.map(pwd => pwd.length), label: 'Length' }]
        }
    });

    // Character Type Usage
    const charTypeUsage = { Letters: 0, Numbers: 0, Symbols: 0 };
    passwords.forEach(pwd => {
        charTypeUsage.Letters += (pwd.match(/[a-zA-Z]/g) || []).length;
        charTypeUsage.Numbers += (pwd.match(/\d/g) || []).length;
        charTypeUsage.Symbols += (pwd.match(/[^a-zA-Z\d]/g) || []).length;
    });
    new Chart(document.getElementById('charTypeUsageChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(charTypeUsage),
            datasets: [{ data: Object.values(charTypeUsage), backgroundColor: ['#007bff', '#ffc107', '#28a745'] }]
        }
    });

    // Strength Categories
    const strengthCategories = { Strong: 0, Weak: 0 };
    passwords.forEach(pwd => {
        strengthCategories[predictStrength(pwd)]++;
    });
    new Chart(document.getElementById('strengthCategoryChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(strengthCategories),
            datasets: [{ data: Object.values(strengthCategories), backgroundColor: ['#28a745', '#dc3545'] }]
        }
    });
}

// Interactive Queries
document.getElementById('filterButton').addEventListener('click', () => {
    const strength = document.getElementById('strengthFilter').value;
    const filteredPasswords = strength === 'all'
        ? passwords
        : passwords.filter(pwd => predictStrength(pwd) === strength);
    alert(`Filtered Passwords: ${filteredPasswords.join(', ')}`);
});

document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    const isDuplicate = commonPasswords.includes(searchInput);
    if (isDuplicate) {
        alert('Password is common. Avoid using it.');
    } else {
        const suggestions = suggestImprovements(searchInput);
        alert(suggestions.join('\n'));
    }
});

// Initialize
summarizePasswords();
renderCharts();
