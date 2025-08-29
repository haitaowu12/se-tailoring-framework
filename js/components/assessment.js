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
    
    navContainer.innerHTML = `
            <div class="d-flex justify-content-between">
                <button class="btn btn-outline-secondary" 
                        onclick="window.seApp.assessmentEngine.previousQuestion()"
                        ${this.currentQuestionIndex === 0 && this.currentCategoryIndex === 0 ? 'disabled' : ''}>
                    <i class="bi bi-arrow-left"></i> Previous
                </button>
                <button class="btn btn-primary" 
                        onclick="window.seApp.assessmentEngine.nextQuestion()"
                        ${!hasAnswered ? 'disabled' : ''}>
                    ${this.isLastQuestion() ? 'Complete Assessment' : 'Next Question'} 
                    <i class="bi bi-arrow-right"></i>
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
