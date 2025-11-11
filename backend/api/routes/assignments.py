"""
Assignments API routes.

Handles all endpoints related to assignments and their milestones:

- POST /assignments         → Create a new assignment and generate milestones via LLM
- GET /assignments          → Retrieve all assignments
- GET /assignments/{id}     → Retrieve a specific assignment and its milestones
- PUT /assignments/{id}     → Update an assignment and its milestones
- DELETE /assignments/{id}  → Delete an assignment and its milestones

All routes should:
- Call the LLM service to split assignment descriptions into milestones
- Return structured JSON responses containing assignment and milestone data
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.database.models import db, Assignment, Milestone
from backend.services.llm_splitter import generate_milestones

assignments_bp = Blueprint("assignments", __name__)


@assignments_bp.route("/assignments", methods=["GET"])
@login_required
def get_assignments():
    """Get all assignments for the current user."""
    assignments = Assignment.query.filter_by(user_id=current_user.id).all()
    
    result = []
    for assignment in assignments:
        milestones = Milestone.query.filter_by(assignment_id=assignment.id).order_by(Milestone.order).all()
        result.append({
            "id": assignment.id,
            "title": assignment.title,
            "description": assignment.description,
            "deadline": assignment.deadline,
            "progress": assignment.progress,
            "createdAt": assignment.created_at,
            "subtasks": [{
                "id": m.id,
                "text": m.text,
                "completed": m.completed
            } for m in milestones]
        })
    
    return jsonify(result)


@assignments_bp.route("/assignments/<int:assignment_id>", methods=["GET"])
@login_required
def get_assignment(assignment_id):
    """Get a specific assignment with its milestones."""
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404
    
    milestones = Milestone.query.filter_by(assignment_id=assignment.id).order_by(Milestone.order).all()
    
    return jsonify({
        "id": assignment.id,
        "title": assignment.title,
        "description": assignment.description,
        "deadline": assignment.deadline,
        "progress": assignment.progress,
        "createdAt": assignment.created_at,
        "subtasks": [{
            "id": m.id,
            "text": m.text,
            "completed": m.completed
        } for m in milestones]
    })


@assignments_bp.route("/assignments", methods=["POST"])
@login_required
def create_assignment():
    """Create a new assignment and generate milestones via LLM."""
    data = request.get_json()
    
    title = data.get("title")
    description = data.get("description", "")
    deadline = data.get("deadline")
    
    if not title or not deadline:
        return jsonify({"error": "Title and deadline are required"}), 400
    
    # Create assignment
    from datetime import datetime
    created_at = data.get("createdAt") or datetime.now().isoformat()
    
    assignment = Assignment(
        user_id=current_user.id,
        title=title,
        description=description,
        deadline=deadline,
        progress=0,
        created_at=created_at
    )
    db.session.add(assignment)
    db.session.flush()  # Get the assignment ID
    
    # Generate milestones using LLM if description is provided
    subtasks_data = data.get("subtasks", [])
    
    if subtasks_data:
        # Use provided subtasks
        for idx, subtask in enumerate(subtasks_data):
            milestone = Milestone(
                assignment_id=assignment.id,
                text=subtask.get("text", ""),
                completed=subtask.get("completed", False),
                order=idx
            )
            db.session.add(milestone)
    elif description:
        # Generate milestones using LLM
        try:
            llm_milestones = generate_milestones(description, deadline)
            
            # Handle both list and dict formats from LLM
            if isinstance(llm_milestones, dict) and "milestones" in llm_milestones:
                milestones_list = llm_milestones["milestones"]
            elif isinstance(llm_milestones, list):
                milestones_list = llm_milestones
            else:
                milestones_list = []
            
            for idx, milestone_data in enumerate(milestones_list):
                # Extract text from milestone (could be title or description)
                if isinstance(milestone_data, dict):
                    text = milestone_data.get("title") or milestone_data.get("description") or str(milestone_data)
                else:
                    text = str(milestone_data)
                
                milestone = Milestone(
                    assignment_id=assignment.id,
                    text=text,
                    completed=False,
                    order=idx
                )
                db.session.add(milestone)
        except Exception as e:
            # If LLM fails, create default milestones
            print(f"LLM milestone generation failed: {e}")
            default_milestones = [
                "Research and gather information",
                "Create initial outline or plan",
                "Draft first version",
                "Review and revise content",
                "Final proofreading and editing",
                "Submit or present final work"
            ]
            for idx, text in enumerate(default_milestones):
                milestone = Milestone(
                    assignment_id=assignment.id,
                    text=text,
                    completed=False,
                    order=idx
                )
                db.session.add(milestone)
    
    db.session.commit()
    
    # Return created assignment
    milestones = Milestone.query.filter_by(assignment_id=assignment.id).order_by(Milestone.order).all()
    return jsonify({
        "id": assignment.id,
        "title": assignment.title,
        "description": assignment.description,
        "deadline": assignment.deadline,
        "progress": assignment.progress,
        "createdAt": assignment.created_at,
        "subtasks": [{
            "id": m.id,
            "text": m.text,
            "completed": m.completed
        } for m in milestones]
    }), 201


@assignments_bp.route("/assignments/<int:assignment_id>", methods=["PUT"])
@login_required
def update_assignment(assignment_id):
    """Update an assignment and its milestones."""
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404
    
    data = request.get_json()
    
    # Update assignment fields
    if "title" in data:
        assignment.title = data["title"]
    if "description" in data:
        assignment.description = data["description"]
    if "deadline" in data:
        assignment.deadline = data["deadline"]
    if "progress" in data:
        assignment.progress = data["progress"]
    
    # Update milestones if provided
    if "subtasks" in data:
        # Delete existing milestones
        Milestone.query.filter_by(assignment_id=assignment.id).delete()
        
        # Add new milestones
        for idx, subtask in enumerate(data["subtasks"]):
            milestone = Milestone(
                assignment_id=assignment.id,
                text=subtask.get("text", ""),
                completed=subtask.get("completed", False),
                order=idx
            )
            db.session.add(milestone)
    
    db.session.commit()
    
    # Return updated assignment
    milestones = Milestone.query.filter_by(assignment_id=assignment.id).order_by(Milestone.order).all()
    return jsonify({
        "id": assignment.id,
        "title": assignment.title,
        "description": assignment.description,
        "deadline": assignment.deadline,
        "progress": assignment.progress,
        "createdAt": assignment.created_at,
        "subtasks": [{
            "id": m.id,
            "text": m.text,
            "completed": m.completed
        } for m in milestones]
    })


@assignments_bp.route("/assignments/<int:assignment_id>", methods=["DELETE"])
@login_required
def delete_assignment(assignment_id):
    """Delete an assignment and its milestones."""
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404
    
    # Delete milestones first (cascade should handle this, but being explicit)
    Milestone.query.filter_by(assignment_id=assignment.id).delete()
    
    # Delete assignment
    db.session.delete(assignment)
    db.session.commit()
    
    return jsonify({"message": "Assignment deleted successfully"}), 200
