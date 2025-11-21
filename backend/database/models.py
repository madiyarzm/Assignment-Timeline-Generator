from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(UserMixin, db.Model):
    __tablename__ = "user"

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # Flask-Login requires get_id method
    def get_id(self):
        return str(self.user_id)


class Assignment(db.Model):
    __tablename__ = "assignment"

    assignment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    deadline = db.Column(db.String(50), nullable=False)
    progress = db.Column(db.Integer, default=0)
    created_at = db.Column(db.String(50), nullable=False)

    user = db.relationship(
        "User",
        backref=db.backref("assignments", lazy=True, cascade="all, delete-orphan"),
    )


class Milestone(db.Model):
    __tablename__ = "milestone"

    milestone_id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(
        db.Integer,
        db.ForeignKey("assignment.assignment_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.String(50), nullable=True)
    google_task_id = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)

    assignment = db.relationship(
        "Assignment",
        backref=db.backref(
            "milestones",
            lazy=True,
            order_by="Milestone.order",
            cascade="all, delete-orphan",
        ),
    )


class Subtask(db.Model):
    __tablename__ = "subtask"

    subtask_id = db.Column(db.Integer, primary_key=True)
    milestone_id = db.Column(
        db.Integer,
        db.ForeignKey("milestone.milestone_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(500), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.String(50), nullable=True)
    google_task_id = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)

    milestone = db.relationship(
        "Milestone",
        backref=db.backref(
            "subtasks",
            lazy=True,
            order_by="Subtask.order",
            cascade="all, delete-orphan",
        ),
    )
