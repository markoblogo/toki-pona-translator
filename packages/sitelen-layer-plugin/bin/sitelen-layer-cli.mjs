#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const HELP = `sitelen-layer-cli

Usage:
  sitelen-layer-cli scan [options] <html-file> [html-file...]
  sitelen-layer-cli emoji-candidates [options] <html-file> [html-file...]

Options:
  -h, --help                  show this help
  -t, --threshold <num>        detector threshold (default: 0.7)
  -m, --strategy <simple|weighted>  detector strategy (default: weighted)
  -p, --profile <default|extended>  lexicon profile
  -n, --min-tokens <num>      minimum signal tokens (default: 8)
  -l, --limit <num>           top candidates to show for emoji-candidates (default: 20)
  --json                       print JSON array result
`;

function parseOptions(argv) {
  const args = [...argv];
  const options = {
    threshold: 0.7,
    strategy: 'weighted',
    profile: 'default',
    minTokens: 8,
    limit: 20,
    json: false
  };

  const positional = [];

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '-t' || arg === '--threshold') {
      options.threshold = Number(args.shift());
      continue;
    }
    if (arg === '-m' || arg === '--strategy') {
      const next = args.shift();
      if (next === 'simple' || next === 'weighted') {
        options.strategy = next;
      }
      continue;
    }
    if (arg === '-p' || arg === '--profile') {
      const next = args.shift();
      if (next === 'extended' || next === 'default') {
        options.profile = next;
      }
      continue;
    }
    if (arg === '-n' || arg === '--min-tokens') {
      options.minTokens = Number(args.shift());
      continue;
    }
    if (arg === '-l' || arg === '--limit') {
      options.limit = Number(args.shift());
      continue;
    }

    if (arg?.startsWith('-')) {
      throw new Error(`unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  return { options, positional };
}

async function readFiles(paths) {
  return Promise.all(
    paths.map(async (path) => ({
      path,
      html: await readFile(path, 'utf8')
    }))
  );
}

async function loadRuntimeHelpers() {
  try {
    return await import('../dist/cli.js');
  } catch {
    throw new Error('dist/cli.js is not built yet. Run `npm run build` before using the CLI.');
  }
}

function toResultShape(result, file, strategy, profile, minTokens, threshold) {
  return {
    file,
    score: result.score,
    pass: result.pass,
    totalTokens: result.totalTokens,
    recognizedTokens: result.recognizedTokens,
    confidence: result.confidence,
    detectionVersion: result.detectorVersion,
    detectionStrategy: strategy,
    lexiconProfile: profile,
    minTokens,
    threshold,
    recommendations: result.recommendations,
    warnings: result.warnings
  };
}

async function runScan(parsed) {
  const { options, positional } = parsed;
  const files = positional;
  const records = [];
  const runtime = await loadRuntimeHelpers();

  for (const item of await readFiles(files)) {
    const res = runtime.scanHtmlForLayerEligibility(item.path, item.html, {
      threshold: options.threshold,
      strategy: options.strategy,
      lexiconProfile: options.profile,
      minTokens: options.minTokens
    });

    records.push(toResultShape(res, item.path, options.strategy, options.profile, options.minTokens, options.threshold));
  }

  if (options.json) {
    console.log(JSON.stringify(records, null, 2));
    return;
  }

  records.forEach((item) => {
    const recommendation = item.recommendations.join(' | ');
    const status = item.pass ? 'PASS' : 'WARN';
    const warnings = item.warnings.length ? ` (${item.warnings.join('; ')})` : '';
    console.log(`${item.file}\n  status: ${status}\n  score: ${item.score.toFixed(2)}\n  recognized: ${item.recognizedTokens}/${item.totalTokens}\n  confidence: ${Math.round(item.confidence * 100)}%\n  layers: ${recommendation}${warnings}\n`);
  });
}

async function runEmojiCandidates(parsed) {
  const { options, positional } = parsed;
  const rows = [];
  const runtime = await loadRuntimeHelpers();

  for (const item of await readFiles(positional)) {
    const candidates = runtime.topUnmappedEmojiFromText(item.html, options.limit);
    rows.push({
      file: item.path,
      candidates
    });
  }

  if (options.json) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  rows.forEach((entry) => {
    console.log(`${entry.file}`);
    if (entry.candidates.length === 0) {
      console.log('  no unmapped tokens found');
      return;
    }

    entry.candidates.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.token} (${item.count})`);
    });
  });
}

async function main() {
  const argv = process.argv.slice(2);
  const parsed = parseOptions(argv);

  if (parsed.options.help || argv.length === 0) {
    console.log(HELP);
    return;
  }

  const command = parsed.positional.shift();
  if (!command || !['scan', 'emoji-candidates'].includes(command)) {
    console.log(HELP);
    process.exitCode = 1;
    return;
  }

  if (parsed.positional.length === 0) {
    console.log(`error: command ${command} requires at least one html file`);
    process.exitCode = 1;
    return;
  }

  if (command === 'scan') {
    await runScan(parsed);
  } else {
    await runEmojiCandidates(parsed);
  }
}

main().catch((error) => {
  console.error(`[sitelen-layer-cli] ${error?.message ?? error}`);
  process.exitCode = 1;
});
