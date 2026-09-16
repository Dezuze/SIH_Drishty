import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace `text-white` globally EXCEPT when it is in the same class string as a colored background.
    # Since class strings can be split across lines in template literals, we can just look for `text-white`.
    
    # Let's find all occurrences of className attribute (both "", '', and {``})
    # This regex matches className="...", className='...', and className={`...`}
    # It handles nested quotes poorly, but for React classes it usually works.
    
    def class_replacer(match):
        full_attr = match.group(0)
        prefix = match.group(1) # className=
        quote = match.group(2) # ", ', or {`
        cls_str = match.group(3)
        suffix = match.group(4) # ", ', or `}
        
        # Determine if this class string contains a dark primary background
        has_dark_bg = bool(re.search(r'\bbg-(emerald|blue|red|amber|orange|green|indigo|violet|purple|rose|teal|cyan|sky)-(500|600|700|800|900)\b', cls_str))
        
        # If it doesn't have a dark background, text-white should become text-slate-900
        if not has_dark_bg:
            cls_str = re.sub(r'\btext-white\b', 'text-slate-900', cls_str)
            cls_str = re.sub(r'\btext-slate-100\b', 'text-slate-900', cls_str)
            cls_str = re.sub(r'\btext-slate-200\b', 'text-slate-800', cls_str)
            
        return f"{prefix}{quote}{cls_str}{suffix}"
        
    new_content = re.sub(r'(className=)(["\'`]|{\`)(.*?)(["\'`]|`})', class_replacer, content, flags=re.DOTALL)
    
    # Also replace global CSS variable if it's there
    new_content = re.sub(r'--background: #F8FAFC;', '--background: #FFFFFF;', new_content)
    new_content = re.sub(r'--background: #0F172A;', '--background: #F8FAFC;', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated text-white: {filepath}")

def main():
    src_dir = os.path.join(os.getcwd(), 'src')
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.jsx', '.ts', '.js')):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
