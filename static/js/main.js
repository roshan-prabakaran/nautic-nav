// Global variables
let updateInterval
let isRealTimeEnabled = true

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Set up navigation active states
  setActiveNavigation()

  // Initialize real-time updates if on dashboard
  if (window.location.pathname === "/" || window.location.pathname === "/dashboard") {
    startRealTimeUpdates()
  }

  // Add global event listeners
  addGlobalEventListeners()
}

function setActiveNavigation() {
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === currentPath || (currentPath === "/" && link.getAttribute("href") === "/")) {
      link.classList.add("active")
    }
  })
}

function startRealTimeUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval)
  }

  // Update every 30 seconds
  updateInterval = setInterval(() => {
    if (isRealTimeEnabled) {
      updateRealTimeData()
    }
  }, 30000)
}

function updateRealTimeData() {
  // This function would be called by individual pages
  // to update their specific real-time data
  const event = new CustomEvent("realTimeUpdate")
  document.dispatchEvent(event)
}

function addGlobalEventListeners() {
  // Add click handlers for any global buttons
  document.addEventListener("click", (e) => {
    // Handle refresh buttons
    if (e.target.classList.contains("refresh-btn") || e.target.closest(".refresh-btn")) {
      handleRefresh(e)
    }

    // Handle export buttons
    if (e.target.classList.contains("export-btn") || e.target.closest(".export-btn")) {
      handleExport(e)
    }
  })

  // Handle visibility change to pause/resume updates
  document.addEventListener("visibilitychange", () => {
    isRealTimeEnabled = !document.hidden
  })
}

function handleRefresh(e) {
  e.preventDefault()
  const button = e.target.closest(".refresh-btn") || e.target

  // Add loading state
  button.disabled = true
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...'

  // Simulate refresh delay
  setTimeout(() => {
    button.disabled = false
    button.innerHTML = originalText

    // Trigger refresh event
    const refreshEvent = new CustomEvent("dataRefresh")
    document.dispatchEvent(refreshEvent)
  }, 1000)
}

function handleExport(e) {
  e.preventDefault()
  const button = e.target.closest(".export-btn") || e.target
  const exportType = button.dataset.export || "pdf"

  // Show export notification
  showNotification(`Exporting data as ${exportType.toUpperCase()}...`, "info")

  // Simulate export process
  setTimeout(() => {
    showNotification(`${exportType.toUpperCase()} export completed!`, "success")
  }, 2000)
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add to page
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)

  // Add close handler
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.remove()
  })

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)
}

function getNotificationIcon(type) {
  const icons = {
    info: "info-circle",
    success: "check-circle",
    warning: "exclamation-triangle",
    error: "times-circle",
  }
  return icons[type] || "info-circle"
}

// Utility functions
function formatNumber(num, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export functions for use in other scripts
window.NauticNet = {
  showNotification,
  formatNumber,
  formatDateTime,
  debounce,
  updateRealTimeData,
}
