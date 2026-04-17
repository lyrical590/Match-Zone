from PIL import Image, ImageDraw, ImageFont

# Create an image with a blue background
img = Image.new('RGB', (1200, 630), color=(0, 123, 255))

# Load a font
font = ImageFont.load_default()

# Initialize ImageDraw
d = ImageDraw.Draw(img)

# Add text to image
text = "LYRICAL ZONE"
text_width, text_height = d.textsize(text, font=font)
text_position = ((1200 - text_width) / 2, (630 - text_height) / 2)

# Add text to image
d.text(text_position, text, fill=(255, 255, 255), font=font)

# Save the image
img.save('matchzone-site/assets/og-preview.png')
