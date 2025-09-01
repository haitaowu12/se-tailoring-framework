#!/usr/bin/env python3
"""
Script to convert markdown table data from 'Improved system engineering tailoring model.md'
to the processes.json format, ensuring multiple entries for attributes are captured as arrays.
"""

import json
import re
from typing import Dict, List, Any
from pathlib import Path


def parse_markdown_table(markdown_content: str) -> List[Dict[str, Any]]:
    """Parse the markdown table content into a structured format."""
    # Split content into lines and filter out empty lines
    lines = [line.strip() for line in markdown_content.split('\n') if line.strip()]
    
    # Find table rows (lines starting and ending with |)
    table_rows = [line for line in lines if line.startswith('|') and line.endswith('|')]
    
    print(f"Found {len(table_rows)} table rows")
    if len(table_rows) < 2:
        print("Not enough table rows found")
        return []
    
    # Parse the markdown table - first row is separator, second row is dash line, third row is actual headers
    # Skip the first two rows and use the third row as headers
    if len(table_rows) < 3:
        return []
    
    headers = [cell.strip() for cell in table_rows[2].strip('|').split('|') if cell.strip()]
    print(f"Headers: {headers}")
    
    data = []
    for i, row in enumerate(table_rows[3:], start=4):
        cells = [cell.strip() for cell in row.strip('|').split('|')]
        if len(cells) == len(headers):
            data.append(dict(zip(headers, cells)))
        else:
            print(f"Row {i}: Mismatch - {len(cells)} cells vs {len(headers)} headers")
    
    print(f"Parsed {len(data)} data rows")
    return data


