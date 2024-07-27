// Define default points per tap
let pointsPerTap = 10;
let sdaCoins = 0; // Initialize sdaCoins

// Function to fetch the user's IP address
async function getIpAddress() {
    try {
        let response = await fetch('https://api.ipify.org?format=json');
        let data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to fetch IP address:', error);
        return null;
    }
}

// Function to validate the password strength
function isStrongPassword(password) {
    const lengthCriteria = /.{8,}/; // At least 8 characters
    const upperCaseCriteria = /[A-Z]/; // At least one uppercase letter
    const lowerCaseCriteria = /[a-z]/; // At least one lowercase letter
    const numberCriteria = /[0-9]/; // At least one number
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

    return lengthCriteria.test(password) &&
           upperCaseCriteria.test(password) &&
           lowerCaseCriteria.test(password) &&
           numberCriteria.test(password) &&
           specialCharCriteria.test(password);
}

// Function to validate the username
function isValidUsername(username) {
    // Check if username contains between 10 and 15 alphabetic characters
    const usernameCriteria = /^[a-zA-Z]{10,15}$/;
    return usernameCriteria.test(username);
}

// Function to load user-specific data
function loadUserData() {
    let username = localStorage.getItem("username");
    if (username) {
        let pointsKey = `points_${username}`;
        let sdaCoinsKey = `sdaCoins_${username}`;
        
        let savedPoints = localStorage.getItem(pointsKey);
        let savedSdaCoins = localStorage.getItem(sdaCoinsKey);

        if (savedPoints !== null) {
            document.getElementById("points").textContent = savedPoints;
        } else {
            document.getElementById("points").textContent = 0;
        }

        if (savedSdaCoins !== null) {
            sdaCoins = parseInt(savedSdaCoins, 10);
            document.getElementById("sdaCoins").textContent = sdaCoins;
        } else {
            sdaCoins = 0;
            document.getElementById("sdaCoins").textContent = sdaCoins;
        }
    }
}

// Function to handle sign-in
document.getElementById("signinForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Load saved username, password, and IP from localStorage
    let savedUsername = localStorage.getItem("username");
    let savedPassword = localStorage.getItem("password");
    let savedIp = localStorage.getItem("ip");

    if (username && password) {
        if (isValidUsername(username) && isStrongPassword(password)) {
            let currentIp = await getIpAddress();

            if (savedUsername) {
                if (username === savedUsername) {
                    if (password === savedPassword) {
                        if (savedIp === currentIp) {
                            alert("You already have an account.");
                            alert(`Username: ${savedUsername}\nPassword: ${savedPassword}`);
                        } else {
                            alert("Account access details:\nUsername: " + savedUsername + "\nPassword: " + savedPassword);
                        }
                        showDashboard(username);
                    } else {
                        alert("Incorrect password.");
                    }
                } else {
                    alert("An account already exists with the username " + savedUsername);
                    alert(`Existing account details:\nUsername: ${savedUsername}\nPassword: ${savedPassword}`);
                }
            } else {
                // Save new username, password, and IP address
                localStorage.setItem(`points_${username}`, 0);
                localStorage.setItem(`sdaCoins_${username}`, 0);
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                localStorage.setItem("ip", currentIp);

                showDashboard(username);
            }
        } else {
            if (!isValidUsername(username)) {
                alert("Username must contain between 10 and 15 alphabetic characters.");
            } else {
                alert("Password must be at least 8 characters long, and include uppercase letters, lowercase letters, numbers, and special characters.");
            }
        }
    } else {
        alert("Please enter both username and password.");
    }
});

// Function to show the dashboard for a given user
function showDashboard(username) {
    let displayUsername = username.split('@')[0];
    displayUsername = displayUsername.replace(/[^a-zA-Z]/g, '');

    document.querySelectorAll(".dashboard").forEach(dashboard => dashboard.style.display = "none");
    
    let userDashboard = document.getElementById("dashboard");
    userDashboard.style.display = "flex";
    
    document.getElementById("loggedInUser").innerHTML = `${displayUsername} 😊`;
    document.getElementById("signinContainer").style.display = "none";
    
    loadUserData();
}

