from tools.coverage_report import main as coverage_main
from tools.export_mapping_md import main as mapping_main


def test_export_mapping_md_generates_expected_sections(tmp_path):
    out = tmp_path / "mapping.md"

    assert mapping_main(["--out", str(out)]) == 0

    text = out.read_text(encoding="utf-8")
    assert "# Mapping: toki pona → sitelen emoji" in text
    assert "## Core words" in text
    assert "`jan`" in text
    assert "## Aliases" in text
    assert "## Utility entries" in text


def test_coverage_report_generates_expected_summary(tmp_path):
    out = tmp_path / "coverage.md"

    assert coverage_main(["--out", str(out)]) == 0

    text = out.read_text(encoding="utf-8")
    assert "# Coverage report" in text
    assert "Core words covered: **120/120**" in text
    assert "Core words covered" in text
    assert "Missing core words: **0**" in text
    assert "Aliases resolved: **1/1**" in text
    assert "Aliases resolved" in text
    assert "Utility entries: **2**" in text
    assert "Utility entries" in text
