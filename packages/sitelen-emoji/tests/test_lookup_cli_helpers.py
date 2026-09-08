from pathlib import Path

from tools.profile import load_profile, resolve

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT / "profiles" / "default-stable.v1.json"

def test_resolve_alias_ali_equals_ale():
    p = load_profile(PROFILE)
    assert resolve("ali", p) == resolve("ale", p)

def test_resolve_punctuation_keys_exist():
    p = load_profile(PROFILE)
    assert resolve("_punct_period", p) == "➖️"
    assert resolve("_punct_colon", p) == "➗️"
