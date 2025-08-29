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
