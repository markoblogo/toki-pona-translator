# Pictiq compatibility snapshot

The adapter binds a reviewed Pictiq commit, lexicon hash and migration hash. CI checks out that exact commit rather than the moving default branch, so unrelated upstream commits cannot silently invalidate the recorded snapshot.

To update the reference, review the current lexicon/migration changes, run `python crosswalks/pictiq/build_adapter.py --pictiq-root /path/to/pictiq`, update the CI checkout ref to the resulting target_pictiq.commit, then run the crosswalk tests and the generator with --check. Keep the accepted research crosswalk and human classifications unchanged unless separately reviewed.

This refresh targets Pictiq 31f9887dd7c924495e09cd17edcec0eadd23dae6 (lexicon 0.8.1). The resolution table is unchanged; only the target commit and lexicon hash changed. A pinned snapshot is not a claim of compatibility with every future Pictiq revision.
