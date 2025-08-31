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
