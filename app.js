// Application Data
let buses = [
    {
        id: 1,
        name: "Bus 1",
        capacity: 56,
        occupancy: 1
    },
    {
        id: 2,
        name: "Bus 2",
        capacity: 56,
        occupancy: 1
    },
    {
        id: 3,
        name: "Bus 3",
        capacity: 56,
        occupancy: 1
    }
];

let participants = [
    {
        id: 1,
        name: "Ram Kumar",
        phone: "9876543210",
        busId: 1,
        seatNumber: 15,
        paymentStatus: "paid",
        amountPaid: 2500,
        registrationDate: "2025-07-15"
    },
    {
        id: 2,
        name: "Sita Devi",
        phone: "9876543211",
        busId: 1,
        seatNumber: 16,
        paymentStatus: "pending",
        amountPaid: 0,
        registrationDate: "2025-07-16"
    },
    {
        id: 3,
        name: "Mohan Singh",
        phone: "9876543212",
        busId: 2,
        seatNumber: 8,
        paymentStatus: "paid",
        amountPaid: 2500,
        registrationDate: "2025-07-17"
    }
];

let tripSettings = {
    ticketPrice: 2500,
    nextTripDate: "2025-08-15",
    destination: "Vaishno Devi",
    duration: "3 days",
    tripInterval: 15
};

let currentBusId = 1;
let selectedSeat = null;
let currentParticipantForPayment = null;
let financialChart = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing multi-bus application...');
    initializeNavigation();
    initializeBusTabs();
    generateBusLayout();
    updateDashboard();
    updateParticipantsTable();
    updateFinancialSection();
    initializeEventListeners();
    console.log('Multi-bus application initialized successfully');
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
        
        // Add occupancy indicator
        const occupiedSeats = participants.filter(p => p.busId === bus.id).length;
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
    
    // Clear any seat selection
    clearSeatSelection();
    
    // Update bus info and layout
    updateCurrentBusInfo();
    generateBusLayout();
}

function updateCurrentBusInfo() {
    const currentBus = buses.find(bus => bus.id === currentBusId);
    if (!currentBus) return;
    
    const occupiedSeats = participants.filter(p => p.busId === currentBusId).length;
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

// Bus Layout Generation
function generateBusLayout() {
    console.log('Generating bus layout for bus:', currentBusId);
    const busLayout = document.getElementById('busLayout');
    if (!busLayout) return;
    
    busLayout.innerHTML = '';
    
    // Get participants for current bus
    const busParticipants = participants.filter(p => p.busId === currentBusId);
    
    // Regular rows (1-10): 2 seats left + 3 seats right
    for (let row = 1; row <= 10; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'bus-row';
        
        // Left seats
        const leftGroup = document.createElement('div');
        leftGroup.className = 'seat-group';
        
        for (let seatIndex = 1; seatIndex <= 2; seatIndex++) {
            const seatNumber = (row - 1) * 5 + seatIndex;
            const seat = createSeat(seatNumber, busParticipants);
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
            const seat = createSeat(seatNumber, busParticipants);
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
        const seat = createSeat(seatIndex, busParticipants);
        lastRowGroup.appendChild(seat);
    }
    
    lastRowDiv.appendChild(lastRowGroup);
    busLayout.appendChild(lastRowDiv);
}

function createSeat(seatNumber, busParticipants) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.textContent = seatNumber;
    seat.dataset.seat = seatNumber;
    seat.dataset.busId = currentBusId;
    
    // Check if seat is booked
    const participant = busParticipants.find(p => p.seatNumber === seatNumber);
    if (participant) {
        seat.classList.add('booked');
        seat.title = `Occupied by ${participant.name}`;
    } else {
        seat.classList.add('available');
        seat.addEventListener('click', () => selectSeat(seatNumber));
    }
    
    return seat;
}

function selectSeat(seatNumber) {
    console.log('Selecting seat:', seatNumber, 'on bus:', currentBusId);
    
    // Clear previous selection
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });
    
    // Select new seat
    const seatElement = document.querySelector(`[data-seat="${seatNumber}"][data-bus-id="${currentBusId}"]`);
    if (seatElement) {
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
    }
    
    selectedSeat = seatNumber;
    
    // Show seat selection info
    const selectedSeatSpan = document.getElementById('selectedSeatNumber');
    const selectedBusSpan = document.getElementById('selectedBusName');
    const seatSelectionInfo = document.getElementById('seatSelectionInfo');
    
    const currentBus = buses.find(bus => bus.id === currentBusId);
    
    if (selectedSeatSpan) selectedSeatSpan.textContent = seatNumber;
    if (selectedBusSpan) selectedBusSpan.textContent = currentBus ? currentBus.name : '';
    if (seatSelectionInfo) seatSelectionInfo.style.display = 'block';
}

