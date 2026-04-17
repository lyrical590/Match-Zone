from PIL import Image, ImageDraw, ImageFont

def update_og_preview(input_image_path, output_image_path):
    # Load the original image
    image = Image.open(input_image_path)

    # Create a drawing context
    draw = ImageDraw.Draw(image)

    # Define new text and logo
    new_text = "LYRICAL ZONE"
    font_size = 40
    font = ImageFont.load_default()  # You may want to specify a ttf font file for custom fonts

    # Text positioning
    text_width, text_height = draw.textsize(new_text, font=font)
    width, height = image.size
    text_x = (width - text_width) / 2
    text_y = (height - text_height) / 4  # Position above the center

    # Draw the new text on the image
    draw.text((text_x, text_y), new_text, fill="white", font=font)

    # Placeholder for logo design logic
    logo = Image.open("path_to_new_logo.png")  # Replace with actual logo path
    logo = logo.resize((50, 50))  # Resize logo if necessary
    image.paste(logo, (width // 2 - 25, height // 2 - 25), logo)

    # Save the updated image
    image.save(output_image_path)

# Example usage
update_og_preview("og-preview.png", "updated_og_preview.png")
