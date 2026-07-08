import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  alt?: string;
}

const gitPullRequest = new URL('../../assets/git_icons/git-pull-request-svgrepo-com.svg', import.meta.url).href;
const gitMerge = new URL('../../assets/git_icons/git-merge-svgrepo-com.svg', import.meta.url).href;
const gitFork = new URL('../../assets/git_icons/git-fork-svgrepo-com.svg', import.meta.url).href;
const gitBranch = new URL('../../assets/git_icons/git-branch-svgrepo-com.svg', import.meta.url).href;
const gitCommit = new URL('../../assets/git_icons/git-commit-svgrepo-com.svg', import.meta.url).href;
const gitDiff = new URL('../../assets/git_icons/git-diff-svgrepo-com.svg', import.meta.url).href;

function useIconStyle(size: number | undefined, incomingStyle?: React.CSSProperties) {
  const { settings } = useTheme();
  const isDark = settings.uiTheme === 'dark';

  // In dark mode, svgrepo icons are dark — apply a filter to make them visible
  const darkFilter = 'invert(100%) brightness(1.05)';

  return {
    width: size,
    height: size,
    ...(incomingStyle || {}),
    filter: isDark ? `${darkFilter} ${incomingStyle?.filter || ''}`.trim() : incomingStyle?.filter || undefined,
  } as React.CSSProperties;
}

export const GitPullRequest: React.FC<IconProps> = ({ size = 16, alt = 'pull request', style, ...rest }) => {
  const s = useIconStyle(size, style);
  return <img src={gitPullRequest} alt={alt} width={size} height={size} style={s} {...rest} />;
};

export const GitMerge: React.FC<IconProps> = ({ size = 16, alt = 'merge', style, ...rest }) => {
  const s = useIconStyle(size, style);
  return <img src={gitMerge} alt={alt} width={size} height={size} style={s} {...rest} />;
};

export const GitFork: React.FC<IconProps> = ({ size = 16, alt = 'fork', style, ...rest }) => {
  const s = useIconStyle(size, style);
  return <img src={gitFork} alt={alt} width={size} height={size} style={s} {...rest} />;
};

export const GitBranchIcon: React.FC<IconProps> = ({ size = 16, alt = 'branch', style, ...rest }) => {
  const s = useIconStyle(size, style);
  return <img src={gitBranch} alt={alt} width={size} height={size} style={s} {...rest} />;
};

export const GitCommit: React.FC<IconProps> = ({ size = 14, alt = 'commit', style, ...rest }) => {
  const s = useIconStyle(size, style);
  return <img src={gitCommit} alt={alt} width={size} height={size} style={s} {...rest} />;
};

export const GitDiff: React.FC<IconProps> = ({ size = 12, alt = 'diff', style, ...rest }) => {
  const s = useIconStyle(size, style);
  return <img src={gitDiff} alt={alt} width={size} height={size} style={s} {...rest} />;
};

export default GitCommit;
