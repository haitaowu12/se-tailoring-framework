/*
 * Admin Portal Component
 * Provides an interface for administrators to edit assessment questions, weights,
 * calculations, and recommendation algorithms
 */

class AdminPortal {
  constructor(app) {
    this.app = app;
    this.isAdminMode = false;
    this.adminPanel = null;
    this.editMode = ''; // 'questions', 'processes', 'dependencies', 'weights', 'calculations'
    this.currentDataBackup = null;
    this.securityToken = 'admin123'; // In a real implementation, use proper authentication
  }

  init() {
    console.log('Admin Portal initialized');
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Use the existing nav-admin button for authentication
      if (e.target.id === 'nav-admin') {
        this.showLoginPrompt();
      } else if (e.target.id === 'admin-logout-btn') {
        this.logout();
      } else if (e.target.id === 'admin-hide-btn') {
        this.togglePanelVisibility();
      } else if (this.isAdminMode) {
        this.handleAdminNavigation(e);
      }
    });
  }

  togglePanelVisibility() {
    if (this.adminPanel) {
      // Check if panel is currently visible
      const isVisible = 
        this.adminPanel.style.transform === 'translateX(0px)' || 
        this.adminPanel.style.transform === '' ||
        this.adminPanel.style.right === '0px';

      if (isVisible) {
        // Hide panel - move off-screen to the right (since it's positioned on the right)
        this.adminPanel.style.transform = 'translateX(100%)';
      } else {
        // Show panel - move to visible position
        this.adminPanel.style.transform = 'translateX(0px)';
      }
      
      const hideButton = document.getElementById('admin-hide-btn');
      if (hideButton) {
        hideButton.textContent = isVisible ? 'Show' : 'Hide';
      }
    }
  }

  showLoginPrompt() {
    // Create a custom modal instead of using prompt()
    const modalHtml = `
      <div id="admin-login-modal" class="modal-backdrop">
        <div class="modal-content">
          <h3>Admin Login</h3>
          <p>Enter admin security token to access the admin panel:</p>
          <input type="password" id="admin-token-input" class="form-control mb-3" placeholder="Security Token">
          <div class="modal-actions">
            <button id="admin-login-submit" class="btn btn-primary">Login</button>
            <button id="admin-login-cancel" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    `;

    // Add CSS for the modal
    const style = document.createElement('style');
    style.textContent = `
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 400px;
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
      }
      .form-control {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);

    // Add modal to the document
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    const modal = document.getElementById('admin-login-modal');
    const submitBtn = document.getElementById('admin-login-submit');
    const cancelBtn = document.getElementById('admin-login-cancel');
    const tokenInput = document.getElementById('admin-token-input');

    // Handle form submission
    const handleSubmit = () => {
      const token = tokenInput.value;
      if (token === this.securityToken) {
        this.enterAdminMode();
      } else {
        alert('Invalid admin token. Access denied.');
      }
      this.closeLoginModal(modal, style);
    };

    // Handle cancel
    const handleCancel = () => {
      this.closeLoginModal(modal, style);
    };

    // Add event listeners
    submitBtn.addEventListener('click', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    tokenInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });

    // Focus on the input field
    tokenInput.focus();
  }

  closeLoginModal(modal, style) {
    // Remove modal container from the document
    // First find the modal container (which wraps the modal)
    const modalContainer = document.querySelector('#admin-login-modal')?.parentNode;
    
    // Remove both the modal and its container if they exist
    if (modalContainer && modalContainer.parentNode) {
      modalContainer.parentNode.removeChild(modalContainer);
    }
    
    // Also remove the style element
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  enterAdminMode() {
    this.isAdminMode = true;
    this.createAdminPanel();
    
    // Save backup of original data
    this.currentDataBackup = {
      questions: JSON.parse(JSON.stringify(this.app.questionData)),
      processes: JSON.parse(JSON.stringify(this.app.processData)),
      dependencies: JSON.parse(JSON.stringify(this.app.dependencyData))
    };
    
    alert('Admin mode activated. Be careful with changes!');
  }

  createAdminPanel() {
    // Create admin panel container
    this.adminPanel = document.createElement('div');
    this.adminPanel.id = 'admin-panel';
    this.adminPanel.className = 'admin-panel fixed-top right-0 top-0 h-full w-80 bg-dark text-white p-4 shadow-lg z-50';
    
    // Admin panel content
    this.adminPanel.innerHTML = `
      <div class="admin-header mb-4">
        <h3>Admin Portal</h3>
        <div class="d-flex gap-2">
          <button id="admin-hide-btn" class="btn btn-secondary btn-sm mt-2">Hide</button>
          <button id="admin-logout-btn" class="btn btn-danger btn-sm mt-2">Logout</button>
        </div>
      </div>
      
      <div class="admin-menu mb-4">
        <h4 class="mb-2">Edit Options</h4>
        <button class="admin-edit-btn w-100 mb-2 btn btn-light text-left" data-mode="questions">Assessment Questions</button>
        <button class="admin-edit-btn w-100 mb-2 btn btn-light text-left" data-mode="processes">Process Definitions</button>
        <button class="admin-edit-btn w-100 mb-2 btn btn-light text-left" data-mode="dependencies">Process Dependencies</button>
        <button class="admin-edit-btn w-100 mb-2 btn btn-light text-left" data-mode="weights">Weighting Configuration</button>
        <button class="admin-edit-btn w-100 mb-2 btn btn-light text-left" data-mode="calculations">Recommendation Logic</button>
      </div>
      
      <div class="admin-actions">
        <h4 class="mb-2">Actions</h4>
        <button id="save-changes-btn" class="w-100 mb-2 btn btn-success">Save Changes</button>
        <button id="reset-changes-btn" class="w-100 mb-2 btn btn-warning">Reset Changes</button>
        <button id="export-config-btn" class="w-100 mb-2 btn btn-info">Export Configuration</button>
        <button id="import-config-btn" class="w-100 mb-2 btn btn-info">Import Configuration</button>
      </div>
    `;
    
    document.body.appendChild(this.adminPanel);
    // No margin adjustment needed - panel uses fixed positioning
  }

  handleAdminNavigation(e) {
    if (e.target.classList.contains('admin-edit-btn')) {
      this.editMode = e.target.dataset.mode;
      this.renderEditor(this.editMode);
    } else if (e.target.id === 'save-changes-btn') {
      this.saveChanges();
    } else if (e.target.id === 'reset-changes-btn') {
      this.resetChanges();
    } else if (e.target.id === 'export-config-btn') {
      this.exportConfiguration();
    } else if (e.target.id === 'import-config-btn') {
      this.importConfiguration();
    }
  }

  renderEditor(mode) {
    // Clear main content area
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;
    
    contentContainer.innerHTML = `
      <div class="admin-editor-container p-4">
        <div class="mb-4">
          <h2>Admin Editor: ${this.getModeDisplayName(mode)}</h2>
          <p class="text-muted">Make changes carefully. Click "Save Changes" in the admin panel when done.</p>
        </div>
        <div id="editor-content" class="bg-light p-4 rounded">
          ${this.renderEditorContent(mode)}
        </div>
      </div>
    `;
  }

  getModeDisplayName(mode) {
    const displayNames = {
      questions: 'Assessment Questions',
      processes: 'Process Definitions',
      dependencies: 'Process Dependencies',
      weights: 'Weighting Configuration',
      calculations: 'Recommendation Calculation Logic'
    };
    return displayNames[mode] || mode;
  }

  renderEditorContent(mode) {
    switch (mode) {
      case 'questions':
        return this.renderQuestionsEditor();
      case 'processes':
        return this.renderProcessesEditor();
      case 'dependencies':
        return this.renderDependenciesEditor();
      case 'weights':
        return this.renderWeightsEditor();
      case 'calculations':
        return this.renderCalculationsEditor();
      default:
        return '<p>Select an editor from the admin panel.</p>';
    }
  }

  renderQuestionsEditor() {
    const questionData = JSON.stringify(this.app.questionData, null, 2);
    return `
      <div class="mb-3">
        <label for="questions-json" class="form-label">Assessment Questions JSON</label>
        <textarea id="questions-json" class="form-control" rows="20" style="font-family: monospace;">
          ${questionData}
        </textarea>
      </div>
      <div class="alert alert-info mt-4">
        <h5>Structure Guide:</h5>
        <p>Edit the JSON structure to modify assessment questions, categories, weights, and options.</p>
        <ul>
          <li>Each category has an ID, name, description, and weight</li> 
          <li>Each question has an ID, text, type, dimension, weight, and options</li>
          <li>Options include value, label, and score</li>
        </ul>
      </div>
    `;
  }

  renderProcessesEditor() {
    const processData = JSON.stringify(this.app.processData, null, 2);
    return `
      <div class="mb-3">
        <label for="processes-json" class="form-label">Process Definitions JSON</label>
        <textarea id="processes-json" class="form-control" rows="20" style="font-family: monospace;">
          ${processData}
        </textarea>
      </div>
      <div class="alert alert-info mt-4">
        <h5>Structure Guide:</h5>
        <p>Edit process definitions including tailoring levels, descriptions, activities, effort, and complexity.</p>
        <ul>
          <li>Each process has ID, name, category, and tailoringLevels (basic, standard, comprehensive)</li>
          <li>Each level contains description, activities, effort, complexity, inputs, outputs, and artifacts</li>
        </ul>
      </div>
    `;
  }

  renderDependenciesEditor() {
    const dependencyData = JSON.stringify(this.app.dependencyData, null, 2);
    return `
      <div class="mb-3">
        <label for="dependencies-json" class="form-label">Process Dependencies JSON</label>
        <textarea id="dependencies-json" class="form-control" rows="20" style="font-family: monospace;">
          ${dependencyData}
        </textarea>
      </div>
      <div class="alert alert-info mt-4">
        <h5>Structure Guide:</h5>
        <p>Define dependencies between processes at different tailoring levels.</p>
        <ul>
          <li>Each dependency has source, sourceLevel, target, targetLevel, and type</li>
          <li>source and target refer to process IDs</li>
          <li>sourceLevel and targetLevel can be basic, standard, or comprehensive</li>
        </ul>
      </div>
    `;
  }

  renderWeightsEditor() {
    // Get current weights from recommendation engine
    const weights = this.app.recommendationEngine ? 
      this.app.recommendationEngine.getProcessWeights({ id: 'default' }) : 
      { complexity: 0.3, safety: 0.25, scale: 0.25, maturity: 0.2 };
    
    return `
      <div class="mb-4">
        <h4>Default Dimension Weights</h4>
        <div class="row mb-2">
          <div class="col-6">
            <label for="complexity-weight" class="form-label">Complexity Weight</label>
            <input type="number" id="complexity-weight" class="form-control" value="${weights.complexity}" min="0" max="1" step="0.05">
          </div>
          <div class="col-6">
            <label for="safety-weight" class="form-label">Safety Weight</label>
            <input type="number" id="safety-weight" class="form-control" value="${weights.safety}" min="0" max="1" step="0.05">
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label for="scale-weight" class="form-label">Scale Weight</label>
            <input type="number" id="scale-weight" class="form-control" value="${weights.scale}" min="0" max="1" step="0.05">
          </div>
          <div class="col-6">
            <label for="maturity-weight" class="form-label">Maturity Weight</label>
            <input type="number" id="maturity-weight" class="form-control" value="${weights.maturity}" min="0" max="1" step="0.05">
          </div>
        </div>
      </div>
      <div class="alert alert-info mt-4">
        <p>Adjust the default weights for each dimension. These weights determine how assessment scores influence process recommendations.</p>
        <p class="text-warning">Note: Process-specific weights are defined in the recommendation engine code and cannot be edited here.</p>
      </div>
    `;
  }

  renderCalculationsEditor() {
    // Get current calculation settings from recommendation engine or use defaults
    const settings = this.app.recommendationEngine?.calculationSettings || {
      basicThreshold: 2.0,
      standardThreshold: 3.5,
      maxDependencyIterations: 10
    };
    
    return `
      <div class="mb-4">
        <h4>Recommendation Calculation Settings</h4>
        <div class="mb-3">
          <label for="basic-threshold" class="form-label">Basic Level Maximum Score</label>
          <input type="number" id="basic-threshold" class="form-control" value="${settings.basicThreshold}" min="0" max="5" step="0.1">
          <small class="form-text text-muted">Processes with scores below this value will be recommended as Basic level.</small>
        </div>
        <div class="mb-3">
          <label for="standard-threshold" class="form-label">Standard Level Maximum Score</label>
          <input type="number" id="standard-threshold" class="form-control" value="${settings.standardThreshold}" min="0" max="5" step="0.1">
          <small class="form-text text-muted">Processes with scores below this value but above Basic threshold will be recommended as Standard level.</small>
        </div>
        <div class="mb-3">
          <label for="dependency-iterations" class="form-label">Maximum Dependency Iterations</label>
          <input type="number" id="dependency-iterations" class="form-control" value="${settings.maxDependencyIterations}" min="1" max="100">
          <small class="form-text text-muted">Maximum number of iterations when applying dependency constraints.</small>
        </div>
      </div>
      <div class="alert alert-info mt-4">
        <p>Adjust the calculation parameters that determine how recommendation levels are determined based on scores.</p>
        <p>Processes with scores above the Standard threshold will be recommended as Comprehensive level.</p>
      </div>
    `;
  }

  saveChanges() {
    try {
      switch (this.editMode) {
        case 'questions':
          this.saveQuestionsChanges();
          break;
        case 'processes':
          this.saveProcessesChanges();
          break;
        case 'dependencies':
          this.saveDependenciesChanges();
          break;
        case 'weights':
          this.saveWeightsChanges();
          break;
        case 'calculations':
          this.saveCalculationsChanges();
          break;
      }
      
      // Apply changes to the app
      this.applyChangesToApp();
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Failed to save changes: ${error.message}`);
    }
  }

  saveQuestionsChanges() {
    const questionsJson = document.getElementById('questions-json').value;
    this.app.questionData = JSON.parse(questionsJson);
  }

  saveProcessesChanges() {
    const processesJson = document.getElementById('processes-json').value;
    this.app.processData = JSON.parse(processesJson);
  }

  saveDependenciesChanges() {
    const dependenciesJson = document.getElementById('dependencies-json').value;
    this.app.dependencyData = JSON.parse(dependenciesJson);
  }

  saveWeightsChanges() {
    // Store weights in the app
    this.app.customWeights = {
      complexity: parseFloat(document.getElementById('complexity-weight').value),
      safety: parseFloat(document.getElementById('safety-weight').value),
      scale: parseFloat(document.getElementById('scale-weight').value),
      maturity: parseFloat(document.getElementById('maturity-weight').value)
    };
  }

  saveCalculationsChanges() {
    // Store calculation settings in the app
    this.app.calculationSettings = {
      basicThreshold: parseFloat(document.getElementById('basic-threshold').value),
      standardThreshold: parseFloat(document.getElementById('standard-threshold').value),
      maxDependencyIterations: parseInt(document.getElementById('dependency-iterations').value)
    };
  }

  applyChangesToApp() {
    // Reinitialize necessary components with updated data
    if (this.app.assessmentEngine) {
      this.app.assessmentEngine.questionData = this.app.questionData;
      // Re-render assessment if active
      if (this.app.currentView === 'assessment') {
        this.app.assessmentEngine.render();
      }
    }
    
    // Reinitialize recommendation engine with new data
    if (this.app.recommendationEngine) {
      this.app.recommendationEngine.processData = this.app.processData;
      this.app.recommendationEngine.dependencyData = this.app.dependencyData;
      // Update weights if custom weights are set
      if (this.app.customWeights) {
        // Override getProcessWeights method with custom weights
        const originalGetProcessWeights = this.app.recommendationEngine.getProcessWeights;
        this.app.recommendationEngine.getProcessWeights = (process) => {
          // First check if there are process-specific adjustments
          const adjustments = originalGetProcessWeights(process);
          // If no adjustments, use custom weights if available
          return Object.keys(adjustments).length > 0 ? adjustments : this.app.customWeights;
        };
      }
      
      // Update calculation settings if set
      if (this.app.calculationSettings) {
        // Store settings for use in calculateProcessLevel
        this.app.recommendationEngine.calculationSettings = this.app.calculationSettings;
      }
    }
  }

  resetChanges() {
    if (confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
      // Restore from backup
      this.app.questionData = JSON.parse(JSON.stringify(this.currentDataBackup.questions));
      this.app.processData = JSON.parse(JSON.stringify(this.currentDataBackup.processes));
      this.app.dependencyData = JSON.parse(JSON.stringify(this.currentDataBackup.dependencies));
      
      // Remove custom settings
      delete this.app.customWeights;
      delete this.app.calculationSettings;
      
      // Reapply changes to app
      this.applyChangesToApp();
      
      // Re-render editor
      this.renderEditor(this.editMode);
      
      alert('Changes have been reset.');
    }
  }

  exportConfiguration() {
    const config = {
      questions: this.app.questionData,
      processes: this.app.processData,
      dependencies: this.app.dependencyData,
      customWeights: this.app.customWeights,
      calculationSettings: this.app.calculationSettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `se-framework-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importConfiguration() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const config = JSON.parse(event.target.result);
            
            if (confirm('Are you sure you want to import this configuration? Existing data will be replaced.')) {
              // Apply imported configuration
              if (config.questions) this.app.questionData = config.questions;
              if (config.processes) this.app.processData = config.processes;
              if (config.dependencies) this.app.dependencyData = config.dependencies;
              if (config.customWeights) this.app.customWeights = config.customWeights;
              if (config.calculationSettings) this.app.calculationSettings = config.calculationSettings;
              
              // Update backup
              this.currentDataBackup = {
                questions: JSON.parse(JSON.stringify(this.app.questionData)),
                processes: JSON.parse(JSON.stringify(this.app.processData)),
                dependencies: JSON.parse(JSON.stringify(this.app.dependencyData))
              };
              
              // Apply changes to app
              this.applyChangesToApp();
              
              // Re-render editor
              this.renderEditor(this.editMode);
              
              alert('Configuration imported successfully!');
            }
          } catch (error) {
            console.error('Error importing configuration:', error);
            alert('Failed to import configuration: Invalid JSON format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  logout() {
    if (confirm('Are you sure you want to exit admin mode? Any unsaved changes will be lost.')) {
      this.isAdminMode = false;
      
      // Remove admin panel
      if (this.adminPanel && this.adminPanel.parentNode) {
        this.adminPanel.parentNode.removeChild(this.adminPanel);
      }
      
      // No margin adjustment to restore - panel uses fixed positioning
      
      // Restore original data
      this.resetChanges();
      
      // Return to welcome view
      this.app.showView("welcome");
    }
  }
}

// Export for CommonJS and ES modules
export { AdminPortal };

// Make AdminPortal globally available for browser environment
if (typeof window !== 'undefined') {
  window.AdminPortal = AdminPortal;
}