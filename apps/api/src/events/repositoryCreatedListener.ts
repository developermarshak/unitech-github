import { inject, injectable } from 'tsyringe';

import { EventBus } from './eventBus.js';
import { UpdateRepositoryCommand } from '../handlers/repository/commands/updateRepositoryCommand.js';
import { GetRepositoryInfoFromGitHubQuery } from '../handlers/repository/queries/getRepositoryInfoFromGitHubQuery.js';

interface RepositoryCreatedPayload {
  id: string;
  userId: string;
  projectPath: string;
}

/**
 * Listens to the `repository.created` event and enriches our local copy of the
 * repository with data fetched from GitHub. All heavy lifting is done
 * asynchronously so that the HTTP request that triggered creation is not
 * blocked.
 */
@injectable()
export class RepositoryCreatedListener {
  constructor(
    @inject('EventBus') private readonly eventBus: EventBus,

    @inject('UpdateRepositoryCommand') private readonly updateRepositoryCommand: UpdateRepositoryCommand,
    @inject('GetRepositoryInfoFromGitHubQuery') private readonly getRepositoryInfoFromGitHubQuery: GetRepositoryInfoFromGitHubQuery,
  ) {

    this.eventBus.on('repository.created', (payload: RepositoryCreatedPayload) => {
      // Fire and forget – we purposefully do not await here to avoid blocking
      // the event loop of the HTTP request that emitted this event.
      void this.handle(payload);
    });
  }

  private async handle(payload: RepositoryCreatedPayload): Promise<void> {
    try {
      const repoInfo = await this.getRepositoryInfoFromGitHubQuery.execute(payload.projectPath);

      await this.updateRepositoryCommand.execute({
        id: payload.id,
        userId: payload.userId,
        repoInfo: repoInfo,
      });

      console.log(`RepositoryCreatedListener: enriched repository ${payload.projectPath}`);
    } catch (error) {
      console.error('RepositoryCreatedListener failed to process event', error);
    }
  }
}
