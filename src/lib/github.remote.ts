import { query } from '$app/server';
import { env } from '$env/dynamic/private';

interface GitHubRepoResponse {
	name: string;
	description: string | null;
	html_url: string;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	updated_at: string;
	created_at: string;
	homepage: string | null;
	topics: string[];
}

export interface GitHubRepo {
	name: string;
	description: string | null;
	html_url: string;
	language: string | null;
	stars: number;
	forks: number;
	updated_at: string;
}

const CACHE_TTL = 5 * 60 * 1000;

interface CacheEntry {
	data: GitHubRepo[];
	timestamp: number;
}

let reposCache: CacheEntry | null = null;

export const getGitHubRepos = query(async () => {
	const now = Date.now();

	if (reposCache && now - reposCache.timestamp < CACHE_TTL) {
		return reposCache.data;
	}

	const username = 'joeychilson';
	const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

	try {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'Personal-Website',
				...(env.GITHUB_TOKEN && {
					Authorization: `Bearer ${env.GITHUB_TOKEN}`
				})
			}
		});

		if (response.status === 403 || response.status === 429) {
			if (reposCache) {
				console.warn('GitHub API rate limited, using cached data');
				return reposCache.data;
			}
			throw new Error('GitHub API rate limit exceeded');
		}

		if (!response.ok) {
			throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
		}

		const repos: GitHubRepoResponse[] = await response.json();

		const filteredRepos: GitHubRepo[] = repos
			.filter((repo) => !repo.name.startsWith('.'))
			.sort((a, b) => b.stargazers_count - a.stargazers_count)
			.map(
				({ name, description, html_url, language, stargazers_count, forks_count, updated_at }) => ({
					name,
					description,
					html_url,
					language,
					stars: stargazers_count,
					forks: forks_count,
					updated_at
				})
			);

		reposCache = {
			data: filteredRepos,
			timestamp: now
		};

		return filteredRepos;
	} catch (error) {
		console.error('Error fetching GitHub repos:', error);

		if (reposCache) {
			console.warn('Using cached data due to error');
			return reposCache.data;
		}

		throw new Error(
			`Failed to fetch GitHub repositories: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
});
