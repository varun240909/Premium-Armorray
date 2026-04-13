import os

# ✏️ CHANGE THIS to your actual folder path
FOLDER_PATH = r"C:\Users\admin\Downloads\2"

# ✏️ CHANGE these if you want a different prefix or starting number
PREFIX = "sequence"
START_NUMBER = 2192

# -----------------------------------------------

files = sorted([
    f for f in os.listdir(FOLDER_PATH)
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'))
])

print(f"Found {len(files)} image(s). Preview of renames:\n")

for i, filename in enumerate(files):
    ext = os.path.splitext(filename)[1]  # keeps original extension e.g. .jpg
    new_name = f"{PREFIX}-{START_NUMBER + i}{ext}"
    print(f"  {filename}  →  {new_name}")

confirm = input("\nProceed with renaming? (yes/no): ").strip().lower()

if confirm == "yes":
    for i, filename in enumerate(files):
        ext = os.path.splitext(filename)[1]
        old_path = os.path.join(FOLDER_PATH, filename)
        new_name = f"{PREFIX}-{START_NUMBER + i}{ext}"
        new_path = os.path.join(FOLDER_PATH, new_name)
        os.rename(old_path, new_path)
    print(f"\n✅ Done! {len(files)} file(s) renamed successfully.")
else:
    print("\n❌ Rename cancelled. No files were changed.")