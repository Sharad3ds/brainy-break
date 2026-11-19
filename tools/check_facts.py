#!/usr/bin/env python3
"""Sanity checks for facts_sea data: unique quiz options, no double quotes in spoken text, balanced fields."""
import sys, os, glob, importlib.util
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); bad = 0
for fn in sorted(glob.glob(ROOT + '/' + __import__('os').environ.get('FACTS_DIR', 'tools/facts_sea') + '/*.py')):
    spec = importlib.util.spec_from_file_location('m', fn); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    for f in m.FACTS:
        def err(msg):
            global bad; bad += 1; print(f"{f['slug']}: {msg}")
        if len(f['sc']) != 4: err('need 4 content scenes')
        for who, t, v in f['sc']:
            if '"' in t or '&' in t or '<' in t: err('bad char in spoken text: ' + t[:30])
            if len(t.split()) > 40: err('scene text long: ' + t[:30])
        if '"' in f['intro'] or '"' in f['recap']: err('quote in intro/recap')
        if len(f['quiz']) != 4: err('need 4 quiz')
        for q in f['quiz']:
            if len(set(q[1:5])) != 4: err('duplicate quiz options: ' + q[0])
        if len(f['why']) != 3 or len(f['stats']) != 4 or len(f['more']) != 3: err('why/stats/more counts')
        if not f['src']: err('no sources')
print('facts problems:', bad); sys.exit(1 if bad else 0)
