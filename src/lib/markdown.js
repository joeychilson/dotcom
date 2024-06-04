import { unified } from 'unified';
import toMarkdownAST from 'remark-parse';
import toHtmlAST from 'remark-rehype';
import toHtmlString from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import matter from 'gray-matter';

/**
 * @param {import("vfile").Compatible | undefined} content
 */
async function parseMarkdown(content) {
	const processor = await unified()
		.use(toMarkdownAST)
		.use([remarkGfm, remarkSmartypants])
		.use(toHtmlAST, { allowDangerousHtml: true })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behavior: 'wrap' })
		.use(rehypeShiki, {
			themes: { light: 'light-plus', dark: 'dark-plus' }
		})
		.use(toHtmlString, { allowDangerousHtml: true })
		.process(content);
	return processor.toString();
}

/**
 * @param {string} content
 */
function escapeHtml(content) {
	content = content.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

	const componentRegex = /<[A-Z].*/g;
	const components = content.match(componentRegex);
	components?.forEach((component) => {
		const replaced = component.replace('&#123;', '{').replace('&#125;', '}');
		content = content.replace(component, replaced);
	});
	return content;
}

/**
 * @param {string} content
 */
function frontmatter(content) {
	const { content: markdown, data } = matter(content);
	const meta = `
		<script context="module">
			export const metadata = ${JSON.stringify(data)}
		</script>
	`;
	return { markdown, meta };
}

function markdown() {
	return {
		name: 'markdown',
		/**
		 * @param {Object} params
		 * @param {string} params.content
		 * @param {string} params.filename
		 */
		async markup({ content, filename }) {
			if (filename.endsWith('.md')) {
				const { markdown, meta } = frontmatter(content);
				const html = await parseMarkdown(markdown);
				const code = escapeHtml(html);
				return { code: meta + code };
			}
		}
	};
}

export default markdown;
