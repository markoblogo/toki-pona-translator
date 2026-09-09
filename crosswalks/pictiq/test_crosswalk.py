import json
import sys
import unittest
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from generate_crosswalk import CLASSES, CONFIDENCES, PILOT_WORDS, review_items


class CrosswalkDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((HERE / "crosswalk-120.json").read_text(encoding="utf-8"))
        cls.rows = cls.data["mappings"]

    def test_exact_canonical_scope_and_values(self):
        words = (HERE.parents[1] / "packages/sitelen-emoji/words/nimi_pu.txt").read_text().splitlines()
        self.assertEqual(120, len(words))
        self.assertEqual(120, len(set(words)))
        self.assertEqual(words, [row["word"] for row in self.rows])
        self.assertTrue(all(row["pictiq"]["mapping"] in CLASSES for row in self.rows))
        self.assertTrue(all(row["review_confidence"] in CONFIDENCES for row in self.rows))

    def test_mapping_shape_and_statistics(self):
        for row in self.rows:
            ids = row["pictiq"]["ids"]
            mapping = row["pictiq"]["mapping"]
            self.assertEqual(mapping == "none", not ids, row["word"])
            if mapping == "composed":
                self.assertGreater(len(ids), 1, row["word"])
        self.assertEqual({"none": 85, "partial": 24, "contextual": 10, "composed": 1},
                         dict(Counter(row["pictiq"]["mapping"] for row in self.rows)))
        self.assertEqual({"high": 98, "medium": 19, "low": 3},
                         dict(Counter(row["review_confidence"] for row in self.rows)))

    def test_review_queue_selection_is_unique(self):
        queue = review_items(self.data)
        self.assertEqual(106, len(queue))
        self.assertEqual(len(queue), len({row["word"] for row in queue}))

    def test_pilot_classifications_are_declared_unchanged(self):
        pilot = json.loads((HERE / "pilot-20.json").read_text(encoding="utf-8"))
        pilot_by_word = {row["word"]: row for row in pilot["mappings"]}
        full_by_word = {row["word"]: row for row in self.rows}
        self.assertEqual(PILOT_WORDS, set(pilot_by_word))
        for word, old in pilot_by_word.items():
            self.assertEqual(old["pictiq"]["mapping"], full_by_word[word]["pictiq"]["mapping"])
            self.assertEqual(old["pictiq"]["ids"], full_by_word[word]["pictiq"]["ids"])


if __name__ == "__main__":
    unittest.main()
