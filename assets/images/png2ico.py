from wand.image import Image

with Image(filename="vaper-logo.png") as img:
    img.resize(256, 256)  # Resize to ICO-safe dimensions
    img.format = 'ico'
    img.save(filename="vaper-logo.ico")

