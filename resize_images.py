from PIL import Image, ImageOps, ImageFilter
import os

def correct_orientation(img):
    try:
        return ImageOps.exif_transpose(img)
    except Exception as e:
        print(f"Orientation correction failed: {str(e)}")
        return img

def resize_images():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    SOURCE_DIR = os.path.join(BASE_DIR, 'love_site', 'static', 'love_site', 'images', 'source_images')
    OUTPUT_DIR = os.path.join(BASE_DIR, 'love_site', 'static', 'love_site', 'images', 'backgrounds')
    TARGET_SIZE = (800, 1600)  # Width x Height

    os.makedirs(SOURCE_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Processing images from: {SOURCE_DIR}")
    
    processed = 0
    for filename in os.listdir(SOURCE_DIR):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                img_path = os.path.join(SOURCE_DIR, filename)
                with Image.open(img_path) as img:
                    # Fix orientation first
                    img = correct_orientation(img)
                    
                    # Calculate aspect-correct resize
                    target_ratio = TARGET_SIZE[0] / TARGET_SIZE[1]
                    img_ratio = img.width / img.height
                    
                    if img_ratio > target_ratio:
                        # Image is wider than target - resize by height
                        new_height = TARGET_SIZE[1]
                        new_width = int(img_ratio * new_height)
                    else:
                        # Image is taller than target - resize by width
                        new_width = TARGET_SIZE[0]
                        new_height = int(new_width / img_ratio)
                        
                    img = img.resize((new_width, new_height), Image.LANCZOS)
                    
                    # Create blurred background
                    blurred_bg = img.resize(TARGET_SIZE)
                    blurred_bg = blurred_bg.filter(ImageFilter.GaussianBlur(15))
                    
                    # Paste centered image on blurred background
                    offset = (
                        (TARGET_SIZE[0] - img.width) // 2,
                        (TARGET_SIZE[1] - img.height) // 2
                    )
                    blurred_bg.paste(img, offset)
                    
                    blurred_bg.save(os.path.join(OUTPUT_DIR, filename))
                    processed += 1
                    print(f"Processed {filename} (Original: {img.size} → New: {TARGET_SIZE})")

            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
    
    print(f"\nDone! Processed {processed} images")

if __name__ == "__main__":
    resize_images()