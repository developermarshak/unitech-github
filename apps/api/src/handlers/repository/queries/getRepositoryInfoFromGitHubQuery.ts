import { inject, injectable } from "tsyringe";
import {
  GitHubService,
  GitHubRepositoryInfo,
} from "../../../services/githubService.js";

@injectable()
export class GetRepositoryInfoFromGitHubQuery {
  constructor(
    @inject("GitHubService") private readonly githubService: GitHubService,
  ) {}

  async execute(projectPath: string): Promise<GitHubRepositoryInfo> {
    return this.githubService.getRepositoryInfo(projectPath);
  }
}
