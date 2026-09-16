import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define exact whole-word replacements for Tailwind classes
    replacements = {
        r'\bbg-slate-950\b': 'bg-slate-50',
        r'\bbg-slate-900\b': 'bg-white',
        r'\bbg-slate-850\b': 'bg-slate-100',
        r'\bbg-slate-800\b': 'bg-slate-100',
        r'\bbg-slate-700\b': 'bg-slate-200',
        
        r'\bborder-slate-800\b': 'border-slate-200',
        r'\bborder-slate-700\b': 'border-slate-300',
        r'\bborder-slate-600\b': 'border-slate-300',
        
        r'\btext-slate-100\b': 'text-slate-900',
        r'\btext-slate-200\b': 'text-slate-800',
        r'\btext-slate-300\b': 'text-slate-700',
        r'\btext-slate-400\b': 'text-slate-600',
        r'\btext-slate-500\b': 'text-slate-500',
    }

    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)

    # Special handling for text-white. 
    # If text-white is used inside a class string but the element is not a button (i.e. no bg-emerald etc), 
    # it's tricky. But a safe bet is to replace text-white with text-slate-900 ONLY if the same class string 
    # also contains bg-white or bg-slate-50 (which were just replaced from 900/950).
    # But it's easier to just do it via regex on className attributes.
    def replace_white_text(match):
        cls_str = match.group(0)
        # if the class string has a dark button background, keep text-white
        if 'bg-emerald' in cls_str or 'bg-blue' in cls_str or 'bg-red' in cls_str or 'bg-amber' in cls_str:
            return cls_str
        # Otherwise, replace text-white with text-slate-900
        return re.sub(r'\btext-white\b', 'text-slate-900', cls_str)

    new_content = re.sub(r'className=["\']([^"\']+)["\']', replace_white_text, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def main():
    src_dir = os.path.join(os.getcwd(), 'src')
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.jsx', '.ts', '.js', '.css')):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
