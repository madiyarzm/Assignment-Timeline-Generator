from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user

from backend.database.models import User, db

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


@auth_bp.record_once
def init_bcrypt(setup_state):
    app = setup_state.app
    bcrypt.init_app(app)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Generate username from email (part before @)
    username = email.split("@")[0]
    # Ensure username is unique
    base_username = username
    counter = 1
    while User.query.filter_by(username=username).first():
        username = f"{base_username}{counter}"
        counter += 1

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, email=email, name=name, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    login_user(new_user)
    return (
        jsonify(
            {
                "message": "User registered successfully!",
                "user": {
                    "id": new_user.user_id,
                    "email": new_user.email,
                    "name": new_user.name,
                    "username": new_user.username,
                },
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify(
            {
                "message": "Logged in successfully!",
                "user": {
                    "id": user.user_id,
                    "email": user.email,
                    "name": user.name,
                    "username": user.username,
                },
            }
        )
    return jsonify({"error": "Invalid email or password"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully!"})


@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify(
            {
                "id": current_user.user_id,
                "email": current_user.email,
                "name": current_user.name,
                "username": current_user.username,
            }
        )
    return jsonify({"error": "Not authenticated"}), 401
