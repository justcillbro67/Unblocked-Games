from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from typing import List, Dict, Any

from flask import Flask, request, redirect, jsonify, send_from_directory

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "feedback.json")
README_PATH = os.path.join(BASE_DIR, "README.md")

FEEDBACK_START = "<!-- FEEDBACK:START -->"
FEEDBACK_END = "<!-- FEEDBACK:END -->"

app = Flask(__name__, static_folder='.', static_url_path='')


def load_feedback() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            return data if isinstance(data, list) else []
        except json.JSONDecodeError:
            return []


def save_feedback(items: List[Dict[str, Any]]) -> None:
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=True, indent=2)


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip())


def render_feedback_block(items: List[Dict[str, Any]]) -> str:
    if not items:
        return "No feedback yet."
    lines = []
    for item in items:
        name = normalize_text(item.get("name", "Anonymous") or "Anonymous")
        message = normalize_text(item.get("message", ""))
        time = item.get("time", "")
        lines.append(f"- **Name**: {name}")
        lines.append(f"  - Message: {message}")
        lines.append(f"  - Time: {time}")
    return "\n".join(lines)


def update_readme(items: List[Dict[str, Any]]) -> None:
    if os.path.exists(README_PATH):
        with open(README_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        content = "# Unblocked Games Page\n"

    block = render_feedback_block(items)

    if FEEDBACK_START in content and FEEDBACK_END in content:
        pattern = re.compile(rf"{re.escape(FEEDBACK_START)}.*?{re.escape(FEEDBACK_END)}", re.S)
        replacement = f"{FEEDBACK_START}\n{block}\n{FEEDBACK_END}"
        content = pattern.sub(replacement, content)
    else:
        content += f"\n\n## Feedback (Latest First)\n\n{FEEDBACK_START}\n{block}\n{FEEDBACK_END}\n"

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(content)


@app.route("/")
def root():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/submit-feedback", methods=["POST"])
def submit_feedback():
    name = request.form.get("name", "").strip() or "Anonymous"
    message = request.form.get("message", "").strip()
    if not message:
        return "Message is required", 400

    items = load_feedback()
    items.insert(0, {
        "name": name,
        "message": message,
        "time": datetime.now(timezone.utc).isoformat()
    })
    save_feedback(items)
    update_readme(items)
    return redirect("/feedback.html")


@app.route("/feedback.json")
def feedback_json():
    return jsonify(load_feedback())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
