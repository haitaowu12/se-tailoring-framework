/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_assessment_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/assessment.js */ "./js/components/assessment.js");
/* harmony import */ var _components_assessment_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_assessment_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_visualization_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/visualization.js */ "./js/components/visualization.js");
/* harmony import */ var _components_visualization_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_visualization_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_recommendations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/recommendations.js */ "./js/components/recommendations.js");
/* harmony import */ var _components_recommendations_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_recommendations_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_export_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/export.js */ "./js/components/export.js");
/* harmony import */ var _components_export_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_export_js__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Main Application Controller for SE Process Tailoring Framework
 * Handles navigation, data loading, and view management
 */

// Import component modules





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
      const processesArray = await processesResponse.json();
      const processes = { processes: processesArray };

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
        processes: processesArray ? processesArray.length : 0,
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

      // Initialize admin portal - TEMPORARILY DISABLED FOR PRODUCTION
      // if (typeof AdminPortal !== "undefined") {
      //   this.adminPortal = new AdminPortal(this);
      //   this.adminPortal.init();
      //   console.log("AdminPortal created and initialized");
      // } else {
      //   console.log("AdminPortal class not loaded");
      // }

      console.log("Step 2.7: All components initialized successfully");
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

toggleAdminPanel() {
  const adminPanel = document.getElementById("admin-panel");
  if (adminPanel) {
    // Check if panel is currently visible (has transform style or is positioned at left: 0)
    const isVisible = adminPanel.style.transform === "translateX(0px)" || 
                     adminPanel.style.transform === "" ||
                     adminPanel.style.left === "0px";
    
    // Toggle panel visibility - move it off-screen to the left
    adminPanel.style.transform = isVisible ? "translateX(-100%)" : "translateX(0px)";
    
    // Update admin button active state
    const navAdmin = document.getElementById("nav-admin");
    if (navAdmin) {
      navAdmin.classList.toggle("active", !isVisible);
    }
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

      // Admin panel toggle
      const navAdmin = document.getElementById("nav-admin");
      if (navAdmin) {
        navAdmin.addEventListener("click", (e) => {
          e.preventDefault();
          this.toggleAdminPanel();
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
          case "6":
            e.preventDefault();
            this.toggleAdminPanel();
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
    console.log("renderRecommendationsView called");
    console.log("hasCompletedAssessment:", this.hasCompletedAssessment());
    console.log("recommendations object:", this.recommendations);
    console.log("recommendationEngine available:", !!this.recommendationEngine);
    
    if (this.recommendationEngine) {
      // Ensure recommendations are generated before rendering
      if (this.hasCompletedAssessment() && (!this.recommendations || Object.keys(this.recommendations).length === 0)) {
        console.log("Calling calculateScores to generate recommendations");
        this.calculateScores();
      }
      console.log("Calling recommendationEngine.render()");
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
    console.log("Calculating scores...");
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
      console.log("Assessment complete, generating recommendations...");
      console.log("Assessment scores data:", this.assessmentScores);
      
      // Ensure the scores object has the expected structure
      const recommendationScores = {
        complexity: this.assessmentScores.complexity || 0,
        safety: this.assessmentScores.safety || 0,
        scale: this.assessmentScores.scale || 0,
        maturity: this.assessmentScores.maturity || 0
      };
      
      console.log("Scores passed to recommendation engine:", recommendationScores);
      this.recommendations = this.recommendationEngine.generateRecommendations(recommendationScores);
      console.log("Generated recommendations:", this.recommendations);
      console.log("Recommendations object keys:", Object.keys(this.recommendations || {}));
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
                    <p class="mt-2 text-muted">${process.tailoringLevels?.[recommendedLevel]?.description || 'No description available'}</p>
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
                                        <p><strong>Key Artifacts/Deliverables:</strong></p>
                                        <ul>
                                            ${process.tailoringLevels[level].artifacts?.map(artifact => `<li>${artifact}</li>`).join('') || '<li>No artifacts specified</li>'}
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
      recommendations: this.recommendationEngine ? this.recommendationEngine.getRecommendations() : this.recommendations,
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


/***/ }),

/***/ "./js/components/assessment.js":
/*!*************************************!*\
  !*** ./js/components/assessment.js ***!
  \*************************************/
/***/ (() => {

/**
 * Assessment Engine Component
 * Manages the assessment interface, question rendering, and response collection
 */

class AssessmentEngine {
  constructor(questionData, app) {
    this.questionData = questionData;
    this.app = app;
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.assessmentContainer = null;
  }

  render() {
    this.assessmentContainer = document.getElementById('assessment-content');
    if (!this.assessmentContainer) return;

    this.renderAssessmentInterface();
  }

  renderAssessmentInterface() {
    if (!this.questionData.assessmentCategories || this.questionData.assessmentCategories.length === 0) {
      this.renderNoQuestions();
      return;
    }

    // Clear container once at the beginning to prevent duplicate elements
    this.assessmentContainer.innerHTML = '';
    
    this.renderProgressBar();
    this.renderCurrentQuestion();
    this.renderNavigation();
  }

  renderProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'assessment-progress mb-4';

    const totalQuestions = this.getTotalQuestions();
    const answeredQuestions = Object.keys(this.app.assessmentResponses).length;
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    progressContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Assessment Progress</h6>
                <small class="text-muted">${answeredQuestions}/${totalQuestions} questions answered</small>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar" role="progressbar" 
                     style="width: ${progressPercentage}%" 
                     aria-valuenow="${progressPercentage}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                </div>
            </div>
            <div class="mt-2">
                <small class="text-muted">
                    ${this.getCurrentCategory()?.name || 'No category'} 
                    (${this.currentQuestionIndex + 1}/${this.getCurrentCategory()?.questions?.length || 0})
                </small>
            </div>
        `;

    this.assessmentContainer.appendChild(progressContainer);
  }

  renderCurrentQuestion() {
    const question = this.getCurrentQuestion();
    if (!question) {
      this.renderAssessmentComplete();
      return;
    }

    const questionCard = document.createElement('div');
    questionCard.className = 'card question-card';
    questionCard.innerHTML = `
            <div class="card-header">
                <h5 class="card-title mb-0">
                    <span class="badge bg-primary me-2">Q${this.currentQuestionIndex + 1}</span>
                    ${question.text}
                </h5>
                <small class="text-muted">${this.getDimensionBadge(question.dimension)}</small>
            </div>
            <div class="card-body">
                ${this.renderResponseOptions(question)}
                ${question.description ? `<p class="text-muted mt-3">${question.description}</p>` : ''}
            </div>
        `;

    this.assessmentContainer.appendChild(questionCard);
  }

  renderResponseOptions(question) {
    const currentResponse = this.app.assessmentResponses[question.id];
    const currentValue = currentResponse ? currentResponse.score : null;

    return `
            <div class="response-options">
                <div class="btn-group-vertical w-100" role="group">
                    ${question.options.map(option => `
                        <button type="button" 
                                class="btn btn-outline-primary ${currentValue === option.value ? 'active' : ''}"
                                data-score="${option.value}"
                                onclick="window.seApp.assessmentEngine.selectResponse(${option.value}, '${option.label}')">
                            ${option.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
  }

  renderNavigation() {
    // Clear any existing navigation elements first to prevent duplicates
    const existingNav = this.assessmentContainer.querySelector('.assessment-navigation');
    if (existingNav) {
      existingNav.remove();
    }
    
    const navContainer = document.createElement('div');
    navContainer.className = 'assessment-navigation mt-4';
    
    // Check if current question has been answered
    const currentQuestion = this.getCurrentQuestion();
    const hasAnswered = currentQuestion && this.app.assessmentResponses[currentQuestion.id];
    const isLast = this.isLastQuestion();
    
    // Only show "Complete Assessment" when on the last question AND it has been answered
    const buttonText = (isLast && hasAnswered) ? 'Complete Assessment' : 'Next Question';
    const buttonClass = (isLast && hasAnswered) ? 'btn-success' : 'btn-primary';
    const buttonIcon = (isLast && hasAnswered) ? 'bi-check-lg' : 'bi-arrow-right';
    
    navContainer.innerHTML = `
            <div class="d-flex justify-content-between">
                <button class="btn btn-outline-secondary" 
                        onclick="window.seApp.assessmentEngine.previousQuestion()"
                        ${this.currentQuestionIndex === 0 && this.currentCategoryIndex === 0 ? 'disabled' : ''}>
                    <i class="bi bi-arrow-left"></i> Previous
                </button>
                <button class="btn ${buttonClass}" 
                        onclick="window.seApp.assessmentEngine.nextQuestion()"
                        ${!hasAnswered ? 'disabled' : ''}>
                    ${buttonText} 
                    <i class="bi ${buttonIcon}"></i>
                </button>
            </div>
        `;

    this.assessmentContainer.appendChild(navContainer);
  }

  renderNoQuestions() {
    this.assessmentContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="card">
                    <div class="card-body">
                        <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
                        <h3>No Assessment Questions</h3>
                        <p class="text-muted">
                            The assessment questions could not be loaded. Please check the data files.
                        </p>
                    </div>
                </div>
            </div>
        `;
  }

  renderAssessmentComplete() {
    // Generate recommendations automatically when assessment is complete
    this.app.calculateScores();
    
    this.assessmentContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="card">
                    <div class="card-body">
                        <i class="bi bi-check-circle display-1 text-success mb-3"></i>
                        <h3>Assessment Complete!</h3>
                        <p class="text-muted mb-4">
                            You have completed all assessment questions. Your process tailoring recommendations are ready.
                        </p>
                        <div class="mb-4">
                            <h5>Assessment Scores</h5>
                            <div class="row">
                                <div class="col-6 col-md-3">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Overall</h6>
                                            <h3 class="text-primary">${this.app.assessmentScores.overall?.toFixed(1) || '0.0'}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Complexity</h6>
                                            <h3 class="text-info">${this.app.assessmentScores.complexity?.toFixed(1) || '0.0'}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Safety</h6>
                                            <h3 class="text-warning">${this.app.assessmentScores.safety?.toFixed(1) || '0.0'}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="card bg-light">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Scale</h6>
                                            <h3 class="text-success">${this.app.assessmentScores.scale?.toFixed(1) || '0.0'}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-lg" onclick="window.seApp.showView('recommendations')">
                            <i class="bi bi-graph-up"></i>
                            View Recommendations
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  selectResponse(score, label) {
    const question = this.getCurrentQuestion();
    if (!question) return;

    this.app.updateAssessmentResponse(question.id, {
      score: score,
      label: label,
      dimension: question.dimension,
    });

    // Update UI to show selected response
    this.updateResponseButtons(score);
  }

  updateResponseButtons(selectedScore) {
    const buttons = this.assessmentContainer.querySelectorAll('.response-options button');
    buttons.forEach(button => {
      const score = parseInt(button.getAttribute('data-score'));
      if (score === selectedScore) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Re-render navigation to enable Next button after response selection
    this.renderNavigation();
  }

  nextQuestion() {
    const currentCategory = this.getCurrentCategory();
    if (!currentCategory) return;

    // Move to next question in current category
    this.currentQuestionIndex++;

    // If we've reached the end of current category, move to next category
    if (this.currentQuestionIndex >= currentCategory.questions.length) {
      this.currentCategoryIndex++;
      this.currentQuestionIndex = 0;

      // If we've reached the end of all categories, show completion
      if (this.currentCategoryIndex >= this.questionData.assessmentCategories.length) {
        this.renderAssessmentComplete();
        return;
      }
    }

    this.renderAssessmentInterface();
  }

  previousQuestion() {
    // Move to previous question
    this.currentQuestionIndex--;

    // If we've gone before the first question in current category
    if (this.currentQuestionIndex < 0) {
      this.currentCategoryIndex--;

      // If we've gone before the first category, stay at first question
      if (this.currentCategoryIndex < 0) {
        this.currentCategoryIndex = 0;
        this.currentQuestionIndex = 0;
      } else {
        // Move to last question of previous category
        const prevCategory = this.questionData.assessmentCategories[this.currentCategoryIndex];
        this.currentQuestionIndex = prevCategory.questions.length - 1;
      }
    }

    this.renderAssessmentInterface();
  }

  getCurrentCategory() {
    return this.questionData.assessmentCategories[this.currentCategoryIndex];
  }

  getCurrentQuestion() {
    const category = this.getCurrentCategory();
    return category?.questions?.[this.currentQuestionIndex];
  }

  getTotalQuestions() {
    if (!this.questionData.assessmentCategories) return 0;
    return this.questionData.assessmentCategories.reduce((total, category) => {
      return total + (category.questions ? category.questions.length : 0);
    }, 0);
  }

  isLastQuestion() {
    const lastCategoryIndex = this.questionData.assessmentCategories.length - 1;
    const lastCategory = this.questionData.assessmentCategories[lastCategoryIndex];
    return this.currentCategoryIndex === lastCategoryIndex &&
               this.currentQuestionIndex === lastCategory.questions.length - 1;
  }

  getDimensionBadge(dimension) {
    const badgeClasses = {
      complexity: 'bg-info',
      safety: 'bg-warning',
      scale: 'bg-success',
      maturity: 'bg-secondary',
    };

    const dimensionLabels = {
      complexity: 'Technical Complexity',
      safety: 'Safety Criticality',
      scale: 'Project Scale',
      maturity: 'Organizational Maturity',
    };

    return `<span class="badge ${badgeClasses[dimension] || 'bg-secondary'}">${dimensionLabels[dimension] || dimension}</span>`;
  }

  resetAssessment() {
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.renderAssessmentInterface();
  }
}

// Export for global access
window.AssessmentEngine = AssessmentEngine;


/***/ }),

/***/ "./js/components/export.js":
/*!*********************************!*\
  !*** ./js/components/export.js ***!
  \*********************************/
/***/ (() => {

/**
 * Export Manager Component
 * Handles PDF reports, JSON configuration, and Excel analytics export
 */

class ExportManager {
  constructor(app) {
    this.app = app;
  }

  render() {
    const container = document.getElementById('export-content');
    if (!container) return;

    const assessmentData = this.app.getAssessmentData();
    const hasData = assessmentData.recommendations && Object.keys(assessmentData.recommendations).length > 0;

    if (!hasData) {
      this.renderNoData(container);
      return;
    }

    this.renderExportOptions(container, assessmentData);
  }

  renderNoData(container) {
    container.innerHTML = `
            <div class="text-center py-5">
                <div class="card">
                    <div class="card-body">
                        <i class="bi bi-exclamation-circle display-1 text-warning mb-3"></i>
                        <h3>No Data to Export</h3>
                        <p class="text-muted mb-4">
                            Complete the assessment first to generate exportable recommendations and reports.
                        </p>
                        <button class="btn btn-primary" onclick="window.seApp.showView('assessment')">
                            <i class="bi bi-clipboard-check"></i>
                            Start Assessment
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  renderExportOptions(container, assessmentData) {
    const stats = this.calculateExportStats(assessmentData);

    container.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-gradient-primary text-white">
                    <h4 class="card-title mb-0">
                        <i class="bi bi-download"></i>
                        Export Reports & Data
                    </h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Ready to Export:</strong> Your assessment contains ${stats.totalProcesses} process recommendations 
                        with ${stats.totalQuestions} assessment responses across ${stats.categories} categories.
                    </div>
                    
                    <div class="row mb-4">
                        <div class="col-md-3 text-center">
                            <div class="stat-card">
                                <span class="stat-number text-primary">${stats.totalProcesses}</span>
                                <span class="stat-label">Process Recommendations</span>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="stat-card">
                                <span class="stat-number text-success">${stats.averageConfidence}%</span>
                                <span class="stat-label">Average Confidence</span>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="stat-card">
                                <span class="stat-number text-warning">${stats.totalEffort}</span>
                                <span class="stat-label">Total Effort Score</span>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="stat-card">
                                <span class="stat-number text-info">${stats.dependencies}</span>
                                <span class="stat-label">Dependencies</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-4 mb-4">
                    <div class="export-option" data-export-type="pdf">
                        <div class="export-icon">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                        </div>
                        <h5 class="export-title">Professional PDF Report</h5>
                        <p class="export-description">
                            Comprehensive report with executive summary, detailed recommendations, 
                            process network visualization, and implementation roadmap.
                        </p>
                        <button class="btn btn-primary" id="export-pdf-btn">
                            <i class="bi bi-download"></i>
                            Download PDF
                        </button>
                    </div>
                </div>
                
                <div class="col-lg-4 mb-4">
                    <div class="export-option" data-export-type="json">
                        <div class="export-icon">
                            <i class="bi bi-file-earmark-code-fill"></i>
                        </div>
                        <h5 class="export-title">JSON Configuration</h5>
                        <p class="export-description">
                            Machine-readable format containing assessment data, scores, and recommendations 
                            for integration with other tools and systems.
                        </p>
                        <button class="btn btn-outline-primary" id="export-json-btn">
                            <i class="bi bi-download"></i>
                            Download JSON
                        </button>
                    </div>
                </div>
                
                <div class="col-lg-4 mb-4">
                    <div class="export-option" data-export-type="excel">
                        <div class="export-icon">
                            <i class="bi bi-file-earmark-spreadsheet-fill"></i>
                        </div>
                        <h5 class="export-title">Excel Analytics</h5>
                        <p class="export-description">
                            Spreadsheet format with assessment responses, process recommendations, 
                            effort calculations, and pivot tables for further analysis.
                        </p>
                        <button class="btn btn-outline-success" id="export-excel-btn">
                            <i class="bi bi-download"></i>
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="card-title mb-0">
                        <i class="bi bi-gear"></i>
                        Export Options
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="include-assessment-details" checked>
                                <label class="form-check-label" for="include-assessment-details">
                                    Include detailed assessment responses
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="include-rationale" checked>
                                <label class="form-check-label" for="include-rationale">
                                    Include recommendation rationale
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="include-dependencies" checked>
                                <label class="form-check-label" for="include-dependencies">
                                    Include process dependencies
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="include-visualization" checked>
                                <label class="form-check-label" for="include-visualization">
                                    Include process network visualization
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="include-metadata" checked>
                                <label class="form-check-label" for="include-metadata">
                                    Include metadata and timestamps
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="include-implementation-guide">
                                <label class="form-check-label" for="include-implementation-guide">
                                    Include implementation guidance
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 text-center">
                <small class="text-muted">
                    <i class="bi bi-shield-check"></i>
                    All exports are generated locally in your browser. No data is sent to external servers.
                </small>
            </div>
        `;

    this.attachExportEventListeners();
  }

  calculateExportStats(assessmentData) {
    const recommendations = assessmentData.recommendations || {};
    const responses = assessmentData.responses || {};

    const totalProcesses = Object.keys(recommendations).length;
    const totalQuestions = Object.keys(responses).length;
    const categories = new Set(Object.values(responses).map(r => r.dimension)).size;

    const confidenceValues = Object.values(recommendations).map(r => r.confidence || 0);
    const averageConfidence = confidenceValues.length > 0
      ? Math.round(confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length * 100)
      : 0;

    const totalEffort = Object.values(recommendations).reduce((sum, r) => sum + (r.effort || 0), 0);

    const dependencies = Object.values(recommendations).reduce((sum, r) => sum + (r.dependencies?.length || 0), 0);

    return {
      totalProcesses,
      totalQuestions,
      categories,
      averageConfidence,
      totalEffort,
      dependencies,
    };
  }

  attachExportEventListeners() {
    document.getElementById('export-pdf-btn')?.addEventListener('click', () => {
      this.exportPDF();
    });

    document.getElementById('export-json-btn')?.addEventListener('click', () => {
      this.exportJSON();
    });

    document.getElementById('export-excel-btn')?.addEventListener('click', () => {
      this.exportExcel();
    });

    // Export option hover effects
    document.querySelectorAll('.export-option').forEach(option => {
      option.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const button = option.querySelector('button');
          if (button) button.click();
        }
      });
    });
  }

  getExportOptions() {
    return {
      includeAssessmentDetails: document.getElementById('include-assessment-details')?.checked ?? true,
      includeRationale: document.getElementById('include-rationale')?.checked ?? true,
      includeDependencies: document.getElementById('include-dependencies')?.checked ?? true,
      includeVisualization: document.getElementById('include-visualization')?.checked ?? true,
      includeMetadata: document.getElementById('include-metadata')?.checked ?? true,
      includeImplementationGuide: document.getElementById('include-implementation-guide')?.checked ?? false,
    };
  }

  async exportPDF() {
    try {
      this.showExportProgress('Generating PDF report...');

      const assessmentData = this.app.getAssessmentData();
      const options = this.getExportOptions();

      // Initialize jsPDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const marginBottom = 20;

      // Helper function to add new page if needed
      const checkNewPage = (neededSpace = 20) => {
        if (yPosition + neededSpace > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Title Page
      doc.setFontSize(24);
      doc.setTextColor(13, 110, 253);
      doc.text('Systems Engineering Process', 20, yPosition);
      yPosition += 10;
      doc.text('Tailoring Report', 20, yPosition);
      yPosition += 20;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 10;
      doc.text('Based on ISO/IEC/IEEE 15288:2023', 20, yPosition);
      yPosition += 30;

      // Executive Summary
      checkNewPage(40);
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const scores = assessmentData.scores;
      const summary = [
        `Overall Assessment Score: ${scores.overall?.toFixed(1) || 'N/A'}/5.0`,
        `Technical Complexity: ${scores.complexity?.toFixed(1) || 'N/A'}/5.0`,
        `Safety Criticality: ${scores.safety?.toFixed(1) || 'N/A'}/5.0`,
        `Project Scale: ${scores.scale?.toFixed(1) || 'N/A'}/5.0`,
        `Organizational Maturity: ${scores.maturity?.toFixed(1) || 'N/A'}/5.0`,
      ];

      summary.forEach(line => {
        checkNewPage();
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Process Recommendations
      const recommendations = assessmentData.recommendations || {};
      const levelCounts = this.getLevelCounts(recommendations);

      const recSummary = [
        `Total Processes Analyzed: ${Object.keys(recommendations).length}`,
        `Basic Level Processes: ${levelCounts.basic}`,
        `Standard Level Processes: ${levelCounts.standard}`,
        `Comprehensive Level Processes: ${levelCounts.comprehensive}`,
      ];

      recSummary.forEach(line => {
        checkNewPage();
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });

      // Process Recommendations Section
      checkNewPage(30);
      yPosition += 10;
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Process Recommendations', 20, yPosition);
      yPosition += 15;

      // Group by category
      const grouped = this.groupRecommendationsByCategory(recommendations);

      Object.keys(grouped).forEach(category => {
        checkNewPage(20);
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        const categoryName = this.app.processData.processCategories?.[category] || category;
        doc.text(categoryName, 20, yPosition);
        yPosition += 10;

        grouped[category].forEach(process => {
          checkNewPage(15);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);

          const processLine = `${process.processName}: ${process.recommendedLevel.toUpperCase()}`;
          doc.text(processLine, 25, yPosition);
          yPosition += 5;

          if (options.includeRationale && process.rationale) {
            process.rationale.slice(0, 2).forEach(reason => {
              checkNewPage();
              const reasonText = `  • ${reason}`;
              const splitText = doc.splitTextToSize(reasonText, 160);
              splitText.forEach(line => {
                doc.text(line, 30, yPosition);
                yPosition += 4;
              });
            });
          }
          yPosition += 3;
        });
        yPosition += 5;
      });

      // Implementation Guidance
      if (options.includeImplementationGuide) {
        checkNewPage(30);
        doc.setFontSize(16);
        doc.setTextColor(13, 110, 253);
        doc.text('Implementation Guidance', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const guidance = [
          '1. Begin with high-priority Technical Management processes',
          '2. Implement processes in dependency order',
          '3. Start with Basic level and mature gradually',
          '4. Monitor effectiveness and adjust as needed',
          '5. Regular reviews ensure continued alignment',
        ];

        guidance.forEach(item => {
          checkNewPage();
          doc.text(item, 20, yPosition);
          yPosition += 6;
        });
      }

      // Assessment Details
      if (options.includeAssessmentDetails) {
        checkNewPage(30);
        doc.setFontSize(16);
        doc.setTextColor(13, 110, 253);
        doc.text('Assessment Details', 20, yPosition);
        yPosition += 15;

        const responses = assessmentData.responses || {};
        const categories = this.app.questionData.assessmentCategories || [];

        categories.forEach(category => {
          checkNewPage(15);
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(category.name, 20, yPosition);
          yPosition += 8;

          category.questions.forEach(question => {
            const response = responses[question.id];
            if (response) {
              checkNewPage(12);
              doc.setFontSize(9);
              doc.text(`Q: ${question.text}`, 25, yPosition);
              yPosition += 5;
              doc.text(`A: ${response.label} (Score: ${response.score})`, 25, yPosition);
              yPosition += 7;
            }
          });
          yPosition += 5;
        });
      }

      // Metadata
      if (options.includeMetadata) {
        checkNewPage(20);
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Report Metadata', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(8);
        const metadata = [
          `Generated: ${new Date().toISOString()}`,
          'Framework Version: 1.0.0',
          'Standard: ISO/IEC/IEEE 15288:2023',
          `Processes Analyzed: ${Object.keys(recommendations).length}`,
          `Assessment Questions: ${Object.keys(assessmentData.responses || {}).length}`,
        ];

        metadata.forEach(line => {
          doc.text(line, 20, yPosition);
          yPosition += 4;
        });
      }

      // Save the PDF
      const fileName = `SE_Process_Tailoring_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      this.hideExportProgress();
      this.app.showSuccess('PDF report downloaded successfully!');

    } catch (error) {
      // PDF export error
      this.hideExportProgress();
      this.app.showError('Failed to generate PDF report. Please try again.');
    }
  }

  exportJSON() {
    try {
      const assessmentData = this.app.getAssessmentData();
      const options = this.getExportOptions();

      const exportData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          standard: 'ISO/IEC/IEEE 15288:2023',
          frameworkVersion: '1.0.0',
        },
        assessmentScores: assessmentData.scores,
        recommendations: assessmentData.recommendations,
      };

      if (options.includeAssessmentDetails) {
        exportData.assessmentResponses = assessmentData.responses;
      }

      if (options.includeDependencies) {
        exportData.dependencies = this.app.getDependencyData();
      }

      if (options.includeMetadata) {
        exportData.processData = this.app.getProcessData();
      }

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `SE_Process_Tailoring_Config_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.app.showSuccess('JSON configuration downloaded successfully!');

    } catch (error) {
      // JSON export error
      this.app.showError('Failed to export JSON configuration. Please try again.');
    }
  }

  exportExcel() {
    try {
      const assessmentData = this.app.getAssessmentData();
      const options = this.getExportOptions();

      // Create CSV content (simplified Excel export)
      let csvContent = 'Process Name,Category,Recommended Level,Effort,Complexity,Confidence,Rationale\n';

      const recommendations = assessmentData.recommendations || {};
      Object.values(recommendations).forEach(rec => {
        const rationale = options.includeRationale
          ? rec.rationale?.join('; ') || ''
          : '';

        csvContent += `"${rec.processName}","${rec.category}","${rec.recommendedLevel}",${rec.effort},${rec.complexity},${Math.round(rec.confidence * 100)},"${rationale}"\n`;
      });

      // Add assessment data if requested
      if (options.includeAssessmentDetails) {
        csvContent += '\n\nAssessment Responses\n';
        csvContent += 'Question,Response,Score,Dimension\n';

        Object.values(assessmentData.responses || {}).forEach(response => {
          csvContent += `"${response.questionId}","${response.label}",${response.score},"${response.dimension}"\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `SE_Process_Tailoring_Analysis_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.app.showSuccess('Excel/CSV file downloaded successfully!');

    } catch (error) {
      // Excel export error
      this.app.showError('Failed to export Excel file. Please try again.');
    }
  }

  showExportProgress(message) {
    // Show loading state
    const loadingHtml = `
            <div class="text-center py-4" id="export-progress">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">${message}</p>
            </div>
        `;

    document.body.insertAdjacentHTML('beforeend', `
            <div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style="z-index: 9999;" id="export-overlay">
                ${loadingHtml}
            </div>
        `);
  }

  hideExportProgress() {
    const overlay = document.getElementById('export-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  // Helper methods
  getLevelCounts(recommendations) {
    const counts = { basic: 0, standard: 0, comprehensive: 0 };
    Object.values(recommendations).forEach(rec => {
      counts[rec.recommendedLevel] = (counts[rec.recommendedLevel] || 0) + 1;
    });
    return counts;
  }

  groupRecommendationsByCategory(recommendations) {
    const grouped = {};
    Object.values(recommendations).forEach(rec => {
      const category = rec.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(rec);
    });

    // Sort within categories
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.processName.localeCompare(b.processName));
    });

    return grouped;
  }
}

// Export for global access
window.ExportManager = ExportManager;


/***/ }),

/***/ "./js/components/recommendations.js":
/*!******************************************!*\
  !*** ./js/components/recommendations.js ***!
  \******************************************/
/***/ (() => {

/**
 * Recommendation Engine Component
 * Generates process tailoring recommendations based on assessment scores
 */

class RecommendationEngine {
  constructor(processData, dependencyData, app) {
    this.processData = processData;
    this.dependencyData = dependencyData;
    this.app = app;
    this.recommendations = {};
    this.calculationSettings = {
      basicThreshold: 2.0,
      standardThreshold: 3.5,
      maxDependencyIterations: 10
    };
  }

  generateRecommendations(assessmentScores) {
    console.log("=== Recommendation Engine: generateRecommendations called ===");
    console.log("assessmentScores:", assessmentScores);
    console.log("processData available:", !!this.processData);
    console.log("processData.processes:", this.processData.processes ? this.processData.processes.length : 0);
    
    const processes = this.processData.processes || [];
    const recommendations = {};

    console.log("Processing", processes.length, "processes");

    // Generate base recommendations for each process
    processes.forEach(process => {
      console.log("Processing process:", process.id, process.name);
      recommendations[process.id] = this.calculateProcessLevel(process, assessmentScores);
      console.log("Generated recommendation for", process.id, ":", recommendations[process.id]);
    });

    console.log("Base recommendations generated:", Object.keys(recommendations));

    // Apply dependency constraints
    this.applyDependencyConstraints(recommendations);

    // Apply safety and other constraints
    this.applyProcessConstraints(recommendations, assessmentScores);

    // Calculate confidence scores
    this.calculateConfidenceScores(recommendations, assessmentScores);

    console.log("Final recommendations:", recommendations);
    console.log("Final recommendations keys:", Object.keys(recommendations));

    this.recommendations = recommendations;
    return recommendations;
  }

  calculateProcessLevel(process, scores) {
    console.log("calculateProcessLevel for process:", process.id, "with scores:", scores);
    
    // Base level calculation using weighted assessment scores
    const baseScore = this.calculateBaseScore(process, scores);
    console.log("Base score for", process.id, ":", baseScore);

    // Get thresholds from calculation settings or use defaults
    const basicThreshold = this.calculationSettings?.basicThreshold || 2.1;
    const standardThreshold = this.calculationSettings?.standardThreshold || 3.6;
    
    // Determine level based on score thresholds
    let level = 'basic';
    if (baseScore >= standardThreshold) {
      level = 'comprehensive';
    } else if (baseScore >= basicThreshold) {
      level = 'standard';
    }
    console.log("Recommended level for", process.id, ":", level);

    const result = {
      processId: process.id,
      processName: process.name,
      category: process.category,
      recommendedLevel: level,
      baseScore: baseScore,
      rationale: this.generateRationale(process, scores, level),
      effort: process.tailoringLevels[level]?.effort || 1,
      complexity: process.tailoringLevels[level]?.complexity || 1,
      activities: process.tailoringLevels[level]?.activities || [],
      outputs: process.tailoringLevels[level]?.outputs || [],
      dependencies: [],
      constraints: [],
      confidence: 0.8, // Will be calculated later
    };
    
    console.log("Final recommendation object for", process.id, ":", result);
    return result;
  }

  calculateBaseScore(process, scores) {
    // Process-specific scoring weights based on category
    const weights = this.getProcessWeights(process);

    // Calculate weighted score
    let weightedScore = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(dimension => {
      if (scores[dimension] !== undefined) {
        weightedScore += scores[dimension] * weights[dimension];
        totalWeight += weights[dimension];
      }
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  getProcessWeights(process) {
    // Default weights - can be customized per process
    const defaultWeights = {
      complexity: 0.3,
      safety: 0.25,
      scale: 0.25,
      maturity: 0.2,
    };

    // Process-specific weight adjustments
    const adjustments = {
      // Safety-critical processes weight safety more heavily
      'risk_management': { safety: 0.4, complexity: 0.25, scale: 0.2, maturity: 0.15 },
      'quality_assurance': { safety: 0.35, complexity: 0.25, scale: 0.2, maturity: 0.2 },
      'verification': { safety: 0.35, complexity: 0.3, scale: 0.2, maturity: 0.15 },
      'validation': { safety: 0.35, complexity: 0.25, scale: 0.2, maturity: 0.2 },

      // Technical processes weight complexity more heavily
      'system_analysis': { complexity: 0.4, safety: 0.2, scale: 0.25, maturity: 0.15 },
      'architecture_definition': { complexity: 0.4, safety: 0.2, scale: 0.25, maturity: 0.15 },
      'design_definition': { complexity: 0.4, safety: 0.2, scale: 0.25, maturity: 0.15 },

      // Management processes weight scale and maturity more heavily
      'project_planning': { scale: 0.35, maturity: 0.25, complexity: 0.2, safety: 0.2 },
      'project_assessment_control': { scale: 0.35, maturity: 0.25, complexity: 0.2, safety: 0.2 },
      'configuration_management': { scale: 0.3, maturity: 0.3, complexity: 0.2, safety: 0.2 },
    };

    return adjustments[process.id] || defaultWeights;
  }

  applyDependencyConstraints(recommendations) {
    const dependencies = this.dependencyData.dependencies || [];
    let changed = true;
    let iterations = 0;
    const maxIterations = this.calculationSettings?.maxDependencyIterations || 10; // Prevent infinite loops

    // Iteratively apply constraints until no more changes
    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      dependencies.forEach(dep => {
        const sourceRec = recommendations[dep.source];
        const targetRec = recommendations[dep.target];

        if (sourceRec && targetRec) {
          const sourceLevel = this.getLevelValue(sourceRec.recommendedLevel);
          const requiredTargetLevel = this.getLevelValue(dep.targetLevel);
          const currentTargetLevel = this.getLevelValue(targetRec.recommendedLevel);

          // If source is at the specified level and target is below required minimum
          if (sourceLevel >= this.getLevelValue(dep.sourceLevel) &&
                        currentTargetLevel < requiredTargetLevel) {

            const newLevel = dep.targetLevel;
            targetRec.recommendedLevel = newLevel;
            targetRec.effort = this.processData.processes.find(p => p.id === dep.target)?.tailoringLevels[newLevel]?.effort || targetRec.effort;
            targetRec.complexity = this.processData.processes.find(p => p.id === dep.target)?.tailoringLevels[newLevel]?.complexity || targetRec.complexity;

            // Add dependency constraint to rationale
            targetRec.constraints.push({
              type: 'dependency',
              source: dep.source,
              sourceLevel: dep.sourceLevel,
              reason: `Required by ${sourceRec.processName} at ${dep.sourceLevel} level`,
            });

            // Track the dependency
            sourceRec.dependencies.push({
              target: dep.target,
              targetName: targetRec.processName,
              requiredLevel: dep.targetLevel,
              type: dep.type || 'horizontal',
            });

            changed = true;
          }
        }
      });
    }

    if (iterations >= maxIterations) {
      // Dependency constraint resolution reached maximum iterations
    }
  }

  applyProcessConstraints(recommendations, scores) {
    const processes = this.processData.processes || [];

    processes.forEach(process => {
      const rec = recommendations[process.id];
      if (!rec || !process.constraints) return;

      process.constraints.forEach(constraint => {
        if (this.evaluateConstraintCondition(constraint.condition, scores)) {
          const requiredLevel = constraint.requiredLevel;
          const currentLevel = this.getLevelValue(rec.recommendedLevel);
          const requiredLevelValue = this.getLevelValue(requiredLevel);

          if (currentLevel < requiredLevelValue) {
            rec.recommendedLevel = requiredLevel;
            rec.effort = process.tailoringLevels[requiredLevel]?.effort || rec.effort;
            rec.complexity = process.tailoringLevels[requiredLevel]?.complexity || rec.complexity;

            rec.constraints.push({
              type: 'process',
              condition: constraint.condition,
              reason: constraint.rationale || 'Process constraint applied',
            });
          }
        }
      });
    });
  }

  evaluateConstraintCondition(condition, scores) {
    try {
      // Simple condition evaluation - extend as needed
      // Example: "safety_criticality > 3"
      const match = condition.match(/(\w+)\s*([><=]+)\s*(\d+\.?\d*)/);
      if (match) {
        const [, dimension, operator, threshold] = match;
        const score = scores[dimension];
        const thresholdValue = parseFloat(threshold);

        switch (operator) {
          case '>': return score > thresholdValue;
          case '>=': return score >= thresholdValue;
          case '<': return score < thresholdValue;
          case '<=': return score <= thresholdValue;
          case '=': case '==': return Math.abs(score - thresholdValue) < 0.1;
          default: return false;
        }
      }
    } catch (error) {
      // Failed to evaluate constraint condition
    }
    return false;
  }

  calculateConfidenceScores(recommendations, scores) {
    Object.values(recommendations).forEach(rec => {
      let confidence = 0.8; // Base confidence

      // Reduce confidence if score is near threshold boundaries
      const baseScore = rec.baseScore;
      if ((baseScore >= 2.0 && baseScore <= 2.2) || (baseScore >= 3.5 && baseScore <= 3.7)) {
        confidence -= 0.2;
      }

      // Reduce confidence if conflicting constraints
      if (rec.constraints.length > 2) {
        confidence -= 0.1;
      }

      // Increase confidence if multiple factors align
      const extremeScores = Object.values(scores).filter(s => s <= 1.5 || s >= 4.5).length;
      if (extremeScores >= 2) {
        confidence += 0.1;
      }

      rec.confidence = Math.max(0.4, Math.min(1.0, confidence));
    });
  }

  getLevelValue(level) {
    const values = { 'basic': 1, 'standard': 2, 'comprehensive': 3 };
    return values[level] || 1;
  }

  generateRationale(process, scores, level) {
    const rationale = [];
    const weights = this.getProcessWeights(process);

    // Primary drivers
    const primaryFactors = Object.keys(weights)
      .map(dim => ({ dimension: dim, weight: weights[dim], score: scores[dim] }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 2);

    primaryFactors.forEach(factor => {
      const impact = this.getScoreImpact(factor.score);
      rationale.push(`${this.getDimensionName(factor.dimension)} (${factor.score.toFixed(1)}/5.0) ${impact.description}`);
    });

    // Level justification
    switch (level) {
      case 'basic':
        rationale.push('Basic level recommended for low complexity and risk profile');
        break;
      case 'standard':
        rationale.push('Standard level provides balanced formality for moderate complexity');
        break;
      case 'comprehensive':
        rationale.push('Comprehensive level required for high complexity and criticality');
        break;
    }

    return rationale;
  }

  getDimensionName(dimension) {
    const names = {
      complexity: 'Technical Complexity',
      safety: 'Safety Criticality',
      scale: 'Project Scale',
      maturity: 'Organizational Maturity',
    };
    return names[dimension] || dimension;
  }

  getScoreImpact(score) {
    if (score <= 2.0) return { level: 'low', description: 'suggests minimal formality' };
    if (score <= 3.5) return { level: 'medium', description: 'indicates moderate formality needed' };
    return { level: 'high', description: 'requires high formality and rigor' };
  }

  render() {
    const container = document.getElementById('recommendations-content');
    if (!container) return;

    const assessmentData = this.app.getAssessmentData();
    console.log("Recommendations render - assessmentData:", assessmentData);
    console.log("Recommendations render - hasCompletedAssessment:", this.app.hasCompletedAssessment());

    // Check if assessment is completed before showing recommendations
    if (!this.app.hasCompletedAssessment()) {
      console.log("Assessment not completed, showing no recommendations");
      this.renderNoRecommendations(container);
      return;
    }

    if (!assessmentData.recommendations || Object.keys(assessmentData.recommendations).length === 0) {
      console.log("No recommendations data available, showing no recommendations");
      this.renderNoRecommendations(container);
      return;
    }

    console.log("Rendering recommendations with data:", assessmentData.recommendations);
    this.renderRecommendations(container, assessmentData);
  }

  renderNoRecommendations(container) {
    container.innerHTML = `
            <div class="text-center py-5">
                <div class="card">
                    <div class="card-body">
                        <i class="bi bi-exclamation-circle display-1 text-warning mb-3"></i>
                        <h3>No Recommendations Available</h3>
                        <p class="text-muted mb-4">
                            Complete the assessment first to generate personalized process tailoring recommendations.
                        </p>
                        <button class="btn btn-primary" onclick="window.seApp.showView('assessment')">
                            <i class="bi bi-clipboard-check"></i>
                            Start Assessment
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  renderRecommendations(container, assessmentData) {
    const recommendations = assessmentData.recommendations;

    // Group recommendations by category
    const groupedRecs = this.groupRecommendationsByCategory(recommendations);

    // Calculate summary statistics
    const stats = this.calculateSummaryStats(recommendations);

    const html = `
            <div class="mb-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-gradient-primary text-white">
                        <h4 class="card-title mb-0">
                            <i class="bi bi-lightbulb-fill"></i>
                            Process Tailoring Recommendations
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <div class="stat-card border-start-primary">
                                    <span class="stat-number text-success">${stats.basic}</span>
                                    <span class="stat-label">Basic Level</span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card border-start-warning">
                                    <span class="stat-number text-warning">${stats.standard}</span>
                                    <span class="stat-label">Standard Level</span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card border-start-danger">
                                    <span class="stat-number text-danger">${stats.comprehensive}</span>
                                    <span class="stat-label">Comprehensive Level</span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <span class="stat-number">${stats.totalEffort}</span>
                                    <span class="stat-label">Total Effort Score</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Implementation Guidance:</strong> Start with high-priority processes and gradually implement others. 
                            Pay special attention to dependency relationships shown in the visualization.
                        </div>
                    </div>
                </div>
            </div>

            ${Object.keys(groupedRecs).map(category => this.renderCategorySection(category, groupedRecs[category])).join('')}
        `;

    container.innerHTML = html;
    this.attachRecommendationEventListeners();
  }

  groupRecommendationsByCategory(recommendations) {
    const grouped = {};

    Object.values(recommendations).forEach(rec => {
      const category = rec.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(rec);
    });

    // Sort processes within each category by name
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.processName.localeCompare(b.processName));
    });

    return grouped;
  }

  renderCategorySection(category, processes) {
    const categoryName = this.processData.processCategories?.[category] || category;

    return `
            <div class="mb-4">
                <h5 class="mb-3">
                    <i class="bi bi-${this.getCategoryIcon(category)}"></i>
                    ${categoryName}
                </h5>
                <div class="row">
                    ${processes.map(process => this.renderProcessCard(process)).join('')}
                </div>
            </div>
        `;
  }

  renderProcessCard(process) {
    const levelClass = process.recommendedLevel;
    const confidencePercent = Math.round(process.confidence * 100);

    return `
            <div class="col-lg-6 mb-3">
                <div class="process-card card ${levelClass}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="process-title mb-1">${process.processName}</h6>
                            <span class="level-badge level-${levelClass}">${process.recommendedLevel}</span>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted">
                                Effort: <strong>${process.effort}</strong> | 
                                Complexity: <strong>${process.complexity}</strong> | 
                                Confidence: <strong>${confidencePercent}%</strong>
                            </small>
                        </div>

                        <div class="mb-3">
                            <strong>Rationale:</strong>
                            <ul class="list-unstyled mt-1 mb-0">
                                ${process.rationale.map(reason => `<li class="text-small text-muted">• ${reason}</li>`).join('')}
                            </ul>
                        </div>

                        ${process.constraints.length > 0 ? `
                            <div class="mb-3">
                                <strong>Constraints Applied:</strong>
                                <ul class="list-unstyled mt-1 mb-0">
                                    ${process.constraints.map(constraint => `
                                        <li class="text-small text-warning">• ${constraint.reason}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        ${process.dependencies.length > 0 ? `
                            <div class="mb-3">
                                <strong>Dependencies:</strong>
                                <ul class="dependency-list">
                                    ${process.dependencies.map(dep => `
                                        <li class="dependency-item ${dep.type === 'vertical' ? 'critical' : 'important'}">
                                            <small>
                                                <strong>${dep.targetName}</strong> requires <em>${dep.requiredLevel}</em> level
                                                <span class="badge badge-sm bg-secondary ms-1">${dep.type}</span>
                                            </small>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        <div class="text-end">
                            <button class="btn btn-outline-primary btn-sm" onclick="window.seApp.showProcessDetails('${process.processId}')">
                                <i class="bi bi-info-circle"></i>
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  calculateSummaryStats(recommendations) {
    const stats = {
      basic: 0,
      standard: 0,
      comprehensive: 0,
      totalEffort: 0,
      averageConfidence: 0,
    };

    const recs = Object.values(recommendations);

    recs.forEach(rec => {
      stats[rec.recommendedLevel]++;
      stats.totalEffort += rec.effort || 0;
    });

    stats.averageConfidence = recs.length > 0
      ? recs.reduce((sum, rec) => sum + rec.confidence, 0) / recs.length
      : 0;

    return stats;
  }

  getCategoryIcon(category) {
    const icons = {
      'technical_management': 'gear',
      'technical': 'cpu',
      'other': 'circle',
    };
    return icons[category] || 'circle';
  }

  attachRecommendationEventListeners() {
    // Add any interactive event listeners here
    // Currently handled through onclick attributes in the HTML
  }

  // Public methods for app integration
  getRecommendations() {
    return this.recommendations;
  }

  getProcessRecommendation(processId) {
    return this.recommendations[processId];
  }
}

// Export for global access
window.RecommendationEngine = RecommendationEngine;


/***/ }),

/***/ "./js/components/visualization.js":
/*!****************************************!*\
  !*** ./js/components/visualization.js ***!
  \****************************************/
/***/ (() => {

/**
 * Process Network Visualizer Component
 * Creates interactive D3.js network diagrams showing process relationships
 */

class ProcessNetworkVisualizer {
  constructor(processData, dependencyData, app) {
    this.processData = processData;
    this.dependencyData = dependencyData;
    this.app = app;
    this.svg = null;
    this.simulation = null;
    this.nodes = [];
    this.links = [];
    this.width = 800;
    this.height = 600;
    this.zoom = null;
    this.currentFilters = {
      categories: new Set(['technical_management', 'technical']),
      levels: new Set(['basic', 'standard', 'comprehensive']),
      showDependencies: true,
      showMetrics: true,
      showRecommendations: true,
      searchTerm: '',
      layoutSettings: {
        chargeStrength: -200,
        linkStrength: 0.5,
      },
    };
  }

  render() {
    this.setupContainer();
    this.renderControls();
    this.prepareData();
    this.createVisualization();
    this.setupEventListeners();
  }

  setupContainer() {
    const container = document.getElementById('network-visualization');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    this.width = Math.max(800, rect.width - 20);
    this.height = Math.max(600, rect.height - 20);
  }

  renderControls() {
    const controlsContainer = document.getElementById('visualization-controls');
    if (!controlsContainer) return;

    const html = `
            <div class="control-group">
                <label class="control-label">Search Processes</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control" id="process-search" 
                           placeholder="Type to search processes...">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">Process Categories</label>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-technical-mgmt" checked>
                    <label class="form-check-label" for="filter-technical-mgmt">
                        Technical Management
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-technical" checked>
                    <label class="form-check-label" for="filter-technical">
                        Technical Processes
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-agreement" checked>
                    <label class="form-check-label" for="filter-agreement">
                        Agreement Processes
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-project" checked>
                    <label class="form-check-label" for="filter-project">
                        Project Processes
                    </label>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">Tailoring Levels</label>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-basic" checked>
                    <label class="form-check-label" for="filter-basic">
                        <span class="level-badge level-basic">Basic</span>
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-standard" checked>
                    <label class="form-check-label" for="filter-standard">
                        <span class="level-badge level-standard">Standard</span>
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="filter-comprehensive" checked>
                    <label class="form-check-label" for="filter-comprehensive">
                        <span class="level-badge level-comprehensive">Comprehensive</span>
                    </label>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">Visualization Mode</label>
                <select class="form-select form-select-sm" id="view-mode-select">
                    <option value="network">Network Overview</option>
                    <option value="flow">Input/Output Flow</option>
                    <option value="focused">Focused Process View</option>
                </select>
            </div>

            <div class="control-group">
                <label class="control-label">Display Options</label>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="show-dependencies" checked>
                    <label class="form-check-label" for="show-dependencies">
                        Show Dependencies
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="show-labels" checked>
                    <label class="form-check-label" for="show-labels">
                        Show Labels
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="show-metrics" checked>
                    <label class="form-check-label" for="show-metrics">
                        Show Metrics
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="show-inputs-outputs" checked>
                    <label class="form-check-label" for="show-inputs-outputs">
                        Show Inputs/Outputs
                    </label>
                </div>
                <div class="form-check form-check-sm">
                    <input class="form-check-input" type="checkbox" id="show-recommendations" checked>
                    <label class="form-check-label" for="show-recommendations">
                        Show Recommendations
                    </label>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">Layout</label>
                <select class="form-select form-select-sm" id="layout-select">
                    <option value="force">Force-Directed</option>
                    <option value="circular">Circular</option>
                    <option value="hierarchical">Hierarchical</option>
                    <option value="flow">Flow Layout</option>
                </select>
            </div>

            <div class="control-group">
                <label class="control-label">Focus Process</label>
                <select class="form-select form-select-sm" id="focus-process-select">
                    <option value="">All Processes</option>
                    ${this.processData.processes ? this.processData.processes.map(p => 
                      `<option value="${p.id}">${p.name}</option>`
                    ).join('') : ''}
                </select>
            </div>

            <div class="control-group">
                <label class="control-label">Force Layout Settings</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">Charge</span>
                    <input type="range" class="form-range" id="charge-strength" min="-1000" max="-50" value="-200">
                    <span class="input-group-text" id="charge-value">-200</span>
                </div>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">Link</span>
                    <input type="range" class="form-range" id="link-strength" min="0" max="2" step="0.1" value="0.5">
                    <span class="input-group-text" id="link-value">0.5</span>
                </div>
            </div>

            <div class="control-group">
                <button class="btn btn-outline-primary btn-sm w-100" id="reset-filters-btn">
                    <i class="bi bi-arrow-clockwise"></i>
                    Reset Filters
                </button>
                <button class="btn btn-outline-secondary btn-sm w-100 mt-2" id="export-network-btn">
                    <i class="bi bi-download"></i>
                    Export Network
                </button>
                <button class="btn btn-outline-info btn-sm w-100 mt-2" id="help-network-btn">
                    <i class="bi bi-question-circle"></i>
                    Help & Tips
                </button>
                <button class="btn btn-outline-success btn-sm w-100 mt-2" id="zoom-fit-btn">
                    <i class="bi bi-arrows-fullscreen"></i>
                    Fit to View
                </button>
            </div>
        `;

    controlsContainer.innerHTML = html;
    this.attachControlEventListeners();
  }

  attachControlEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('process-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.searchTerm = e.target.value.toLowerCase();
        this.updateVisualization();
      });
    }

    // Category filters
    ['technical-mgmt', 'technical'].forEach(category => {
      const checkbox = document.getElementById(`filter-${category}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          const categoryKey = category === 'technical-mgmt' ? 'technical_management' : 'technical';
          if (e.target.checked) {
            this.currentFilters.categories.add(categoryKey);
          } else {
            this.currentFilters.categories.delete(categoryKey);
          }
          this.updateVisualization();
        });
      }
    });

    // Level filters
    ['basic', 'standard', 'comprehensive'].forEach(level => {
      const checkbox = document.getElementById(`filter-${level}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.currentFilters.levels.add(level);
          } else {
            this.currentFilters.levels.delete(level);
          }
          this.updateVisualization();
        });
      }
    });

    // Display options
    const showDepsCheckbox = document.getElementById('show-dependencies');
    if (showDepsCheckbox) {
      showDepsCheckbox.addEventListener('change', (e) => {
        this.currentFilters.showDependencies = e.target.checked;
        this.updateVisualization();
      });
    }

    const showLabelsCheckbox = document.getElementById('show-labels');
    if (showLabelsCheckbox) {
      showLabelsCheckbox.addEventListener('change', (e) => {
        this.toggleLabels(e.target.checked);
      });
    }

    // Layout selection
    const layoutSelect = document.getElementById('layout-select');
    if (layoutSelect) {
      layoutSelect.addEventListener('change', (e) => {
        this.changeLayout(e.target.value);
      });
    }

    // Force layout settings
    const chargeSlider = document.getElementById('charge-strength');
    const chargeValue = document.getElementById('charge-value');
    if (chargeSlider && chargeValue) {
      chargeSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        chargeValue.textContent = value;
        this.currentFilters.layoutSettings.chargeStrength = value;
        this.updateForceLayout();
      });
    }

    const linkSlider = document.getElementById('link-strength');
    const linkValue = document.getElementById('link-value');
    if (linkSlider && linkValue) {
      linkSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        linkValue.textContent = value;
        this.currentFilters.layoutSettings.linkStrength = value;
        this.updateForceLayout();
      });
    }

    // Display options
    const showMetricsCheckbox = document.getElementById('show-metrics');
    if (showMetricsCheckbox) {
      showMetricsCheckbox.addEventListener('change', (e) => {
        this.currentFilters.showMetrics = e.target.checked;
        this.updateVisualization();
      });
    }

    const showRecsCheckbox = document.getElementById('show-recommendations');
    if (showRecsCheckbox) {
      showRecsCheckbox.addEventListener('change', (e) => {
        this.currentFilters.showRecommendations = e.target.checked;
        this.updateVisualization();
      });
    }

    // Export button
    const exportBtn = document.getElementById('export-network-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportNetwork();
      });
    }

    // Help button
    const helpBtn = document.getElementById('help-network-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showHelpModal();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  updateForceLayout() {
    if (this.simulation) {
      this.simulation.force('charge', d3.forceManyBody().strength(this.currentFilters.layoutSettings.chargeStrength));
      const linkForce = this.simulation.force('link');
      if (linkForce) {
        linkForce.strength(this.currentFilters.layoutSettings.linkStrength);
      }
      this.simulation.alpha(0.3).restart();
    }
  }

  exportNetwork() {
    const svgElement = this.svg.node();
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);

    // Add namespace
    const svgWithNamespace = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

    // Create download link
    const blob = new Blob([svgWithNamespace], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'se-process-network.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showHelpModal() {
    const modalHtml = `
            <div class="modal fade" id="network-help-modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Network Visualization Help</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6>Interactive Features</h6>
                            <ul>
                                <li><strong>Drag nodes</strong> to reposition them</li>
                                <li><strong>Click nodes</strong> to view process details</li>
                                <li><strong>Mouse wheel</strong> to zoom in/out</li>
                                <li><strong>Drag background</strong> to pan the view</li>
                            </ul>
                            
                            <h6>Filtering Options</h6>
                            <ul>
                                <li><strong>Search</strong>: Filter processes by name</li>
                                <li><strong>Categories</strong>: Show/hide process categories</li>
                                <li><strong>Levels</strong>: Filter by tailoring levels</li>
                                <li><strong>Dependencies</strong>: Toggle dependency visibility</li>
                            </ul>
                            
                            <h6>Layout Controls</h6>
                            <ul>
                                <li><strong>Force-Directed</strong>: Dynamic physics-based layout</li>
                                <li><strong>Circular</strong>: Organized circular arrangement</li>
                                <li><strong>Hierarchical</strong>: Tree-like structure</li>
                                <li><strong>Charge/Link</strong>: Adjust node repulsion and link strength</li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Remove existing modal if any
    const existingModal = document.getElementById('network-help-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('network-help-modal'));
    modal.show();
  }

  prepareData() {
    const processes = this.processData.processes || [];
    const dependencies = this.dependencyData.dependencies || [];
    const recommendations = this.app.getAssessmentData().recommendations;

    // Create nodes
    this.nodes = processes.map(process => {
      const recommendation = recommendations?.[process.id];
      const recommendedLevel = recommendation?.recommendedLevel || 'basic';

      return {
        id: process.id,
        name: process.name,
        category: process.category,
        description: process.tailoringLevels?.basic?.description || '',
        recommendedLevel: recommendedLevel,
        effort: recommendation?.effort || 1,
        complexity: recommendation?.complexity || 1,
        confidence: recommendation?.confidence || 0.8,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        inputs: this.getAllInputs(process),
        outputs: this.getAllOutputs(process)
      };
    });

    // Create links from dependencies - resolve node references
    this.links = dependencies.map(dep => {
      const sourceNode = this.nodes.find(n => n.id === dep.source);
      const targetNode = this.nodes.find(n => n.id === dep.target);
      
      // Only create link if both nodes exist
      if (!sourceNode || !targetNode) {
        console.warn(`Skipping dependency: ${dep.source} -> ${dep.target} (node not found)`);
        return null;
      }
      
      return {
        source: sourceNode,
        target: targetNode,
        type: dep.type || 'horizontal',
        sourceLevel: dep.sourceLevel,
        targetLevel: dep.targetLevel,
        strength: dep.type === 'vertical' ? 0.8 : 0.4,
        // Add input/output relationship info
        inputOutputRelationship: this.findInputOutputRelationship(sourceNode, targetNode)
      };
    }).filter(link => link !== null);

    // Prepare for flow visualization
    this.prepareFlowData();
  }

  createVisualization() {
    const container = document.getElementById('network-visualization');
    if (!container) return;

    // Create SVG container with responsive design
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, this.width, this.height])
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('class', 'network-svg')
      .style('background', '#f8f9fa');

    // Add zoom behavior with smooth transitions
    this.zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .translateExtent([[0, 0], [this.width, this.height]])
      .on('zoom', (event) => {
        this.svg.select('.zoom-container').attr('transform', event.transform);
      });

    this.svg.call(this.zoom)
      .call(this.zoom.transform, d3.zoomIdentity);

    // Create container for zoomable content
    const zoomContainer = this.svg.append('g').attr('class', 'zoom-container');

    // Add sophisticated arrow markers for different link types
    const defs = this.svg.append('defs');

    const markerTypes = [
      { id: 'dependency', color: '#dc3545', width: 4 },
      { id: 'information', color: '#0d6efd', width: 3 },
      { id: 'sequential', color: '#198754', width: 2 },
    ];

    markerTypes.forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type.id}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', type.color)
        .attr('stroke', type.color)
        .attr('stroke-width', type.width);
    });

    // Create enhanced force simulation with custom parameters
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links)
        .id(d => d.id)
        .strength(this.currentFilters.layoutSettings.linkStrength)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(this.currentFilters.layoutSettings.chargeStrength))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(45))
      .force('x', d3.forceX(this.width / 2).strength(0.05))
      .force('y', d3.forceY(this.height / 2).strength(0.05));

    // Draw links with enhanced styling
    this.linkElements = zoomContainer.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('class', d => `network-link link-${d.type}`)
      .attr('marker-end', d => `url(#arrow-${d.type})`)
      .attr('stroke-width', d => {
        const strengths = { dependency: 3, information: 2, sequential: 1.5 };
        return strengths[d.type] || 1.5;
      })
      .attr('stroke-opacity', 0.8)
      .attr('stroke-linecap', 'round');

    // Draw nodes with enhanced styling and interactivity
    this.nodeElements = zoomContainer.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('class', d => `network-node node-${d.category} level-${d.recommendedLevel}`)
      .attr('r', 20)
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => this.dragStarted(event, d))
        .on('drag', (event, d) => this.dragged(event, d))
        .on('end', (event, d) => this.dragEnded(event, d)),
      )
      .on('mouseover', (event, d) => this.showTooltip(event, d))
      .on('mouseout', () => this.hideTooltip())
      .on('click', (event, d) => this.nodeClicked(event, d));

    // Add dynamic labels with conditional visibility
    this.labelElements = zoomContainer.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('class', 'network-text')
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#2c3e50')
      .attr('pointer-events', 'none')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .text(d => this.getNodeLabel(d));

    // Add metric badges if enabled
    this.metricElements = zoomContainer.append('g')
      .attr('class', 'metrics')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-metric')
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('font-size', '10px')
      .attr('fill', '#6c757d')
      .attr('pointer-events', 'none')
      .text(d => {
        if (!this.currentFilters.showMetrics) return '';
        return `Connections: ${this.getConnectionCount(d)}`;
      });

    // Create tooltip
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'network-tooltip')
      .style('opacity', 0);

    // Update positions on simulation tick with smooth transitions
    this.simulation.on('tick', () => this.ticked());

    // Initial update
    this.updateVisualization();
  }

  getNodeColor(node) {
    const colors = {
      technicalManagement: '#4e79a7',
      technical: '#f28e2c',
      agreement: '#e15759',
      project: '#76b7b2'
    };
    return colors[node.category] || '#999';
  }

  getNodeLabel(node) {
    // Truncate long names
    const maxLength = 12;
    if (node.name.length > maxLength) {
      return `${node.name.substring(0, maxLength - 3) }...`;
    }
    return node.name;
  }

  getNodeRadius(node) {
    return 12;
  }

  getLinkStrokeWidth(link) {
    if (link.inputOutputRelationship) {
      return Math.min(3 + link.inputOutputRelationship.count * 0.5, 6);
    }
    return 2;
  }

  getLinkMarker(link) {
    if (link.inputOutputRelationship) {
      return 'url(#arrowhead)';
    }
    return null;
  }

  updateVisualization() {
    if (!this.nodeElements || !this.linkElements) return;

    // Filter nodes
    const visibleNodes = this.nodes.filter(node => this.isNodeVisible(node));
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    // Filter links
    const visibleLinks = this.currentFilters.showDependencies
      ? this.links.filter(link =>
        visibleNodeIds.has(link.source.id || link.source) &&
                visibleNodeIds.has(link.target.id || link.target),
      )
      : [];

    // Update node visibility
    this.nodeElements
      .style('opacity', d => this.isNodeVisible(d) ? 1 : 0.1)
      .style('pointer-events', d => this.isNodeVisible(d) ? 'all' : 'none');

    // Update link visibility
    this.linkElements
      .style('opacity', d => {
        const sourceVisible = visibleNodeIds.has(d.source.id || d.source);
        const targetVisible = visibleNodeIds.has(d.target.id || d.target);
        return (sourceVisible && targetVisible && this.currentFilters.showDependencies) ? 0.6 : 0;
      });

    // Update label visibility
    this.labelElements
      .style('opacity', d => this.isNodeVisible(d) ? 1 : 0.1);

    // Update simulation
    this.simulation.nodes(visibleNodes);
    const linkForce = this.simulation.force('link');
    if (linkForce) {
      linkForce.links(visibleLinks);
    }
    this.simulation.alpha(0.3).restart();
  }

  // Helper methods for input/output processing
  getAllInputs(process) {
    const inputs = new Set();
    Object.values(process.tailoringLevels || {}).forEach(level => {
      (level.inputs || []).forEach(input => inputs.add(input));
    });
    return Array.from(inputs);
  }

  getAllOutputs(process) {
    const outputs = new Set();
    Object.values(process.tailoringLevels || {}).forEach(level => {
      (level.outputs || []).forEach(output => outputs.add(output));
    });
    return Array.from(outputs);
  }

  findInputOutputRelationship(sourceNode, targetNode) {
    const commonOutputsInputs = sourceNode.outputs.filter(output => 
      targetNode.inputs.includes(output)
    );
    
    return commonOutputsInputs.length > 0 ? {
      items: commonOutputsInputs,
      count: commonOutputsInputs.length
    } : null;
  }

  // Flow visualization methods
  prepareFlowData() {
    this.flowData = {
      inputFlows: new Map(),
      outputFlows: new Map(),
      processFlows: new Map()
    };

    // Build flow relationships
    this.nodes.forEach(node => {
      this.flowData.inputFlows.set(node.id, new Set());
      this.flowData.outputFlows.set(node.id, new Set());
      this.flowData.processFlows.set(node.id, new Set());
    });

    this.links.forEach(link => {
      if (link.inputOutputRelationship) {
        this.flowData.inputFlows.get(link.target.id).add({
          source: link.source.id,
          items: link.inputOutputRelationship.items
        });
        this.flowData.outputFlows.get(link.source.id).add({
          target: link.target.id,
          items: link.inputOutputRelationship.items
        });
        this.flowData.processFlows.get(link.source.id).add(link.target.id);
        this.flowData.processFlows.get(link.target.id).add(link.source.id);
      }
    });
  }

  setupFlowVisualization() {
    // Flow visualization setup - simplified to avoid non-functional code
    this.flowContainer = d3.select('#process-network svg g')
      .append('g')
      .attr('class', 'flow-visualization')
      .style('opacity', 0);
  }

  showProcessFlow(process) {
    const processId = process.id;
    const flows = [];

    // Get input flows
    const inputFlows = Array.from(this.flowData.inputFlows.get(processId) || []);
    inputFlows.forEach(flow => {
      flows.push({
        type: 'input',
        from: flow.source,
        to: processId,
        items: flow.items,
        color: '#4CAF50'
      });
    });

    // Get output flows
    const outputFlows = Array.from(this.flowData.outputFlows.get(processId) || []);
    outputFlows.forEach(flow => {
      flows.push({
        type: 'output',
        from: processId,
        to: flow.target,
        items: flow.items,
        color: '#FF5722'
      });
    });

    // Update flow visualization
    this.updateFlowVisualization(flows);
  }

  updateFlowVisualization(flows = []) {
    if (!flows.length) {
      this.flowContainer.style('opacity', 0);
      return;
    }

    this.flowContainer.style('opacity', 1);

    const flowPaths = this.flowPaths.data(flows, d => `${d.from}-${d.to}-${d.type}`);
    
    flowPaths.enter()
      .append('path')
      .attr('class', 'flow-path')
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.type === 'input' ? '5,5' : null)
      .attr('opacity', 0.7)
      .merge(flowPaths)
      .attr('d', d => {
        const fromNode = this.nodes.find(n => n.id === d.from);
        const toNode = this.nodes.find(n => n.id === d.to);
        if (!fromNode || !toNode) return '';
        
        return `M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`;
      });

    flowPaths.exit().remove();

    const flowLabels = this.flowLabels.data(flows, d => `${d.from}-${d.to}-${d.type}`);
    
    flowLabels.enter()
      .append('text')
      .attr('class', 'flow-label')
      .attr('font-size', '8px')
      .attr('fill', d => d.color)
      .attr('text-anchor', 'middle')
      .merge(flowLabels)
      .attr('x', d => {
        const fromNode = this.nodes.find(n => n.id === d.from);
        const toNode = this.nodes.find(n => n.id === d.to);
        return (fromNode.x + toNode.x) / 2;
      })
      .attr('y', d => {
        const fromNode = this.nodes.find(n => n.id === d.from);
        const toNode = this.nodes.find(n => n.id === d.to);
        return (fromNode.y + toNode.y) / 2 - 10;
      })
      .text(d => d.items.slice(0, 2).join(', ') + (d.items.length > 2 ? '...' : ''));

    flowLabels.exit().remove();
  }

  hideProcessFlow() {
    this.flowContainer.style('opacity', 0);
  }

  // Enhanced filtering and interaction methods
  isNodeVisible(node) {
    // Category filter
    if (!this.currentFilters.categories.has(node.category)) {
      return false;
    }

    // Level filter
    if (!this.currentFilters.levels.has(node.recommendedLevel)) {
      return false;
    }

    // Search filter
    if (this.currentFilters.searchTerm &&
            !node.name.toLowerCase().includes(this.currentFilters.searchTerm)) {
      return false;
    }

    // Check focus process filter
    const focusProcess = document.getElementById('focus-process-select');
    if (focusProcess && focusProcess.value) {
      const focusedId = focusProcess.value;
      if (node.id !== focusedId) {
        // Check if this node is connected to focused process
        const connectedProcesses = this.flowData.processFlows.get(focusedId) || new Set();
        if (!connectedProcesses.has(node.id)) {
          return false;
        }
      }
    }

    return true;
  }

  ticked() {
    if (this.linkElements) {
      this.linkElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    }

    if (this.nodeElements) {
      this.nodeElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }

    if (this.labelElements) {
      this.labelElements
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    }

    if (this.metricElements) {
      this.metricElements
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    }
  }

  dragStarted(event, d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragEnded(event, d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  handleMouseOver(event, d) {
    // Highlight connected nodes and links
    this.highlightConnectedElements(d);

    // Show enhanced tooltip with input/output info
    this.showEnhancedTooltip(event, d);

    // Show flow visualization for this process
    this.showProcessFlow(d);

    // Add hover effect
    d3.select(event.currentTarget)
      .attr('stroke-width', 3)
      .attr('stroke', '#ffc107')
      .attr('filter', 'url(#glow)');
  }

  handleMouseOut(event, d) {
    // Remove highlights
    this.clearHighlights();

    // Hide tooltip
    this.hideTooltip();

    // Hide flow visualization
    this.hideProcessFlow();

    // Remove hover effect
    d3.select(event.currentTarget)
      .attr('stroke-width', 2)
      .attr('stroke', '#fff')
      .attr('filter', null);
  }

  highlightConnectedElements(node) {
    // Highlight connected links
    this.linkElements
      .style('stroke-width', link =>
        (link.source.id === node.id || link.target.id === node.id) ? 4 : 1.5,
      )
      .style('stroke-opacity', link =>
        (link.source.id === node.id || link.target.id === node.id) ? 1 : 0.3,
      );

    // Highlight connected nodes
    this.nodeElements
      .style('opacity', otherNode => {
        const isConnected = this.links.some(link =>
          (link.source.id === node.id && link.target.id === otherNode.id) ||
                    (link.source.id === otherNode.id && link.target.id === node.id),
        );
        return isConnected ? 1 : 0.3;
      });
  }

  showEnhancedTooltip(event, d) {
    const tooltipContent = `
            <div class="tooltip-content">
                <h4>${d.name}</h4>
                <p><strong>Category:</strong> ${d.category}</p>
                <p><strong>Recommended Level:</strong> ${d.recommendedLevel}</p>
                <p><strong>Connections:</strong> ${this.getConnectionCount(d)}</p>
                <p><strong>Inputs:</strong> ${d.inputs?.length || 0}</p>
                <p><strong>Outputs:</strong> ${d.outputs?.length || 0}</p>
            </div>
        `;

    this.tooltip
      .html(tooltipContent)
      .style('left', `${event.pageX + 10 }px`)
      .style('top', `${event.pageY - 28 }px`)
      .style('opacity', 1)
      .style('max-width', '300px');
  }

  getConnectionCount(node) {
    return this.links.filter(link =>
      link.source.id === node.id || link.target.id === node.id,
    ).length;
  }

  addZoomControls() {
    const controls = d3.select('#visualization-controls')
      .append('div')
      .attr('class', 'zoom-controls')
      .style('position', 'absolute')
      .style('top', '10px')
      .style('right', '10px')
      .style('z-index', '1000');

    controls.append('button')
      .attr('class', 'btn btn-sm btn-outline-primary me-2')
      .html('<i class="fas fa-plus"></i>')
      .on('click', () => {
        this.svg.transition().duration(300).call(
          this.zoom.scaleBy, 1.5,
        );
      });

    controls.append('button')
      .attr('class', 'btn btn-sm btn-outline-primary me-2')
      .html('<i class="fas fa-minus"></i>')
      .on('click', () => {
        this.svg.transition().duration(300).call(
          this.zoom.scaleBy, 0.75,
        );
      });

    controls.append('button')
      .attr('class', 'btn btn-sm btn-outline-secondary')
      .html('<i class="fas fa-sync-alt"></i>')
      .on('click', () => {
        this.svg.transition().duration(300).call(
          this.zoom.transform, d3.zoomIdentity,
        );
      });
  }

  nodeClicked(event, d) {
    event.stopPropagation();
    // Use the main app's showProcessDetails method instead of local implementation
    if (window.seApp && typeof window.seApp.showProcessDetails === 'function') {
      window.seApp.showProcessDetails(d.id);
    }
  }

  showTooltip(event, d) {
    const tooltip = this.tooltip;

    tooltip.style('opacity', 1)
      .html(`
                <strong>${d.name}</strong><br/>
                Level: <span class="level-badge level-${d.recommendedLevel}">${d.recommendedLevel}</span><br/>
                Connections: ${this.getConnectionCount(d)}<br/>
                Confidence: ${Math.round(d.confidence * 100)}%
            `)
      .style('left', `${event.pageX + 10 }px`)
      .style('top', `${event.pageY - 10 }px`);
  }

  hideTooltip() {
    this.tooltip.style('opacity', 0);
  }

  toggleLabels(show) {
    if (this.labelElements) {
      this.labelElements.style('opacity', show ? 1 : 0);
    }
  }

  changeLayout(layout) {
    if (!this.simulation) return;

    switch (layout) {
      case 'circular':
        this.applyCircularLayout();
        break;
      case 'hierarchical':
        this.applyHierarchicalLayout();
        break;
      default:
        this.applyForceLayout();
    }
  }

  applyCircularLayout() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 3;

    this.nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / this.nodes.length;
      node.fx = centerX + radius * Math.cos(angle);
      node.fy = centerY + radius * Math.sin(angle);
    });

    this.simulation.alpha(0.3).restart();
  }

  applyHierarchicalLayout() {
    const categories = ['technical_management', 'technical'];
    const categoryHeight = this.height / categories.length;

    categories.forEach((category, catIndex) => {
      const categoryNodes = this.nodes.filter(n => n.category === category);
      const nodeWidth = this.width / (categoryNodes.length + 1);

      categoryNodes.forEach((node, nodeIndex) => {
        node.fx = (nodeIndex + 1) * nodeWidth;
        node.fy = (catIndex + 0.5) * categoryHeight;
      });
    });

    this.simulation.alpha(0.3).restart();
  }

  applyForceLayout() {
    this.nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });

    this.simulation
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .alpha(0.3)
      .restart();
  }

  resetFilters() {
    this.currentFilters = {
      categories: new Set(['technical_management', 'technical']),
      levels: new Set(['basic', 'standard', 'comprehensive']),
      showDependencies: true,
      searchTerm: '',
    };

    // Reset UI controls
    document.getElementById('process-search').value = '';
    document.getElementById('filter-technical-mgmt').checked = true;
    document.getElementById('filter-technical').checked = true;
    document.getElementById('filter-basic').checked = true;
    document.getElementById('filter-standard').checked = true;
    document.getElementById('filter-comprehensive').checked = true;
    document.getElementById('show-dependencies').checked = true;

    this.updateVisualization();
  }

  zoomIn() {
    this.svg.transition().call(this.zoom.scaleBy, 1.5);
  }

  zoomOut() {
    this.svg.transition().call(this.zoom.scaleBy, 1 / 1.5);
  }

  resetView() {
    this.svg.transition().call(this.zoom.transform, d3.zoomIdentity);
  }

  // Public methods
  highlightProcess(processId) {
    if (this.nodeElements) {
      this.nodeElements
        .style('stroke', d => d.id === processId ? '#ff6b6b' : '#fff')
        .style('stroke-width', d => d.id === processId ? 4 : 2);
    }
  }

  clearHighlights() {
    if (this.nodeElements) {
      this.nodeElements
        .style('stroke', '#fff')
        .style('stroke-width', 2);
    }
  }

  setupEventListeners() {
    // Setup zoom control event listeners
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoomIn());
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.zoomOut());
    }
    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => this.resetView());
    }
  }
}

