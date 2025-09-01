const fs = require('fs');
const path = require('path');

// Process ID mapping from the improved model document
const processNameToId = {
  // Agreement Processes
  'Acquisition Process': 'acquisition',
  'Supply Process': 'supply',
  
  // Organizational Project-Enabling Processes
  'Life Cycle Model Management Process': 'lifecycle_model_management',
  'Infrastructure Management Process': 'infrastructure_management',
  'Portfolio Management Process': 'portfolio_management',
  'Human Resource Management Process': 'human_resource_management',
  'Quality Management Process': 'quality_management',
  'Knowledge Management Process': 'knowledge_management',
  
  // Technical Management Processes
  'Project Planning Process': 'project_planning',
  'Project Assessment and Control Process': 'project_assessment_control',
  'Decision Management Process': 'decision_management',
  'Risk Management Process': 'risk_management',
  'Configuration Management Process': 'configuration_management',
  'Information Management Process': 'information_management',
  'Measurement Process': 'measurement',
  'Quality Assurance Process': 'quality_assurance',
  
  // Technical Processes
  'Business or Mission Analysis Process': 'business_mission_analysis',
  'Stakeholder Needs and Requirements Definition Process': 'stakeholder_needs_requirements',
  'System Requirements Definition Process': 'system_requirements_definition',
  'System Architecture Definition Process': 'system_architecture_definition_process',
  'Design Definition Process': 'design_definition',
  'System Analysis Process': 'system_analysis',
  'Implementation Process': 'implementation',
  'Integration Process': 'integration',
  'Verification Process': 'verification',
  'Transition Process': 'transition',
  'Validation Process': 'validation',
  'Operation Process': 'operation',
  'Maintenance Process': 'maintenance',
  'Disposal Process': 'disposal'
};

// Extract dependencies from the improved model document data
const extractDependencies = (inputData) => {
  const dependencies = [];
  let currentTargetProcess = '';
  let currentTargetCategory = '';
  
  // Process each line of input data
  inputData.split('\n').forEach(line => {
    const parts = line.split('|').filter(p => p.trim());
    
    // Check if this is a process header line (contains process name and Inputs)
    if (parts.length >= 3 && parts[1]?.trim() && parts[2]?.trim() === 'Inputs') {
      currentTargetCategory = parts[0]?.trim();
      currentTargetProcess = parts[1]?.trim();

    }
    
    // Check if this is an Inputs line with dependency information
    if (parts.length >= 4 && parts[2]?.trim() === 'Inputs') {
      const inputDescription = parts[3]?.trim();

      
      // Extract source process and level from input description
      // Format: "Source Process Name - Source Process - Tier (from description)"
      const processMatch = inputDescription.match(/(.+?)\s*-\s*(.+?)\s*Process\s*-\s*(Basic|Standard|Comprehensive)/i);
      
      if (processMatch) {

        const sourceProcessName = processMatch[2]?.trim() + ' Process'; // The process name is in the second capture group
        const level = processMatch[3]?.toLowerCase();
        
        if (sourceProcessName && processNameToId[sourceProcessName] && processNameToId[currentTargetProcess]) {

          dependencies.push({
            source: processNameToId[sourceProcessName],
            sourceLevel: level,
            target: processNameToId[currentTargetProcess],
            targetLevel: level,
            type: 'horizontal' // Default type, can be refined based on process categories
          });
        }
      }
    }
  });
  
  return dependencies;
};

// Read the improved model document
const improvedModelPath = path.join(__dirname, 'Improved system engineering tailoring model.md');
const improvedModelContent = fs.readFileSync(improvedModelPath, 'utf8');

// Extract dependencies
const newDependencies = extractDependencies(improvedModelContent);

// Read current dependencies
const currentDependenciesPath = path.join(__dirname, 'data', 'dependencies.json');
const currentDependencies = JSON.parse(fs.readFileSync(currentDependenciesPath, 'utf8'));

// Merge dependencies (avoid duplicates)
const mergedDependencies = [...currentDependencies.dependencies];
const existingDependencyKeys = new Set();

currentDependencies.dependencies.forEach(dep => {
  const key = `${dep.source}-${dep.sourceLevel}-${dep.target}-${dep.targetLevel}`;
  existingDependencyKeys.add(key);
});

newDependencies.forEach(newDep => {
  const key = `${newDep.source}-${newDep.sourceLevel}-${newDep.target}-${newDep.targetLevel}`;
  if (!existingDependencyKeys.has(key)) {
    mergedDependencies.push(newDep);
    existingDependencyKeys.add(key);
  }
});

// Update dependencies.json
const updatedDependencies = {
  dependencies: mergedDependencies
};

fs.writeFileSync(
  path.join(__dirname, 'data', 'dependencies.json'),
  JSON.stringify(updatedDependencies, null, 2)
);

console.log(`Updated dependencies.json with ${mergedDependencies.length} dependencies`);
console.log(`Added ${newDependencies.length} new dependencies from improved model`);