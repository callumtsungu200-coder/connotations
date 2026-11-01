const LEGEND = [
  ['level-0', 'Straightforward'],
  ['level-1', ''],
  ['level-2', ''],
  ['level-3', 'Tricky'],
] as const;

export function HelpContent() {
  return (
    <div className="help">
      <p className="lead">Find groups of four words that share something in common.</p>
      <ul>
        <li>Select four words and tap <strong>Submit</strong> to check your guess.</li>
        <li>Find all four groups without making four mistakes.</li>
        <li>
          “One away…” means three of your four words belong together.
        </li>
        <li>Categories are more specific than “5-letter words” or “nouns”.</li>
        <li>Watch out for red herrings — some words seem to fit more than one group.</li>
      </ul>
      <h3 className="section-title">Example</h3>
      <p>
        <strong>Shades of blue:</strong> NAVY, TEAL, COBALT, AZURE
      </p>
      <p>
        <strong>___ cone:</strong> PINE, TRAFFIC, NOSE, WAFFLE
      </p>
      <h3 className="section-title">Difficulty</h3>
      <div className="legend" aria-label="Group colours from easiest to hardest">
        {LEGEND.map(([cls, label]) => (
          <div key={cls} className="legend-item">
            <span className={`legend-swatch ${cls}`} />
            {label && <span className="muted">{label}</span>}
          </div>
        ))}
      </div>
      <p className="muted small-print">
        Every finished game deals a fresh puzzle. Your statistics are saved in this browser only.
      </p>
    </div>
  );
}