def group_by_process_and_subprocess(data: List[Dict[str, Any]]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    """Group data by ProcessName and Sub-processName."""
    grouped = {}
    
    for row in data:
        process_name = row.get('ProcessName', '')
        subprocess_name = row.get('Sub-processName', '')
        attribute_name = row.get('AttributeName', '')
        
        if not process_name or not subprocess_name or not attribute_name:
            continue
        
        if process_name not in grouped:
            grouped[process_name] = {}
        
        if subprocess_name not in grouped[process_name]:
            grouped[process_name][subprocess_name] = {}
        
        if attribute_name not in grouped[process_name][subprocess_name]:
            grouped[process_name][subprocess_name][attribute_name] = []
        
        # Add the row data for this attribute
        grouped[process_name][subprocess_name][attribute_name].append({
            'Basic': row.get('Basic', ''),
            'Standard': row.get('Standard', ''),
            'Comprehensive': row.get('Comprehensive', '')
        })
    
    return grouped


def convert_to_json_structure(grouped_data: Dict[str, Dict[str, List[Dict[str, Any]]]]) -> List[Dict[str, Any]]:
    """Convert the grouped data to the processes.json structure."""
    processes = []
    
    # Map process categories to match existing JSON structure
    category_mapping = {
        'Agreement Processes': 'agreement',
        'Organizational Project-Enabling Processes': 'technical_management',
        'Technical Management Processes': 'technical_management',
        'Technical Processes': 'technical'
    }
    
    # Map subprocess names to match existing JSON IDs
    id_mapping = {
        'Acquisition Process': 'acquisition',
        'Supply Process': 'supply',
        'Life Cycle Model Management Process': 'lifecycle_model_management',
        'Infrastructure ManagementProcess': 'infrastructure_management',
        'Portfolio Management Process': 'portfolio_management',
        'Human Resource Management Process': 'human_resource_management',
        'Quality Management Process': 'quality_management',
        'Knowledge Management Process': 'knowledge_management',
        'Project Planning Process': 'project_planning',
        'Project Assessment and Control Process': 'project_assessment_control',
        'Decision Management Process': 'decision_management',
        'Risk Management Process': 'risk_management',
        'Configuration Management Process': 'configuration_management',
        'Information Management Process': 'information_management',
        'Measurement Process': 'measurement',
        'Quality Assurance Process': 'quality_assurance',
        'Business or Mission Analysis Process': 'business_mission_analysis',
        'Stakeholder Needs and Requirements Definition Process': 'stakeholder_needs_requirements',
        'System Requirements Definition Process': 'system_requirements_definition',
        'Architecture Definition Process': 'architecture_definition',
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
    }
    
    for process_name, subprocesses in grouped_data.items():
        category = category_mapping.get(process_name, 'other')
        
        for subprocess_name, attributes in subprocesses.items():
            process_id = id_mapping.get(subprocess_name, subprocess_name.lower().replace(' ', '_').replace('-', '_'))
            
            # Build the process structure
            process = {
                'id': process_id,
                'name': subprocess_name,
                'category': category,
                'description': '',  # Will be populated from Definition attribute
                'tailoringLevels': {
                    'basic': {'description': '', 'activities': [], 'effort': 1, 'complexity': 1, 'inputs': [], 'outputs': [], 'artifacts': []},
                    'standard': {'description': '', 'activities': [], 'effort': 3, 'complexity': 3, 'inputs': [], 'outputs': [], 'artifacts': []},
                    'comprehensive': {'description': '', 'activities': [], 'effort': 5, 'complexity': 5, 'inputs': [], 'outputs': [], 'artifacts': []}
                }
            }
            
            # Process each attribute
            for attribute_name, attribute_data in attributes.items():
                if attribute_name == 'Definition':
                    # Set description for each tailoring level from Definition attribute
                    if attribute_data:
                        for level in ['basic', 'standard', 'comprehensive']:
                            level_description = attribute_data[0].get(level.capitalize(), '')
                            if level_description and level_description.strip():
                                process['tailoringLevels'][level]['description'] = level_description.strip()
                
                elif attribute_name == 'Activities':
                    for level in ['basic', 'standard', 'comprehensive']:
                        level_activities = []
                        for entry in attribute_data:
                            activity = entry.get(level.capitalize(), '')
                            if activity and activity.strip():
                                level_activities.append(activity.strip())
                        process['tailoringLevels'][level]['activities'] = level_activities
                
                elif attribute_name in ['Inputs', 'Outputs']:
                    for level in ['basic', 'standard', 'comprehensive']:
                        level_items = []
                        for entry in attribute_data:
                            item = entry.get(level.capitalize(), '')
                            if item and item.strip():
                                # Parse input/output entries that may contain source information
                                item_text = item.split(' - ')[0].strip() if ' - ' in item else item.strip()
                                if item_text:
                                    level_items.append(item_text)
                        process['tailoringLevels'][level][attribute_name.lower()] = level_items
                
                elif attribute_name == 'KeyArtifacts/Deliverables':
                    for level in ['basic', 'standard', 'comprehensive']:
                        level_artifacts = []
                        for entry in attribute_data:
                            artifact = entry.get(level.capitalize(), '')
                            if artifact and artifact.strip():
                                level_artifacts.append(artifact.strip())
                        process['tailoringLevels'][level]['artifacts'] = level_artifacts
            
            processes.append(process)
    
    return processes


def main():
    """Main function to convert markdown to JSON."""
    # Paths
    markdown_path = Path('/Users/tony/se-tailoring-framework/Improved system engineering tailoring model.md')
    json_output_path = Path('/Users/tony/se-tailoring-framework/data/processes_updated.json')
    
    # Read markdown content
    try:
        with open(markdown_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
    except FileNotFoundError:
        print(f"Error: Markdown file not found at {markdown_path}")
        return
    
    # Parse markdown table
    table_data = parse_markdown_table(markdown_content)
    if not table_data:
        print("Error: No table data found in markdown file")
        return
    
    # Group data by process and subprocess
    grouped_data = group_by_process_and_subprocess(table_data)
    
    # Convert to JSON structure
    processes_json = convert_to_json_structure(grouped_data)
    
    # Write to JSON file
    try:
        with open(json_output_path, 'w', encoding='utf-8') as f:
            json.dump(processes_json, f, indent=2, ensure_ascii=False)
        print(f"Successfully converted markdown to JSON. Output saved to {json_output_path}")
    except Exception as e:
        print(f"Error writing JSON file: {e}")
    
    # Also create a backup of the original processes.json
    original_json_path = Path('/Users/tony/se-tailoring-framework/data/processes.json')
    if original_json_path.exists():
        backup_path = original_json_path.with_suffix('.json.backup')
        try:
            import shutil
            shutil.copy2(original_json_path, backup_path)
            print(f"Created backup of original processes.json at {backup_path}")
        except Exception as e:
            print(f"Warning: Could not create backup: {e}")


if __name__ == '__main__':
    main()