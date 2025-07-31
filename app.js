// Application Data with Enhanced Family Support
let buses = [
    {
        id: 1,
        name: "Bus 1",
        capacity: 56,
        occupancy: 5
    },
    {
        id: 2,
        name: "Bus 2", 
        capacity: 56,
        occupancy: 0
    },
    {
        id: 3,
        name: "Bus 3",
        capacity: 56,
        occupancy: 0
    }
];

let families = [
    {
        id: 1,
        familyName: "Sharma",
        members: [
            {name: "Raj Sharma", age: 45, contact: "9876543210"},
            {name: "Priya Sharma", age: 42, contact: "9876543211"},
            {name: "Arjun Sharma", age: 18, contact: "9876543212"}
        ],
        busId: 1,
        seats: [1, 2, 3],
        totalAmount: 4500,
        paidAmount: 4500,
        paymentStatus: "Paid"
    },
    {
        id: 2,
        familyName: "Patel",
        members: [
            {name: "Amit Patel", age: 38, contact: "9876543220"},
            {name: "Sunita Patel", age: 35, contact: "9876543221"}
        ],
        busId: 1,
        seats: [4, 5],
        totalAmount: 3000,
        paidAmount: 1500,
        paymentStatus: "Partial"
    }
];

let pricing = {
    adultFare: 1500,
    childFare: 1000,
    seniorFare: 1200
};

let tripSettings = {
    nextTripDate: "2025-08-15",
    destination: "Vaishno Devi",
    duration: "3 days",
    tripInterval: 15
};

let currentBusId = 1;
let selectedSeats = [];
let isMultiSelectionMode = false;
let currentFamilyForPayment = null;
let financialChart = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing enhanced family booking system...');
    initializeNavigation();
    initializeBusTabs();
    initializeSelectionMode();
    generateBusLayout();
    updateDashboard();
    updateParticipantsTable();
    updateFinancialSection();
    initializeEventListeners();
    console.log('Enhanced family booking system initialized successfully');
});

// Navigation
function initializeNavigation() {
    console.log('Initializing navigation...');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.dataset.section;
            console.log('Nav button clicked:', targetSection);
            switchSection(targetSection);
        });
    });
}

function switchSection(sectionName) {
    console.log('Switching to section:', sectionName);
    
    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Update sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName) {
            section.classList.add('active');
        }
    });
    
    // Update data when switching to specific sections
    if (sectionName === 'buses') {
        updateCurrentBusInfo();
        generateBusLayout();
    } else if (sectionName === 'participants') {
        updateParticipantsTable();
        updateBusFilterOptions();
    } else if (sectionName === 'financial') {
        updateFinancialSection();
    }
}

// Selection Mode Management
function initializeSelectionMode() {
    const multiSelectionToggle = document.getElementById('multiSelectionMode');
    const selectionModeLabel = document.getElementById('selectionModeLabel');
    const selectionModeDescription = document.getElementById('selectionModeDescription');
    
    if (multiSelectionToggle) {
        multiSelectionToggle.addEventListener('change', function() {
            isMultiSelectionMode = this.checked;
            updateSelectionModeUI();
            clearAllSelections();
        });
    }
}

function updateSelectionModeUI() {
    const selectionModeLabel = document.getElementById('selectionModeLabel');
    const selectionModeDescription = document.getElementById('selectionModeDescription');
    const selectedSeatsInfo = document.getElementById('selectedSeatsInfo');
    
    if (isMultiSelectionMode) {
        if (selectionModeLabel) selectionModeLabel.textContent = 'Multiple Selection';
        if (selectionModeDescription) {
            selectionModeDescription.textContent = 'Click multiple seats to select them for family booking';
        }
        if (selectedSeatsInfo) selectedSeatsInfo.style.display = 'block';
    } else {
        if (selectionModeLabel) selectionModeLabel.textContent = 'Single Selection';
        if (selectionModeDescription) {
            selectionModeDescription.textContent = 'Click on individual seats to select one at a time';
        }
        if (selectedSeatsInfo) selectedSeatsInfo.style.display = 'none';
    }
    
    updateSelectedSeatsDisplay();
}

function updateSelectedSeatsDisplay() {
    const selectedSeatsList = document.getElementById('selectedSeatsList');
    const assignSelectedSeatsBtn = document.getElementById('assignSelectedSeatsBtn');
    
    if (selectedSeatsList) {
        if (selectedSeats.length === 0) {
            selectedSeatsList.textContent = 'None';
        } else {
            selectedSeatsList.textContent = selectedSeats.sort((a, b) => a - b).join(', ');
        }
    }
    
    if (assignSelectedSeatsBtn) {
        assignSelectedSeatsBtn.disabled = selectedSeats.length === 0;
    }
}

// Bus Management
function initializeBusTabs() {
    console.log('Initializing bus tabs...');
    const busTabsContainer = document.getElementById('busTabs');
    if (!busTabsContainer) return;
    
    busTabsContainer.innerHTML = '';
    
    buses.forEach(bus => {
        const busTab = document.createElement('button');
        busTab.className = `bus-tab ${bus.id === currentBusId ? 'active' : ''}`;
        busTab.dataset.busId = bus.id;
        
        // Calculate occupancy from families
        const occupiedSeats = families
            .filter(f => f.busId === bus.id)
            .reduce((total, family) => total + family.seats.length, 0);
        
        if (occupiedSeats > 0) {
            busTab.innerHTML = `
                ${bus.name}
                <span class="bus-tab-indicator">${occupiedSeats}</span>
            `;
        } else {
            busTab.textContent = bus.name;
        }
        
        busTab.addEventListener('click', () => switchToBus(bus.id));
        busTabsContainer.appendChild(busTab);
    });
}