// Function to handle coin click
document.getElementById("coin").addEventListener("click", function() {
    let pointsElement = document.getElementById("points");
    let currentPoints = parseInt(pointsElement.textContent, 10);
    let newPoints = currentPoints + pointsPerTap;
    pointsElement.textContent = newPoints;
    
    let username = localStorage.getItem("username");
    if (username) {
        let pointsKey = `points_${username}`;
        localStorage.setItem(pointsKey, newPoints);
    }
    
    let plusTenElement = document.getElementById("plusTen");
    plusTenElement.classList.add("show");
    
    setTimeout(function() {
        plusTenElement.classList.remove("show");
    }, 2000);
});

// Function to handle upgrade button click
document.getElementById("upgradeButton").addEventListener("click", function() {
    let pointsElement = document.getElementById("points");
    let currentPoints = parseInt(pointsElement.textContent, 10);

    if (currentPoints >= 1000) {
        currentPoints -= 1000;
        pointsElement.textContent = currentPoints;
        pointsPerTap += 5;
        
        let username = localStorage.getItem("username");
        if (username) {
            let pointsKey = `points_${username}`;
            localStorage.setItem(pointsKey, currentPoints);
        }
        
        alert("Upgrade successful! Points per tap increased to " + pointsPerTap);
    } else {
        alert("Insufficient points to upgrade!");
    }
});

// Function to handle points to SDA coins conversion
document.getElementById("convertPointsButton").addEventListener("click", function() {
    let pointsElement = document.getElementById("points");
    let currentPoints = parseInt(pointsElement.textContent, 10);

    if (currentPoints >= 1100) {
        currentPoints -= 1100;
        sdaCoins += 100;
        pointsElement.textContent = currentPoints;
        document.getElementById("sdaCoins").textContent = sdaCoins;
        
        let username = localStorage.getItem("username");
        if (username) {
            let pointsKey = `points_${username}`;
            let sdaCoinsKey = `sdaCoins_${username}`;
            localStorage.setItem(pointsKey, currentPoints);
            localStorage.setItem(sdaCoinsKey, sdaCoins);
        }
        
        alert("Conversion successful! You now have " + sdaCoins + " SDA coins.");
    } else {
        alert("Insufficient points to convert!");
    }
});

// Autofill username and password only when username or password field is clicked
document.getElementById("username").addEventListener("focus", function() {
    let savedUsername = localStorage.getItem("username");
    let savedPassword = localStorage.getItem("password");
    
    if (savedUsername) {
        this.value = savedUsername;
    }
    if (savedPassword && document.getElementById("password").value === "") {
        document.getElementById("password").value = savedPassword;
    }
});

document.getElementById("password").addEventListener("focus", function() {
    let savedPassword = localStorage.getItem("password");
    
    if (savedPassword && this.value === "") {
        this.value = savedPassword;
    }
});

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordField = document.getElementById("password");
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
    this.classList.toggle("fa-eye-slash");
});

// Function to open the sidebar
document.getElementById("openSidebar").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("sidebar").style.paddingRight = "0";
});

// Function to close the sidebar
document.getElementById("closeSidebar").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("sidebar").style.paddingRight = "0";
});

// Function to open the file input dialog
document.getElementById("openGalleryButton").addEventListener("click", function() {
    document.getElementById("photoInput").click();
});

// Function to handle file selection
document.getElementById("photoInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById("selectedPhoto");
            imgElement.src = e.target.result;
            imgElement.style.display = "block";

            // Replace emoji on the dashboard with the selected photo
            const emojiPlaceholder = document.getElementById("emojiPlaceholder");
            emojiPlaceholder.src = e.target.result;
            emojiPlaceholder.style.width = "100px";
            emojiPlaceholder.style.height = "100px";
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
});
