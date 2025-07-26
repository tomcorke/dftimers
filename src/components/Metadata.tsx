import metadata from '../data/build-metadata.json';

export const Metadata = () => (
  <div className="metadata">
    <div className="git-sha" style={{ color: `#${metadata.commitSha.slice(0, 6)}` }}>{metadata.commitSha.slice(0, 6)}</div>
    <div className="git-date">{metadata.commitDate}</div>
  </div>
);
