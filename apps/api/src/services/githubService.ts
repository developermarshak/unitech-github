import { injectable } from 'tsyringe';
import { Octokit } from '@octokit/rest';
import { InvalidProjectPathError } from '../errors/InvalidProjectPathError';

export interface GitHubRepositoryInfo {
  projectPath: string;
  stars: number | null;
  forks: number | null;
  issues: number | null;
  notExist: boolean | null;
}

@injectable()
export class GitHubService {
  private readonly octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN || null;
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async getRepositoryInfo(projectPath: string): Promise<GitHubRepositoryInfo> {
    try {
      const [owner, repo] = projectPath.split('/');
      
      if (!owner || !repo) {
        throw new InvalidProjectPathError('Invalid project path');
      }

      const { data } = await this.octokit.repos.get({
        owner,
        repo
      });

      return {
        projectPath,
        stars: data.stargazers_count || null,
        forks: data.forks_count || null,
        issues: data.open_issues_count || null,
        notExist: false
      };
    } catch (error: any) {      
      if (error.status === 404) {
        return {
          projectPath,
          stars: null,
          forks: null,
          issues: null,
          notExist: true
        };
      }
      
      throw error;
    }
  }
} 