function switchToBus(busId) {
    console.log('Switching to bus:', busId);
    currentBusId = busId;
    
    // Update active tab
    document.querySelectorAll('.bus-tab').forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.dataset.busId) === busId) {
            tab.classList.add('active');
        }
    });
    
    // Clear selections
    clearAllSelections();
    
    // Update bus info and layout
    updateCurrentBusInfo();
    generateBusLayout();
}

function updateCurrentBusInfo() {
    const currentBus = buses.find(bus => bus.id === currentBusId);
    if (!currentBus) return;
    
    const occupiedSeats = families
        .filter(f => f.busId === currentBusId)
        .reduce((total, family) => total + family.seats.length, 0);
    const availableSeats = currentBus.capacity - occupiedSeats;
    
    // Update bus info display
    const currentBusCapacity = document.getElementById('currentBusCapacity');
    const currentBusOccupied = document.getElementById('currentBusOccupied');
    const currentBusAvailable = document.getElementById('currentBusAvailable');
    const currentBusTitle = document.getElementById('currentBusTitle');
    
    if (currentBusCapacity) currentBusCapacity.textContent = currentBus.capacity;
    if (currentBusOccupied) currentBusOccupied.textContent = occupiedSeats;
    if (currentBusAvailable) currentBusAvailable.textContent = availableSeats;
    if (currentBusTitle) currentBusTitle.textContent = `${currentBus.name} - Seat Layout`;
}

// Enhanced Bus Layout Generation
function generateBusLayout() {
    console.log('Generating bus layout for bus:', currentBusId);
    const busLayout = document.getElementById('busLayout');
    if (!busLayout) return;
    
    busLayout.innerHTML = '';
    
    // Get all booked seats for current bus from families
    const bookedSeats = new Map();
    families
        .filter(f => f.busId === currentBusId)
        .forEach(family => {
            family.seats.forEach(seatNumber => {
                bookedSeats.set(seatNumber, family);
            });
        });
    
    // Regular rows (1-10): 2 seats left + 3 seats right
    for (let row = 1; row <= 10; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'bus-row';
        
        // Left seats
        const leftGroup = document.createElement('div');
        leftGroup.className = 'seat-group';
        
        for (let seatIndex = 1; seatIndex <= 2; seatIndex++) {
            const seatNumber = (row - 1) * 5 + seatIndex;
            const seat = createSeat(seatNumber, bookedSeats);
            leftGroup.appendChild(seat);
        }
        
        // Aisle
        const aisle = document.createElement('div');
        aisle.className = 'aisle';
        
        // Right seats
        const rightGroup = document.createElement('div');
        rightGroup.className = 'seat-group';
        
        for (let seatIndex = 3; seatIndex <= 5; seatIndex++) {
            const seatNumber = (row - 1) * 5 + seatIndex;
            const seat = createSeat(seatNumber, bookedSeats);
            rightGroup.appendChild(seat);
        }
        
        rowDiv.appendChild(leftGroup);
        rowDiv.appendChild(aisle);
        rowDiv.appendChild(rightGroup);
        busLayout.appendChild(rowDiv);
    }
    
    // Last row (11): 6 seats
    const lastRowDiv = document.createElement('div');
    lastRowDiv.className = 'bus-row';
    
    const lastRowGroup = document.createElement('div');
    lastRowGroup.className = 'seat-group';
    
    for (let seatIndex = 51; seatIndex <= 56; seatIndex++) {
        const seat = createSeat(seatIndex, bookedSeats);
        lastRowGroup.appendChild(seat);
    }
    
    lastRowDiv.appendChild(lastRowGroup);
    busLayout.appendChild(lastRowDiv);
}

function createSeat(seatNumber, bookedSeats) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.textContent = seatNumber;
    seat.dataset.seat = seatNumber;
    seat.dataset.busId = currentBusId;
    
    // Check if seat is booked
    const family = bookedSeats.get(seatNumber);
    if (family) {
        seat.classList.add('booked');
        if (family.members.length > 1) {
            seat.classList.add('family-group');
        }
        seat.title = `Occupied by ${family.familyName} family`;
    } else if (selectedSeats.includes(seatNumber)) {
        seat.classList.add('selected');
        seat.addEventListener('click', () => toggleSeatSelection(seatNumber));
    } else {
        seat.classList.add('available');
        seat.addEventListener('click', () => toggleSeatSelection(seatNumber));
    }
    
    return seat;
}

function toggleSeatSelection(seatNumber) {
    console.log('Toggling seat selection:', seatNumber);
    
    if (isMultiSelectionMode) {
        // Multi-selection mode
        const seatIndex = selectedSeats.indexOf(seatNumber);
        if (seatIndex > -1) {
            // Deselect seat
            selectedSeats.splice(seatIndex, 1);
        } else {
            // Select seat
            selectedSeats.push(seatNumber);
        }
        
        updateSelectedSeatsDisplay();
        generateBusLayout(); // Refresh to show selection changes
    } else {
        // Single selection mode
        selectedSeats = [seatNumber];
        showSingleSeatInfo(seatNumber);
        generateBusLayout(); // Refresh to show selection changes
    }
}

function showSingleSeatInfo(seatNumber) {
    const selectedSeatSpan = document.getElementById('selectedSeatNumber');
    const selectedBusSpan = document.getElementById('selectedBusName');
    const seatSelectionInfo = document.getElementById('seatSelectionInfo');
    
    const currentBus = buses.find(bus => bus.id === currentBusId);
    
    if (selectedSeatSpan) selectedSeatSpan.textContent = seatNumber;
    if (selectedBusSpan) selectedBusSpan.textContent = currentBus ? currentBus.name : '';
    if (seatSelectionInfo) seatSelectionInfo.style.display = 'block';
}

