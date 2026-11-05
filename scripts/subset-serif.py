"""제목용 명조 글꼴(본명조 계열, Noto Serif CJK KR SemiBold)의 웹용 부분 글꼴을 만듭니다.

홈페이지 빌드에는 필요 없고, 제목 문구가 크게 바뀌었을 때만 다시 실행하면 됩니다.
다시 실행하지 않아도 새 글자는 확장 글꼴(ext)에서 그대로 표시됩니다.

  pip install fonttools brotli
  python3 scripts/subset-serif.py <NotoSerifCJK-SemiBold.ttc 또는 NotoSerifKR-SemiBold.otf 경로>

결과
  assets/fonts/serif/serif-core.woff2  지금 제목에 쓰인 글자 (작고 빠름)
  assets/fonts/serif/serif-ext.woff2   그 밖의 상용 한글 2,350자 (필요할 때만 내려받음)
  assets/fonts/serif/serif.css         두 파일을 unicode-range로 나눠 연결
"""
import html
import os
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTCollection, TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'fonts' / 'serif'
FAMILY = 'Anlaw Serif'
# 제목 글꼴을 쓰는 요소: h1·h2·h3와 아래 클래스
SERIF_CLASSES = ('footer-wordmark', 'serif-num')
BASIC = {chr(c) for c in range(0x20, 0x7F)} | set('·…“”‘’—–「」『』《》〈〉※↗→%')


def load_source(path):
    if path.lower().endswith(('.ttc', '.otc')):
        for face in TTCollection(path).fonts:
            if ' KR' in face['name'].getDebugName(4):
                return face
        raise SystemExit('KR 글꼴을 찾지 못했습니다: ' + path)
    return TTFont(path)


def heading_chars():
    chars = set()
    pattern = re.compile(r'<(h[123])[^>]*>(.*?)</\1>|<[^>]+class="[^"]*(?:%s)[^"]*"[^>]*>(.*?)</' % '|'.join(SERIF_CLASSES), re.S)
    for page in ROOT.glob('*.html'):
        for match in pattern.finditer(page.read_text(encoding='utf-8')):
            text = match.group(2) if match.group(2) is not None else match.group(3)
            chars |= set(html.unescape(re.sub(r'<[^>]+>', '', text)))
    return {c for c in chars if not c.isspace()}


def ranges(codepoints):
    points = sorted(codepoints)
    out, start, prev = [], None, None
    for cp in points:
        if start is None:
            start = prev = cp
        elif cp == prev + 1:
            prev = cp
        else:
            out.append((start, prev))
            start = prev = cp
    if start is not None:
        out.append((start, prev))
    return ', '.join(f'U+{a:X}' if a == b else f'U+{a:X}-{b:X}' for a, b in out)


def write_subset(source_path, chars, target):
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['kern', 'palt', 'locl']
    options.name_IDs = ['*']
    options.notdef_outline = True
    options.hinting = False
    font = load_source(source_path)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=''.join(sorted(chars)))
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(str(target))
    covered = {cp for cp in font.getBestCmap()}
    return covered


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    source = sys.argv[1]
    OUT.mkdir(parents=True, exist_ok=True)
    common = {chr(cp) for cp in range(0xAC00, 0xD7A4) if len(chr(cp).encode('euc-kr', errors='ignore')) == 2}
    core_chars = heading_chars() | BASIC
    core = write_subset(source, core_chars, OUT / 'serif-core.woff2')
    ext_chars = (common | {c for c in core_chars if ord(c) not in core}) - {chr(cp) for cp in core}
    ext = write_subset(source, ext_chars, OUT / 'serif-ext.woff2') - core
    css = [
        '/* 제목용 명조: Noto Serif CJK KR SemiBold 부분 글꼴. © Adobe, SIL Open Font License 1.1 (../OFL.txt).',
        '   scripts/subset-serif.py로 생성합니다. core는 현재 제목 글자, ext는 그 밖의 상용 한글입니다. */',
    ]
    for name, cps in (('serif-core.woff2', core), ('serif-ext.woff2', ext)):
        css.append('@font-face{font-family:"%s";font-style:normal;font-weight:500 800;font-display:swap;'
                   'src:url(./%s) format("woff2");unicode-range:%s}' % (FAMILY, name, ranges(cps)))
    (OUT / 'serif.css').write_text('\n'.join(css) + '\n', encoding='utf-8')
    for name in ('serif-core.woff2', 'serif-ext.woff2'):
        print(f'{name}: {os.path.getsize(OUT / name):,} bytes')
    print(f'core glyphs {len(core):,} · ext glyphs {len(ext):,}')


if __name__ == '__main__':
    main()