// Export for global access
window.ProcessNetworkVisualizer = ProcessNetworkVisualizer;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 		module = execOptions.module;
/******/ 		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("b61ff77d87ce9d4fd1a4")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "se-tailoring-framework:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 		
/******/ 			var onAccepted = function () {
/******/ 				return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 					// handle errors in accept handlers and self accepted module load
/******/ 					if (error) {
/******/ 						return setStatus("fail").then(function () {
/******/ 							throw error;
/******/ 						});
/******/ 					}
/******/ 		
/******/ 					if (queuedInvalidatedModules) {
/******/ 						return internalApply(options).then(function (list) {
/******/ 							outdatedModules.forEach(function (moduleId) {
/******/ 								if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 							});
/******/ 							return list;
/******/ 						});
/******/ 					}
/******/ 		
/******/ 					return setStatus("idle").then(function () {
/******/ 						return outdatedModules;
/******/ 					});
/******/ 				});
/******/ 			};
/******/ 		
/******/ 			return Promise.all(
/******/ 				results
/******/ 					.filter(function (result) {
/******/ 						return result.apply;
/******/ 					})
/******/ 					.map(function (result) {
/******/ 						return result.apply(reportError);
/******/ 					})
/******/ 			)
/******/ 				.then(function (applyResults) {
/******/ 					applyResults.forEach(function (modules) {
/******/ 						if (modules) {
/******/ 							for (var i = 0; i < modules.length; i++) {
/******/ 								outdatedModules.push(modules[i]);
/******/ 							}
/******/ 						}
/******/ 					});
/******/ 				})
/******/ 				.then(onAccepted);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatese_tailoring_framework"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					var acceptPromises = [];
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									var result;
/******/ 									try {
/******/ 										result = callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 									if (result && typeof result.then === "function") {
/******/ 										acceptPromises.push(result);
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					var onAccepted = function () {
/******/ 						// Load self accepted modules
/******/ 						for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 							var item = outdatedSelfAcceptedModules[o];
/******/ 							var moduleId = item.module;
/******/ 							try {
/******/ 								item.require(moduleId);
/******/ 							} catch (err) {
/******/ 								if (typeof item.errorHandler === "function") {
/******/ 									try {
/******/ 										item.errorHandler(err, {
/******/ 											moduleId: moduleId,
/******/ 											module: __webpack_require__.c[moduleId]
/******/ 										});
/******/ 									} catch (err1) {
/******/ 										if (options.onErrored) {
/******/ 											options.onErrored({
/******/ 												type: "self-accept-error-handler-errored",
/******/ 												moduleId: moduleId,
/******/ 												error: err1,
/******/ 												originalError: err
/******/ 											});
/******/ 										}
/******/ 										if (!options.ignoreErrored) {
/******/ 											reportError(err1);
/******/ 											reportError(err);
/******/ 										}
/******/ 									}
/******/ 								} else {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					};
/******/ 		
/******/ 					return Promise.all(acceptPromises)
/******/ 						.then(onAccepted)
/******/ 						.then(function () {
/******/ 							return outdatedModules;
/******/ 						});
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkse_tailoring_framework"] = self["webpackChunkse_tailoring_framework"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=3000&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true")))
/******/ 	__webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./node_modules/webpack/hot/dev-server.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./js/app.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map