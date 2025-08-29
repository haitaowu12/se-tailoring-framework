/**
 * Main Application Controller for SE Process Tailoring Framework
 * Handles navigation, data loading, and view management
 */

// Import component modules
import './components/assessment.js';
import './components/visualization.js';
import './components/recommendations.js';
import './components/export.js';

class SEFrameworkApp {
  constructor() {
    this.currentView = "welcome";
    this.assessmentData = {};
    this.processData = {};
    this.questionData = {};
    this.dependencyData = {};
    this.recommendations = {};
    this.assessmentEngine = null;
    this.visualizer = null;
    this.recommendationEngine = null;
    this.exportManager = null;

    // Assessment state
    this.assessmentResponses = {};
    this.assessmentScores = {
      complexity: 0,
      safety: 0,
      scale: 0,
      maturity: 0,
      overall: 0,
    };

    this.init();
  }

  async init() {
    try {
      console.log("=== SE Framework App Initialization Started ===");
      this.showLoading();

      // Check if required components are loaded
      console.log("Step 1: Checking component availability:", {
        AssessmentEngine: typeof AssessmentEngine,
        ProcessNetworkVisualizer: typeof ProcessNetworkVisualizer,
        RecommendationEngine: typeof RecommendationEngine,
        ExportManager: typeof ExportManager,
      });

      console.log("Step 2: Loading data...");
      await this.loadData();
      console.log("Step 3: Data loaded successfully");

      console.log("Step 4: Setting up event listeners...");
      this.setupEventListeners();
      console.log("Step 5: Event listeners setup complete");

      console.log("Step 6: Rendering welcome view...");
      this.renderWelcomeView();
      console.log("Step 7: Welcome view rendered");

      console.log("Step 8: About to hide loading overlay...");
      this.hideLoading();
      console.log("Step 9: Loading overlay hidden");

      console.log("=== App Initialized Successfully ===");
    } catch (error) {
      console.error("=== App Initialization Failed ===", error);
      console.error("Error details:", error.stack);
      this.showError(
        `Failed to load application data: ${error.message}. Please refresh the page.`,
      );
      this.hideLoading();
    }
  }

