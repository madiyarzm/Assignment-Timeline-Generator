from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.database.models import db, Milestone, Assignment

milestones_bp = Blueprint("milestones", __name__)


@milestones_bp.route("/milestones/<int:milestone_id>", methods=["PATCH"])
@login_required
def update_milestone(milestone_id):
    """Update a single milestone (text or completed)."""
    milestone = Milestone.query.get(milestone_id)

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    #Security check — ensure milestone belongs to current user
    assignment = Assignment.query.get(milestone.assignment_id)
    if assignment.user_id != current_user.id:
        return jsonify({"error": "Not authorized"}), 403

    data = request.get_json()
    if "text" in data:
        milestone.text = data["text"]
    if "completed" in data:
        milestone.completed = data["completed"]

    db.session.commit()

    return jsonify({
        "id": milestone.id,
        "assignment_id": milestone.assignment_id,
        "text": milestone.text,
        "completed": milestone.completed,
        "order": milestone.order
    }), 200


from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.database.models import db, Assignment, Milestone

reorder_bp = Blueprint("reorder", __name__)


@reorder_bp.route("/assignments/<int:assignment_id>/milestones/reorder", methods=["PATCH"])
@login_required
def reorder_milestones(assignment_id):
    """Reorder milestones using a list of milestone IDs."""
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    data = request.get_json()
    new_order = data.get("order")

    if not new_order or not isinstance(new_order, list):
        return jsonify({"error": "Invalid 'order' format"}), 400

    milestones = Milestone.query.filter_by(assignment_id=assignment.id).all()
    milestone_ids = {m.id for m in milestones}

    # Validate: ensure submitted IDs exist in this assignment
    if set(new_order) != milestone_ids:
        return jsonify({"error": "Order list does not match existing milestones"}), 400

    # Apply new ordering
    for index, milestone_id in enumerate(new_order):
        milestone = next(m for m in milestones if m.id == milestone_id)
        milestone.order = index

    db.session.commit()

    return jsonify({"message": "Milestones reordered successfully"}), 200


from flask import Blueprint, request, jsonify
from backend.services.llm_splitter import split_assignment

llm_bp = Blueprint("llm", __name__)


@llm_bp.route("/llm/split", methods=["POST"])
def llm_split():
    """Generate milestones from a description + deadline using the LLM service."""
    data = request.get_json()
    description = data.get("description", "")
    deadline = data.get("deadline")

    if not description or not deadline:
        return jsonify({"error": "Description and deadline are required"}), 400

    try:
        milestones = split_assignment(description, deadline)
        return jsonify(milestones), 200
    except Exception as e:
        print(f"[LLM] Failed to generate milestones: {e}")

        return jsonify({
            "error": "LLM generation failed. Try again or use manual subtasks."
        }), 500


