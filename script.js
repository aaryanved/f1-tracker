async function fetchDrivers() {
    try {
        const response = await fetch('https://api.openf1.org/v1/drivers?session_key=latest');
        if (!response.ok) throw new Error('Network response was not ok');
        const drivers = await response.json();
        const teams = {};
        drivers.forEach(driver => {
            if (!teams[driver.team_name]) teams[driver.team_name] = [];
            teams[driver.team_name].push(driver);
        });
        const orderedDrivers = Object.values(teams).flat();
        const totalSlots = 20;
        while (orderedDrivers.length < totalSlots) {
            orderedDrivers.push({ full_name: "Placeholder", driver_number: "", headshot_url: "../images/def.png", team_name: "" });
        }
        const grid = document.getElementById('driversGrid');
        orderedDrivers.forEach(driver => {
            const slot = document.createElement('div');
            slot.className = 'grid-slot';
            slot.setAttribute('data-team', driver.team_name);
            const [firstName, lastName] = driver.full_name ? driver.full_name.split(' ') : ['', ''];
            slot.innerHTML = `
                <div class="driver-image-container">
                    <img src="${driver.headshot_url || '../images/def.png'}" alt="${driver.full_name}" class="driver-img" onerror="this.src='../images/def.png';">
                </div>
                <div class="driver-footer">
                    <span class="driver-number">${driver.driver_number}</span>
                    <div class="driver-name-container">
                        <span class="driver-first-name">${firstName}</span>
                        <span class="driver-last-name">${lastName}</span>
                    </div>
                </div>
            `;
            grid.appendChild(slot);
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        const grid = document.getElementById('driversGrid');
        grid.innerHTML = '<p>Error loading driver data. Please try again later.</p>';
    }
}
function navigateTo(page) {
    window.location.href = page;
}
window.onload = fetchDrivers;

async function fetchLiveRaceData() {
    try {
        const response = await fetch('https://api.openf1.org/v1/cars?session_key=latest');
        if (!response.ok) throw new Error('Network response was not ok');
        const cars = await response.json();
        const dataDiv = document.getElementById('liveRaceData');
        dataDiv.innerHTML = '<ul>' + cars.map(car => `<li>Car ${car.racing_number}: ${car.driver_name || 'Unknown'}</li>`).join('') + '</ul>';
    } catch (error) {
        console.error('Error fetching live race data:', error);
        const dataDiv = document.getElementById('liveRaceData');
        dataDiv.innerHTML = '<p>Error loading live race data. Please try again later.</p>';
    }
}
window.onload = fetchLiveRaceData;