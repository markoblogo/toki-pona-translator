from tools.twemoji import to_twemoji_slug

def test_twemoji_slug_drops_fe0f_like_twemoji_assets():
    # Example from Twemoji discussions: ☺️ (263A FE0F) is stored as 263a
    assert to_twemoji_slug("☺️") == "263a"
