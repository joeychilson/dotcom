import { getPostList } from '$lib/posts';
import type { PageLoad } from './$types';

export const load = (async () => {
	const posts = await getPostList();
	return {
		posts
	};
}) satisfies PageLoad;
