import os

def list_game_assets():
    static_path = os.path.join(os.path.dirname(__file__), 'love_site/static/love_site/images/game-assets')
    assets = []
    
    for root, dirs, files in os.walk(static_path):
        for file in files:
            rel_path = os.path.relpath(os.path.join(root, file), static_path)
            assets.append(f"love_site/images/game-assets/{rel_path}".replace('\\', '/'))
    
    print("Discovered assets:")
    for asset in assets:
        print(f"- {asset}")

if __name__ == '__main__':
    list_game_assets()