  async loadData() {
    try {
      console.log("Starting data loading...");

      // Load data files sequentially for better error handling
      const basePath = window.location.hostname === 'localhost' ? '' : '/se-tailoring-framework';
      const processesResponse = await fetch(`${basePath}/data/processes.json`);
      console.log("Processes response status:", processesResponse.status);
      if (!processesResponse.ok) {
        throw new Error("Failed to load processes data");
      }
      const processes = await processesResponse.json();

      const questionsResponse = await fetch(`${basePath}/data/questions.json`);
      console.log("Questions response status:", questionsResponse.status);
      if (!questionsResponse.ok) {
        throw new Error("Failed to load questions data");
      }
      const questions = await questionsResponse.json();

      const dependenciesResponse = await fetch(`${basePath}/data/dependencies.json`);
      console.log("Dependencies response status:", dependenciesResponse.status);
      if (!dependenciesResponse.ok) {
        throw new Error("Failed to load dependencies data");
      }
      const dependencies = await dependenciesResponse.json();

      console.log("Data loaded successfully:", {
        processes: processes.processes ? processes.processes.length : 0,
        questions: questions.assessmentCategories
          ? questions.assessmentCategories.length
          : 0,
        dependencies: dependencies.dependencies
          ? dependencies.dependencies.length
          : 0,
      });

      this.processData = processes;
      this.questionData = questions;
      this.dependencyData = dependencies;

      console.log("Step 2.5: Checking component classes...");
      // Check if component classes are available
      const componentCheck = {
        AssessmentEngine: typeof AssessmentEngine,
        ProcessNetworkVisualizer: typeof ProcessNetworkVisualizer,
        RecommendationEngine: typeof RecommendationEngine,
        ExportManager: typeof ExportManager,
      };
      console.log("Component availability:", componentCheck);

      if (typeof AssessmentEngine === "undefined") {
        throw new Error("AssessmentEngine class not loaded");
      }
      if (typeof ProcessNetworkVisualizer === "undefined") {
        throw new Error("ProcessNetworkVisualizer class not loaded");
      }
      if (typeof RecommendationEngine === "undefined") {
        throw new Error("RecommendationEngine class not loaded");
      }
      if (typeof ExportManager === "undefined") {
        throw new Error("ExportManager class not loaded");
      }

      console.log("Step 2.6: Initializing components...");
      // Initialize components
      this.assessmentEngine = new AssessmentEngine(this.questionData, this);
      console.log("AssessmentEngine created");

      this.visualizer = new ProcessNetworkVisualizer(
        this.processData,
        this.dependencyData,
        this,
      );
      console.log("ProcessNetworkVisualizer created");

      this.recommendationEngine = new RecommendationEngine(
        this.processData,
        this.dependencyData,
        this,
      );
      console.log("RecommendationEngine created");

      this.exportManager = new ExportManager(this);
      console.log("ExportManager created");

      console.log("Step 2.7: All components initialized successfully");
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  setupEventListeners() {
    try {
      // Navigation
      const brandLink = document.getElementById("brand-link");
      if (brandLink) {
        brandLink.addEventListener("click", (e) => {
          e.preventDefault();
          this.showView("welcome");
        });
      }

      const navWelcome = document.getElementById("nav-welcome");
      if (navWelcome) {
        navWelcome.addEventListener("click", (e) => {
          e.preventDefault();
          this.showView("welcome");
        });
      }

      const navAssessment = document.getElementById("nav-assessment");
      if (navAssessment) {
        navAssessment.addEventListener("click", (e) => {
          e.preventDefault();
          this.showView("assessment");
        });
      }

      const navVisualization = document.getElementById("nav-visualization");
      if (navVisualization) {
        navVisualization.addEventListener("click", (e) => {
          e.preventDefault();
          this.showView("visualization");
        });
      }

      const navRecommendations = document.getElementById("nav-recommendations");
      if (navRecommendations) {
        navRecommendations.addEventListener("click", (e) => {
          e.preventDefault();
          this.showView("recommendations");
        });
      }

      const navExport = document.getElementById("nav-export");
      if (navExport) {
        navExport.addEventListener("click", (e) => {
          e.preventDefault();
          this.showView("export");
        });
      }

      // Start assessment button
      const startAssessmentBtn = document.getElementById(
        "start-assessment-btn",
      );
      if (startAssessmentBtn) {
        startAssessmentBtn.addEventListener("click", () => {
          this.showView("assessment");
        });
      }
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            this.showView("welcome");
            break;
          case "2":
            e.preventDefault();
            this.showView("assessment");
            break;
          case "3":
            e.preventDefault();
            this.showView("visualization");
            break;
          case "4":
            e.preventDefault();
            this.showView("recommendations");
            break;
          case "5":
            e.preventDefault();
            this.showView("export");
            break;
        }
      }
    });
  }

  showView(viewName) {
    console.log(`=== showView called with: ${viewName} ===`);
    try {
      console.log(`Step 1: Hiding all views...`);
      // Hide all views
      const allViews = document.querySelectorAll(".view-container");
      console.log(`Found ${allViews.length} view containers`);
      allViews.forEach((view) => {
        view.style.display = "none";
      });

      console.log(`Step 2: Updating navigation...`);
      // Update navigation
      const allNavLinks = document.querySelectorAll(".nav-link");
      console.log(`Found ${allNavLinks.length} nav links`);
      allNavLinks.forEach((link) => {
        link.classList.remove("active");
      });

      console.log(`Step 3: Showing target view: ${viewName}-view`);
      // Show selected view
      const targetView = document.getElementById(`${viewName}-view`);
      console.log(`Target view element:`, targetView);

      if (targetView) {
        targetView.style.display = "block";
        console.log(`Step 3a: Target view displayed`);

        // Activate corresponding nav link
        const navLink = document.getElementById(`nav-${viewName}`);
        console.log(`Nav link element:`, navLink);
        if (navLink) {
          navLink.classList.add("active");
          console.log(`Step 3b: Nav link activated`);
        }

        this.currentView = viewName;
        console.log(`Step 3c: Current view set to ${viewName}`);

        console.log(`Step 4: Initializing view-specific content...`);
        // Initialize view-specific content
        switch (viewName) {
          case "assessment":
            this.renderAssessmentView();
            break;
          case "visualization":
            this.renderVisualizationView();
            break;
          case "recommendations":
            this.renderRecommendationsView();
            break;
          case "export":
            this.renderExportView();
            break;
        }
        console.log(`Step 4a: View-specific content initialized`);

        console.log(`Step 5: Updating progress indicator...`);
        // Update progress indicator
        this.updateProgressIndicator();
        console.log(`Step 5a: Progress indicator updated`);

        // Scroll to top
        window.scrollTo(0, 0);
        console.log(`Step 6: Scrolled to top`);

        console.log(`=== View ${viewName} shown successfully ===`);
      } else {
        console.error(`View ${viewName} not found`);
        console.error(
          `Available views:`,
          Array.from(document.querySelectorAll('[id$="-view"]')).map(
            (el) => el.id,
          ),
        );
      }
    } catch (error) {
      console.error(`Error showing view ${viewName}:`, error);
      console.error(`Error stack:`, error.stack);
    }
  }

  renderWelcomeView() {
    console.log("Rendering welcome view...");
    try {
      // Welcome view is static HTML, just ensure it's visible
      this.showView("welcome");
      console.log("Welcome view rendered successfully");
    } catch (error) {
      console.error("Error rendering welcome view:", error);
      // Fallback: manually show welcome view
      const welcomeView = document.getElementById("welcome-view");
      if (welcomeView) {
        welcomeView.style.display = "block";
      }
    }
  }

  renderAssessmentView() {
    if (this.assessmentEngine) {
      this.assessmentEngine.render();
      this.showProgressIndicator();
    }
  }

  renderVisualizationView() {
    if (this.visualizer) {
      // Small delay to ensure container is visible before rendering
      setTimeout(() => {
        this.visualizer.render();
      }, 100);
    }
  }

  renderRecommendationsView() {
    if (this.recommendationEngine) {
      this.recommendationEngine.render();
    }
  }

  renderExportView() {
    if (this.exportManager) {
      this.exportManager.render();
    }
  }

  updateProgressIndicator() {
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("overall-progress");
    const progressText = document.getElementById("progress-text");

    if (this.currentView === "welcome") {
      progressContainer.style.display = "none";
      return;
    }

    // Calculate overall progress
    let progress = 0;
    switch (this.currentView) {
      case "assessment":
        progress = this.getAssessmentProgress();
        break;
      case "visualization":
        progress = this.hasCompletedAssessment() ? 75 : 25;
        break;
      case "recommendations":
        progress = this.hasCompletedAssessment() ? 90 : 50;
        break;
      case "export":
        progress = 100;
        break;
    }

    progressContainer.style.display = "block";
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
  }

  showProgressIndicator() {
    document.getElementById("progress-container").style.display = "block";
  }

  hideProgressIndicator() {
    document.getElementById("progress-container").style.display = "none";
  }

  getAssessmentProgress() {
    if (!this.assessmentEngine) return 0;

    const totalQuestions = this.getTotalQuestions();
    const answeredQuestions = Object.keys(this.assessmentResponses).length;

    return totalQuestions > 0
      ? Math.min((answeredQuestions / totalQuestions) * 60, 60)
      : 0;
  }

  getTotalQuestions() {
    if (!this.questionData.assessmentCategories) return 0;

    return this.questionData.assessmentCategories.reduce((total, category) => {
      return total + (category.questions ? category.questions.length : 0);
    }, 0);
  }

  hasCompletedAssessment() {
    const totalQuestions = this.getTotalQuestions();
    const answeredQuestions = Object.keys(this.assessmentResponses).length;
    return answeredQuestions >= totalQuestions && totalQuestions > 0;
  }

  updateAssessmentResponse(questionId, response) {
    this.assessmentResponses[questionId] = response;
    this.calculateScores();
    this.updateProgressIndicator();

    // Auto-save to localStorage
    this.saveAssessmentState();
  }

  calculateScores() {
    if (!this.questionData.assessmentCategories) return;

    const dimensionScores = {
      complexity: [],
      safety: [],
      scale: [],
      maturity: [],
    };

    // Calculate dimension scores based on responses
    this.questionData.assessmentCategories.forEach((category) => {
      category.questions.forEach((question) => {
        const response = this.assessmentResponses[question.id];
        if (response && response.score !== undefined) {
          const dimension = question.dimension;
          if (dimensionScores[dimension]) {
            dimensionScores[dimension].push({
              score: response.score,
              weight: question.weight || 1,
            });
          }
        }
      });
    });

    // Calculate weighted averages for each dimension
    Object.keys(dimensionScores).forEach((dimension) => {
      const scores = dimensionScores[dimension];
      if (scores.length > 0) {
        const weightedSum = scores.reduce(
          (sum, item) => sum + item.score * item.weight,
          0,
        );
        const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
        this.assessmentScores[dimension] =
          totalWeight > 0 ? weightedSum / totalWeight : 0;
      }
    });

    // Calculate overall score (weighted average of dimensions)
    const dimensionWeights = {
      complexity: 0.3,
      safety: 0.25,
      scale: 0.25,
      maturity: 0.2,
    };

    let overallScore = 0;
    let totalWeight = 0;

    Object.keys(dimensionWeights).forEach((dimension) => {
      if (this.assessmentScores[dimension] > 0) {
        overallScore +=
          this.assessmentScores[dimension] * dimensionWeights[dimension];
        totalWeight += dimensionWeights[dimension];
      }
    });

    this.assessmentScores.overall =
      totalWeight > 0 ? overallScore / totalWeight : 0;

    // Generate recommendations if assessment is complete
    if (this.hasCompletedAssessment() && this.recommendationEngine) {
      this.recommendations = this.recommendationEngine.generateRecommendations(
        this.assessmentScores,
      );
    }
  }

  saveAssessmentState() {
    const state = {
      responses: this.assessmentResponses,
      scores: this.assessmentScores,
      recommendations: this.recommendations,
      timestamp: Date.now(),
    };
    localStorage.setItem("se-tailoring-assessment", JSON.stringify(state));
  }

  loadAssessmentState() {
    try {
      const saved = localStorage.getItem("se-tailoring-assessment");
      if (saved) {
        const state = JSON.parse(saved);

        // Only load if saved within last 24 hours
        const dayOld = 24 * 60 * 60 * 1000;
        if (Date.now() - state.timestamp < dayOld) {
          this.assessmentResponses = state.responses || {};
          this.assessmentScores = state.scores || {};
          this.recommendations = state.recommendations || {};
          return true;
        }
      }
    } catch (error) {
      // Failed to load saved assessment state
    }
    return false;
  }

  clearAssessmentState() {
    this.assessmentResponses = {};
    this.assessmentScores = {
      complexity: 0,
      safety: 0,
      scale: 0,
      maturity: 0,
      overall: 0,
    };
    this.recommendations = {};
    localStorage.removeItem("se-tailoring-assessment");
    this.updateProgressIndicator();
  }

  showLoading() {
    document.getElementById("loading-overlay").style.display = "flex";
  }

  hideLoading() {
    console.log("=== Hiding loading overlay ===");
    const loadingOverlay = document.getElementById("loading-overlay");
    console.log("Loading overlay element:", loadingOverlay);

    if (loadingOverlay) {
      console.log("Current display style:", loadingOverlay.style.display);
      console.log(
        "Current computed style:",
        window.getComputedStyle(loadingOverlay).display,
      );

      // Try multiple approaches to hide it
      loadingOverlay.style.display = "none";
      loadingOverlay.style.visibility = "hidden";
      loadingOverlay.style.opacity = "0";
      loadingOverlay.style.pointerEvents = "none";

      // Also add a class to ensure it stays hidden
      loadingOverlay.classList.add("hidden");

      console.log("Loading overlay hidden with multiple methods");
      console.log("New display style:", loadingOverlay.style.display);
      console.log(
        "New computed style:",
        window.getComputedStyle(loadingOverlay).display,
      );
    } else {
      console.warn("Loading overlay element not found");
      console.log(
        "Available elements with loading in ID:",
        Array.from(document.querySelectorAll('[id*="loading"]')).map(
          (el) => el.id,
        ),
      );
    }
    console.log("=== Loading overlay hide attempt complete ===");
  }

  showError(message) {
    console.error("Showing error:", message);

    // Create and show error alert
    const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Error:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    // Insert at top of main content
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.insertAdjacentHTML("afterbegin", alertHtml);

      // Auto-remove after 10 seconds
      setTimeout(() => {
        const alert = mainContent.querySelector(".alert-danger");
        if (alert) {
          try {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
          } catch (e) {
            // Fallback: just remove the element
            alert.remove();
          }
        }
      }, 10000);
    } else {
      console.error("Main content element not found for error display");
    }
  }

  showSuccess(message) {
    // Create and show success alert
    const alertHtml = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    // Insert at top of main content
    const mainContent = document.getElementById("main-content");
    mainContent.insertAdjacentHTML("afterbegin", alertHtml);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const alert = mainContent.querySelector(".alert-success");
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 5000);
  }

  // Utility methods
  getProcessById(processId) {
    return this.processData.processes?.find((p) => p.id === processId);
  }

  getDependenciesForProcess(processId) {
    return (
      this.dependencyData.dependencies?.filter((d) => d.source === processId) ||
      []
    );
  }

  getProcessesDependingOn(processId) {
    return (
      this.dependencyData.dependencies?.filter((d) => d.target === processId) ||
      []
    );
  }

  showProcessDetails(processId) {
    const modal = document.getElementById('process-detail-modal');
    const title = document.getElementById('process-modal-title');
    const body = document.getElementById('process-modal-body');

    if (!modal || !title || !body) {
      console.error('Modal elements not found - check HTML structure');
      return;
    }

    // Ensure modal is properly initialized in the DOM
    if (!modal.classList.contains('modal')) {
      console.error('Modal element is not properly initialized');
      return;
    }

    const process = this.getProcessById(processId);
    const recommendation = this.recommendations[processId];

    if (!process) {
      return;
    }

    const recommendedLevel = recommendation?.recommendedLevel || 'basic';
    
    title.textContent = process.name;

    body.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Current Recommendation</h6>
                    <span class="level-badge level-${recommendedLevel}">${recommendedLevel}</span>
                    <p class="mt-2 text-muted">${process.description || 'No description available'}</p>
                </div>
                <div class="col-md-6">
                    <h6>Process Metrics</h6>
                    <ul class="list-unstyled">
                        <li><strong>Effort:</strong> ${recommendation?.effort || 1}/5</li>
                        <li><strong>Complexity:</strong> ${recommendation?.complexity || 1}/5</li>
                        <li><strong>Confidence:</strong> ${Math.round((recommendation?.confidence || 0.8) * 100)}%</li>
                        <li><strong>Category:</strong> ${this.processData.processCategories?.[process.category] || process.category}</li>
                    </ul>
                </div>
            </div>

            ${recommendation?.rationale ? `
                <div class="mt-3">
                    <h6>Rationale</h6>
                    <ul class="list-unstyled">
                        ${recommendation.rationale.map(reason => `<li class="text-muted">• ${reason}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${process?.tailoringLevels ? `
                <div class="mt-3">
                    <h6>Available Tailoring Levels</h6>
                    <div class="accordion" id="levels-accordion">
                        ${Object.keys(process.tailoringLevels).map((level, index) => `
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button ${level !== recommendedLevel ? 'collapsed' : ''}" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#level-${level}">
                                        <span class="level-badge level-${level} me-2">${level}</span>
                                        ${process.tailoringLevels[level].description}
                                    </button>
                                </h2>
                                <div id="level-${level}" 
                                     class="accordion-collapse collapse ${level === recommendedLevel ? 'show' : ''}"
                                     data-bs-parent="#levels-accordion">
                                    <div class="accordion-body">
                                        <p><strong>Activities:</strong></p>
                                        <ul>
                                            ${process.tailoringLevels[level].activities?.map(activity => `<li>${activity}</li>`).join('') || '<li>No activities specified</li>'}
                                        </ul>
                                        <p><strong>Key Outputs:</strong></p>
                                        <ul>
                                            ${process.tailoringLevels[level].outputs?.map(output => `<li>${output}</li>`).join('') || '<li>No outputs specified</li>'}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

    // Ensure Bootstrap is available
    if (typeof bootstrap === 'undefined') {
      console.error('Bootstrap not available');
      return;
    }

    try {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      console.log('Modal shown successfully for process:', processId);
      
      // Debug: Check modal state after showing
      setTimeout(() => {
        console.log('=== MODAL DEBUG INFO ===');
        console.log('Modal display:', modal.style.display);
        console.log('Modal classes:', modal.className);
        console.log('Modal visibility:', modal.offsetParent !== null);
        
        // Check if backdrop exists
        const backdrops = document.querySelectorAll('.modal-backdrop');
        console.log('Backdrops found:', backdrops.length);
        
        // Check z-index issues
        console.log('Modal z-index:', modal.style.zIndex);
        console.log('Modal computed z-index:', window.getComputedStyle(modal).zIndex);
        
        // Check if modal is actually visible
        const rect = modal.getBoundingClientRect();
        console.log('Modal position:', rect.top, rect.left, rect.width, rect.height);
        console.log('Modal in viewport:', rect.top >= 0 && rect.left >= 0 && 
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
          rect.right <= (window.innerWidth || document.documentElement.clientWidth));
        
        // Check if any parent elements are hidden
        let current = modal;
        const hiddenParents = [];
        while (current.parentElement) {
          current = current.parentElement;
          const style = window.getComputedStyle(current);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            hiddenParents.push(current);
          }
        }
        console.log('Hidden parents:', hiddenParents.length, hiddenParents);
        
        // Force modal to be visible if hidden - check all possible hiding conditions
        const computedStyle = window.getComputedStyle(modal);
        if (modal.offsetParent === null || 
            rect.width === 0 || 
            rect.height === 0 ||
            computedStyle.display === 'none' ||
            computedStyle.visibility === 'hidden' ||
            computedStyle.opacity === '0') {
          
          console.log('Modal appears hidden - forcing visibility');
          
          // Remove from DOM and re-append to ensure proper positioning
          const parent = modal.parentElement;
          parent.removeChild(modal);
          document.body.appendChild(modal);
          
          // Force visible styles
          modal.style.display = 'block';
          modal.style.visibility = 'visible';
          modal.style.opacity = '1';
          modal.style.zIndex = '1050';
          modal.style.position = 'fixed';
          modal.style.top = '50%';
          modal.style.left = '50%';
          modal.style.transform = 'translate(-50%, -50%)';
          
          // Ensure backdrop is properly positioned
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => {
            backdrop.style.zIndex = '1040';
          });
        }
        
        console.log('=== END DEBUG ===');
      }, 100);
      
    } catch (error) {
      console.error('Failed to show modal:', error);
      // Fallback: manually show the modal if Bootstrap fails
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      
      // Create backdrop manually
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.zIndex = '1040';
      document.body.appendChild(backdrop);
      
      // Ensure modal has proper z-index
      modal.style.zIndex = '1050';
    }
  }

  // Public API for components
  getAssessmentData() {
    return {
      responses: this.assessmentResponses,
      scores: this.assessmentScores,
      recommendations: this.recommendations,
    };
  }

  getProcessData() {
    return this.processData;
  }

  getDependencyData() {
    return this.dependencyData;
  }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing app...");

  // Failsafe: Hide loading screen after 10 seconds regardless of what happens
  const failsafeTimeout = setTimeout(() => {
    console.warn("Failsafe timeout reached - hiding loading screen");
    forceHideLoadingOverlay();
  }, 10000);

  // Wait a bit to ensure all scripts are loaded
  setTimeout(() => {
    try {
      // Check if all required components are available
      const requiredComponents = [
        "AssessmentEngine",
        "ProcessNetworkVisualizer",
        "RecommendationEngine",
        "ExportManager",
      ];

      const missingComponents = requiredComponents.filter(
        (comp) => typeof window[comp] === "undefined",
      );

      if (missingComponents.length > 0) {
        console.error("Missing components:", missingComponents);
        throw new Error(
          `Required components not loaded: ${missingComponents.join(", ")}`,
        );
      }

      console.log("All components available, initializing app...");
      window.seApp = new SEFrameworkApp();

      // Clear failsafe timeout if app initializes successfully
      clearTimeout(failsafeTimeout);

      // Additional failsafe: Force hide loading overlay after successful initialization
      setTimeout(() => {
        console.log("Additional failsafe: Forcing loading overlay to hide");
        forceHideLoadingOverlay();
      }, 1000);
    } catch (error) {
      console.error("Failed to initialize app:", error);

      // Clear failsafe timeout since we're handling the error
      clearTimeout(failsafeTimeout);

      // Show error to user
      const loadingOverlay = document.getElementById("loading-overlay");
      if (loadingOverlay) {
        loadingOverlay.innerHTML = `
                    <div class="text-center text-white">
                        <div class="spinner-border mb-3" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-danger">Failed to initialize application</p>
                        <p class="small">${error.message}</p>
                        <button class="btn btn-outline-light" onclick="window.location.reload()">Retry</button>
                    </div>
                `;
      }
    }
  }, 100); // Small delay to ensure scripts are loaded
});

// Aggressive function to hide loading overlay
function forceHideLoadingOverlay() {
  console.log("=== Force hiding loading overlay ===");

  // Try multiple selectors
  const selectors = [
    "#loading-overlay",
    ".loading-overlay",
    '[id*="loading"]',
    ".position-fixed.top-0.start-0.w-100.h-100",
  ];

  selectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        console.log(`Hiding element with selector: ${selector}`);
        element.style.display = "none";
        element.style.visibility = "hidden";
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        element.classList.add("hidden");
        element.setAttribute("hidden", "");
      });
    } catch (error) {
      console.warn(`Error hiding elements with selector ${selector}:`, error);
    }
  });

  // Also try to remove the loading overlay completely
  try {
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay && loadingOverlay.parentNode) {
      console.log("Removing loading overlay from DOM");
      loadingOverlay.parentNode.removeChild(loadingOverlay);
    }
  } catch (error) {
    console.warn("Error removing loading overlay from DOM:", error);
  }

  console.log("=== Force hide complete ===");
}

// Handle browser back/forward buttons
window.addEventListener("popstate", (event) => {
  if (window.seApp && event.state) {
    window.seApp.showView(event.state.view);
  }
});

// Export for global access
window.SEFrameworkApp = SEFrameworkApp;
