export interface Post {
	title: string;
	description: string;
	date: string;
	slug: string;
}

export async function getPostList(): Promise<Post[]> {
	const postFiles = import.meta.glob('../../posts/*.md');
	const posts = await Promise.all(
		Object.entries(postFiles).map(async ([path, resolver]) => {
			const { metadata } = (await resolver()) as {
				metadata: { title: string; description: string; date: string };
			};
			const fileName = (path.split('/').pop() ?? '').replace('.md', '');
			return {
				title: metadata.title,
				description: metadata.description,
				date: metadata.date,
				slug: fileName
			};
		})
	);
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatDate(date: string, includeRelative = false) {
	let currentDate = new Date();
	if (!date.includes('T')) {
		date = `${date}T00:00:00`;
	}
	let targetDate = new Date(date);

	let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
	let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
	let daysAgo = currentDate.getDate() - targetDate.getDate();

	let formattedDate = '';

	if (yearsAgo > 0) {
		formattedDate = `${yearsAgo}y ago`;
	} else if (monthsAgo > 0) {
		formattedDate = `${monthsAgo}mo ago`;
	} else if (daysAgo > 0) {
		formattedDate = `${daysAgo}d ago`;
	} else {
		formattedDate = 'Today';
	}

	let fullDate = targetDate.toLocaleString('en-us', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	if (!includeRelative) {
		return fullDate;
	}

	return `${fullDate} (${formattedDate})`;
}