// Dashboard Updates
function updateDashboard() {
    console.log('Updating dashboard...');
    
    // Calculate totals across all buses
    const totalParticipants = participants.length;
    const totalCapacity = buses.length * 56;
    const availableSeats = totalCapacity - totalParticipants;
    
    // Update statistics
    const totalParticipantsEl = document.getElementById('totalParticipants');
    const totalBusCapacityEl = document.getElementById('totalBusCapacity');
    const availableSeatsEl = document.getElementById('availableSeats');
    const nextTripDateEl = document.getElementById('nextTripDate');
    
    if (totalParticipantsEl) totalParticipantsEl.textContent = totalParticipants;
    if (totalBusCapacityEl) totalBusCapacityEl.textContent = totalCapacity;
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
    const totalExpected = participants.length * tripSettings.ticketPrice;
    const totalCollected = participants.reduce((sum, p) => sum + p.amountPaid, 0);
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
        const busParticipants = participants.filter(p => p.busId === bus.id);
        const occupancy = busParticipants.length;
        const occupancyPercent = Math.round((occupancy / bus.capacity) * 100);
        
        const busStatItem = document.createElement('div');
        busStatItem.className = 'bus-stat-item';
        busStatItem.innerHTML = `
            <div class="bus-stat-name">${bus.name}</div>
            <div class="bus-stat-occupancy">${occupancy}/${bus.capacity}</div>
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
    
    // Get filtered participants based on bus filter
    const busFilter = document.getElementById('filterByBus');
    const selectedBusFilter = busFilter ? busFilter.value : '';
    
    let filteredParticipants = participants;
    if (selectedBusFilter) {
        filteredParticipants = participants.filter(p => p.busId === parseInt(selectedBusFilter));
    }
    
    filteredParticipants.forEach(participant => {
        const bus = buses.find(b => b.id === participant.busId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.name}</td>
            <td>${participant.phone}</td>
            <td>${bus ? bus.name : 'N/A'}</td>
            <td>${participant.seatNumber || '-'}</td>
            <td><span class="status status--${getStatusClass(participant.paymentStatus)}">${participant.paymentStatus}</span></td>
            <td>₹${participant.amountPaid.toLocaleString()}</td>
            <td>
                <div class="participant-actions">
                    <button class="btn btn-small btn--secondary" onclick="editParticipant(${participant.id})">Edit</button>
                    <button class="btn btn-small btn--primary" onclick="updatePayment(${participant.id})">Payment</button>
                    <button class="btn btn-small btn--outline" onclick="removeParticipant(${participant.id})">Remove</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update bus and seat options in modals
    updateBusOptions();
    updateSeatOptions();
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
    const participantBus = document.getElementById('participantBus');
    if (!participantBus) return;
    
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

function updateSeatOptions() {
    const participantSeat = document.getElementById('participantSeat');
    const participantBus = document.getElementById('participantBus');
    
    if (!participantSeat || !participantBus) return;
    
    const selectedBusId = parseInt(participantBus.value);
    participantSeat.innerHTML = '<option value="">Select Seat (Optional)</option>';
    
    if (!selectedBusId) return;
    
    // Get booked seats for selected bus
    const bookedSeats = participants
        .filter(p => p.busId === selectedBusId && p.seatNumber)
        .map(p => p.seatNumber);
    
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
    if (selectedSeat && selectedBusId === currentBusId) {
        participantSeat.value = selectedSeat;
    }
}

function getStatusClass(status) {
    switch(status) {
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
    const ticketPriceInput = document.getElementById('ticketPriceInput');
    const nextTripInput = document.getElementById('nextTripInput');
    const destinationInput = document.getElementById('destinationInput');
    
    if (ticketPriceInput) ticketPriceInput.value = tripSettings.ticketPrice;
    if (nextTripInput) nextTripInput.value = tripSettings.nextTripDate;
    if (destinationInput) destinationInput.value = tripSettings.destination;
    
    // Update bus-wise payments
    updateBusPaymentsGrid();
    
    // Update reports
    const outstandingCount = participants.filter(p => p.paymentStatus !== 'paid').length;
    const collectionRate = participants.length > 0 ? 
        Math.round((participants.filter(p => p.paymentStatus === 'paid').length / participants.length) * 100) : 0;
    
    const busesWithFullPayment = buses.filter(bus => {
        const busParticipants = participants.filter(p => p.busId === bus.id);
        return busParticipants.length > 0 && busParticipants.every(p => p.paymentStatus === 'paid');
    }).length;
    
    const outstandingCountEl = document.getElementById('outstandingCount');
    const collectionRateEl = document.getElementById('collectionRate');
    const fullPaidBusesEl = document.getElementById('fullPaidBuses');
    
    if (outstandingCountEl) outstandingCountEl.textContent = outstandingCount;
    if (collectionRateEl) collectionRateEl.textContent = `${collectionRate}%`;
    if (fullPaidBusesEl) fullPaidBusesEl.textContent = `${busesWithFullPayment}/${buses.length}`;
}

function updateBusPaymentsGrid() {
    const busPaymentsGrid = document.getElementById('busPaymentsGrid');
    if (!busPaymentsGrid) return;
    
    busPaymentsGrid.innerHTML = '';
    
    buses.forEach(bus => {
        const busParticipants = participants.filter(p => p.busId === bus.id);
        const totalExpected = busParticipants.length * tripSettings.ticketPrice;
        const totalCollected = busParticipants.reduce((sum, p) => sum + p.amountPaid, 0);
        const totalOutstanding = totalExpected - totalCollected;
        
        const busPaymentSummary = document.createElement('div');
        busPaymentSummary.className = 'bus-payment-summary';
        busPaymentSummary.innerHTML = `
            <div class="bus-payment-header">
                <div class="bus-payment-name">${bus.name}</div>
                <div class="bus-payment-occupancy">${busParticipants.length}/${bus.capacity}</div>
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
    
    // Add Participant Modal
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const saveParticipantBtn = document.getElementById('saveParticipantBtn');
    
    if (addParticipantBtn) addParticipantBtn.addEventListener('click', openAddParticipantModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAddParticipantModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeAddParticipantModal);
    if (saveParticipantBtn) saveParticipantBtn.addEventListener('click', saveParticipant);
    
    // Bus selection change in participant modal
    const participantBus = document.getElementById('participantBus');
    if (participantBus) participantBus.addEventListener('change', handleBusSelectionChange);
    
    // Bus filter change
    const filterByBus = document.getElementById('filterByBus');
    if (filterByBus) filterByBus.addEventListener('change', updateParticipantsTable);
    
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
    
    // Seat Management
    const assignSeatBtn = document.getElementById('assignSeatBtn');
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    
    if (assignSeatBtn) assignSeatBtn.addEventListener('click', assignSelectedSeat);
    if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', clearSeatSelection);
    
    // Settings
    const updateSettingsBtn = document.getElementById('updateSettingsBtn');
    if (updateSettingsBtn) updateSettingsBtn.addEventListener('click', updateSettings);
    
    // Export Reports
    const exportReportBtn = document.getElementById('exportReportBtn');
    const exportBusReportBtn = document.getElementById('exportBusReportBtn');
    if (exportReportBtn) exportReportBtn.addEventListener('click', exportFullReport);
    if (exportBusReportBtn) exportBusReportBtn.addEventListener('click', exportBusReport);
    
    // Close modals when clicking outside
    const modals = ['addParticipantModal', 'paymentModal', 'addBusModal'];
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

// Fixed bus selection change handler
function handleBusSelectionChange() {
    console.log('Bus selection changed');
    updateSeatOptions();
}

// Modal Functions
function openAddParticipantModal() {
    console.log('Opening add participant modal...');
    const addParticipantModal = document.getElementById('addParticipantModal');
    
    // Reset and update bus options first
    updateBusOptions();
    
    // Pre-select current bus if no seat is selected, otherwise use the bus from seat selection
    const participantBus = document.getElementById('participantBus');
    if (participantBus) {
        participantBus.value = currentBusId;
        // Trigger the change event to update seat options
        handleBusSelectionChange();
        
        // Pre-select seat if available
        if (selectedSeat) {
            const participantSeat = document.getElementById('participantSeat');
            if (participantSeat) {
                participantSeat.value = selectedSeat;
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

function openAddBusModal() {
    console.log('Opening add bus modal...');
    const addBusModal = document.getElementById('addBusModal');
    const busName = document.getElementById('busName');
    
    // Pre-fill next bus number
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

function openPaymentModal(participantId) {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;
    
    currentParticipantForPayment = participant;
    const bus = buses.find(b => b.id === participant.busId);
    
    const paymentParticipantName = document.getElementById('paymentParticipantName');
    const paymentParticipantBus = document.getElementById('paymentParticipantBus');
    const paymentParticipantSeat = document.getElementById('paymentParticipantSeat');
    const paymentCurrentStatus = document.getElementById('paymentCurrentStatus');
    const paymentCurrentAmount = document.getElementById('paymentCurrentAmount');
    const updatePaymentStatus = document.getElementById('updatePaymentStatus');
    const updateAmountPaid = document.getElementById('updateAmountPaid');
    const paymentModal = document.getElementById('paymentModal');
    
    if (paymentParticipantName) paymentParticipantName.textContent = participant.name;
    if (paymentParticipantBus) paymentParticipantBus.textContent = bus ? bus.name : 'N/A';
    if (paymentParticipantSeat) paymentParticipantSeat.textContent = participant.seatNumber || 'Not assigned';
    if (paymentCurrentStatus) paymentCurrentStatus.textContent = participant.paymentStatus;
    if (paymentCurrentAmount) paymentCurrentAmount.textContent = participant.amountPaid;
    if (updatePaymentStatus) updatePaymentStatus.value = participant.paymentStatus;
    if (updateAmountPaid) updateAmountPaid.value = participant.amountPaid;
    
    if (paymentModal) paymentModal.classList.remove('hidden');
}

function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) paymentModal.classList.add('hidden');
    currentParticipantForPayment = null;
}

// Business Logic Functions
function saveParticipant() {
    console.log('Saving participant...');
    const form = document.getElementById('addParticipantForm');
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }
    
    const name = document.getElementById('participantName').value;
    const phone = document.getElementById('participantPhone').value;
    const busId = parseInt(document.getElementById('participantBus').value);
    const seatNumber = parseInt(document.getElementById('participantSeat').value) || null;
    const paymentStatus = document.getElementById('participantPaymentStatus').value;
    const amountPaid = parseInt(document.getElementById('participantAmountPaid').value) || 0;
    
    const newParticipant = {
        id: Date.now(),
        name,
        phone,
        busId,
        seatNumber,
        paymentStatus,
        amountPaid,
        registrationDate: new Date().toISOString().split('T')[0]
    };
    
    participants.push(newParticipant);
    
    // Add activity
    const bus = buses.find(b => b.id === busId);
    addActivity(`${name} registered for ${bus ? bus.name : 'Unknown Bus'}, seat ${seatNumber || 'TBD'}`);
    
    // Update UI
    updateDashboard();
    updateParticipantsTable();
    updateFinancialSection();
    initializeBusTabs();
    if (busId === currentBusId) {
        generateBusLayout();
    }
    
    closeAddParticipantModal();
    clearSeatSelection();
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
    
    // Update UI
    initializeBusTabs();
    updateDashboard();
    updateBusFilterOptions();
    updateBusOptions();
    
    closeAddBusModal();
}

function editParticipant(participantId) {
    updatePayment(participantId);
}

function removeParticipant(participantId) {
    if (confirm('Are you sure you want to remove this participant?')) {
        const participant = participants.find(p => p.id === participantId);
        const bus = buses.find(b => b.id === participant.busId);
        participants = participants.filter(p => p.id !== participantId);
        
        addActivity(`${participant.name} was removed from ${bus ? bus.name : 'the trip'}`);
        
        updateDashboard();
        updateParticipantsTable();
        updateFinancialSection();
        initializeBusTabs();
        if (participant.busId === currentBusId) {
            generateBusLayout();
        }
    }
}

function updatePayment(participantId) {
    openPaymentModal(participantId);
}

function savePaymentUpdate() {
    if (!currentParticipantForPayment) return;
    
    const newStatus = document.getElementById('updatePaymentStatus').value;
    const newAmount = parseInt(document.getElementById('updateAmountPaid').value) || 0;
    
    const participant = participants.find(p => p.id === currentParticipantForPayment.id);
    if (participant) {
        const oldAmount = participant.amountPaid;
        participant.paymentStatus = newStatus;
        participant.amountPaid = newAmount;
        
        if (newAmount !== oldAmount) {
            addActivity(`Payment updated for ${participant.name} - ₹${newAmount}`);
        }
        
        updateDashboard();
        updateParticipantsTable();
        updateFinancialSection();
    }
    
    closePaymentModal();
}

function assignSelectedSeat() {
    if (!selectedSeat) return;
    openAddParticipantModal();
}

function clearSeatSelection() {
    if (selectedSeat) {
        const seatElement = document.querySelector(`[data-seat="${selectedSeat}"][data-bus-id="${currentBusId}"]`);
        if (seatElement) {
            seatElement.classList.remove('selected');
            seatElement.classList.add('available');
        }
    }
    
    selectedSeat = null;
    const seatSelectionInfo = document.getElementById('seatSelectionInfo');
    if (seatSelectionInfo) seatSelectionInfo.style.display = 'none';
}

function updateSettings() {
    const newPrice = parseInt(document.getElementById('ticketPriceInput').value);
    const newDate = document.getElementById('nextTripInput').value;
    const newDestination = document.getElementById('destinationInput').value;
    
    if (newPrice && newPrice > 0) {
        tripSettings.ticketPrice = newPrice;
    }
    
    if (newDate) {
        tripSettings.nextTripDate = newDate;
    }
    
    if (newDestination) {
        tripSettings.destination = newDestination;
    }
    
    addActivity(`Trip settings updated - Price: ₹${tripSettings.ticketPrice}, Destination: ${tripSettings.destination}`);
    
    updateDashboard();
    updateFinancialSection();
    
    alert('Settings updated successfully!');
}

function exportFullReport() {
    const reportData = {
        tripDate: tripSettings.nextTripDate,
        destination: tripSettings.destination,
        ticketPrice: tripSettings.ticketPrice,
        totalBuses: buses.length,
        totalParticipants: participants.length,
        totalExpected: participants.length * tripSettings.ticketPrice,
        totalCollected: participants.reduce((sum, p) => sum + p.amountPaid, 0),
        participants: participants.map(p => {
            const bus = buses.find(b => b.id === p.busId);
            return {
                name: p.name,
                phone: p.phone,
                bus: bus ? bus.name : 'N/A',
                seat: p.seatNumber || '',
                paymentStatus: p.paymentStatus,
                amountPaid: p.amountPaid,
                outstanding: tripSettings.ticketPrice - p.amountPaid
            };
        })
    };
    
    const csv = generateFullCSV(reportData);
    downloadCSV(csv, `pilgrimage_full_report_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportBusReport() {
    const busReportData = buses.map(bus => {
        const busParticipants = participants.filter(p => p.busId === bus.id);
        const totalExpected = busParticipants.length * tripSettings.ticketPrice;
        const totalCollected = busParticipants.reduce((sum, p) => sum + p.amountPaid, 0);
        
        return {
            busName: bus.name,
            capacity: bus.capacity,
            occupied: busParticipants.length,
            available: bus.capacity - busParticipants.length,
            totalExpected,
            totalCollected,
            outstanding: totalExpected - totalCollected,
            occupancyRate: Math.round((busParticipants.length / bus.capacity) * 100)
        };
    });
    
    const csv = generateBusCSV(busReportData);
    downloadCSV(csv, `pilgrimage_bus_report_${new Date().toISOString().split('T')[0]}.csv`);
}

function generateFullCSV(data) {
    const headers = ['Name', 'Phone', 'Bus', 'Seat', 'Payment Status', 'Amount Paid', 'Outstanding'];
    const rows = data.participants.map(p => [
        p.name,
        p.phone,
        p.bus,
        p.seat,
        p.paymentStatus,
        p.amountPaid,
        p.outstanding
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function generateBusCSV(data) {
    const headers = ['Bus Name', 'Capacity', 'Occupied', 'Available', 'Total Expected', 'Total Collected', 'Outstanding', 'Occupancy Rate'];
    const rows = data.map(bus => [
        bus.busName,
        bus.capacity,
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