import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "odt_editorial_qa.py"
SPEC = importlib.util.spec_from_file_location("odt_editorial_qa", SCRIPT)
qa = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = qa
SPEC.loader.exec_module(qa)


class EditorialQATest(unittest.TestCase):
    def test_canonical_variants_include_frequency_and_book_locations(self):
        entries = [
            qa.GuideEntry("Name Guide", "Polyphemus", "jan Polipemo", "jan Polipemo", "guide:p1:l1"),
            qa.GuideEntry("Name Guide", "Polyphemus", "jan Polupemo", "jan Polupemo", "guide:p2:l1"),
        ]
        blocks = [
            qa.LatinBlock("BOOK I", "book-01:p2", "jan Polipemo li lon."),
            qa.LatinBlock("BOOK IX", "book-09:p8", "jan Polupemo li lon."),
            qa.LatinBlock("BOOK IX", "book-09:p11", "jan Polupemo li toki."),
        ]

        proposals = qa.build_canonical_proposals(entries, blocks)
        item = proposals[0]

        self.assertEqual(item["status"], "unresolved")
        variants = {variant["form"]: variant for variant in item["variants"]}
        self.assertEqual(variants["jan Polipemo"]["frequency"], 1)
        self.assertEqual(variants["jan Polipemo"]["by_book"], {"BOOK I": 1})
        self.assertEqual(variants["jan Polupemo"]["frequency"], 2)
        self.assertEqual(variants["jan Polupemo"]["by_book"], {"BOOK IX": 2})
        self.assertEqual(variants["jan Polupemo"]["locations"], ["book-09:p8", "book-09:p11"])

    def test_pdf_only_anomalies_are_source_artifacts_not_typos(self):
        findings = qa.audit_pdf_extraction(
            "BOOK I\nvalid text\n\ufffd\n",
            expected_books=["BOOK I", "BOOK II"],
        )

        self.assertTrue(findings)
        self.assertEqual({finding["category"] for finding in findings}, {"SOURCE_ARTIFACT"})
        self.assertNotIn("TYPO_ANOMALY", {finding["category"] for finding in findings})
        self.assertTrue(all(finding["evidence_source"] == "PDF_ONLY" for finding in findings))

    def test_visible_guide_duplication_wins_over_partial_font_spans(self):
        self.assertEqual(
            qa.split_exact_duplicate("weka e linja tan len weka e linja tan len"),
            ("weka e linja tan len", "weka e linja tan len"),
        )

    def test_report_starts_with_publication_readiness_summary(self):
        summary = {
            "severity_counts": {"critical": 1, "high": 2, "medium": 3, "low": 4},
            "manual_decisions_required": 5,
            "safe_automatic_fixes_proposed": 6,
            "ready_for_kdp": False,
        }
        report = qa.render_report(summary, [], [], {})

        first = report.split("##", 1)[0]
        self.assertIn("Publication readiness", first)
        self.assertIn("Critical: 1", first)
        self.assertIn("High: 2", first)
        self.assertIn("Manual decisions required: 5", first)
        self.assertIn("Safe automatic fixes proposed: 6", first)
        self.assertIn("READY FOR KDP: NO", first)

    def test_audit_only_guard_preserves_source_hash(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "sample.odt"
            source.write_bytes(b"immutable")
            before = qa.sha256_file(source)
            qa.assert_source_unchanged(source, before)
            self.assertEqual(qa.sha256_file(source), before)


if __name__ == "__main__":
    unittest.main()
