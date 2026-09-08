import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "profiles" / "schema.json"


def test_profiles_match_schema():
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema)

    for profile_path in sorted((ROOT / "profiles").glob("*.json")):
        if profile_path.name == "schema.json":
            continue
        profile = json.loads(profile_path.read_text(encoding="utf-8"))
        errors = sorted(validator.iter_errors(profile), key=lambda error: error.json_path)
        assert errors == [], f"{profile_path.name} schema errors: {[error.message for error in errors]}"


def test_profile_word_count_metadata_matches_entries():
    for profile_path in sorted((ROOT / "profiles").glob("*.json")):
        if profile_path.name == "schema.json":
            continue
        profile = json.loads(profile_path.read_text(encoding="utf-8"))
        if "word_count" in profile:
            assert profile["word_count"] == len(profile["entries"])
