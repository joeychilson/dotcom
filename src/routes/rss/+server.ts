import type { RequestHandler } from './$types';
import { getPostList } from '$lib/posts';
import RSS from 'rss';

export const GET: RequestHandler = async () => {
	const posts = await getPostList();

	const feed = new RSS({
		title: 'Joey Chilson',
		description: 'The personal website of Joey Chilson',
		site_url: 'https://joeychilson.com',
		feed_url: `https://joeychilson.com/rss`
	});

	for (const doc of posts) {
		feed.item({
			title: doc.title ?? '-',
			url: `https://joeychilson.com/posts/${doc.slug}`,
			date: doc.date,
			description: doc.description
		});
	}

	const feedString = feed.xml({ indent: true });

	return new Response(feedString, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
