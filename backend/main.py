import os
import sys

from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_login import LoginManager

# --- Load environment variables from .env file ---
# This loads .env from the project root directory
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

# --- Ensure backend is importable when running directly ---
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.database.models import User, db


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "super-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    # Настройка CORS для работы с фронтендом
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.filter_by(user_id=int(user_id)).first()

    # --- Register auth routes ---
    from backend.api.routes.assignments import assignments_bp
    from backend.api.routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(assignments_bp)

    # --- Health check route ---
    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    # --- Ensure DB tables exist ---
    with app.app_context():
        db.create_all()

    # --- Serve React frontend ---
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        build_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "public")
        index_path = os.path.join(build_dir, "index.html")

        print("Looking for frontend in:", build_dir)

        # Serve static assets (JS, CSS, etc.)
        if path != "" and os.path.exists(os.path.join(build_dir, path)):
            return send_from_directory(build_dir, path)

        # Fallback: serve index.html for React Router
        if os.path.exists(index_path):
            return send_from_directory(build_dir, "index.html")

        # If frontend isn't built
        return jsonify({"error": "Frontend not found"}), 404

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
