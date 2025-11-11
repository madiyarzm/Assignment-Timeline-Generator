from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_login import login_user, logout_user
from backend.database.models import db, User

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


@auth_bp.record_once
def init_bcrypt(setup_state):
    app = setup_state.app
    bcrypt.init_app(app)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Logged in successfully!"})
    return jsonify({"error": "Invalid username or password"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully!"})
