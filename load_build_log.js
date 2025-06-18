let allLogEntries = [];

async function loadBuildLog() {
    try {
        const response = await fetch('build_log.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allLogEntries = await response.json();
        // Sort entries by date, newest first. Assuming date format is YYYY-MM-DD or similar sortable string
        allLogEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        setupFilters();
        renderLogEntries(allLogEntries);
    } catch (error) {
        console.error("Could not load build log:", error);
        const logList = document.getElementById('build-log-list');
        if (logList) {
            logList.innerHTML = '<p class="text-danger">Error loading build log. Please try again later.</p>';
        }
    }
}

function setupFilters() {
    const filtersContainer = document.getElementById('build-log-filters');
    if (!filtersContainer) return;

    const labels = [...new Set(allLogEntries.map(entry => entry.label))];

    let filtersHTML = `
        <button class="filter-btn active btn btn-sm sw-font-size-xs sw-text-color-616161 sw-font-family-default sw-font-weight-medium sw-background-color-ffffff hover:sw-background-color-F5F5F5 sw-border-style-solid sw-border-width-xs sw-border-color-ededed hover:sw-border-color-aeaeb5 sw-border-radius-l sw-padding-top-7xs sw-padding-bottom-7xs sw-padding-left-6xs sw-padding-right-6xs sw-margin-right-6xs" onclick="filterLogEntries('All')">
            All
        </button>`;

    labels.forEach(label => {
        // Attempting to match original styling for filter buttons based on inspection
        filtersHTML += `
            <button class="filter-btn btn btn-sm sw-font-size-xs sw-text-color-616161 sw-font-family-default sw-font-weight-medium sw-background-color-e3f1fb hover:sw-background-color-b6d5eb sw-border-style-solid sw-border-width-xs sw-border-color-ededed hover:sw-border-color-aeaeb5 sw-border-radius-l sw-padding-top-7xs sw-padding-bottom-7xs sw-padding-left-6xs sw-padding-right-6xs sw-margin-right-6xs" onclick="filterLogEntries('${label}')">
                ${label}
            </button>`;
    });
    filtersContainer.innerHTML = filtersHTML;
}

function renderLogEntries(entriesToRender) {
    const logList = document.getElementById('build-log-list');
    if (!logList) return;

    if (entriesToRender.length === 0) {
        logList.innerHTML = '<p class="text-center sw-text-color-default">No log entries match the current filter.</p>';
        return;
    }

    let html = '';
    entriesToRender.forEach(log => {
        // Simplified timeline item structure, focusing on content elements and classes from original_yohei.html's list1 block
        html += `
        <div class="list-item-container col-12 mb-3"> <!-- Added mb-3 for spacing -->
            <div class="row">
                <!-- Optional: Simplified Timeline Visual Element -->
                <div class="col-auto text-center flex-column d-none d-sm-flex sw-padding-top-2xs pr-0"> <!-- pr-0 to reduce space taken by this column -->
                    <div class="row" style="height: 20px;"> <!-- Reduced height -->
                        <div class="col border-right" style="width: 10px;">&nbsp;</div> <div class="col">&nbsp;</div>
                    </div>
                    <h5 class="m-0"> <!-- Reduced margin -->
                        <span class="badge badge-pill sw-background-color-ced4da border" style="width:12px; height:12px; display:inline-block;">&nbsp;</span> <!-- Adjusted badge size -->
                    </h5>
                    <div class="row" style="flex-grow: 1;"> <!-- Allow line to fill space -->
                        <div class="col border-right" style="width: 10px;">&nbsp;</div> <div class="col">&nbsp;</div>
                    </div>
                </div>

                <div class="col py-2">
                    <div class="card border-0">
                        <div class="card-body sw-padding-left-none sw-padding-right-none"> <!-- Removed card padding, relying on item padding -->
                            <p class="sw-font-size-m sw-text-color-020202 sw-font-family-default sw-font-weight-semibold sw-letter-spacing-widest sw-padding-top-5xs sw-padding-bottom-none">
                                ${log.date}
                            </p>
                            <h3 class="sw-font-size-l sw-text-color-0A0A0A sw-font-family-default sw-font-weight-bold sw-text-align-left sw-letter-spacing-normal sw-padding-bottom-6xs">
                                ${log.link ? `<a href="${log.link}" target="_blank" class="sw-text-color-0A0A0A hover:sw-text-color-0A0A0A">${log.title}</a>` : log.title}
                            </h3>
                            <p class="sw-font-size-xs sw-text-color-616161 sw-font-family-default sw-background-color-ffffff sw-border-style-solid sw-border-width-xs sw-border-color-EDEDED sw-border-radius-l sw-padding-right-6xs sw-padding-left-6xs sw-padding-top-7xs sw-padding-bottom-7xs sw-margin-top-7xs sw-margin-bottom-none d-inline-block">
                                ${log.label}
                            </p>
                            <div class="sw-font-size-s sw-text-color-default sw-font-family-default sw-font-weight-default sw-line-height-loose sw-letter-spacing-normal sw-padding-top-6xs">
                                ${log.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    logList.innerHTML = html;
}

function filterLogEntries(label) {
    const filteredEntries = (label === 'All') ? allLogEntries : allLogEntries.filter(entry => entry.label === label);
    renderLogEntries(filteredEntries);

    // Update active state on filter buttons
    const buttons = document.querySelectorAll('#build-log-filters .filter-btn');
    buttons.forEach(button => {
        if (button.innerText === label || (label === 'All' && button.innerText === 'All')) {
            button.classList.add('active');
            // Mimic active styles from original site (example: brighter background or border)
            // For simplicity, 'active' class can be styled in CSS. Here, just adding a bootstrap 'btn-primary' like style for demo
            button.classList.remove('sw-background-color-e3f1fb', 'sw-background-color-ffffff'); // remove default
            button.classList.add('sw-background-color-3b6695', 'sw-text-color-ffffff'); // example active style
        } else {
            button.classList.remove('active', 'sw-background-color-3b6695', 'sw-text-color-ffffff');
            // Restore original styling
            if (button.innerText === "All") {
                 button.classList.add('sw-background-color-ffffff');
            } else {
                 button.classList.add('sw-background-color-e3f1fb'); // This needs to be more dynamic if colors vary per original tag
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadBuildLog);

// CSS for active filter button (can be moved to a CSS file)
const style = document.createElement('style');
style.textContent = `
    #build-log-filters .filter-btn.active {
        /* Example: using a primary color from the site and white text */
        background-color: #3b6695 !important; /* Use !important to override Softr's specific classes if necessary */
        color: #ffffff !important;
        border-color: #3b6695 !important;
    }
    /* Ensure non-active buttons revert properly, especially the 'All' button */
    #build-log-filters .filter-btn {
        margin-bottom: 0.5rem; /* Add some spacing for wrapped buttons */
    }
    #build-log-filters .filter-btn:not(.active).sw-background-color-ffffff {
         background-color: #ffffff !important;
         color: #616161 !important;
    }
    #build-log-filters .filter-btn:not(.active):not(.sw-background-color-ffffff) {
         background-color: #e3f1fb !important; /* Default for other tags, might need adjustment if colors vary */
         color: #616161 !important;
    }

    /* Minor adjustments for list items */
    #build-log-list .card-body a {
        text-decoration: none;
    }
    #build-log-list .card-body a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);
