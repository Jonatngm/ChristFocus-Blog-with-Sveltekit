<script lang="ts">
	import type { Post } from '$lib/types';
	import { Calendar, BookOpen, Eye } from 'lucide-svelte';

	export let post: Post;

	const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function formatCount(count: number | null | undefined): string {
		if (!count) return '0';
		if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
		return count.toString();
	}
</script>

<a href="/post/{post.id}" class="block h-full group">
	<div class="h-full transition-all duration-500 border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-primary group-hover:shadow-2xl group-hover:-translate-y-2">
		{#if post.cover_image}
			<div class="w-full h-56 overflow-hidden bg-gray-100">
				<img
					src={post.cover_image}
					alt={post.title}
					class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
				/>
			</div>
		{/if}
		
		<div class="p-7">
			{#if post.series}
				<div class="flex items-center gap-2 text-sm text-primary font-bold mb-3 bg-primary/10 px-3 py-1.5 rounded-full inline-flex">
					<BookOpen class="w-4 h-4" />
					<span>{post.series.title}</span>
					{#if post.series_order}
						<span class="text-gray-600">• Part {post.series_order}</span>
					{/if}
				</div>
			{/if}

			<div class="flex items-start justify-between mb-4">
				<h3 class="text-2xl font-extrabold text-foreground leading-tight line-clamp-2 tracking-tight group-hover:text-primary transition-colors duration-300">
					{post.title}
				</h3>

				{#if typeof post.views !== 'undefined'}
					<div class="ml-4 flex-shrink-0">
						<div class="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-gold-dark/20 text-foreground px-3 py-1.5 rounded-full border border-primary/30 shadow-sm">
							<Eye class="w-4 h-4" />
							<span class="text-sm font-bold">{formatCount(post.views)}</span>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-2 text-sm text-gray-500 mb-5">
				<Calendar class="w-4 h-4" />
				<span class="font-medium">{formattedDate}</span>
			</div>

			<p class="text-gray-600 line-clamp-3 leading-relaxed mb-6 text-base">
				{post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
			</p>
			
			<div class="flex flex-wrap gap-2">
				{#if post.categories}
					{#each post.categories as category}
						<span class="px-3 py-1.5 bg-gradient-to-r from-primary to-gold-dark text-black rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
							{category.name}
						</span>
					{/each}
				{/if}
				{#if post.tags}
					{#each post.tags as tag}
						<span class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200 hover:bg-gray-200 transition-colors">
							{tag.name}
						</span>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</a>
