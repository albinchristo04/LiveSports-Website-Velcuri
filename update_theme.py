import os

file_path = 'public/blogger-theme.xml'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replacements
replacements = [
    (
        "  .container {\n    padding: var(--spacing-md);\n  }",
        "  .container {\n    padding: var(--spacing-xs);\n  }"
    ),
    (
        "  .match-container {\n    padding: var(--spacing-sm);\n  }",
        "  .match-container {\n    padding: 0;\n    width: 100%;\n  }"
    ),
    (
        "  .match-header,\n  .player-section {\n    padding: var(--spacing-md);\n  }",
        "  .match-header {\n    padding: var(--spacing-sm);\n    margin-bottom: var(--spacing-md);\n    border-radius: var(--border-radius);\n  }\n  \n  .player-section {\n    padding: var(--spacing-sm);\n    margin-top: var(--spacing-md);\n    border-radius: var(--border-radius);\n  }\n\n  .video-container {\n    border-radius: var(--border-radius);\n    margin-bottom: var(--spacing-md);\n  }"
    )
]

new_content = content
for target, replacement in replacements:
    if target in new_content:
        new_content = new_content.replace(target, replacement)
        print(f"Replaced: {target.splitlines()[0]}...")
    else:
        print(f"Target not found: {target.splitlines()[0]}...")
        # Try to find it with flexible whitespace
        import re
        # Escape regex special characters in target
        target_regex = re.escape(target).replace(r'\ ', r'\s+')
        # But re.escape escapes spaces too, which we replaced.
        # Let's just try to be smarter about whitespace manually if needed.
        # For now, let's see if exact match works.

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("File updated successfully.")
else:
    print("No changes made.")
