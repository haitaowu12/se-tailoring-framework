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
  }

  generateRecommendations(assessmentScores) {
    const processes = this.processData.processes || [];
    const recommendations = {};

    // Generate base recommendations for each process
    processes.forEach(process => {
      recommendations[process.id] = this.calculateProcessLevel(process, assessmentScores);
    });

    // Apply dependency constraints
    this.applyDependencyConstraints(recommendations);

    // Apply safety and other constraints
    this.applyProcessConstraints(recommendations, assessmentScores);

    // Calculate confidence scores
    this.calculateConfidenceScores(recommendations, assessmentScores);

    this.recommendations = recommendations;
    return recommendations;
  }

  calculateProcessLevel(process, scores) {
    // Base level calculation using weighted assessment scores
    const baseScore = this.calculateBaseScore(process, scores);

    // Determine level based on score thresholds
    let level = 'basic';
    if (baseScore >= 3.6) {
      level = 'comprehensive';
    } else if (baseScore >= 2.1) {
      level = 'standard';
    }

    return {
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
    const maxIterations = 10; // Prevent infinite loops

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

    if (!assessmentData.recommendations || Object.keys(assessmentData.recommendations).length === 0) {
      this.renderNoRecommendations(container);
      return;
    }

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