function clearAllSelections() {
    selectedSeats = [];
    updateSelectedSeatsDisplay();
    
    const seatSelectionInfo = document.getElementById('seatSelectionInfo');
    if (seatSelectionInfo) seatSelectionInfo.style.display = 'none';
    
    generateBusLayout();
}

// Dashboard Updates
function updateDashboard() {
    console.log('Updating dashboard...');
    
    // Calculate totals across all families
    const totalParticipants = families.reduce((total, family) => total + family.members.length, 0);
    const totalFamilies = families.length;
    const totalCapacity = buses.length * 56;
    const availableSeats = totalCapacity - totalParticipants;
    
    // Update statistics
    const totalParticipantsEl = document.getElementById('totalParticipants');
    const totalFamiliesEl = document.getElementById('totalFamilies');
    const availableSeatsEl = document.getElementById('availableSeats');
    const nextTripDateEl = document.getElementById('nextTripDate');
    
    if (totalParticipantsEl) totalParticipantsEl.textContent = totalParticipants;
    if (totalFamiliesEl) totalFamiliesEl.textContent = totalFamilies;
    if (availableSeatsEl) availableSeatsEl.textContent = availableSeats;
    
    // Format next trip date
    const nextTripDate = new Date(tripSettings.nextTripDate);
    if (nextTripDateEl) {
        nextTripDateEl.textContent = nextTripDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Update bus overview
    updateBusStatsGrid();
    
    // Update financial summary
    const totalExpected = families.reduce((sum, family) => sum + family.totalAmount, 0);
    const totalCollected = families.reduce((sum, family) => sum + family.paidAmount, 0);
    const totalOutstanding = totalExpected - totalCollected;
    
    const totalExpectedEl = document.getElementById('totalExpected');
    const totalCollectedEl = document.getElementById('totalCollected');
    const totalOutstandingEl = document.getElementById('totalOutstanding');
    
    if (totalExpectedEl) totalExpectedEl.textContent = `₹${totalExpected.toLocaleString()}`;
    if (totalCollectedEl) totalCollectedEl.textContent = `₹${totalCollected.toLocaleString()}`;
    if (totalOutstandingEl) totalOutstandingEl.textContent = `₹${totalOutstanding.toLocaleString()}`;
    
    // Update financial chart
    updateFinancialChart(totalCollected, totalOutstanding);
}

function updateBusStatsGrid() {
    const busStatsGrid = document.getElementById('busStatsGrid');
    if (!busStatsGrid) return;
    
    busStatsGrid.innerHTML = '';
    
    buses.forEach(bus => {
        const busOccupancy = families
            .filter(f => f.busId === bus.id)
            .reduce((total, family) => total + family.seats.length, 0);
        const occupancyPercent = Math.round((busOccupancy / bus.capacity) * 100);
        
        const busStatItem = document.createElement('div');
        busStatItem.className = 'bus-stat-item';
        busStatItem.innerHTML = `
            <div class="bus-stat-name">${bus.name}</div>
            <div class="bus-stat-occupancy">${busOccupancy}/${bus.capacity}</div>
            <div class="bus-stat-details">${occupancyPercent}% occupied</div>
        `;
        
        busStatsGrid.appendChild(busStatItem);
    });
}

function updateFinancialChart(collected, outstanding) {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;
    
    if (financialChart) {
        financialChart.destroy();
    }
    
    financialChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Collected', 'Outstanding'],
            datasets: [{
                data: [collected, outstanding],
                backgroundColor: ['#1FB8CD', '#B4413C'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Participants Management
function updateParticipantsTable() {
    console.log('Updating participants table...');
    const tbody = document.getElementById('participantsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Get filtered families based on bus filter
    const busFilter = document.getElementById('filterByBus');
    const selectedBusFilter = busFilter ? busFilter.value : '';
    
    let filteredFamilies = families;
    if (selectedBusFilter) {
        filteredFamilies = families.filter(f => f.busId === parseInt(selectedBusFilter));
    }
    
    // Create rows for each family member
    filteredFamilies.forEach(family => {
        const bus = buses.find(b => b.id === family.busId);
        
        family.members.forEach((member, index) => {
            const row = document.createElement('tr');
            const isFirstMember = index === 0;
            
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.age}</td>
                <td>${member.contact}</td>
                <td>
                    ${family.familyName}
                    ${isFirstMember ? '<span class="family-group-indicator">Family</span>' : ''}
                </td>
                <td>${bus ? bus.name : 'N/A'}</td>
                <td>${isFirstMember ? family.seats.join(', ') : ''}</td>
                <td>
                    ${isFirstMember ? `<span class="status status--${getStatusClass(family.paymentStatus)}">${family.paymentStatus}</span>` : ''}
                </td>
                <td>${isFirstMember ? `₹${family.paidAmount.toLocaleString()}` : ''}</td>
                <td>
                    ${isFirstMember ? `
                        <div class="participant-actions">
                            <button class="btn btn-small btn--secondary" onclick="editFamily(${family.id})">Edit</button>
                            <button class="btn btn-small btn--primary" onclick="updateFamilyPayment(${family.id})">Payment</button>
                            <button class="btn btn-small btn--outline" onclick="removeFamily(${family.id})">Remove</button>
                        </div>
                    ` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    });
    
    // Update bus options
    updateBusOptions();
}

function updateBusFilterOptions() {
    const filterByBus = document.getElementById('filterByBus');
    if (!filterByBus) return;
    
    const currentValue = filterByBus.value;
    filterByBus.innerHTML = '<option value="">All Buses</option>';
    
    buses.forEach(bus => {
        const option = document.createElement('option');
        option.value = bus.id;
        option.textContent = bus.name;
        if (bus.id === parseInt(currentValue)) {
            option.selected = true;
        }
        filterByBus.appendChild(option);
    });
}

function updateBusOptions() {
    // Update family bus options
    const familyBus = document.getElementById('familyBus');
    if (familyBus) {
        const currentValue = familyBus.value;
        familyBus.innerHTML = '<option value="">Select Bus</option>';
        
        buses.forEach(bus => {
            const option = document.createElement('option');
            option.value = bus.id;
            option.textContent = bus.name;
            if (bus.id === parseInt(currentValue)) {
                option.selected = true;
            }
            familyBus.appendChild(option);
        });
    }
    
    // Update individual participant bus options
    const participantBus = document.getElementById('participantBus');
    if (participantBus) {
        const currentValue = participantBus.value;
        participantBus.innerHTML = '<option value="">Select Bus</option>';
        
        buses.forEach(bus => {
            const option = document.createElement('option');
            option.value = bus.id;
            option.textContent = bus.name;
            if (bus.id === parseInt(currentValue)) {
                option.selected = true;
            }
            participantBus.appendChild(option);
        });
    }
}

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'paid': return 'success';
        case 'partial': return 'warning';
        case 'pending': return 'error';
        default: return 'info';
    }
}

// Financial Management
function updateFinancialSection() {
    console.log('Updating financial section...');
    
    // Update settings
    const adultFareInput = document.getElementById('adultFareInput');
    const childFareInput = document.getElementById('childFareInput');
    const seniorFareInput = document.getElementById('seniorFareInput');
    const nextTripInput = document.getElementById('nextTripInput');
    const destinationInput = document.getElementById('destinationInput');
    
    if (adultFareInput) adultFareInput.value = pricing.adultFare;
    if (childFareInput) childFareInput.value = pricing.childFare;
    if (seniorFareInput) seniorFareInput.value = pricing.seniorFare;
    if (nextTripInput) nextTripInput.value = tripSettings.nextTripDate;
    if (destinationInput) destinationInput.value = tripSettings.destination;
    
    // Update bus-wise payments
    updateBusPaymentsGrid();
    
    // Update reports
    const outstandingFamilies = families.filter(f => f.paymentStatus !== 'Paid').length;
    const collectionRate = families.length > 0 ? 
        Math.round((families.filter(f => f.paymentStatus === 'Paid').length / families.length) * 100) : 0;
    
    const busesWithFullPayment = buses.filter(bus => {
        const busFamilies = families.filter(f => f.busId === bus.id);
        return busFamilies.length > 0 && busFamilies.every(f => f.paymentStatus === 'Paid');
    }).length;
    
    const outstandingCountEl = document.getElementById('outstandingCount');
    const collectionRateEl = document.getElementById('collectionRate');
    const fullPaidBusesEl = document.getElementById('fullPaidBuses');
    
    if (outstandingCountEl) outstandingCountEl.textContent = outstandingFamilies;
    if (collectionRateEl) collectionRateEl.textContent = `${collectionRate}%`;
    if (fullPaidBusesEl) fullPaidBusesEl.textContent = `${busesWithFullPayment}/${buses.length}`;
}

function updateBusPaymentsGrid() {
    const busPaymentsGrid = document.getElementById('busPaymentsGrid');
    if (!busPaymentsGrid) return;
    
    busPaymentsGrid.innerHTML = '';
    
    buses.forEach(bus => {
        const busFamilies = families.filter(f => f.busId === bus.id);
        const totalExpected = busFamilies.reduce((sum, f) => sum + f.totalAmount, 0);
        const totalCollected = busFamilies.reduce((sum, f) => sum + f.paidAmount, 0);
        const totalOutstanding = totalExpected - totalCollected;
        const occupancy = busFamilies.reduce((total, family) => total + family.seats.length, 0);
        
        const busPaymentSummary = document.createElement('div');
        busPaymentSummary.className = 'bus-payment-summary';
        busPaymentSummary.innerHTML = `
            <div class="bus-payment-header">
                <div class="bus-payment-name">${bus.name}</div>
                <div class="bus-payment-occupancy">${occupancy}/${bus.capacity}</div>
            </div>
            <div class="bus-payment-stats">
                <div class="bus-payment-item">
                    <span class="bus-payment-label">Expected</span>
                    <span class="bus-payment-amount">₹${totalExpected.toLocaleString()}</span>
                </div>
                <div class="bus-payment-item">
                    <span class="bus-payment-label">Collected</span>
                    <span class="bus-payment-amount collected">₹${totalCollected.toLocaleString()}</span>
                </div>
                <div class="bus-payment-item">
                    <span class="bus-payment-label">Outstanding</span>
                    <span class="bus-payment-amount outstanding">₹${totalOutstanding.toLocaleString()}</span>
                </div>
            </div>
        `;
        
        busPaymentsGrid.appendChild(busPaymentSummary);
    });
}

// Event Listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Selection mode controls
    const assignSelectedSeatsBtn = document.getElementById('assignSelectedSeatsBtn');
    const clearAllSelectionsBtn = document.getElementById('clearAllSelectionsBtn');
    
    if (assignSelectedSeatsBtn) assignSelectedSeatsBtn.addEventListener('click', openFamilyModalWithSeats);
    if (clearAllSelectionsBtn) clearAllSelectionsBtn.addEventListener('click', clearAllSelections);
    
    // Family Modal
    const addFamilyBtn = document.getElementById('addFamilyBtn');
    const closeFamilyModalBtn = document.getElementById('closeFamilyModalBtn');
    const cancelFamilyModalBtn = document.getElementById('cancelFamilyModalBtn');
    const saveFamilyBtn = document.getElementById('saveFamilyBtn');
    const numberOfMembers = document.getElementById('numberOfMembers');
    
    if (addFamilyBtn) addFamilyBtn.addEventListener('click', openAddFamilyModal);
    if (closeFamilyModalBtn) closeFamilyModalBtn.addEventListener('click', closeAddFamilyModal);
    if (cancelFamilyModalBtn) cancelFamilyModalBtn.addEventListener('click', closeAddFamilyModal);
    if (saveFamilyBtn) saveFamilyBtn.addEventListener('click', saveFamily);
    if (numberOfMembers) numberOfMembers.addEventListener('change', generateFamilyMemberFields);
    
    // Individual Participant Modal
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const saveParticipantBtn = document.getElementById('saveParticipantBtn');
    
    if (addParticipantBtn) addParticipantBtn.addEventListener('click', openAddParticipantModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAddParticipantModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeAddParticipantModal);
    if (saveParticipantBtn) saveParticipantBtn.addEventListener('click', saveIndividualParticipant);
    
    // Payment Modal
    const closePaymentModalBtn = document.getElementById('closePaymentModalBtn');
    const cancelPaymentModalBtn = document.getElementById('cancelPaymentModalBtn');
    const savePaymentBtn = document.getElementById('savePaymentBtn');
    
    if (closePaymentModalBtn) closePaymentModalBtn.addEventListener('click', closePaymentModal);
    if (cancelPaymentModalBtn) cancelPaymentModalBtn.addEventListener('click', closePaymentModal);
    if (savePaymentBtn) savePaymentBtn.addEventListener('click', savePaymentUpdate);
    
    // Add Bus Modal
    const addBusBtn = document.getElementById('addBusBtn');
    const closeAddBusModalBtn = document.getElementById('closeAddBusModalBtn');
    const cancelAddBusBtn = document.getElementById('cancelAddBusBtn');
    const saveBusBtn = document.getElementById('saveBusBtn');
    
    if (addBusBtn) addBusBtn.addEventListener('click', openAddBusModal);
    if (closeAddBusModalBtn) closeAddBusModalBtn.addEventListener('click', closeAddBusModal);
    if (cancelAddBusBtn) cancelAddBusBtn.addEventListener('click', closeAddBusModal);
    if (saveBusBtn) saveBusBtn.addEventListener('click', saveNewBus);
    
    // Single Seat Management
    const assignSeatBtn = document.getElementById('assignSeatBtn');
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    
    if (assignSeatBtn) assignSeatBtn.addEventListener('click', assignSelectedSeat);
    if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', clearAllSelections);
    
    // Settings
    const updateSettingsBtn = document.getElementById('updateSettingsBtn');
    if (updateSettingsBtn) updateSettingsBtn.addEventListener('click', updateSettings);
    
    // Export Reports
    const exportReportBtn = document.getElementById('exportReportBtn');
    const exportBusReportBtn = document.getElementById('exportBusReportBtn');
    if (exportReportBtn) exportReportBtn.addEventListener('click', exportFullReport);
    if (exportBusReportBtn) exportBusReportBtn.addEventListener('click', exportBusReport);
    
    // Bus filter change
    const filterByBus = document.getElementById('filterByBus');
    if (filterByBus) filterByBus.addEventListener('change', updateParticipantsTable);
    
    // Close modals when clicking outside
    const modals = ['addFamilyModal', 'addParticipantModal', 'paymentModal', 'addBusModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });
}

// Family Management Functions
function openFamilyModalWithSeats() {
    if (selectedSeats.length === 0) return;
    
    openAddFamilyModal();
    
    // Pre-fill number of members based on selected seats
    const numberOfMembers = document.getElementById('numberOfMembers');
    if (numberOfMembers) {
        numberOfMembers.value = selectedSeats.length.toString();
        generateFamilyMemberFields();
    }
    
    // Pre-select current bus
    const familyBus = document.getElementById('familyBus');
    if (familyBus) {
        familyBus.value = currentBusId;
    }
    
    // Update selected seats summary
    updateSelectedSeatsSummary();
}

function openAddFamilyModal() {
    console.log('Opening add family modal...');
    const addFamilyModal = document.getElementById('addFamilyModal');
    
    updateBusOptions();
    
    // Pre-select current bus if no seats selected
    const familyBus = document.getElementById('familyBus');
    if (familyBus && selectedSeats.length === 0) {
        familyBus.value = currentBusId;
    }
    
    if (addFamilyModal) addFamilyModal.classList.remove('hidden');
}

function closeAddFamilyModal() {
    const addFamilyModal = document.getElementById('addFamilyModal');
    const addFamilyForm = document.getElementById('addFamilyForm');
    const familyMembersContainer = document.getElementById('familyMembersContainer');
    
    if (addFamilyModal) addFamilyModal.classList.add('hidden');
    if (addFamilyForm) addFamilyForm.reset();
    if (familyMembersContainer) familyMembersContainer.innerHTML = '';
}

function generateFamilyMemberFields() {
    const numberOfMembers = document.getElementById('numberOfMembers');
    const familyMembersContainer = document.getElementById('familyMembersContainer');
    
    if (!numberOfMembers || !familyMembersContainer) return;
    
    const memberCount = parseInt(numberOfMembers.value) || 0;
    familyMembersContainer.innerHTML = '';
    
    for (let i = 1; i <= memberCount; i++) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'family-member';
        memberDiv.innerHTML = `
            <div class="family-member-header">
                <h5 class="family-member-title">Member ${i}</h5>
            </div>
            <div class="family-member-fields">
                <div class="form-group">
                    <label class="form-label">Name *</label>
                    <input type="text" class="form-control" name="memberName${i}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Age *</label>
                    <input type="number" class="form-control" name="memberAge${i}" required min="1" max="120">
                </div>
                <div class="form-group">
                    <label class="form-label">Contact</label>
                    <input type="tel" class="form-control" name="memberContact${i}">
                </div>
            </div>
        `;
        familyMembersContainer.appendChild(memberDiv);
    }
    
    updateSelectedSeatsSummary();
}

function updateSelectedSeatsSummary() {
    const selectedSeatsSummary = document.getElementById('selectedSeatsSummary');
    const selectedSeatsForFamily = document.getElementById('selectedSeatsForFamily');
    
    if (!selectedSeatsSummary || !selectedSeatsForFamily) return;
    
    if (selectedSeats.length > 0) {
        selectedSeatsSummary.style.display = 'block';
        selectedSeatsForFamily.textContent = selectedSeats.sort((a, b) => a - b).join(', ');
    } else {
        selectedSeatsSummary.style.display = 'none';
    }
}

function saveFamily() {
    console.log('Saving family...');
    const form = document.getElementById('addFamilyForm');
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }
    
    const familyName = document.getElementById('familyName').value;
    const numberOfMembersValue = parseInt(document.getElementById('numberOfMembers').value);
    const busId = parseInt(document.getElementById('familyBus').value);
    const paymentStatus = document.getElementById('familyPaymentStatus').value;
    const amountPaid = parseInt(document.getElementById('familyAmountPaid').value) || 0;
    
    // Collect member details
    const members = [];
    for (let i = 1; i <= numberOfMembersValue; i++) {
        const name = document.querySelector(`input[name="memberName${i}"]`).value;
        const age = parseInt(document.querySelector(`input[name="memberAge${i}"]`).value);
        const contact = document.querySelector(`input[name="memberContact${i}"]`).value || '';
        
        members.push({ name, age, contact });
    }
    
    // Calculate total amount based on ages
    const totalAmount = members.reduce((sum, member) => {
        if (member.age >= 60) return sum + pricing.seniorFare;
        if (member.age < 18) return sum + pricing.childFare;
        return sum + pricing.adultFare;
    }, 0);
    
    // Use selected seats or auto-assign
    let assignedSeats = [];
    if (selectedSeats.length > 0) {
        assignedSeats = [...selectedSeats];
    } else {
        // Auto-assign next available seats
        assignedSeats = getNextAvailableSeats(busId, numberOfMembersValue);
    }
    
    const newFamily = {
        id: Date.now(),
        familyName,
        members,
        busId,
        seats: assignedSeats,
        totalAmount,
        paidAmount: amountPaid,
        paymentStatus
    };
    
    families.push(newFamily);
    
    const bus = buses.find(b => b.id === busId);
    addActivity(`${familyName} family registered for ${bus ? bus.name : 'Unknown Bus'}, seats ${assignedSeats.join(', ')}`);
    
    // Update UI
    clearAllSelections();
    updateDashboard();
    updateParticipantsTable();
    updateFinancialSection();
    initializeBusTabs();
    if (busId === currentBusId) {
        generateBusLayout();
    }
    
    closeAddFamilyModal();
}

function getNextAvailableSeats(busId, count) {
    const bookedSeats = families
        .filter(f => f.busId === busId)
        .flatMap(f => f.seats);
    
    const availableSeats = [];
    for (let i = 1; i <= 56 && availableSeats.length < count; i++) {
        if (!bookedSeats.includes(i)) {
            availableSeats.push(i);
        }
    }
    
    return availableSeats;
}

// Individual Participant Functions
function openAddParticipantModal() {
    console.log('Opening add individual participant modal...');
    const addParticipantModal = document.getElementById('addParticipantModal');
    
    updateBusOptions();
    
    // Pre-select current bus and seat if available
    const participantBus = document.getElementById('participantBus');
    if (participantBus) {
        participantBus.value = currentBusId;
        updateSeatOptions();
        
        if (selectedSeats.length === 1) {
            const participantSeat = document.getElementById('participantSeat');
            if (participantSeat) {
                participantSeat.value = selectedSeats[0];
            }
        }
    }
    
    if (addParticipantModal) addParticipantModal.classList.remove('hidden');
}

function closeAddParticipantModal() {
    const addParticipantModal = document.getElementById('addParticipantModal');
    const addParticipantForm = document.getElementById('addParticipantForm');
    
    if (addParticipantModal) addParticipantModal.classList.add('hidden');
    if (addParticipantForm) addParticipantForm.reset();
}

function updateSeatOptions() {
    const participantSeat = document.getElementById('participantSeat');
    const participantBus = document.getElementById('participantBus');
    
    if (!participantSeat || !participantBus) return;
    
    const selectedBusId = parseInt(participantBus.value);
    participantSeat.innerHTML = '<option value="">Select Seat (Optional)</option>';
    
    if (!selectedBusId) return;
    
    // Get booked seats for selected bus
    const bookedSeats = families
        .filter(f => f.busId === selectedBusId)
        .flatMap(f => f.seats);
    
    // Generate available seats (1-56)
    for (let i = 1; i <= 56; i++) {
        if (!bookedSeats.includes(i)) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Seat ${i}`;
            participantSeat.appendChild(option);
        }
    }
    
    // Pre-select if there's a selected seat for current bus
    if (selectedSeats.length === 1 && selectedBusId === currentBusId) {
        participantSeat.value = selectedSeats[0];
    }
}

function saveIndividualParticipant() {
    console.log('Saving individual participant...');
    const form = document.getElementById('addParticipantForm');
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }
    
    const name = document.getElementById('participantName').value;
    const age = parseInt(document.getElementById('participantAge').value);
    const phone = document.getElementById('participantPhone').value;
    const busId = parseInt(document.getElementById('participantBus').value);
    const seatNumber = parseInt(document.getElementById('participantSeat').value) || null;
    const paymentStatus = document.getElementById('participantPaymentStatus').value;
    const amountPaid = parseInt(document.getElementById('participantAmountPaid').value) || 0;
    
    // Calculate fare based on age
    let fare = pricing.adultFare;
    if (age >= 60) fare = pricing.seniorFare;
    else if (age < 18) fare = pricing.childFare;
    
    // Auto-assign seat if not selected
    let assignedSeat = seatNumber;
    if (!assignedSeat) {
        const availableSeats = getNextAvailableSeats(busId, 1);
        assignedSeat = availableSeats[0];
    }
    
    const newFamily = {
        id: Date.now(),
        familyName: name.split(' ')[0], // Use first name as family name
        members: [{
            name,
            age,
            contact: phone
        }],
        busId,
        seats: [assignedSeat],
        totalAmount: fare,
        paidAmount: amountPaid,
        paymentStatus
    };
    
    families.push(newFamily);
    
    const bus = buses.find(b => b.id === busId);
    addActivity(`${name} registered individually for ${bus ? bus.name : 'Unknown Bus'}, seat ${assignedSeat}`);
    
    // Update UI
    clearAllSelections();
    updateDashboard();
    updateParticipantsTable();
    updateFinancialSection();
    initializeBusTabs();
    if (busId === currentBusId) {
        generateBusLayout();
    }
    
    closeAddParticipantModal();
}

// Payment Functions
function updateFamilyPayment(familyId) {
    openPaymentModal(familyId);
}

function openPaymentModal(familyId) {
    const family = families.find(f => f.id === familyId);
    if (!family) return;
    
    currentFamilyForPayment = family;
    const bus = buses.find(b => b.id === family.busId);
    
    const paymentFamilyName = document.getElementById('paymentFamilyName');
    const paymentFamilyBus = document.getElementById('paymentFamilyBus');
    const paymentFamilySeats = document.getElementById('paymentFamilySeats');
    const paymentFamilyMembers = document.getElementById('paymentFamilyMembers');
    const paymentCurrentStatus = document.getElementById('paymentCurrentStatus');
    const paymentCurrentAmount = document.getElementById('paymentCurrentAmount');
    const paymentTotalExpected = document.getElementById('paymentTotalExpected');
    const updatePaymentStatus = document.getElementById('updatePaymentStatus');
    const updateAmountPaid = document.getElementById('updateAmountPaid');
    const paymentModal = document.getElementById('paymentModal');
    
    if (paymentFamilyName) paymentFamilyName.textContent = `${family.familyName} Family`;
    if (paymentFamilyBus) paymentFamilyBus.textContent = bus ? bus.name : 'N/A';
    if (paymentFamilySeats) paymentFamilySeats.textContent = family.seats.join(', ');
    if (paymentFamilyMembers) paymentFamilyMembers.textContent = family.members.length;
    if (paymentCurrentStatus) paymentCurrentStatus.textContent = family.paymentStatus;
    if (paymentCurrentAmount) paymentCurrentAmount.textContent = family.paidAmount;
    if (paymentTotalExpected) paymentTotalExpected.textContent = family.totalAmount;
    if (updatePaymentStatus) updatePaymentStatus.value = family.paymentStatus;
    if (updateAmountPaid) updateAmountPaid.value = family.paidAmount;
    
    if (paymentModal) paymentModal.classList.remove('hidden');
}

function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) paymentModal.classList.add('hidden');
    currentFamilyForPayment = null;
}

function savePaymentUpdate() {
    if (!currentFamilyForPayment) return;
    
    const newStatus = document.getElementById('updatePaymentStatus').value;
    const newAmount = parseInt(document.getElementById('updateAmountPaid').value) || 0;
    
    const family = families.find(f => f.id === currentFamilyForPayment.id);
    if (family) {
        const oldAmount = family.paidAmount;
        family.paymentStatus = newStatus;
        family.paidAmount = newAmount;
        
        if (newAmount !== oldAmount) {
            addActivity(`Payment updated for ${family.familyName} family - ₹${newAmount}`);
        }
        
        updateDashboard();
        updateParticipantsTable();
        updateFinancialSection();
    }
    
    closePaymentModal();
}

function editFamily(familyId) {
    updateFamilyPayment(familyId);
}

function removeFamily(familyId) {
    if (confirm('Are you sure you want to remove this entire family?')) {
        const family = families.find(f => f.id === familyId);
        const bus = buses.find(b => b.id === family.busId);
        families = families.filter(f => f.id !== familyId);
        
        addActivity(`${family.familyName} family was removed from ${bus ? bus.name : 'the trip'}`);
        
        updateDashboard();
        updateParticipantsTable();
        updateFinancialSection();
        initializeBusTabs();
        if (family.busId === currentBusId) {
            generateBusLayout();
        }
    }
}

// Bus Management Functions
function openAddBusModal() {
    console.log('Opening add bus modal...');
    const addBusModal = document.getElementById('addBusModal');
    const busName = document.getElementById('busName');
    
    const nextBusNumber = buses.length + 1;
    if (busName) busName.value = `Bus ${nextBusNumber}`;
    
    if (addBusModal) addBusModal.classList.remove('hidden');
}

function closeAddBusModal() {
    const addBusModal = document.getElementById('addBusModal');
    const addBusForm = document.getElementById('addBusForm');
    
    if (addBusModal) addBusModal.classList.add('hidden');
    if (addBusForm) addBusForm.reset();
}

function saveNewBus() {
    console.log('Saving new bus...');
    const form = document.getElementById('addBusForm');
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }
    
    const busName = document.getElementById('busName').value;
    const busCapacity = parseInt(document.getElementById('busCapacity').value) || 56;
    
    const newBus = {
        id: Math.max(...buses.map(b => b.id)) + 1,
        name: busName,
        capacity: busCapacity,
        occupancy: 0
    };
    
    buses.push(newBus);
    
    addActivity(`${busName} added to the fleet`);
    
    initializeBusTabs();
    updateDashboard();
    updateBusFilterOptions();
    updateBusOptions();
    
    closeAddBusModal();
}

function assignSelectedSeat() {
    if (selectedSeats.length === 1) {
        openAddParticipantModal();
    }
}

// Settings and Export Functions
function updateSettings() {
    const newAdultFare = parseInt(document.getElementById('adultFareInput').value);
    const newChildFare = parseInt(document.getElementById('childFareInput').value);
    const newSeniorFare = parseInt(document.getElementById('seniorFareInput').value);
    const newDate = document.getElementById('nextTripInput').value;
    const newDestination = document.getElementById('destinationInput').value;
    
    if (newAdultFare && newAdultFare > 0) pricing.adultFare = newAdultFare;
    if (newChildFare && newChildFare > 0) pricing.childFare = newChildFare;
    if (newSeniorFare && newSeniorFare > 0) pricing.seniorFare = newSeniorFare;
    if (newDate) tripSettings.nextTripDate = newDate;
    if (newDestination) tripSettings.destination = newDestination;
    
    addActivity(`Trip settings updated - Adult: ₹${pricing.adultFare}, Child: ₹${pricing.childFare}, Senior: ₹${pricing.seniorFare}`);
    
    updateDashboard();
    updateFinancialSection();
    
    alert('Settings updated successfully!');
}

function exportFullReport() {
    const reportData = {
        tripDate: tripSettings.nextTripDate,
        destination: tripSettings.destination,
        pricing: pricing,
        totalBuses: buses.length,
        totalFamilies: families.length,
        totalParticipants: families.reduce((total, family) => total + family.members.length, 0),
        totalExpected: families.reduce((sum, family) => sum + family.totalAmount, 0),
        totalCollected: families.reduce((sum, family) => sum + family.paidAmount, 0),
        families: families.map(f => {
            const bus = buses.find(b => b.id === f.busId);
            return {
                familyName: f.familyName,
                members: f.members.length,
                bus: bus ? bus.name : 'N/A',
                seats: f.seats.join(', '),
                paymentStatus: f.paymentStatus,
                amountPaid: f.paidAmount,
                totalAmount: f.totalAmount,
                outstanding: f.totalAmount - f.paidAmount
            };
        })
    };
    
    const csv = generateFamilyCSV(reportData);
    downloadCSV(csv, `pilgrimage_family_report_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportBusReport() {
    const busReportData = buses.map(bus => {
        const busFamilies = families.filter(f => f.busId === bus.id);
        const totalParticipants = busFamilies.reduce((total, family) => total + family.members.length, 0);
        const totalExpected = busFamilies.reduce((sum, family) => sum + family.totalAmount, 0);
        const totalCollected = busFamilies.reduce((sum, family) => sum + family.paidAmount, 0);
        
        return {
            busName: bus.name,
            capacity: bus.capacity,
            families: busFamilies.length,
            occupied: totalParticipants,
            available: bus.capacity - totalParticipants,
            totalExpected,
            totalCollected,
            outstanding: totalExpected - totalCollected,
            occupancyRate: Math.round((totalParticipants / bus.capacity) * 100)
        };
    });
    
    const csv = generateBusCSV(busReportData);
    downloadCSV(csv, `pilgrimage_bus_report_${new Date().toISOString().split('T')[0]}.csv`);
}

function generateFamilyCSV(data) {
    const headers = ['Family Name', 'Members', 'Bus', 'Seats', 'Payment Status', 'Amount Paid', 'Total Amount', 'Outstanding'];
    const rows = data.families.map(f => [
        f.familyName,
        f.members,
        f.bus,
        f.seats,
        f.paymentStatus,
        f.amountPaid,
        f.totalAmount,
        f.outstanding
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function generateBusCSV(data) {
    const headers = ['Bus Name', 'Capacity', 'Families', 'Occupied', 'Available', 'Total Expected', 'Total Collected', 'Outstanding', 'Occupancy Rate'];
    const rows = data.map(bus => [
        bus.busName,
        bus.capacity,
        bus.families,
        bus.occupied,
        bus.available,
        bus.totalExpected,
        bus.totalCollected,
        bus.outstanding,
        `${bus.occupancyRate}%`
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
}

function addActivity(message) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <span class="activity-text">${message}</span>
        <span class="activity-time">Just now</span>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Keep only last 10 activities
    while (activityList.children.length > 10) {
        activityList.removeChild(activityList.lastChild);
    }
}