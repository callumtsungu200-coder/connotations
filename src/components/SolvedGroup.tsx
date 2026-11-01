import type { Group } from '../game/types';

interface Props {
  group: Group;
  animate?: boolean;
  revealed?: boolean;
}

export function SolvedGroup({ group, animate, revealed }: Props) {
  return (
    <div
      className={`solved level-${group.level}${animate ? ' pop' : ''}${revealed ? ' revealed' : ''}`}
      role="group"
      aria-label={`${group.category}: ${group.words.join(', ')}`}
    >
      <strong className="solved-category">{group.category}</strong>
      <span className="solved-words">{group.words.join(', ')}</span>
    </div>
  );
}
